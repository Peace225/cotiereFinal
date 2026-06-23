import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic'; 

// Fonction helper pour obtenir un client Supabase "connecté" 
// UNIQUEMENT pour la lecture des données (sans gestion complexe des cookies)
async function getSupabaseClient() {
  const cookieStore = await cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() { /* Ignoré dans les API routes de données */ }
      }
    }
  );
}

export async function GET() {
  try {
    // 1. On vérifie la sécurité via le fichier central
    await requireAdmin(); 
    
    // 2. On récupère le client pour les requêtes de données
    const supabase = await getSupabaseClient();
    
    // 3. REQUÊTE CORRIGÉE : Utilisation du snake_case pour les relations
    const { data: notifications, error } = await supabase
      .from('notifications')
      .select(`*, studio_bookings(clientFirstName, clientLastName), event_requests(clientFirstName, clientLastName), excursion_bookings(clientFirstName, clientLastName), hotel_bookings(clientFirstName, clientLastName), music_bookings(clientFirstName, clientLastName)`)
      .order('isRead', { ascending: true })
      .order('createdAt', { ascending: false })
      .limit(50);

    if (error) {
      console.error("Erreur Postgres détaillée:", error);
      throw error;
    }

    const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

    return NextResponse.json({ data: { notifications, unreadCount } });
  } catch (e: any) {
    if (e.message === "UNAUTHORIZED") return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    if (e.message === "FORBIDDEN") return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    console.error("API Notifications Error:", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH() {
  try {
    await requireAdmin();
    const supabase = await getSupabaseClient();
    
    const { error } = await supabase.from('notifications').update({ isRead: true }).eq('isRead', false);
    if (error) throw error;
    
    return NextResponse.json({ message: "Tout marqué comme lu" });
  } catch (e: any) {
    if (e.message === "UNAUTHORIZED") return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    if (e.message === "FORBIDDEN") return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}