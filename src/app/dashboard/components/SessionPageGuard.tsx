import requireSession from '~/lib/user/require-session';
import getSupabaseServerClient from '~/core/supabase/server-client';

type LayoutOrPageComponent<Params> = React.ComponentType<Params>;

/**
 * Guards a page or component with a session, ensuring that the user is authenticated before rendering.
 *
 * @param {LayoutOrPageComponent<Params>} Component - The page or component to guard.
 * @returns {Promise<Component>} - A promise that resolves to the guarded page or component with the session check.
 *
 * Usage:
 *
 * function PageComponent() {
 *   // ...
 * }
 *
 * export default SessionPageGuard(PageComponent);
 */
function SessionPageGuard<Params extends object>(
  Component: LayoutOrPageComponent<Params>,
) {
  return async function SessionPageGuardServerComponentWrapper(params: Params) {
    await requireSession(getSupabaseServerClient());

    // add additional checks here if needed

    return <Component {...params} />;
  };
}

export default SessionPageGuard;
