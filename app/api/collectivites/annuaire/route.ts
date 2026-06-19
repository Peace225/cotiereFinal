import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, created, badRequest, forbidden, serverError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth";

// GET /api/collectivites/annuaire â€” Public
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ville = searchParams.get("ville");
    const type = searchParams.get("type");

    const where: Record<string, unknown> = { isActive: true };
    if (ville) where.ville = ville;
    if (type) where.type = type;

    const institutions = await prisma.collectivite_annuaire.findMany({
      where,
      orderBy: [{ type: "asc" }, { ville: "asc" }],
    });
    return ok(institutions);
  } catch (e) {
    return serverError(e);
  }
}

// POST /api/collectivites/annuaire â€” Admin
export async function POST(req: NextRequest) {
  try { await requireAdmin(); } catch { return forbidden(); }
  try {
    const body = await req.json();
    const { nom, type, ville, region, telephone, email, adresse, siteWeb, horaires } = body;
    if (!nom || !type || !ville) return badRequest("Nom, type et ville requis");

    const institution = await prisma.collectivite_annuaire.create({
      data: { 
        // âœ… CORRECTION : Ajout de l'ID et de la date de mise Ã  jour obligatoires
        id: crypto.randomUUID(),
        nom, 
        type, 
        ville, 
        region: region || "", 
        telephone, 
        email, 
        adresse, 
        siteWeb, 
        horaires,
        updatedAt: new Date()
      },
    });
    return created(institution);
  } catch (e) {
    return serverError(e);
  }
}

