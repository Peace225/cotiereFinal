import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateReference } from '@/lib/reference';
import { getSession } from '@/lib/auth';
import { created, ok, serverError, forbidden, unauthorized } from '@/lib/api-response';
import { sendStudioBookingConfirmation, sendStudioBookingAdminNotif } from '@/lib/email';

export const dynamic = 'force-dynamic';

// POST /api/studio/bookings — Public
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const session = await getSession();

    const priceMap: Record<string, [number, number]> = {
      tournage: [150000, 300000],
      photo: [100000, 200000],
      streaming: [80000, 150000],
      drone: [100000, 200000],
      regie: [200000, 400000],
      montage: [50000, 150000],
      livraison: [10000, 20000],
    };

    const eventDate = body.eventDate? new Date(body.eventDate) : new Date();
    const services: string[] = body.services || [];

    let minTotal = 0, maxTotal = 0;
    for (const svc of services) {
      const range = priceMap[svc];
      if (range) {
        minTotal += range[0];
        maxTotal += range[1];
      }
    }

    const booking = await prisma.studioBooking.create({
      data: {
        reference: generateReference("STUDIO"),
        userId: (session?.user as any)?.id?? null,
        clientFirstName: body.clientFirstName?.trim() || "Client",
        clientLastName: body.clientLastName?.trim() || "Côtière",
        clientEmail: body.clientEmail?.trim() || "client@cotiere.ci",
        clientPhone: body.clientPhone?.trim() || "",
        clientWhatsapp: body.clientWhatsapp?.trim() || body.clientPhone?.trim() || null,
        clientAddress: body.clientAddress?.trim() || null,
        eventType: body.eventType || services[0] || "tournage",
        eventDate,
        eventTimeSlot: body.eventTimeSlot || body.timeSlot || "matin",
        eventLocation: body.eventLocation || body.location || "Abidjan",
        eventDuration: String(body.eventDuration || "2h"), // String d'après ton schema
        guestCount: body.guestCount? Number(body.guestCount) : null,
        description: body.description?.trim() || "",
        services,
        attachments: body.attachments?? [],
        estimatedPriceMin: minTotal || null,
        estimatedPriceMax: maxTotal || null,
        status: "PENDING",
        paymentStatus: "UNPAID",
      },
    });

    await Promise.allSettled([
      sendStudioBookingConfirmation(booking),
      sendStudioBookingAdminNotif(booking),
    ]);

    return created(booking);
  } catch (e) {
    console.error(e);
    return serverError(e);
  }
}

// GET /api/studio/bookings — Admin uniquement
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session?.user) {
      return unauthorized();
    }

    const user = session.user as any;
    const isAdmin = user.role === 'ADMIN' || user.isAdmin === true;

    if (!isAdmin) {
      return forbidden("Admin requis");
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page")?? "1");
    const limit = Math.min(parseInt(searchParams.get("limit")?? "50"), 500);

    const where = status? { status: status as any } : {};

    const [bookings, total] = await Promise.all([
      prisma.studioBooking.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.studioBooking.count({ where }),
    ]);

    return ok({ bookings, total, page, limit });

  } catch (e) {
    console.error("[STUDIO GET]", e);
    return serverError(e);
  }
}