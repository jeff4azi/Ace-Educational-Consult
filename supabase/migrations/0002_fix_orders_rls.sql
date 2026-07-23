-- Fix RLS policies for orders table
DROP POLICY IF EXISTS "Allow public to create orders" ON orders;
DROP POLICY IF EXISTS "Allow authenticated users full access to orders" ON orders;

-- Recreate policies with explicit permissions
CREATE POLICY "Enable public insert for orders"
ON orders
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Enable read access for authenticated users only"
ON orders
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable update access for authenticated users only"
ON orders
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete access for authenticated users only"
ON orders
FOR DELETE
TO authenticated
USING (true);
