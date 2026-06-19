import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, serverError } from "@/lib/api-response";

// GET â€” Toutes les notifications admin (non lues en premier)
export async function GET() {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: [{ isRead: "asc" }, { createdAt: "desc" }],
      take: 50,
      include: {
        // âœ… CORRIGÃ‰ : Utilisation des noms de relations exacts dÃ©finis dans le schÃ©ma Prisma
        studio_bookings: { select: { clientFirstName: true, clientLastName: true } },
        event_requests: { select: { clientFirstName: true, clientLastName: true } },
        excursion_bookings: { select: { clientFirstName: true, clientLastName: true } },
        hotel_bookings: { select: { clientFirstName: true, clientLastName: true } },
        music_bookings: { select: { clientFirstName: true, clientLastName: true } },
      },
    });
    const unreadCount = await prisma.notification.count({ where: { isRead: false } });
    return ok({ notifications, unreadCount });
  } catch (e) {
    return serverError(e);
  }
}

// PATCH â€” Marquer tout comme lu
export async function PATCH() {
  try {
    await prisma.notification.updateMany({ where: { isRead: false }, data: { isRead: true } });
    return ok({ message: "Tout marquÃ© comme lu" });
  } catch (e) {
    return serverError(e);
  }
}

