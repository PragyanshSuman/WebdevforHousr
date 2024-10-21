CREATE DATABASE IF NOT EXISTS accommodation_finder;

USE accommodation_finder;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('USER', 'BROKER') NOT NULL
);

CREATE TABLE accommodations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    distance_from_university DECIMAL(5, 2) NOT NULL,
    contact_email VARCHAR(100) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    broker_id INT NOT NULL,
    FOREIGN KEY (broker_id) REFERENCES users(id)
);

CREATE TABLE amenities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE accommodation_amenities (
    accommodation_id INT,
    amenity_id INT,
    PRIMARY KEY (accommodation_id, amenity_id),
    FOREIGN KEY (accommodation_id) REFERENCES accommodations(id),
    FOREIGN KEY (amenity_id) REFERENCES amenities(id)
);

CREATE TABLE photos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    accommodation_id INT,
    photo_url VARCHAR(255) NOT NULL,
    FOREIGN KEY (accommodation_id) REFERENCES accommodations(id)
);

-- Insert some initial amenities
INSERT INTO amenities (name) VALUES 
('Wi-Fi'), ('AC'), ('Furnished'), ('Parking');