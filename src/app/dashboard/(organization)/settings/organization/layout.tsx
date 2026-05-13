import OrganizationSettingsTabs from '~/app/dashboard/(organization)/settings/organization/components/OrganizationSettingsTabs';
import SettingsContentContainer from '~/app/dashboard/(organization)/settings/components/SettingsContentContainer';
import initializeServerI18n from '~/i18n/i18n.server';
import getLanguageCookie from '~/i18n/get-language-cookie';
import { withI18n } from '~/i18n/with-i18n';

async function OrganizationSettingsLayout({
  children,
}: React.PropsWithChildren) {
  await initializeServerI18n(getLanguageCookie());

  return (
    <>
      <div>
        <OrganizationSettingsTabs />
      </div>

      <SettingsContentContainer>{children}</SettingsContentContainer>
    </>
  );
}

export default withI18n(OrganizationSettingsLayout);
