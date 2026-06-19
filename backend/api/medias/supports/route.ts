import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, created, badRequest, forbidden, serverError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth";

const DEFAULT_SUPPORTS = [
  { nom: "CÃ”TIÃˆRE TV", categorie: "TÃ©lÃ©vision", description: "ChaÃ®ne de tÃ©lÃ©vision dÃ©diÃ©e aux villes et villages du littoral ivoirien. Spots publicitaires, reportages et Ã©missions sponsorisÃ©es.", image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400&q=80", badge: "TV" },
  { nom: "CÃ”TIÃˆRE FM", categorie: "Radio", description: "Radio locale couvrant le littoral ivoirien. Spots audio, Ã©missions sponsorisÃ©es et partenariats Ã©ditoriaux.", image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&q=80", badge: "FM" },
  { nom: "CÃ”TIÃˆRE MAGAZINE", categorie: "Magazine", description: "Magazine print et digital sur l'actualitÃ© du littoral. Encarts publicitaires, publi-reportages et dossiers thÃ©matiques.", image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&q=80", badge: "MAG" },
];

// GET /api/medias/supports â€” Public
export async function GET() {
  try {
    let supports = await prisma.media_supports.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "asc" },
    });

    if (supports.length === 0) {
      await prisma.media_supports.createMany({ data: DEFAULT_SUPPORTS });
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

// POST /api/medias/supports â€” Admin
export async function POST(req: NextRequest) {
  try { await requireAdmin(); } catch { return forbidden(); }

  try {
    const body = await req.json();
    const { nom, categorie, description, image } = body;
    if (!nom) return badRequest("Nom requis");

    const support = await prisma.media_supports.create({
      data: {
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


