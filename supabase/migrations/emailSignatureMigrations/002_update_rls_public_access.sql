-- ============================================================
-- Update RLS Policies for Development
-- Allow public/unauthenticated access during development
-- ============================================================

-- Drop existing policies for email_signatures
DROP POLICY IF EXISTS "Authenticated users can read signatures" ON public.email_signatures;
DROP POLICY IF EXISTS "Authenticated users can create signatures" ON public.email_signatures;
DROP POLICY IF EXISTS "Authenticated users can update signatures" ON public.email_signatures;
DROP POLICY IF EXISTS "Authenticated users can delete signatures" ON public.email_signatures;

-- Create new permissive policies that allow all access
CREATE POLICY "Allow all read"
  ON public.email_signatures FOR SELECT
  USING (true);

CREATE POLICY "Allow all insert"
  ON public.email_signatures FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow all update"
  ON public.email_signatures FOR UPDATE
  USING (true);

CREATE POLICY "Allow all delete"
  ON public.email_signatures FOR DELETE
  USING (true);

-- Drop existing policy for public_signature_links
DROP POLICY IF EXISTS "Authenticated users can create share links" ON public.public_signature_links;

-- Create new permissive policy
CREATE POLICY "Allow all insert for share links"
  ON public.public_signature_links FOR INSERT
  WITH CHECK (true);
