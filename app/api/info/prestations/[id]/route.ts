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
    const prestation = await prisma.info_prestations.update({ where: { id }, data: body });
    return ok(prestation);
  } catch (e) {
    return serverError(e);
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try { await requireAdmin(); } catch { return forbidden(); }

  try {
    const { id } = await params;
    const prestation = await prisma.info_prestations.findUnique({ where: { id } });
    if (!prestation) return notFound("Prestation introuvable");
    await prisma.info_prestations.update({ where: { id }, data: { isActive: false } });
    return ok({ message: "Prestation supprimÃ©e" });
  } catch (e) {
    return serverError(e);
  }
}

