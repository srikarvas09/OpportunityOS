// api/_db.js  – shared MySQL pool for all Vercel serverless functions
const mysql = require("mysql2/promise");

let pool;

function getPool() {
  if (!pool) {
    if (!process.env.MYSQL_URL) {
      throw new Error("MYSQL_URL environment variable is not set");
    }
    pool = mysql.createPool({
      uri: process.env.MYSQL_URL,
      waitForConnections: true,
      connectionLimit: 5,        // keep low for serverless
      connectTimeout: 10000,
      dateStrings: true,
      ssl: { rejectUnauthorized: false },
    });
  }
  return pool;
}

module.exports = { getPool };
