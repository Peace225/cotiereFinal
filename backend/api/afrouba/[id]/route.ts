import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, badRequest, serverError } from "@/lib/api-response";
import { z } from "zod";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const { status, adminNotes } = await req.json();
    const request = await prisma.afroubaRequest.update({ where: { id }, data: { status, adminNotes } });
    return ok(request);
  } catch (e) { return serverError(e); }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await prisma.afroubaRequest.delete({ where: { id } });
    return ok({ message: "Supprimé" });
  } catch (e) { return serverError(e); }
}
