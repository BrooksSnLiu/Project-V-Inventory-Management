// test/unit/inventory.service.happy.test.js
import test from 'node:test';
import assert from 'node:assert/strict';

// Save original fetch so we can restore it later
const originalFetch = global.fetch;

// --- Configure environment for the test ---
process.env.DB_API_BASE = 'http://db-middleware.local';
process.env.DB_API_USERNAME = 'test-user';
process.env.DB_API_PASSWORD = 'test-pass';
process.env.INVENTORY_COLLECTION = 'inventory_items';

// --- Mock fetch for login + DB find ---
global.fetch = async (url, options) => {
  const u = String(url);

  // Mock login endpoint
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

  // Mock collection find endpoint
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

// Import the service *after* mocking env + fetch
const { getAllItems, getItemById, getLevel } =
  await import('../../src/inventory.service.js');

// Restore fetch after tests complete
test.after(() => {
  global.fetch = originalFetch;
});

// --- TESTS ---

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

test('getItemById returns the first matching mapped item', async () => {
  const item = await getItemById('INV-001');
  assert.ok(item);
  assert.equal(item.id, 'INV-001');
  assert.equal(item.name, 'Animatronic T-Rex');
});

test('getLevel returns the quantity of the item', async () => {
  const level = await getLevel('INV-001');
  assert.equal(level, 10);
});
