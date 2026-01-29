-- ============================================
-- VSA Database Schema
-- Veterans Sportsmens Association
-- MySQL Version
-- ============================================

-- Create database if it doesn't exist (uncomment if needed)
-- CREATE DATABASE IF NOT EXISTS VSA;
USE VSA;

-- Drop tables if they exist (for clean setup)
-- Uncomment these if you need to recreate the database
-- Note: Drop tables with foreign keys first, then the tables they reference
DROP TABLE IF EXISTS event_registrations;
DROP TABLE IF EXISTS event_details;
DROP TABLE IF EXISTS email_verifications;
DROP TABLE IF EXISTS gallery_images;
DROP TABLE IF EXISTS news;
DROP TABLE IF EXISTS programs;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS users;

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'member') NOT NULL DEFAULT 'member',
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    join_date DATE NOT NULL,
    email_opt_in TINYINT(1) NOT NULL DEFAULT 0,
    email_verified TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_email_verified ON users(email_verified);

-- ============================================
-- EVENTS TABLE
-- ============================================
-- Combined table for both VSA and ShredVets events
-- Use event_type to distinguish: 'vsa' or 'shredvets'
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    event_type ENUM('vsa', 'shredvets') NOT NULL DEFAULT 'vsa',
    canceled TINYINT(1) NOT NULL DEFAULT 0,
    date_changed TINYINT(1) NOT NULL DEFAULT 0,
    location_changed TINYINT(1) NOT NULL DEFAULT 0,
    original_date VARCHAR(50),
    original_location VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_events_type ON events(event_type);
CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_canceled ON events(canceled);

-- ============================================
-- EVENT DETAILS TABLE
-- ============================================
-- Stores detailed information for events that have detail pages
CREATE TABLE IF NOT EXISTS event_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    subtitle VARCHAR(255),
    details JSON NOT NULL, -- Array of detail paragraphs stored as JSON
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

CREATE INDEX idx_event_details_event_id ON event_details(event_id);
CREATE INDEX idx_event_details_slug ON event_details(slug);

-- ============================================
-- PROGRAMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS programs (
    id VARCHAR(100) PRIMARY KEY, -- Using string IDs like "shredvets"
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    link VARCHAR(255), -- Internal route like "/shredvets"
    url VARCHAR(500), -- External URL
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- NEWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS news (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    published_date DATE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_news_published_date ON news(published_date);

-- ============================================
-- GALLERY IMAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS gallery_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    caption VARCHAR(500),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_gallery_display_order ON gallery_images(display_order);

-- ============================================
-- EMAIL VERIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS email_verifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    email VARCHAR(255) NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_email_change TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_verifications_token ON email_verifications(token);
CREATE INDEX idx_verifications_user_id ON email_verifications(user_id);
CREATE INDEX idx_verifications_expires_at ON email_verifications(expires_at);

-- ============================================
-- EVENT REGISTRATIONS TABLE
-- ============================================
-- Stores registrations from the RegistrationDialog
-- Can be linked to a user (if logged in) or anonymous
CREATE TABLE IF NOT EXISTS event_registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    user_id INT NULL, -- NULL if anonymous registration
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    message TEXT,
    registration_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_registrations_event_id ON event_registrations(event_id);
CREATE INDEX idx_registrations_user_id ON event_registrations(user_id);
CREATE INDEX idx_registrations_email ON event_registrations(email);

-- ============================================
-- INSERT DATA
-- ============================================

-- Insert Users
-- Note: Password hashes are bcrypt hashes. In production, generate these securely.
-- Default admin: admin@vsa.org / admin123
-- Default member: john@example.com / password123
INSERT INTO users (id, name, email, phone, password_hash, role, status, join_date, email_opt_in) VALUES
(1, 'Admin User', 'admin@vsa.org', '(555) 123-4567', '$2a$10$rK8X8X8X8X8X8X8X8X8X8u8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X', 'admin', 'active', '2024-01-01', true),
(2, 'John Doe', 'john@example.com', '(555) 234-5678', '$2a$10$rK8X8X8X8X8X8X8X8X8X8u8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X', 'member', 'active', '2024-01-15', 0);

-- Reset auto increment for users table (optional - only needed if inserting with specific IDs)
-- Note: MySQL doesn't allow subqueries in ALTER TABLE, so set manually if needed
-- ALTER TABLE users AUTO_INCREMENT = 3;

-- Insert VSA Events
INSERT INTO events (id, date, title, location, slug, event_type, canceled, date_changed, location_changed) VALUES
(1, 'Sat, Jan 31', 'Jack Frost Ski Resort', 'Jack Frost Ski Resort', 'jack-frost-ski-resort-jan-31', 'vsa', 0, 0, 0),
(2, 'Sat, Feb 07', 'NRA Great Outdoor Show 2026', '2300 N Cameron St', NULL, 'vsa', 0, 0, 0),
(3, 'Sat, Feb 07', 'Team River Runner - Kayaking Workshop', 'Montrose VA - Pool', NULL, 'vsa', 0, 0, 0),
(4, 'Sat, Mar 07', 'Wappingers Creek Clean Up', 'Veterans Sportsmens Association', NULL, 'vsa', 0, 0, 0),
(5, 'Wed, Mar 11', 'DCSO Game Dinner', 'Poughkeepsie', NULL, 'vsa', 0, 0, 0),
(6, 'Sat, Mar 14', 'Shawnee Mountain', 'Shawnee Mountain', NULL, 'vsa', 0, 0, 0),
(7, 'Sat, Mar 21', 'NRA CCW Course', 'Veterans Sportsmens Association', NULL, 'vsa', 0, 0, 0),
(8, 'Sat, Mar 21', 'New York State Pistol Permit Safety Course', 'Veterans Sportsmens Association', NULL, 'vsa', 0, 0, 0),
(9, 'Sat, Apr 04', 'Wappingers Creek Clean Up', 'Veterans Sportsmens Association', NULL, 'vsa', 0, 0, 0),
(10, 'Sat, Apr 18', 'Wappingers Creek Clean Up', 'Veterans Sportsmens Association', NULL, 'vsa', 0, 0, 0),
(11, 'Sat, Apr 25', '51st Wappingers Creek Water Derby', 'Pleasant Valley', NULL, 'vsa', 0, 0, 0),
(12, 'Sat, May 30', 'Introduction to Precision Rifle Shooting', 'Tommy Gun Warehouse', NULL, 'vsa', 0, 0, 0),
(13, 'Sat, May 30', 'NRA Basic Rifle Course', 'Greeley', NULL, 'vsa', 0, 0, 0);

-- Insert ShredVets Events
INSERT INTO events (id, date, title, location, slug, event_type, canceled, date_changed, location_changed) VALUES
(14, 'Sat, Jan 31', 'Jack Frost', 'Jack Frost Ski Resort', 'jack-frost-jan-31', 'shredvets', 0, 0, 0),
(15, 'Tue, Feb 03', 'Windham Mountain', 'Windham', NULL, 'shredvets', 0, 0, 0),
(16, 'Thu, Feb 12', 'Windham Mountain', 'Windham', NULL, 'shredvets', 0, 0, 0),
(17, 'Tue, Feb 17', 'Plattekill Mountain', 'Plattekill mountain 469 Plattekill Road Roxbury NY 12474', NULL, 'shredvets', 0, 0, 0),
(18, 'Fri, Feb 20', 'Thunder Ridge', 'Thunder Ridge', NULL, 'shredvets', 0, 0, 0),
(19, 'Fri, Feb 27', 'Plattekill Mountain', 'Plattekill mountain 469 Plattekill Road Roxbury NY 12474', NULL, 'shredvets', 0, 0, 0),
(20, 'Fri, Mar 13', 'Shawnee Mountain', 'Shawnee Mountain', NULL, 'shredvets', 0, 0, 0),
(21, 'Sun, Feb 14', 'Whistler Ski Resort 2027', 'Whistler', NULL, 'shredvets', 0, 0, 0);

-- Reset auto increment for events table (optional - only needed if inserting with specific IDs)
-- ALTER TABLE events AUTO_INCREMENT = 22;

-- Insert Event Details
-- Note: details are stored as JSON array
INSERT INTO event_details (event_id, slug, subtitle, details) VALUES
((SELECT id FROM events WHERE slug = 'jack-frost-jan-31'), 'jack-frost-jan-31', 'ShredVets Trip', 
 JSON_ARRAY(
    'Join ShredVets at Jack Frost Ski Resort for a day on the slopes. This trip is free for veterans—ski or snowboard, with free equipment and lessons available when arranged in advance.',
    'Skiing ipsum dolor sit amet, carve the corduroy and lay down fresh tracks through the powder. Groomers and moguls await as you drop into the fall line. The chairlift carries you above the treeline where the snow is deep and the views are endless.',
    'Snowboard ipsum rails and boxes in the terrain park, then cruise the blue squares back to the lodge. Hot chocolate and chili by the fire after a long run. Our instructors will help first-timers find their edges and build confidence on the mountain.',
    'Meet at the resort base by 8:30 AM for check-in and equipment fitting. We''ll have a brief safety and run overview before heading up. Lunch is on your own at the lodge; we''ll regroup in the afternoon for optional group runs.',
    'Registration is required. Contact ShredVets to reserve your spot and arrange free rentals if needed. Veterans, active duty, and family members welcome.'
)),
((SELECT id FROM events WHERE slug = 'jack-frost-ski-resort-jan-31'), 'jack-frost-ski-resort-jan-31', 'VSA Event',
 JSON_ARRAY(
    'Join the Veterans Sportsmens Association at Jack Frost Ski Resort for a day on the slopes. This event is open to all veterans and their families.',
    'Skiing ipsum dolor sit amet, carve the corduroy and lay down fresh tracks through the powder. Groomers and moguls await as you drop into the fall line. The chairlift carries you above the treeline where the snow is deep and the views are endless.',
    'Snowboard ipsum rails and boxes in the terrain park, then cruise the blue squares back to the lodge. Hot chocolate and chili by the fire after a long run. Our instructors will help first-timers find their edges and build confidence on the mountain.',
    'Meet at the resort base by 8:30 AM for check-in and equipment fitting. We''ll have a brief safety and run overview before heading up. Lunch is on your own at the lodge; we''ll regroup in the afternoon for optional group runs.',
    'Registration is required. Contact the VSA to reserve your spot. Veterans, active duty, and family members welcome.'
));

-- Insert Programs
INSERT INTO programs (id, title, description, link, url) VALUES
('shredvets', 'ShredVets', 'Veterans can ski for FREE with ShredVets. ShredVets is an organization that provides Hudson Valley veterans with free participation in skiing and snowboarding at several local Mountain ski areas.', '/shredvets', NULL),
('team-river-runner', 'Team River Runner', 'The VSA has partnered up with Team River Runner (TRR) to establish the Hudson Valley Team River Runner (HV TRR) Chapter. Team River Runner is the LARGEST adaptive and therapeutic paddling program across the nation for veterans, active duty and their families.', NULL, NULL),
('firearms-training', 'Firearms Training', 'We provide comprehensive firearms training including NRA courses, New York State Pistol Permit Safety Courses, and Law Enforcement training programs.', NULL, NULL),
('water-derby', 'Wappingers Creek Water Derby', 'The Wappingers Creek Derby is a canoe and kayak race that takes place the last Saturday in April each spring from Pleasant Valley NY, passing through LaGrange, and ending in the Town of Poughkeepsie.', NULL, NULL),
('whiskey-bbq', 'Whiskey Bourbon & BBQ', 'Annual fundraising event featuring local New York and Veteran Owned Distilleries, live music, and BBQ. All funds raised directly support Local Veterans.', NULL, NULL),
('veterans-safe', 'Veterans Safe Program', 'Providing FREE training to nonprofit organizations, schools and churches including Civilian Response to Active Shooter Events (CRASE) course.', NULL, NULL);

-- Insert News
INSERT INTO news (id, title, description, published_date) VALUES
(1, 'ShredVets - December 2025 Winner', 'Every month, 101.5 WPDH, MHA of Dutchess County and Mid-Hudson Pump shine a spotlight on a different veteran organization and donate $500 to help them continue their work. This month, we''ve selected Breezy Grenier and her organization, ShredVets.', NULL),
(2, '2025 VSA Raffle', '1 LIBERTY 1911 CUSTOM - ONLY 200 TICKETS WILL BE SOLD at $20 Each AND 1 REVOLUTION 1911 CUSTOM - ONLY 200 TICKETS WILL BE SOLD at $20 Each. BOTH 1911''s Generously Donated by KAHR ARMS.', NULL),
(3, 'Wappingers Creek Water Derby Returns', 'The Veterans Sportsmens Association (VSA) has teamed up with the Aquatic Explorers Scuba Club (AESC) to bring back the annual spring Wappingers Creek Water Derby for 2025. This canoe and kayak racing event is scheduled for Saturday, 26 April 2025.', NULL),
(4, 'New Team Member', 'Major Patrick Cordova (RET.) has joined as Public Information Officer (PIO). Patrick has been in Public Affairs since 2005 and has participated in numerous domestic operations.', NULL),
(5, 'VSA in Pennsylvania', 'The Veterans Sportsmens Association started a new VSA Chapter for the State of Pennsylvania in the Poconos region. Meeting locations, social events, training and shooting events will be listed on the PA Chapter.', NULL),
(6, 'Training Courses at Kahr Arms', 'In 2023 The Veterans Sportsmens Association began offering NRA Courses at Kahr Arms in Greeley PA at their Tommy Gun Warehouse. We greatly appreciate their partnership with the VSA.', NULL);

-- Reset auto increment for news table (optional - only needed if inserting with specific IDs)
-- ALTER TABLE news AUTO_INCREMENT = 7;

-- Insert Gallery Images
INSERT INTO gallery_images (id, url, alt_text, caption, display_order) VALUES
(1, 'https://static.wixstatic.com/media/30c799_6c5b7f47d057455497bc4936c6462790~mv2.jpg', 'VSA Event', NULL, 1),
(2, 'https://static.wixstatic.com/media/99ec98fdb81945c29c25a3ad6c5606b1.jpg', 'VSA Activity', NULL, 2),
(3, 'https://static.wixstatic.com/media/30c799_56468b7c375d4956ac7b3039bbaf4789~mv2.jpg', 'VSA Program', NULL, 3),
(4, 'https://static.wixstatic.com/media/30c799_e52caab3522f42b2b32b55b48215eeb7~mv2.jpg', 'VSA Event', NULL, 4),
(5, 'https://static.wixstatic.com/media/30c799_958dd0efbd1c4f26bba179a9dd2d1261~mv2.jpg', 'VSA Activity', NULL, 5),
(6, 'https://static.wixstatic.com/media/30c799_10bf358ef0a74b6ab84752c574bcacfe~mv2.jpg', 'VSA Program', NULL, 6);

-- Reset sequence for gallery_images table
-- Reset auto increment for gallery_images table (optional - only needed if inserting with specific IDs)
-- ALTER TABLE gallery_images AUTO_INCREMENT = 7;

-- ============================================
-- NOTES
-- ============================================
-- 1. Password hashes in the INSERT statements are placeholders.
--    You'll need to generate actual bcrypt hashes before inserting users.
--    Use: bcrypt.hashSync('password', 10)
--
-- 2. The events table combines both VSA and ShredVets events.
--    Use the event_type column to filter: WHERE event_type = 'vsa' or 'shredvets'
--
-- 3. Event details are stored as JSON for flexibility.
--    Query example: SELECT JSON_EXTRACT(details, '$[0]') FROM event_details WHERE slug = 'jack-frost-jan-31'
--
-- 4. Programs use string IDs (like 'shredvets') instead of auto-increment integers.
--    This allows for easier referencing in code.
--
-- 5. Event registrations can be anonymous (user_id = NULL) or linked to a user account.
--
-- 6. This file uses MySQL syntax:
--    - AUTO_INCREMENT instead of SERIAL
--    - TINYINT(1) instead of BOOLEAN (0/1 instead of true/false)
--    - ENUM instead of CHECK constraints
--    - JSON instead of JSONB
--    - ON UPDATE CURRENT_TIMESTAMP for updated_at
--
-- 7. For MySQL, updated_at automatically updates with ON UPDATE CURRENT_TIMESTAMP.
--    No trigger needed!
--    CREATE OR REPLACE FUNCTION update_updated_at_column()
--    RETURNS TRIGGER AS $$
--    BEGIN
--        NEW.updated_at = CURRENT_TIMESTAMP;
--        RETURN NEW;
--    END;
--    $$ language 'plpgsql';
--
--    CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
--    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
--    (Repeat for other tables)
