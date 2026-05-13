import UpdatePasswordFormContainer from '../components/UpdatePasswordFormContainer';
import SettingsTile from '~/app/dashboard/[organization]/settings/components/SettingsTile';
import Trans from '~/core/ui/Trans';
import { WithI18n } from '~/i18n/WithI18n';
import SessionPageGuard from '~/app/dashboard/components/SessionPageGuard';

export const metadata = {
  title: 'Update Password',
};

const ProfilePasswordSettingsPage = () => {
  return (
    <SettingsTile
      heading={<Trans i18nKey={'profile:passwordTab'} />}
      subHeading={<Trans i18nKey={'profile:passwordTabSubheading'} />}
    >
      <UpdatePasswordFormContainer />
    </SettingsTile>
  );
};

export default WithI18n(SessionPageGuard(ProfilePasswordSettingsPage));
