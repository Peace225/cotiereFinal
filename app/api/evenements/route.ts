import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categorie = searchParams.get("categorie");
    const all = searchParams.get("all") === "true";

    const where: any = all ? {} : { isActive: true };
    if (categorie && categorie !== "Tous") {
      where.categorie = categorie;
    }

    const evenements = await prisma.evenement.findMany({
      where,
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ data: { evenements } });
  } catch (error) {
    console.error("Erreur GET Ã©vÃ©nements:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Non autorisÃ©" }, { status: 401 });
    }

    const body = await req.json();
    const { slug, titre, categorie, date, heure, lieu, ville, prix, capacite, organisateur, description, image, badge, badgeColor, artistes, duree, programme } = body;

    const evenement = await prisma.evenement.create({
      data: {
        slug, titre, categorie, date: new Date(date), heure, lieu, ville, prix, capacite,
        organisateur, description, image: image || "", badge, badgeColor, artistes, duree, programme,
      },
    });

    return NextResponse.json({ data: { evenement } }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}


