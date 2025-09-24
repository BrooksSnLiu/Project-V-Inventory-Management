import test, { beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import {
  addItem,
  getItem,
  deleteItem,
  adjustStock,
  getLevel,
  resetForTests,
} from '../src/inventory.service.js';

// reset state before every test so they don't interfere
beforeEach(() => resetForTests());

// test adding a new item
test('addItem sets stock to 0', () => {
  addItem({ id: 'A1', sku: 'SODA-355', name: 'Soda', reorderPoint: 24 });
  assert.equal(getLevel('A1'), 0);
});

// test reading an item that does not exist
test('getItem returns undefined if missing', () => {
  assert.equal(getItem('NOPE'), undefined);
});

// test deleting an existing item
test('deleteItem works when item exists', () => {
  addItem({ id: 'B1', sku: 'CHIP-100', name: 'Chips' });
  assert.equal(deleteItem('B1'), true);
  assert.equal(getItem('B1'), undefined);
});

// test deleting a missing item
test('deleteItem returns false if missing', () => {
  assert.equal(deleteItem('XYZ'), false);
});

// test stock level changes with adjustments
test('adjustStock updates level', () => {
  addItem({ id: 'C1', sku: 'WATER-500', name: 'Water' });
  adjustStock({ itemId: 'C1', delta: -2, reason: 'SALE', refId: 'r1' });
  assert.equal(getLevel('C1'), -2);
  adjustStock({ itemId: 'C1', delta: +5, reason: 'REPLENISH', refId: 'r2' });
  assert.equal(getLevel('C1'), 3);
});

// test same refId does not apply twice (idempotency)
test('adjustStock ignores duplicate refId', () => {
  addItem({ id: 'D1', sku: 'CANDY-10', name: 'Candy' });
  adjustStock({ itemId: 'D1', delta: -1, reason: 'SALE', refId: 't1' });
  adjustStock({ itemId: 'D1', delta: -1, reason: 'SALE', refId: 't1' });
  assert.equal(getLevel('D1'), -1);
});
