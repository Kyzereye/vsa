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
DROP TABLE IF EXISTS password_reset_tokens;
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
    date TIMESTAMP NOT NULL,
    title VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    slug VARCHAR(255) UNIQUE,
    event_type ENUM('vsa', 'shredvets', 'org') NOT NULL DEFAULT 'vsa',
    canceled BOOLEAN NOT NULL DEFAULT FALSE,
    date_changed BOOLEAN NOT NULL DEFAULT FALSE,
    location_changed BOOLEAN NOT NULL DEFAULT FALSE,
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
    event_id INT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE SET NULL
);

CREATE INDEX idx_gallery_display_order ON gallery_images(display_order);
CREATE INDEX idx_gallery_event_id ON gallery_images(event_id);

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
-- PASSWORD RESET TOKENS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX idx_password_reset_token ON password_reset_tokens(token);
CREATE INDEX idx_password_reset_expires ON password_reset_tokens(expires_at);

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
INSERT INTO users (id, name, email, phone, password_hash, role, status, join_date, email_opt_in, email_verified) VALUES
(1, 'Jeff Kyzer', 'kyzereye@gmail.com', '3038174277', '$2a$10$ySjXwMRQOPyV5PqXtL6AruOWuDElPMmb253CJUJtEUbOEL/5zx5.W', 'admin', 'active', '2024-01-01', 0, 1),
(2, 'Noel Dillon', 'n.dillon@holtec.com', '8455195619', '$2a$10$BVNOhsbKRd/V.LpqpmkvJeT84aZ9.c0HyvdK9Bv43oWw9IWJdiGAy', 'admin', 'active', '2024-01-31', 0, 1);

-- Reset auto increment for users table (optional - only needed if inserting with specific IDs)
-- Note: MySQL doesn't allow subqueries in ALTER TABLE, so set manually if needed
-- ALTER TABLE users AUTO_INCREMENT = 3;

-- Insert Events (one row per unique event)
-- location = venue/place name; address = street address (optional)
-- event_type = 'shredvets' → shown on BOTH VSA page and ShredVets page
-- event_type = 'vsa' → shown only on VSA page
-- date stored as TIMESTAMP (YYYY-MM-DD HH:MM:SS)
INSERT INTO events (id, date, title, location, address, slug, event_type, canceled, date_changed, location_changed) VALUES
-- ShredVets events (on both pages)
(1, '2026-01-31 00:00:00', 'Jack Frost Ski Resort', 'Jack Frost Ski Resort', '434 Jack Frost Mountain Rd, White Haven, PA 18661', 'jack-frost-jan-31', 'shredvets', FALSE, FALSE, FALSE),
(2, '2026-02-03 00:00:00', 'Ski Windham Mountain', 'Windham Mountain', '19 Resort Dr, Windham, NY 12496', 'shredvets-windham-feb-03', 'shredvets', FALSE, FALSE, FALSE),
(3, '2026-02-12 00:00:00', 'Ski Windham Mountain', 'Windham Mountain', '19 Resort Dr, Windham, NY 12496', 'shredvets-windham-feb-12', 'shredvets', FALSE, FALSE, FALSE),
(4, '2026-02-14 00:00:00', 'Ski Whistler Ski Resort 2027', 'Whistler', 'Whistler, British Columbia, Canada', 'whistler-ski-resort-2027', 'shredvets', FALSE, FALSE, FALSE),
(5, '2026-02-17 00:00:00', 'Ski Plattekill Mountain', 'Plattekill Mountain', '469 Plattekill Rd, Roxbury, NY 12474', 'shredvets-plattekill-feb-17', 'shredvets', FALSE, FALSE, FALSE),
(6, '2026-02-20 00:00:00', 'Ski Thunder Ridge', 'Thunder Ridge', '137 Birch Hill Rd, Patterson, NY 12563', 'shredvets-thunder-ridge-feb-20', 'shredvets', FALSE, FALSE, FALSE),
(7, '2026-02-27 00:00:00', 'Ski Plattekill Mountain', 'Plattekill Mountain', '469 Plattekill Rd, Roxbury, NY 12474', 'shredvets-plattekill-feb-27', 'shredvets', FALSE, FALSE, FALSE),
(8, '2026-03-13 00:00:00', 'Ski Shawnee Mountain', 'Shawnee Mountain', '401 Hollow Rd, East Stroudsburg, PA 18301', 'shawnee-mountain-mar-13', 'shredvets', FALSE, FALSE, FALSE),
-- VSA-only events
(9, '2026-02-07 00:00:00', 'NRA Great Outdoor Show 2026', 'Pennsylvania Farm Show Complex', '2300 N Cameron St, Harrisburg, PA', 'nra-great-outdoor-show-2026', 'vsa', FALSE, FALSE, FALSE),
(10, '2026-02-07 00:00:00', 'Team River Runner - Kayaking Workshop', 'Montrose VA', 'Montrose VA - Pool', 'team-river-runner-kayaking-workshop-feb-07', 'vsa', FALSE, FALSE, FALSE),
(11, '2026-03-07 00:00:00', 'Wappingers Creek Clean Up', 'Veterans Sportsmens Association', NULL, 'wappingers-creek-clean-up-mar-07', 'vsa', FALSE, FALSE, FALSE),
(12, '2026-03-11 00:00:00', 'DCSO Game Dinner', 'Poughkeepsie', NULL, 'dcso-game-dinner-mar-11', 'vsa', FALSE, FALSE, FALSE),
(13, '2026-03-14 00:00:00', 'Shawnee Mountain', 'Shawnee Mountain', '401 Hollow Rd, East Stroudsburg, PA 18301', 'shawnee-mountain-mar-14', 'vsa', FALSE, FALSE, FALSE),
(14, '2026-03-21 00:00:00', 'NRA CCW Course', 'Veterans Sportsmens Association', NULL, 'nra-ccw-course-mar-21', 'vsa', FALSE, FALSE, FALSE),
(15, '2026-03-21 00:00:00', 'New York State Pistol Permit Safety Course', 'Veterans Sportsmens Association', NULL, 'nys-pistol-permit-safety-course-mar-21', 'vsa', FALSE, FALSE, FALSE),
(16, '2026-04-04 00:00:00', 'Wappingers Creek Clean Up', 'Veterans Sportsmens Association', NULL, 'wappingers-creek-clean-up-apr-04', 'vsa', FALSE, FALSE, FALSE),
(17, '2026-04-18 00:00:00', 'Wappingers Creek Clean Up', 'Veterans Sportsmens Association', NULL, 'wappingers-creek-clean-up-apr-18', 'vsa', FALSE, FALSE, FALSE),
(18, '2026-04-25 00:00:00', '51st Wappingers Creek Water Derby', 'Pleasant Valley', NULL, '51st-wappingers-creek-water-derby', 'vsa', FALSE, FALSE, FALSE),
(19, '2026-05-30 00:00:00', 'Introduction to Precision Rifle Shooting', 'Tommy Gun Warehouse', NULL, 'introduction-precision-rifle-shooting-may-30', 'vsa', FALSE, FALSE, FALSE),
(20, '2026-05-30 00:00:00', 'NRA Basic Rifle Course', 'Greeley', NULL, 'nra-basic-rifle-course-may-30', 'vsa', FALSE, FALSE, FALSE),
-- Organizational meetings (event_type = 'org')
(21, '2026-03-08 00:00:00', 'First Quarterly Meeting', 'PA', NULL, 'org-2026-03-08-pa', 'org', FALSE, FALSE, FALSE),
(22, '2026-04-19 00:00:00', 'Second Quarter Board and General Member Meeting', 'NY', NULL, 'org-2026-04-19-ny', 'org', FALSE, FALSE, FALSE),
(23, '2026-05-03 00:00:00', 'Second Quarter Board and General Member Meeting', 'PA', NULL, 'org-2026-05-03-pa', 'org', FALSE, FALSE, FALSE),
(24, '2026-07-12 00:00:00', 'Veterans Sportsmens Association Third Quarter Meeting', 'NY', NULL, 'org-2026-07-12-ny', 'org', FALSE, FALSE, FALSE),
(25, '2026-08-09 00:00:00', 'Veterans Sportsmens Association Third Quarter Meeting', 'PA', NULL, 'org-2026-08-09-pa', 'org', FALSE, FALSE, FALSE),
(26, '2026-12-12 00:00:00', 'Veterans Sportsmens Association Fourth Quarter Meeting', 'NY & PA', NULL, 'org-2026-12-12-ny-pa', 'org', FALSE, FALSE, FALSE);

-- Reset auto increment for events table (optional)
-- ALTER TABLE events AUTO_INCREMENT = 27;

-- Insert Event Details (one row per event; event_id 1-20 matches events.id)
INSERT INTO event_details (event_id, slug, subtitle, details) VALUES
-- ShredVets events (ids 1-8)
(1, 'jack-frost-jan-31', 'ShredVets Trip',
 JSON_ARRAY(
    'Join ShredVets at Jack Frost Ski Resort for a day on the slopes. This trip is free for veterans—ski or snowboard, with free equipment and lessons available when arranged in advance.',
    'Skiing ipsum dolor sit amet, carve the corduroy and lay down fresh tracks through the powder. Groomers and moguls await as you drop into the fall line. The chairlift carries you above the treeline where the snow is deep and the views are endless.',
    'Snowboard ipsum rails and boxes in the terrain park, then cruise the blue squares back to the lodge. Hot chocolate and chili by the fire after a long run.',
    'Meet at the resort base by 8:30 AM. Registration is required. Contact ShredVets to reserve your spot and arrange free rentals if needed.'
)),
(2, 'shredvets-windham-feb-03', 'ShredVets Trip',
 JSON_ARRAY(
    'Join ShredVets at Windham Mountain for a day on the slopes. Free for veterans—ski or snowboard, with free equipment and lessons when arranged in advance.',
    'Ski ipsum carve the corduroy and lay down fresh tracks. Groomers and moguls await; drop into the fall line and ride the chairlift above the treeline.',
    'Meet at the base by 8:30 AM. Registration required. Contact ShredVets to reserve your spot.'
)),
(3, 'shredvets-windham-feb-12', 'ShredVets Trip',
 JSON_ARRAY(
    'ShredVets at Windham Mountain—free skiing and snowboarding for veterans. Equipment and lessons available when coordinated in advance.',
    'Ski ipsum powder and groomers, moguls and fall line. Chairlift to the treeline; deep snow and long runs.',
    'Meet at the base by 8:30 AM. Registration required. Contact ShredVets to reserve your spot.'
)),
(4, 'whistler-ski-resort-2027', 'ShredVets Trip',
 JSON_ARRAY(
    'Join ShredVets at Whistler Ski Resort for an unforgettable day on the mountain. Free for veterans—ski or snowboard, with equipment and lessons available when arranged in advance.',
    'Ski ipsum carve the corduroy and lay down fresh tracks through the powder. Groomers and moguls await as you drop into the fall line.',
    'Registration is required. Contact ShredVets to reserve your spot and arrange free rentals.'
)),
(5, 'shredvets-plattekill-feb-17', 'ShredVets Trip',
 JSON_ARRAY(
    'ShredVets at Plattekill Mountain—free skiing and snowboarding for veterans. Equipment and lessons when coordinated in advance.',
    'Ski ipsum powder and groomers, moguls and fall line. Chairlift to the treeline; deep snow and long runs.',
    'Meet at the base by 8:30 AM. Registration required. Contact ShredVets to reserve your spot.'
)),
(6, 'shredvets-thunder-ridge-feb-20', 'ShredVets Trip',
 JSON_ARRAY(
    'Join ShredVets at Thunder Ridge for a day on the slopes. Free for veterans—ski or snowboard, with free equipment and lessons when arranged in advance.',
    'Ski ipsum carve the corduroy and lay down fresh tracks. Groomers and moguls await; drop into the fall line.',
    'Meet at the base by 8:30 AM. Registration required. Contact ShredVets to reserve your spot.'
)),
(7, 'shredvets-plattekill-feb-27', 'ShredVets Trip',
 JSON_ARRAY(
    'ShredVets at Plattekill Mountain—free skiing and snowboarding for veterans. Equipment and lessons when coordinated in advance.',
    'Ski ipsum powder and groomers, moguls and fall line. Terrain park rails and boxes, blue squares back to the lodge.',
    'Meet at the base by 8:30 AM. Registration required. Contact ShredVets to reserve your spot.'
)),
(8, 'shawnee-mountain-mar-13', 'ShredVets Trip',
 JSON_ARRAY(
    'Join ShredVets at Shawnee Mountain for a day on the slopes. Free for veterans—ski or snowboard, with free equipment and lessons when arranged in advance.',
    'Ski ipsum carve the corduroy and lay down fresh tracks. Groomers and moguls await; drop into the fall line.',
    'Meet at the base by 8:30 AM. Registration required. Contact ShredVets to reserve your spot.'
)),
-- VSA-only events (ids 9-20)
(9, 'nra-great-outdoor-show-2026', NULL,
 JSON_ARRAY(
    'The NRA Great Outdoor Show returns in 2026. Join the VSA and fellow veterans at 2300 N Cameron St for exhibits, demonstrations, and community.',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'Contact the VSA for registration and details.'
)),
(10, 'team-river-runner-kayaking-workshop-feb-07', 'Team River Runner',
 JSON_ARRAY(
    'Join Team River Runner and the VSA for a kayaking workshop at the Montrose VA Pool. Adaptive and therapeutic paddling for veterans and active duty—free of charge.',
    'Kayaking ipsum dolor sit amet, paddle through the current and read the river. Eddies and rapids, stroke and brace.',
    'Registration is required. Contact the VSA or Team River Runner to reserve your spot.'
)),
(11, 'wappingers-creek-clean-up-mar-07', NULL,
 JSON_ARRAY(
    'Join the VSA and Aquatic Explorers Scuba Club for the Wappingers Creek clean-up. Help maintain the creek and watershed for the community and the annual water derby.',
    'River ipsum dolor sit amet, creek clean-up and stewardship. Canoe and kayak access; banks and riparian habitat.',
    'Meet at the VSA office. Bring work gloves and water. Contact the VSA to register.'
)),
(12, 'dcso-game-dinner-mar-11', NULL,
 JSON_ARRAY(
    'The DCSO Game Dinner is a longstanding community event in Poughkeepsie. The VSA is proud to participate and support local veterans and first responders.',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'Contact the VSA for tickets and details.'
)),
(13, 'shawnee-mountain-mar-14', NULL,
 JSON_ARRAY(
    'Join the VSA at Shawnee Mountain for a day on the slopes. Open to veterans and their families.',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'Registration may be required. Contact the VSA for details and to reserve your spot.'
)),
(14, 'nra-ccw-course-mar-21', NULL,
 JSON_ARRAY(
    'NRA CCW Course at the Veterans Sportsmens Association. This course meets requirements for concealed carry and defensive handgun training.',
    'Firearms ipsum dolor sit amet, safety and fundamentals. Sight alignment, trigger control, and follow-through.',
    'Registration and fee required. Contact the VSA for dates and to reserve your spot.'
)),
(15, 'nys-pistol-permit-safety-course-mar-21', NULL,
 JSON_ARRAY(
    'New York State Pistol Permit Safety Course at the Veterans Sportsmens Association. This 18-hour course meets NYS requirements for pistol permit application and renewal.',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'Registration and fee required. Contact the VSA for dates and to reserve your spot.'
)),
(16, 'wappingers-creek-clean-up-apr-04', NULL,
 JSON_ARRAY(
    'Wappingers Creek clean-up with the VSA and Aquatic Explorers Scuba Club. Help prepare the creek and banks for the spring water derby.',
    'River ipsum creek clean-up and stewardship. Meet at the VSA office. Bring work gloves and water. Contact the VSA to register.'
)),
(17, 'wappingers-creek-clean-up-apr-18', NULL,
 JSON_ARRAY(
    'Wappingers Creek clean-up with the VSA and Aquatic Explorers Scuba Club. Final prep before the water derby.',
    'River ipsum creek clean-up and stewardship. Meet at the VSA office. Bring work gloves and water. Contact the VSA to register.'
)),
(18, '51st-wappingers-creek-water-derby', NULL,
 JSON_ARRAY(
    'The 51st Wappingers Creek Water Derby—canoe and kayak racing from Pleasant Valley. The VSA has teamed up with the Aquatic Explorers Scuba Club to bring back this annual spring event.',
    'Kayaking ipsum dolor sit amet, paddle the creek from put-in to take-out. The race runs from Pleasant Valley through LaGrange to the Town of Poughkeepsie.',
    'Registration required. Contact the VSA or AESC for entry and details.'
)),
(19, 'introduction-precision-rifle-shooting-may-30', NULL,
 JSON_ARRAY(
    'Introduction to Precision Rifle Shooting at Tommy Gun Warehouse. Learn fundamentals of scoped rifle marksmanship and long-range shooting.',
    'Firearms ipsum dolor sit amet, safety and fundamentals. Sight alignment, scope use, and follow-through.',
    'Registration and fee required. Contact the VSA for dates and to reserve your spot.'
)),
(20, 'nra-basic-rifle-course-may-30', NULL,
 JSON_ARRAY(
    'NRA Basic Rifle Course in Greeley. This course covers rifle safety, fundamentals, and range qualification. Ideal for new shooters and those seeking NRA certification.',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'Registration and fee required. Contact the VSA for dates and to reserve your spot.'
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

-- Insert Gallery Images (event_id NULL = no event assigned)
INSERT INTO gallery_images (id, url, alt_text, caption, display_order, event_id) VALUES
(1, 'https://static.wixstatic.com/media/30c799_6c5b7f47d057455497bc4936c6462790~mv2.jpg', 'VSA Event', NULL, 1, NULL),
(2, 'https://static.wixstatic.com/media/99ec98fdb81945c29c25a3ad6c5606b1.jpg', 'VSA Activity', NULL, 2, NULL),
(3, 'https://static.wixstatic.com/media/30c799_56468b7c375d4956ac7b3039bbaf4789~mv2.jpg', 'VSA Program', NULL, 3, NULL),
(4, 'https://static.wixstatic.com/media/30c799_e52caab3522f42b2b32b55b48215eeb7~mv2.jpg', 'VSA Event', NULL, 4, NULL),
(5, 'https://static.wixstatic.com/media/30c799_958dd0efbd1c4f26bba179a9dd2d1261~mv2.jpg', 'VSA Activity', NULL, 5, NULL),
(6, 'https://static.wixstatic.com/media/30c799_10bf358ef0a74b6ab84752c574bcacfe~mv2.jpg', 'VSA Program', NULL, 6, NULL);

-- Reset sequence for gallery_images table
-- Reset auto increment for gallery_images table (optional - only needed if inserting with specific IDs)
-- ALTER TABLE gallery_images AUTO_INCREMENT = 7;

-- ============================================
-- MIGRATION: Add 'org' to events.event_type and insert org meetings (if not already present)
-- ALTER TABLE events MODIFY COLUMN event_type ENUM('vsa', 'shredvets', 'org') NOT NULL DEFAULT 'vsa';
-- INSERT INTO events (date, title, location, address, slug, event_type, canceled, date_changed, location_changed) VALUES
-- ('2026-03-08 00:00:00', 'First Quarterly Meeting', 'PA', NULL, 'org-2026-03-08-pa', 'org', FALSE, FALSE, FALSE),
-- ('2026-04-19 00:00:00', 'Second Quarter Board and General Member Meeting', 'NY', NULL, 'org-2026-04-19-ny', 'org', FALSE, FALSE, FALSE),
-- ('2026-05-03 00:00:00', 'Second Quarter Board and General Member Meeting', 'PA', NULL, 'org-2026-05-03-pa', 'org', FALSE, FALSE, FALSE),
-- ('2026-07-12 00:00:00', 'Veterans Sportsmens Association Third Quarter Meeting', 'NY', NULL, 'org-2026-07-12-ny', 'org', FALSE, FALSE, FALSE),
-- ('2026-08-09 00:00:00', 'Veterans Sportsmens Association Third Quarter Meeting', 'PA', NULL, 'org-2026-08-09-pa', 'org', FALSE, FALSE, FALSE),
-- ('2026-12-12 00:00:00', 'Veterans Sportsmens Association Fourth Quarter Meeting', 'NY & PA', NULL, 'org-2026-12-12-ny-pa', 'org', FALSE, FALSE, FALSE);

-- MIGRATION: Add event_id to gallery_images (run if table already exists without event_id)
-- ============================================
-- ALTER TABLE gallery_images ADD COLUMN event_id INT NULL;
-- ALTER TABLE gallery_images ADD CONSTRAINT fk_gallery_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE SET NULL;
-- CREATE INDEX idx_gallery_event_id ON gallery_images(event_id);

-- MIGRATION: Add password_reset_tokens table (run if table does not exist)
-- CREATE TABLE IF NOT EXISTS password_reset_tokens (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     user_id INT NOT NULL,
--     token VARCHAR(255) UNIQUE NOT NULL,
--     expires_at TIMESTAMP NOT NULL,
--     created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
-- );
-- CREATE INDEX idx_password_reset_token ON password_reset_tokens(token);
-- CREATE INDEX idx_password_reset_expires ON password_reset_tokens(expires_at);

-- ============================================
-- NOTES
-- ============================================
-- 1. Password hashes in the INSERT statements are placeholders.
--    You'll need to generate actual bcrypt hashes before inserting users.
--    Use: bcrypt.hashSync('password', 10)
--
-- 2. The events table has one row per unique event. event_type = 'shredvets' means the event appears on BOTH the VSA page and the ShredVets page; event_type = 'vsa' means VSA page only. Backend: VSA page uses WHERE event_type IN ('vsa', 'shredvets'); ShredVets page uses WHERE event_type = 'shredvets'.
--
-- 3. Event details are stored as JSON for flexibility (event_details.slug matches events.slug).
--    Query example: SELECT JSON_EXTRACT(details, '$[0]') FROM event_details WHERE slug = 'jack-frost-ski-resort-jan-31'
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
