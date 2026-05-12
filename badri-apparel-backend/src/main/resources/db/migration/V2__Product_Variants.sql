-- Step 1: Add new columns to products table
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS has_variants BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS base_price DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS meta_title VARCHAR(60),
  ADD COLUMN IF NOT EXISTS meta_description VARCHAR(160),
  ADD COLUMN IF NOT EXISTS hsn_code VARCHAR(20),
  ADD COLUMN IF NOT EXISTS care_instructions TEXT,
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- Step 2: Create product_variants table
-- Using UUID for variant ID as requested, but BIGINT for product_id to match existing products table
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sku VARCHAR(100) UNIQUE NOT NULL,
  size VARCHAR(30),              -- XS | S | M | L | XL | XXL | 2XL | 3XL | Free Size
  color VARCHAR(50),
  color_hex VARCHAR(7),
  mrp DECIMAL(10,2) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  cost_price DECIMAL(10,2),
  stock INT NOT NULL DEFAULT 0,
  low_stock_threshold INT DEFAULT 5,
  weight_grams INT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- Step 3: Create product_images table (Converting from Embeddable to Entity)
CREATE TABLE IF NOT EXISTS product_images_new (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id),
  cloudinary_public_id VARCHAR(255),
  url VARCHAR(500) NOT NULL,
  alt_text VARCHAR(200),
  sort_order INT DEFAULT 0,
  is_main BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Migration: Existing flat stock/price into variants table
INSERT INTO product_variants (id, product_id, sku, size, color, mrp, price, stock)
SELECT
  gen_random_uuid(),
  p.id,
  CONCAT('BB-', UPPER(LEFT(p.title,3)), '-', p.id, '-', ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY p.id)),
  'Free Size',
  'Default',
  p.price,
  p.price,
  p.stock
FROM products p
WHERE NOT p.has_variants;

UPDATE products SET has_variants = true WHERE has_variants = false;
