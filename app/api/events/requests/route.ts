import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { eventRequestSchema } from "@/lib/validations";
import { generateReference } from "@/lib/reference";
import { getSession } from "@/lib/auth";
import { created, badRequest, ok, serverError, forbidden, unauthorized } from "@/lib/api-response";
import { sendEventRequestConfirmation, sendEventRequestAdminNotif } from "@/lib/email";

export const dynamic = 'force-dynamic';

// POST /api/events/requests — Soumettre une demande d'événement (public)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = eventRequestSchema.safeParse(body);

    if (!parsed.success) {
      return badRequest(parsed.error.errors[0].message);
    }

    const session = await getSession();
    const data = parsed.data;

    const request = await prisma.eventRequest.create({
      data: {
        reference: generateReference("EVENT"),
        eventType: data.eventType,
        eventDate: new Date(data.eventDate),
        guestCount: data.guestCount,
        budget: data.budget || null,
        eventLocation: (data as any).location || (data as any).eventLocation || "", // FIX: eventLocation pas location
        description: data.description || "",
        clientFirstName: data.clientFirstName,
        clientLastName: data.clientLastName,
        clientEmail: data.clientEmail,
        clientPhone: data.clientPhone,
        services: (data as any).services?? [],
        attachments: data.attachments?? [],
       ...(session?.user? { userId: (session.user as { id: string }).id } : {}),
      },
    });

    // Envoi des emails (non bloquant)
    await Promise.allSettled([
      sendEventRequestConfirmation(request),
      sendEventRequestAdminNotif(request),
    ]);

    return created(request);
  } catch (e) {
    console.error("[EVENT POST]", e);
    return serverError(e);
  }
}

// GET /api/events/requests — Liste (admin uniquement)
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session?.user) {
      return unauthorized();
    }

    const user = session.user as any;
    const isAdmin = user.role === 'ADMIN' || user.role === 'admin' || user.isAdmin === true;

    if (!isAdmin) {
      console.warn(`[EVENT] Accès refusé pour ${user.email}`);
      return forbidden("Admin requis");
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page")?? "1");
    const limit = Math.min(parseInt(searchParams.get("limit")?? "50"), 500);

    const where = status? { status: status as any } : {};

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
    console.error("[EVENT GET]", e);
    return serverError(e);
  }
}