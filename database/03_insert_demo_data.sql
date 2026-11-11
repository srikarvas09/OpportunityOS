-- OpportunityOS | 02_insert_sample_data.sql | Target: MySQL 8.0.16+
-- ALL DATA BELOW IS SYNTHETIC (fictional) and is used only for testing.
-- Run AFTER 01_create_tables.sql. Parents are inserted before children.
-- Order: domains, branches, locations, skills, organizations, students,
--        opportunities, student_skills, student_domains, opportunity_skills,
--        opportunity_branches, applications, application_status_history
-- =====================================================================
USE opportunityos;
 
INSERT INTO domains (domain_id, domain_name) VALUES
(1,'AI/ML'),(2,'Web Development'),(3,'Data Science'),(4,'Cybersecurity'),
(5,'Embedded Systems'),(6,'Research');
 
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
 
INSERT INTO organizations (org_id, org_name, org_type, website, hq_location_id, data_source) VALUES
(1,'Nimbus Labs','Company','https://nimbuslabs.example',2,'Synthetic'),
(2,'Orbit Analytics','Company','https://orbitanalytics.example',1,'Synthetic'),
(3,'Southern Tech University','University','https://stu.example',3,'Synthetic'),
(4,'OpenSkills Foundation','NGO','https://openskills.example',5,'Synthetic'),
(5,'Citadel Secure','Company','https://citadelsecure.example',4,'Synthetic'),
(6,'National Research Council','Government','https://nrc.example',5,'Synthetic'),
(7,'PixelForge Studio','Company','https://pixelforge.example',6,'Synthetic'),
(8,'Circuit Works','Company','https://circuitworks.example',NULL,'Synthetic');
 
INSERT INTO students (student_id, full_name, email, college_name, branch_id, current_year, cgpa,
                      preferred_work_mode, home_location_id, created_at) VALUES
(1,'Aarav Reddy','aarav.reddy@student.example','Demo Institute of Technology',1,3,8.70,'Remote',1,'2026-09-01 10:00:00'),
(2,'Meera Iyer','meera.iyer@student.example','Demo Institute of Technology',2,2,9.10,'Any',3,'2026-09-02 11:30:00'),
(3,'Rohan Sharma','rohan.sharma@student.example','Demo Institute of Technology',3,4,7.40,'Onsite',5,'2026-09-03 09:15:00'),
(4,'Ananya Rao','ananya.rao@student.example','Demo Institute of Technology',1,1,8.20,'Hybrid',2,'2026-09-04 14:00:00'),
(5,'Karthik Nair','karthik.nair@student.example','Demo Institute of Technology',4,3,6.80,'Any',NULL,'2026-09-05 16:45:00'),
(6,'Sneha Patel','sneha.patel@student.example','Demo Institute of Technology',1,4,9.40,'Remote',4,'2026-09-06 12:20:00');
 
INSERT INTO opportunities (opp_id, org_id, domain_id, location_id, title, opp_type, description,
  work_mode, reward_amount, reward_unit, duration_weeks, posted_date, deadline, application_url,
  min_cgpa, min_year, max_year, data_source) VALUES
(1,1,1,NULL,'ML Engineering Intern','Internship','Build and evaluate ML models','Remote',15000,'Per month',12,'2026-10-01','2026-11-15','https://nimbuslabs.example/ml-intern',7.5,2,4,'Synthetic'),
(2,1,2,2,'Frontend Developer Intern','Internship','React dashboards for clients','Hybrid',12000,'Per month',8,'2026-10-02','2026-11-10','https://nimbuslabs.example/fe-intern',7.0,1,4,'Synthetic'),
(3,2,3,1,'Data Analyst Intern','Internship','Dashboards and SQL reporting','Onsite',10000,'Per month',10,'2026-10-03','2026-11-20','https://orbitanalytics.example/analyst',6.5,2,4,'Synthetic'),
(4,2,3,NULL,'Data Science Hackathon','Hackathon','48-hour online hackathon','Remote',50000,'One time',NULL,'2026-10-05','2026-11-05','https://orbitanalytics.example/hack',0,1,4,'Synthetic'),
(5,3,6,3,'Summer Research Fellow','Research','Research with faculty on NLP','Onsite',8000,'Per month',8,'2026-09-25','2026-12-01','https://stu.example/research',8.5,2,4,'Synthetic'),
(6,3,1,3,'AI Research Assistant','Research','Assist in deep learning lab','Hybrid',NULL,NULL,12,'2026-10-06','2026-11-30','https://stu.example/ra',8.0,3,4,'Synthetic'),
(7,4,2,NULL,'Open Source Web Challenge','Competition','Build a civic-tech web app','Remote',20000,'One time',NULL,'2026-10-07','2026-11-25','https://openskills.example/web',0,1,4,'Synthetic'),
(8,4,6,NULL,'STEM Merit Scholarship','Scholarship','Merit scholarship for students','Remote',60000,'One time',NULL,'2026-09-20','2026-12-15','https://openskills.example/scholar',8.0,1,3,'Synthetic'),
(9,5,4,4,'Security Analyst Intern','Internship','SOC monitoring and pentest support','Onsite',14000,'Per month',12,'2026-10-08','2026-11-18','https://citadelsecure.example/intern',7.0,3,4,'Synthetic'),
(10,5,4,NULL,'Capture The Flag Contest','Competition','Online CTF for students','Remote',25000,'One time',NULL,'2026-10-09','2026-11-12','https://citadelsecure.example/ctf',0,1,4,'Synthetic'),
(11,6,6,5,'Government Research Internship','Research','Policy data research','Onsite',6000,'Per month',6,'2026-09-28','2026-11-22','https://nrc.example/intern',7.5,2,4,'Synthetic'),
(12,7,2,6,'UI Engineering Intern','Internship','Design-system engineering','Hybrid',11000,'Per month',8,'2026-10-10','2026-11-28','https://pixelforge.example/ui',7.0,1,3,'Synthetic'),
(13,8,5,1,'Embedded Systems Intern','Internship','Firmware for IoT devices','Onsite',9000,'Per month',10,'2026-10-04','2026-11-14','https://circuitworks.example/embedded',6.5,2,4,'Synthetic'),
(14,1,1,NULL,'Kaggle-style ML Contest','Competition','Predictive modelling contest','Remote',30000,'One time',NULL,'2026-10-11','2026-12-05','https://nimbuslabs.example/contest',0,1,4,'Synthetic'),
(15,2,3,NULL,'Past Analytics Internship','Internship','Closed listing kept for history','Remote',8000,'Per month',8,'2026-08-01','2026-09-15','https://orbitanalytics.example/past',6.0,2,4,'Synthetic');
 
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
(1,1,TRUE),(1,3,TRUE),(1,2,FALSE),
(2,5,TRUE),(2,6,TRUE),(2,7,FALSE),
(3,2,TRUE),(3,8,TRUE),(3,9,FALSE),
(4,1,TRUE),(4,8,FALSE),
(5,3,TRUE),(5,14,FALSE),
(6,4,TRUE),(6,1,TRUE),
(7,6,TRUE),(7,15,FALSE),
(9,10,TRUE),(9,11,FALSE),
(10,11,TRUE),
(11,2,TRUE),(11,14,FALSE),
(12,5,TRUE),(12,6,TRUE),
(13,12,TRUE),(13,13,TRUE),
(14,1,TRUE),(14,3,TRUE);
 
-- Opportunities 4, 7, 8, 10, 14, 15 have no row here: they are open to all branches.
INSERT INTO opportunity_branches (opp_id, branch_id) VALUES
(1,1),(1,2),(2,1),(2,2),(3,1),(3,2),(3,3),(5,1),(5,2),(6,1),
(9,1),(9,2),(9,3),(11,1),(11,2),(11,3),(12,1),(12,2),(13,3),(13,4);
 
-- status = latest status; created_at/updated_at match the history below
INSERT INTO applications (application_id, student_id, opp_id, status, created_at, updated_at) VALUES
(1,1,1,'Interview','2026-10-01 10:00:00','2026-10-18 15:00:00'),
(2,1,4,'Applied','2026-10-02 12:00:00','2026-10-04 10:30:00'),
(3,2,3,'Shortlisted','2026-10-04 09:30:00','2026-10-15 16:00:00'),
(4,3,13,'Rejected','2026-10-05 08:45:00','2026-10-16 10:00:00'),
(5,4,2,'Saved','2026-10-06 17:00:00','2026-10-06 17:00:00'),
(6,6,1,'Selected','2026-10-02 18:00:00','2026-10-20 09:00:00'),
(7,6,5,'Rejected','2026-10-03 19:00:00','2026-10-17 12:00:00'),
(8,2,8,'Saved','2026-10-08 20:00:00','2026-10-08 20:00:00'),
(9,5,13,'Saved','2026-10-09 10:15:00','2026-10-09 10:15:00'),
(10,6,14,'Applied','2026-10-11 21:00:00','2026-10-13 09:45:00');
 
-- One row per status change (these rows are entered by hand here; the optional
-- trigger in 04_optional_trigger.sql can create them automatically instead).
INSERT INTO application_status_history (application_id, status, changed_at, note) VALUES
(1,'Saved','2026-10-01 10:00:00','Application created'),
(1,'Applied','2026-10-03 09:00:00','Submitted by student'),
(1,'Shortlisted','2026-10-12 11:00:00','Shortlisted by organization'),
(1,'Interview','2026-10-18 15:00:00','Interview scheduled'),
(2,'Saved','2026-10-02 12:00:00','Application created'),
(2,'Applied','2026-10-04 10:30:00','Submitted by student'),
(3,'Saved','2026-10-04 09:30:00','Application created'),
(3,'Applied','2026-10-06 14:00:00','Submitted by student'),
(3,'Shortlisted','2026-10-15 16:00:00','Shortlisted by organization'),
(4,'Saved','2026-10-05 08:45:00','Application created'),
(4,'Applied','2026-10-07 13:00:00','Submitted by student'),
(4,'Rejected','2026-10-16 10:00:00','Not selected'),
(5,'Saved','2026-10-06 17:00:00','Application created'),
(6,'Saved','2026-10-02 18:00:00','Application created'),
(6,'Applied','2026-10-03 10:00:00','Submitted by student'),
(6,'Shortlisted','2026-10-10 12:00:00','Shortlisted by organization'),
(6,'Interview','2026-10-14 11:00:00','Interview scheduled'),
(6,'Selected','2026-10-20 09:00:00','Offer received'),
(7,'Saved','2026-10-03 19:00:00','Application created'),
(7,'Applied','2026-10-05 11:00:00','Submitted by student'),
(7,'Rejected','2026-10-17 12:00:00','Not selected'),
(8,'Saved','2026-10-08 20:00:00','Application created'),
(9,'Saved','2026-10-09 10:15:00','Application created'),
(10,'Saved','2026-10-11 21:00:00','Application created'),
(10,'Applied','2026-10-13 09:45:00','Submitted by student');
 
