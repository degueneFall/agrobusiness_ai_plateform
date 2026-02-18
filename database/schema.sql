-- ============================================================
-- Script SQL pour Agrobusiness AI Platform
-- Database: agribusiness_ai_db
-- ============================================================

-- Créer la base de données si elle n'existe pas
CREATE DATABASE IF NOT EXISTS agribusiness_ai_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE agribusiness_ai_db;

-- ============================================================
-- Table UTILISATEURS
-- ============================================================
CREATE TABLE IF NOT EXISTS utilisateurs (
  id_user INT PRIMARY KEY AUTO_INCREMENT,
  nom VARCHAR(100),
  prenom VARCHAR(100),
  email VARCHAR(150) UNIQUE,
  mot_de_passe VARCHAR(255),
  role ENUM('agriculteur','agronome','admin','super_admin') DEFAULT 'agriculteur',
  telephone VARCHAR(30),
  date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- Table REGIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS regions (
  id_region INT PRIMARY KEY AUTO_INCREMENT,
  nom_region VARCHAR(100),
  pays VARCHAR(100) DEFAULT 'Sénégal'
);

-- ============================================================
-- Table ZONES
-- ============================================================
CREATE TABLE IF NOT EXISTS zones (
  id_zone INT PRIMARY KEY AUTO_INCREMENT,
  nom_zone VARCHAR(100),
  id_region INT,
  latitude DECIMAL(10,6),
  longitude DECIMAL(10,6),
  altitude FLOAT,
  superficie_ha FLOAT,
  type_zone VARCHAR(50),
  FOREIGN KEY (id_region) REFERENCES regions(id_region) ON DELETE CASCADE
);

-- ============================================================
-- Table SOL (référentiel types de sol)
-- ============================================================
CREATE TABLE IF NOT EXISTS sol (
  id_sol INT PRIMARY KEY AUTO_INCREMENT,
  type_sol VARCHAR(50),
  description TEXT
);

-- ============================================================
-- Table CLIMAT (référentiel types de climat)
-- ============================================================
CREATE TABLE IF NOT EXISTS climat (
  id_climat INT PRIMARY KEY AUTO_INCREMENT,
  type_climat VARCHAR(50),
  description TEXT
);

-- ============================================================
-- Table PARCELLES
-- ============================================================
CREATE TABLE IF NOT EXISTS parcelles (
  id_parcelle INT PRIMARY KEY AUTO_INCREMENT,
  id_zone INT,
  id_user INT,
  nom_parcelle VARCHAR(100),
  superficie FLOAT,
  latitude DECIMAL(10,6),
  longitude DECIMAL(10,6),
  statut ENUM('active','jachère','préparation') DEFAULT 'active',
  date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_zone) REFERENCES zones(id_zone) ON DELETE SET NULL,
  FOREIGN KEY (id_user) REFERENCES utilisateurs(id_user) ON DELETE CASCADE
);

-- ============================================================
-- Table DONNEES_SOL (mesures sol par parcelle)
-- ============================================================
CREATE TABLE IF NOT EXISTS donnees_sol (
  id_ds INT PRIMARY KEY AUTO_INCREMENT,
  id_parcelle INT,
  ph FLOAT,
  azote FLOAT COMMENT 'Azote (N) en kg/ha',
  phosphore FLOAT COMMENT 'Phosphore (P) en kg/ha',
  potassium FLOAT COMMENT 'Potassium (K) en kg/ha',
  humidite FLOAT COMMENT 'Humidité en %',
  id_sol INT,
  date_mesure DATE,
  FOREIGN KEY (id_parcelle) REFERENCES parcelles(id_parcelle) ON DELETE CASCADE,
  FOREIGN KEY (id_sol) REFERENCES sol(id_sol) ON DELETE SET NULL
);

-- ============================================================
-- Table DONNEES_CLIMAT (mesures climat par zone)
-- ============================================================
CREATE TABLE IF NOT EXISTS donnees_climat (
  id_dc INT PRIMARY KEY AUTO_INCREMENT,
  id_zone INT,
  temperature FLOAT COMMENT 'Température en °C',
  pluviometrie FLOAT COMMENT 'Pluviométrie en mm',
  humidite FLOAT COMMENT 'Humidité atmosphérique en %',
  ensoleillement FLOAT COMMENT 'Ensoleillement en heures/jour',
  id_climat INT,
  date_mesure DATE,
  FOREIGN KEY (id_zone) REFERENCES zones(id_zone) ON DELETE CASCADE,
  FOREIGN KEY (id_climat) REFERENCES climat(id_climat) ON DELETE SET NULL
);

-- ============================================================
-- Table CULTURES
-- ============================================================
CREATE TABLE IF NOT EXISTS cultures (
  id_culture INT PRIMARY KEY AUTO_INCREMENT,
  nom_culture VARCHAR(100),
  description TEXT,
  duree_cycle INT COMMENT 'Durée du cycle en jours'
);

-- ============================================================
-- Table SEMENCES
-- ============================================================
CREATE TABLE IF NOT EXISTS semences (
  id_semence INT PRIMARY KEY AUTO_INCREMENT,
  id_culture INT,
  nom_semence VARCHAR(100),
  fournisseur VARCHAR(100),
  rendement_moyen FLOAT COMMENT 'Rendement moyen en tonnes/ha',
  prix_unitaire DECIMAL(10,2) COMMENT 'Prix en FCFA/kg',
  FOREIGN KEY (id_culture) REFERENCES cultures(id_culture) ON DELETE CASCADE
);

-- ============================================================
-- Table EXIGENCES_SEMENCES
-- ============================================================
CREATE TABLE IF NOT EXISTS exigences_semences (
  id_exigence INT PRIMARY KEY AUTO_INCREMENT,
  id_semence INT,
  ph_min FLOAT,
  ph_max FLOAT,
  pluie_min FLOAT COMMENT 'Pluviométrie minimale en mm/an',
  pluie_max FLOAT COMMENT 'Pluviométrie maximale en mm/an',
  temperature_min FLOAT COMMENT 'Température min en °C',
  temperature_max FLOAT COMMENT 'Température max en °C',
  type_sol VARCHAR(50) COMMENT 'Type de sol recommandé',
  azote_min FLOAT COMMENT 'Azote minimal requis en kg/ha',
  phosphore_min FLOAT COMMENT 'Phosphore minimal requis en kg/ha',
  potassium_min FLOAT COMMENT 'Potassium minimal requis en kg/ha',
  FOREIGN KEY (id_semence) REFERENCES semences(id_semence) ON DELETE CASCADE
);

-- ============================================================
-- Table RENDEMENTS_HISTORIQUES
-- ============================================================
CREATE TABLE IF NOT EXISTS rendements_historiques (
  id_rendement INT PRIMARY KEY AUTO_INCREMENT,
  id_parcelle INT,
  id_semence INT,
  annee INT,
  rendement FLOAT COMMENT 'Rendement obtenu en tonnes/ha',
  cout_production DECIMAL(10,2) COMMENT 'Coût total en FCFA',
  prix_vente DECIMAL(10,2) COMMENT 'Prix de vente en FCFA/kg',
  benefice_net DECIMAL(10,2) COMMENT 'Bénéfice net en FCFA',
  FOREIGN KEY (id_parcelle) REFERENCES parcelles(id_parcelle) ON DELETE CASCADE,
  FOREIGN KEY (id_semence) REFERENCES semences(id_semence) ON DELETE CASCADE
);

-- ============================================================
-- Table MODELES_IA
-- ============================================================
CREATE TABLE IF NOT EXISTS modeles_ia (
  id_modele INT PRIMARY KEY AUTO_INCREMENT,
  nom_modele VARCHAR(100),
  type_modele VARCHAR(50) COMMENT 'prediction_rendement, analyse_sol, compatibilite, etc.',
  `precision` FLOAT COMMENT 'Précision du modèle en %',
  date_entrainement DATE,
  chemin_fichier VARCHAR(255),
  hyperparametres JSON COMMENT 'Paramètres du modèle',
  variables_entree JSON COMMENT 'Variables utilisées',
  statut ENUM('entraînement','production','archivé') DEFAULT 'entraînement'
);

-- ============================================================
-- Table RECOMMANDATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS recommandations (
  id_recommandation INT PRIMARY KEY AUTO_INCREMENT,
  id_parcelle INT,
  id_semence INT,
  id_modele INT,
  score FLOAT COMMENT 'Score de compatibilité 0-100',
  rendement_predit FLOAT COMMENT 'Rendement prédit en tonnes/ha',
  niveau_confiance FLOAT COMMENT 'Niveau de confiance 0-100',
  explications TEXT COMMENT 'Explications détaillées',
  date_recommandation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_parcelle) REFERENCES parcelles(id_parcelle) ON DELETE CASCADE,
  FOREIGN KEY (id_semence) REFERENCES semences(id_semence) ON DELETE CASCADE,
  FOREIGN KEY (id_modele) REFERENCES modeles_ia(id_modele) ON DELETE SET NULL
);

-- ============================================================
-- Table CARTES
-- ============================================================
CREATE TABLE IF NOT EXISTS cartes (
  id_carte INT PRIMARY KEY AUTO_INCREMENT,
  type_carte VARCHAR(50) COMMENT 'NDVI, pH, humidité, pluviométrie, etc.',
  id_zone INT,
  chemin_fichier VARCHAR(255),
  date_generation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  parametres JSON COMMENT 'Paramètres de génération',
  FOREIGN KEY (id_zone) REFERENCES zones(id_zone) ON DELETE CASCADE
);

-- ============================================================
-- Table HISTORIQUE_ACTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS historique_actions (
  id_action INT PRIMARY KEY AUTO_INCREMENT,
  id_user INT,
  action VARCHAR(255),
  details TEXT,
  date_action TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_user) REFERENCES utilisateurs(id_user) ON DELETE CASCADE
);

-- ============================================================
-- DATA SEED - Données de référence
-- ============================================================

-- Insérer types de sol
INSERT IGNORE INTO sol (type_sol, description) VALUES
('Argileux', 'Sol riche en argile, retient bien l\'eau'),
('Sableux', 'Sol léger, bien drainé mais peu fertile'),
('Limoneux', 'Sol fertile avec bonne rétention d\'eau'),
('Humifère', 'Sol riche en matière organique'),
('Mixte', 'Combinaison de plusieurs types de sol');

-- Insérer types de climat
INSERT IGNORE INTO climat (type_climat, description) VALUES
('Sahélien', 'Climat semi-aride avec saison sèche prolongée'),
('Tropical', 'Climat chaud et humide toute l\'année'),
('Soudanien', 'Climat tropical avec saison sèche marquée'),
('Guinéen', 'Climat équatorial très humide');

-- Insérer régions du Sénégal
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

-- Insérer cultures
INSERT IGNORE INTO cultures (nom_culture, description, duree_cycle) VALUES
('Arachide', 'Culture oléagineuse principale du Sénégal', 120),
('Mil', 'Céréale de base pour l\'alimentation', 90),
('Maïs', 'Céréale à haut rendement', 100),
('Riz', 'Céréale cultivée en zone humide', 120),
('Niébé', 'Légumineuse riche en protéines', 75),
('Sorgho', 'Céréale résistante à la sécheresse', 110),
('Manioc', 'Tubercule de base', 300),
('Tomate', 'Culture maraîchère', 70),
('Oignon', 'Culture maraîchère', 120),
('Pastèque', 'Culture maraîchère', 90);

-- ============================================================
-- Index pour performances
-- ============================================================

CREATE INDEX idx_parcelles_user ON parcelles(id_user);
CREATE INDEX idx_parcelles_zone ON parcelles(id_zone);
CREATE INDEX idx_donnees_sol_parcelle ON donnees_sol(id_parcelle);
CREATE INDEX idx_donnees_climat_zone ON donnees_climat(id_zone);
CREATE INDEX idx_recommandations_parcelle ON recommandations(id_parcelle);
CREATE INDEX idx_rendements_parcelle ON rendements_historiques(id_parcelle);
CREATE INDEX idx_cartes_zone ON cartes(id_zone);
CREATE INDEX idx_historique_user ON historique_actions(id_user);

-- ============================================================
-- Fin du script
-- ============================================================
