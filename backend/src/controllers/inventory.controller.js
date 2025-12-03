
import {
  getAllItems,
  getItemById,
  getLevel,
} from '../inventory.service.js';

function notFound(res, msg) {
  return res.status(404).json({ error: msg });
}

export const health = (req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || 'dev' });
};

export const listItems = async (req, res) => {
  try {
    const items = await getAllItems();
    return res.json(items);
  } catch (err) {
    console.error('listItems error:', err);
    return res.status(500).json({ error: 'failed to load items from database' });
  }
};

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
