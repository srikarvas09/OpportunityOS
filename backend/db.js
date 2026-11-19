const mysql = require("mysql2/promise");
require("dotenv").config();

// Railway provides MYSQL_URL automatically when you add a MySQL service.
// For local dev, fall back to individual DB_* variables from .env
const pool = process.env.MYSQL_URL
  ? mysql.createPool({
      uri: process.env.MYSQL_URL,
      waitForConnections: true,
      connectionLimit: 10,
      dateStrings: true,
      ssl: { rejectUnauthorized: false },
    })
  : mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      dateStrings: true,
    });

module.exports = pool;
