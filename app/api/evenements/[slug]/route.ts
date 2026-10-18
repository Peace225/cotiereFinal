import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

const MOIS_NOMS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

const MOIS_FR: Record<string, number> = {
  "janvier": 0, "février": 1, "fevrier": 1, "mars": 2, "avril": 3, "mai": 4, "juin": 5,
  "juillet": 6, "août": 7, "aout": 7, "septembre": 8, "octobre": 9, "novembre": 10, "décembre": 11, "decembre": 11
};

function parseFrenchDate(input: any): Date {
  if (!input) return new Date();
  if (input instanceof Date) return input;
  const s = String(input).trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return new Date(s);
  try {
    const lower = s.toLowerCase();
    const parts = lower.split(/[\s\/-]+/);
    if (parts.length >= 3) {
      const jour = parseInt(parts[0], 10);
      const annee = parseInt(parts[2], 10);
      let mois = MOIS_FR[parts[1]];
      if (mois === undefined) mois = parseInt(parts[1], 10) - 1;
      if (!isNaN(jour) && !isNaN(mois) && !isNaN(annee)) {
        return new Date(Date.UTC(annee, mois, jour, 12, 0, 0));
      }
    }
  } catch {}
  return new Date();
}

function formatToFrenchDate(dateVal: any): string {
  if (!dateVal) return "";
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return String(dateVal);
  return `${d.getUTCDate()} ${MOIS_NOMS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

async function findByIdOrSlug(slugOrId: string) {
  return prisma.evenement.findFirst({
    where: { OR: [{ id: slugOrId }, { slug: slugOrId }] }
  });
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getSession();
    if (!session || !["ADMIN", "SUPER_ADMIN"].includes((session.user as any).role)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { slug } = await context.params;
    const existing = await findByIdOrSlug(slug);
    if (!existing) return NextResponse.json({ error: "Événement introuvable" }, { status: 404 });

    const body = await req.json();

    const updated = await prisma.evenement.update({
      where: { id: existing.id },
      data: {
        ...(body.titre !== undefined && { titre: body.titre }),
        ...(body.categorie !== undefined && { categorie: body.categorie }),
        ...(body.date !== undefined && { date: parseFrenchDate(body.date) }),
        ...(body.heure !== undefined && { heure: body.heure }),
        ...(body.lieu !== undefined && { lieu: body.lieu }),
        ...(body.ville !== undefined && { ville: body.ville }),
        ...(body.prix !== undefined && { prix: body.prix }),
        ...(body.capacite !== undefined && { capacite: body.capacite }),
        ...(body.organisateur !== undefined && { organisateur: body.organisateur }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.image !== undefined && { image: body.image }),
        ...(body.videoUrl !== undefined && { videoUrl: body.videoUrl || null }),
        ...(body.badge !== undefined && { badge: body.badge }),
        ...(body.badgeColor !== undefined && { badgeColor: body.badgeColor }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
        ...(body.artistes !== undefined && { artistes: body.artistes }),
        ...(body.duree !== undefined && { duree: body.duree }),
        ...(body.programme !== undefined && { programme: body.programme }),
      },
    });

    return NextResponse.json({
      data: { evenement: { ...updated, date: formatToFrenchDate(updated.date) } },
    });
  } catch (e: any) {
    console.error("Erreur PATCH:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getSession();
    if (!session || !["ADMIN", "SUPER_ADMIN"].includes((session.user as any).role)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { slug } = await context.params;
    const existing = await findByIdOrSlug(slug);
    if (!existing) return NextResponse.json({ error: "Événement introuvable" }, { status: 404 });

    await prisma.evenement.delete({ where: { id: existing.id } });
    return NextResponse.json({ data: { deleted: true } });
  } catch (e: any) {
    console.error("Erreur DELETE:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const ev = await findByIdOrSlug(slug);
  if (!ev) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: { evenement: { ...ev, date: formatToFrenchDate(ev.date) } } });
}