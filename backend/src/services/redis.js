const Redis = require('ioredis');
const config = require('../config/database');

console.log('Redis Mode:', process.env.REDIS_MODE);
console.log('Full Redis config:', JSON.stringify(config.redis, null, 2));

const redis = new Redis(config.redis);

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

redis.on('connect', () => {
  console.log('Successfully connected to Redis');
});


module.exports = redis;

