import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, forbidden, badRequest, serverError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth"; // Protection ajoutée

// POST /api/admin/devis — Sauvegarder l'URL du devis PDF sur une réservation
export async function POST(req: NextRequest) {
  // Sécurisation : Seul un admin peut mettre à jour un devis
  try { await requireAdmin(); } catch { return forbidden(); }

  try {
    const { type, id, quotePdfUrl, totalAmount, adminNotes } = await req.json();
    if (!type || !id) return badRequest("type et id requis");

    const data: any = {};
    if (quotePdfUrl !== undefined) data.quotePdfUrl = quotePdfUrl;
    if (totalAmount !== undefined) data.totalAmount = totalAmount;
    if (adminNotes !== undefined) data.adminNotes = adminNotes;

    if (type === "studio") {
      await prisma.studioBooking.update({ where: { id }, data });
    } else if (type === "event") {
      await prisma.eventRequest.update({ where: { id }, data });
    } else if (type === "excursion") {
      await prisma.excursionBooking.update({ where: { id }, data });
    } else {
      return badRequest("Type de réservation invalide");
    }

    return ok({ message: "Devis mis à jour" });
  } catch (e) {
    return serverError(e);
  }
}