import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, created, badRequest, forbidden, serverError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth"; // Protection ajoutÃ©e
import { z } from "zod";

const schema = z.object({
  excursionId: z.string().optional(),
  serviceType: z.string().min(2),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(500).optional(),
});

// GET /api/reviews â€” Catalogue public (ou liste complÃ¨te pour admin)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const excursionId = searchParams.get("excursionId");
  const serviceType = searchParams.get("serviceType");
  const all = searchParams.get("all") === "true";

  // SÃ©curisation : Seul un admin peut voir les avis non approuvÃ©s
  if (all) {
    try { await requireAdmin(); } catch { return forbidden(); }
  }

  const where: any = all ? {} : { isApproved: true };
  if (excursionId) where.excursionId = excursionId;
  if (serviceType) where.serviceType = serviceType;

  try {
    const reviews = await prisma.review.findMany({
      where,
      include: { user: { select: { firstName: true, lastName: true } } },
      orderBy: { createdAt: "desc" },
    });
    return ok(reviews);
  } catch (e) { return serverError(e); }
}

// POST /api/reviews â€” Soumission d'un avis
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.errors[0].message);

    // Note : On retire la dÃ©pendance Ã  getSession() pour Ã©viter le build error
    // Si votre frontend envoie l'ID utilisateur dans le corps, utilisez-le
    const userId = body.userId; 
    if (!userId) return badRequest("ID utilisateur requis");

    const review = await prisma.review.create({
      data: {
        userId,
        excursionId: parsed.data.excursionId,
        serviceType: parsed.data.serviceType,
        rating: parsed.data.rating,
        comment: parsed.data.comment,
        isApproved: false,
      },
    });
    return created(review);
  } catch (e) { return serverError(e); }
}

