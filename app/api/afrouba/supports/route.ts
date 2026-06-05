import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, created, badRequest, forbidden, serverError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth";

const DEFAULT_SUPPORTS = [
  { nom: "Publicité TV", categorie: "Télévision", prix: "À partir de 50 000 FCFA", description: "Spots publicitaires diffusés sur CÔTIÈRE TV, la chaîne locale du littoral ivoirien.", image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600&q=80" },
  { nom: "Publicité Radio", categorie: "Radio", prix: "À partir de 25 000 FCFA", description: "Jingles et annonces sur les radios locales du littoral (FM, communautaires).", image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=600&q=80" },
  { nom: "Publicité Web & Réseaux", categorie: "Digital", prix: "À partir de 30 000 FCFA", description: "Campagnes sur Facebook, Instagram, TikTok et le site CÔTIÈRE.", image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80" },
  { nom: "SMS & WhatsApp Marketing", categorie: "Mobile", prix: "À partir de 15 000 FCFA", description: "Envoi de messages promotionnels ciblés à notre base de clients du littoral.", image: "https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=600&q=80" },
  { nom: "Affichage & Flyers", categorie: "Print", prix: "À partir de 20 000 FCFA", description: "Conception et impression de supports print : affiches, flyers, banderoles.", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80" },
  { nom: "Sponsoring d'événements", categorie: "Événements", prix: "Sur devis", description: "Visibilité lors des événements CÔTIÈRE : concerts, galas, foires, marchés.", image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80" },
];

// GET /api/afrouba/supports — Public
export async function GET() {
  try {
    let supports = await prisma.afroubaSupport.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "asc" },
    });

    if (supports.length === 0) {
      await prisma.afroubaSupport.createMany({ data: DEFAULT_SUPPORTS });
      supports = await prisma.afroubaSupport.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "asc" },
      });
    }

    return ok(supports);
  } catch (e) {
    return serverError(e);
  }
}

// POST /api/afrouba/supports — Admin
export async function POST(req: NextRequest) {
  try { await requireAdmin(); } catch { return forbidden(); }
  try {
    const body = await req.json();
    const { nom, categorie, prix, description, image } = body;
    if (!nom) return badRequest("Nom requis");
    const support = await prisma.afroubaSupport.create({
      data: {
        nom,
        categorie: categorie || nom,
        prix: prix || "Sur devis",
        description: description || nom,
        image: image || "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600&q=80",
      },
    });
    return created(support);
  } catch (e) {
    return serverError(e);
  }
}
