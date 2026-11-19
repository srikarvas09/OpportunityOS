// api/applications.js  – POST /api/applications
const { getPool } = require("./_db");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { studentId, oppId, status = "Applied", note = null } = req.body;

  if (!studentId || !oppId) {
    return res.status(400).json({ success: false, message: "studentId and oppId are required" });
  }

  const db = getPool();
  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const [result] = await connection.execute(
      `INSERT INTO applications (student_id, opp_id, status, created_at, updated_at)
       VALUES (?, ?, ?, NOW(), NOW())`,
      [studentId, oppId, status]
    );

    await connection.execute(
      `INSERT INTO application_status_history (application_id, status, changed_at, note)
       VALUES (?, ?, NOW(), ?)`,
      [result.insertId, status, note]
    );

    const [rows] = await connection.execute(
      `SELECT application_id, student_id, opp_id, status, created_at, updated_at
       FROM applications WHERE application_id = ?`,
      [result.insertId]
    );

    await connection.commit();
    res.status(201).json({ success: true, application: rows[0] });
  } catch (err) {
    if (connection) await connection.rollback();
    res.status(400).json({
      success: false,
      message: err.code === "ER_DUP_ENTRY" ? "Application already exists" : err.message,
    });
  } finally {
    if (connection) connection.release();
  }
};
