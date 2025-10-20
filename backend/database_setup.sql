-- TerraMamilia Forum Database Schema
-- Run this SQL in your cPanel phpMyAdmin to create the database structure

CREATE DATABASE IF NOT EXISTS terrafamilia_forum;
USE terrafamilia_forum;

-- Users table for registration and authentication
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    state_province VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    avatar_url VARCHAR(255) DEFAULT NULL,
    bio TEXT DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
);

-- Categories table for forum organization
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    parent_id INT DEFAULT NULL,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Posts table for forum posts
CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_locked BOOLEAN DEFAULT FALSE,
    view_count INT DEFAULT 0,
    reply_count INT DEFAULT 0,
    last_reply_at TIMESTAMP NULL,
    last_reply_user_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    FOREIGN KEY (last_reply_user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Replies table for post responses
CREATE TABLE replies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    parent_reply_id INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_reply_id) REFERENCES replies(id) ON DELETE CASCADE
);

-- User sessions for authentication
CREATE TABLE user_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert default categories
INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES
-- Main categories
('Trading & Barter', 'trading-barter', 'Exchange items, skills, and services with community members', NULL, 1),
('Knowledge Exchange', 'knowledge-exchange', 'Share wisdom, ask questions, and learn together', NULL, 2),
('Community Life', 'community-life', 'Connect with neighbors and build relationships', NULL, 3),
('The Commons Hub', 'commons-hub', 'Official updates and community support', NULL, 4);

-- Get the IDs of the main categories for subcategories
SET @trading_id = (SELECT id FROM categories WHERE slug = 'trading-barter');
SET @knowledge_id = (SELECT id FROM categories WHERE slug = 'knowledge-exchange');
SET @community_id = (SELECT id FROM categories WHERE slug = 'community-life');
SET @hub_id = (SELECT id FROM categories WHERE slug = 'commons-hub');

-- Subcategories
INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES
-- Trading & Barter subcategories
('Item & Skill Exchange', 'item-skill-exchange', 'Trade items and skills with other members', @trading_id, 1),
('Community Projects', 'community-projects', 'Collaborate on projects that benefit the community', @trading_id, 2),
('Free Stuff / Giveaways', 'free-giveaways', 'Share free items and organize giveaways', @trading_id, 3),

-- Knowledge Exchange subcategories
('Ask & Answer', 'ask-answer', 'Ask questions and get answers from the community', @knowledge_id, 1),
('Guides & Tutorials', 'guides-tutorials', 'Share step-by-step guides and tutorials', @knowledge_id, 2),
('Local Resources', 'local-resources', 'Share information about local resources and services', @knowledge_id, 3),

-- Community Life subcategories
('Introductions', 'introductions', 'Introduce yourself to the community', @community_id, 1),
('Events & Meetups', 'events-meetups', 'Organize and discuss community events', @community_id, 2),
('General Discussion', 'general-discussion', 'General conversation and community discussion', @community_id, 3),

-- The Commons Hub subcategories
('Announcements', 'announcements', 'Official announcements and news', @hub_id, 1),
('Feedback & Suggestions', 'feedback-suggestions', 'Share your feedback and suggestions for improvement', @hub_id, 2),
('Help & Support', 'help-support', 'Get help and technical support', @hub_id, 3);

-- Create indexes for better performance
CREATE INDEX idx_posts_category ON posts(category_id);
CREATE INDEX idx_posts_user ON posts(user_id);
CREATE INDEX idx_posts_created ON posts(created_at);
CREATE INDEX idx_replies_post ON replies(post_id);
CREATE INDEX idx_replies_user ON replies(user_id);
CREATE INDEX idx_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_sessions_expires ON user_sessions(expires_at);