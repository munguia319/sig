/**
 * Email Signature Gallery Page
 * ==============================
 * Route: /home/[account]/signature
 *
 * Entry point for the Email Signature Builder.
 * Users select a template here, which routes them to the editor.
 *
 * Setup steps:
 * 1. Install @kit/email-signature (see packages/@kit/email-signature/README.md)
 * 2. Import the styles in your global CSS:
 *    @import '@kit/email-signature/styles';
 * 3. Replace the placeholder below with <TemplateGallery />
 * 4. Add this route to your team sidebar nav (see README.md)
 */

import { TemplateGallery } from '@kit/email-signature/components/TemplateGallery';

export const metadata = {
  title: 'Email Signature Builder',
  description: 'Create and manage email signatures for your team.',
};

interface Props {
  params: Promise<{ account: string }>;
}

export default async function SignatureGalleryPage({ params }: Props) {
  const { account } = await params;
  return <TemplateGallery accountSlug={account} />;
}
