require('dotenv').config();

module.exports = {
  postgres: {
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'jomdb',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT) || 5432,
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD,
    retryStrategy(times) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    }
  }
};

