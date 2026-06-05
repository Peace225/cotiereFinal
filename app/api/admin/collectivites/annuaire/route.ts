import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Liste tous les contacts de l'annuaire
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const ville = searchParams.get("ville");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};
    if (type && type !== "ALL") where.type = type;
    if (ville) where.ville = { contains: ville, mode: "insensitive" };
    if (search) {
      where.OR = [
        { nom: { contains: search, mode: "insensitive" } },
        { ville: { contains: search, mode: "insensitive" } },
        { region: { contains: search, mode: "insensitive" } },
      ];
    }

    const contacts = await prisma.collectiviteAnnuaire.findMany({
      where,
      orderBy: [{ ville: "asc" }, { nom: "asc" }],
    });

    return NextResponse.json({ contacts });
  } catch (error) {
    console.error("GET /api/admin/collectivites/annuaire:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST - Créer un nouveau contact
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nom, type, ville, region, telephone, email, adresse, siteWeb, horaires } = body;

    if (!nom || !type || !ville) {
      return NextResponse.json(
        { error: "Nom, type et ville sont obligatoires" },
        { status: 400 }
      );
    }

    const contact = await prisma.collectiviteAnnuaire.create({
      data: {
        nom,
        type,
        ville,
        region: region ?? "",
        telephone: telephone || null,
        email: email || null,
        adresse: adresse || null,
        siteWeb: siteWeb || null,
        horaires: horaires || null,
        isActive: true,
      },
    });

    return NextResponse.json({ contact }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/collectivites/annuaire:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
