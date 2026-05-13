import MultiFactorAuthenticationSettings from './components/MultiFactorAuthenticationSettings';
import { WithI18n } from '~/i18n/WithI18n';
import SessionPageGuard from '~/app/dashboard/components/SessionPageGuard';

export const metadata = {
  title: 'Authentication',
};

function AuthenticationPage() {
  return <MultiFactorAuthenticationSettings />;
}

export default WithI18n(SessionPageGuard(AuthenticationPage));
