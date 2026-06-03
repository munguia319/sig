import { enhanceRouteHandler } from '@kit/next/routes';
import { createSupabaseServiceClient } from '@kit/supabase/server-client';
import { nanoid } from 'nanoid';
import { NextResponse } from 'next/server';

export const POST = enhanceRouteHandler(async ({ body, user }: { body: any; user: any }) => {
  const supabase = createSupabaseServiceClient();
  const token = nanoid(12);
  const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  const { error } = await supabase.from('public_signature_links').insert({
    token,
    html: body.html,
    account_id: body.accountId,
    expires_at,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    url: `${process.env.NEXT_PUBLIC_APP_URL}/share/${token}`,

    expires_at,
  });
});
