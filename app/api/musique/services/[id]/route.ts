import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, notFound, forbidden, serverError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

// PATCH /api/musique/services/[id] — Admin
export async function PATCH(req: NextRequest, { params }: Params) {
  try { await requireAdmin(); } catch { return forbidden(); }

  try {
    const { id } = await params;
    const body = await req.json();
    // ✅ CORRECTION : Utilisation de musique_services
    const service = await prisma.musique_services.update({ where: { id }, data: body });
    return ok(service);
  } catch (e) {
    return serverError(e);
  }
}

// DELETE /api/musique/services/[id] — Admin (désactive)
export async function DELETE(_req: NextRequest, { params }: Params) {
  try { await requireAdmin(); } catch { return forbidden(); }

  try {
    const { id } = await params;
    // ✅ CORRECTION : Utilisation de musique_services
    const service = await prisma.musique_services.findUnique({ where: { id } });
    if (!service) return notFound("Service introuvable");
    
    // ✅ CORRECTION : Utilisation de musique_services
    await prisma.musique_services.update({ where: { id }, data: { isActive: false } });
    return ok({ message: "Service supprimé" });
  } catch (e) {
    return serverError(e);
  }
}