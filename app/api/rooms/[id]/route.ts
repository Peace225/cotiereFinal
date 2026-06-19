import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, notFound, badRequest, serverError, forbidden } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth";
import { z } from "zod";

type Params = { params: Promise<{ id: string }> };

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  type: z.string().optional(),
  capacity: z.number().int().positive().optional(),
  pricePerNight: z.number().int().positive().optional(),
  amenities: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

// GET /api/rooms/[id]
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    // ✅ CORRECTION : Utilisation de rooms au pluriel
    const room = await prisma.rooms.findUnique({ where: { id } });
    if (!room) return notFound("Chambre introuvable");
    return ok(room);
  } catch (e) {
    return serverError(e);
  }
}

// PATCH /api/rooms/[id]
export async function PATCH(req: NextRequest, { params }: Params) {
  try { await requireAdmin(); } catch { return forbidden(); }
  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.errors[0].message);

    // ✅ CORRECTION : Utilisation de rooms au pluriel
    const room = await prisma.rooms.update({ where: { id }, data: parsed.data });
    return ok(room);
  } catch (e) {
    return serverError(e);
  }
}

// DELETE /api/rooms/[id]
export async function DELETE(_req: NextRequest, { params }: Params) {
  try { await requireAdmin(); } catch { return forbidden(); }
  try {
    const { id } = await params;
    // ✅ CORRECTION : Utilisation de rooms au pluriel
    await prisma.rooms.update({ where: { id }, data: { isActive: false } });
    return ok({ message: "Chambre désactivée" });
  } catch (e) {
    return serverError(e);
  }
}