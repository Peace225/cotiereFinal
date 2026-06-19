import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const dest = searchParams.get("dest") || "";
  
  // ==========================================
  // ðŸ› ï¸ TRADUCTEUR D'ACCENTS (LA CORRECTION)
  // ==========================================
  const rawType = searchParams.get("categorie") || searchParams.get("type") || "Tous";
  let categorie = rawType;
  
  if (rawType.toLowerCase() === "hotel") categorie = "HÃ´tel";
  else if (rawType.toLowerCase() === "residence") categorie = "RÃ©sidence";
  else if (rawType.toLowerCase() === "evenement") categorie = "Ã‰vÃ©nement";
  // ==========================================

  const adults = parseInt(searchParams.get("adults") || "2", 10);

  try {
    // 1. Construction des filtres avec contournement du typage strict (any)
    const baseWhere: any = dest ? {
      OR: [
        { name: { contains: dest, mode: 'insensitive' as any } },
        { description: { contains: dest, mode: 'insensitive' as any } },
        { city: { contains: dest, mode: 'insensitive' as any } },
      ]
    } : {};

    const typeWhere: any = categorie && categorie !== "Tous"
      ? { type: { equals: categorie, mode: 'insensitive' as any } }
      : {};

    // 2. âœ… CORRECTION : Utilisation de rooms et excursions au pluriel
    const [hotels, excursions, evenements] = await Promise.all([
      prisma.rooms.findMany({
        where: { ...baseWhere, ...typeWhere },
        select: {
          id: true,
          name: true,
          description: true,
          pricePerNight: true,
          images: true,
          type: true,
          city: true,
          rating: true,
        },
        take: 50
      }),
      prisma.excursions.findMany({
        where: dest ? { OR: [{ title: { contains: dest, mode: 'insensitive' as any } }] } : {},
        select: { id: true, title: true, description: true, priceAdult: true, images: true }
      }),
      prisma.evenement.findMany({
        where: dest ? { OR: [{ titre: { contains: dest, mode: 'insensitive' as any } }] } : {},
      })
    ]);

    // 3. Helper pour rÃ©cupÃ©rer la premiÃ¨re image
    const getImage = (imgField: any) => {
      if (!imgField) return null;
      if (Array.isArray(imgField) && typeof imgField[0] === 'string') {
        return imgField[0];
      }
      if (Array.isArray(imgField) && imgField[0]?.url) {
        return imgField[0].url;
      }
      if (typeof imgField === 'string') return imgField;
      return null;
    };

    // 4. Formatage pour le front
    const results = [
      ...hotels.map(h => ({
        id: h.id,
        titre: h.name,
        type: h.type || 'HÃ´tel',
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
        type: 'Ã‰vÃ©nement',
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


