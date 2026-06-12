import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth"; // Votre fonction de sécurité

type Params = { params: Promise<{ slug: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;
    const evenement = await prisma.evenement.findUnique({ where: { slug } });
    if (!evenement) return NextResponse.json({ error: "Événement introuvable" }, { status: 404 });
    return NextResponse.json({ data: { evenement } });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  // Vérification de sécurité avec votre système Supabase
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const { slug } = await params;
    const body = await req.json();
    
    // Mise à jour simplifiée
    const evenement = await prisma.evenement.update({
      where: { slug },
      data: body,
    });
    return NextResponse.json({ data: { evenement } });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  // Vérification de sécurité avec votre système Supabase
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const { slug } = await params;
    await prisma.evenement.delete({ where: { slug } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}