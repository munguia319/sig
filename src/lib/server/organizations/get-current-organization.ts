import 'server-only';

import { cache } from 'react';

import {
  getOrganizationBySlug,
  getOrganizationByUid,
} from '~/lib/organizations/database/queries';
import { getUserMembershipByOrganization } from '~/lib/memberships/queries';
import getSupabaseServerClient from '~/core/supabase/server-component-client';

type GetCurrentOrganizationParams = {
  userId: string;
} & (
  | {
      organizationUid: string;
    }
  | {
      slug: string;
    }
);

export default async function getCurrentOrganization(
  params: GetCurrentOrganizationParams,
) {
  const { userId } = params;

  if ('slug' in params) {
    const { data, error } = await fetchOrganizationBySlug(params.slug);

    if (error || !data) {
      throw error;
    }

    const organization = data || undefined;
    const role = await fetchUserRole(data.uuid, userId);

    return {
      organization,
      role,
    };
  } else {
    const { data, error } = await fetchOrganizationByUid(
      params.organizationUid,
    );

    if (error) {
      throw error;
    }

    const organization = data || undefined;
    const role = await fetchUserRole(params.organizationUid, userId);

    return {
      organization,
      role,
    };
  }
}

/**
 * @name fetchOrganizationByUid
 * @description Fetch an organization by its ID.
 */
const fetchOrganizationByUid = cache(async (uid: string) => {
  const client = getSupabaseServerClient();

  return getOrganizationByUid(client, uid);
});

/**
 * @name fetchUserRole
 * @description Fetch the role of a user in an organization.
 */
const fetchUserRole = cache(async (organizationUid: string, userId: string) => {
  const client = getSupabaseServerClient();

  const data = await getUserMembershipByOrganization(client, {
    organizationUid,
    userId,
  });

  return data?.role;
});

/**
 * @name fetchOrganizationBySlug
 * @description Fetch an organization by its Slug.
 */
const fetchOrganizationBySlug = cache(async (uid: string) => {
  const client = getSupabaseServerClient();

  return getOrganizationBySlug(client, uid);
});
