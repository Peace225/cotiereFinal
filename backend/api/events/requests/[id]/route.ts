import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { eventStatusSchema } from "@/lib/validations";
import { ok, notFound, forbidden, badRequest, serverError } from "@/lib/api-response";
import { sendEventStatusUpdate } from "@/lib/email";

type Params = { params: Promise<{ id: string }> };

// GET /api/events/requests/[id]
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const request = await prisma.eventRequest.findUnique({
      where: { id },
      include: { payments: true, notifications: true },
    });
    if (!request) return notFound("Demande introuvable");
    return ok(request);
  } catch (e) {
    return serverError(e);
  }
}

// PATCH /api/events/requests/[id] — Mise à jour statut (admin)
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = eventStatusSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.errors[0].message);

    const request = await prisma.eventRequest.update({
      where: { id },
      data: parsed.data,
    });

    // Email au client si changement de statut
    await sendEventStatusUpdate(request).catch(console.error);

    return ok(request);
  } catch (e) {
    return serverError(e);
  }
}

// DELETE /api/events/requests/[id] — Suppression définitive (admin)
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await prisma.eventRequest.delete({ where: { id } });
    return ok({ message: "Réservation supprimée" });
  } catch (e) {
    return serverError(e);
  }
}
