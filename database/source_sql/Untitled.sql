-- C. Row counts (expected: 6,5,7,15,8,6,15,21,9,28,20,10,25)
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
 
-- D. Records from every table
SELECT * FROM domains;
SELECT * FROM branches;
SELECT * FROM locations;
SELECT * FROM skills;
SELECT * FROM organizations;
SELECT * FROM students;
SELECT * FROM opportunities;
SELECT * FROM student_skills;
SELECT * FROM student_domains;
SELECT * FROM opportunity_skills;
SELECT * FROM opportunity_branches;
SELECT * FROM applications;
SELECT * FROM application_status_history;
 
