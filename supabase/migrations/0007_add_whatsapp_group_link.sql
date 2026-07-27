-- Add whatsapp_group_link column to site_settings
ALTER TABLE site_settings
ADD COLUMN IF NOT EXISTS whatsapp_group_link TEXT;

-- Update the existing row with a default placeholder
UPDATE site_settings
SET whatsapp_group_link = ''
WHERE whatsapp_group_link IS NULL;
