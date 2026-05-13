'use client';

import useCurrentOrganization from '~/lib/organizations/hooks/use-current-organization';

import Trans from '~/core/ui/Trans';
import SubscriptionCard from './SubscriptionCard';
import IfHasPermissions from '~/components/IfHasPermissions';

import { canChangeBilling } from '~/lib/organizations/permissions';
import PlanSelectionForm from '../components/PlanSelectionForm';
import CustomerPortalRedirectButton from '../components/CustomerRedirectPortalButton';

const Plans = () => {
  const organization = useCurrentOrganization();

  if (!organization) {
    return null;
  }

  const subscription = organization.subscription?.data;

  if (!subscription) {
    return <PlanSelectionForm organization={organization} />;
  }

  return (
    <div className={'flex flex-col space-y-4'}>
      <div>
        <div
          className={'border w-full lg:w-9/12 xl:w-6/12 rounded-xl divide-y'}
        >
          <div className={'p-6'}>
            <SubscriptionCard subscription={subscription} />
          </div>

          <IfHasPermissions condition={canChangeBilling}>
            <div className={'flex justify-end p-6'}>
              <div className={'flex flex-col space-y-2 items-end'}>
                <CustomerPortalRedirectButton>
                  <Trans i18nKey={'subscription:manageBilling'} />
                </CustomerPortalRedirectButton>
              </div>
            </div>
          </IfHasPermissions>
        </div>
      </div>
    </div>
  );
};

export default Plans;
