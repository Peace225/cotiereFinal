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
    const contenu = await prisma.villeContenu.update({ where: { id }, data });
    return ok(contenu);
  } catch (e) { return serverError(e); }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try { await requireAdmin(); } catch { return forbidden(); }
  try {
    const { id } = await params;
    const item = await prisma.villeContenu.findUnique({ where: { id } });
    if (!item) return notFound("Contenu introuvable");
    await prisma.villeContenu.update({ where: { id }, data: { isActive: false } });
    return ok({ message: "Supprimé" });
  } catch (e) { return serverError(e); }
}
