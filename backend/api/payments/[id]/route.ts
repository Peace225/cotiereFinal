import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, badRequest, notFound, serverError, forbidden } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth"; // Protection ajoutée
import { z } from "zod";

type Params = { params: Promise<{ id: string }> };

const confirmSchema = z.object({
  status: z.enum(["CONFIRMED", "PARTIAL", "PAID", "REFUNDED"]), // Ajout de CONFIRMED si nécessaire
  transactionId: z.string().optional(),
  paidAt: z.string().optional(),
});

// PATCH /api/payments/[id] — Confirmer/refuser un paiement (admin)
export async function PATCH(req: NextRequest, { params }: Params) {
  // Sécurisation : Seul un admin peut valider des paiements
  try { await requireAdmin(); } catch { return forbidden(); }

  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = confirmSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.errors[0].message);

    const payment = await prisma.payment.findUnique({ where: { id } });
    if (!payment) return notFound("Paiement introuvable");

    const updated = await prisma.payment.update({
      where: { id },
      data: {
        status: parsed.data.status,
        transactionId: parsed.data.transactionId,
        paidAt: parsed.data.status === "PAID" ? (parsed.data.paidAt ? new Date(parsed.data.paidAt) : new Date()) : undefined,
      },
    });

    // Mettre à jour le statut de paiement de la réservation liée
    if (parsed.data.status === "PAID") {
      const updateData = { paymentStatus: "PAID" };
      if (payment.studioBookingId) await prisma.studioBooking.update({ where: { id: payment.studioBookingId }, data: updateData });
      if (payment.excursionBookingId) await prisma.excursionBooking.update({ where: { id: payment.excursionBookingId }, data: updateData });
      if (payment.eventRequestId) await prisma.eventRequest.update({ where: { id: payment.eventRequestId }, data: updateData });
      if (payment.hotelBookingId) await prisma.hotelBooking.update({ where: { id: payment.hotelBookingId }, data: updateData });
      if (payment.musicBookingId) await prisma.musicBooking.update({ where: { id: payment.musicBookingId }, data: updateData });
      if (payment.equipmentRentalId) await prisma.equipmentRental.update({ where: { id: payment.equipmentRentalId }, data: updateData });
    }

    return ok(updated);
  } catch (e) {
    return serverError(e);
  }
}

// GET /api/payments/[id] — Détail d'un paiement
export async function GET(_req: NextRequest, { params }: Params) {
  // Sécurisation : Seul un admin doit voir les détails financiers
  try { await requireAdmin(); } catch { return forbidden(); }

  try {
    const { id } = await params;
    const payment = await prisma.payment.findUnique({ where: { id } });
    if (!payment) return notFound("Paiement introuvable");
    return ok(payment);
  } catch (e) {
    return serverError(e);
  }
}