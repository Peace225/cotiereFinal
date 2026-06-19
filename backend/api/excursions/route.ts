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

// GET /api/excursions — Catalogue public
export async function GET() {
  try {
    const excursions = await prisma.excursions.findMany({
      where: { isActive: true },
      include: {
        // ✅ CORRIGÉ : Remplacement de 'options' par 'excursion_options' (en snake_case)
        excursion_options: { where: { isActive: true } },
        // ✅ CORRIGÉ : Remplacement de 'timeSlots' par 'excursion_time_slots' (en snake_case)
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

// POST /api/excursions — Créer une excursion (admin)
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

    const excursion = await prisma.excursions.create({
      data: { ...parsed.data, images: parsed.data.images ?? [] },
    });

    return created(excursion);
  } catch (e) {
    return serverError(e);
  }
}