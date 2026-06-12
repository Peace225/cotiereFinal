import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, forbidden, serverError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth"; // Protection ajoutée

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  // Sécurisation : Seul un admin peut modifier un équipement
  try { await requireAdmin(); } catch { return forbidden(); }

  try {
    const { id } = await params;
    const data = await req.json();
    const item = await prisma.equipment.update({ where: { id }, data });
    return ok(item);
  } catch (e) { return serverError(e); }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  // Sécurisation : Seul un admin peut désactiver un équipement
  try { await requireAdmin(); } catch { return forbidden(); }

  try {
    const { id } = await params;
    await prisma.equipment.update({ where: { id }, data: { isActive: false } });
    return ok({ message: "Désactivé" });
  } catch (e) { return serverError(e); }
}