import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@kit/supabase/server-client';

export async function POST(req: Request) {
  try {
    const client = await createSupabaseServerClient();

    // Verify user is logged in
    const {
      data: { user },
      error: authError,
    } = await client.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, signatureData, firstName, lastName, organizationId } = body;

    if (!signatureData) {
      return NextResponse.json({ error: 'Missing signature data' }, { status: 400 });
    }

    if (!organizationId) {
      return NextResponse.json({ error: 'Missing organization ID' }, { status: 400 });
    }

    // Determine if updating or inserting
    if (id) {
      // Update existing signature
      const { data, error } = await client
        .from('email_signatures')
        .update({
          fields: signatureData.fields,
          template_id: signatureData.templateId,
          employee_name: `${firstName} ${lastName}`.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('account_id', organizationId)
        .select()
        .single();

      if (error) {
        console.error('Error updating signature:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, data });
    } else {
      // Insert new signature
      const { data, error } = await client
        .from('email_signatures')
        .insert({
          account_id: organizationId || null,
          employee_name: `${firstName} ${lastName}`.trim(),
          template_id: signatureData.templateId,
          fields: signatureData.fields,
        })
        .select()
        .single();

      if (error) {
        console.error('Error inserting signature:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, data });
    }
  } catch (error) {
    console.error('API Error /signatures:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
