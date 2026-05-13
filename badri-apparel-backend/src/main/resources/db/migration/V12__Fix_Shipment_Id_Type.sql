-- V12__Fix_Shipment_Id_Type.sql
-- The shipments table was found to have a BIGINT id instead of UUID in some environments.
-- This migration ensures it is converted to UUID.

-- Drop existing table to ensure clean recreation with UUID
DROP TABLE IF EXISTS shipments CASCADE;

CREATE TABLE shipments (
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

CREATE INDEX IF NOT EXISTS idx_shipments_order_id ON shipments(order_id);
