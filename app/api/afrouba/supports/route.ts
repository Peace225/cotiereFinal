import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, badRequest, serverError, forbidden } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth";

const DEFAULT_SUPPORTS = [
  { nom: "Flyer A5", categorie: "print", prix: "15000", description: "Flyer recto", image: "/images/flyer.jpg" },
  { nom: "Carte de visite", categorie: "print", prix: "10000", description: "100 ex", image: "/images/carte.jpg" },
  { nom: "Bâche 2x1", categorie: "grand-format", prix: "25000", description: "Bâche PVC", image: "/images/bache.jpg" },
];

export async function GET() {
  try {
    let supports = await prisma.afrouba_supports.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "asc" },
    });

    if (supports.length === 0) {
      const now = new Date();
      const data = DEFAULT_SUPPORTS.map(s => ({
        id: crypto.randomUUID(),
        nom: s.nom,
        categorie: s.categorie,
        prix: s.prix,
        description: s.description,
        image: s.image,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      }));
      await prisma.afrouba_supports.createMany({ data });
      supports = await prisma.afrouba_supports.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "asc" },
      });
    }

    return ok({ supports });
  } catch (e) { return serverError(e); }
}

export async function POST(req: NextRequest) {
  try { await requireAdmin(); } catch { return forbidden(); }
  try {
    const body = await req.json();
    if (!body.nom) return badRequest("Nom requis");
    
    const support = await prisma.afrouba_supports.create({
      data: {
        id: crypto.randomUUID(),
        nom: body.nom,
        categorie: body.categorie || "autre",
        prix: body.prix || "0",
        description: body.description || "",
        image: body.image || "",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return ok({ support });
  } catch (e) { return serverError(e); }
}


