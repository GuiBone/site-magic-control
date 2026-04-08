CREATE TABLE IF NOT EXISTS public.gallery_items (
    id uuid primary key default gen_random_uuid(),
    title text,
    image_url text not null,
    display_order integer default 0,
    is_active boolean default true,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Active the updated_at trigger for gallery_items
CREATE TRIGGER set_gallery_items_updated_at
BEFORE UPDATE ON public.gallery_items
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- RLS setup
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active gallery items" 
    ON public.gallery_items FOR SELECT 
    USING (true);

CREATE POLICY "Admins can insert gallery items" 
    ON public.gallery_items FOR INSERT 
    TO authenticated 
    WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update gallery items" 
    ON public.gallery_items FOR UPDATE 
    TO authenticated 
    USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete gallery items" 
    ON public.gallery_items FOR DELETE 
    TO authenticated 
    USING (public.has_role(auth.uid(), 'admin'));
