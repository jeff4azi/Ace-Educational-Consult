-- Create storage bucket for order file uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'order-files',
  'order-files',
  true,
  10485760, -- 10 MB limit
  ARRAY[
    'image/jpeg','image/jpg','image/png','image/gif','image/webp','image/bmp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain','text/csv',
    'application/zip','application/x-zip-compressed'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access
CREATE POLICY "Allow public read on order-files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'order-files');

-- Allow anyone to upload (orders are placed by unauthenticated users)
CREATE POLICY "Allow public upload to order-files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'order-files');

-- Allow authenticated users to delete
CREATE POLICY "Allow authenticated delete on order-files"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'order-files' AND auth.role() = 'authenticated');
