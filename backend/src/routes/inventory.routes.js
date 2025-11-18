// src/routes/inventory.routes.js

import { Router } from 'express';
import {
  health,
  listItems,
  readItem,
  level,
  adjust,
  createItem,
  removeItem,
} from '../controllers/inventory.controller.js';

const router = Router();

// Health
router.get('/health', health);

// Inventory items (read-only)
router.get('/items', listItems);      // NEW: get all items from DB
router.get('/items/:id', readItem);   // read one item

// Not supported in DB-driven architecture
router.post('/items', createItem);    // returns 501
router.delete('/items/:id', removeItem); // returns 501

// Stock operations
router.get('/stock/:id/level', level);   // read only
router.post('/stock/adjust', adjust);    // currently not implemented (501)

export default router;
