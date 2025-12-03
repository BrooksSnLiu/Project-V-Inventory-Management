// backend/src/server.js
import 'dotenv/config';
import app from './app.js';

const PORT = process.env.PORT || 10000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Inventory service running on http://localhost:${PORT}`);
  });
}

export default app;
