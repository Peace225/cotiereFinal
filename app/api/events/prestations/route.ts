import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { forbidden } from "@/lib/api-response";

// Vos donnÃ©es par dÃ©faut (j'ai recrÃ©Ã© la structure selon votre message d'erreur, modifiez les valeurs selon vos besoins rÃ©els !)
const DEFAULT_PRESTATIONS = [
  { nom: "Coaching", categorie: "Formation", description: "Accompagnement", prix: "Sur devis", image: "" },
  { nom: "Consulting", categorie: "Conseil", description: "Expertise technique", prix: "Sur devis", image: "" }
];

// GET â€” liste publique des prestations actives (ou toutes si admin)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "true";
    const where = all ? {} : { isActive: true };

    let prestations = await prisma.info_prestations.findMany({
      where,
      orderBy: { createdAt: "asc" },
    });

    // âœ… AUTO-SEED : Si la table est vide, on l'initialise avec les valeurs par dÃ©faut
    if (prestations.length === 0) {
      await prisma.info_prestations.createMany({
        // La fameuse boucle map() qui injecte l'ID et la date !
        data: DEFAULT_PRESTATIONS.map((p) => ({
          ...p,
          id: crypto.randomUUID(),
          updatedAt: new Date(),
        })),
      });

      // On recharge la liste aprÃ¨s la crÃ©ation
      prestations = await prisma.info_prestations.findMany({
        where,
        orderBy: { createdAt: "asc" },
      });
    }

    return NextResponse.json({ data: prestations });
  } catch (e) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST â€” crÃ©er une prestation (admin)
export async function POST(req: NextRequest) {
  try { await requireAdmin(); } catch { return forbidden(); }
  try {
    const body = await req.json();
    
    // On accepte "nom" ou "label" pour la rÃ©trocompatibilitÃ©
    const { label, nom, categorie, description, prix, image } = body;
    const finalNom = nom || label;

    if (!finalNom) {
      return NextResponse.json({ error: "Le nom est obligatoire" }, { status: 400 });
    }

    const prestation = await prisma.info_prestations.create({
      data: {
        id: crypto.randomUUID(),
        updatedAt: new Date(),
        nom: finalNom,
        categorie: categorie || "",
        description: description || "",
        prix: prix || "",
        image: image || "",
        isActive: true,
      },
    });

    return NextResponse.json({ data: prestation }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

