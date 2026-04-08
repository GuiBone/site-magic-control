-- 1. Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Drop the old site_content table
DROP TABLE IF EXISTS public.site_content CASCADE;

-- 3. Create the new site_content table matching user specification
CREATE TABLE public.site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  label text NOT NULL,
  value text,
  section text NOT NULL,
  field_type text NOT NULL DEFAULT 'text',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 4. Attach trigger for auto updated_at
CREATE TRIGGER tg_site_content_updated_at
BEFORE UPDATE ON public.site_content
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- 5. Enable RLS and setup Policies
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site content" 
ON public.site_content 
FOR SELECT 
USING (true);

-- Assumes public.has_role() is already created in a previous migration (which we know it is)
CREATE POLICY "Admins can insert site content" 
ON public.site_content 
FOR INSERT 
TO authenticated 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update site content" 
ON public.site_content 
FOR UPDATE 
TO authenticated 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete site content" 
ON public.site_content 
FOR DELETE 
TO authenticated 
USING (public.has_role(auth.uid(), 'admin'));

-- 6. Insert default seeds
INSERT INTO public.site_content (section, key, label, value) VALUES
('hero', 'hero_badge', 'Badge do topo', 'Bem-vindo à DTF ARTZONE'),
('hero', 'hero_title', 'Título principal', 'Impressão DTF com qualidade profissional'),
('hero', 'hero_subtitle', 'Subtítulo principal', 'Produzimos impressões e adesivos personalizados com acabamento premium e atendimento ágil.'),
('hero', 'hero_cta_text', 'Texto do botão principal', 'Solicitar orçamento'),
('hero', 'hero_cta_link', 'Link do botão principal', 'https://wa.me/5500000000000'),

('about', 'about_title', 'Título da seção Sobre', 'Sobre a DTF ARTZONE'),
('about', 'about_text', 'Texto da seção Sobre', 'Somos especialistas em impressão personalizada, focados em qualidade, agilidade e acabamento premium para sua marca ou projeto.'),

('services', 'services_title', 'Título da seção Serviços', 'Nossos Serviços'),
('services', 'services_subtitle', 'Subtítulo da seção Serviços', 'Conheça as soluções que oferecemos para transformar suas ideias em materiais de alto impacto.'),

('contact', 'contact_title', 'Título da seção Contato', 'Fale com a nossa equipe'),
('contact', 'contact_subtitle', 'Subtítulo da seção Contato', 'Solicite um orçamento e receba atendimento rápido pelo WhatsApp.'),
('contact', 'contact_phone', 'Telefone', '(45) 99999-9999'),
('contact', 'contact_email', 'E-mail', 'contato@dtfartzone.com.br'),

('footer', 'footer_text', 'Texto do rodapé', '© DTF ARTZONE. Todos os direitos reservados.');
