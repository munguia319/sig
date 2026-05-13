import Trans from '~/core/ui/Trans';

import SettingsTile from '../../settings/components/SettingsTile';
import Plans from './components/Plans';
import PlansStatusAlertContainer from './components/PlanStatusAlertContainer';
import SessionPageGuard from '~/app/dashboard/components/SessionPageGuard';
import { WithI18n } from '~/i18n/WithI18n';

export const metadata = {
  title: 'Subscription',
};

const SubscriptionSettingsPage = () => {
  return (
    <SettingsTile
      heading={<Trans i18nKey={'common:subscriptionSettingsTabLabel'} />}
      subHeading={<Trans i18nKey={'subscription:subscriptionTabSubheading'} />}
    >
      <div className={'flex flex-col space-y-4'}>
        <PlansStatusAlertContainer />

        <Plans />
      </div>
    </SettingsTile>
  );
};

export default WithI18n(SessionPageGuard(SubscriptionSettingsPage));
