import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

type Params = { params: Promise<{ slug: string }> };

// GET — détail d'un événement par slug ou par id (public)
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;
    const evenement = await prisma.evenement.findFirst({
      where: { OR: [{ slug }, { id: slug }] },
    });

    if (!evenement) {
      return NextResponse.json({ error: "Événement introuvable" }, { status: 404 });
    }

    return NextResponse.json({ data: { evenement } });
  } catch (error) {
    console.error("Erreur GET événement [slug]:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PATCH — modifier un événement (admin uniquement)
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await requireAdmin();

    const { slug } = await params;
    const body = await req.json();

    if (body.date) body.date = new Date(body.date);
    delete body.id; // Évite de modifier l'id par erreur

    // On s'assure de trouver l'événement par slug ou id avant de mettre à jour
    const existing = await prisma.evenement.findFirst({
      where: { OR: [{ slug }, { id: slug }] },
    });

    if (!existing) {
      return NextResponse.json({ error: "Événement introuvable" }, { status: 404 });
    }

    const evenement = await prisma.evenement.update({
      where: { id: existing.id },
      data: body,
    });
    
    return NextResponse.json({ data: { evenement } });
  } catch (e: any) {
    if (e.message === "UNAUTHORIZED" || e.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }
    console.error("Erreur PATCH événement:", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// DELETE — supprimer un événement (admin uniquement)
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await requireAdmin();

    const { slug } = await params;
    
    // Recherche tolérante par slug ou id
    const existing = await prisma.evenement.findFirst({
      where: { OR: [{ slug }, { id: slug }] },
    });

    if (!existing) {
      return NextResponse.json({ error: "Événement introuvable" }, { status: 404 });
    }

    await prisma.evenement.delete({ where: { id: existing.id } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    if (e.message === "UNAUTHORIZED" || e.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }
    console.error("Erreur DELETE événement:", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}