import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, created, badRequest, serverError } from "@/lib/api-response";
import { z } from "zod";
import { getSession } from "@/lib/auth";

const schema = z.object({
  excursionId: z.string().optional(),
  serviceType: z.string().min(2),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(500).optional(),
  // Pour les non-connectÃ©s
  guestName: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const excursionId = searchParams.get("excursionId");
    const serviceType = searchParams.get("serviceType");
    const all = searchParams.get("all") === "true"; // admin

    const where: any = all ? {} : { isApproved: true };
    if (excursionId) where.excursionId = excursionId;
    if (serviceType) where.serviceType = serviceType;

    const reviews = await prisma.review.findMany({
      where,
      include: { user: { select: { firstName: true, lastName: true } } },
      orderBy: { createdAt: "desc" },
    });
    return ok(reviews);
  } catch (e) { return serverError(e); }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return badRequest("Connexion requise pour laisser un avis");

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.errors[0].message);

    const userId = (session.user as { id: string }).id;
    const review = await prisma.review.create({
      data: {
        userId,
        excursionId: parsed.data.excursionId,
        serviceType: parsed.data.serviceType,
        rating: parsed.data.rating,
        comment: parsed.data.comment,
        isApproved: false, // modÃ©ration admin requise
      },
    });
    return created(review);
  } catch (e) { return serverError(e); }
}


