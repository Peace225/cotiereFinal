import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, created, badRequest, forbidden, serverError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth";

const DEFAULT_VEHICULES = [
  { id: "v1", createdAt: new Date(), updatedAt: new Date(), nom: "Voiture Citadine", categorie: "Ã‰conomique", description: "IdÃ©ale pour les dÃ©placements en ville. ClimatisÃ©e, Ã©conomique en carburant.", prix: "15 000 FCFA/jour", caution: "50 000 FCFA", places: 5, image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&q=80" },
  { id: "v2", createdAt: new Date(), updatedAt: new Date(), nom: "4x4 / SUV", categorie: "Tout-terrain", description: "Parfait pour les excursions et les routes difficiles du littoral.", prix: "35 000 FCFA/jour", caution: "150 000 FCFA", places: 7, image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&q=80" },
  { id: "v3", createdAt: new Date(), updatedAt: new Date(), nom: "Moto / Scooter", categorie: "Deux-roues", description: "Pratique pour se dÃ©placer rapidement dans les ruelles et sur la cÃ´te.", prix: "8 000 FCFA/jour", caution: "30 000 FCFA", places: 2, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
  { id: "v4", createdAt: new Date(), updatedAt: new Date(), nom: "Avec Chauffeur", categorie: "Service premium", description: "Chauffeur professionnel disponible 24h/24.", prix: "50 000 FCFA/jour", caution: "Aucune", places: 4, image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&q=80" },
  { id: "v5", createdAt: new Date(), updatedAt: new Date(), nom: "Bus / Minibus", categorie: "Groupe", description: "Pour vos sorties en groupe, excursions et transferts d'Ã©quipes.", prix: "80 000 FCFA/jour", caution: "200 000 FCFA", places: 20, image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&q=80" },
  { id: "v6", createdAt: new Date(), updatedAt: new Date(), nom: "VÃ©hicule de Luxe", categorie: "Premium", description: "Mercedes, BMW ou Ã©quivalent pour vos occasions spÃ©ciales.", prix: "100 000 FCFA/jour", caution: "500 000 FCFA", places: 5, image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&q=80" },
];

// GET /api/vehicules â€” Public
export async function GET() {
  try {
    // âœ… CORRECTION : Utilisation de vehicules au pluriel
    let vehicules = await prisma.vehicules.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "asc" },
    });

    if (vehicules.length === 0) {
      // âœ… CORRECTION : Utilisation de vehicules au pluriel
      await prisma.vehicules.createMany({ data: DEFAULT_VEHICULES });
      // âœ… CORRECTION : Utilisation de vehicules au pluriel
      vehicules = await prisma.vehicules.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "asc" },
      });
    }

    return ok(vehicules);
  } catch (e) {
    return serverError(e);
  }
}

// POST /api/vehicules â€” Admin
export async function POST(req: NextRequest) {
  try { await requireAdmin(); } catch { return forbidden(); }

  try {
    const body = await req.json();
    const { nom, categorie, description, prix, caution, places, image } = body;
    if (!nom) return badRequest("Nom requis");

    // âœ… CORRECTION : Utilisation de vehicules au pluriel et injection de id / updatedAt
    const vehicule = await prisma.vehicules.create({
      data: {
        id: crypto.randomUUID(),
        updatedAt: new Date(),
        nom,
        categorie: categorie || nom,
        description: description || nom,
        prix: prix || "Sur devis",
        caution: caution || "Aucune",
        places: parseInt(places) || 5,
        image: image || "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&q=80",
      },
    });

    return created(vehicule);
  } catch (e) {
    return serverError(e);
  }
}

