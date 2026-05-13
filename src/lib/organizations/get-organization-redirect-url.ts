import configuration from '~/configuration';

/**
 * Returns the redirect URL for a given organization slug.
 *
 * @param {string} slug - The organization slug.
 * @return {string} The redirect URL.
 */
function getOrganizationRedirectUrl(slug: string) {
  const pathname = window.location.pathname;
  const protocol = window.location.protocol;
  const hostname = new URL(configuration.site.siteUrl as string).hostname;
  const port = window.location.port;

  let host = `${slug}.${hostname}`;

  if (port) {
    host = `${host}:${port}`;
  }

  return protocol + '//' + host + pathname;
}

export default getOrganizationRedirectUrl;
