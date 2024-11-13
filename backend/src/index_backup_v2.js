// backend/src/index.js
require('dotenv').config();

const express = require('express');
const { Pool } = require('pg');
const Redis = require('ioredis');
const cors = require('cors');

const app = express();

// Configure CORS before other middleware
app.use(cors({
  origin: ['http://jom.local', 'https://jom.local'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  host: process.env.DB_HOST || 'postgres-primary',
  database: process.env.DB_NAME || 'jomdb',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  port: 5432,
});

// Redis connection with Sentinel
let redisConfig;
if (process.env.REDIS_MODE === 'sentinel') {
  console.log('Using Redis Sentinel configuration');
  redisConfig = {
    sentinels: [
      {
        host: process.env.REDIS_HOST || 'redis',
        port: parseInt(process.env.REDIS_PORT) || 26379
      }
    ],
    name: process.env.REDIS_SENTINEL_NAME || 'mymaster',
    password: process.env.REDIS_PASSWORD,
    role: 'master',
    retryStrategy(times) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    }
  };
} else {
  console.log('Using direct Redis configuration');
  redisConfig = {
    host: process.env.REDIS_HOST || 'redis',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD
  };
}

console.log('Redis config:', redisConfig);
const redis = new Redis(redisConfig);

redis.on('connect', () => {
  console.log('Successfully connected to Redis');
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
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
