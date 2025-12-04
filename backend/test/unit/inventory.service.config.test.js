// test/unit/inventory.service.config.test.js
import test from 'node:test';
import assert from 'node:assert/strict';
import * as svc from '../../src/inventory.service.js';

test('inventory.service exports the expected functions', () => {
  assert.equal(typeof svc.getAllItems, 'function');
  assert.equal(typeof svc.getItemById, 'function');
  assert.equal(typeof svc.getLevel, 'function');
});

test('getAllItems returns a promise-like (async function)', () => {
  const result = svc.getAllItems();
  // It’s an async function, so this should be a Promise
  assert.ok(
    result && typeof result.then === 'function',
    'getAllItems should return a Promise'
  );
});
