import test, { beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import {
  addItem,
  getItem,
  deleteItem,
  adjustStock,
  getLevel,
  resetForTests,
  isSellable,
  getLowStock,
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

// ==== NEW TESTS ====

// sellability: positive / zero / negative / missing
test('isSellable true when level > 0', () => {
  addItem({ id: 'E1', sku: 'CHOC-600', name: 'Chocolate', reorderPoint: 5 });
  adjustStock({ itemId: 'E1', delta: +10, reason: 'REPLENISH', refId: 'e1' });
  assert.equal(isSellable('E1'), true);
});

test('isSellable false when level is zero', () => {
  addItem({ id: 'E2', sku: 'BAR-1', name: 'Bar' });
  assert.equal(isSellable('E2'), false);
});

test('isSellable false when level is negative', () => {
  addItem({ id: 'E3', sku: 'NEG-1', name: 'Neg' });
  adjustStock({ itemId: 'E3', delta: -3, reason: 'SALE', refId: 'e3' });
  assert.equal(isSellable('E3'), false);
});

test('isSellable false for non-existent item', () => {
  assert.equal(isSellable('NOPE'), false);
});

// low-stock listing behavior
test('getLowStock lists items below reorder point', () => {
  addItem({ id: 'L1', sku: 'RICE-1', name: 'Rice', reorderPoint: 5 });
  addItem({ id: 'L2', sku: 'BEAN-1', name: 'Beans', reorderPoint: 2 });

  adjustStock({ itemId: 'L1', delta: +3, reason: 'REPLENISH', refId: 'l1' }); // below (3 < 5)
  adjustStock({ itemId: 'L2', delta: +4, reason: 'REPLENISH', refId: 'l2' }); // not below (4 >= 2)

  const rows = getLowStock().map(r => r.itemId).sort();
  assert.deepEqual(rows, ['L1']);
});

// adjustStock returns belowReorderPoint + sellable flags
test('adjust response includes belowReorderPoint and sellable', () => {
  addItem({ id: 'F1', sku: 'MILK-1', name: 'Milk', reorderPoint: 10 });

  const r1 = adjustStock({ itemId: 'F1', delta: +8, reason: 'REPLENISH', refId: 'f1' });
  assert.equal(r1.level, 8);
  assert.equal(r1.belowReorderPoint, true);
  assert.equal(r1.sellable, true);

  const r2 = adjustStock({ itemId: 'F1', delta: +5, reason: 'REPLENISH', refId: 'f2' });
  assert.equal(r2.level, 13);
  assert.equal(r2.belowReorderPoint, false);
  assert.equal(r2.sellable, true);
});
