import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { status, adminNotes } = body;
    const updated = await prisma.rdvInscription.update({
      where: { id: params.id },
      data: { ...(status && { status }), ...(adminNotes !== undefined && { adminNotes }) },
    });
    return NextResponse.json({ data: { inscription: updated } });
  } catch (e) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.rdvInscription.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}