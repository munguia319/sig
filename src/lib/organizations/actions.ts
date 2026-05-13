'use server';

import { cookies } from 'next/headers';
import type { PostgrestError } from '@supabase/supabase-js';
import { z } from 'zod';
import { redirect } from 'next/navigation';

import { getOrganizationById } from '~/lib/organizations/database/queries';
import getSupabaseServerActionClient from '~/core/supabase/action-client';

import {
  createOrganizationIdCookie,
  parseOrganizationIdCookie,
} from '~/lib/server/cookies/organization.cookie';

import requireSession from '~/lib/user/require-session';
import getLogger from '~/core/logger';
import { getUserDataById } from '~/lib/server/queries';
import { transferOwnership } from '~/lib/memberships/mutations';
import getSupabaseServerClient from '~/core/supabase/server-client';
import inviteMembers from '~/lib/server/organizations/invite-members';
import MembershipRole from '~/lib/organizations/types/membership-role';
import { withCsrfCheck, withSession } from '~/core/generic/actions-utils';

export const setCurrentOrganizationAction = withCsrfCheck(
  withSession(async (params: { organizationId: string; csrfToken: string }) => {
    const { organizationId } = params;
    const client = getSupabaseServerActionClient();

    const onError = (error: PostgrestError) => {
      return handleError(
        error as PostgrestError,
        `Error setting current organization`,
        organizationId
      );
    };

    try {
      const { error } = await getOrganizationById(
        client,
        Number(organizationId)
      );

      if (error) {
        return onError(error);
      }

      // we set the organization ID in the cookies
      cookies().set(createOrganizationIdCookie(Number(organizationId)));

      return {
        success: true,
      };
    } catch (error) {
      return onError(error as PostgrestError);
    }
  })
);

export const createNewOrganizationAction = withCsrfCheck(
  withSession(async (params: { organization: string; csrfToken: string }) => {
    const logger = getLogger();

    try {
      const { organization } = await z
        .object({
          organization: z.string().min(1),
        })
        .parseAsync(params);

      const client = getSupabaseServerActionClient();
      const session = await requireSession(client);

      const userId = session.user.id;

      logger.info(
        {
          userId,
          organization,
        },
        `Creating organization...`
      );

      const { data: organizationId, error } = await client
        .rpc('create_new_organization', {
          org_name: organization,
          user_id: userId,
          create_user: false,
        })
        .throwOnError()
        .single();

      if (error) {
        return handleError(error, `Error creating organization`);
      }

      logger.info(
        {
          userId,
          organization,
        },
        `Organization successfully created`
      );

      cookies().set(createOrganizationIdCookie(Number(organizationId)));

      return { success: true };
    } catch (error) {
      return handleError(error, `Error creating organization`);
    }
  })
);

export const transferOrganizationOwnershipAction = withCsrfCheck(
  withSession(
    async (
      params: z.infer<
        ReturnType<typeof getTransferOrganizationOwnershipBodySchema>
      >
    ) => {
      const result =
        await getTransferOrganizationOwnershipBodySchema().safeParseAsync(
          params
        );

      // validate the form data
      if (!result.success) {
        throw new Error(`Invalid form data`);
      }

      const logger = getLogger();
      const client = getSupabaseServerActionClient();

      const organizationId = Number(await parseOrganizationIdCookie(cookies()));

      if (!organizationId) {
        throw new Error(`Invalid organization ID`);
      }

      const targetUserMembershipId = result.data.membershipId;
      const session = await requireSession(client);

      const currentUserId = session.user.id;
      const currentUser = await getUserDataById(client, currentUserId);

      logger.info(
        {
          organizationId,
          currentUserId,
          targetUserMembershipId,
        },
        `Transferring organization ownership...`
      );

      // return early if we can't get the current user
      if (!currentUser) {
        throw new Error(`User is not logged in or does not exist`);
      }

      // transfer ownership to the target user
      const { error } = await transferOwnership(client, {
        organizationId,
        targetUserMembershipId,
      });

      if (error) {
        logger.error(
          {
            error,
            organizationId,
            currentUserId,
            targetUserMembershipId,
          },
          `Error transferring organization ownership`
        );

        throw new Error(`Error transferring ownership`);
      }

      // all done! we log the result and return a 200
      logger.info(
        {
          organizationId,
          currentUserId,
          targetUserMembershipId,
        },
        `Ownership successfully transferred to target user`
      );

      return { success: true };
    }
  )
);

export const inviteMembersToOrganizationAction = withCsrfCheck(
  withSession(
    async (payload: z.infer<ReturnType<typeof getInviteMembersBodySchema>>) => {
      const { invites } = await getInviteMembersBodySchema().parseAsync(
        payload
      );

      const organizationId = Number(await parseOrganizationIdCookie(cookies()));
      const client = getSupabaseServerClient();
      const session = await requireSession(client);
      const inviterId = session.user.id;

      // throw an error when we cannot retrieve the inviter's id or the organization id
      if (!inviterId || !organizationId) {
        throw new Error(`Inviter or organization not found`);
      }

      const adminClient = getSupabaseServerClient({ admin: true });

      const params = {
        client,
        adminClient,
        invites,
        organizationId,
        inviterId,
      };

      try {
        // send requests to invite members
        await inviteMembers(params);
      } catch (e) {
        const message = `Error when inviting user to organization`;

        getLogger().error(`${message}: ${e}`);

        throw new Error(message);
      }

      redirect(`/settings/organization/members`);
    }
  )
);

function getInviteMembersBodySchema() {
  return z.object({
    csrfToken: z.string().min(1),
    invites: z.array(
      z.object({
        role: z.nativeEnum(MembershipRole),
        email: z.string().email(),
      })
    ),
  });
}

function getTransferOrganizationOwnershipBodySchema() {
  return z.object({
    membershipId: z.coerce.number(),
    csrfToken: z.string().min(1),
  });
}

function handleError<Error = unknown>(
  error: Error,
  message: string,
  organizationId?: string
) {
  const exception = error instanceof Error ? error.message : undefined;

  getLogger().error(
    {
      exception,
      organizationId,
    },
    message
  );

  throw new Error(message);
}
