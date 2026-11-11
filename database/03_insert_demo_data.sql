-- =====================================================================
-- OpportunityOS | merged_data.sql | Target: MySQL 8.0.16+
-- Merged file: Contains REAL opportunities (orgs 1-28, opps 1-34) 
-- AND SYNTHETIC demo data (orgs 101-108, opps 101-115) from older seed.
-- =====================================================================
USE opportunityos;
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

-- [REFERENCE DATA from new file]
INSERT INTO domains (domain_id, domain_name) VALUES
(1,'AI/ML'),(2,'Web Development'),(3,'Data Science'),(4,'Cybersecurity'),(5,'Embedded Systems'),
(6,'Research'),(7,'General'),(8,'Software Development'),(9,'Life Sciences'),(10,'Defence and Aerospace'),
(11,'Fintech'),(12,'Game Development');

INSERT INTO branches (branch_id, branch_name) VALUES
(1,'Computer Science'),(2,'Information Technology'),(3,'Electronics and Communication'),
(4,'Electrical Engineering'),(5,'Mechanical Engineering'),(6,'Civil Engineering'),
(7,'Chemical Engineering'),(8,'Biotechnology'),(9,'AI and Data Science'),(10,'Aerospace Engineering');

INSERT INTO locations (location_id, city, state, country) VALUES
(1,'Hyderabad','Telangana','India'),(2,'Bengaluru','Karnataka','India'),(3,'Chennai','Tamil Nadu','India'),
(4,'Pune','Maharashtra','India'),(5,'Delhi','Delhi','India'),(6,'Mumbai','Maharashtra','India'),
(7,'Vijayawada','Andhra Pradesh','India'),(8,'Nagpur','Maharashtra','India'),(9,'Bhubaneswar','Odisha','India'),
(10,'Jaipur','Rajasthan','India'),(11,'Chandigarh','Chandigarh','India');

INSERT INTO skills (skill_id, skill_name, domain_id) VALUES
(1,'Python',NULL),(2,'SQL',NULL),(3,'Machine Learning',1),(4,'Deep Learning',1),
(5,'HTML/CSS',2),(6,'JavaScript',2),(7,'React',2),(8,'Pandas',3),
(9,'Data Visualization',3),(10,'Network Security',4),(11,'Ethical Hacking',4),
(12,'C Programming',5),(13,'Microcontrollers',5),(14,'Technical Writing',6),
(15,'Git',NULL),(16,'Java',NULL),(17,'C++',NULL),(18,'Data Structures and Algorithms',NULL),
(19,'Research Methodology',6),(20,'Natural Language Processing',1);

-- [STUDENT DATA - Includes both old 1-6 and new 7-10]
INSERT INTO students (student_id, full_name, email, college_name, branch_id, current_year, cgpa, preferred_work_mode, home_location_id, created_at) VALUES
(1,'Aarav Reddy','aarav.reddy@student.example','Demo Institute of Technology',1,3,8.7,'Remote',1,'2026-09-01 10:00:00'),
(2,'Meera Iyer','meera.iyer@student.example','Demo Institute of Technology',2,2,9.1,'Any',3,'2026-09-02 11:30:00'),
(3,'Rohan Sharma','rohan.sharma@student.example','Demo Institute of Technology',3,4,7.4,'Onsite',5,'2026-09-03 09:15:00'),
(4,'Ananya Rao','ananya.rao@student.example','Demo Institute of Technology',1,1,8.2,'Hybrid',2,'2026-09-04 14:00:00'),
(5,'Karthik Nair','karthik.nair@student.example','Demo Institute of Technology',4,3,6.8,'Any',NULL,'2026-09-05 16:45:00'),
(6,'Sneha Patel','sneha.patel@student.example','Demo Institute of Technology',1,4,9.4,'Remote',4,'2026-09-06 12:20:00'),
(7,'Vikram Singh','vikram.singh@student.example','Demo Institute of Technology',6,2,7.9,'Onsite',4,'2026-09-07 10:10:00'),
(8,'Divya Menon','divya.menon@student.example','Demo Institute of Technology',8,3,8.5,'Any',2,'2026-09-08 15:00:00'),
(9,'Arjun Das','arjun.das@student.example','Demo Institute of Technology',5,4,7.1,'Hybrid',5,'2026-09-09 09:40:00'),
(10,'Fatima Khan','fatima.khan@student.example','Demo Institute of Technology',9,2,8.9,'Remote',1,'2026-09-10 13:25:00');

INSERT INTO student_skills (student_id, skill_id, proficiency) VALUES
(1,1,'Advanced'),(1,3,'Intermediate'),(1,2,'Intermediate'),(1,15,'Intermediate'),
(2,1,'Intermediate'),(2,8,'Advanced'),(2,9,'Intermediate'),(2,2,'Advanced'),
(3,12,'Advanced'),(3,13,'Intermediate'),(3,1,'Beginner'),
(4,5,'Intermediate'),(4,6,'Beginner'),(4,1,'Beginner'),
(5,12,'Intermediate'),(5,13,'Beginner'),
(6,1,'Advanced'),(6,3,'Advanced'),(6,4,'Intermediate'),(6,14,'Intermediate'),(6,2,'Advanced'),
(7,1,'Beginner'),(7,12,'Intermediate'),
(8,19,'Intermediate'),(8,1,'Intermediate'),(8,14,'Beginner'),
(9,12,'Intermediate'),(9,17,'Beginner'),
(10,1,'Advanced'),(10,3,'Intermediate'),(10,20,'Beginner'),(10,18,'Intermediate');

INSERT INTO student_domains (student_id, domain_id) VALUES
(1,1),(1,3),(2,3),(2,1),(3,5),(4,2),(5,5),(6,1),(6,6),(7,10),(8,9),(8,6),(9,10),(10,1),(10,3);

-- ================== NEW REAL DATA ==================
-- REAL organizations
INSERT INTO organizations (org_id, org_name, org_type, website, hq_location_id, data_source) VALUES
(1,'Indian Academy of Sciences','Other','http://www.ias.ac.in/',2,'Real'),
(2,'National Scholarship Portal (Government of India)','Government','https://scholarships.gov.in',5,'Real'),
(3,'All India Council for Technical Education (AICTE)','Government',NULL,5,'Real'),
(4,'Indian Institute of Technology Bombay','University','https://www.ircc.iitb.ac.in/IRCC-Webpage/IITBInternship/',6,'Real'),
(5,'Reliance Foundation','NGO','https://scholarships.reliancefoundation.org',6,'Real'),
(6,'Guru Nanak Institutions Technical Campus','University',NULL,1,'Real'),
(7,'National Informatics Centre (MeitY)','Government','https://dii.nic.in',5,'Real'),
(8,'Defence Research and Development Organisation (DRDO)','Government','https://www.drdo.gov.in',5,'Real'),
(9,'Indian Institute of Technology Bhubaneswar','University',NULL,9,'Real'),
(10,'Visvesvaraya National Institute of Technology Nagpur','University',NULL,8,'Real'),
(11,'National Highways Authority of India (NHAI)','Government',NULL,5,'Real'),
(12,'IndiaAI (Digital India Corporation, MeitY)','Government','https://fellowship.indiaai.gov.in',5,'Real'),
(13,'Homi Bhabha Centre for Science Education (HBCSE-TIFR)','Other',NULL,6,'Real'),
(14,'TIFR Hyderabad','Other',NULL,1,'Real'),
(15,'Foundation for Excellence (FFE)','NGO','https://ffe.org',2,'Real'),
(16,'Amazon India','Company',NULL,2,'Real'),
(17,'Schaeffler India','Company',NULL,NULL,'Real'),
(18,'Raman Kant Munjal Foundation','NGO',NULL,NULL,'Real'),
(19,'Kotak Education Foundation','NGO',NULL,6,'Real'),
(20,'Sage IT','Company',NULL,NULL,'Real'),
(21,'Sashakt Women For Science','NGO',NULL,NULL,'Real'),
(22,'Scaler School of Technology','University',NULL,2,'Real'),
(23,'SpectoV','Other',NULL,NULL,'Real'),
(24,'Codeverse','Other',NULL,NULL,'Real'),
(25,'JECRC Foundation','University',NULL,10,'Real'),
(26,'LTSUPECOM and SKILSTATION','Other',NULL,NULL,'Real'),
(27,'Tata Consultancy Services (TCS)','Company',NULL,6,'Real'),
(28,'Google (with HackerEarth)','Company','https://www.hackerearth.com',NULL,'Real');

-- REAL opportunities
INSERT INTO opportunities (opp_id, org_id, domain_id, location_id, title, opp_type, description, work_mode, reward_amount, reward_unit, duration_weeks, posted_date, deadline, application_url, min_cgpa, min_year, max_year, data_source) VALUES
(1,7,7,5,'NIC Digital India Internship Winter 2026','Internship','50 interns...','Onsite',10000,'Per month',8,'2026-11-02','2026-11-13','https://dii.nic.in',0,1,4,'Real'),
(2,8,10,5,'DRDO DIPAS Internship 2027','Internship','Slots in mechanical...','Onsite',5000,'Per month',NULL,'2026-10-19','2026-11-15',NULL,0,1,4,'Real'),
(3,9,7,9,'IIT Bhubaneswar Winter Internship 2026','Internship','Winter break...','Onsite',NULL,NULL,4,'2026-10-05','2026-11-05',NULL,0,1,4,'Real'),
(4,10,7,8,'VNIT Nagpur Jan-May 2027 Semester Internship','Internship','Google-form...','Onsite',NULL,NULL,NULL,'2026-10-22','2026-10-22',NULL,0,1,4,'Real'),
(5,11,7,5,'NHAI Winter Internship Programme 2026-27','Internship','1,083 internships...','Onsite',20000,'Per month',NULL,'2026-10-20','2026-10-20',NULL,0,1,4,'Real'),
(6,8,10,2,'DRDO CASDIC Internship 2026 (Bengaluru)','Internship','Final-year...','Onsite',5000,'Per month',26,'2026-09-14','2026-10-11',NULL,0,4,4,'Real'),
(7,8,10,1,'DRDO DLRL Hyderabad Paid Internship 2026','Internship','Final-year...','Onsite',NULL,NULL,NULL,'2026-05-05','2026-05-15',NULL,0,4,4,'Real'),
(8,8,9,5,'DRDO INMAS Delhi Paid Internship 2026','Internship','Engineering...','Onsite',5000,'Per month',NULL,'2026-03-27','2026-04-30','https://www.drdo.gov.in...',7.5,4,4,'Real'),
(9,8,10,11,'DRDO TBRL Chandigarh Paid Internship 2026','Internship','Terminal...','Onsite',NULL,NULL,NULL,'2026-05-07','2026-05-25','https://www.drdo.gov.in...',0,1,4,'Real'),
(10,1,6,2,'Science Academies Summer Research Fellowship 2027','Research','Two-month...','Onsite',NULL,NULL,8,'2026-11-11','2026-11-30','http://www.ias.ac.in/',0,1,4,'Real'),
(11,1,6,2,'Science Academies FAST-SF 2027 (regional focus)','Research','About 200...','Onsite',NULL,NULL,8,'2026-11-11','2026-11-30','http://www.ias.ac.in/',0,1,4,'Real'),
(12,12,1,NULL,'IndiaAI Fellowship 2026-27','Research','Up to Rs 2 lakh...','Remote',200000,'One time',NULL,'2026-10-16','2026-11-30','https://fellowship.indiaai.gov.in',0,1,4,'Real'),
(13,4,6,6,'IITB Research Internship Awards 2026-27','Research','Top 20% of class...','Onsite',NULL,NULL,NULL,'2026-08-23','2026-09-23','https://www.ircc.iitb.ac.in...',0,1,4,'Real'),
(14,13,9,6,'NIUS Biology 2026 Exposure Camp (HBCSE-TIFR)','Research','First-year...','Onsite',NULL,NULL,2,'2026-10-03','2026-10-03',NULL,0,1,1,'Real'),
(15,14,6,1,'TIFR Hyderabad Visiting Students Research Programme','Research','8-week summer...','Onsite',NULL,NULL,8,'2026-01-31','2026-01-31',NULL,0,1,4,'Real'),
(16,6,7,1,'Tech Horizon 2.0 National Level Hackathon','Hackathon','48-hour offline...','Onsite',243000,'One time',NULL,'2026-11-11','2026-11-11','https://www.startupgrantsindia.com...',0,1,4,'Real'),
(17,23,8,NULL,'SpectoV National Hackathon (SNH 26)','Hackathon','Individual hackathon...','Remote',NULL,NULL,NULL,'2026-10-05','2026-11-30','https://internshala.com...',0,1,4,'Real'),
(18,24,7,NULL,'Build With Bharat 5.0 (Codeverse)','Hackathon','Free; teams of 2-5...','Remote',NULL,NULL,NULL,'2026-11-01','2026-11-01','https://unstop.com...',0,1,4,'Real'),
(19,22,8,2,'The DevForge Hackathon (Scaler School of Technology)','Hackathon','Event 3 Oct...','Onsite',50000,'One time',NULL,'2026-10-03','2026-11-09','https://www.startupgrantsindia.com...',0,1,4,'Real'),
(20,25,8,10,'Clash of Coders 3.0 (JECRC Foundation)','Hackathon','Online registration...','Hybrid',NULL,NULL,NULL,'2026-08-15','2026-08-15','https://www.startupgrantsindia.com...',0,1,4,'Real'),
(21,26,7,NULL,'International Hackathon Competition 2026','Hackathon','Online event...','Remote',NULL,NULL,NULL,'2026-05-21','2026-06-20','https://www.startupgrantsindia.com...',0,1,4,'Real'),
(22,27,8,NULL,'TCS CodeVita Season 14','Competition','Global coding contest...','Remote',NULL,NULL,NULL,'2026-11-11','2026-11-13','https://codevita.tcsapps.com',0,1,4,'Real'),
(23,16,1,NULL,'Amazon ML Challenge 2026','Competition','Teams of 3-4...','Remote',225000,'One time',NULL,'2026-09-20','2026-09-20','https://unstop.com...',0,1,4,'Real'),
(24,28,8,NULL,'The Big Code 2026 (Google x HackerEarth)','Competition','National coding challenge...','Remote',NULL,NULL,NULL,'2026-03-12','2026-03-12','https://www.hackerearth.com...',0,1,3,'Real'),
(25,2,7,NULL,'NSP Post-Matric Scholarships 2026-27 (central schemes)','Scholarship','Last date reported...','Remote',NULL,NULL,NULL,'2026-10-31','2026-10-31','https://scholarships.gov.in',0,1,4,'Real'),
(26,3,7,NULL,'AICTE Pragati Scholarship 2026-27','Scholarship','Girl students...','Remote',NULL,NULL,NULL,'2026-10-31','2026-10-31','https://scholarships.gov.in',0,1,4,'Real'),
(27,5,7,NULL,'Reliance Foundation Undergraduate Scholarships 2026-27','Scholarship','First-year...','Remote',200000,'One time',NULL,'2026-08-14','2026-10-05','https://scholarships.reliancefoundation.org',0,1,1,'Real'),
(28,15,7,NULL,'FFE Scholarship 2026-27 (Engineering, MBBS, Law)','Scholarship','First-year...','Remote',50000,'One time',NULL,'2026-10-28','2026-12-31','https://ffe.org/scholarships',0,1,1,'Real'),
(29,16,7,NULL,'Amazon Future Engineer Scholarship (India) 2026','Scholarship','For female students...','Remote',NULL,NULL,NULL,'2026-11-11','2026-12-31',NULL,0,1,4,'Real'),
(30,17,7,NULL,'Schaeffler India Hope Engineering Scholarship 2026','Scholarship','Female first-year...','Remote',50000,'One time',NULL,'2026-08-15','2026-08-15',NULL,0,1,1,'Real'),
(31,18,7,NULL,'Raman Kant Munjal Scholarship 2026-27','Scholarship','Rs 40,000...','Remote',NULL,NULL,NULL,'2026-08-31','2026-08-31',NULL,0,1,4,'Real'),
(32,19,7,NULL,'Kotak Kanya Scholarship 2026-27','Scholarship','Girl students...','Remote',150000,'One time',NULL,'2026-09-30','2026-09-30',NULL,0,1,1,'Real'),
(33,20,7,NULL,'Sage IT Scholarship 2026','Scholarship','Rs 50,000...','Remote',50000,'One time',NULL,'2026-11-11','2026-11-15',NULL,0,1,4,'Real'),
(34,21,7,NULL,'Sashakt Scholarship 2026','Scholarship','Rs 80,000...','Remote',80000,'One time',NULL,'2026-10-31','2026-10-31',NULL,0,1,4,'Real');

-- REAL opportunity skills & branches
INSERT INTO opportunity_skills (opp_id, skill_id, is_mandatory) VALUES
(2,17,FALSE),(6,17,FALSE),(7,17,FALSE),(8,19,FALSE),(9,17,FALSE),
(10,19,FALSE),(10,14,FALSE),(11,19,FALSE),(11,14,FALSE),(12,1,TRUE),
(12,3,TRUE),(12,2,FALSE),(13,19,FALSE),(13,14,FALSE),(14,19,FALSE),
(15,19,FALSE),(15,14,FALSE),(17,18,TRUE),(17,1,FALSE),(19,18,TRUE),
(19,1,FALSE),(20,18,TRUE),(20,1,FALSE),(22,18,TRUE),(22,1,FALSE),
(23,1,TRUE),(23,3,TRUE),(23,2,FALSE),(24,18,TRUE),(24,1,FALSE);

INSERT INTO opportunity_branches (opp_id, branch_id) VALUES
(2,1),(2,3),(2,4),(2,5),(24,1),(24,2),(24,3),(24,4);

-- REAL/SYNTHETIC Applications (from new data)
INSERT INTO applications (application_id, student_id, opp_id, status, created_at, updated_at) VALUES
(1,1,12,'Applied','2026-10-20 10:00:00','2026-10-22 10:00:00'),
(2,1,22,'Saved','2026-10-25 18:00:00','2026-10-25 18:00:00'),
(3,2,1,'Shortlisted','2026-11-02 09:30:00','2026-11-06 09:30:00'),
(4,3,2,'Applied','2026-10-22 11:15:00','2026-10-24 11:15:00'),
(5,4,17,'Saved','2026-10-28 20:00:00','2026-10-28 20:00:00'),
(6,6,12,'Interview','2026-10-18 10:00:00','2026-10-24 10:00:00'),
(7,6,10,'Applied','2026-11-01 12:00:00','2026-11-03 12:00:00'),
(8,5,2,'Saved','2026-10-26 08:45:00','2026-10-26 08:45:00'),
(9,8,10,'Saved','2026-11-03 17:30:00','2026-11-03 17:30:00'),
(10,10,22,'Applied','2026-10-29 14:00:00','2026-10-31 14:00:00'),
(11,10,16,'Saved','2026-11-05 19:20:00','2026-11-05 19:20:00'),
(12,9,9,'Rejected','2026-05-08 10:00:00','2026-05-12 10:00:00');

INSERT INTO application_status_history (application_id, status, changed_at, note) VALUES
(1,'Saved','2026-10-20 10:00:00','Application created'),(1,'Applied','2026-10-22 10:00:00','Submitted by student'),
(2,'Saved','2026-10-25 18:00:00','Application created'),
(3,'Saved','2026-11-02 09:30:00','Application created'),(3,'Applied','2026-11-04 09:30:00','Submitted by student'),(3,'Shortlisted','2026-11-06 09:30:00','Shortlisted by organization'),
(4,'Saved','2026-10-22 11:15:00','Application created'),(4,'Applied','2026-10-24 11:15:00','Submitted by student'),
(5,'Saved','2026-10-28 20:00:00','Application created'),
(6,'Saved','2026-10-18 10:00:00','Application created'),(6,'Applied','2026-10-20 10:00:00','Submitted by student'),(6,'Shortlisted','2026-10-22 10:00:00','Shortlisted by organization'),(6,'Interview','2026-10-24 10:00:00','Interview scheduled'),
(7,'Saved','2026-11-01 12:00:00','Application created'),(7,'Applied','2026-11-03 12:00:00','Submitted by student'),
(8,'Saved','2026-10-26 08:45:00','Application created'),
(9,'Saved','2026-11-03 17:30:00','Application created'),
(10,'Saved','2026-10-29 14:00:00','Application created'),(10,'Applied','2026-10-31 14:00:00','Submitted by student'),
(11,'Saved','2026-11-05 19:20:00','Application created'),
(12,'Saved','2026-05-08 10:00:00','Application created'),(12,'Applied','2026-05-10 10:00:00','Submitted by student'),(12,'Rejected','2026-05-12 10:00:00','Not selected');

-- ================== SHIFTED OLD SYNTHETIC DATA ==================
-- Old Organizations (shifted +100)
INSERT INTO organizations (org_id, org_name, org_type, website, hq_location_id, data_source) VALUES
(101,'Nimbus Labs','Company','https://nimbuslabs.example',2,'Synthetic'),
(102,'Orbit Analytics','Company','https://orbitanalytics.example',1,'Synthetic'),
(103,'Southern Tech University','University','https://stu.example',3,'Synthetic'),
(104,'OpenSkills Foundation','NGO','https://openskills.example',5,'Synthetic'),
(105,'Citadel Secure','Company','https://citadelsecure.example',4,'Synthetic'),
(106,'National Research Council','Government','https://nrc.example',5,'Synthetic'),
(107,'PixelForge Studio','Company','https://pixelforge.example',6,'Synthetic'),
(108,'Circuit Works','Company','https://circuitworks.example',NULL,'Synthetic');

-- Old Opportunities (opp_id +100, org_id +100)
INSERT INTO opportunities (opp_id, org_id, domain_id, location_id, title, opp_type, description, work_mode, reward_amount, reward_unit, duration_weeks, posted_date, deadline, application_url, min_cgpa, min_year, max_year, data_source) VALUES
(101,101,1,NULL,'ML Engineering Intern','Internship','Build and evaluate ML models','Remote',15000,'Per month',12,'2026-10-01','2026-11-15','https://nimbuslabs.example/ml-intern',7.5,2,4,'Synthetic'),
(102,101,2,2,'Frontend Developer Intern','Internship','React dashboards for clients','Hybrid',12000,'Per month',8,'2026-10-02','2026-11-10','https://nimbuslabs.example/fe-intern',7.0,1,4,'Synthetic'),
(103,102,3,1,'Data Analyst Intern','Internship','Dashboards and SQL reporting','Onsite',10000,'Per month',10,'2026-10-03','2026-11-20','https://orbitanalytics.example/analyst',6.5,2,4,'Synthetic'),
(104,102,3,NULL,'Data Science Hackathon','Hackathon','48-hour online hackathon','Remote',50000,'One time',NULL,'2026-10-05','2026-11-05','https://orbitanalytics.example/hack',0,1,4,'Synthetic'),
(105,103,6,3,'Summer Research Fellow','Research','Research with faculty on NLP','Onsite',8000,'Per month',8,'2026-09-25','2026-12-01','https://stu.example/research',8.5,2,4,'Synthetic'),
(106,103,1,3,'AI Research Assistant','Research','Assist in deep learning lab','Hybrid',NULL,NULL,12,'2026-10-06','2026-11-30','https://stu.example/ra',8.0,3,4,'Synthetic'),
(107,104,2,NULL,'Open Source Web Challenge','Competition','Build a civic-tech web app','Remote',20000,'One time',NULL,'2026-10-07','2026-11-25','https://openskills.example/web',0,1,4,'Synthetic'),
(108,104,6,NULL,'STEM Merit Scholarship','Scholarship','Merit scholarship for students','Remote',60000,'One time',NULL,'2026-09-20','2026-12-15','https://openskills.example/scholar',8.0,1,3,'Synthetic'),
(109,105,4,4,'Security Analyst Intern','Internship','SOC monitoring and pentest support','Onsite',14000,'Per month',12,'2026-10-08','2026-11-18','https://citadelsecure.example/intern',7.0,3,4,'Synthetic'),
(110,105,4,NULL,'Capture The Flag Contest','Competition','Online CTF for students','Remote',25000,'One time',NULL,'2026-10-09','2026-11-12','https://citadelsecure.example/ctf',0,1,4,'Synthetic'),
(111,106,6,5,'Government Research Internship','Research','Policy data research','Onsite',6000,'Per month',6,'2026-09-28','2026-11-22','https://nrc.example/intern',7.5,2,4,'Synthetic'),
(112,107,2,6,'UI Engineering Intern','Internship','Design-system engineering','Hybrid',11000,'Per month',8,'2026-10-10','2026-11-28','https://pixelforge.example/ui',7.0,1,3,'Synthetic'),
(113,108,5,1,'Embedded Systems Intern','Internship','Firmware for IoT devices','Onsite',9000,'Per month',10,'2026-10-04','2026-11-14','https://circuitworks.example/embedded',6.5,2,4,'Synthetic'),
(114,101,1,NULL,'Kaggle-style ML Contest','Competition','Predictive modelling contest','Remote',30000,'One time',NULL,'2026-10-11','2026-12-05','https://nimbuslabs.example/contest',0,1,4,'Synthetic'),
(115,102,3,NULL,'Past Analytics Internship','Internship','Closed listing kept for history','Remote',8000,'Per month',8,'2026-08-01','2026-09-15','https://orbitanalytics.example/past',6.0,2,4,'Synthetic');

-- Old Opportunity Skills (opp_id +100)
INSERT INTO opportunity_skills (opp_id, skill_id, is_mandatory) VALUES
(101,1,TRUE),(101,3,TRUE),(101,2,FALSE),
(102,5,TRUE),(102,6,TRUE),(102,7,FALSE),
(103,2,TRUE),(103,8,TRUE),(103,9,FALSE),
(104,1,TRUE),(104,8,FALSE),
(105,3,TRUE),(105,14,FALSE),
(106,4,TRUE),(106,1,TRUE),
(107,6,TRUE),(107,15,FALSE),
(109,10,TRUE),(109,11,FALSE),
(110,11,TRUE),
(111,2,TRUE),(111,14,FALSE),
(112,5,TRUE),(112,6,TRUE),
(113,12,TRUE),(113,13,TRUE),
(114,1,TRUE),(114,3,TRUE);

-- Old Opportunity Branches (opp_id +100)
INSERT INTO opportunity_branches (opp_id, branch_id) VALUES
(101,1),(101,2),(102,1),(102,2),(103,1),(103,2),(103,3),(105,1),(105,2),(106,1),
(109,1),(109,2),(109,3),(111,1),(111,2),(111,3),(112,1),(112,2),(113,3),(113,4);

-- Old Applications (application_id +100, opp_id +100)
INSERT INTO applications (application_id, student_id, opp_id, status, created_at, updated_at) VALUES
(101,1,101,'Interview','2026-10-01 10:00:00','2026-10-18 15:00:00'),
(102,1,104,'Applied','2026-10-02 12:00:00','2026-10-04 10:30:00'),
(103,2,103,'Shortlisted','2026-10-04 09:30:00','2026-10-15 16:00:00'),
(104,3,113,'Rejected','2026-10-05 08:45:00','2026-10-16 10:00:00'),
(105,4,102,'Saved','2026-10-06 17:00:00','2026-10-06 17:00:00'),
(106,6,101,'Selected','2026-10-02 18:00:00','2026-10-20 09:00:00'),
(107,6,105,'Rejected','2026-10-03 19:00:00','2026-10-17 12:00:00'),
(108,2,108,'Saved','2026-10-08 20:00:00','2026-10-08 20:00:00'),
(109,5,113,'Saved','2026-10-09 10:15:00','2026-10-09 10:15:00'),
(110,6,114,'Applied','2026-10-11 21:00:00','2026-10-13 09:45:00');

-- Old Application Status History (application_id +100)
INSERT INTO application_status_history (application_id, status, changed_at, note) VALUES
(101,'Saved','2026-10-01 10:00:00','Application created'),
(101,'Applied','2026-10-03 09:00:00','Submitted by student'),
(101,'Shortlisted','2026-10-12 11:00:00','Shortlisted by organization'),
(101,'Interview','2026-10-18 15:00:00','Interview scheduled'),
(102,'Saved','2026-10-02 12:00:00','Application created'),
(102,'Applied','2026-10-04 10:30:00','Submitted by student'),
(103,'Saved','2026-10-04 09:30:00','Application created'),
(103,'Applied','2026-10-06 14:00:00','Submitted by student'),
(103,'Shortlisted','2026-10-15 16:00:00','Shortlisted by organization'),
(104,'Saved','2026-10-05 08:45:00','Application created'),
(104,'Applied','2026-10-07 13:00:00','Submitted by student'),
(104,'Rejected','2026-10-16 10:00:00','Not selected'),
(105,'Saved','2026-10-06 17:00:00','Application created'),
(106,'Saved','2026-10-02 18:00:00','Application created'),
(106,'Applied','2026-10-03 10:00:00','Submitted by student'),
(106,'Shortlisted','2026-10-10 12:00:00','Shortlisted by organization'),
(106,'Interview','2026-10-14 11:00:00','Interview scheduled'),
(106,'Selected','2026-10-20 09:00:00','Offer received'),
(107,'Saved','2026-10-03 19:00:00','Application created'),
(107,'Applied','2026-10-05 11:00:00','Submitted by student'),
(107,'Rejected','2026-10-17 12:00:00','Not selected'),
(108,'Saved','2026-10-08 20:00:00','Application created'),
(109,'Saved','2026-10-09 10:15:00','Application created'),
(110,'Saved','2026-10-11 21:00:00','Application created'),
(110,'Applied','2026-10-13 09:45:00','Submitted by student');
