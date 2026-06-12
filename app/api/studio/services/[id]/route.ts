import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

async function getSupabaseClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {}
      }
    }
  );
}

// PATCH /api/studio/services/[id]
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await req.json();
    const supabase = await getSupabaseClient();

    const { data, error } = await supabase
      .from('studio_services')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// DELETE /api/studio/services/[id] (Soft delete via isActive: false)
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const supabase = await getSupabaseClient();

    const { error } = await supabase
      .from('studio_services')
      .update({ is_active: false })
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ message: "Service supprimé" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}