import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateReference } from "@/lib/reference";
import { created, ok, badRequest, serverError, forbidden } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth"; // Protection ajoutée
import { z } from "zod";

const reservationSchema = z.object({
  clientFirstName: z.string().min(1),
  clientLastName: z.string().min(1),
  clientPhone: z.string().min(6),
  clientEmail: z.string().email().optional().or(z.literal("")),
  eventDate: z.string().optional(),
  message: z.string().optional(),
  serviceTitle: z.string().min(1),
  serviceDetails: z.string().optional(),
  pageUrl: z.string().optional(),
});

// POST /api/reservations — Réservation générique (Public)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = reservationSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.errors[0].message);

    const d = parsed.data;

    const reservation = await prisma.eventRequest.create({
      data: {
        reference: generateReference("RES"),
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

// GET /api/reservations — Liste des réservations (Admin uniquement)
export async function GET() {
  // Sécurisation : Seuls les admins peuvent voir les demandes
  try { await requireAdmin(); } catch { return forbidden(); }

  try {
    const reservations = await prisma.eventRequest.findMany({
      orderBy: { createdAt: "desc" },
    });
    return ok({ reservations });
  } catch (e) {
    return serverError(e);
  }
}