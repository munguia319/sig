'use server';

import { NextResponse } from 'next/server';

import { getOrganizationById } from '~/lib/organizations/database/queries';
import getSupabaseServerClient from '~/core/supabase/server-client';
import { createOrganizationIdCookie } from '~/lib/server/cookies/organization.cookie';
import { throwInternalServerErrorException } from '~/core/http-exceptions';

export async function setCurrentOrganization<
  Params extends {
    organizationId: string;
  }
>({ organizationId }: Params) {
  const client = getSupabaseServerClient();

  try {
    const organization = await getOrganizationById(
      client,
      Number(organizationId)
    );

    if (organization.data) {
      const cookie = createOrganizationIdCookie(Number(organizationId));
      const response = new NextResponse(JSON.stringify({}), {
        status: 200,
      });

      response.cookies.set(cookie);

      return response;
    }

    return throwInternalServerErrorException();
  } catch (error) {
    console.error(error);
    return throwInternalServerErrorException();
  }
}
