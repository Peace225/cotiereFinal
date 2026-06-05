import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, created, badRequest, serverError } from "@/lib/api-response";
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
    const rooms = await prisma.room.findMany({
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
  try {
    const body = await req.json();
    const parsed = roomSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.errors[0].message);

    const d = parsed.data;
    const slug = d.slug || d.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") + "-" + Date.now();

    const room = await prisma.room.create({
      data: { ...d, slug },
    });
    return created(room);
  } catch (e) {
    return serverError(e);
  }
}
