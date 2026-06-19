import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, notFound, badRequest, serverError, forbidden } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth";
import { z } from "zod";
import { sendExcursionStatusUpdate } from "@/lib/email";

type Params = { params: Promise<{ id: string }> };

const statusSchema = z.object({
  status: z.enum(["CONFIRMED", "REFUSED", "CANCELLED", "COMPLETED"]),
  adminNotes: z.string().optional(),
  voucherPdfUrl: z.string().url().optional(),
});

// GET /api/excursions/bookings/[id]
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const booking = await prisma.excursionBooking.findUnique({
      where: { id },
      include: {
        // ✅ CORRECTION ICI : Noms de relations exacts
        excursions: { include: { excursion_options: true, excursion_time_slots: true } },
        payments: true,
      },
    });
    if (!booking) return notFound("Réservation introuvable");
    return ok(booking);
  } catch (e) {
    return serverError(e);
  }
}

// PATCH /api/excursions/bookings/[id] — Mise à jour statut (admin)
export async function PATCH(req: NextRequest, { params }: Params) {
  try { await requireAdmin(); } catch { return forbidden(); }
  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = statusSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.errors[0].message);

    const booking = await prisma.excursionBooking.update({
      where: { id },
      data: parsed.data,
      // ✅ CORRECTION ICI : excursions au lieu de excursion
      include: { excursions: { select: { title: true } } },
    });

    // Email au client si changement de statut
    await sendExcursionStatusUpdate({
      ...booking,
      // ✅ CORRECTION ICI : excursions?.title pour éviter les crashs
      excursionTitle: booking.excursions?.title || "Excursion",
    }).catch(console.error);

    // Si annulation, libérer les places
    if (parsed.data.status === "CANCELLED" || parsed.data.status === "REFUSED") {
      const original = await prisma.excursionBooking.findUnique({ where: { id } });
      if (original) {
        const total = original.adultsCount + original.childrenCount;
        // Note: Si 'excursionAvailability' pose aussi problème plus tard, il faudra probablement le changer en 'excursion_availability'
        await prisma.excursion_availability.updateMany({
          where: {
            excursionId: original.excursionId,
            date: original.bookingDate,
            timeSlot: original.timeSlot,
          },
          data: { bookedSlots: { decrement: total } },
        });
      }
    }

    return ok(booking);
  } catch (e) {
    return serverError(e);
  }
}
