import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, badRequest, forbidden, serverError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth";
import { z } from "zod";

const blockSchema = z.object({
  serviceType: z.enum(["room", "excursion"]),
  serviceId: z.string(),
  date: z.string(),
  reason: z.string().optional(),
});

// GET /api/availability?serviceType=room&serviceId=xxx
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const serviceType = searchParams.get("serviceType");
    const serviceId = searchParams.get("serviceId");

    if (serviceType === "room" && serviceId) {
      const blocked = await prisma.room_availability.findMany({
        where: { roomId: serviceId, isBlocked: true },
        orderBy: { date: "asc" },
      });
      return ok(blocked);
    }

    if (serviceType === "excursion" && serviceId) {
      const blocked = await prisma.excursion_availability.findMany({
        where: { excursionId: serviceId, isBlocked: true },
        orderBy: { date: "asc" },
      });
      return ok(blocked);
    }

    // Tous les blocages
    const [rooms, excursions] = await Promise.all([
      prisma.room_availability.findMany({ where: { isBlocked: true }, include: { rooms: { select: { name: true } } }, orderBy: { date: "asc" } }),
      prisma.excursion_availability.findMany({ where: { isBlocked: true }, orderBy: { date: "asc" } }),
    ]);
    return ok({ rooms, excursions });
  } catch (e) {
    return serverError(e);
  }
}

// POST /api/availability — Bloquer une date (admin uniquement)
export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return forbidden();
  }

  try {
    const body = await req.json();
    const parsed = blockSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.errors[0].message);
    const { serviceType, serviceId, date, reason } = parsed.data;
    const d = new Date(date);

    if (serviceType === "room") {
      const result = await prisma.room_availability.upsert({
        where: { roomId_date: { roomId: serviceId, date: d } },
        update: { isBlocked: true, price: null },
        create: { id: crypto.randomUUID(), roomId: serviceId, date: d, isBlocked: true },
      });
      return ok(result);
    }

    const result = await prisma.excursion_availability.upsert({
      where: { excursionId_date_timeSlot: { excursionId: serviceId, date: d, timeSlot: "all" } },
      update: { isBlocked: true, blockReason: reason },
      // ✅ CORRECTION ICI : Ajout de l'ID obligatoire pour Prisma
      create: { id: crypto.randomUUID(), excursionId: serviceId, date: d, timeSlot: "all", totalSlots: 0, isBlocked: true, blockReason: reason },
    });
    return ok(result);
  } catch (e) {
    return serverError(e);
  }
}

// DELETE /api/availability — Débloquer une date (admin uniquement)
export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return forbidden();
  }

  try {
    const body = await req.json();
    const { serviceType, id } = body;

    if (serviceType === "room") {
      await prisma.room_availability.delete({ where: { id } });
    } else {
      await prisma.excursion_availability.delete({ where: { id } });
    }
    return ok({ message: "Date débloquée" });
  } catch (e) {
    return serverError(e);
  }
}

