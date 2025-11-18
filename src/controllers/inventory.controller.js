import {
  getAllItems,
  getItemById,
  getLevel,
  adjustStock as svcAdjustStock,
} from '../inventory.service.js';

function badRequest(res, msg) {
  return res.status(400).json({ error: msg });
}

function notFound(res, msg) {
  return res.status(404).json({ error: msg });
}

// Simple health check
export const health = (req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || 'dev' });
};

//  list all items 
export const listItems = async (req, res) => {
  try {
    const items = await getAllItems();
    return res.json(items);
  } catch (err) {
    console.error('listItems error:', err);
    return res.status(500).json({ error: 'failed to load items from database' });
  }
};

// For now, Inventory is read-only: creating items is handled by DB/other services.
export const createItem = (req, res) => {
  return res.status(501).json({
    error: 'createItem is not supported here; items are managed by the Database service',
  });
};

// Fetch item by id (read-only)
export const readItem = async (req, res) => {
  const id = req.params.id;
  try {
    const item = await getItemById(id);
    if (!item) return notFound(res, 'item not found');
    return res.json(item);
  } catch (err) {
    console.error('readItem error:', err);
    return res.status(500).json({ error: 'failed to load item from database' });
  }
};

// For now, Inventory does not delete items directly.
export const removeItem = (req, res) => {
  return res.status(501).json({
    error: 'removeItem is not supported here; items are managed by the Database service',
  });
};

// Adjust stock for an item – documented but not wired yet
export const adjust = async (req, res) => {
  const { itemId, delta, reason, refId } = req.body || {};

  if (!itemId || typeof delta !== 'number') {
    return badRequest(res, 'itemId and numeric delta are required');
  }

  try {
    const item = await getItemById(itemId);
    if (!item) return notFound(res, 'item not found');

    const result = await svcAdjustStock({ itemId, delta, reason, refId });
    // Currently svcAdjustStock will throw "not implemented" until wired.
    return res.json(result);
  } catch (err) {
    console.error('adjust error:', err);
    return res.status(501).json({
      error: err.message || 'stock adjustment not implemented yet',
    });
  }
};

// Get current stock level for an item
export const level = async (req, res) => {
  const id = req.params.id;
  try {
    const current = await getLevel(id);
    if (current === null) return notFound(res, 'item not found');
    return res.json({ itemId: id, level: current });
  } catch (err) {
    console.error('level error:', err);
    return res.status(500).json({ error: 'failed to load stock level from database' });
  }
};
