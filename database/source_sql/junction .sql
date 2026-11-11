-- ---------- Application tracking ----------
CREATE TABLE applications (
  application_id  INT AUTO_INCREMENT PRIMARY KEY,
  student_id      INT NOT NULL,
  opp_id          INT NOT NULL,
  status          ENUM('Saved','Applied','Shortlisted','Interview','Selected','Rejected')
                  NOT NULL DEFAULT 'Saved',
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uq_one_application UNIQUE (student_id, opp_id),
  CONSTRAINT fk_app_student FOREIGN KEY (student_id) REFERENCES students(student_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_app_opp FOREIGN KEY (opp_id) REFERENCES opportunities(opp_id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;
 
CREATE TABLE application_status_history (
  history_id      INT AUTO_INCREMENT PRIMARY KEY,
  application_id  INT NOT NULL,
  status          ENUM('Saved','Applied','Shortlisted','Interview','Selected','Rejected') NOT NULL,
  changed_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  note            VARCHAR(200),
  CONSTRAINT fk_hist_app FOREIGN KEY (application_id) REFERENCES applications(application_id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;
 
-- ---------- Indexes for common searches ----------
CREATE INDEX idx_opp_deadline ON opportunities(deadline);
CREATE INDEX idx_opp_domain   ON opportunities(domain_id);
CREATE INDEX idx_app_opp      ON applications(opp_id);
CREATE INDEX idx_hist_app     ON application_status_history(application_id, changed_at);
 
