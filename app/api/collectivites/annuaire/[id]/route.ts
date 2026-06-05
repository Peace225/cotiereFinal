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
    const institution = await prisma.collectiviteAnnuaire.update({ where: { id }, data });
    return ok(institution);
  } catch (e) { return serverError(e); }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try { await requireAdmin(); } catch { return forbidden(); }
  try {
    const { id } = await params;
    const item = await prisma.collectiviteAnnuaire.findUnique({ where: { id } });
    if (!item) return notFound("Institution introuvable");
    await prisma.collectiviteAnnuaire.update({ where: { id }, data: { isActive: false } });
    return ok({ message: "Supprimé" });
  } catch (e) { return serverError(e); }
}
