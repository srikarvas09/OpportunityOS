-- ---------- Junction (M:N) tables with composite primary keys ----------
CREATE TABLE student_skills (
  student_id   INT NOT NULL,
  skill_id     INT NOT NULL,
  proficiency  ENUM('Beginner','Intermediate','Advanced') NOT NULL,
  PRIMARY KEY (student_id, skill_id),
  CONSTRAINT fk_ss_student FOREIGN KEY (student_id) REFERENCES students(student_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_ss_skill FOREIGN KEY (skill_id) REFERENCES skills(skill_id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;
 
CREATE TABLE student_domains (
  student_id  INT NOT NULL,
  domain_id   INT NOT NULL,
  PRIMARY KEY (student_id, domain_id),
  CONSTRAINT fk_sd_student FOREIGN KEY (student_id) REFERENCES students(student_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_sd_domain FOREIGN KEY (domain_id) REFERENCES domains(domain_id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;
 
CREATE TABLE opportunity_skills (
  opp_id        INT NOT NULL,
  skill_id      INT NOT NULL,
  is_mandatory  BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (opp_id, skill_id),
  CONSTRAINT fk_os_opp FOREIGN KEY (opp_id) REFERENCES opportunities(opp_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_os_skill FOREIGN KEY (skill_id) REFERENCES skills(skill_id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;
 
CREATE TABLE opportunity_branches (
  opp_id     INT NOT NULL,
  branch_id  INT NOT NULL,
  PRIMARY KEY (opp_id, branch_id),
  CONSTRAINT fk_ob_opp FOREIGN KEY (opp_id) REFERENCES opportunities(opp_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_ob_branch FOREIGN KEY (branch_id) REFERENCES branches(branch_id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;
 
