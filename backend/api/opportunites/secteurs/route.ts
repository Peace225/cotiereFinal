import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, created, badRequest, forbidden, serverError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth";

const DEFAULT_SECTEURS = [
  { nom: "Tourisme", categorie: "Tourisme", couleur: "bg-cyan-500", description: "Investissements et opportunités dans le secteur touristique du littoral ivoirien.", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80" },
  { nom: "Agro-alimentaire", categorie: "Agriculture", couleur: "bg-green-500", description: "Projets agricoles et de transformation alimentaire dans la région côtière.", image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&q=80" },
  { nom: "Pêche", categorie: "Pêche", couleur: "bg-blue-500", description: "Opportunités dans la filière pêche artisanale et industrielle du littoral.", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&q=80" },
  { nom: "Immobilier", categorie: "Immobilier", couleur: "bg-orange-500", description: "Projets immobiliers résidentiels et commerciaux sur le littoral ivoirien.", image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80" },
  { nom: "Culture", categorie: "Culture", couleur: "bg-purple-500", description: "Investissements dans les industries culturelles et créatives de la région.", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80" },
  { nom: "Numérique", categorie: "Tech", couleur: "bg-indigo-500", description: "Opportunités dans le secteur des technologies et du numérique.", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80" },
  { nom: "Commerce", categorie: "Commerce", couleur: "bg-yellow-500", description: "Projets commerciaux et de distribution dans les villes du littoral.", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80" },
  { nom: "Énergie", categorie: "Énergie", couleur: "bg-red-500", description: "Projets d'énergie renouvelable et d'électrification dans la région côtière.", image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400&q=80" },
];

// GET /api/opportunites/secteurs
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const isAdminRequest = searchParams.get("admin") === "1";

  // Vérification de sécurité réelle si admin demandé
  if (isAdminRequest) {
    try { await requireAdmin(); } catch { return forbidden(); }
  }

  try {
    const whereClause = isAdminRequest ? {} : { isActive: true };

    let secteurs = await prisma.opportuniteSecteur.findMany({
      where: whereClause,
      orderBy: { createdAt: "asc" },
    });

    if (secteurs.length === 0) {
      await prisma.opportuniteSecteur.createMany({ data: DEFAULT_SECTEURS });
      secteurs = await prisma.opportuniteSecteur.findMany({
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

    const secteur = await prisma.opportuniteSecteur.create({
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