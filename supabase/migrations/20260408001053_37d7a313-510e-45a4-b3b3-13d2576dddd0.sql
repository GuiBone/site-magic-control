
-- 1. Create all tables first
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  UNIQUE (user_id, role)
);

CREATE TABLE public.site_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT NOT NULL UNIQUE,
  title TEXT,
  subtitle TEXT,
  content TEXT,
  image_url TEXT,
  extra JSONB DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.budget_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT DEFAULT 'Briefcase',
  sort_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Security definer function
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 3. RLS Policies
CREATE POLICY "Anyone can read site content" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "Admins can manage site content" ON public.site_content FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can submit budget request" ON public.budget_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view budget requests" ON public.budget_requests FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update budget requests" ON public.budget_requests FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can read services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Admins can manage services" ON public.services FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can read roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 4. Seed data
INSERT INTO public.site_content (section_key, title, subtitle, content) VALUES
('hero', 'DTF ARTZONE', 'Soluções criativas para o seu negócio', 'Transformamos suas ideias em realidade com qualidade e profissionalismo.'),
('about', 'Sobre Nós', 'Quem somos', 'Somos uma empresa dedicada a oferecer soluções de alta qualidade para nossos clientes. Com anos de experiência no mercado, combinamos criatividade e tecnologia para entregar resultados excepcionais.'),
('contact', 'Contato', 'Fale Conosco', 'Entre em contato para saber mais sobre nossos serviços.');

INSERT INTO public.services (title, description, icon, sort_order) VALUES
('Impressão DTF', 'Impressão de alta qualidade em DTF para diversos materiais e tecidos.', 'Printer', 1),
('Design Personalizado', 'Criação de artes e designs exclusivos para sua marca.', 'Palette', 2),
('Produção em Larga Escala', 'Atendemos pedidos de qualquer volume com agilidade e qualidade.', 'Factory', 3);
