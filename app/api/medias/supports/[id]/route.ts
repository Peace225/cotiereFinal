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
    // ✅ CORRECTION : Utilisation de media_supports
    const support = await prisma.media_supports.update({ where: { id }, data: body });
    return ok(support);
  } catch (e) {
    return serverError(e);
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try { await requireAdmin(); } catch { return forbidden(); }

  try {
    const { id } = await params;
    // ✅ CORRECTION : Utilisation de media_supports
    const support = await prisma.media_supports.findUnique({ where: { id } });
    if (!support) return notFound("Support introuvable");
    
    // ✅ CORRECTION : Utilisation de media_supports
    await prisma.media_supports.update({ where: { id }, data: { isActive: false } });
    return ok({ message: "Support supprimé" });
  } catch (e) {
    return serverError(e);
  }
}