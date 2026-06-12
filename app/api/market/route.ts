import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

// Initialisation du client Supabase pour le serveur
async function getSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        },
      },
    }
  );
}

// GET — liste publique des produits actifs
export async function GET(req: NextRequest) {
  try {
    const supabase = await getSupabase();
    const { searchParams } = new URL(req.url);
    const categorie = searchParams.get("categorie");
    const all = searchParams.get("all") === "true";

    let query = supabase.from('marketProduit').select('*');

    if (!all) query = query.eq('isActive', true);
    if (categorie && categorie !== "Tous") query = query.eq('categorie', categorie);

    const { data: produits, error } = await query.order('createdAt', { ascending: true });

    if (error) throw error;
    return NextResponse.json({ data: { produits } });
  } catch (err) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST — créer un produit (admin)
export async function POST(req: NextRequest) {
  try {
    const supabase = await getSupabase();
    
    // 1. Vérification session
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    // 2. Vérification rôle ADMIN dans ta table 'users'
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'ADMIN' && profile?.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const body = await req.json();
    const { label, desc, prix, unite, categorie, images } = body;

    // 3. Insertion Supabase
    const { data: produit, error } = await supabase
      .from('marketProduit')
      .insert({
        label,
        desc: desc || "",
        prix: parseInt(prix),
        unite,
        categorie,
        images: Array.isArray(images) ? images : (images ? [images] : []),
        isActive: true,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ data: { produit } }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}