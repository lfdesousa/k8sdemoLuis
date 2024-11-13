// backend/src/routes/items.js
const express = require('express');
const router = express.Router();
const pool = require('../services/postgres');
const redis = require('../services/redis');

router.get('/', async (req, res) => {
  try {
    const cached = await redis.get('items');
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const result = await pool.query('SELECT * FROM test ORDER BY id');
    const items = result.rows;
    
    await redis.setex('items', 60, JSON.stringify(items));
    
    res.json(items);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req, res) => {
  const { value } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO test (value) VALUES ($1) RETURNING *',
      [value]
    );
    
    await redis.del('items');
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

