import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, serverError } from "@/lib/api-response";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const data = await req.json();
    const rental = await prisma.equipmentRental.update({ where: { id }, data });
    return ok(rental);
  } catch (e) { return serverError(e); }
}
