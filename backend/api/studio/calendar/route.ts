import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, serverError } from "@/lib/api-response";

// GET /api/studio/calendar?month=2026-04
// Retourne les dates déjà réservées (CONFIRMED ou PENDING) pour le mois donné
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month"); // format: "2026-04"

    let startDate: Date;
    let endDate: Date;

    if (month) {
      const [year, m] = month.split("-").map(Number);
      startDate = new Date(year, m - 1, 1);
      endDate = new Date(year, m, 0, 23, 59, 59);
    } else {
      const now = new Date();
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    }

    const bookings = await prisma.studioBooking.findMany({
      where: {
        eventDate: { gte: startDate, lte: endDate },
        status: { in: ["PENDING", "CONFIRMED"] },
      },
      select: {
        eventDate: true,
        eventTimeSlot: true,
        status: true,
      },
    });

    // Grouper par date
    const bookedDates: Record<string, string[]> = {};
    for (const b of bookings) {
      const dateKey = b.eventDate.toISOString().split("T")[0];
      if (!bookedDates[dateKey]) bookedDates[dateKey] = [];
      bookedDates[dateKey].push(b.eventTimeSlot);
    }

    return ok({ bookedDates });
  } catch (e) {
    return serverError(e);
  }
}
