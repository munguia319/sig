'use server';

import { z } from 'zod';
import type { SupabaseClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

import MembershipRole from '~/lib/organizations/types/membership-role';

import {
  deleteMembershipById,
  updateMembershipById,
} from '~/lib/memberships/mutations';

import getSupabaseServerClient from '~/core/supabase/server-client';
import getLogger from '~/core/logger';
import { withCsrfCheck, withSession } from '~/core/generic/actions-utils';
import getSupabaseServerActionClient from '~/core/supabase/action-client';

export const updateMemberAction = withCsrfCheck(
  withSession(
    async (params: {
      membershipId: number;
      role: MembershipRole;
      csrfToken: string;
    }) => {
      const client = getSupabaseServerActionClient();

      await handleUpdateMemberRequest(client, params);

      return {
        success: true,
      };
    }
  )
);

export const deleteMemberAction = withCsrfCheck(
  withSession(async (params: { membershipId: number; csrfToken: string }) => {
    const client = getSupabaseServerClient();

    await handleRemoveMemberRequest(client, params.membershipId);
    await revalidatePath('/settings/organization/members');

    return {
      success: true,
    };
  })
);

async function handleRemoveMemberRequest(
  client: SupabaseClient,
  membershipId: number
) {
  const logger = getLogger();

  logger.info(
    {
      membershipId,
    },
    `Removing member...`
  );

  await deleteMembershipById(client, membershipId);

  logger.info(
    {
      membershipId,
    },
    `Member successfully removed.`
  );

  await revalidatePath('/settings/organization/members');
}

async function handleUpdateMemberRequest(
  client: SupabaseClient,
  params: {
    membershipId: number;
    role: MembershipRole;
  }
) {
  const logger = getLogger();
  const { role, membershipId } = getUpdateMembershipBodySchema().parse(params);

  logger.info(
    {
      membershipId,
      role,
    },
    `Updating member...`
  );

  await updateMembershipById(client, {
    id: membershipId,
    role,
  });

  logger.info(
    {
      membershipId,
    },
    `Member successfully updated.`
  );

  await revalidatePath('/settings/organization/members');
}

function getUpdateMembershipBodySchema() {
  return z.object({
    role: z.nativeEnum(MembershipRole),
    membershipId: z.number(),
  });
}
