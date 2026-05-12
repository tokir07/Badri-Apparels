CREATE TABLE IF NOT EXISTS shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  carrier VARCHAR(50),
  awb_code VARCHAR(100),
  tracking_url VARCHAR(500),
  status VARCHAR(50) DEFAULT 'PENDING',
  shipped_at TIMESTAMP WITH TIME ZONE,
  estimated_delivery DATE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index for faster tracking lookups
CREATE INDEX idx_shipments_order_id ON shipments(order_id);
