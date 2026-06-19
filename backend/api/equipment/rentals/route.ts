import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, created, badRequest, serverError, forbidden } from "@/lib/api-response";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth"; // Utilisation de votre sécurité centralisée

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

export async function GET() {
  // Sécurisation : Seuls les admins peuvent voir la liste des locations
  try { await requireAdmin(); } catch { return forbidden(); }

  try {
    const rentals = await prisma.equipmentRental.findMany({
      orderBy: { createdAt: "desc" },
      // ✅ CORRIGÉ : Remplacement de 'equipmentRentalItems' par 'equipment_rental_items'
      include: { equipment_rental_items: { include: { equipment: { select: { name: true } } } } },
    });
    return ok(rentals);
  } catch (e) { return serverError(e); }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = rentalSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.errors[0].message);

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
    const insuranceAmount = d.withInsurance ? Math.ceil(equipmentTotal * 0.05) : 0;
    const totalAmount = equipmentTotal + optionsTotal + insuranceAmount;

    const rental = await prisma.$transaction(async (tx) => {
      const r = await tx.equipmentRental.create({
        data: {
          reference: `LOC-${Date.now().toString(36).toUpperCase()}`,
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
          // ✅ CORRIGÉ : Remplacement de 'items' par 'equipment_rental_items' pour correspondre au modèle Prisma
          equipment_rental_items: { create: itemsData },
        },
        include: { equipment_rental_items: true },
      });
      return r;
    });

    return created(rental);
  } catch (e) { return serverError(e); }
}