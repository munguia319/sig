import { headers } from 'next/headers';

/**
 * Returns the organization slug based on the origin header.
 * @throws {Error} If the origin header is missing.
 * @returns {string} The organization slug.
 */
export default function getOrganizationSlug() {
  const origin = headers().get('host') || headers().get('x-forwarded-host');

  if (!origin) {
    throw new Error(`Missing origin header`);
  }

  const segments = origin.split('.');

  if (segments.length < 3) {
    throw new Error(`Invalid origin header`);
  }

  return segments[0];
}
