import UpdateProfileFormContainer from './components/UpdateProfileFormContainer';
import { WithI18n } from '~/i18n/WithI18n';
import SessionPageGuard from '~/app/dashboard/components/SessionPageGuard';

export const metadata = {
  title: 'Profile Settings',
};

const ProfileDetailsPage = () => {
  return <UpdateProfileFormContainer />;
};

export default WithI18n(SessionPageGuard(ProfileDetailsPage));
