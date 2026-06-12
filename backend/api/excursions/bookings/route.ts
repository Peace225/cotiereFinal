import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { excursionBookingSchema } from "@/lib/validations";
import { generateReference } from "@/lib/reference";
import { created, badRequest, ok, serverError, forbidden } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth"; // Protection ajoutée
import { sendExcursionBookingConfirmation, sendExcursionBookingAdminNotif } from "@/lib/email";

// POST /api/excursions/bookings — Réserver une excursion (Public)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = excursionBookingSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.errors[0].message);

    const data = parsed.data;

    // Vérifier disponibilité
    const availability = await prisma.excursionAvailability.findUnique({
      where: {
        excursionId_date_timeSlot: {
          excursionId: data.excursionId,
          date: new Date(data.bookingDate),
          timeSlot: data.timeSlot,
        },
      },
    });

    const totalParticipants = data.adultsCount + data.childrenCount;

    if (availability) {
      if (availability.isBlocked)
        return badRequest("Cette date est bloquée");
      if (availability.bookedSlots + totalParticipants > availability.totalSlots)
        return badRequest("Plus assez de places disponibles");
    }

    // Récupérer les tarifs
    const excursion = await prisma.excursion.findUnique({
      where: { id: data.excursionId },
      include: { options: true },
    });
    if (!excursion) return badRequest("Excursion introuvable");

    const adultsTotal = data.adultsCount * excursion.priceAdult;
    const childrenTotal = data.childrenCount * excursion.priceChild;

    let optionsTotal = 0;
    if (data.selectedOptions) {
      for (const opt of data.selectedOptions) {
        optionsTotal += opt.pricePerPerson * opt.quantity;
      }
    }

    const totalAmount = adultsTotal + childrenTotal + optionsTotal;

    // Créer la réservation
    const booking = await prisma.$transaction(async (tx) => {
      const b = await tx.excursionBooking.create({
        data: {
          reference: generateReference("TOUR"),
          excursionId: data.excursionId,
          clientFirstName: data.clientFirstName,
          clientLastName: data.clientLastName,
          clientEmail: data.clientEmail,
          clientPhone: data.clientPhone,
          clientNationality: data.clientNationality,
          bookingDate: new Date(data.bookingDate),
          timeSlot: data.timeSlot,
          guideLanguage: data.guideLanguage,
          adultsCount: data.adultsCount,
          childrenCount: data.childrenCount,
          specialRequests: data.specialRequests,
          conditionsAccepted: data.conditionsAccepted,
          selectedOptions: data.selectedOptions ?? [],
          adultsTotal,
          childrenTotal,
          optionsTotal,
          totalAmount,
          depositAmount: Math.ceil(totalAmount * 0.3),
        },
      });

      if (availability) {
        await tx.excursionAvailability.update({
          where: { id: availability.id },
          data: { bookedSlots: { increment: totalParticipants } },
        });
      }
      return b;
    });

    await Promise.allSettled([
      sendExcursionBookingConfirmation({ ...booking, excursionTitle: excursion.title }),
      sendExcursionBookingAdminNotif({ ...booking, excursionTitle: excursion.title }),
    ]);

    return created(booking);
  } catch (e) {
    return serverError(e);
  }
}

// GET /api/excursions/bookings — Liste (Admin uniquement)
export async function GET(req: NextRequest) {
  // Sécurisation : Seuls les admins peuvent accéder à la liste des réservations
  try { await requireAdmin(); } catch { return forbidden(); }

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "20");

    const where = status ? { status: status as never } : {};

    const [bookings, total] = await Promise.all([
      prisma.excursionBooking.findMany({
        where,
        include: { excursion: { select: { title: true } } },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.excursionBooking.count({ where }),
    ]);

    return ok({ bookings, total, page, limit });
  } catch (e) {
    return serverError(e);
  }
}