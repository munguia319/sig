import SettingsTile from '../../components/SettingsTile';
import UpdateEmailFormContainer from '../components/UpdateEmailFormContainer';
import Trans from '~/core/ui/Trans';
import { WithI18n } from '~/i18n/WithI18n';
import SessionPageGuard from '~/app/dashboard/components/SessionPageGuard';

export const metadata = {
  title: 'Update Email',
};

const ProfileEmailSettingsPage = () => {
  return (
    <SettingsTile
      heading={<Trans i18nKey={'profile:emailTab'} />}
      subHeading={<Trans i18nKey={'profile:emailTabTabSubheading'} />}
    >
      <UpdateEmailFormContainer />
    </SettingsTile>
  );
};

export default WithI18n(SessionPageGuard(ProfileEmailSettingsPage));
