// test/unit/inventory.service.happy.test.js
import test from 'node:test';
import assert from 'node:assert/strict';

// We will set env and mock fetch *before* importing the service.
const originalFetch = global.fetch;


process.env.DB_API_BASE = 'http://db-middleware.local';
process.env.DB_API_USERNAME = 'test-user';
process.env.DB_API_PASSWORD = 'test-pass';
process.env.INVENTORY_COLLECTION = 'inventory_items';


global.fetch = async (url, options) => {
  const u = String(url);

  if (u.endsWith('/auth/login')) {
    return {
      ok: true,
      json: async () => ({
        ok: true,
        token: 'test-token',
        user: { username: 'test-user', email: 'test@example.com' },
      }),
      text: async () => '{"ok":true,"token":"test-token"}',
    };
  }

  if (u.includes('/api/collections/inventory_items/find')) {
    return {
      ok: true,
      json: async () => ({
        ok: true,
        documents: [
          {
            itemId: 'INV-001',
            name: 'Animatronic T-Rex',
            sku: 'ANIM-001',
            quantity: 10,
            reorderPoint: 3,
          },
          {
            itemId: 'INV-002',
            name: 'Classic Burger',
            sku: 'MENU-BURGER-CL',
            quantity: 25,
            reorderPoint: 10,
          },
        ],
      }),
      text: async () => '{"ok":true}',
    };
  }

  throw new Error(`Unexpected fetch call in test: ${u}`);
};

// Now import the service *after* mocking fetch and env
const {
  getAllItems,
  getItemById,
  getLevel,
} = await import('../../src/inventory.service.js');

// Restore original fetch after tests finish
test.after(() => {
  global.fetch = originalFetch;
});

test('getAllItems maps documents from DB into inventory items', async () => {
  const items = await getAllItems();
  assert.equal(items.length, 2);

  const first = items[0];
  assert.deepEqual(first, {
    id: 'INV-001',
    sku: 'ANIM-001',
    name: 'Animatronic T-Rex',
    quantity: 10,
    reorderPoint: 3,
  });
});

test('getItemById returns a single mapped item', async () => {
  const item = await getItemById('INV-002');
  assert.ok(item);
  assert.equal(item.id, 'INV-002');
  assert.equal(item.name, 'Classic Burger');
});

test('getLevel returns the quantity for an item', async () => {
  const level = await getLevel('INV-001');
  assert.equal(level, 10);
});
