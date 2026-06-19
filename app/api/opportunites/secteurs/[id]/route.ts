import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, notFound, forbidden, serverError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

// PATCH /api/opportunites/secteurs/[id] — Admin
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await requireAdmin();
  } catch {
    return forbidden();
  }

  try {
    const { id } = await params;
    const body = await req.json();
    // ✅ CORRECTION : Utilisation de opportunite_secteurs
    const secteur = await prisma.opportunite_secteurs.update({
      where: { id },
      data: body,
    });
    return ok(secteur);
  } catch (e) {
    return serverError(e);
  }
}

// DELETE /api/opportunites/secteurs/[id] — Admin (désactive)
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await requireAdmin();
  } catch {
    return forbidden();
  }

  try {
    const { id } = await params;
    // ✅ CORRECTION : Utilisation de opportunite_secteurs
    const secteur = await prisma.opportunite_secteurs.findUnique({ where: { id } });
    if (!secteur) return notFound("Secteur introuvable");

    // ✅ CORRECTION : Utilisation de opportunite_secteurs
    await prisma.opportunite_secteurs.update({
      where: { id },
      data: { isActive: false },
    });
    return ok({ message: "Secteur supprimé" });
  } catch (e) {
    return serverError(e);
  }
}