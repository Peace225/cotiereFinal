import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const dest = searchParams.get("dest") || "";
  
  // ==========================================
  // 🛠️ TRADUCTEUR D'ACCENTS (LA CORRECTION)
  // ==========================================
  const rawType = searchParams.get("categorie") || searchParams.get("type") || "Tous";
  let categorie = rawType;
  
  if (rawType.toLowerCase() === "hotel") categorie = "Hôtel";
  else if (rawType.toLowerCase() === "residence") categorie = "Résidence";
  else if (rawType.toLowerCase() === "evenement") categorie = "Événement";
  // ==========================================

  const adults = parseInt(searchParams.get("adults") || "2", 10);

  try {
    // 1. Construction des filtres
    const baseWhere = dest ? {
      OR: [
        { name: { contains: dest, mode: 'insensitive' } },
        { description: { contains: dest, mode: 'insensitive' } },
        { city: { contains: dest, mode: 'insensitive' } },
      ]
    } : {};

    const typeWhere = categorie && categorie !== "Tous"
      ? { type: { equals: categorie, mode: 'insensitive' } }
      : {};

    // 2. Requête SANS include (images est un String[])
    const [hotels, excursions, evenements] = await Promise.all([
      prisma.room.findMany({
        where: { ...baseWhere, ...typeWhere },
        select: {
          id: true,
          name: true,
          description: true,
          pricePerNight: true,
          images: true, // ← String[] direct, pas de include
          type: true,
          city: true,
          rating: true,
        },
        take: 50
      }),
      prisma.excursion.findMany({
        where: dest ? { OR: [{ title: { contains: dest, mode: 'insensitive' } }] } : {},
        select: { id: true, title: true, description: true, priceAdult: true, images: true }
      }),
      prisma.evenement.findMany({
        where: dest ? { OR: [{ titre: { contains: dest, mode: 'insensitive' } }] } : {},
      })
    ]);

    // 3. Helper pour récupérer la première image
    const getImage = (imgField: any) => {
      if (!imgField) return null;
      // Cas 1: String[] -> ["https://..."]
      if (Array.isArray(imgField) && typeof imgField[0] === 'string') {
        return imgField[0];
      }
      // Cas 2: Relation [{url: "..."}]
      if (Array.isArray(imgField) && imgField[0]?.url) {
        return imgField[0].url;
      }
      // Cas 3: String simple
      if (typeof imgField === 'string') return imgField;
      return null;
    };

    // 4. Formatage pour ton front
    const results = [
      ...hotels.map(h => ({
        id: h.id,
        titre: h.name,
        type: h.type || 'Hôtel',
        description: h.description,
        image: getImage(h.images), 
        prix: h.pricePerNight,
        destination: h.city || dest || "Abidjan",
        rating: h.rating || 8.5
      })),
      ...excursions.map(e => ({
        id: e.id,
        titre: e.title,
        type: 'Excursion',
        description: e.description,
        image: getImage(e.images),
        prix: e.priceAdult,
        destination: dest,
        rating: 9.2
      })),
      ...evenements.map(ev => ({
        id: ev.id,
        titre: ev.titre,
        type: 'Événement',
        description: ev.description,
        image: ev.image,
        prix: ev.prix,
        destination: dest,
        rating: 9.0
      }))
    ];

    return NextResponse.json({ data: results });
  } catch (error) {
    console.error("Erreur API:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}