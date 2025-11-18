// src/app.js
import express from 'express';
import inventoryRoutes from './routes/inventory.routes.js';

const app = express();

// Parse JSON bodies
app.use(express.json());

// API prefix for all Inventory routes
app.use('/api/v1', inventoryRoutes);

// Root route for quick manual check
app.get('/', (req, res) => {
  res.send(`
    <h1>Inventory Service</h1>
    <p>Status: Running</p>
    <p>Try: <a href="/api/v1/health">/api/v1/health</a></p>
  `);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'route not found' });
});

// Global error handler (for async controllers too)
app.use((err, req, res, next) => {
  console.error('[ERROR]', err);
  res.status(500).json({ error: err.message || 'internal server error' });
});

export default app;
