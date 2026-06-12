import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || ""; // Le mot écrit par l'utilisateur

  try {
    // Recherche multi-tables avec OR pour la flexibilité
    const [hotels, excursions, evenements] = await Promise.all([
      prisma.room.findMany({ 
        where: { 
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } }
          ]
        } 
      }),
      prisma.excursion.findMany({ 
        where: { 
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } }
          ]
        } 
      }),
      prisma.evenement.findMany({ 
        where: { 
          OR: [
            { titre: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } }
          ]
        } 
      })
    ]);

    const results = [
      ...hotels.map(h => ({ id: h.id, titre: h.name, type: 'Hôtel', description: h.description, image: h.images[0], prix: h.pricePerNight })),
      ...excursions.map(e => ({ id: e.id, titre: e.title, type: 'Excursion', description: e.description, image: e.images[0], prix: e.priceAdult })),
      ...evenements.map(ev => ({ id: ev.id, titre: ev.titre, type: 'Événement', description: ev.description, image: ev.image, prix: ev.prix }))
    ];

    return NextResponse.json({ data: results });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}