import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, serverError } from "@/lib/api-response";

// GET /api/excursions/[id]/availability?month=2026-04
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month");

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

    // Récupérer l'excursion pour avoir maxParticipants
    const excursion = await prisma.excursion.findUnique({
      where: { id },
      select: { maxParticipants: true },
    });

    if (!excursion) return ok({ bookedDates: {} });

    // Réservations confirmées ou en attente sur ce mois
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

    // Grouper par date : total participants par date
    const bookedDates: Record<string, { count: number; slots: string[] }> = {};
    for (const b of bookings) {
      const dateKey = b.bookingDate.toISOString().split("T")[0];
      if (!bookedDates[dateKey]) bookedDates[dateKey] = { count: 0, slots: [] };
      bookedDates[dateKey].count += b.adultsCount + b.childrenCount;
      if (b.timeSlot && !bookedDates[dateKey].slots.includes(b.timeSlot)) {
        bookedDates[dateKey].slots.push(b.timeSlot);
      }
    }

    // Convertir en format attendu par le calendrier
    // On simule 4 "slots" basés sur le taux de remplissage
    const result: Record<string, string[]> = {};
    for (const [date, data] of Object.entries(bookedDates)) {
      const fillRate = data.count / excursion.maxParticipants;
      if (fillRate >= 1) {
        // Complet — 4 slots fictifs
        result[date] = ["s1", "s2", "s3", "s4"];
      } else if (fillRate >= 0.5) {
        // Partiel — 2 slots fictifs
        result[date] = ["s1", "s2"];
      } else if (fillRate > 0) {
        // Peu rempli — 1 slot fictif
        result[date] = ["s1"];
      }
    }

    return ok({ bookedDates: result, maxParticipants: excursion.maxParticipants });
  } catch (e) {
    return serverError(e);
  }
}
