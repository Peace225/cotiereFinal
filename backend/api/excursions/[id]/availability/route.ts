import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, serverError } from "@/lib/api-response";

type Params = { params: Promise<{ id: string }> };

export async function GET(
  req: NextRequest,
  { params }: Params
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month");

    // Calcul des dates de début et fin de mois
    const now = new Date();
    const [year, m] = month 
      ? month.split("-").map(Number) 
      : [now.getFullYear(), now.getMonth() + 1];
    
    const startDate = new Date(year, m - 1, 1);
    const endDate = new Date(year, m, 0, 23, 59, 59);

    const excursion = await prisma.excursions.findUnique({
      where: { id },
      select: { maxParticipants: true },
    });

    if (!excursion) return ok({ bookedDates: {}, maxParticipants: 0 });

    const bookings = await prisma.excursionBooking.findMany({
      where: {
        excursionId: id,
        bookingDate: { gte: startDate, lte: endDate },
        status: { in: ["PENDING", "CONFIRMED"] },
      },
      select: {
        bookingDate: true,
        adultsCount: true,
        childrenCount: true,
        timeSlot: true,
      },
    });

    // Agrégation des participants par date
    const bookedDates: Record<string, number> = {};
    for (const b of bookings) {
      const dateKey = b.bookingDate.toISOString().split("T")[0];
      bookedDates[dateKey] = (bookedDates[dateKey] || 0) + b.adultsCount + b.childrenCount;
    }

    // Conversion en slots fictifs pour le front-end
    const result: Record<string, string[]> = {};
    for (const [date, count] of Object.entries(bookedDates)) {
      const fillRate = count / excursion.maxParticipants;
      if (fillRate >= 1) result[date] = ["s1", "s2", "s3", "s4"];
      else if (fillRate >= 0.5) result[date] = ["s1", "s2"];
      else if (fillRate > 0) result[date] = ["s1"];
    }

    return ok({ bookedDates: result, maxParticipants: excursion.maxParticipants });
  } catch (e) {
    return serverError(e);
  }
}