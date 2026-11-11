-- OpportunityOS | 03_verify.sql | Run after 01 and 02. Read-only checks.
USE opportunityos;
 
-- A. Tables and structures
SHOW TABLES;
DESCRIBE domains;
DESCRIBE branches;
DESCRIBE locations;
DESCRIBE skills;
DESCRIBE organizations;
DESCRIBE students;
DESCRIBE opportunities;
DESCRIBE student_skills;
DESCRIBE student_domains;
DESCRIBE opportunity_skills;
DESCRIBE opportunity_branches;
DESCRIBE applications;
DESCRIBE application_status_history;

-- Row counts for all 13 tables
SELECT 'domains' AS table_name, COUNT(*) AS row_count FROM domains
UNION ALL SELECT 'branches', COUNT(*) FROM branches
UNION ALL SELECT 'locations', COUNT(*) FROM locations
UNION ALL SELECT 'skills', COUNT(*) FROM skills
UNION ALL SELECT 'organizations', COUNT(*) FROM organizations
UNION ALL SELECT 'students', COUNT(*) FROM students
UNION ALL SELECT 'opportunities', COUNT(*) FROM opportunities
UNION ALL SELECT 'student_skills', COUNT(*) FROM student_skills
UNION ALL SELECT 'student_domains', COUNT(*) FROM student_domains
UNION ALL SELECT 'opportunity_skills', COUNT(*) FROM opportunity_skills
UNION ALL SELECT 'opportunity_branches', COUNT(*) FROM opportunity_branches
UNION ALL SELECT 'applications', COUNT(*) FROM applications
UNION ALL SELECT 'application_status_history', COUNT(*) FROM application_status_history;
