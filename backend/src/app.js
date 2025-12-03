// src/app.js
import express from 'express';
import cors from 'cors'; 
import path from 'path';
import { fileURLToPath } from 'url';
import inventoryRoutes from './routes/inventory.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

app.use(express.json());

// serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Inventory API routes
app.use('/api/v1', inventoryRoutes);

// Root route → serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[ERROR]', err);
  res.status(500).json({ error: err.message || 'internal server error' });
});

export default app;
