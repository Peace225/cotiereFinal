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

    // ✅ CORRECTION 1 : On utilise la bonne table (info_prestations)
    const prestation = await prisma.info_prestations.update({
      where: { id },
      data: {
        // ✅ CORRECTION 2 : La base de données attend 'nom' et non 'label'
        ...(body.nom !== undefined ? { nom: body.nom } : body.label !== undefined ? { nom: body.label } : {}),
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
    // ✅ CORRECTION 1 : On utilise la bonne table (info_prestations)
    await prisma.info_prestations.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}