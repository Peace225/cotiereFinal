import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "SUPER_ADMIN"].includes((session.user as { role: string })?.role)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, adminNotes } = body;
    const updated = await prisma.rdvInscription.update({
      where: { id },
      data: { ...(status && { status }), ...(adminNotes !== undefined && { adminNotes }) },
    });
    return NextResponse.json({ data: { inscription: updated } });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "SUPER_ADMIN"].includes((session.user as { role: string })?.role)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  try {
    const { id } = await params;
    await prisma.rdvInscription.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
