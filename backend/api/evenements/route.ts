import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type AdminUser = { role: string };

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categorie = searchParams.get("categorie");
    const all = searchParams.get("all") === "true";
    const where = all ? {} : { isActive: true };
    if (categorie && categorie !== "Tous") Object.assign(where, { categorie });
    const evenements = await prisma.evenement.findMany({ where, orderBy: { createdAt: "asc" } });
    return NextResponse.json({ data: { evenements } });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "SUPER_ADMIN"].includes((session.user as AdminUser)?.role)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { slug, titre, categorie, date, heure, lieu, ville, prix, capacite, organisateur, description, image, badge, badgeColor, artistes, duree, programme } = body;
    if (!slug || !titre || !categorie || !date || !lieu) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
    }
    const evenement = await prisma.evenement.create({
      data: { slug, titre, categorie, date, heure: heure || "", lieu, ville: ville || "", prix: prix || "", capacite: capacite || "", organisateur: organisateur || "", description: description || "", image: image || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80", badge: badge || "A venir", badgeColor: badgeColor || "bg-blue-500", artistes: artistes || null, duree: duree || null, programme: programme || [], isActive: true },
    });
    return NextResponse.json({ data: { evenement } }, { status: 201 });
  } catch (e: unknown) {
    if ((e as { code?: string }).code === "P2002") return NextResponse.json({ error: "Un événement avec ce slug existe déjà" }, { status: 409 });
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
