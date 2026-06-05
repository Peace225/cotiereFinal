import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, notFound, badRequest, serverError } from "@/lib/api-response";
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

// PATCH /api/rooms/[id]
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.errors[0].message);

    const room = await prisma.room.update({ where: { id }, data: parsed.data });
    return ok(room);
  } catch (e) {
    return serverError(e);
  }
}

// DELETE /api/rooms/[id]
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await prisma.room.update({ where: { id }, data: { isActive: false } });
    return ok({ message: "Chambre désactivée" });
  } catch (e) {
    return serverError(e);
  }
}
