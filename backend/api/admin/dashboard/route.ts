import { forbidden, ok, serverError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/admin/dashboard â€” Statistiques globales
export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return forbidden();
  }

  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      studioTotal, studioPending, studioMonth,
      excursionTotal, excursionPending, excursionMonth,
      eventTotal, eventPending, eventMonth,
      recentStudio, recentExcursions, recentEvents,
    ] = await Promise.all([
      // Studio
      prisma.studioBooking.count(),
      prisma.studioBooking.count({ where: { status: "PENDING" } }),
      prisma.studioBooking.count({ where: { createdAt: { gte: startOfMonth } } }),
      // Excursions
      prisma.excursionBooking.count(),
      prisma.excursionBooking.count({ where: { status: "PENDING" } }),
      prisma.excursionBooking.count({ where: { createdAt: { gte: startOfMonth } } }),
      // Events
      prisma.eventRequest.count(),
      prisma.eventRequest.count({ where: { status: "PENDING" } }),
      prisma.eventRequest.count({ where: { createdAt: { gte: startOfMonth } } }),
      // RÃ©cents
      prisma.studioBooking.findMany({
        orderBy: { createdAt: "desc" }, take: 5,
        select: { id: true, reference: true, clientFirstName: true, clientLastName: true, eventDate: true, status: true, createdAt: true },
      }),
      // âœ… CORRIGÃ‰ : Remplacement de 'excursion' par 'excursions'
      prisma.excursionBooking.findMany({
        orderBy: { createdAt: "desc" }, take: 5,
        include: { excursions: { select: { title: true } } },
      }),
      prisma.eventRequest.findMany({
        orderBy: { createdAt: "desc" }, take: 5,
        select: { id: true, reference: true, clientFirstName: true, clientLastName: true, eventDate: true, status: true, createdAt: true },
      }),
    ]);

    // CA total des paiements confirmÃ©s
    const payments = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: { in: ["PARTIAL", "PAID"] } },
    });

    return ok({
      stats: {
        studio: { total: studioTotal, pending: studioPending, thisMonth: studioMonth },
        excursions: { total: excursionTotal, pending: excursionPending, thisMonth: excursionMonth },
        events: { total: eventTotal, pending: eventPending, thisMonth: eventMonth },
        totalRevenue: payments._sum.amount ?? 0,
      },
      recent: {
        studio: recentStudio,
        excursions: recentExcursions,
        events: recentEvents,
      },
    });
  } catch (e) {
    return serverError(e);
  }
}

