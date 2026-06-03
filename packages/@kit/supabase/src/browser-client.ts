import { createBrowserClient } from '@supabase/ssr';

/**
 * createSupabaseBrowserClient
 * ============================
 * Creates a Supabase client for use in Client Components (browser).
 */
export const createSupabaseBrowserClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
};
