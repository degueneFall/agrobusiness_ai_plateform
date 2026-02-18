-- Script pour ajouter la table regions manquante
USE agribusiness_ai_db;

-- Créer la table regions
CREATE TABLE IF NOT EXISTS regions (
  id_region INT PRIMARY KEY AUTO_INCREMENT,
  nom_region VARCHAR(100),
  pays VARCHAR(100) DEFAULT 'Sénégal'
);

-- Insérer les 14 régions du Sénégal
INSERT IGNORE INTO regions (nom_region, pays) VALUES
('Dakar', 'Sénégal'),
('Thiès', 'Sénégal'),
('Diourbel', 'Sénégal'),
('Fatick', 'Sénégal'),
('Kaolack', 'Sénégal'),
('Kolda', 'Sénégal'),
('Louga', 'Sénégal'),
('Matam', 'Sénégal'),
('Saint-Louis', 'Sénégal'),
('Tambacounda', 'Sénégal'),
('Ziguinchor', 'Sénégal'),
('Kaffrine', 'Sénégal'),
('Kédougou', 'Sénégal'),
('Sédhiou', 'Sénégal');
