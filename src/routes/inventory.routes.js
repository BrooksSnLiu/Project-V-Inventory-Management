import { Router } from 'express';
import {
  health,
  createItem,
  readItem,
  removeItem,
  adjust,
  level,
  lowStock,
} from '../controllers/inventory.controller.js';

const router = Router();

// health
router.get('/health', health);

// items
router.post('/items', createItem);
router.get('/items/:id', readItem);
router.delete('/items/:id', removeItem);

// stock
router.post('/stock/adjust', adjust);
router.get('/stock/:id/level', level);

// low stock (new)
router.get('/low-stock', lowStock);

export default router;
