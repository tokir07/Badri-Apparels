ALTER TABLE coupons
    ADD COLUMN IF NOT EXISTS max_discount_amount DOUBLE PRECISION,
    ADD COLUMN IF NOT EXISTS usage_limit INT,
    ADD COLUMN IF NOT EXISTS usage_limit_per_user INT DEFAULT 1,
    ADD COLUMN IF NOT EXISTS used_count INT DEFAULT 0,
    ADD COLUMN IF NOT EXISTS starts_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITHOUT TIME ZONE;

ALTER TABLE orders
    ADD COLUMN IF NOT EXISTS coupon_code VARCHAR(50),
    ADD COLUMN IF NOT EXISTS discount_amount DOUBLE PRECISION DEFAULT 0.0;

-- Fix any naming discrepancies if needed
-- The existing table has min_order_amount, discount_type, expiry_date (which matches expires_at logic)
