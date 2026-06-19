import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, created, badRequest, forbidden, serverError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth";

const DEFAULT_SERVICES = [
  { nom: "Enregistrement studio", categorie: "Studio", prix: "Ã€ partir de 50 000 FCFA", description: "Studio professionnel Ã©quipÃ© pour l'enregistrement de vos titres musicaux.", image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&q=80" },
  { nom: "Mixage & Mastering", categorie: "Post-production", prix: "Ã€ partir de 30 000 FCFA", description: "Mixage et mastering professionnel pour donner Ã  votre musique un son de qualitÃ©.", image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&q=80" },
  { nom: "Management artiste", categorie: "Management", prix: "Sur devis", description: "Accompagnement complet pour la gestion de votre carriÃ¨re artistique.", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80" },
  { nom: "Production musicale", categorie: "Production", prix: "Ã€ partir de 20 000 FCFA", description: "Production de beats et instrumentaux sur mesure pour vos projets.", image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&q=80" },
];

// GET /api/musique/services â€” Public
export async function GET() {
  try {
    let services = await prisma.musique_services.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "asc" },
    });

    if (services.length === 0) {
      await prisma.musique_services.createMany({ data: DEFAULT_SERVICES });
      services = await prisma.musique_services.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "asc" },
      });
    }

    return ok(services);
  } catch (e) {
    return serverError(e);
  }
}

// POST /api/musique/services â€” Admin
export async function POST(req: NextRequest) {
  try { await requireAdmin(); } catch { return forbidden(); }

  try {
    const body = await req.json();
    const { nom, categorie, prix, description, image } = body;
    if (!nom) return badRequest("Nom requis");

    const service = await prisma.musique_services.create({
      data: {
        nom,
        categorie: categorie || nom,
        prix: prix || "Sur devis",
        description: description || nom,
        image: image || "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&q=80",
      },
    });

    return created(service);
  } catch (e) {
    return serverError(e);
  }
}


