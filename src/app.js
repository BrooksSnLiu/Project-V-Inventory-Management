
import express from 'express';
import inventoryRoutes from './routes/inventory.routes.js';

const app = express();
app.use(express.json());

//API prefix 
app.use('/api/v1', inventoryRoutes);

// root for quick check
app.get('/', (req, res) => {
  res.send(`
    <h1>Inventory Service</h1>
    <p>Status: Working Lets Go!!</p>
    <p>Try <a href="/api/v1/health">/api/v1/health</a></p>
  `);
});

// 404 for unmatched routes
app.use((req, res) => res.status(404).json({ error: 'route not found' }));

// basic error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('[ERROR]', err);
  res.status(500).json({ error: 'internal error' });
});

export default app;
