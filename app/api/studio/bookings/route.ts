import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateReference } from '@/lib/reference';
import { getSession, requireAdmin } from '@/lib/auth';
import { created, ok, serverError, forbidden } from '@/lib/api-response';
import { sendStudioBookingConfirmation, sendStudioBookingAdminNotif } from '@/lib/email';

export const dynamic = 'force-dynamic';

// POST /api/studio/bookings — Créer une réservation
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

    const eventDate = body.eventDate ? new Date(body.eventDate) : new Date();
    const services = body.services || [];

    let minTotal = 0, maxTotal = 0;
    for (const svc of services) {
      const range = priceMap[svc];
      if (range) {
        minTotal += range[0];
        maxTotal += range[1];
      }
    }

    const bookingData: any = {
      reference: generateReference("STUDIO"),
      clientFirstName: body.clientFirstName,
      clientLastName: body.clientLastName,
      clientEmail: body.clientEmail,
      clientPhone: body.clientPhone,
      services: services,
      eventDate: eventDate,
      description: body.description,
      estimatedPriceMin: minTotal,
      estimatedPriceMax: maxTotal,
      attachments: body.attachments ?? [],
      ...(session?.user && { userId: (session.user as { id: string }).id }),
    };

    const booking = await prisma.studioBooking.create({
      data: bookingData,
    });

    await Promise.allSettled([
      sendStudioBookingConfirmation(booking),
      sendStudioBookingAdminNotif(booking),
    ]);

    return created(booking);
  } catch (e) {
    return serverError(e);
  }
}

// GET /api/studio/bookings — Liste (admin uniquement)
export async function GET(req: NextRequest) {
  try {
    await requireAdmin(); 
  } catch (e) {
    return forbidden();
  }
  
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "500");

    const where = status ? { status: status as any } : {};

    const [bookings, total] = await Promise.all([
      prisma.studioBooking.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.studioBooking.count({ where }),
    ]);

    // Renvoi propre des données avec gestion des cookies pour le front
    const response = NextResponse.json({ bookings, total, page, limit });
    
    // Assure-toi que les credentials/cookies sont bien passés à l'appelant
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    return response;
    
  } catch (e) {
    return serverError(e);
  }
}