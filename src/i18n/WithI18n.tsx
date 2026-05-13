import initializeServerI18n from '~/i18n/i18n.server';
import getLanguageCookie from '~/i18n/get-language-cookie';

type LayoutOrPageComponent<Params> = React.ComponentType<Params>;

/**
 * Wraps a Page or Layout with internationalization (i18n) support.
 *
 * @param {LayoutOrPageComponent<Params>} Component - The component to be wrapped.
 * @return {async function} - An async function that acts as a wrapper for the component.
 */
export function WithI18n<Params extends object>(
  Component: LayoutOrPageComponent<Params>,
) {
  return async function I18nServerComponentWrapper(params: Params) {
    await initializeServerI18n(getLanguageCookie());

    return <Component {...params} />;
  };
}
