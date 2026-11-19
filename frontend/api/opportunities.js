// api/opportunities.js  – GET /api/opportunities
const { getPool } = require("./_db");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    const db = getPool();
    const [rows] = await db.query(`
      SELECT
        o.*,
        org.org_name,
        d.domain_name
      FROM opportunities o
      LEFT JOIN organizations org ON o.org_id = org.org_id
      LEFT JOIN domains d ON o.domain_id = d.domain_id
      ORDER BY o.posted_date DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("Opportunity error:", err.message);
    res.status(500).json({ message: "Could not fetch opportunities" });
  }
};
