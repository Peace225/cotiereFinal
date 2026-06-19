import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { studioBookingSchema } from "@/lib/validations";
import { generateReference } from "@/lib/reference";
import { created, ok, badRequest, forbidden, serverError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth"; // Protection ajoutÃ©e
import { sendStudioBookingConfirmation, sendStudioBookingAdminNotif } from "@/lib/email";

// POST /api/studio/bookings â€” CrÃ©er une rÃ©servation (Public)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = studioBookingSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.errors[0].message);

    const data = parsed.data;

    // Estimation tarifaire indicative
    const priceMap: Record<string, [number, number]> = {
      tournage: [150000, 300000],
      photo: [100000, 200000],
      streaming: [80000, 150000],
      drone: [100000, 200000],
      regie: [200000, 400000],
      montage: [50000, 150000],
      livraison: [10000, 20000],
    };

    let minTotal = 0, maxTotal = 0;
    for (const svc of data.services) {
      const range = priceMap[svc];
      if (range) { minTotal += range[0]; maxTotal += range[1]; }
    }

    const booking = await prisma.studioBooking.create({
      data: {
        reference: generateReference("STUDIO"),
        ...data,
        eventDate: new Date(data.eventDate),
        attachments: data.attachments ?? [],
        estimatedPriceMin: minTotal,
        estimatedPriceMax: maxTotal,
      },
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

// GET /api/studio/bookings â€” Liste (Admin uniquement)
export async function GET(req: NextRequest) {
  // SÃ©curisation : Seuls les admins peuvent voir les rÃ©servations
  try { await requireAdmin(); } catch { return forbidden(); }

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "500");

    const where = status ? { status: status as never } : {};

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
    return serverError(e);
  }
}

