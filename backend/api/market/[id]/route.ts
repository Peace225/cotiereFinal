import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const produit = await prisma.marketProduit.findUnique({ where: { id } });
    if (!produit) return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
    return NextResponse.json({ data: { produit } });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    
    // Mise à jour sécurisée
    const produit = await prisma.marketProduit.update({
      where: { id },
      data: {
        ...(body.label !== undefined && { label: body.label }),
        ...(body.desc !== undefined && { desc: body.desc }),
        ...(body.prix !== undefined && { prix: parseInt(body.prix) }),
        ...(body.unite !== undefined && { unite: body.unite }),
        ...(body.categorie !== undefined && { categorie: body.categorie }),
        ...(body.images !== undefined && { 
          images: Array.isArray(body.images) ? body.images : body.images.split(",").map((s: string) => s.trim()).filter(Boolean) 
        }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
      },
    });
    return NextResponse.json({ data: { produit } });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await prisma.marketProduit.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}