import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { excursionBookingSchema } from "@/lib/validations";
import { generateReference } from "@/lib/reference";
import { getSession, requireAdmin } from "@/lib/auth";
import { created, badRequest, ok, serverError, forbidden } from "@/lib/api-response";
import { sendExcursionBookingConfirmation, sendExcursionBookingAdminNotif } from "@/lib/email";

// POST /api/excursions/bookings — Réserver une excursion
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = excursionBookingSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.errors[0].message);

    const data = parsed.data;
    const session = await getSession();

    // ✅ CORRECTION 1 : excursion_availability
    const availability = await prisma.excursion_availability.findUnique({
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

    // ✅ CORRECTION 2 : excursions et excursion_options
    const excursion = await prisma.excursions.findUnique({
      where: { id: data.excursionId },
      include: { excursion_options: true },
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

    // Créer la réservation dans une transaction
    const booking = await prisma.$transaction(async (tx) => {
      const b = await tx.excursionBooking.create({
        data: {
          // ✅ CORRECTION 3 : id, updatedAt et sécurité userId
          id: crypto.randomUUID(),
          updatedAt: new Date(),
          ...(session?.user ? { userId: (session.user as { id: string }).id } : {}),
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

      // ✅ CORRECTION 4 : excursion_availability
      if (availability) {
        await tx.excursion_availability.update({
          where: { id: availability.id },
          data: { bookedSlots: { increment: totalParticipants } },
        });
      }

      return b;
    });

    // Envoi des emails (non bloquant)
    await Promise.allSettled([
      sendExcursionBookingConfirmation({
        ...booking,
        excursionTitle: excursion.title,
      }),
      sendExcursionBookingAdminNotif({
        ...booking,
        excursionTitle: excursion.title,
      }),
    ]);

    return created(booking);
  } catch (e) {
    return serverError(e);
  }
}

// GET /api/excursions/bookings — Liste (admin)
export async function GET(req: NextRequest) {
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
        // ✅ CORRECTION 5 : excursions au lieu de excursion
        include: { excursions: { select: { title: true } } },
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

