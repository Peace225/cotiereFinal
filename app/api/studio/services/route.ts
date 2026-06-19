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
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {}
      }
    }
  );
}

export async function GET() {
  try {
    const supabase = await getSupabaseClient();
    
    // Tentative de rÃ©cupÃ©ration depuis la table 'studio_services'
    const { data, error } = await supabase
      .from('studio_services')
      .select('*');

    if (error) {
      // C'EST ICI QUE NOUS VERRONS L'ERREUR DANS LE TERMINAL VS CODE
      console.error("ERREUR SUPABASE (DÃ©tail):", JSON.stringify(error, null, 2));
      throw error;
    }

    return NextResponse.json({ data: data || [] });
  } catch (e: any) {
    console.error("ERREUR API (Catch):", e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const supabase = await getSupabaseClient();
    
    const { data, error } = await supabase
      .from('studio_services')
      .insert([body])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ data }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}


