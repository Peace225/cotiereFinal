import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, badRequest, serverError, forbidden } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth"; // Protection ajoutée
import { z } from "zod";

type Params = { params: Promise<{ id: string }> };

const statusSchema = z.object({
  status: z.enum(["CONFIRMED", "REFUSED", "CANCELLED", "COMPLETED"]),
  adminNotes: z.string().optional(),
  totalAmount: z.number().optional(),
});

export async function PATCH(req: NextRequest, { params }: Params) {
  // Sécurisation : Seul un admin peut modifier une réservation
  try { await requireAdmin(); } catch { return forbidden(); }

  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = statusSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.errors[0].message);
    
    const booking = await prisma.musicBooking.update({ where: { id }, data: parsed.data });
    return ok(booking);
  } catch (e) {
    return serverError(e);
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  // Sécurisation : Seul un admin peut supprimer une réservation
  try { await requireAdmin(); } catch { return forbidden(); }

  try {
    const { id } = await params;
    await prisma.musicBooking.delete({ where: { id } });
    return ok({ message: "Supprimé" });
  } catch (e) {
    return serverError(e);
  }
}