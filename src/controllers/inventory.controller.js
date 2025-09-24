import {
  addItem,
  getItem,
  deleteItem as svcDeleteItem,
  adjustStock as svcAdjustStock,
  getLevel,
} from '../inventory.service.js';

// helpers for consistent 4xx responses
function badRequest(res, msg) { return res.status(400).json({ error: msg }); }
function notFound(res, msg)   { return res.status(404).json({ error: msg }); }

// health check
export const health = (req, res) =>
  res.json({ ok: true, env: process.env.NODE_ENV || 'dev' });

// create a new item
export const createItem = (req, res) => {
  const { id, sku, name, reorderPoint = 0 } = req.body || {};
  if (!id || !sku || !name) return badRequest(res, 'id, sku, name required');
  const item = addItem({ id, sku, name, reorderPoint });
  return res.status(201).json({ message: 'item added', item });
};

// fetch item by id
export const readItem = (req, res) => {
  const it = getItem(req.params.id);
  if (!it) return notFound(res, 'not found');
  return res.json(it);
};

// delete item by id
export const removeItem = (req, res) => {
  const ok = svcDeleteItem(req.params.id);
  if (!ok) return notFound(res, 'item not found');
  return res.json({ message: 'item deleted', id: req.params.id });
};

// adjust stock for an item
export const adjust = (req, res) => {
  const { itemId, delta, reason, refId } = req.body || {};
  if (!itemId || !Number.isInteger(delta) || !reason || !refId)
    return badRequest(res, 'itemId, delta(int), reason, refId required');

  if (!getItem(itemId)) return notFound(res, 'item not found');

  const result = svcAdjustStock({ itemId, delta, reason, refId });
  if (result.duplicate) {
    return res.json({ message: 'duplicate ignored', level: result.level });
  }
  return res.json({ message: 'adjusted', reason: result.reason, level: result.level });
};

// get current stock level for an item
export const level = (req, res) => {
  const id = req.params.id;
  if (!getItem(id)) return notFound(res, 'item not found');
  return res.json({ itemId: id, level: getLevel(id) });
};
