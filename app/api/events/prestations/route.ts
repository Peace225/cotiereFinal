import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { forbidden } from "@/lib/api-response";

// GET — liste publique des prestations actives (ou toutes si admin)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "true";
    const where = all ? {} : { isActive: true };

    const prestations = await prisma.evenementPrestation.findMany({
      where,
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ data: prestations });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST — créer une prestation (admin)
export async function POST(req: NextRequest) {
  try { await requireAdmin(); } catch { return forbidden(); }
  try {
    const body = await req.json();
    const { label, description, image } = body;

    if (!label) {
      return NextResponse.json({ error: "Le nom est obligatoire" }, { status: 400 });
    }

    const prestation = await prisma.evenementPrestation.create({
      data: {
        label,
        description: description || "",
        image: image || "",
        isActive: true,
      },
    });

    return NextResponse.json({ data: prestation }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
