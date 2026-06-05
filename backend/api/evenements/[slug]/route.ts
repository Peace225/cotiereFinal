import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type AdminUser = { role: string };
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
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "SUPER_ADMIN"].includes((session.user as AdminUser)?.role)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  try {
    const { slug } = await params;
    const body = await req.json();
    const evenement = await prisma.evenement.update({
      where: { slug },
      data: {
        ...(body.titre !== undefined && { titre: body.titre }),
        ...(body.categorie !== undefined && { categorie: body.categorie }),
        ...(body.date !== undefined && { date: body.date }),
        ...(body.heure !== undefined && { heure: body.heure }),
        ...(body.lieu !== undefined && { lieu: body.lieu }),
        ...(body.ville !== undefined && { ville: body.ville }),
        ...(body.prix !== undefined && { prix: body.prix }),
        ...(body.capacite !== undefined && { capacite: body.capacite }),
        ...(body.organisateur !== undefined && { organisateur: body.organisateur }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.image !== undefined && { image: body.image }),
        ...(body.badge !== undefined && { badge: body.badge }),
        ...(body.badgeColor !== undefined && { badgeColor: body.badgeColor }),
        ...(body.artistes !== undefined && { artistes: body.artistes }),
        ...(body.duree !== undefined && { duree: body.duree }),
        ...(body.programme !== undefined && { programme: body.programme }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
      },
    });
    return NextResponse.json({ data: { evenement } });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "SUPER_ADMIN"].includes((session.user as AdminUser)?.role)) {
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
