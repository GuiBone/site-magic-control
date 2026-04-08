-- 1. Rename the existing table to preserve leads
ALTER TABLE IF EXISTS public.budget_requests RENAME TO quotes;

-- If the table was freshly created as quotes, the above might fail or we might need to be careful.
-- Assuming budget_requests existed. Let's rename the columns safely.
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='quotes' AND column_name='description'
  ) THEN
    ALTER TABLE public.quotes RENAME COLUMN description TO message;
  END IF;
END $$;

-- 2. Add missing fields if they don't exist
ALTER TABLE public.quotes
  ADD COLUMN IF NOT EXISTS file_url text,
  ADD COLUMN IF NOT EXISTS notes text,
  ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- 3. Adjust defaults and update old records
ALTER TABLE public.quotes ALTER COLUMN status SET DEFAULT 'novo';

-- Transition old statuses to new statuses explicitly
UPDATE public.quotes SET status = 'novo' WHERE status = 'pending';
UPDATE public.quotes SET status = 'em_contato' WHERE status = 'contacted';
UPDATE public.quotes SET status = 'aprovado' WHERE status = 'completed';
UPDATE public.quotes SET status = 'recusado' WHERE status = 'rejected';
-- Catch-all for any other weird status
UPDATE public.quotes SET status = 'novo' WHERE status NOT IN ('novo', 'em_contato', 'aprovado', 'recusado');

-- 4. Re-attach updated_at trigger
DROP TRIGGER IF EXISTS tg_quotes_updated_at ON public.quotes;
CREATE TRIGGER tg_quotes_updated_at
BEFORE UPDATE ON public.quotes
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- 5. Set up new RLS Policies for quotes
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

-- Clean up any old policies bound to budget_requests via old names
DROP POLICY IF EXISTS "Public can insert budget_requests" ON public.quotes;
DROP POLICY IF EXISTS "Admins can view budget_requests" ON public.quotes;
DROP POLICY IF EXISTS "Admins can update budget_requests" ON public.quotes;
DROP POLICY IF EXISTS "Admins can delete budget_requests" ON public.quotes;

CREATE POLICY "Public can insert quotes" 
ON public.quotes 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can read quotes" 
ON public.quotes 
FOR SELECT 
TO authenticated 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update quotes" 
ON public.quotes 
FOR UPDATE 
TO authenticated 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete quotes" 
ON public.quotes 
FOR DELETE 
TO authenticated 
USING (public.has_role(auth.uid(), 'admin'));
