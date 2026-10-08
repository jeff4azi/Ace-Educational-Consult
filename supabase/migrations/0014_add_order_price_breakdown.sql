-- Add price_breakdown column to orders table for immutable snapshot of order pricing
ALTER TABLE orders ADD COLUMN IF NOT EXISTS price_breakdown JSONB;
