// backend/src/index.js
require('dotenv').config();
console.log('Redis config:', {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
});
const express = require('express');
const { Pool } = require('pg');
const Redis = require('ioredis');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// PostgreSQL connection
const pool = new Pool({
  host: process.env.DB_HOST || 'postgres-primary',
  database: process.env.DB_NAME || 'jomdb',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  port: 5432,
});

// Redis connection
const redis = new Redis({
  host: process.env.REDIS_HOST || 'redis',
  port: 6379,
  password: process.env.REDIS_PASSWORD
});

// Routes
app.get('/api/items', async (req, res) => {
  try {
    // Try cache first
    const cached = await redis.get('items');
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    // If not in cache, get from DB
    const result = await pool.query('SELECT * FROM test ORDER BY id');
    const items = result.rows;
    
    // Store in cache for 60 seconds
    await redis.setex('items', 60, JSON.stringify(items));
    
    res.json(items);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/items', async (req, res) => {
  const { value } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO test (value) VALUES ($1) RETURNING *',
      [value]
    );
    
    // Invalidate cache
    await redis.del('items');
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
