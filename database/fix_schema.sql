
CREATE TABLE IF NOT EXISTS notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  type ENUM('alert', 'recommendation', 'system', 'harvest', 'irrigation') DEFAULT 'system',
  title VARCHAR(255) NOT NULL,
  message TEXT,
  priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
  is_read BOOLEAN DEFAULT FALSE,
  related_entity_type VARCHAR(50),
  related_entity_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES utilisateurs(id_user) ON DELETE CASCADE
);

-- Missing columns in modeles_ia for entity compatibility
-- Removing IF NOT EXISTS as it caused syntax error. If columns exist, this will fail but since we know schema.sql didn't have them, it should be fine.
ALTER TABLE modeles_ia ADD COLUMN version VARCHAR(50);
ALTER TABLE modeles_ia ADD COLUMN description TEXT;
ALTER TABLE modeles_ia ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE modeles_ia ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE modeles_ia ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
