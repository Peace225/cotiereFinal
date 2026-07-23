import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';

async function getSupabaseClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
  );
}

export async function GET() {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('studio_services')
    .select('*')
    .eq('isActive', true) // le client ne voit que ça
    .order('createdAt', { ascending: false });
  if (error) throw error;
  return NextResponse.json({ data: data || [] });
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const supabase = await getSupabaseClient();
    const now = new Date().toISOString();

    const { data, error } = await supabase.from('studio_services').insert([{
      id: crypto.randomUUID(), // on ignore le "srv_" du front
      label: body.label,
      description: body.description || null,
      image: body.image || null,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    }]).select().single();

    if (error) throw error;
    return NextResponse.json({ data }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}