import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, notFound, serverError } from "@/lib/api-response";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const booking = await prisma.excursionBooking.findUnique({
      where: { id },
      include: {
        excursions: {
          include: {
            excursion_options: true,
            excursion_time_slots: true,
          },
        },
        payments: true,
      },
    });
    if (!booking) return notFound("Réservation introuvable");
    return ok(booking);
  } catch (e) {
    return serverError(e);
  }
}