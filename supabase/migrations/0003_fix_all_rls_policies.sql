-- Fix all RLS policies with explicit role permissions

-- ============================================
-- Site Settings
-- ============================================
DROP POLICY IF EXISTS "Allow public read access to site settings" ON site_settings;
DROP POLICY IF EXISTS "Allow authenticated users full access to site settings" ON site_settings;

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
DROP POLICY IF EXISTS "Allow public read access to service categories" ON service_categories;
DROP POLICY IF EXISTS "Allow authenticated users full access to service categories" ON service_categories;

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
DROP POLICY IF EXISTS "Allow public read access to services" ON services;
DROP POLICY IF EXISTS "Allow authenticated users full access to services" ON services;

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
DROP POLICY IF EXISTS "Allow public read access to approved testimonials" ON testimonials;
DROP POLICY IF EXISTS "Allow public to create testimonials" ON testimonials;
DROP POLICY IF EXISTS "Allow authenticated users full access to testimonials" ON testimonials;

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
DROP POLICY IF EXISTS "Allow public to create contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Allow authenticated users full access to contact messages" ON contact_messages;

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
DROP POLICY IF EXISTS "Allow public to create orders" ON orders;
DROP POLICY IF EXISTS "Allow authenticated users full access to orders" ON orders;
DROP POLICY IF EXISTS "Enable public insert for orders" ON orders;
DROP POLICY IF EXISTS "Enable read access for authenticated users only" ON orders;
DROP POLICY IF EXISTS "Enable update access for authenticated users only" ON orders;
DROP POLICY IF EXISTS "Enable delete access for authenticated users only" ON orders;

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
