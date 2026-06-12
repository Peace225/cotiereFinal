import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth"; // VOTRE système Supabase uniquement

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { slug, titre, categorie, date, lieu } = body;
    
    if (!slug || !titre || !categorie || !date || !lieu) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
    }

    const evenement = await prisma.evenement.create({ data: body });
    return NextResponse.json({ data: { evenement } }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const evenements = await prisma.evenement.findMany({ orderBy: { createdAt: "asc" } });
    return NextResponse.json({ data: { evenements } });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}