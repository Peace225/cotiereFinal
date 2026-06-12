import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

type Params = { params: Promise<{ slug: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  // Vérification de l'accès administrateur via Supabase
  try {
    await requireAdmin();
  } catch (e) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const { slug } = await params;
    const body = await req.json();
    
    const { 
      titre, categorie, date, heure, lieu, ville, prix, 
      capacite, organisateur, description, image, badge, 
      badgeColor, artistes, duree, programme 
    } = body;

    if (!titre || !categorie || !date || !lieu) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
    }

    // Mise à jour de l'événement
    const evenement = await prisma.evenement.update({
      where: { slug },
      data: { 
        titre, 
        categorie, 
        date: new Date(date), 
        heure, 
        lieu, 
        ville, 
        prix, 
        capacite, 
        organisateur, 
        description, 
        image, 
        badge, 
        badgeColor, 
        artistes, 
        duree, 
        programme 
      },
    });

    return NextResponse.json({ data: { evenement } }, { status: 200 });
  } catch (e: unknown) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// Exemple de méthode GET pour compléter la route
export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;
    const evenement = await prisma.evenement.findUnique({ where: { slug } });
    
    if (!evenement) {
      return NextResponse.json({ error: "Événement introuvable" }, { status: 404 });
    }
    
    return NextResponse.json({ data: { evenement } });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}