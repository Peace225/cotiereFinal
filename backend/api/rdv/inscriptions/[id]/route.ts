import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth"; // Protection ajoutée

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  // Sécurisation : Seul un admin peut modifier un rendez-vous
  try { await requireAdmin(); } catch { return new NextResponse("Non autorisé", { status: 401 }); }

  try {
    const { id } = await params;
    const body = await req.json();
    const { status, adminNotes } = body;
    
    const updated = await prisma.rdvInscription.update({
      where: { id },
      data: { ...(status && { status }), ...(adminNotes !== undefined && { adminNotes }) },
    });
    return NextResponse.json({ data: { inscription: updated } });
  } catch (e) {
    return new NextResponse("Erreur serveur", { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  // Sécurisation : Seul un admin peut supprimer un rendez-vous
  try { await requireAdmin(); } catch { return new NextResponse("Non autorisé", { status: 401 }); }

  try {
    const { id } = await params;
    await prisma.rdvInscription.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return new NextResponse("Erreur serveur", { status: 500 });
  }
}