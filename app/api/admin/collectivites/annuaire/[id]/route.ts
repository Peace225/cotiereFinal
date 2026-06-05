import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH - Modifier un contact
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { nom, type, ville, region, telephone, email, adresse, siteWeb, horaires, isActive } = body;

    const contact = await prisma.collectiviteAnnuaire.update({
      where: { id },
      data: {
        ...(nom !== undefined && { nom }),
        ...(type !== undefined && { type }),
        ...(ville !== undefined && { ville }),
        ...(region !== undefined && { region }),
        ...(telephone !== undefined && { telephone: telephone || null }),
        ...(email !== undefined && { email: email || null }),
        ...(adresse !== undefined && { adresse: adresse || null }),
        ...(siteWeb !== undefined && { siteWeb: siteWeb || null }),
        ...(horaires !== undefined && { horaires: horaires || null }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json({ contact });
  } catch (error) {
    console.error("PATCH /api/admin/collectivites/annuaire/[id]:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// DELETE - Supprimer un contact
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.collectiviteAnnuaire.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/collectivites/annuaire/[id]:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
