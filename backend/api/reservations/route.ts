import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateReference } from "@/lib/reference";
import { getSession } from "@/lib/auth";
import { created, badRequest, serverError } from "@/lib/api-response";
import { z } from "zod";

const reservationSchema = z.object({
  clientFirstName: z.string().min(1),
  clientLastName: z.string().min(1),
  clientPhone: z.string().min(6),
  clientEmail: z.string().email().optional().or(z.literal("")),
  eventDate: z.string().optional(),
  message: z.string().optional(),
  serviceTitle: z.string().min(1),   // ex: "Chambre Supérieure"
  serviceDetails: z.string().optional(), // ex: "Chambre · 2 personnes · 40 000 FCFA/nuit"
  pageUrl: z.string().optional(),
});

// POST /api/reservations — Réservation générique depuis le modal
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = reservationSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.errors[0].message);

    const session = await getSession();
    const d = parsed.data;

    const reservation = await prisma.eventRequest.create({
      data: {
        reference: generateReference("RES"),
        userId: session?.user ? (session.user as { id: string }).id : undefined,
        clientFirstName: d.clientFirstName,
        clientLastName: d.clientLastName,
        clientEmail: d.clientEmail || "non-fourni@cotiere.ci",
        clientPhone: d.clientPhone,
        eventType: d.serviceTitle,
        eventDate: d.eventDate ? new Date(d.eventDate) : new Date(),
        eventLocation: d.pageUrl ?? "Site web",
        guestCount: 1,
        services: [d.serviceTitle],
        attachments: [],
        description: [
          d.serviceDetails ? `Service : ${d.serviceDetails}` : null,
          d.message ? `Message : ${d.message}` : null,
          d.pageUrl ? `Page : ${d.pageUrl}` : null,
        ].filter(Boolean).join("\n") || undefined,
      },
    });

    return created({ id: reservation.id, reference: reservation.reference });
  } catch (e) {
    return serverError(e);
  }
}
