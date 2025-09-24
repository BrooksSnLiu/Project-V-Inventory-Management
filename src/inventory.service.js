const items = new Map();    // id -> { id, sku, name, reorderPoint }
const stock = new Map();    // id -> current numeric level
const seenRefs = new Set(); // idempotency keys for stock adjustments

// Create or overwrite an item
export function addItem({ id, sku, name, reorderPoint = 0 }) {
  const item = { id, sku, name, reorderPoint };
  items.set(id, item);
  if (!stock.has(id)) stock.set(id, 0);
  return item;
}

// Read an item (undefined if missing)
export function getItem(id) {
  return items.get(id);
}

// Delete an item + its stock. Returns true if it existed.
export function deleteItem(id) {
  if (!items.has(id)) return false;
  items.delete(id);
  stock.delete(id);
  return true;
}

// Adjust stock by delta (int). Returns { duplicate, level, reason }.
export function adjustStock({ itemId, delta, reason, refId }) {
  // idempotency: same refId → ignore duplicate
  if (seenRefs.has(refId)) {
    return { duplicate: true, level: stock.get(itemId) ?? 0 };
  }
  seenRefs.add(refId);

  const newLevel = (stock.get(itemId) ?? 0) + delta;
  stock.set(itemId, newLevel);
  return { duplicate: false, level: newLevel, reason };
}

// Current stock level for an item (0 if not set)
export function getLevel(id) {
  return stock.get(id) ?? 0;
}

// Testing helper to reset in-memory state between tests
export function resetForTests() {
  items.clear();
  stock.clear();
  seenRefs.clear();
}
