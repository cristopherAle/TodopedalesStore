const { Pool } = require("pg");
require("dotenv").config();

 const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  allowExitOnIdle: true,
}); 

pool.on('error', (err, client) => {
    console.error('Error in database connection:', err.message);
  });

module.exports = pool;


