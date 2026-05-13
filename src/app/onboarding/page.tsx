import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { isRedirectError } from 'next/dist/client/components/redirect';

import requireSession from '~/lib/user/require-session';
import getSupabaseServerClient from '~/core/supabase/server-client';
import { getUserDataById } from '~/lib/server/queries';
import configuration from '~/configuration';
import { WithI18n } from '~/i18n/WithI18n';
import getLogger from '~/core/logger';
import initializeServerI18n from '~/i18n/i18n.server';
import getLanguageCookie from '~/i18n/get-language-cookie';

import OnboardingContainer from './components/OnboardingContainer';

export const metadata = {
  title: 'Onboarding',
};

async function OnboardingPage() {
  const { csrfToken } = await loadData();

  return <OnboardingContainer csrfToken={csrfToken} />;
}

export default WithI18n(OnboardingPage);

async function loadData() {
  const logger = getLogger();
  const csrfToken = headers().get('X-CSRF-Token');

  const client = getSupabaseServerClient();
  const session = await requireSession(client);
  const user = session.user;

  try {
    const userData = await getUserDataById(client, user.id);

    // initialize i18n for the server
    await initializeServerI18n(getLanguageCookie());

    // if we cannot find the user's Database record
    // the user should go to the onboarding flow
    // so that the record wil be created after the end of the flow
    if (!userData) {
      return {
        auth: user || undefined,
        data: userData ?? undefined,
        role: undefined,
        csrfToken,
      };
    }

    const onboarded = userData.onboarded;

    // there are two cases when we redirect the user to the onboarding
    // 1. if they have not been onboarded yet
    // 2. if they end up with 0 organizations (for example, if they get removed)
    //
    // NB: you should remove this if you want to
    // allow organization-less users within the application
    if (onboarded) {
      return redirect('/');
    }

    return {
      auth: user,
      data: userData,
      role: undefined,
      csrfToken,
    };
  } catch (e) {
    if (!isRedirectError(e)) {
      logger.error(
        `
        Error while initializing onboarding route: ${e}`,
      );
    }

    redirect(configuration.paths.signIn);
  }
}
