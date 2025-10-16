import {
  addItem,
  getItem,
  deleteItem as svcDeleteItem,
  adjustStock as svcAdjustStock,
  getLevel,
  isSellable,
  getLowStock,
} from '../inventory.service.js';
import { ping } from '../database/index.js';

// helpers for consistent 4xx responses
function badRequest(res, msg) { return res.status(400).json({ error: msg }); }
function notFound(res, msg)   { return res.status(404).json({ error: msg }); }

// health check
export const health = async (req, res) => {
  const dbOk = await ping();
  res.json({ ok: true, db: dbOk ? 'connected' : 'disconnected' });
};

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
    return res.json({
      message: 'duplicate ignored',
      level: result.level,
      belowReorderPoint: result.belowReorderPoint,
      sellable: result.sellable,
    });
  }
  return res.json({
    message: 'adjusted',
    reason: result.reason,
    level: result.level,
    belowReorderPoint: result.belowReorderPoint,
    sellable: result.sellable,
  });
};

// get current stock level for an item
export const level = (req, res) => {
  const id = req.params.id;
  if (!getItem(id)) return notFound(res, 'item not found');
  return res.json({ itemId: id, level: getLevel(id), sellable: isSellable(id) });
};

// list low-stock items
export const lowStock = (_req, res) => {
  return res.json(getLowStock());
};
