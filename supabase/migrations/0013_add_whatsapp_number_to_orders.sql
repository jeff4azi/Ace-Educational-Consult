-- Add whatsapp_number column to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS whatsapp_number TEXT;
