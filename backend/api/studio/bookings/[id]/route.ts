import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { studioStatusSchema } from "@/lib/validations";
import { ok, badRequest, notFound, serverError } from "@/lib/api-response";
import { sendStudioStatusUpdate } from "@/lib/email";

type Params = { params: Promise<{ id: string }> };

// GET /api/studio/bookings/[id]
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const booking = await prisma.studioBooking.findUnique({
      where: { id },
      include: { payments: true, notifications: true },
    });
    if (!booking) return notFound("Réservation introuvable");
    return ok(booking);
  } catch (e) {
    return serverError(e);
  }
}

// PATCH /api/studio/bookings/[id] — Mise à jour statut (admin)
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = studioStatusSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.errors[0].message);

    const booking = await prisma.studioBooking.update({
      where: { id },
      data: parsed.data,
    });

    // Email au client si changement de statut
    await sendStudioStatusUpdate(booking).catch(console.error);

    return ok(booking);
  } catch (e) {
    return serverError(e);
  }
}

// DELETE /api/studio/bookings/[id] — Annulation
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await prisma.studioBooking.update({
      where: { id },
      data: { status: "CANCELLED" },
    });
    return ok({ message: "Réservation annulée" });
  } catch (e) {
    return serverError(e);
  }
}
