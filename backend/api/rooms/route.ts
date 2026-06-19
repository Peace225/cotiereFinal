import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, created, badRequest, forbidden, serverError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth"; // Protection ajoutÃ©e
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

// GET /api/rooms â€” Liste des chambres actives (Public)
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

// POST /api/rooms â€” CrÃ©er une chambre (Admin uniquement)
export async function POST(req: NextRequest) {
  // SÃ©curisation : Seul un admin peut ajouter des chambres
  try { await requireAdmin(); } catch { return forbidden(); }

  try {
    const body = await req.json();
    const parsed = roomSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.errors[0].message);

    const d = parsed.data;
    const slug = d.slug || d.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") + "-" + Date.now();

    const room = await prisma.rooms.create({
      data: { ...d, slug },
    });
    return created(room);
  } catch (e) {
    return serverError(e);
  }
}

