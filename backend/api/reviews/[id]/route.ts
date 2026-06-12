import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, forbidden, serverError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth"; // Protection ajoutée

type Params = { params: Promise<{ id: string }> };

// PATCH — Approuver/refuser (admin)
export async function PATCH(req: NextRequest, { params }: Params) {
  // Sécurisation : Seul un admin peut modifier le statut d'un avis
  try { await requireAdmin(); } catch { return forbidden(); }

  try {
    const { id } = await params;
    const { isApproved } = await req.json();
    const review = await prisma.review.update({ where: { id }, data: { isApproved } });
    return ok(review);
  } catch (e) { return serverError(e); }
}

// DELETE — Suppression (admin)
export async function DELETE(_req: NextRequest, { params }: Params) {
  // Sécurisation : Seul un admin peut supprimer un avis
  try { await requireAdmin(); } catch { return forbidden(); }

  try {
    const { id } = await params;
    await prisma.review.delete({ where: { id } });
    return ok({ message: "Avis supprimé" });
  } catch (e) { return serverError(e); }
}