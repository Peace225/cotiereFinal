import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, created, badRequest, serverError, forbidden } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth";
import { z } from "zod";

const roomSchema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  type: z.string().min(2),
  capacity: z.number().int().positive(),
  pricePerNight: z.number().int().positive(),
  amenities: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
  description: z.string().optional(),
});

// GET /api/rooms — Liste des chambres actives
export async function GET() {
  try {
    const rooms = await prisma.rooms.findMany({
      where: { isActive: true },
      orderBy: { pricePerNight: "asc" },
    });
    return ok(rooms);
  } catch (e) {
    return serverError(e);
  }
}

// POST /api/rooms — Créer une chambre (admin)
export async function POST(req: NextRequest) {
  try { await requireAdmin(); } catch { return forbidden(); }
  try {
    const body = await req.json();
    const parsed = roomSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.errors[0].message);

    const d = parsed.data;
    const slug = d.slug || d.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") + "-" + Date.now();

    // ✅ CORRECTION : Injection automatique de l'id et de la date updatedAt (requis par le schéma Prisma)
    const room = await prisma.rooms.create({
      data: { 
        ...d, 
        id: crypto.randomUUID(),
        updatedAt: new Date(),
        slug 
      },
    });
    return created(room);
  } catch (e) {
    return serverError(e);
  }
}

