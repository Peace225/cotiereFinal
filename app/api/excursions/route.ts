import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, created, badRequest, forbidden, serverError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth";
import { z } from "zod";

const excursionSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  description: z.string().min(10),
  duration: z.string(),
  difficulty: z.string().optional(),
  maxParticipants: z.number().int().positive().default(20),
  priceAdult: z.number().int().positive(),
  priceChild: z.number().int().positive(),
  images: z.array(z.string()).optional(),
});

// GET /api/excursions â€” Catalogue public
export async function GET() {
  try {
    // âœ… CORRECTION 1 : prisma.excursions
    const excursions = await prisma.excursions.findMany({
      where: { isActive: true },
      include: {
        // âœ… CORRECTION 2 : Noms de relations exacts
        excursion_options: { where: { isActive: true } },
        excursion_time_slots: { where: { isActive: true } },
        reviews: { where: { isApproved: true }, select: { rating: true } },
      },
      orderBy: { title: "asc" },
    });

    // Calcul note moyenne
    const result = excursions.map((e) => ({
      ...e,
      avgRating:
        e.reviews.length > 0
          ? e.reviews.reduce((s, r) => s + r.rating, 0) / e.reviews.length
          : null,
      reviewCount: e.reviews.length,
    }));

    return ok(result);
  } catch (e) {
    return serverError(e);
  }
}

// POST /api/excursions â€” CrÃ©er une excursion (admin)
export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return forbidden();
  }

  try {
    const body = await req.json();
    const parsed = excursionSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.errors[0].message);

    // âœ… CORRECTION 3 : prisma.excursions + Injection de l'ID et updatedAt
    const excursion = await prisma.excursions.create({
      data: { 
        id: crypto.randomUUID(),
        updatedAt: new Date(),
        ...parsed.data, 
        images: parsed.data.images ?? [] 
      },
    });

    return created(excursion);
  } catch (e) {
    return serverError(e);
  }
}

