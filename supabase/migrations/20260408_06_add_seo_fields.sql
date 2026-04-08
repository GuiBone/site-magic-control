-- Migration: Add SEO fields to site_content
-- Created: 2026-04-08
-- Description: Insert default SEO configuration fields for DTF ARTZONE

-- Insert SEO fields if they don't exist (using ON CONFLICT to be safe)
INSERT INTO public.site_content (section, key, label, value, field_type) VALUES
('seo', 'seo_title', 'SEO Title', 'DTF ARTZONE', 'text'),
('seo', 'seo_description', 'Meta Description', 'Impressão DTF com qualidade profissional, adesivos personalizados e atendimento ágil.', 'textarea'),
('seo', 'seo_keywords', 'SEO Keywords', 'dtf, impressão dtf, adesivos personalizados, gráfica dtf', 'text'),
('seo', 'seo_og_image', 'Imagem Open Graph', '', 'image'),
('seo', 'seo_favicon', 'Favicon', '', 'image')
ON CONFLICT (key) DO NOTHING;