import { headers } from 'next/headers';
import { SignatureEditor } from '@kit/email-signature/components/SignatureEditor';
import { SignatureProvider } from '@kit/email-signature/contexts/SignatureContext';
import AppHeader from '~/app/dashboard/[organization]/components/AppHeader';
import { PageBody } from '~/core/ui/Page';

export const metadata = {
  title: 'Edit Signature',
};

export default function SignatureEditorPage({
  params,
  searchParams,
}: {
  params: { organization: string };
  searchParams: { id?: string; template?: string };
}) {
  // Read the CSRF token injected by MakerKit's middleware so the
  // client-side save call can include it in the X-CSRF-Token header.
  const csrfToken = headers().get('X-CSRF-Token') ?? '';

  return (
    <>
      <AppHeader
        title={searchParams.id ? 'Edit Signature' : 'New Signature'}
        description="Customize your email signature."
      />
      <PageBody>
        <div className="h-[calc(100vh-140px)] border rounded-xl overflow-hidden shadow-sm bg-white">
          <SignatureProvider
            accountId={params.organization}
            initialTemplate={searchParams.template || 'the-opensend'}
            initialEmployeeId={searchParams.id || null}
            csrfToken={csrfToken}
          >
            <SignatureEditor templateId={searchParams.template || 'the-opensend'} accountSlug={params.organization} />
          </SignatureProvider>
        </div>
      </PageBody>
    </>
  );
}
