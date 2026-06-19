import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const ville = searchParams.get("ville");
    const search = searchParams.get("search");

    const where: any = {};
    if (type && type !== "all") where.type = type;
    if (ville && ville !== "all") where.ville = ville;
    if (search) {
      where.OR = [
        { nom: { contains: search, mode: "insensitive" } },
        { ville: { contains: search, mode: "insensitive" } },
        { region: { contains: search, mode: "insensitive" } },
      ];
    }

    const contacts = await prisma.collectivite_annuaire.findMany({
      where,
      orderBy: [{ ville: "asc" }, { nom: "asc" }],
    });
    return NextResponse.json(contacts);
  } catch (error) {
    console.error("GET /api/admin/collectivites/annuaire:", error);
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { nom, type, ville, region, telephone, email, adresse, siteWeb, horaires } = await req.json();
    if (!nom || !ville) return NextResponse.json({ error: "Nom et ville requis" }, { status: 400 });

    const newContact = await prisma.collectivite_annuaire.create({
      data: {
        id: crypto.randomUUID(),
        nom,
        type: type || "Mairie",
        ville,
        region: region || "",
        telephone: telephone || null,
        email: email || null,
        adresse: adresse || null,
        siteWeb: siteWeb || null,
        horaires: horaires || null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return NextResponse.json(newContact, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/collectivites/annuaire:", error);
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}
