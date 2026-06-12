import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, forbidden, serverError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth"; // Protection ajoutée

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  // Sécurisation : Seul un admin peut modifier une location
  try { await requireAdmin(); } catch { return forbidden(); }

  try {
    const { id } = await params;
    const data = await req.json();
    const rental = await prisma.equipmentRental.update({ where: { id }, data });
    return ok(rental);
  } catch (e) { return serverError(e); }
}