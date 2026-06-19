import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, created, badRequest, forbidden, serverError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth";

const DEFAULT_SERVICES = [
  { nom: "Coaching & Formation", categorie: "Coaching", description: "Programmes de formation professionnelle et coaching individuel ou collectif pour renforcer les capacités.", image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&q=80" },
  { nom: "Accompagnement institutionnel", categorie: "Accompagnement", description: "Appui aux collectivités locales dans leurs projets de développement et amélioration de la gouvernance.", image: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=400&q=80" },
  { nom: "Développement local", categorie: "Développement", description: "Stratégies de développement économique pour les communes du littoral ivoirien.", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80" },
  { nom: "Partenariats publics-privés", categorie: "Partenariats", description: "Facilitation de partenariats entre acteurs publics et privés pour des projets durables.", image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&q=80" },
  { nom: "Certification & Accréditation", categorie: "Certification", description: "Accompagnement dans les démarches de certification ISO et d'accréditation.", image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80" },
  { nom: "Animation communautaire", categorie: "Animation", description: "Organisation d'événements et d'activités pour renforcer la cohésion sociale.", image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80" },
];

// GET /api/collectivites/services — Public
export async function GET() {
  try {
    let services = await prisma.collectivite_services.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "asc" },
    });

    if (services.length === 0) {
      await prisma.collectivite_services.createMany({ data: DEFAULT_SERVICES.map(s => ({ ...s, id: crypto.randomUUID(), updatedAt: new Date() })) });
      services = await prisma.collectivite_services.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "asc" },
      });
    }

    return ok(services);
  } catch (e) {
    return serverError(e);
  }
}

// POST /api/collectivites/services — Admin
export async function POST(req: NextRequest) {
  try { await requireAdmin(); } catch { return forbidden(); }
  try {
    const body = await req.json();
    const { nom, categorie, description, image } = body;
    if (!nom) return badRequest("Nom requis");
    const service = await prisma.collectivite_services.create({
      data: {
        // ✅ CORRECTION ICI : Ajout des champs obligatoires
        id: crypto.randomUUID(),
        updatedAt: new Date(),
        nom,
        categorie: categorie || nom,
        description: description || nom,
        image: image || "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80",
      },
    });
    return created(service);
  } catch (e) {
    return serverError(e);
  }
}

