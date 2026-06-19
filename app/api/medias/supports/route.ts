import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, created, badRequest, forbidden, serverError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth";

const DEFAULT_SUPPORTS = [
  { nom: "CÔTIÈRE TV", categorie: "Télévision", description: "Chaîne de télévision dédiée aux villes et villages du littoral ivoirien. Spots publicitaires, reportages et émissions sponsorisées.", image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400&q=80", badge: "TV" },
  { nom: "CÔTIÈRE FM", categorie: "Radio", description: "Radio locale couvrant le littoral ivoirien. Spots audio, émissions sponsorisées et partenariats éditoriaux.", image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&q=80", badge: "FM" },
  { nom: "CÔTIÈRE MAGAZINE", categorie: "Magazine", description: "Magazine print et digital sur l'actualité du littoral. Encarts publicitaires, publi-reportages et dossiers thématiques.", image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&q=80", badge: "MAG" },
];

// GET /api/medias/supports — Public
export async function GET() {
  try {
    // ✅ CORRECTION : Utilisation de media_supports
    let supports = await prisma.media_supports.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "asc" },
    });

    if (supports.length === 0) {
      // ✅ CORRECTION : Injection de l'ID et de la date dans le tableau par défaut
      await prisma.media_supports.createMany({
        data: DEFAULT_SUPPORTS.map((support) => ({
          ...support,
          id: crypto.randomUUID(),
          updatedAt: new Date(),
        })),
      });
      supports = await prisma.media_supports.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "asc" },
      });
    }

    return ok(supports);
  } catch (e) {
    return serverError(e);
  }
}

// POST /api/medias/supports — Admin
export async function POST(req: NextRequest) {
  try { await requireAdmin(); } catch { return forbidden(); }

  try {
    const body = await req.json();
    const { nom, categorie, description, image } = body;
    if (!nom) return badRequest("Nom requis");

    // ✅ CORRECTION : Utilisation de media_supports + Injection id et updatedAt
    const support = await prisma.media_supports.create({
      data: {
        id: crypto.randomUUID(),
        updatedAt: new Date(),
        nom,
        categorie: categorie || nom,
        description: description || nom,
        image: image || "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400&q=80",
        badge: (categorie || nom).slice(0, 3).toUpperCase(),
      },
    });

    return created(support);
  } catch (e) {
    return serverError(e);
  }
}

