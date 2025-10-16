import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import inventoryRoutes from './routes/inventory.routes.js';

const app = express();
app.use(express.json());

// resolve static folder path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// serve static files (like your index.html)
app.use(express.static(path.join(__dirname, 'public')));

// API prefix for routes
app.use('/api/v1', inventoryRoutes);

// 404 for unmatched routes
app.use((req, res) => res.status(404).json({ error: 'route not found' }));

// basic error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('[ERROR]', err);
  res.status(500).json({ error: 'internal error' });
});

export default app;
