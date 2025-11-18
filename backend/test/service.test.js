// test/service.test.js

import test, { beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import {
  getAllItems,
  getItemById,
  getLevel,
  adjustStock,
  resetForTests,
} from '../../src/inventory.service.js';

// For now this does nothing, but we keep the pattern.
beforeEach(() => resetForTests());

test('getAllItems fails clearly when DB API base URL is not configured', async () => {
  await assert.rejects(
    () => getAllItems(),
    /DB API base URL not configured yet/
  );
});

test('getItemById fails clearly when DB API base URL is not configured', async () => {
  await assert.rejects(
    () => getItemById('A1'),
    /DB API base URL not configured yet/
  );
});

test('getLevel fails clearly when DB API base URL is not configured', async () => {
  await assert.rejects(
    () => getLevel('A1'),
    /DB API base URL not configured yet/
  );
});

test('adjustStock is marked as not implemented yet', async () => {
  await assert.rejects(
    () =>
      adjustStock({
        itemId: 'A1',
        delta: -1,
        reason: 'SALE',
        refId: 't1',
      }),
    /adjustStock is not implemented yet; waiting for DB\/Transactions integration/
  );
});
