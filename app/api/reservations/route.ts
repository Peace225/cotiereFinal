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
  serviceTitle: z.string().min(1),   // ex: "Chambre SupÃ©rieure"
  serviceDetails: z.string().optional(), // ex: "Chambre Â· 2 personnes Â· 40 000 FCFA/nuit"
  pageUrl: z.string().optional(),
});

// POST /api/reservations â€” RÃ©servation gÃ©nÃ©rique depuis le modal
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = reservationSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.errors[0].message);

    const session = await getSession();
    const d = parsed.data;

    // Construction sÃ©curisÃ©e de l'objet de crÃ©ation pour satisfaire le typage strict de Prisma
    const formattedDescription = [
      d.serviceDetails ? `Service : ${d.serviceDetails}` : null,
      d.message ? `Message : ${d.message}` : null,
      d.pageUrl ? `Page : ${d.pageUrl}` : null,
    ].filter(Boolean).join("\n");

    const reservationData: any = {
      id: crypto.randomUUID(),
      updatedAt: new Date(),
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
    };

    if (session?.user) {
      reservationData.userId = (session.user as { id: string }).id;
    }

    if (formattedDescription) {
      reservationData.description = formattedDescription;
    }

    const reservation = await prisma.eventRequest.create({
      data: reservationData,
    });

    return created({ id: reservation.id, reference: reservation.reference });
  } catch (e) {
    return serverError(e);
  }
}

