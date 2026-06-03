/**
 * ShareButton
 * ===========
 * Generates a temporary 7-day public link to the raw HTML signature.
 *
 * In this demo, the link is simulated using a base64-encoded URL
 * with a generated token and expiry timestamp. In MakerKit production,
 * this would be a Supabase Edge Function or a Next.js Route Handler
 * that stores the token + expiry + HTML in a `public_signature_links`
 * table, and serves the raw HTML at /api/signature/[token].
 *
 * The public page at that URL would render ONLY the raw HTML signature
 * (no app chrome) so the recipient can copy it directly.
 */

import { generateSignatureHtml } from '@kit/email-signature/lib/generateSignatureHtml';
import { useSignature } from '@kit/email-signature/contexts/SignatureContext';
import { Check, Copy, ExternalLink, Link2, Share2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from '@kit/ui/sonner';

function generateToken() {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

function formatExpiry(date: Date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function ShareButton({ csrfToken }: { csrfToken?: string }) {
  console.log("ShareButton received csrfToken:", csrfToken);
  const { fields, accountId } = useSignature();
  const [open, setOpen] = useState(false);
  const [link, setLink] = useState<{ url: string; expiry: Date } | null>(null);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  async function handleOpen() {
    if (!open && !link) {
      const html = generateSignatureHtml(fields);
      console.log("html---------->", html)
      try {
        const response = await fetch('/api/signature-links', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            ...(csrfToken ? { 'x-csrf-token': csrfToken } : {})
          },
          body: JSON.stringify({
            html,
            accountId,
          }),
        });
        console.log("sssssssss", response)
        if (!response.ok) throw new Error('Failed to generate link');

        const data = await response.json();
        console.log("data----------->", data)
        setLink({ url: data.url, expiry: new Date(data.expires_at) });
      } catch (err) {
        toast.error('Could not generate share link');
        return;
      }
    }
    setOpen((v) => !v);
  }

  function handleCopy() {
    if (!link) return;
    navigator.clipboard.writeText(link.url).then(() => {
      setCopied(true);
      toast.success('Public link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      toast.error('Could not copy link');
    });
  }

  async function handleRegenerate() {
    setLink(null);
    const html = generateSignatureHtml(fields);

    try {
      const response = await fetch('/api/signature-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          html,
          accountId,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate link');

      const data = await response.json();
      setLink({ url: data.url, expiry: new Date(data.expires_at) });
      toast.success('New link generated — expires in 7 days');
    } catch (err) {
      toast.error('Could not generate share link');
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleOpen}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[12px] font-medium border border-[#e5e7eb] text-[#555555] hover:border-[#111111] hover:text-[#111111] transition-colors bg-white"
      >
        <Share2 size={13} />
        Share
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-[300px] bg-white border border-[#e5e7eb] rounded-lg shadow-lg z-50 p-4">
          {/* Header */}
          <div className="flex items-center gap-2 mb-3">
            <Link2 size={14} style={{ color: '#111111' }} />
            <span className="text-[13px] font-semibold text-[#1a1a1a]">Shareable Public Link</span>
          </div>

          <p className="text-[12px] text-[#666666] mb-3 leading-relaxed">
            Anyone with this link can view the raw HTML signature. The link expires in <strong>7 days</strong> and contains only the signature — no app access is granted.
          </p>

          {/* Link display */}
          {link && (
            <div className="bg-[#f9f9f9] border border-[#e5e7eb] rounded px-3 py-2 mb-3">
              <p className="text-[11px] font-mono text-[#555555] truncate">{link.url}</p>
              <p className="text-[10px] text-[#aaaaaa] mt-1 font-mono">
                Expires: {formatExpiry(link.expiry)}
              </p>
            </div>
          )}

          {/* Copy button */}
          <button
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-2 rounded px-3 py-2 text-[13px] font-semibold text-white transition-colors"
            style={{ backgroundColor: copied ? '#22c55e' : '#111111' }}
            onMouseEnter={(e) => { if (!copied) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#374151'; }}
            onMouseLeave={(e) => { if (!copied) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#111111'; }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy Public Link'}
          </button>

          {/* Open in new tab */}
          {link && (
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 w-full flex items-center justify-center gap-1.5 rounded px-3 py-1.5 text-[12px] font-medium border border-[#e5e7eb] text-[#555555] hover:border-[#111111] hover:text-[#111111] transition-colors"
            >
              <ExternalLink size={12} />
              Open in new tab
            </a>
          )}

          {/* Regenerate */}
          <button
            onClick={handleRegenerate}
            className="mt-2 w-full text-[11px] text-[#aaaaaa] hover:text-[#111111] transition-colors py-1"
          >
            Generate a new link (invalidates current)
          </button>
        </div>
      )}
    </div>
  );
}
