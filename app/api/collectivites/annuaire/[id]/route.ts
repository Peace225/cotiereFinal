import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, notFound, forbidden, serverError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  try { await requireAdmin(); } catch { return forbidden(); }
  try {
    const { id } = await params;
    const data = await req.json();
    // ✅ CORRECTION : collectivite_annuaire
    const institution = await prisma.collectivite_annuaire.update({ where: { id }, data });
    return ok(institution);
  } catch (e) { return serverError(e); }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try { await requireAdmin(); } catch { return forbidden(); }
  try {
    const { id } = await params;
    // ✅ CORRECTION : collectivite_annuaire
    const item = await prisma.collectivite_annuaire.findUnique({ where: { id } });
    if (!item) return notFound("Institution introuvable");
    // ✅ CORRECTION : collectivite_annuaire
    await prisma.collectivite_annuaire.update({ where: { id }, data: { isActive: false } });
    return ok({ message: "Supprimé" });
  } catch (e) { return serverError(e); }
}