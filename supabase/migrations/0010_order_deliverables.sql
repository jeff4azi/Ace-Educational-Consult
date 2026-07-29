-- Add deliverable_urls column to orders table
-- Stores an array of { url, name } objects for files uploaded by admin
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS deliverable_urls JSONB DEFAULT '[]'::jsonb;
