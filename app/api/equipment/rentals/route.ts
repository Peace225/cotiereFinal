import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, created, badRequest, serverError, forbidden, unauthorized } from "@/lib/api-response";
import { getSession } from "@/lib/auth";
import { z } from "zod";

export const dynamic = 'force-dynamic';

const rentalSchema = z.object({
  clientFirstName: z.string().min(1),
  clientLastName: z.string().min(1),
  clientPhone: z.string().min(6),
  clientEmail: z.string().email().optional().or(z.literal("")),
  startDate: z.string(),
  endDate: z.string(),
  deliveryAddress: z.string().optional(),
  selfPickup: z.boolean().default(false),
  withDelivery: z.boolean().default(false),
  withInstall: z.boolean().default(false),
  withInsurance: z.boolean().default(false),
  items: z.array(z.object({
    equipmentId: z.string(),
    quantity: z.number().int().positive(),
  })).min(1),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) return unauthorized();

    const user = session.user as any;
    const isAdmin = user.role === 'ADMIN' || user.isAdmin === true;
    if (!isAdmin) return forbidden();

    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get("limit")?? "50"), 500);
    const page = parseInt(searchParams.get("page")?? "1");

    const [rentals, total] = await Promise.all([
      prisma.equipmentRental.findMany({
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          equipment_rental_items: {
            include: {
              equipment: { select: { name: true } }
            }
          }
        },
      }),
      prisma.equipmentRental.count(),
    ]);

    // IMPORTANT: ton front attend { rentals: [...] }
    return ok({ rentals, total, page, limit });

  } catch (e) {
    console.error("[EQUIPMENT GET]", e);
    return serverError(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = rentalSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.errors[0].message);

    const session = await getSession();
    const d = parsed.data;
    const start = new Date(d.startDate);
    const end = new Date(d.endDate);
    const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));

    let equipmentTotal = 0;
    let depositAmount = 0;
    const itemsData: { equipmentId: string; quantity: number; pricePerDay: number; subtotal: number }[] = [];

    for (const item of d.items) {
      const eq = await prisma.equipment.findUnique({ where: { id: item.equipmentId } });
      if (!eq) return badRequest(`Équipement introuvable: ${item.equipmentId}`);
      const subtotal = item.quantity * eq.pricePerDay * days;
      equipmentTotal += subtotal;
      depositAmount += item.quantity * eq.depositValue;
      itemsData.push({ equipmentId: item.equipmentId, quantity: item.quantity, pricePerDay: eq.pricePerDay, subtotal });
    }

    let optionsTotal = 0;
    if (d.withDelivery) optionsTotal += 15000;
    if (d.withInstall) optionsTotal += 20000;
    const insuranceAmount = d.withInsurance? Math.ceil(equipmentTotal * 0.05) : 0;
    const totalAmount = equipmentTotal + optionsTotal + insuranceAmount;

    const rental = await prisma.$transaction(async (tx) => {
      const r = await tx.equipmentRental.create({
        data: {
          reference: `LOC-${Date.now().toString(36).toUpperCase()}`,
          userId: session?.user? (session.user as any).id : undefined,
          clientFirstName: d.clientFirstName,
          clientLastName: d.clientLastName,
          clientPhone: d.clientPhone,
          clientEmail: d.clientEmail || "non-fourni@cotiere.ci",
          startDate: start,
          endDate: end,
          daysCount: days,
          deliveryAddress: d.deliveryAddress,
          selfPickup: d.selfPickup,
          withDelivery: d.withDelivery,
          withInstall: d.withInstall,
          withInsurance: d.withInsurance,
          equipmentTotal,
          optionsTotal,
          insuranceAmount,
          depositAmount,
          totalAmount,
          equipment_rental_items: {
            create: itemsData
          },
        },
        include: { equipment_rental_items: true },
      });
      return r;
    });

    return created(rental);
  } catch (e) {
    console.error("[EQUIPMENT POST]", e);
    return serverError(e);
  }
}