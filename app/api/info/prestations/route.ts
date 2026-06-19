import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, created, badRequest, forbidden, serverError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth";

const DEFAULT_PRESTATIONS = [
  { nom: "Reportages vidÃ©o et photo", categorie: "VidÃ©o", description: "Captation vidÃ©o HD/4K, photojournalisme, montage inclus.", prix: "Sur devis", image: "/Images/cotiere-info.png" },
  { nom: "Interviews et Ã©missions", categorie: "TV/Radio", description: "Studio, plateau TV, diffusion multi-canaux.", prix: "Sur devis", image: "/Images/cotiere-info.png" },
  { nom: "Couverture d'Ã©vÃ©nements", categorie: "Live", description: "Live, multi-camÃ©ras, rÃ©seaux sociaux en temps rÃ©el.", prix: "Sur devis", image: "/Images/cotiere-info.png" },
  { nom: "Publication de contenus", categorie: "Digital", description: "Articles, communiquÃ©s, rÃ©seaux sociaux, newsletter.", prix: "Sur devis", image: "/Images/cotiere-info.png" },
];

// GET /api/info/prestations â€” Public
export async function GET() {
  try {
    let prestations = await prisma.info_prestations.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "asc" },
    });

    if (prestations.length === 0) {
      await prisma.info_prestations.createMany({ data: DEFAULT_PRESTATIONS.map(p => ({ ...p, id: crypto.randomUUID(), updatedAt: new Date() })) });
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

// POST /api/info/prestations â€” Admin
export async function POST(req: NextRequest) {
  try { await requireAdmin(); } catch { return forbidden(); }

  try {
    const body = await req.json();
    const { nom, categorie, description, prix, image } = body;
    if (!nom) return badRequest("Nom requis");

    const prestation = await prisma.info_prestations.create({
      data: {
        id: crypto.randomUUID(),
        updatedAt: new Date(),
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





