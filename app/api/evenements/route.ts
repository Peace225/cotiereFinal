import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categorie = searchParams.get("categorie");
    const all = searchParams.get("all") === "true";

    const where: any = all ? {} : { isActive: true };
    if (categorie && categorie !== "Tous") {
      where.categorie = categorie;
    }

    const evenements = await prisma.evenement.findMany({
      where,
      orderBy: { createdAt: "desc" }, // 1. Tri par ordre décroissant (les plus récents en premier)
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
    if (!session || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const { titre, categorie, date, heure, lieu, ville, prix, capacite, organisateur, description, image, badge, badgeColor, artistes, duree, programme } = body;

    if (!titre || !date || !lieu) {
      return NextResponse.json({ error: "Le titre, la date et le lieu sont obligatoires." }, { status: 400 });
    }

    let slug = body.slug;
    if (!slug) {
      slug = titre
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    const evenement = await prisma.evenement.create({
      data: {
        slug, 
        titre, 
        categorie: categorie || "Festival", 
        date, 
        heure: heure || "", 
        lieu, 
        ville: ville || "", 
        prix: prix || "", 
        capacite: capacite || "",
        organisateur: organisateur || "", 
        description: description || "", 
        image: image || "", 
        badge: badge || "À venir", 
        badgeColor: badgeColor || "bg-blue-500", 
        artistes: artistes || null, 
        duree: duree || null, 
        programme: programme || null,
        isActive: true, // 2. Forcé à true pour garantir l'affichage public immédiat
      },
    });

    return NextResponse.json({ data: { evenement } }, { status: 201 });
  } catch (e: any) {
    console.error("Erreur POST événement:", e);
    return NextResponse.json({ error: e.message || "Erreur serveur" }, { status: 500 });
  }
}