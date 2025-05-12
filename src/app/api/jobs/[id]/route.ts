import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'Missing job id' }, { status: 400 });
  }

  try {
    const supabase = await createClient();
    const { data: job } = await supabase.from('jobs').select('*').eq('id', id).single();
    return NextResponse.json({ job });
  } catch (err) {
    console.error('Presign error', err);
    return NextResponse.json({ error: 'Could not presign URL' });
  }
}
