import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, created, badRequest, forbidden, serverError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth";

const DEFAULT_SECTEURS = [
  { nom: "Tourisme", categorie: "Tourisme", couleur: "bg-cyan-500", description: "Investissements et opportunitÃ©s dans le secteur touristique du littoral ivoirien.", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80" },
  { nom: "Agro-alimentaire", categorie: "Agriculture", couleur: "bg-green-500", description: "Projets agricoles et de transformation alimentaire dans la rÃ©gion cÃ´tiÃ¨re.", image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&q=80" },
  { nom: "PÃªche", categorie: "PÃªche", couleur: "bg-blue-500", description: "OpportunitÃ©s dans la filiÃ¨re pÃªche artisanale et industrielle du littoral.", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&q=80" },
  { nom: "Immobilier", categorie: "Immobilier", couleur: "bg-orange-500", description: "Projets immobiliers rÃ©sidentiels et commerciaux sur le littoral ivoirien.", image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80" },
  { nom: "Culture", categorie: "Culture", couleur: "bg-purple-500", description: "Investissements dans les industries culturelles et crÃ©atives de la rÃ©gion.", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80" },
  { nom: "NumÃ©rique", categorie: "Tech", couleur: "bg-indigo-500", description: "OpportunitÃ©s dans le secteur des technologies et du numÃ©rique.", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80" },
  { nom: "Commerce", categorie: "Commerce", couleur: "bg-yellow-500", description: "Projets commerciaux et de distribution dans les villes du littoral.", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80" },
  { nom: "Ã‰nergie", categorie: "Ã‰nergie", couleur: "bg-red-500", description: "Projets d'Ã©nergie renouvelable et d'Ã©lectrification dans la rÃ©gion cÃ´tiÃ¨re.", image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400&q=80" },
];

// GET /api/opportunites/secteurs
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const isAdminRequest = searchParams.get("admin") === "1";

  // VÃ©rification de sÃ©curitÃ© rÃ©elle si admin demandÃ©
  if (isAdminRequest) {
    try { await requireAdmin(); } catch { return forbidden(); }
  }

  try {
    const whereClause = isAdminRequest ? {} : { isActive: true };

    let secteurs = await prisma.opportunite_secteurs.findMany({
      where: whereClause,
      orderBy: { createdAt: "asc" },
    });

    if (secteurs.length === 0) {
      await prisma.opportunite_secteurs.createMany({ data: DEFAULT_SECTEURS });
      secteurs = await prisma.opportunite_secteurs.findMany({
        where: whereClause,
        orderBy: { createdAt: "asc" },
      });
    }

    return ok(secteurs);
  } catch (e) {
    return serverError(e);
  }
}

// POST /api/opportunites/secteurs
export async function POST(req: NextRequest) {
  try { await requireAdmin(); } catch { return forbidden(); }

  try {
    const body = await req.json();
    const { nom, categorie, couleur, description, image } = body;
    if (!nom || !description) return badRequest("Nom et description requis");

    const secteur = await prisma.opportunite_secteurs.create({
      data: {
        nom,
        categorie: categorie || nom,
        couleur: couleur || "bg-cyan-500",
        description,
        image: image || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80",
      },
    });

    return created(secteur);
  } catch (e) {
    return serverError(e);
  }
}

