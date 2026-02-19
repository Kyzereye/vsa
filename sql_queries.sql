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
DROP TABLE IF EXISTS media;
DROP TABLE IF EXISTS gallery_images;
DROP TABLE IF EXISTS news;
DROP TABLE IF EXISTS programs;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS team_profiles;
DROP TABLE IF EXISTS user_details;
DROP TABLE IF EXISTS users;

-- ============================================
-- USERS TABLE (login only)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    email_verified TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_email_verified ON users(email_verified);

-- ============================================
-- USER DETAILS TABLE (profile/member data; 1:1 with users)
-- ============================================
CREATE TABLE IF NOT EXISTS user_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role ENUM('admin', 'member', 'instructor', 'boardmember') NOT NULL DEFAULT 'member',
    join_date DATE NOT NULL,
    email_opt_in TINYINT(1) NOT NULL DEFAULT 0,
    instructor_number VARCHAR(10) NULL COMMENT 'NRA Instructor Number; only for role=instructor',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_user_details_user_id ON user_details(user_id);

-- ============================================
-- TEAM PROFILES TABLE (public name/bio; instructors, board, etc.)
-- ============================================
-- One row per person; is_instructor and is_board_member can both be 1. user_id optional (link if they have a login).
CREATE TABLE IF NOT EXISTS team_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    name VARCHAR(255) NOT NULL,
    bio TEXT,
    image_url VARCHAR(500) NULL,
    display_order INT NOT NULL DEFAULT 0,
    is_instructor TINYINT(1) NOT NULL DEFAULT 0,
    is_board_member TINYINT(1) NOT NULL DEFAULT 0,
    board_position VARCHAR(100) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_team_profiles_user_id ON team_profiles(user_id);
CREATE INDEX idx_team_profiles_instructor ON team_profiles(is_instructor);
CREATE INDEX idx_team_profiles_board ON team_profiles(is_board_member);
CREATE INDEX idx_team_profiles_display_order ON team_profiles(display_order);

-- ============================================
-- EVENTS TABLE
-- ============================================
-- Combined table for both VSA and ShredVets events
-- event_type: vsaNY/vsaPA (events), trainingNY/trainingPA, orgNY/orgPA (meetings), shredvets — NY vs PA kept separate
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date TIMESTAMP NOT NULL,
    title VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    slug VARCHAR(255) UNIQUE,
    event_type ENUM('vsaNY', 'vsaPA', 'shredvets', 'trainingNY', 'trainingPA', 'orgNY', 'orgPA') NOT NULL DEFAULT 'vsaNY',
    canceled BOOLEAN NOT NULL DEFAULT FALSE,
    date_changed BOOLEAN NOT NULL DEFAULT FALSE,
    location_changed BOOLEAN NOT NULL DEFAULT FALSE,
    instructor_id INT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (instructor_id) REFERENCES team_profiles(id) ON DELETE SET NULL
);

CREATE INDEX idx_events_type ON events(event_type);
CREATE INDEX idx_events_instructor ON events(instructor_id);
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
-- MEDIA TABLE (images and documents; type = gallery | event | page | team | document)
-- ============================================
-- path is relative to uploads root (e.g. gallery/foo.jpg, events/bar.jpg, team/xyz.jpg, documents/file.pdf)
CREATE TABLE IF NOT EXISTS media (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('gallery', 'event', 'page', 'team', 'document') NOT NULL,
    path VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    caption VARCHAR(500),
    display_order INT NOT NULL DEFAULT 0,
    event_id INT NULL,
    team_profile_id INT NULL,
    title VARCHAR(255) NULL,
    file_type VARCHAR(100) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE SET NULL,
    FOREIGN KEY (team_profile_id) REFERENCES team_profiles(id) ON DELETE SET NULL
);

CREATE INDEX idx_media_type ON media(type);
CREATE INDEX idx_media_display_order ON media(display_order);
CREATE INDEX idx_media_event_id ON media(event_id);
CREATE INDEX idx_media_team_profile_id ON media(team_profile_id);

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

-- Insert Users (login) and User Details (profile)
-- Passwords: bcrypt hashes. In production, generate securely.
INSERT INTO users (id, email, password_hash, status, email_verified) VALUES
(1, 'kyzereye@gmail.com', '$2a$10$zo0RuHqanlueULMwJJqkwuDshveGb7PqWvjVstxBUbbxrMhbFVeQ6', 'active', 1),
(2, 'n.dillon@holtec.com', '$2a$10$BVNOhsbKRd/V.LpqpmkvJeT84aZ9.c0HyvdK9Bv43oWw9IWJdiGAy', 'active', 1);

INSERT INTO user_details (user_id, name, phone, role, join_date, email_opt_in) VALUES
(1, 'Jeff Kyzer', '3038174277', 'admin', '2024-01-01', 0),
(2, 'Noel Dillon', '8455195619', 'admin', '2024-01-31', 0);

-- Team profiles (instructors / board); source: veteranssportsmensassociation.org/team
INSERT INTO team_profiles (name, bio, image_url, display_order, is_instructor, is_board_member, user_id) VALUES
('Noel Dillon', 'Noel Dillon has worked in the Nuclear Security field for more than 30 years. Since founding the Veterans Sportsmens Association (VSA) in 2016, Noel has consistently brought a passion and dedication to this team and its support for local Veterans. Noel spent over twenty (20) years in the USAF including multiple combat tours and deployments to Afghanistan, Iraq, and numerous other locations in the Middle East, Africa, Asia, Central and South America. During his military service he specialized in Force Protection, Counter-Terrorism, Weapons of Mass Destruction, Logistics, and Intelligence. In addition, he served as a Survey Team Leader and Collapse Structure Rescue Team Leader for 12 years on the NY CERF-P and Region 2 HRF. In the civilian sector he served as a Indian Point Nuclear Power Plant Fire Brigade Member, Confined Space Rescue Technician, Indian Point Hazmat Technician and Site EMT. He also Volunteered with the Arlington Fire Department as a Fire Fighter and EMT for more than 10 years, and has been a member of the Dutchess County Hazmat Team for more than 20 years. As the President of the VSA and Lead Instructor, Noel has built a Cadre of exceptional instructors and established the VSA as a registered 501c3 Veterans based non-profit in the Hudson Valley area of NY. He is currently an NRA certified Chief Range Safety Officer and a NRA Instructor certified to teach CCW, Basic Pistol, Basic Rifle, Defensive Pistol, Personal Protection Inside the Home, and Personal Protection Outside the Home. He is also a Certified UTAH BCI Instructor, ALERRT Active Shooter Instructor, and a Law Enforcement Precision Rifle, Handgun, Shotgun and Simunitions Instructor. Noel has three Masters Degrees from John Jay College in Public Administration, Protection Management, and Emergency Management.', 'team_images/todd_dillon.avif', 1, 1, 1, 2),
('Steven Mattes', 'Steve Mattes is a Marine Corps Veteran who served as Military Police in the Corrections Field. This experience instilled a constant state of mind of security and awareness. A nearly life time practitioner of martial arts which led to the exploration of many disciplines. In 2013 he was awarded Roku (6th) Dan in Bujinkan Budo Taijutsu (Ninjutsu) and he is currently exploring the art of Jeet Kune Do to further his understanding of the martial way. Steve is an NRA certified Chief Range Safety Officer and a NRA instructor certified to teach Home Firearm Safety, Basic Pistol, Basic Rifle, Basic Shotgun, Personal Protection Inside the Home, Personal Protection Outside the Home. He is constantly participating in his own training to further his knowledge and understanding of all aspects of self-protection as well as the protection of others.', 'team_images/STEVEN_MATTES.avif', 2, 1, 0, NULL),
('Timothy Roberts', 'Tim Roberts served 23 Years in the US Military, in both the Air Force Security Forces and in the Army as a Forward Observer. His duties included Nuclear missile security, Naval Brig Security, Emergency Services Team, anti terrorism, interrogation procedures, SWAT operations and tactics, providing Presidential and Vice Presidential protection, as well as Foreign Dignitary protection. He currently works in Nuclear Security and is certified as an NRA firearms instructor as a Chief Range Safety Officer, and Shotgun Instructor.', 'team_images/TIMOTHY_ROBERTS.avif', 3, 1, 0, NULL),
('John Wasikowitz', 'John Wasikowitz entered US Navy in May of 1969 at the Recruit Training Command Great Lakes IL. During Boot camp he qualified with Rifle and became familiarized with pistols. In 1971 he qualified with .38 pistol for the TAD Shore Patrol assignment. After release from active duty April 1973 he joined the Active Reserves. There he received the Navy Pistol Expert Medal after scoring expert 3 years in a row ( Now sailors only have to get the score once). John became a Navy instructor in 1973 and conducted many various classes pertaining to General Military Training, Safety, First aid, Ship board And Aircraft Fire Fighting. John retired from the Navy as a Chief Petty Officer ABE-C E-7. In 1986 he took the NRA rifle instructor course and worked with BSA and 4H groups. He also gave Firearms safety instruction to his volunteer ambulance corp. John has been a firearms instructor for more than 34 years.', 'team_images/JOHN_WASIKOWITZ.avif', 4, 1, 0, NULL),
('Michelle Depew', 'Energetic and driven, we were thrilled when Michelle Depew joined as our team as an experienced NRA Instructor. Michelle is always excited to take on the next challenge and push our team forward.', 'team_images/MICHELLE_DEPEW.avif', 5, 1, 0, NULL),
('Carlos Prince', 'Carlos Prince is a SMsgt. Retired, USAF, and the Chairman of the Hudson Valley Veterans Alliance. Carlos Prince was born in Panama and currently resides in Hopewell Junction, NY. He honorably served 31 years in the United States Air Force, attached to the 514th Civil Engineer Squadron. Today Carlos runs his own HVAC business called Pana Breeze, is working on his A.A. in Political Science, and sits on NYS Senator (41st Dist.) Sue Serino''s Veteran Advisory Committee. Carlos joined the VSA as a Trustee, and is now a NRA certified firearms instructor in Pistol, Rifle, and Shotgun.', 'team_images/CARLOS_PRINCE.avif', 6, 1, 1, NULL),
('Frank Kolarik', 'Frank Kolarik is a combat veteran of the U.S. Army''s 82nd Airborne Division where he served as an Airborne Infantry squad leader. Before completing his enlistment, Frank was introduced to law enforcement as a special investigator for the Army''s Criminal Investigation Division (CID). Upon completing his tour of duty, Frank went on to a distinguished career as a police officer in Westchester County, NY, where he served as a patrolman, a member of his department''s emergency services and scuba units, and finally as a detective. Frank was also a certified police instructor and has taught at numerous police academies throughout New York State. Frank has earned two black belts in the martial arts and is an FBI Certified Police Defensive Tactics Instructor. Upon his retirement, Frank continued teaching criminal justice at both the high school and college level. Frank is active with the VSA and the American Legion, is an NRA certified firearms instructor, and teaches the New York State Security Guard certification course.', 'team_images/FRANK_KOLARIK.avif', 7, 1, 0, NULL),
('Ari Moskowitz', 'Ari Moskowitz is a retired Police Sergeant, with 29 years of full time service. During his tenure, he served as the Firearms Instructor, TASER Instructor and General Topics Instructor for his department. He is presently working as a Security Responder at Indian Point Nuclear Power Plant, as well as being a Part-Time Firearms Instructor for General Dynamics. Ari is also a retired U.S. Army (MP) Captain, with extensive experience in large scale training operations and planning. His last command assignment was as a Drill Sergeant Company Commander, leading him to be activated in 2004 to be a part of a select group of 127 Military Advisors to the Iraqi Army, where he specialized in G-1 and G-2 training for Iraqi Command Staff Officers. Based on his firearms and training experience, he was also tasked to help train and supervise Iraqi soldiers in pistol and rifle courses that prepared them for their service in the Iraqi Army. His Police Instructor certifications include: Firearms Instructor, Defensive Tactics Instructor, TASER Instructor, Pepper Spray Instructor and Emergency Vehicle Operator Instructor and General Topics Instructor. Ari has a Bachelor of Arts Degree in Forensic Psychology from John Jay College of Criminal Justice. Ari is a licensed New York State Private Investigator and was a member of the Orange County Emergency Management Team.', 'team_images/ARI_MOSKOWITZ.avif', 8, 1, 0, NULL),
('Melissa Brady', 'Melissa Brady is an active member of the Veterans Sportsmens Association. She is one of our female instructors who takes pride in educating people who want to learn to shoot and the safety aspect involved. Melissa has been in firearms industry for close to 7 years going through training and earning certifications to further her knowledge on the field. Some of Melissa''s her credentials include Basic instructor training, NRA Basic Pistol, NRA Instructor, NRA Range Safety Officer, NRA Chief Range Safety Officer, NRA Basic Shotgun, NRA Shotgun Instructor, and Basic Rifle. For the past few years she has worked in the security world training and working spos''n detection dogs as well as her full time job is a nuclear security officer. Melissa volunteers her time and training to rescue dogs, train and donate them to police departments for working K9s and to veterans for companion/emotional support dogs. Melissa believes that it is important to train and the skills to protect yourself, your family and people around you.', 'team_images/MELISSA_BRADY.avif', 9, 1, 0, NULL),
('Brian Pfleger', 'Brian Pfleger enlisted in the Air National Guard in 2012 attached to the 106th Rescue Wing. He continues to serve as avionics Guidance and Control Specialist as a Staff Sergeant, and was deployed in 2018 to Iraq in support of Operation Inherent Resolve. His military experience, as well as strong passion and knowledge of firearms has been recognized by the VSA to become one of our many instructors, as well as our recording secretary.', 'team_images/BRIAN_PFLEGER.avif', 10, 1, 1, NULL),
('Louis "Roc" Rivera', 'Roc Rivera', 'team_images/LOUIS_RIVERA.avif', 11, 1, 0, NULL),
('Rob Ferguson', 'I believe in safety and constant training! We train together and we learn together. Leave your ego in the parking lot. 18 years and retired Law Enforcement, GLOCK Armorer, Field Training Officer. NYS DCJS Certified Department & Police Academy Firearms Instructor. NRA Certified Chief Range Instructor. NRA Certified Basic Pistol Instructor. NYS Certified Instructor Development School / Law Enforcement General Topics Instructor. Active member of VSA. NRA Basic Instructor Training. NYS DCJS Handgun, Shotgun and Patrol Rifle Instructor. Patrol Rifle Trained and SWAT Cross Trained.', 'team_images/ROB_FERGUSON.avif', 12, 1, 0, NULL),
('Joe Mancini', 'Joe is Veterans Sportsmens Association Board Member and Firearms Instructor, as well as a retired firefighter and EMT. He started shooting at the age of 10 and completed the NRA Junior Division Program. He is an NRA Certified Pistol, Rifle, Shotgun Instructor, and Chief Range Safety Officer. As a former Boy Scout leader, he was a teacher of shooting sports to both scouts and adults. Joe has been a reloading for over 40 years specializing in wildcat cartridges and is currently long range shooting.', 'team_images/Joseph_Mancini.avif', 13, 1, 1, NULL),
('Joe Fisher', 'Joseph Fisher is a NYS, Department of Defense and United States Air Force Certified Instructor. He is a 12 year veteran of the Air National Guard and a 25 year veteran of the New York City Police Department. He currently owns and operates his own company, Cop Prop Rentals of NY, a film and television prop supply firm specializing in police equipment and prop weapons. He currently works as a Prop Master, Consultant, Technical Advisor, Actor and Theatrical Weapons Wrangler in the entertainment industry. Due to his vast background, experiences and expertise in this field, Fisher has been featured as a commentator and subject matter expert by every major news and television network here in the US and globally. As a member of the 105th Airlift Wing of the NYS ANG, TSgt Fisher spent 12 years teaching for the United States Air Force as a 3E9X1. There he served as a CBRN Instructor, Emergency Manager, CBRN Technician, ProBoard Certified HazMat Technician and obtained a degree from the Community College of the Air Force in Emergency Management. While serving at the 105th Airlift Wing, TSgt Fisher was also a Cadre member of the newly formed NYS CERF(P) Taskforce, a multi-branch WMD Response Team created to respond to Domestic Incidents involving the use of Chemical, Biological or Nuclear Weapons. Fisher began teaching for the NYPD in 1998 at the Management Training Unit, a Police Academy unit providing in-service training to Patrol Supervisors and Leadership in Tactics, Counter-Terrorism and Criminal Procedure Law. During his 25 year career with the NYPD he worked as a patrol officer, crime prevention officer, instructor and detective and was recognized and awarded on several occasions for his contributions to the Department and to the public. Joseph Fisher joined the VSA as a Founding Member in 2020 and has made a few contributions to this organization including the new logo, coin designs and digitalizing our membership application process. He brings his knowledge, experience and passion for teaching to the VSA as an instructor to help his fellow veterans in all they do.', 'team_images/JOE_FISHER.avif', 14, 1, 0, NULL),
('John Reifenberger', 'John Reifenberger serve the United States Navy as an aviation electronic technician aboard the USS coral sea. John volunteers his time as a firearms instructor with the Boy Scouts of America greater New York council shooting sports committee. John is currently certified as an NRA instructor in, NRA basic pistol, NRA basic shotgun, NRA basic rifle, NRA muzzle loading rifle and NRA metallic cartridge reloading. He is also a Chief Range Safety Officer and NRA Training Counselor (TC).', 'team_images/JOHN_REIFENBERGER.avif', 15, 1, 0, NULL),
('Jay Rusnock', 'Jay has dedicated a lifetime to the safe and responsible use of firearms. Recently retired from a 25 year career with the National Rifle Association. Previously serving in Emergency Services, LE, Corrections, private security fields and the NY Guard. His experience includes nationally recognized firearm academies and he holds NRA Instructor certifications in: Pistol, Rifle, Shotgun, Reloading, Refuse to be a Victim, CCW, Personal Protection in the Home, Home Firearm Safety, and Chief Range Safety Officer.', 'team_images/JAY_RUSNOCK.avif', 16, 1, 0, NULL),
('Scott and Jackie Emslie', 'Scott Emslie is a Current Board Member of the NRA. Both Scott and Jackie Emslie are from Poughkeepsie, N.Y. Together, they have volunteered with the Mid-Hudson Friends of the NRA committee since its inception in 1993, serving in numerous roles and positions throughout that time. Over the years, they have also attended and assisted at countless other Friends of NRA banquets all over the upper New York state area. Jackie and Scott Emslie are just the embodiment of the ultimate Friends of NRA volunteers. Jackie and Scott Emslie are both founding members of the Veterans Sportsmens Association (VSA) and they both serve actively on the VSA Board of Directors.', 'team_images/SCOTT_JACKIE_EMSLIE.avif', 17, 1, 1, NULL),
('Anthony R. Morrone', 'City of Poughkeepsie Police Officer 2001 - Present. ESU - 5 Years. F.B.I. SWAT School Graduate 2007. NTOA Barricade & Hostage Rescue. NRA Instructor for Handgun, Rifle and Shotgun.', 'team_images/ANTHONY_MORRONE.avif', 18, 1, 0, NULL),
('John-David Wellman', 'J-D began his journey in shooting sports and with firearms while serving as a BSA leader. Seeking to benefit his pack and then troop, he sought out training and became NRA certified as a Rifle and Shotgun instructor, as well as a Range Safety Officer (and, now a Chief Range Officer) in order to teach, train, and supervise scouts. He has since spent many years working with scouts, including shooting sports merit badges, and running ranges at BSA camps and events. He continues to serve scouting as an advisor and coach of a BSA Shooting Sports Venture Crew (and American Legion sponsored) Junior Shooting Sports 3-position precision rifle team. Beyond this work, J-D continues his own training, and continues to help to train youth and adults across a variety of venues.', 'team_images/JOHN-DAVID_WELLMAN.avif', 19, 1, 0, NULL),
('Victor Zamaloff', 'Victor is a former Army Medic and retired Fire Fighter/Paramedic with the Arlington Fire District. He is an NRA Firearms Instructor with multiple certifications. He currently works for the MHA Vet2Vet program assisting Local Veterans in need', 'team_images/VICTOR_ZAMALOFF.avif', 20, 1, 0, NULL),
('Patrick Cordova', 'Patrick Cordova, Major (Ret.), has been in Public Affairs since he graduated from the Defense Information School (DINFOS) in 2005. During his 24 years of service, he has participated in numerous domestic operations, from being amongst the first to deploy to New York City in response to the terror attacks on September 11, leading crisis communications efforts in Puerto Rico after Hurricane Maria ravaged the island in 2017, and the Unified Command PAO at the Javits New York Medical Station during COVID-19 response efforts. In addition to his assignments in the United States, he has seen service in Europe and Southeast Asia. In his civilian status, he works as a Public Affairs Specialist at the Defense Information Systems Agency (DISA) in Fort Meade, Maryland. Before this role, he was the Chief of Communications for the Bronx VA Hospital, an Orange County Deputy Sheriff, a New York State Court Officer, a Sommelier, and a Whiskey Aficionado.', 'team_images/PATRICK_CORDOVA.avif', 21, 1, 0, NULL);

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
(4, '2027-02-14 00:00:00', 'Ski Whistler Ski Resort 2027', 'Whistler', 'Whistler, British Columbia, Canada', 'whistler-ski-resort-2027', 'shredvets', FALSE, FALSE, FALSE),
(5, '2026-02-17 00:00:00', 'Ski Plattekill Mountain', 'Plattekill Mountain', '469 Plattekill Rd, Roxbury, NY 12474', 'shredvets-plattekill-feb-17', 'shredvets', FALSE, FALSE, FALSE),
(6, '2026-02-20 00:00:00', 'Ski Thunder Ridge', 'Thunder Ridge', '137 Birch Hill Rd, Patterson, NY 12563', 'shredvets-thunder-ridge-feb-20', 'shredvets', FALSE, FALSE, FALSE),
(7, '2026-02-27 00:00:00', 'Ski Plattekill Mountain', 'Plattekill Mountain', '469 Plattekill Rd, Roxbury, NY 12474', 'shredvets-plattekill-feb-27', 'shredvets', FALSE, FALSE, FALSE),
(8, '2026-03-13 00:00:00', 'Ski Shawnee Mountain', 'Shawnee Mountain', '401 Hollow Rd, East Stroudsburg, PA 18301', 'shawnee-mountain-mar-13', 'shredvets', FALSE, FALSE, FALSE),
-- VSA-only events
(9, '2026-02-07 00:00:00', 'NRA Great Outdoor Show 2026', 'Pennsylvania Farm Show Complex', '2300 N Cameron St, Harrisburg, PA', 'nra-great-outdoor-show-2026', 'vsaPA', FALSE, FALSE, FALSE),
(10, '2026-02-07 00:00:00', 'Team River Runner - Kayaking Workshop', 'Montrose VA', 'Montrose VA - Pool', 'team-river-runner-kayaking-workshop-feb-07', 'vsaNY', FALSE, FALSE, FALSE),
(11, '2026-03-07 00:00:00', 'Wappingers Creek Clean Up', 'Veterans Sportsmens Association', NULL, 'wappingers-creek-clean-up-mar-07', 'vsaNY', FALSE, FALSE, FALSE),
(12, '2026-03-11 00:00:00', 'DCSO Game Dinner', 'Poughkeepsie', NULL, 'dcso-game-dinner-mar-11', 'vsaNY', FALSE, FALSE, FALSE),
(13, '2026-03-14 00:00:00', 'Shawnee Mountain', 'Shawnee Mountain', '401 Hollow Rd, East Stroudsburg, PA 18301', 'shawnee-mountain-mar-14', 'vsaNY', FALSE, FALSE, FALSE),
(16, '2026-04-04 00:00:00', 'Wappingers Creek Clean Up', 'Veterans Sportsmens Association', NULL, 'wappingers-creek-clean-up-apr-04', 'vsaNY', FALSE, FALSE, FALSE),
(17, '2026-04-18 00:00:00', 'Wappingers Creek Clean Up', 'Veterans Sportsmens Association', NULL, 'wappingers-creek-clean-up-apr-18', 'vsaNY', FALSE, FALSE, FALSE),
(18, '2026-04-25 00:00:00', '51st Wappingers Creek Water Derby', 'Pleasant Valley', NULL, '51st-wappingers-creek-water-derby', 'vsaNY', FALSE, FALSE, FALSE),
-- Training events: trainingNY (NY), trainingPA (PA)
(14, '2026-03-21 00:00:00', 'NRA CCW Course', 'Veterans Sportsmens Association', NULL, 'nra-ccw-course-mar-21', 'trainingNY', FALSE, FALSE, FALSE),
(15, '2026-03-21 00:00:00', 'New York State Pistol Permit Safety Course', 'Veterans Sportsmens Association', NULL, 'nys-pistol-permit-safety-course-mar-21', 'trainingNY', FALSE, FALSE, FALSE),
(19, '2026-05-30 00:00:00', 'Introduction to Precision Rifle Shooting', 'Tommy Gun Warehouse', NULL, 'introduction-precision-rifle-shooting-may-30', 'trainingNY', FALSE, FALSE, FALSE),
(20, '2026-05-30 00:00:00', 'NRA Basic Rifle Course', 'Greeley', NULL, 'nra-basic-rifle-course-may-30', 'trainingNY', FALSE, FALSE, FALSE),
(27, '2026-05-30 00:00:00', 'Precision Rifle Shoot', 'Tommy Gun Warehouse', NULL, 'precision-rifle-shoot-may-30', 'trainingPA', FALSE, FALSE, FALSE),
-- Organizational meetings: orgNY (NY), orgPA (PA)
(21, '2026-03-08 00:00:00', 'First Quarterly Meeting', 'PA', NULL, 'org-2026-03-08-pa', 'orgPA', FALSE, FALSE, FALSE),
(22, '2026-04-19 00:00:00', 'Second Quarter Board and General Member Meeting', 'NY', NULL, 'org-2026-04-19-ny', 'orgNY', FALSE, FALSE, FALSE),
(23, '2026-05-03 00:00:00', 'Second Quarter Board and General Member Meeting', 'PA', NULL, 'org-2026-05-03-pa', 'orgPA', FALSE, FALSE, FALSE),
(24, '2026-07-12 00:00:00', 'Veterans Sportsmens Association Third Quarter Meeting', 'NY', NULL, 'org-2026-07-12-ny', 'orgNY', FALSE, FALSE, FALSE),
(25, '2026-08-09 00:00:00', 'Veterans Sportsmens Association Third Quarter Meeting', 'PA', NULL, 'org-2026-08-09-pa', 'orgPA', FALSE, FALSE, FALSE),
(26, '2026-12-12 00:00:00', 'Veterans Sportsmens Association Fourth Quarter Meeting', 'NY & PA', NULL, 'org-2026-12-12-ny-pa', 'orgNY', FALSE, FALSE, FALSE),
-- VSA-PA events (event_type = 'vsaPA')
(28, '2026-05-30 00:00:00', 'VSA Precision Rifle Shoot', 'Tommy Gun Warehouse', 'Greeley PA', 'vsa-pa-precision-rifle-may-30', 'vsaPA', FALSE, FALSE, FALSE),
(29, '2026-07-25 00:00:00', 'VSA Delaware River Kayaking', 'Dingmans Ferry PA', 'Dingmans Ferry Boat Launch', 'vsa-pa-kayaking-jul-25', 'vsaPA', FALSE, FALSE, FALSE),
(30, '2026-08-22 00:00:00', 'Camp Freedom Summer Salute', 'Camp Freedom', 'Carbondale PA', 'vsa-pa-camp-freedom-aug-22', 'vsaPA', FALSE, FALSE, FALSE),
(31, '2026-10-10 00:00:00', 'Let Freedom Ring Machine Gun Shoot', 'Kahr Arms', '105 Kahr Ave, Greeley PA', 'vsa-pa-let-freedom-ring-oct-10', 'vsaPA', FALSE, FALSE, FALSE),
(32, '2026-10-10 00:00:00', 'Rod of Iron Freedom Festival', 'Kahr Arms', '105 Kahr Ave, Greeley PA', 'vsa-pa-rod-of-iron-oct-10', 'vsaPA', FALSE, FALSE, FALSE),
(33, '2026-11-11 00:00:00', 'Veterans Day Dinner', 'Pike County PA', NULL, 'vsa-pa-veterans-day-nov-11', 'vsaPA', FALSE, FALSE, FALSE);

-- Reset auto increment for events table (optional)
-- ALTER TABLE events AUTO_INCREMENT = 34;

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
)),
(27, 'precision-rifle-shoot-may-30', NULL,
 JSON_ARRAY(
    'Precision Rifle Shoot at Tommy Gun Warehouse. Scoped rifle shooting and long-range marksmanship.',
    'Registration and fee required. Contact the VSA for details.'
)),
-- VSA-PA events (ids 28-33)
(28, 'vsa-pa-precision-rifle-may-30', NULL,
 JSON_ARRAY(
    'VSA Members and their guests will have full access to the 600 Meter precision rifle range at Tommy Gun Warehouse in Greeley PA. Catered lunch is included.',
    'Registration and range fee required. Contact the VSA-PA chapter for details.'
)),
(29, 'vsa-pa-kayaking-jul-25', NULL,
 JSON_ARRAY(
    'We will be kayaking down the Delaware River in the Dingmans PA area. This is a half-day trip; participants must bring their own raft, canoe, or kayak. A limited number of kayaks are available for free use.',
    'Put-in and take-out locations will be decided a week before the trip based on water levels. Meet at the Dingmans Ferry boat launch at 1300 hours.',
    'Contact the VSA-PA chapter to register.'
)),
(30, 'vsa-pa-camp-freedom-aug-22', NULL,
 JSON_ARRAY(
    'Saturday 22 August at Camp Freedom in Carbondale PA—Summer Salute event. Join VSA-PA for this community celebration.',
    'Registration required. Contact the VSA-PA chapter for details.'
)),
(31, 'vsa-pa-let-freedom-ring-oct-10', NULL,
 JSON_ARRAY(
    'VSA Machine Gun Shoot at Kahr Arms in Greeley PA. VSA members and guests will have access to the range for this special event.',
    'Registration and fee required. Contact the VSA-PA chapter for details.'
)),
(32, 'vsa-pa-rod-of-iron-oct-10', NULL,
 JSON_ARRAY(
    'The Rod of Iron Freedom Festival is a free 2nd Amendment event at Kahr Arms, 105 Kahr Ave in Greeley, Pennsylvania. Patriotic displays, food and vendor booths, shooting competitions, family activities, fireworks, educational seminars, live music, and more.',
    'No registration required. Free admission. Contact the VSA-PA chapter for more information.'
)),
(33, 'vsa-pa-veterans-day-nov-11', NULL,
 JSON_ARRAY(
    'Our First Annual Pike County Veterans Day Dinner and Turkey Shoot. Free Thanksgiving-style dinner for Pike County PA Veterans after a traditional turkey shoot on the range.',
    'Date and venue information coming soon. Contact the VSA-PA chapter for updates.'
));
SET FOREIGN_KEY_CHECKS = 1;


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

-- Insert Media (gallery images; path relative to uploads root)
INSERT INTO media (type, path, alt_text, caption, display_order, event_id) VALUES
('gallery', 'gallery/30c799_6c5b7f47d057455497bc4936c6462790~mv2.jpg', 'VSA Event', NULL, 1, NULL),
('gallery', 'gallery/99ec98fdb81945c29c25a3ad6c5606b1.jpg', 'VSA Activity', NULL, 2, NULL),
('gallery', 'gallery/30c799_56468b7c375d4956ac7b3039bbaf4789~mv2.jpg', 'VSA Program', NULL, 3, NULL),
('gallery', 'gallery/30c799_e52caab3522f42b2b32b55b48215eeb7~mv2.jpg', 'VSA Event', NULL, 4, NULL),
('gallery', 'gallery/30c799_958dd0efbd1c4f26bba179a9dd2d1261~mv2.jpg', 'VSA Activity', NULL, 5, NULL),
('gallery', 'gallery/30c799_10bf358ef0a74b6ab84752c574bcacfe~mv2.jpg', 'VSA Program', NULL, 6, NULL);

