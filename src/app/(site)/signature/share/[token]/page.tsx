/**
 * Public Signature Share Page
 * ============================
 * Route: /share/[token]  — no auth required
 *
 * Renders a 7-day shareable signature preview link.
 * Reads from public_signature_links table server-side.
 *
 * Requires:
 * - supabase/migrations/001_email_signatures.sql to be run
 * - POST /api/signature-links route handler (see README.md)
 */

import { createSupabaseServiceClient } from '@kit/supabase/server-client';
import { notFound } from 'next/navigation';

import { SharePageClient } from './SharePageClient';

interface Props {
  params: Promise<{ token: string }>;
}

export default async function SharePage({ params }: Props) {
  const { token } = await params;
  const supabase = createSupabaseServiceClient();

  const { data, error } = await supabase
    .from('public_signature_links')
    .select('html, expires_at')
    .eq('token', token)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (error || !data) notFound();

  const expiryDate = new Date(data.expires_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="share-page-container">
      <style dangerouslySetInnerHTML={{
        __html: `
        .share-page-container { font-family: Inter, system-ui, sans-serif; background: #f9fafb; min-height: 100vh; padding: 2.5rem 1rem; color: #111; }
        .wrapper { max-width: 680px; margin: 0 auto; }
        .card { background: #fff; border: 1px solid #e5e7eb; border-radius: 0.75rem; padding: 2rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .header { margin-bottom: 1.5rem; padding-bottom: 1.25rem; border-bottom: 1px solid #e5e7eb; }
        .header h1 { font-size: 1rem; font-weight: 600; margin-bottom: 0.25rem; }
        .header p { font-size: 0.8125rem; color: #6b7280; }
        .copy-btn { display: inline-flex; align-items: center; gap: 0.375rem; margin-top: 1.5rem; padding: 0.5rem 1rem; background: #111; color: #fff; border: none; border-radius: 0.5rem; font-size: 0.875rem; font-weight: 500; cursor: pointer; }
        .copy-btn:hover { background: #374151; }
        .expiry { margin-top: 1rem; font-size: 0.75rem; color: #9ca3af; }
        .preview-area { background: #fff; padding: 1rem; border: 1px dashed #e5e7eb; border-radius: 0.5rem; overflow-x: auto; }
      `}} />
      <div className="wrapper">
        <div className="card">
          <div className="header">
            <h1>Email Signature Preview</h1>
            <p>Review the signature below, then copy the HTML to use in your email client.</p>
          </div>
          <div className="preview-area" dangerouslySetInnerHTML={{ __html: data.html }} />
          <SharePageClient html={data.html} />
          <p className="expiry">This link expires on {expiryDate}.</p>
        </div>
      </div>
    </div>
  );
}
