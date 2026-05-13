-- V12__Institutional_Notification_System.sql

-- 1. Notifications Content Table
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    image_url TEXT,
    cta_text VARCHAR(50),
    cta_link TEXT,
    type VARCHAR(50) DEFAULT 'SYSTEM', -- SYSTEM, PROMOTIONAL, SECURITY, TRANSACTIONAL
    priority VARCHAR(20) DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH, CRITICAL
    sender_id BIGINT REFERENCES users(id),
    scheduled_at TIMESTAMP,
    is_broadcast BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

-- 2. Notification Recipients (Tracking Table)
CREATE TABLE notification_recipients (
    id BIGSERIAL PRIMARY KEY,
    notification_id BIGINT REFERENCES notifications(id) ON DELETE CASCADE,
    recipient_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT FALSE,
    is_delivered BOOLEAN DEFAULT FALSE,
    is_clicked BOOLEAN DEFAULT FALSE,
    delivered_at TIMESTAMP,
    read_at TIMESTAMP,
    clicked_at TIMESTAMP,
    UNIQUE(notification_id, recipient_id)
);

-- 3. User Notification Preferences
CREATE TABLE notification_preferences (
    user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    email_enabled BOOLEAN DEFAULT TRUE,
    push_enabled BOOLEAN DEFAULT TRUE,
    in_app_enabled BOOLEAN DEFAULT TRUE,
    promotional_enabled BOOLEAN DEFAULT TRUE,
    order_updates_enabled BOOLEAN DEFAULT TRUE,
    security_alerts_enabled BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Push Tokens (FCM)
CREATE TABLE push_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    device_type VARCHAR(50), -- BROWSER, IOS, ANDROID
    last_used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Notification Campaigns (For analytics and scheduling)
CREATE TABLE notification_campaigns (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    notification_id BIGINT REFERENCES notifications(id),
    target_criteria JSONB, -- Stores filters like { "role": "CUSTOMER", "minSpend": 50000 }
    status VARCHAR(50) DEFAULT 'DRAFT', -- DRAFT, SCHEDULED, IN_PROGRESS, COMPLETED
    total_recipients INT DEFAULT 0,
    delivered_count INT DEFAULT 0,
    read_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indices for high-speed institutional retrieval
CREATE INDEX idx_notif_recipient ON notification_recipients(recipient_id, is_read);
CREATE INDEX idx_notif_type ON notifications(type);
CREATE INDEX idx_push_token_user ON push_tokens(user_id);
