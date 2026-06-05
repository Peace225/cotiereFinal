import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, notFound, badRequest, serverError } from "@/lib/api-response";
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
        excursion: { include: { options: true, timeSlots: true } },
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
  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = statusSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.errors[0].message);

    const booking = await prisma.excursionBooking.update({
      where: { id },
      data: parsed.data,
      include: { excursion: { select: { title: true } } },
    });

    // Email au client si changement de statut
    await sendExcursionStatusUpdate({
      ...booking,
      excursionTitle: booking.excursion.title,
    }).catch(console.error);

    // Si annulation, libérer les places
    if (parsed.data.status === "CANCELLED" || parsed.data.status === "REFUSED") {
      const original = await prisma.excursionBooking.findUnique({ where: { id } });
      if (original) {
        const total = original.adultsCount + original.childrenCount;
        await prisma.excursionAvailability.updateMany({
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
