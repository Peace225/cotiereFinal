import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

function generateRef() {
  return "RDV-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).slice(2, 6).toUpperCase();
}

export async function GET() {
  const session = await getSession();
  if (!session || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const inscriptions = await prisma.rdvInscription.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ data: { inscriptions } });
  } catch (e) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const inscription = await prisma.rdvInscription.create({
      data: {
        reference: generateRef(),
        ...body,
        status: "PENDING",
      },
    });
    return NextResponse.json({ data: { inscription } }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}