import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

const MOIS_FR: Record<string, number> = {
  "janvier": 0, "février": 1, "fevrier": 1, "mars": 2, "avril": 3, "mai": 4, "juin": 5,
  "juillet": 6, "août": 7, "aout": 7, "septembre": 8, "octobre": 9, "novembre": 10, "décembre": 11, "decembre": 11
};

function parseDateFR(input: any): Date {
  if (!input) return new Date();
  if (input instanceof Date) return input;
  const s = String(input).trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return new Date(s); // ISO déjà
  try {
    const lower = s.toLowerCase();
    const parts = lower.split(/[\s\/-]+/); // ["14","décembre","2026"]
    if (parts.length >= 3) {
      const jour = parseInt(parts[0], 10);
      const annee = parseInt(parts[2], 10);
      let mois = MOIS_FR[parts[1]];
      if (mois === undefined) mois = parseInt(parts[1], 10) - 1;
      if (!isNaN(jour) && !isNaN(mois) && !isNaN(annee)) {
        return new Date(annee, mois, jour, 12, 0, 0);
      }
    }
  } catch {}
  return new Date();
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categorie = searchParams.get("categorie");
    const all = searchParams.get("all") === "true";
    const where: any = all ? {} : { isActive: true };
    if (categorie && categorie !== "Tous") where.categorie = categorie;

    const evenements = await prisma.evenement.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ data: { evenements } });
  } catch (error) {
    console.error("Erreur GET événements:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !["ADMIN", "SUPER_ADMIN"].includes((session.user as any).role)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const { titre, categorie, date, heure, lieu, ville, prix, capacite, organisateur, description, image, videoUrl, badge, badgeColor, artistes, duree, programme } = body;

    if (!titre || !date || !lieu) {
      return NextResponse.json({ error: "Le titre, la date et le lieu sont obligatoires." }, { status: 400 });
    }

    let slug = body.slug;
    if (!slug) {
      slug = titre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now();
    }

    const evenement = await prisma.evenement.create({
      data: {
        slug,
        titre,
        categorie: categorie || "Festival",
        date: parseDateFR(date),
        heure: heure || "",
        lieu,
        ville: ville || "",
        prix: prix || "",
        capacite: capacite || "",
        organisateur: organisateur || "",
        description: description || "",
        image: image || "",
        videoUrl: videoUrl || null, // <- TON CHAMP
        badge: badge || "À venir",
        badgeColor: badgeColor || "bg-blue-500",
        artistes: artistes || null,
        duree: duree || null,
        programme: programme || null,
        isActive: true,
      },
    });

    return NextResponse.json({ data: { evenement } }, { status: 201 });
  } catch (e: any) {
    console.error("Erreur POST événement:", e);
    return NextResponse.json({ error: e.message || "Erreur serveur" }, { status: 500 });
  }
}