// api/test-db.js  – GET /api/test-db
const { getPool } = require("./_db");

module.exports = async (req, res) => {
  try {
    const db = getPool();
    const [rows] = await db.query("SELECT DATABASE() AS database_name");
    res.json({
      success: true,
      message: "MySQL connected successfully!",
      database: rows[0].database_name,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
