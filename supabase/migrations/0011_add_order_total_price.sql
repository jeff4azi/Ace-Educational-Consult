-- Add total_price column to orders table
-- Stores the final computed price (base price + any conditional fees) at time of order
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS total_price NUMERIC;
