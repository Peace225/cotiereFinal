import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET — liste publique des produits actifs
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categorie = searchParams.get("categorie");
    const all = searchParams.get("all") === "true";

    const where: Record<string, unknown> = all ? {} : { isActive: true };
    if (categorie && categorie !== "Tous") where.categorie = categorie;

    const produits = await prisma.marketProduit.findMany({
      where,
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ data: { produits } });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST — créer un produit (admin)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["ADMIN", "SUPER_ADMIN"].includes((session.user as {role:string})?.role)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const { label, desc, prix, unite, categorie, images } = body;

    if (!label || !prix || !unite || !categorie) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
    }

    const produit = await prisma.marketProduit.create({
      data: {
        label,
        desc: desc || "",
        prix: parseInt(prix),
        unite,
        categorie,
        images: Array.isArray(images) ? images : (images ? [images] : []),
        isActive: true,
      },
    });

    return NextResponse.json({ data: { produit } }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
