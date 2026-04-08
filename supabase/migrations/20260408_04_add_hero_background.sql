-- 1. Insert the new field for the Hero background image directly
INSERT INTO public.site_content (key, label, section, field_type, value)
VALUES (
    'hero_background_image', 
    'Imagem de Fundo da Hero', 
    'hero', 
    'image', 
    ''
)
ON CONFLICT (key) DO UPDATE 
SET field_type = 'image', label = EXCLUDED.label;

-- 2. Create Storage Bucket (if it doesn't already exist)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 3. Set up Storage Policies for site-assets bucket
-- Note: Requires `public.has_role(auth.uid(), 'admin')` which already exists in the project setup

-- Dropping prior policies for idempotency just in case
DROP POLICY IF EXISTS "Public can view site-assets" ON storage.objects;
DROP POLICY IF EXISTS "Admins can insert site-assets" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update site-assets" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete site-assets" ON storage.objects;

-- Allow public viewing of images
CREATE POLICY "Public can view site-assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'site-assets');

-- Allow authenticated Admins to insert files
CREATE POLICY "Admins can insert site-assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'site-assets' AND 
    public.has_role(auth.uid(), 'admin')
);

-- Allow authenticated Admins to update files
CREATE POLICY "Admins can update site-assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'site-assets' AND 
    public.has_role(auth.uid(), 'admin')
);

-- Allow authenticated Admins to delete files
CREATE POLICY "Admins can delete site-assets"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'site-assets' AND 
    public.has_role(auth.uid(), 'admin')
);
