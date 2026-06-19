import { NextRequest, NextResponse } from "next/server";





































































































import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth"; 

type Params = { params: Promise<{ id: string }> };

// PATCH — modifier une inscription (admin)
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    // Vérification admin
    await requireAdmin();

    const { id } = await params;
    const body = await req.json();
    const { status, adminNotes } = body;

    // ✅ CORRECTION : Utilisation de rdvInscription au lieu de rdv_inscriptions
    const updated = await prisma.rdvInscription.update({
      where: { id },
      data: { 
        ...(status && { status }), 
        ...(adminNotes !== undefined && { adminNotes }) 
      },
    });
    
    return NextResponse.json({ data: { inscription: updated } });
  } catch (e: any) {
    if (e.message === "UNAUTHORIZED" || e.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// DELETE — supprimer une inscription (admin)
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    // Vérification admin
    await requireAdmin();

    const { id } = await params;
    
    // ✅ CORRECTION : Utilisation de rdvInscription au lieu de rdv_inscriptions
    await prisma.rdvInscription.delete({ where: { id } });
    
    return NextResponse.json({ success: true });
  } catch (e: any) {
    if (e.message === "UNAUTHORIZED" || e.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}