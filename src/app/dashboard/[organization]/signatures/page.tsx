import { Plus } from 'lucide-react';
import Link from 'next/link';

import AppHeader from '~/app/dashboard/[organization]/components/AppHeader';
import Button from '~/core/ui/Button';
import { PageBody } from '~/core/ui/Page';

import { withI18n } from '~/i18n/with-i18n';
import SignaturesTable from './components/SignaturesTable';

export const metadata = {
  title: 'Signatures',
};

function SignaturesPage({
  params,
}: {
  params: { organization: string };
}) {
  return (
    <>
      <AppHeader
        title="Signatures"
        description="Manage and create email signatures for your team."
      />

      <PageBody>
        <div className="flex justify-end mb-4">
          <Button asChild>
            <Link href={`/dashboard/${params.organization}/signatures/templates`}>
              <Plus className="w-4 h-4 mr-2" />
              New Signature
            </Link>
          </Button>
        </div>

        <SignaturesTable organizationId={params.organization} />
      </PageBody>
    </>
  );
}

export default withI18n(SignaturesPage);
