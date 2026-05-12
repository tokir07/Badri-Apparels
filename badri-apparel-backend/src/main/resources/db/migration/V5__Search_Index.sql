CREATE INDEX IF NOT EXISTS idx_products_fts
  ON products USING GIN (to_tsvector('english', title || ' ' || COALESCE(description,'')));
