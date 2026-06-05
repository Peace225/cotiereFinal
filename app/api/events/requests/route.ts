import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { eventRequestSchema } from "@/lib/validations";
import { generateReference } from "@/lib/reference";
import { getSession, requireAdmin } from "@/lib/auth";
import { created, badRequest, ok, serverError, forbidden } from "@/lib/api-response";
import { sendEventRequestConfirmation, sendEventRequestAdminNotif } from "@/lib/email";

// POST /api/events/requests — Soumettre une demande d'événement
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = eventRequestSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.errors[0].message);

    const session = await getSession();
    const data = parsed.data;

    const request = await prisma.eventRequest.create({
      data: {
        reference: generateReference("EVENT"),
        userId: session?.user ? (session.user as { id: string }).id : undefined,
        ...data,
        eventDate: new Date(data.eventDate),
        attachments: data.attachments ?? [],
      },
    });

    // Envoi des emails (non bloquant)
    await Promise.allSettled([
      sendEventRequestConfirmation(request),
      sendEventRequestAdminNotif(request),
    ]);

    return created(request);
  } catch (e) {
    return serverError(e);
  }
}

// GET /api/events/requests — Liste (admin)
export async function GET(req: NextRequest) {
  try { await requireAdmin(); } catch { return forbidden(); }
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "500");

    const where = status ? { status: status as never } : {};

    const [requests, total] = await Promise.all([
      prisma.eventRequest.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.eventRequest.count({ where }),
    ]);

    return ok({ requests, total, page, limit });
  } catch (e) {
    return serverError(e);
  }
}
