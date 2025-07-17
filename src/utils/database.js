const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: process.env.PGPORT || 5432,
  database: process.env.PGDATABASE || 'notes_db',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'password',
  connectionTimeoutMillis: process.env.NODE_ENV === 'production' ? 3000 : 5000,
  idleTimeoutMillis: process.env.NODE_ENV === 'production' ? 10000 : 30000,
  max: process.env.NODE_ENV === 'production' ? 10 : 20,
  min: process.env.NODE_ENV === 'production' ? 2 : 5,
  statement_timeout: process.env.NODE_ENV === 'production' ? 5000 : 10000,
});

pool.on('connect', () => {
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = pool; 