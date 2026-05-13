import Trans from '~/core/ui/Trans';

import SettingsTile from '~/app/dashboard/[organization]/settings/components/SettingsTile';
import Plans from '~/app/dashboard/[organization]/settings/subscription/components/Plans';
import PlansStatusAlertContainer from '~/app/dashboard/[organization]/settings/subscription/components/PlanStatusAlertContainer';
import { withI18n } from '~/i18n/with-i18n';
import Heading from '~/core/ui/Heading';

export const metadata = {
  title: 'Subscription',
};

const SubscriptionSettingsPage = () => {
  return (
    <div className={'flex flex-col space-y-4 w-full'}>
      <div className={'flex flex-col px-2 space-y-1'}>
        <Heading type={4}>
          <Trans i18nKey={'common:subscriptionSettingsTabLabel'} />
        </Heading>

        <span className={'text-gray-500'}>
          <Trans i18nKey={'subscription:subscriptionTabSubheading'} />
        </span>
      </div>

      <PlansStatusAlertContainer />

      <Plans />
    </div>
  );
};

export default withI18n(SubscriptionSettingsPage);
