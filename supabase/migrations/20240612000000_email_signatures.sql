-- ============================================================
-- Email Signature Builder — Supabase Migration
-- ============================================================
-- Run with: supabase db push
-- Or paste into the Supabase SQL Editor.
-- ============================================================

-- ── Table: email_signatures ──────────────────────────────────

CREATE TABLE IF NOT EXISTS public.email_signatures (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id    uuid        NOT NULL,
  employee_name text        NOT NULL DEFAULT '',
  template_id   text        NOT NULL DEFAULT 'the-opensend',
  fields        jsonb       NOT NULL DEFAULT '{}',
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS email_signatures_account_id_idx
  ON public.email_signatures (account_id);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_email_signatures_updated_at ON public.email_signatures;
CREATE TRIGGER set_email_signatures_updated_at
  BEFORE UPDATE ON public.email_signatures
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.email_signatures ENABLE ROW LEVEL SECURITY;

-- Allow all users during development
-- TODO: Tighten these once accounts_memberships is available
CREATE POLICY "Allow all read"
    ON public.email_signatures
    FOR SELECT
    USING (true);

CREATE POLICY "Allow all insert"
    ON public.email_signatures
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow all update"
    ON public.email_signatures
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow all delete"
    ON public.email_signatures
    FOR DELETE
    USING (true);


-- ── Table: public_signature_links ────────────────────────────

CREATE TABLE IF NOT EXISTS public.public_signature_links (
  token       text        PRIMARY KEY,
  html        text        NOT NULL,
  account_id  uuid,
  expires_at  timestamptz NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS public_signature_links_expires_at_idx
  ON public.public_signature_links (expires_at);

ALTER TABLE public.public_signature_links ENABLE ROW LEVEL SECURITY;

-- No public policies for share links.
-- These rows should be accessed only by server-side code using the
-- SUPABASE_SERVICE_ROLE_KEY, not via anon/public Data API.
