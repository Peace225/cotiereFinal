import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, created, badRequest, forbidden, serverError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth";

const DEFAULT_PRESTATIONS = [
  { nom: "Reportages vidéo et photo", categorie: "Vidéo", description: "Captation vidéo HD/4K, photojournalisme, montage inclus.", prix: "Sur devis", image: "/Images/cotiere-info.png" },
  { nom: "Interviews et émissions", categorie: "TV/Radio", description: "Studio, plateau TV, diffusion multi-canaux.", prix: "Sur devis", image: "/Images/cotiere-info.png" },
  { nom: "Couverture d'événements", categorie: "Live", description: "Live, multi-caméras, réseaux sociaux en temps réel.", prix: "Sur devis", image: "/Images/cotiere-info.png" },
  { nom: "Publication de contenus", categorie: "Digital", description: "Articles, communiqués, réseaux sociaux, newsletter.", prix: "Sur devis", image: "/Images/cotiere-info.png" },
];

// GET /api/info/prestations — Public
export async function GET() {
  try {
    // ✅ CORRIGÉ : info_prestation -> info_prestations
    let prestations = await prisma.info_prestations.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "asc" },
    });

    if (prestations.length === 0) {
      // ✅ CORRIGÉ : info_prestation -> info_prestations
      await prisma.info_prestations.createMany({ data: DEFAULT_PRESTATIONS });
      // ✅ CORRIGÉ : info_prestation -> info_prestations
      prestations = await prisma.info_prestations.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "asc" },
      });
    }

    return ok(prestations);
  } catch (e) {
    return serverError(e);
  }
}

// POST /api/info/prestations — Admin
export async function POST(req: NextRequest) {
  try { await requireAdmin(); } catch { return forbidden(); }

  try {
    const body = await req.json();
    const { nom, categorie, description, prix, image } = body;
    if (!nom) return badRequest("Nom requis");

    // ✅ CORRIGÉ : info_prestation -> info_prestations
    const prestation = await prisma.info_prestations.create({
      data: {
        nom,
        categorie: categorie || nom,
        description: description || nom,
        prix: prix || "Sur devis",
        image: image || "/Images/cotiere-info.png",
      },
    });

    return created(prestation);
  } catch (e) {
    return serverError(e);
  }
}