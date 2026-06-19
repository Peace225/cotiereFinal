import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth"; // Import de votre système Supabase

type Params = { params: Promise<{ id: string }> };

// GET — détail d'un produit (public)
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

// PATCH — modifier un produit (admin)
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    // Vérification admin
    await requireAdmin();

    const { id } = await params;
    const body = await req.json();

    const produit = await prisma.marketProduit.update({
      where: { id },
      data: {
        ...(body.label !== undefined && { label: body.label }),
        ...(body.desc !== undefined && { desc: body.desc }),
        ...(body.prix !== undefined && { prix: parseInt(body.prix) }),
        ...(body.unite !== undefined && { unite: body.unite }),
        ...(body.categorie !== undefined && { categorie: body.categorie }),
        ...(body.images !== undefined && {
          images: Array.isArray(body.images)
            ? body.images
            : body.images.split(",").map((s: string) => s.trim()).filter(Boolean),
        }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
      },
    });
    return NextResponse.json({ data: { produit } });
  } catch (e: any) {
    if (e.message === "UNAUTHORIZED" || e.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// DELETE — supprimer un produit (admin)
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await requireAdmin();

    const { id } = await params;
    await prisma.marketProduit.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    if (e.message === "UNAUTHORIZED" || e.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
