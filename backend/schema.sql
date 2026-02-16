-- schema.sql
CREATE DATABASE IF NOT EXISTS reservation_salle
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE reservation_salle;

-- ========================================
-- TABLE USERS
-- ========================================
CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- bcrypt hash
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email)
) ENGINE=InnoDB;

-- ========================================
-- TABLE ROOMS (Anticipation V2)
-- ========================================
CREATE TABLE IF NOT EXISTS rooms (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    capacity INT UNSIGNED DEFAULT 12,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ========================================
-- TABLE RESERVATIONS
-- ========================================
CREATE TABLE IF NOT EXISTS reservations (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NULL, -- NULL si suppression user (RGPD)
    room_id INT UNSIGNED NOT NULL DEFAULT 1,
    title VARCHAR(255) NOT NULL, -- Objet de la réunion (requis Brief)
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Clés étrangères
    CONSTRAINT fk_reservations_user 
        FOREIGN KEY (user_id) REFERENCES users(id) 
        ON DELETE SET NULL,
        
    CONSTRAINT fk_reservations_room 
        FOREIGN KEY (room_id) REFERENCES rooms(id) 
        ON DELETE CASCADE,
    
    -- Index pour performances
    INDEX idx_reservation_period (start_time, end_time),
    INDEX idx_reservation_room (room_id),
    INDEX idx_user_reservations (user_id)
) ENGINE=InnoDB;

-- ========================================
-- DONNÉES INITIALES
-- ========================================
INSERT INTO rooms (id, name, capacity, description) 
VALUES (1, 'Salle de Réunion Principale', 12, 'Salle unique avec tableau blanc et projecteur')
ON DUPLICATE KEY UPDATE name=name; -- Évite erreur si déjà existante

-- ========================================
-- VALIDATION MÉTIER (à gérer côté Backend)
-- ========================================
-- Les contraintes CHECK MySQL < 8.0.16 ne sont pas fiables
-- Implémenter dans backend/validators/reservation.validator.js :
-- 1. start_time < end_time
-- 2. Durée >= 1h
-- 3. Plage 8h-19h (heures pleines uniquement)
-- 4. Jours ouvrés (lundi-vendredi)
-- 5. Pas de chevauchement