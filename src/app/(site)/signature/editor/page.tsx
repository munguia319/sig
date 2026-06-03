

/**
 * Email Signature Editor Page
 * ============================
 * Route: /home/[account]/signature/editor?template={templateId}
 *
 * Full-screen editor — sidebar + live preview.
 * This is a Server Component that wraps client functionality in SignatureProvider.
 */

import { createHash } from 'crypto';
import { headers } from 'next/headers';
import { SignatureProvider } from '@kit/email-signature/contexts/SignatureContext';
import { SignatureEditor } from '@kit/email-signature/components/SignatureEditor';

export const metadata = {
  title: 'Edit Email Signature',
  description: 'Customize your email signature template.',
};

interface Props {
  params: Promise<{ account: string }>;
  searchParams: Promise<{ template?: string }>;
}

function getAccountIdFromParam(account: string) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(account)) return account;

  const namespace = 'makerkit-account-slug';
  const hash = createHash('sha1').update(`${namespace}:${account}`).digest();
  hash[6] = (hash[6] & 0x0f) | 0x50; // version 5
  hash[8] = (hash[8] & 0x3f) | 0x80; // RFC 4122 variant

  const bytes = Array.from(hash.slice(0, 16));
  return [
    bytes.slice(0, 4).map((b) => b.toString(16).padStart(2, '0')).join(''),
    bytes.slice(4, 6).map((b) => b.toString(16).padStart(2, '0')).join(''),
    bytes.slice(6, 8).map((b) => b.toString(16).padStart(2, '0')).join(''),
    bytes.slice(8, 10).map((b) => b.toString(16).padStart(2, '0')).join(''),
    bytes.slice(10, 16).map((b) => b.toString(16).padStart(2, '0')).join(''),
  ].join('-');
}

export default async function SignatureEditorPage({ params, searchParams }: Props) {
  const { account } = await params;
  const accountId = getAccountIdFromParam(account);
  const { template } = await searchParams;
  const templateId = template ?? 'the-opensend';

  const headersList = await headers();
  const csrfToken = headersList.get('x-csrf-token') || '';
  console.log('SERVER SIDE CSRF:', csrfToken, 'All headers:', Array.from(headersList.entries()));

  return (
    <SignatureProvider
      initialTemplate={templateId}
      accountId={accountId}
    >
      <SignatureEditor 
        templateId={templateId} 
        accountSlug={account} 
        csrfToken={csrfToken}
      />
    </SignatureProvider>
  );
}
