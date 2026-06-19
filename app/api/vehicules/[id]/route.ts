import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, notFound, forbidden, serverError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  try { await requireAdmin(); } catch { return forbidden(); }

  try {
    const { id } = await params;
    const body = await req.json();
    // ✅ CORRECTION : Utilisation de vehicules au pluriel
    const vehicule = await prisma.vehicules.update({ where: { id }, data: body });
    return ok(vehicule);
  } catch (e) {
    return serverError(e);
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try { await requireAdmin(); } catch { return forbidden(); }

  try {
    const { id } = await params;
    // ✅ CORRECTION : Utilisation de vehicules au pluriel
    const vehicule = await prisma.vehicules.findUnique({ where: { id } });
    if (!vehicule) return notFound("Véhicule introuvable");
    // ✅ CORRECTION : Utilisation de vehicules au pluriel
    await prisma.vehicules.update({ where: { id }, data: { isActive: false } });
    return ok({ message: "Véhicule supprimé" });
  } catch (e) {
    return serverError(e);
  }
}