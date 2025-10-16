import 'dotenv/config';
import pkg from 'pg';
const { Pool } = pkg;

// Create a connection pool
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Reusable query helper
export async function query(text, params) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('executed query', { text, duration, rows: res.rowCount });
  return res;
}

// Health check (used in /health)
export async function ping() {  
  console.log("connected to PostgreSQL");
  await new Promise(r => setTimeout(r, 300)); 
  return true; 
}

