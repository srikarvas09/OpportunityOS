-- OpportunityOS: complete MySQL 8.0.16+ schema (13 tables)
-- Run this after creating/selecting the database. This script does not drop existing data.

CREATE TABLE IF NOT EXISTS domains (
  domain_id INT AUTO_INCREMENT PRIMARY KEY,
  domain_name VARCHAR(60) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS branches (
  branch_id INT AUTO_INCREMENT PRIMARY KEY,
  branch_name VARCHAR(80) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS locations (
  location_id INT AUTO_INCREMENT PRIMARY KEY,
  city VARCHAR(60) NOT NULL,
  state VARCHAR(60) NOT NULL,
  country VARCHAR(60) NOT NULL DEFAULT 'India',
  CONSTRAINT uq_location UNIQUE (city, state, country)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS skills (
  skill_id INT AUTO_INCREMENT PRIMARY KEY,
  skill_name VARCHAR(60) NOT NULL UNIQUE,
  domain_id INT NULL,
  CONSTRAINT fk_skill_domain FOREIGN KEY (domain_id)
    REFERENCES domains(domain_id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS organizations (
  org_id INT AUTO_INCREMENT PRIMARY KEY,
  org_name VARCHAR(150) NOT NULL,
  org_type ENUM('Company','University','NGO','Government','Other') NOT NULL,
  website VARCHAR(500) NULL,
  hq_location_id INT NULL,
  data_source ENUM('Real','Synthetic') NOT NULL DEFAULT 'Synthetic',
  CONSTRAINT fk_org_location FOREIGN KEY (hq_location_id)
    REFERENCES locations(location_id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS students (
  student_id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  college_name VARCHAR(180) NOT NULL,
  branch_id INT NOT NULL,
  current_year TINYINT NOT NULL,
  cgpa DECIMAL(4,2) NOT NULL,
  preferred_work_mode ENUM('Remote','Onsite','Hybrid','Any') NOT NULL DEFAULT 'Any',
  home_location_id INT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_student_year CHECK (current_year BETWEEN 1 AND 4),
  CONSTRAINT chk_student_cgpa CHECK (cgpa BETWEEN 0 AND 10),
  CONSTRAINT fk_student_branch FOREIGN KEY (branch_id)
    REFERENCES branches(branch_id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_student_location FOREIGN KEY (home_location_id)
    REFERENCES locations(location_id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS opportunities (
  opp_id INT AUTO_INCREMENT PRIMARY KEY,
  org_id INT NOT NULL,
  domain_id INT NOT NULL,
  location_id INT NULL,
  title VARCHAR(200) NOT NULL,
  opp_type ENUM('Internship','Research','Hackathon','Competition','Scholarship') NOT NULL,
  description TEXT NOT NULL,
  work_mode ENUM('Remote','Onsite','Hybrid') NOT NULL,
  reward_amount DECIMAL(12,2) NULL,
  reward_unit ENUM('Per month','One time') NULL,
  duration_weeks INT NULL,
  posted_date DATE NOT NULL,
  deadline DATE NOT NULL,
  application_url VARCHAR(1000) NOT NULL,
  min_cgpa DECIMAL(4,2) NOT NULL DEFAULT 0,
  min_year TINYINT NOT NULL DEFAULT 1,
  max_year TINYINT NOT NULL DEFAULT 4,
  data_source ENUM('Real','Synthetic') NOT NULL DEFAULT 'Synthetic',
  CONSTRAINT chk_opp_cgpa CHECK (min_cgpa BETWEEN 0 AND 10),
  CONSTRAINT chk_opp_years CHECK (min_year BETWEEN 1 AND 4 AND max_year BETWEEN min_year AND 4),
  CONSTRAINT fk_opp_org FOREIGN KEY (org_id)
    REFERENCES organizations(org_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_opp_domain FOREIGN KEY (domain_id)
    REFERENCES domains(domain_id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_opp_location FOREIGN KEY (location_id)
    REFERENCES locations(location_id) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_opp_deadline (deadline),
  INDEX idx_opp_domain (domain_id),
  INDEX idx_opp_posted (posted_date)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS student_skills (
  student_id INT NOT NULL,
  skill_id INT NOT NULL,
  proficiency ENUM('Beginner','Intermediate','Advanced') NOT NULL,
  PRIMARY KEY (student_id, skill_id),
  CONSTRAINT fk_ss_student FOREIGN KEY (student_id) REFERENCES students(student_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_ss_skill FOREIGN KEY (skill_id) REFERENCES skills(skill_id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS student_domains (
  student_id INT NOT NULL,
  domain_id INT NOT NULL,
  PRIMARY KEY (student_id, domain_id),
  CONSTRAINT fk_sd_student FOREIGN KEY (student_id) REFERENCES students(student_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_sd_domain FOREIGN KEY (domain_id) REFERENCES domains(domain_id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS opportunity_skills (
  opp_id INT NOT NULL,
  skill_id INT NOT NULL,
  is_mandatory BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (opp_id, skill_id),
  CONSTRAINT fk_os_opp FOREIGN KEY (opp_id) REFERENCES opportunities(opp_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_os_skill FOREIGN KEY (skill_id) REFERENCES skills(skill_id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS opportunity_branches (
  opp_id INT NOT NULL,
  branch_id INT NOT NULL,
  PRIMARY KEY (opp_id, branch_id),
  CONSTRAINT fk_ob_opp FOREIGN KEY (opp_id) REFERENCES opportunities(opp_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_ob_branch FOREIGN KEY (branch_id) REFERENCES branches(branch_id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS applications (
  application_id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  opp_id INT NOT NULL,
  status ENUM('Saved','Applied','Shortlisted','Interview','Selected','Rejected')
    NOT NULL DEFAULT 'Saved',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uq_one_application UNIQUE (student_id, opp_id),
  CONSTRAINT fk_app_student FOREIGN KEY (student_id) REFERENCES students(student_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_app_opp FOREIGN KEY (opp_id) REFERENCES opportunities(opp_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_app_opp (opp_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS application_status_history (
  history_id INT AUTO_INCREMENT PRIMARY KEY,
  application_id INT NOT NULL,
  status ENUM('Saved','Applied','Shortlisted','Interview','Selected','Rejected') NOT NULL,
  changed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  note VARCHAR(200) NULL,
  CONSTRAINT fk_hist_app FOREIGN KEY (application_id) REFERENCES applications(application_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_hist_app (application_id, changed_at)
) ENGINE=InnoDB;
