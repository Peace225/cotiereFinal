import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, notFound, forbidden, serverError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

// GET /api/excursions/[id]
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const excursion = await prisma.excursion.findUnique({
      where: { id },
      include: {
        options: { where: { isActive: true } },
        timeSlots: { where: { isActive: true } },
        reviews: {
          where: { isApproved: true },
          include: { user: { select: { firstName: true, lastName: true } } },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });
    if (!excursion) return notFound("Excursion introuvable");
    return ok(excursion);
  } catch (e) {
    return serverError(e);
  }
}

// PATCH /api/excursions/[id] — Modifier (admin)
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await requireAdmin();
  } catch {
    return forbidden();
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const excursion = await prisma.excursion.update({ where: { id }, data: body });
    return ok(excursion);
  } catch (e) {
    return serverError(e);
  }
}

// DELETE /api/excursions/[id] — Désactiver (admin)
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await requireAdmin();
  } catch {
    return forbidden();
  }

  try {
    const { id } = await params;
    await prisma.excursion.update({ where: { id }, data: { isActive: false } });
    return ok({ message: "Excursion désactivée" });
  } catch (e) {
    return serverError(e);
  }
}
