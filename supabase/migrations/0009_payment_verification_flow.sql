-- Add pending_verification to the order_status enum
ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'pending_verification';

-- Add receipt_url column to orders table
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS receipt_url TEXT;
