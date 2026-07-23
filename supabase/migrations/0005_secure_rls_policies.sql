-- Secure RLS policies - re-tighten after testing

-- ============================================
-- Site Settings
-- ============================================
ALTER TABLE site_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS ANY ON site_settings;

CREATE POLICY "site_settings_public_select"
ON site_settings
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "site_settings_authenticated_all"
ON site_settings
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- ============================================
-- Service Categories
-- ============================================
ALTER TABLE service_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS ANY ON service_categories;

CREATE POLICY "service_categories_public_select"
ON service_categories
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "service_categories_authenticated_all"
ON service_categories
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- ============================================
-- Services
-- ============================================
ALTER TABLE services DISABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS ANY ON services;

CREATE POLICY "services_public_select"
ON services
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "services_authenticated_all"
ON services
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- ============================================
-- Testimonials
-- ============================================
ALTER TABLE testimonials DISABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS ANY ON testimonials;

CREATE POLICY "testimonials_public_select_approved"
ON testimonials
FOR SELECT
TO anon, authenticated
USING (approved = true);

CREATE POLICY "testimonials_public_insert"
ON testimonials
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "testimonials_authenticated_all"
ON testimonials
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- ============================================
-- Contact Messages
-- ============================================
ALTER TABLE contact_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS ANY ON contact_messages;

CREATE POLICY "contact_messages_public_insert"
ON contact_messages
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "contact_messages_authenticated_all"
ON contact_messages
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- ============================================
-- Orders
-- ============================================
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS ANY ON orders;

CREATE POLICY "orders_public_insert"
ON orders
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "orders_authenticated_all"
ON orders
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
