
const {
  DB_API_BASE,
  DB_API_USERNAME,
  DB_API_PASSWORD,
  INVENTORY_COLLECTION,
} = process.env;

function ensureDbEnv() {
  if (!DB_API_BASE || !DB_API_USERNAME || !DB_API_PASSWORD || !INVENTORY_COLLECTION) {
    throw new Error(
      'Database middleware configuration missing (DB_API_BASE, DB_API_USERNAME, DB_API_PASSWORD, INVENTORY_COLLECTION)'
    );
  }
}

async function login() {
  ensureDbEnv();

  const resp = await fetch(`${DB_API_BASE}/auth/login`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: '*/*',
    },
    body: JSON.stringify({
      username: DB_API_USERNAME,
      password: DB_API_PASSWORD,
    }),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`DB auth failed (${resp.status}): ${text.slice(0, 200)}`);
  }

  const data = await resp.json();
  if (!data || !data.token) {
    throw new Error('DB auth response missing token');
  }

  return data.token;
}

async function callDbApi(path, { method = 'GET', body } = {}) {
  ensureDbEnv();

  const token = await login();

  const resp = await fetch(`${DB_API_BASE}${path}`, {
    method,
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(
      `DB API ${method} ${path} failed (${resp.status}): ${text.slice(0, 200)}`
    );
  }

  return resp.json();
}

function mapDbItemToInventoryItem(doc) {
  if (!doc || typeof doc !== 'object') {
    throw new Error('Invalid DB item format');
  }

  const id =
    doc.itemId ??
    doc.id ??
    doc.item_id ??
    (doc._id ? String(doc._id) : null);

  const name =
    doc.name ??
    doc.itemName ??
    doc.item_name;

  const sku =
    doc.sku ??
    doc.code ??
    null;

  const quantityRaw =
    doc.quantity ??
    doc.qty ??
    doc.stock ??
    0;

  const reorderRaw =
    doc.reorderPoint ??
    doc.reorder_point ??
    doc.reorder ??
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

async function fetchAllItemsFromDb() {
  const body = {
    filter: {},
    projection: {},
    sort: { itemId: 1 },
    limit: 500,
    skip: 0,
  };

  const data = await callDbApi(
    `/api/collections/${INVENTORY_COLLECTION}/find`,
    { method: 'POST', body }
  );

  const docs = Array.isArray(data.documents) ? data.documents : [];
  return docs.map(mapDbItemToInventoryItem);
}

async function fetchItemByIdFromDb(itemId) {
  const body = {
    filter: { itemId },
    projection: {},
    sort: {},
    limit: 1,
    skip: 0,
  };

  const data = await callDbApi(
    `/api/collections/${INVENTORY_COLLECTION}/find`,
    { method: 'POST', body }
  );

  const docs = Array.isArray(data.documents) ? data.documents : [];
  return docs.length > 0 ? mapDbItemToInventoryItem(docs[0]) : null;
}

export async function getAllItems() {
  return fetchAllItemsFromDb();
}

export async function getItemById(id) {
  if (!id) {
    throw new Error('id is required');
  }
  return fetchItemByIdFromDb(String(id));
}

export async function getLevel(id) {
  const item = await getItemById(id);
  if (!item) return null;
  return item.quantity;
}
