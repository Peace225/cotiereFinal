import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, serverError, forbidden } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

// GET /api/equipment/[id]
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const item = await prisma.equipment.findUnique({ where: { id } });
    if (!item) return ok(null);
    return ok(item);
  } catch (e) { return serverError(e); }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try { await requireAdmin(); } catch { return forbidden(); }
  try {
    const { id } = await params;
    const data = await req.json();
    const item = await prisma.equipment.update({ where: { id }, data });
    return ok(item);
  } catch (e) { return serverError(e); }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try { await requireAdmin(); } catch { return forbidden(); }
  try {
    const { id } = await params;
    await prisma.equipment.update({ where: { id }, data: { isActive: false } });
    return ok({ message: "Désactivé" });
  } catch (e) { return serverError(e); }
}
