import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, created, badRequest, forbidden, serverError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth";

const DEFAULT_SERVICES = [
  { label: "Tournage vidéo professionnel", description: "Captation vidéo HD/4K avec équipement professionnel.", image: "https://images.unsplash.com/photo-1601506521793-dc748fc80b67?w=400&q=80" },
  { label: "Photographie professionnelle", description: "Séances photo studio et extérieur, retouche incluse.", image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400&q=80" },
  { label: "Streaming en direct (live)", description: "Diffusion live sur toutes les plateformes sociales.", image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=400&q=80" },
  { label: "Prises de vue aériennes par drone", description: "Drone 4K pour vues aériennes spectaculaires.", image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&q=80" },
  { label: "Régie mobile pour rendu TV", description: "Régie complète pour productions télévisées.", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
  { label: "Montage vidéo post-production", description: "Montage professionnel, effets visuels et étalonnage.", image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&q=80" },
  { label: "Livraison sur clé USB / lien", description: "Livraison rapide de vos fichiers finaux.", image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&q=80" },
];

// GET /api/studio/services — Public
export async function GET() {
  try {
    let services = await prisma.studioService.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "asc" },
    });

    if (services.length === 0) {
      await prisma.studioService.createMany({ data: DEFAULT_SERVICES });
      services = await prisma.studioService.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "asc" },
      });
    }

    return ok(services);
  } catch (e) {
    return serverError(e);
  }
}

// POST /api/studio/services — Admin
export async function POST(req: NextRequest) {
  try { await requireAdmin(); } catch { return forbidden(); }

  try {
    const body = await req.json();
    const { label, description, image } = body;
    if (!label) return badRequest("Nom requis");

    const service = await prisma.studioService.create({
      data: {
        label,
        description: description || label,
        image: image || "https://images.unsplash.com/photo-1601506521793-dc748fc80b67?w=400&q=80",
      },
    });

    return created(service);
  } catch (e) {
    return serverError(e);
  }
}
