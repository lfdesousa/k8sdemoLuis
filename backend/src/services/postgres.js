// backend/src/services/postgres.js
const { Pool } = require('pg');
const config = require('../config/database');

const pool = new Pool(config.postgres);

module.exports = pool;

