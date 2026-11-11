CREATE TABLE domains (
  domain_id    INT AUTO_INCREMENT PRIMARY KEY,
  domain_name  VARCHAR(60) NOT NULL UNIQUE
) ENGINE=InnoDB;
 
CREATE TABLE branches (
  branch_id    INT AUTO_INCREMENT PRIMARY KEY,
  branch_name  VARCHAR(80) NOT NULL UNIQUE
) ENGINE=InnoDB;
 
CREATE TABLE locations (
  location_id  INT AUTO_INCREMENT PRIMARY KEY,
  city         VARCHAR(60) NOT NULL,
  state        VARCHAR(60) NOT NULL,
  country      VARCHAR(60) NOT NULL DEFAULT 'India',
  CONSTRAINT uq_location UNIQUE (city, state, country)
) ENGINE=InnoDB;
 
CREATE TABLE skills (
  skill_id     INT AUTO_INCREMENT PRIMARY KEY,
  skill_name   VARCHAR(60) NOT NULL UNIQUE,
  domain_id    INT NULL,
  CONSTRAINT fk_skill_domain FOREIGN KEY (domain_id)
    REFERENCES domains(domain_id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;
