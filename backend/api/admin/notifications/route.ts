import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, serverError } from "@/lib/api-response";

// GET — Toutes les notifications admin (non lues en premier)
export async function GET() {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: [{ isRead: "asc" }, { createdAt: "desc" }],
      take: 50,
      include: {
        studioBooking: { select: { clientFirstName: true, clientLastName: true } },
        eventRequest: { select: { clientFirstName: true, clientLastName: true } },
        excursionBooking: { select: { clientFirstName: true, clientLastName: true } },
        hotelBooking: { select: { clientFirstName: true, clientLastName: true } },
        musicBooking: { select: { clientFirstName: true, clientLastName: true } },
      },
    });
    const unreadCount = await prisma.notification.count({ where: { isRead: false } });
    return ok({ notifications, unreadCount });
  } catch (e) {
    return serverError(e);
  }
}

// PATCH — Marquer tout comme lu
export async function PATCH() {
  try {
    await prisma.notification.updateMany({ where: { isRead: false }, data: { isRead: true } });
    return ok({ message: "Tout marqué comme lu" });
  } catch (e) {
    return serverError(e);
  }
}
