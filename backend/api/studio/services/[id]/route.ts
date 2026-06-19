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
    const service = await prisma.studio_services.update({ where: { id }, data: body });
    return ok(service);
  } catch (e) {
    return serverError(e);
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try { await requireAdmin(); } catch { return forbidden(); }

  try {
    const { id } = await params;
    const service = await prisma.studio_services.findUnique({ where: { id } });
    if (!service) return notFound("Service introuvable");
    await prisma.studio_services.update({ where: { id }, data: { isActive: false } });
    return ok({ message: "Service supprimé" });
  } catch (e) {
    return serverError(e);
  }
}
