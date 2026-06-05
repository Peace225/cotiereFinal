import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { forbidden } from "@/lib/api-response";

type Params = { params: Promise<{ id: string }> };

// PATCH — modifier une prestation (admin)
export async function PATCH(req: NextRequest, { params }: Params) {
  try { await requireAdmin(); } catch { return forbidden(); }
  try {
    const { id } = await params;
    const body = await req.json();

    const prestation = await prisma.evenementPrestation.update({
      where: { id },
      data: {
        ...(body.label !== undefined && { label: body.label }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.image !== undefined && { image: body.image }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
      },
    });

    return NextResponse.json({ data: prestation });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// DELETE — supprimer une prestation (admin)
export async function DELETE(_req: NextRequest, { params }: Params) {
  try { await requireAdmin(); } catch { return forbidden(); }
  try {
    const { id } = await params;
    await prisma.evenementPrestation.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
