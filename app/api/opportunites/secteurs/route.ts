import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, serverError, forbidden, created, badRequest } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const isAdmin = searchParams.get("admin") === "1";
    const whereClause = isAdmin ? {} : { isActive: true };

    // âœ… CORRECTION : Utilisation de opportunite_secteurs
    const secteurs = await prisma.opportunite_secteurs.findMany({
      where: whereClause,
      orderBy: { createdAt: "asc" },
    });

    return ok(secteurs);
  } catch (e: any) {
    console.error("ERREUR API SECTEURS:", e);
    return serverError(e.message);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { nom, categorie, couleur, description, image } = body;
    
    if (!nom || !description) return badRequest("Nom et description requis");

    // âœ… CORRECTION : Utilisation de opportunite_secteurs + Injection id et updatedAt
    const secteur = await prisma.opportunite_secteurs.create({
      data: {
        id: crypto.randomUUID(),
        updatedAt: new Date(),
        nom,
        categorie: categorie || nom,
        couleur: couleur || "bg-cyan-500",
        description,
        image: image || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80",
        isActive: true
      },
    });
    return created(secteur);
  } catch (e: any) {
    console.error("ERREUR API POST:", e);
    return serverError(e.message);
  }
}

