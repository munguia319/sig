import ProfileSettingsTabs from './components/ProfileSettingsTabs';
import SettingsContentContainer from '../components/SettingsContentContainer';
import { WithI18n } from '~/i18n/WithI18n';

function ProfileSettingsLayout({
  children,
  params,
}: React.PropsWithChildren<{
  params: {
    organization: string;
  };
}>) {
  return (
    <>
      <div>
        <ProfileSettingsTabs organizationId={params.organization} />
      </div>

      <SettingsContentContainer>{children}</SettingsContentContainer>
    </>
  );
}

export default WithI18n(ProfileSettingsLayout);
