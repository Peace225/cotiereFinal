import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, forbidden, serverError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth"; // Protection ajoutée

// GET — Toutes les notifications admin (non lues en premier)
export async function GET() {
  // Sécurisation : Seul un admin peut consulter les notifications
  try { await requireAdmin(); } catch { return forbidden(); }

  try {
    const notifications = await prisma.notification.findMany({
      orderBy: [{ isRead: "asc" }, { createdAt: "desc" }],
      take: 50,
      include: {
        // ✅ CORRIGÉ : Noms de relations mis à jour selon le typage Prisma (snake_case)
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

// PATCH — Marquer tout comme lu
export async function PATCH() {
  // Sécurisation : Seul un admin peut marquer les notifications comme lues
  try { await requireAdmin(); } catch { return forbidden(); }

  try {
    await prisma.notification.updateMany({ where: { isRead: false }, data: { isRead: true } });
    return ok({ message: "Tout marqué comme lu" });
  } catch (e) {
    return serverError(e);
  }
}