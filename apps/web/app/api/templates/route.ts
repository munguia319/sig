import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@kit/supabase/server-client';

export async function GET() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from('signature_templates')
    .select('id, name, description, preview_html, tags')
    .order('created_at', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ templates: data ?? [] });
}
