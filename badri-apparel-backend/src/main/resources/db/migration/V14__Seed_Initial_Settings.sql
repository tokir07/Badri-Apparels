-- V14__Seed_Initial_Settings.sql
-- Provides baseline institutional configurations for the Badri Apparel platform.

CREATE TABLE IF NOT EXISTS system_settings (
    id BIGSERIAL PRIMARY KEY,
    config_key VARCHAR(255) UNIQUE NOT NULL,
    config_value TEXT,
    description VARCHAR(255),
    group_name VARCHAR(100)
);

INSERT INTO system_settings (config_key, config_value, description, group_name) VALUES
('store_name', 'BADRIBHAI APPAREL', 'Institutional title of the heritage platform', 'STORE'),
('store_email', 'concierge@badribhai.com', 'Primary concierge channel for patron relations', 'STORE'),
('store_description', 'A high-performance luxury ecosystem specializing in limited edition Jaipuri handcrafted masterpieces.', 'Official platform manifest', 'STORE'),
('currency', 'INR', 'Baseline market currency for financial transactions', 'STORE'),
('timezone', '(GMT+05:30) Mumbai, New Delhi', 'Primary temporal alignment for the ecosystem', 'STORE'),
('is_maintenance_mode', 'false', 'Global accessibility protocol switch', 'SYSTEM');
