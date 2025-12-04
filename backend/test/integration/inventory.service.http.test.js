// test/integration/inventory.service.http.test.js
import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';

import app from '../../src/app.js';

test('GET /api/v1/health returns ok', async () => {
  const res = await request(app).get('/api/v1/health');

  assert.equal(res.status, 200);
  assert.deepEqual(res.body, {
    ok: true,
    env: process.env.NODE_ENV || 'dev',
  });
});
