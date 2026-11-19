// api/opportunities/enriched.js  – GET /api/opportunities/enriched
const { getPool } = require("../_db");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    const db = getPool();
    const [
      [opportunities],
      [organizations],
      [domains],
      [locations],
      [opportunitySkills],
      [opportunityBranches],
    ] = await Promise.all([
      db.query("SELECT * FROM opportunities ORDER BY posted_date DESC"),
      db.query("SELECT * FROM organizations"),
      db.query("SELECT * FROM domains"),
      db.query("SELECT * FROM locations"),
      db.query(`
        SELECT
          os.opp_id, os.skill_id, os.is_mandatory,
          s.skill_id AS related_skill_id,
          s.skill_name, s.domain_id AS skill_domain_id
        FROM opportunity_skills os
        JOIN skills s ON os.skill_id = s.skill_id
      `),
      db.query(`
        SELECT ob.opp_id, b.branch_id, b.branch_name
        FROM opportunity_branches ob
        JOIN branches b ON ob.branch_id = b.branch_id
      `),
    ]);

    const enriched = opportunities.map((opp) => ({
      ...opp,
      organization: organizations.find((o) => o.org_id === opp.org_id) || null,
      domain: domains.find((d) => d.domain_id === opp.domain_id) || null,
      location: opp.location_id
        ? locations.find((l) => l.location_id === opp.location_id) || null
        : null,
      skills: opportunitySkills
        .filter((s) => s.opp_id === opp.opp_id)
        .map((s) => ({
          opp_id: s.opp_id,
          skill_id: s.skill_id,
          is_mandatory: Boolean(s.is_mandatory),
          skill: {
            skill_id: s.related_skill_id,
            skill_name: s.skill_name,
            domain_id: s.skill_domain_id,
          },
        })),
      branches: opportunityBranches
        .filter((b) => b.opp_id === opp.opp_id)
        .map((b) => ({ branch_id: b.branch_id, branch_name: b.branch_name })),
    }));

    res.json(enriched);
  } catch (err) {
    console.error("Enriched opportunities error:", err.message);
    res.status(500).json({ message: "Could not fetch enriched opportunities" });
  }
};
