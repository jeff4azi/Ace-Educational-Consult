-- Add phone number column to contact messages
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS phone_number VARCHAR(50);
