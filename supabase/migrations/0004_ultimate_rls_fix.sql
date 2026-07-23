-- Ultimate RLS fix - grant schema usage and set simple policies

-- Grant usage on public schema to necessary roles
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Grant necessary table permissions
GRANT SELECT, INSERT ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;

-- ============================================
-- Site Settings
-- ============================================
ALTER TABLE site_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS ANY ON site_settings;

CREATE POLICY "allow_all" ON site_settings
FOR ALL
USING (true)
WITH CHECK (true);

-- ============================================
-- Service Categories
-- ============================================
ALTER TABLE service_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS ANY ON service_categories;

CREATE POLICY "allow_all" ON service_categories
FOR ALL
USING (true)
WITH CHECK (true);

-- ============================================
-- Services
-- ============================================
ALTER TABLE services DISABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS ANY ON services;

CREATE POLICY "allow_all" ON services
FOR ALL
USING (true)
WITH CHECK (true);

-- ============================================
-- Testimonials
-- ============================================
ALTER TABLE testimonials DISABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS ANY ON testimonials;

CREATE POLICY "allow_all" ON testimonials
FOR ALL
USING (true)
WITH CHECK (true);

-- ============================================
-- Contact Messages
-- ============================================
ALTER TABLE contact_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS ANY ON contact_messages;

CREATE POLICY "allow_all" ON contact_messages
FOR ALL
USING (true)
WITH CHECK (true);

-- ============================================
-- Orders
-- ============================================
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS ANY ON orders;

CREATE POLICY "allow_all" ON orders
FOR ALL
USING (true)
WITH CHECK (true);
