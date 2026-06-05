import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, badRequest, serverError, forbidden } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth";

// POST /api/admin/devis — Sauvegarder l'URL du devis PDF sur une réservation
export async function POST(req: NextRequest) {
  try { await requireAdmin(); } catch { return forbidden(); }
  try {
    const { type, id, quotePdfUrl, totalAmount, adminNotes } = await req.json();
    if (!type || !id) return badRequest("type et id requis");

    const data: any = {};
    if (quotePdfUrl) data.quotePdfUrl = quotePdfUrl;
    if (totalAmount) data.totalAmount = totalAmount;
    if (adminNotes) data.adminNotes = adminNotes;

    if (type === "studio") {
      await prisma.studioBooking.update({ where: { id }, data });
    } else if (type === "event") {
      await prisma.eventRequest.update({ where: { id }, data });
    } else if (type === "excursion") {
      await prisma.excursionBooking.update({ where: { id }, data });
    }

    return ok({ message: "Devis mis a jour" });
  } catch (e) {
    return serverError(e);
  }
}
