import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';

async function getClient(){
  const cookieStore = await cookies();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL manquant");
  }
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    key,
    { cookies:{ getAll(){ return cookieStore.getAll() }, setAll(){} } }
  );
}

export async function PATCH(req: NextRequest, {params}:{params: Promise<{id:string}>}){
  try {
    await requireAdmin();
    const {id} = await params;
    const body = await req.json();
    const supabase = await getClient();

    // Nettoie les 4 images
    const imagesArray: string[] = (body.images || (body.image? [body.image] : []))
     .filter((u: string) => u && u.trim()!== "")
     .slice(0,4);

    const payload: any = {
      title: body.title,
      description: body.description || null,
      type: body.type,
      image: imagesArray[0] || null, // compatibilité
      images: imagesArray, // jsonb
      amenities: body.amenities || [], // jsonb ex: ["wifi","sdb","clim"]
      count_text: body.count_text || null,
      href: body.href || (body.type? `/recherche?type=${body.type}` : undefined),
      order_index: body.order_index?? 0,
      updatedAt: new Date().toISOString()
    };

    // Retire les undefined pour ne pas écraser
    Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k]);

    const {data, error} = await supabase
     .from('homepage_categories')
     .update(payload)
     .eq('id', id)
     .select()
     .single();

    if(error) throw error;
    return NextResponse.json({ data });
  } catch (e: any) {
    console.error("PATCH categories error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, {params}:{params: Promise<{id:string}>}){
  try {
    await requireAdmin();
    const {id} = await params;
    const supabase = await getClient();

    const {error} = await supabase
     .from('homepage_categories')
     .delete()
     .eq('id', id);

    if(error) throw error;
    return NextResponse.json({ ok: true, id });
  } catch (e: any) {
    console.error("DELETE categories error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}