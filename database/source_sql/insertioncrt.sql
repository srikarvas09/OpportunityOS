-- =====================================================================
-- OpportunityOS | 05_replace_with_real_data.sql | MySQL 8.0.16+
-- PURPOSE: delete ALL existing (synthetic) rows, then load REAL opportunities.
-- Run AFTER 01_create_tables.sql (tables must already exist). It replaces 02.
-- WARNING: this empties every table in database opportunityos.
-- =====================================================================
USE opportunityos;

-- ---------- PART A: wipe all data (TRUNCATE also resets AUTO_INCREMENT) ----------
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE application_status_history;
TRUNCATE TABLE applications;
TRUNCATE TABLE opportunity_branches;
TRUNCATE TABLE opportunity_skills;
TRUNCATE TABLE student_domains;
TRUNCATE TABLE student_skills;
TRUNCATE TABLE opportunities;
TRUNCATE TABLE students;
TRUNCATE TABLE organizations;
TRUNCATE TABLE skills;
TRUNCATE TABLE locations;
TRUNCATE TABLE branches;
TRUNCATE TABLE domains;
SET FOREIGN_KEY_CHECKS = 1;

-- ---------- PART B: reference (lookup) data ----------
-- Generic category lists, not facts about real listings. Replace branches with your college's list.
INSERT INTO domains (domain_id, domain_name) VALUES
(1,'AI/ML'),(2,'Web Development'),(3,'Data Science'),(4,'Cybersecurity'),
(5,'Embedded Systems'),(6,'Research'),(7,'General');
INSERT INTO branches (branch_id, branch_name) VALUES
(1,'Computer Science'),(2,'Information Technology'),(3,'Electronics and Communication'),
(4,'Electrical Engineering'),(5,'Mechanical Engineering');
INSERT INTO locations (location_id, city, state, country) VALUES
(1,'Hyderabad','Telangana','India'),(2,'Bengaluru','Karnataka','India'),
(3,'Chennai','Tamil Nadu','India'),(4,'Pune','Maharashtra','India'),
(5,'Delhi','Delhi','India'),(6,'Mumbai','Maharashtra','India'),
(7,'Vijayawada','Andhra Pradesh','India');
INSERT INTO skills (skill_id, skill_name, domain_id) VALUES
(1,'Python',NULL),(2,'SQL',NULL),(3,'Machine Learning',1),(4,'Deep Learning',1),
(5,'HTML/CSS',2),(6,'JavaScript',2),(7,'React',2),(8,'Pandas',3),
(9,'Data Visualization',3),(10,'Network Security',4),(11,'Ethical Hacking',4),
(12,'C Programming',5),(13,'Microcontrollers',5),(14,'Technical Writing',6),
(15,'Git',NULL);

-- ---------- PART C: REAL organizations and opportunities ----------
-- Facts below were taken from public pages on 29 Oct 2026. VERIFY each deadline and
-- link on the official site before you rely on it. Official sources: scholarships.gov.in
-- and the Indian Academy of Sciences site. posted_date = date we RECORDED the listing,
-- not the organization's own posting date. Amounts are NULL where no figure was confirmed.
INSERT INTO organizations (org_id, org_name, org_type, website, hq_location_id, data_source) VALUES
(1,'Indian Academy of Sciences','Other','http://www.ias.ac.in/',2,'Real'),
(2,'National Scholarship Portal (Government of India)','Government','https://scholarships.gov.in',5,'Real'),
(3,'All India Council for Technical Education (AICTE)','Government',NULL,5,'Real');

INSERT INTO opportunities (opp_id, org_id, domain_id, location_id, title, opp_type, description,
  work_mode, reward_amount, reward_unit, duration_weeks, posted_date, deadline, application_url,
  min_cgpa, min_year, max_year, data_source) VALUES
(1,1,6,2,'Science Academies Summer Research Fellowship 2027','Research',
 'Two-month research fellowship under an approved scientist or faculty guide (run with INSA and NASI). Travel and living support provided; host institution varies. Official rule: 65% average in core subjects from Class X (not a CGPA); check eligible years on the official page.',
 'Onsite',NULL,NULL,8,'2026-10-29','2026-11-30','http://www.ias.ac.in/',0,1,4,'Real'),
(2,2,7,NULL,'NSP Post-Matric Scholarships 2026-27 (central schemes)','Scholarship',
 'Central government post-matric scholarship schemes on the National Scholarship Portal. Last date reported as 31 Oct 2026 for most schemes; exact date, amount and eligibility differ by scheme and may be extended. Complete One-Time Registration first.',
 'Remote',NULL,NULL,NULL,'2026-10-29','2026-10-31','https://scholarships.gov.in',0,1,4,'Real'),
(3,3,7,NULL,'AICTE Pragati Scholarship 2026-27','Scholarship',
 'For girl students in technical degree or diploma courses at AICTE-approved institutions, applied through the National Scholarship Portal. Last date reported as 31 Oct 2026.',
 'Remote',NULL,NULL,NULL,'2026-10-29','2026-10-31','https://scholarships.gov.in',0,1,4,'Real');

-- ---------- PART D (OPTIONAL): SYNTHETIC demo data so the other tables are not empty ----------
-- Students and applications cannot be "real" (private data). Everything in Part D is
-- FICTIONAL. The skill/branch tags are demo choices, NOT official requirements.
INSERT INTO students (student_id, full_name, email, college_name, branch_id, current_year, cgpa,
                      preferred_work_mode, home_location_id, created_at) VALUES
(1,'Aarav Reddy','aarav.reddy@student.example','Demo Institute of Technology',1,3,8.70,'Remote',1,'2026-09-01 10:00:00'),
(2,'Meera Iyer','meera.iyer@student.example','Demo Institute of Technology',2,2,9.10,'Any',3,'2026-09-02 11:30:00'),
(3,'Rohan Sharma','rohan.sharma@student.example','Demo Institute of Technology',3,4,7.40,'Onsite',5,'2026-09-03 09:15:00'),
(4,'Ananya Rao','ananya.rao@student.example','Demo Institute of Technology',1,1,8.20,'Hybrid',2,'2026-09-04 14:00:00'),
(5,'Karthik Nair','karthik.nair@student.example','Demo Institute of Technology',4,3,6.80,'Any',NULL,'2026-09-05 16:45:00'),
(6,'Sneha Patel','sneha.patel@student.example','Demo Institute of Technology',1,4,9.40,'Remote',4,'2026-09-06 12:20:00');
INSERT INTO student_skills (student_id, skill_id, proficiency) VALUES
(1,1,'Advanced'),(1,3,'Intermediate'),(1,2,'Intermediate'),(1,15,'Intermediate'),
(2,1,'Intermediate'),(2,8,'Advanced'),(2,9,'Intermediate'),(2,2,'Advanced'),
(3,12,'Advanced'),(3,13,'Intermediate'),(3,1,'Beginner'),
(4,5,'Intermediate'),(4,6,'Beginner'),(4,1,'Beginner'),
(5,12,'Intermediate'),(5,13,'Beginner'),
(6,1,'Advanced'),(6,3,'Advanced'),(6,4,'Intermediate'),(6,14,'Intermediate'),(6,2,'Advanced');
INSERT INTO student_domains (student_id, domain_id) VALUES
(1,1),(1,3),(2,3),(2,1),(3,5),(4,2),(5,5),(6,1),(6,6);
INSERT INTO opportunity_skills (opp_id, skill_id, is_mandatory) VALUES
(1,14,FALSE),(1,1,FALSE),(2,2,FALSE);
INSERT INTO opportunity_branches (opp_id, branch_id) VALUES
(1,1),(1,2),(1,3);
INSERT INTO applications (application_id, student_id, opp_id, status, created_at, updated_at) VALUES
(1,6,1,'Applied','2026-10-25 10:00:00','2026-10-27 09:30:00'),
(2,1,2,'Saved','2026-10-26 18:00:00','2026-10-26 18:00:00'),
(3,2,1,'Saved','2026-10-28 12:15:00','2026-10-28 12:15:00');
INSERT INTO application_status_history (application_id, status, changed_at, note) VALUES
(1,'Saved','2026-10-25 10:00:00','Application created'),
(1,'Applied','2026-10-27 09:30:00','Submitted by student'),
(2,'Saved','2026-10-26 18:00:00','Application created'),
(3,'Saved','2026-10-28 12:15:00','Application created');

-- Expected counts: domains 7, branches 5, locations 7, skills 15, organizations 3,
-- opportunities 3, students 6, student_skills 21, student_domains 9,
-- opportunity_skills 3, opportunity_branches 3, applications 3, application_status_history 4
SELECT 'organizations' t, COUNT(*) n FROM organizations UNION ALL
SELECT 'opportunities', COUNT(*) FROM opportunities UNION ALL
SELECT 'students', COUNT(*) FROM students UNION ALL
SELECT 'applications', COUNT(*) FROM applications;
-- =====================================================================
-- OpportunityOS | 06_add_more_real_data.sql | MySQL 8.0.16+
-- ADDS 4 more real opportunities. Does NOT delete anything.
-- Run AFTER 05_replace_with_real_data.sql (needs organizations 1-3, opportunities 1-3,
-- domains 1-7 and locations 1-7 to exist). Run it only once.
-- Facts taken from public pages on 29 Oct 2026; verify each on the official site.
-- Two listings are already CLOSED on purpose: they are real, and they test the "expired" filter.
-- =====================================================================
USE opportunityos;

INSERT INTO organizations (org_id, org_name, org_type, website, hq_location_id, data_source) VALUES
(4,'Indian Institute of Technology Bombay','University','https://www.ircc.iitb.ac.in/IRCC-Webpage/IITBInternship/',6,'Real'),
(5,'Reliance Foundation','NGO','https://scholarships.reliancefoundation.org',6,'Real'),
(6,'Guru Nanak Institutions Technical Campus','University',NULL,1,'Real');

INSERT INTO opportunities (opp_id, org_id, domain_id, location_id, title, opp_type, description,
  work_mode, reward_amount, reward_unit, duration_weeks, posted_date, deadline, application_url,
  min_cgpa, min_year, max_year, data_source) VALUES
(4,4,6,6,'IITB Research Internship Awards 2026-27','Internship',
 'Research internship under IIT Bombay faculty, coordinated by IRCC. Applications ran 23 Aug to 23 Sep 2026 (CLOSED). Applicants must be in the top 20% of their class; one report mentions a Rs 15,000 stipend but not the unit, so no amount is stored.',
 'Onsite',NULL,NULL,NULL,'2026-08-23','2026-09-23','https://www.ircc.iitb.ac.in/IRCC-Webpage/IITBInternship/',0,1,4,'Real'),
(5,1,6,2,'Science Academies FAST-SF 2027 (regional focus)','Research',
 'Two-month fellowship from the Indian Academy of Sciences with INSA and NASI; about 200 fellowships; open only to students and teachers in the focus states and territories named on the official page (e.g. North-Eastern states, Bihar, Jharkhand).',
 'Onsite',NULL,NULL,8,'2026-10-29','2026-11-30','http://www.ias.ac.in/',0,1,4,'Real'),
(6,5,7,NULL,'Reliance Foundation Undergraduate Scholarships 2026-27','Scholarship',
 'For first-year undergraduate students; support of up to Rs 2,00,000 over the degree; online application plus aptitude test. Applications ran 14 Aug to 5 Oct 2026 (CLOSED). One site lists 15 Oct, but university notices and the foundation material say 5 Oct.',
 'Remote',200000,'One time',NULL,'2026-08-14','2026-10-05','https://scholarships.reliancefoundation.org',0,1,1,'Real'),
(7,6,7,1,'Tech Horizon 2.0 National Level Hackathon','Hackathon',
 '48-hour offline hackathon, 19-21 Nov 2026, Hyderabad. Tracks include embedded systems, defence, next-gen communication, sustainable development and open innovation. Teams of 3 to 6; UG, PG, PhD students and professionals. Stored reward is the total prize pool of Rs 2.43 lakh.',
 'Onsite',243000,'One time',NULL,'2026-10-29','2026-11-11','https://www.startupgrantsindia.com/competitions/tech-horizon-20-national-level-hackathon',0,1,4,'Real');

SELECT opp_id, title, deadline, data_source FROM opportunities ORDER BY opp_id;