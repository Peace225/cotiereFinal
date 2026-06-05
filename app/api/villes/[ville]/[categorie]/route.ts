import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, created, badRequest, forbidden, serverError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth";
import { VILLES_SEED } from "@/lib/villes-seed-data";

type Params = { params: Promise<{ ville: string; categorie: string }> };

// GET /api/villes/[ville]/[categorie] — Public (auto-seed si données manquantes)
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { ville, categorie } = await params;

    // Vérifier si cette ville+catégorie a des données
    const count = await prisma.villeContenu.count({ where: { ville, categorie } });
    if (count === 0) {
      // Insérer uniquement les données manquantes pour cette ville+catégorie
      const seedForThis = VILLES_SEED.filter(s => s.ville === ville && s.categorie === categorie);
      if (seedForThis.length > 0) {
        await prisma.villeContenu.createMany({ data: seedForThis, skipDuplicates: true });
      }
    }

    const contenus = await prisma.villeContenu.findMany({
      where: { ville, categorie, isActive: true },
      orderBy: { createdAt: "asc" },
    });
    return ok(contenus);
  } catch (e) {
    return serverError(e);
  }
}

// POST /api/villes/[ville]/[categorie] — Admin
export async function POST(req: NextRequest, { params }: Params) {
  try { await requireAdmin(); } catch { return forbidden(); }
  try {
    const { ville, categorie } = await params;
    const body = await req.json();
    const { nom, description, adresse, telephone, whatsapp, siteWeb, image, prix, note } = body;
    if (!nom) return badRequest("Nom requis");
    const contenu = await prisma.villeContenu.create({
      data: { ville, categorie, nom, description, adresse, telephone, whatsapp, siteWeb, image, prix, note },
    });
    return created(contenu);
  } catch (e) {
    return serverError(e);
  }
}
