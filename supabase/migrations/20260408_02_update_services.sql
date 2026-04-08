-- 1. Drop existing services table
DROP TABLE IF EXISTS public.services CASCADE;

-- 2. Create the new services table matching user specification
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  icon text,
  image_url text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 3. Attach trigger for auto updated_at (assumes set_updated_at function exists from previous migration)
CREATE TRIGGER tg_services_updated_at
BEFORE UPDATE ON public.services
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- 4. Enable RLS and setup Policies
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active services" 
ON public.services 
FOR SELECT 
USING (true); -- Leitura pública para todos na Landing Page (filtrado no frontend via is_active, mas public data. Admin needs all)

CREATE POLICY "Admins can insert services" 
ON public.services 
FOR INSERT 
TO authenticated 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update services" 
ON public.services 
FOR UPDATE 
TO authenticated 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete services" 
ON public.services 
FOR DELETE 
TO authenticated 
USING (public.has_role(auth.uid(), 'admin'));

-- 5. Insert default seeds
INSERT INTO public.services (title, description, icon, display_order, is_active) VALUES
('Impressão DTF Premium', 'Maior vivacidade de cores e durabilidade superior para estampas em algodão, poliéster e mais. Alta definição para logos e ilustrações complexas.', 'Printer', 10, true),
('Adesivos Personalizados', 'Adesivos vibrantes e resistentes, perfeitos para branding, brindes corporativos e sinalização. Recorte exclusivo para o seu design.', 'Palette', 20, true),
('Design para Marcas', 'Garantimos que sua marca se destaque no mercado criando desde a concepção do logotipo à aplicação na estamparia e mídias visuais.', 'Briefcase', 30, true),
('Identidade Visual', 'Construímos um pacote visual completo para sua empresa, unindo paleta de cores e tipografia para garantir o formato mais atrativo ao público final.', 'Palette', 40, false);
