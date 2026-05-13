import { ArrowUpRightIcon } from '@heroicons/react/24/outline';

import Button from '~/core/ui/Button';
import useCsrfToken from '~/core/hooks/use-csrf-token';
import { createCustomerPortalSessionAction } from '~/lib/ls/actions';

const CustomerPortalRedirectButton: React.FCC<{
  disabled?: boolean;
}> = ({ children, ...props }) => {
  return (
    <form
      data-cy={'customer-portal-form'}
      action={createCustomerPortalSessionAction}
    >
      <CSRFTokenInput />

      <Button variant={'outline'} type="submit" disabled={props.disabled}>
        <span className={'flex items-center space-x-2'}>
          <span>{children}</span>

          <ArrowUpRightIcon className={'h-3'} />
        </span>
      </Button>
    </form>
  );
};

export default CustomerPortalRedirectButton;

function CSRFTokenInput() {
  const csrfToken = useCsrfToken();

  return <input type="hidden" name={'csrfToken'} defaultValue={csrfToken} />;
}
