const express = require("express");
const cors = require("cors");

const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// Test MySQL connection
app.get("/api/test-db", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT DATABASE() AS database_name"
    );

    res.json({
      success: true,
      message: "MySQL connected successfully!",
      database: rows[0].database_name
    });
  } catch (error) {
    console.error("Database error:", error.message);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Fetch opportunities from MySQL
app.get("/api/opportunities", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        o.*,
        org.org_name,
        d.domain_name
      FROM opportunities o
      LEFT JOIN organizations org
        ON o.org_id = org.org_id
      LEFT JOIN domains d
        ON o.domain_id = d.domain_id
      ORDER BY o.posted_date DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error("Opportunity error:", error.message);

    res.status(500).json({
      message: "Could not fetch opportunities"
    });
  }
});

// Fetch complete opportunities with related MySQL data
app.get("/api/opportunities/enriched", async (req, res) => {
  try {
    const [
      [opportunities],
      [organizations],
      [domains],
      [locations],
      [opportunitySkills],
      [opportunityBranches]
    ] = await Promise.all([
      db.query("SELECT * FROM opportunities ORDER BY posted_date DESC"),
      db.query("SELECT * FROM organizations"),
      db.query("SELECT * FROM domains"),
      db.query("SELECT * FROM locations"),
      db.query(`
        SELECT
          os.opp_id,
          os.skill_id,
          os.is_mandatory,
          s.skill_id AS related_skill_id,
          s.skill_name,
          s.domain_id AS skill_domain_id
        FROM opportunity_skills os
        JOIN skills s ON os.skill_id = s.skill_id
      `),
      db.query(`
        SELECT
          ob.opp_id,
          b.branch_id,
          b.branch_name
        FROM opportunity_branches ob
        JOIN branches b ON ob.branch_id = b.branch_id
      `)
    ]);

    const enriched = opportunities.map(opp => {
      const organization = organizations.find(
        org => org.org_id === opp.org_id
      );

      const domain = domains.find(
        d => d.domain_id === opp.domain_id
      );

      const location = opp.location_id
        ? locations.find(l => l.location_id === opp.location_id) || null
        : null;

      const skills = opportunitySkills
        .filter(s => s.opp_id === opp.opp_id)
        .map(s => ({
          opp_id: s.opp_id,
          skill_id: s.skill_id,
          is_mandatory: Boolean(s.is_mandatory),
          skill: {
            skill_id: s.related_skill_id,
            skill_name: s.skill_name,
            domain_id: s.skill_domain_id
          }
        }));

      const branches = opportunityBranches
        .filter(b => b.opp_id === opp.opp_id)
        .map(b => ({
          branch_id: b.branch_id,
          branch_name: b.branch_name
        }));

      return {
        ...opp,
        organization,
        domain,
        location,
        skills,
        branches
      };
    });

    res.json(enriched);
  } catch (error) {
    console.error("Enriched opportunities error:", error.message);

    res.status(500).json({
      message: "Could not fetch enriched opportunities"
    });
  }
});

const PORT = process.env.PORT || 5000;

// Create a new application
app.post("/api/applications", async (req, res) => {
  const { studentId, oppId, status = "Applied", note = null } = req.body;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [result] = await connection.execute(
      `INSERT INTO applications
       (student_id, opp_id, status, created_at, updated_at)
       VALUES (?, ?, ?, NOW(), NOW())`,
      [studentId, oppId, status]
    );

    await connection.execute(
      `INSERT INTO application_status_history
       (application_id, status, changed_at, note)
       VALUES (?, ?, NOW(), ?)`,
      [result.insertId, status, note]
    );

    await connection.commit();

    res.status(201).json({
      success: true,
      application: {
        application_id: result.insertId,
        student_id: studentId,
        opp_id: oppId,
        status
      }
    });

  } catch (error) {
    await connection.rollback();

    res.status(400).json({
      success: false,
      message: error.code === "ER_DUP_ENTRY"
        ? "Application already exists"
        : error.message
    });

  } finally {
    connection.release();
  }
});

// Create a new application
app.post("/api/applications", async (req, res) => {
  const { studentId, oppId, status = "Applied", note = null } = req.body;

  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const [result] = await connection.execute(
      `INSERT INTO applications
       (student_id, opp_id, status, created_at, updated_at)
       VALUES (?, ?, ?, NOW(), NOW())`,
      [studentId, oppId, status]
    );

    await connection.execute(
      `INSERT INTO application_status_history
       (application_id, status, changed_at, note)
       VALUES (?, ?, NOW(), ?)`,
      [result.insertId, status, note]
    );

    const [rows] = await connection.execute(
      `SELECT application_id, student_id, opp_id, status,
              created_at, updated_at
       FROM applications
       WHERE application_id = ?`,
      [result.insertId]
    );

    await connection.commit();

    res.status(201).json({
      success: true,
      application: rows[0]
    });

  } catch (error) {
    if (connection) await connection.rollback();

    res.status(400).json({
      success: false,
      message: error.code === "ER_DUP_ENTRY"
        ? "Application already exists"
        : error.message
    });

  } finally {
    if (connection) connection.release();
  }
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});