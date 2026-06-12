import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, forbidden, serverError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth"; // Protection ajoutée

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  // Sécurisation : Seul un admin peut modifier une demande
  try { await requireAdmin(); } catch { return forbidden(); }

  try {
    const { id } = await params;
    const data = await req.json();
    const request = await prisma.mediaAdRequest.update({ where: { id }, data });
    return ok(request);
  } catch (e) { return serverError(e); }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  // Sécurisation : Seul un admin peut supprimer une demande
  try { await requireAdmin(); } catch { return forbidden(); }

  try {
    const { id } = await params;
    await prisma.mediaAdRequest.delete({ where: { id } });
    return ok({ message: "Supprimé" });
  } catch (e) { return serverError(e); }
}