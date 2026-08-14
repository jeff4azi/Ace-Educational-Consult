-- Let admins set an explicit display order for service categories, instead of
-- relying on alphabetical/insertion order (which was shuffling on every edit).

ALTER TABLE service_categories
ADD COLUMN IF NOT EXISTS display_order INTEGER;

-- Backfill existing categories using creation order, so the first category an
-- admin ever created becomes position 0 (matches what they'd expect as "first").
WITH ordered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) - 1 AS rn
  FROM service_categories
)
UPDATE service_categories sc
SET display_order = ordered.rn
FROM ordered
WHERE sc.id = ordered.id
  AND sc.display_order IS NULL;

ALTER TABLE service_categories
ALTER COLUMN display_order SET DEFAULT 0,
ALTER COLUMN display_order SET NOT NULL;
