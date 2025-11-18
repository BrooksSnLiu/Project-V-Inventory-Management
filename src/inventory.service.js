// Base URL for the Database team's API.
// Set this in our environment later: DB_API_BASE="http://their-service-url"
const DB_API_BASE = process.env.DB_API_BASE || 'http://TODO-DB-URL';

// Convert one DB item into our internal shape:
// { id, sku, name, quantity, reorderPoint }
function mapDbItemToInventoryItem(dbItem) {
  if (!dbItem || typeof dbItem !== 'object') {
    throw new Error('Invalid DB item format');
  }

  const id =
    dbItem.id ??
    dbItem.itemId ??
    dbItem.item_id;

  const name =
    dbItem.name ??
    dbItem.itemName ??
    dbItem.item_name;

  const sku =
    dbItem.sku ??
    dbItem.code ??
    null;

  const quantityRaw =
    dbItem.quantity ??
    dbItem.qty ??
    dbItem.stock ??
    0;

  const reorderRaw =
    dbItem.reorderPoint ??
    dbItem.reorder_point ??
    dbItem.reorder ??
    0;

  if (!id || !name) {
    throw new Error('DB item missing required id or name field');
  }

  const quantity = Number(quantityRaw);
  const reorderPoint = Number(reorderRaw);

  return {
    id: String(id),
    sku: sku ? String(sku) : null,
    name: String(name),
    quantity: Number.isNaN(quantity) ? 0 : quantity,
    reorderPoint: Number.isNaN(reorderPoint) ? 0 : reorderPoint,
  };
}

// Fetch all inventory items from the DB API and map them.
async function fetchAllItemsFromDb() {
  if (!DB_API_BASE || DB_API_BASE.startsWith('http://TODO-DB-URL')) {
    throw new Error('DB API base URL not configured yet');
  }

  const url = `${DB_API_BASE}/inventory-items`; //needs update 
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`DB API error: ${res.status} ${res.statusText}`);
  }

  const raw = await res.json();

  if (!Array.isArray(raw)) {
    throw new Error('DB API did not return an array of items');
  }

  return raw.map(mapDbItemToInventoryItem);
}

// Public service functions

export async function getAllItems() {
  return fetchAllItemsFromDb();
}

export async function getItemById(id) {
  if (!id) throw new Error('id is required');
  const items = await fetchAllItemsFromDb();
  return items.find(item => item.id === String(id)) || null;
}

export async function getLevel(id) {
  const item = await getItemById(id);
  if (!item) return null;
  return item.quantity;
}

// Not wired yet: will call Transactions/DB when integration is ready.
export async function adjustStock({ itemId, delta, reason, refId }) {
  throw new Error(
    'adjustStock is not implemented yet; waiting for DB/Transactions integration'
  );
}

// Kept for test compatibility; nothing to reset because we are DB-driven.
export function resetForTests() {
  return;
}
