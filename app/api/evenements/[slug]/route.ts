import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth"; // Import de votre système Supabase

type Params = { params: Promise<{ slug: string }> };

// GET — détail d'un événement par slug (public)
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

// PATCH — modifier un événement (admin uniquement)
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    // Vérification admin
    await requireAdmin();

    const { slug } = await params;
    const body = await req.json();

    // Mise à jour simplifiée
    const evenement = await prisma.evenement.update({
      where: { slug },
      data: body, // Prisma ignore automatiquement les champs undefined si vous passez l'objet directement
    });
    
    return NextResponse.json({ data: { evenement } });
  } catch (e: any) {
    if (e.message === "UNAUTHORIZED" || e.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// DELETE — supprimer un événement (admin uniquement)
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await requireAdmin();

    const { slug } = await params;
    await prisma.evenement.delete({ where: { slug } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    if (e.message === "UNAUTHORIZED" || e.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}