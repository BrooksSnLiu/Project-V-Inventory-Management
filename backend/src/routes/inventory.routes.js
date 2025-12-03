// backend/src/routes/inventory.routes.js

import { Router } from 'express';
import {
  health,
  listItems,
  readItem,
  level,
} from '../controllers/inventory.controller.js';

const router = Router();

// Health
router.get('/health', health);

// Inventory items (read-only)
router.get('/items', listItems);
router.get('/items/:id', readItem);

// Stock level (read-only)
router.get('/stock/:id/level', level);

export default router;
