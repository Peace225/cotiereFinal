import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';

async function getClient() {
  const cookieStore = await cookies();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL manquant");
  }
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    cookies: { getAll(){ return cookieStore.getAll() }, setAll(){} }
  });
}

export async function GET() {
  try {
    const supabase = await getClient();
    // Essaye avec order_index, fallback sur createdAt si la colonne n'existe pas encore
    const { data, error } = await supabase
     .from('homepage_categories')
     .select('*')
     .eq('isActive', true)
     .order('order_index', { ascending: true });

    if (error) {
      console.warn("order_index fail, fallback createdAt:", error.message);
      const { data: fallback } = await supabase
       .from('homepage_categories')
       .select('*')
       .eq('isActive', true)
       .order('createdAt', { ascending: false });
      return NextResponse.json({ data: fallback || [] });
    }

    return NextResponse.json({ data: data || [] });
  } catch (e: any) {
    console.error("GET categories error:", e);
    return NextResponse.json({ data: [], error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const supabase = await getClient();
    const now = new Date().toISOString();

    if (!body.title ||!body.type) {
      return NextResponse.json({ error: "title et type requis" }, { status: 400 });
    }

    // Normalisation 4 images + amenities
    const imagesArray: string[] = (body.images || []).filter((u:string)=>u && u.trim()!== "").slice(0,4);
    const firstImage = imagesArray[0] || body.image || null;

    const payload = {
      id: crypto.randomUUID(),
      title: body.title,
      description: body.description || null,
      type: body.type,
      image: firstImage, // compatibilité ancienne colonne
      images: imagesArray, // jsonb
      amenities: body.amenities || [], // jsonb ["wifi","sdb",...]
      count_text: body.count_text || null,
      href: body.href || `/recherche?type=${body.type}`,
      order_index: body.order_index?? 0,
      isActive: true,
      createdAt: now,
      updatedAt: now
    };

    const { data, error } = await supabase
     .from('homepage_categories')
     .insert([payload])
     .select()
     .single();

    if (error) throw error;
    return NextResponse.json({ data }, { status: 201 });
  } catch (e: any) {
    console.error("POST categories error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}