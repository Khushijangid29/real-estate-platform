-- Drop existing database if it exists
DROP DATABASE IF EXISTS real_estate;
CREATE DATABASE real_estate;
USE real_estate;

-- Users Table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    profile_image VARCHAR(255),
    user_type ENUM('buyer', 'seller', 'agent', 'admin') DEFAULT 'buyer',
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_user_type (user_type)
);

-- Agents Table
CREATE TABLE agents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL UNIQUE,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    agency_name VARCHAR(255),
    experience_years INT,
    specialization VARCHAR(255),
    rating DECIMAL(3,2) DEFAULT 0,
    total_properties INT DEFAULT 0,
    bio TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_agency (agency_name)
);

-- Properties Table
CREATE TABLE properties (
    id INT PRIMARY KEY AUTO_INCREMENT,
    agent_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    property_type ENUM('residential', 'commercial', 'land', 'industrial') NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    zipcode VARCHAR(20),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    area_sqft INT,
    bedrooms INT,
    bathrooms INT,
    parking_spaces INT,
    furnishing_type ENUM('unfurnished', 'semi-furnished', 'fully-furnished'),
    amenities JSON,
    status ENUM('available', 'sold', 'pending', 'off-market') DEFAULT 'available',
    featured BOOLEAN DEFAULT FALSE,
    views_count INT DEFAULT 0,
    virtual_tour_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE,
    INDEX idx_city (city),
    INDEX idx_price (price),
    INDEX idx_status (status),
    FULLTEXT INDEX ft_title_desc (title, description)
);

-- Property Images Table
CREATE TABLE property_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    property_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    INDEX idx_property (property_id)
);

-- Appointments/Viewings Table
CREATE TABLE appointments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    property_id INT NOT NULL,
    user_id INT NOT NULL,
    agent_id INT NOT NULL,
    appointment_date DATETIME NOT NULL,
    appointment_type ENUM('viewing', 'consultation', 'inspection') DEFAULT 'viewing',
    status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE,
    INDEX idx_date (appointment_date),
    INDEX idx_status (status)
);

-- Favorites/Wishlist Table
CREATE TABLE favorites (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    property_id INT NOT NULL,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_favorite (user_id, property_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- Reviews/Ratings Table
CREATE TABLE reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    property_id INT,
    agent_id INT,
    user_id INT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_rating (rating)
);

-- Special Offers Table
CREATE TABLE special_offers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    discount_percentage INT,
    discount_amount DECIMAL(12,2),
    valid_from DATETIME NOT NULL,
    valid_until DATETIME NOT NULL,
    image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_active (is_active)
);

-- Visitor Counter Table
CREATE TABLE visitor_stats (
    id INT PRIMARY KEY AUTO_INCREMENT,
    date DATE UNIQUE,
    total_visitors INT DEFAULT 0,
    unique_visitors INT DEFAULT 0,
    property_views INT DEFAULT 0,
    bookings_made INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Events/Open Houses Table
CREATE TABLE events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    property_id INT,
    event_name VARCHAR(255) NOT NULL,
    event_type ENUM('open-house', 'auction', 'seminar', 'tour') DEFAULT 'open-house',
    event_date DATETIME NOT NULL,
    duration_minutes INT,
    description TEXT,
    created_by INT NOT NULL,
    attendees_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_date (event_date)
);

-- Refund Policy Table
CREATE TABLE refund_policies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    policy_title VARCHAR(255) NOT NULL,
    policy_content TEXT NOT NULL,
    effective_date DATE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sample Data
INSERT INTO users (name, email, password, phone, user_type) VALUES
('Admin User', 'admin@realestate.com', '$2a$10$8x.6YPU0p9TjN2Qm8w7bKesX8Y0Q0Q0Q0Q0Q0Q0Q0Q0Q0', '1234567890', 'admin'),
('John Agent', 'john@agent.com', '$2a$10$8x.6YPU0p9TjN2Qm8w7bKesX8Y0Q0Q0Q0Q0Q0Q0Q0Q0Q0', '9876543210', 'agent'),
('Jane Buyer', 'jane@buyer.com', '$2a$10$8x.6YPU0p9TjN2Qm8w7bKesX8Y0Q0Q0Q0Q0Q0Q0Q0Q0Q0', '5555555555', 'buyer');

INSERT INTO agents (user_id, license_number, agency_name, experience_years, specialization) VALUES
(2, 'LIC001', 'Premier Real Estate', 5, 'Residential');

INSERT INTO special_offers (title, description, discount_percentage, valid_from, valid_until, is_active) VALUES
('Summer Sale', 'Get 15% off on all properties', 15, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), TRUE);

INSERT INTO visitor_stats (date, total_visitors) VALUES
(CURDATE(), 0);

INSERT INTO refund_policies (policy_title, policy_content) VALUES
('Standard Refund Policy', 'Refunds are processed within 7-10 business days. Terms and conditions apply.');