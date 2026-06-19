import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, created, badRequest, serverError, forbidden } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth"; // SÃ©curitÃ© centralisÃ©e
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  category: z.string().min(2),
  totalStock: z.number().int().positive(),
  pricePerDay: z.number().int().positive(),
  depositValue: z.number().int().min(0),
  images: z.array(z.string()).default([]),
});

// GET reste public pour afficher le catalogue aux clients
export async function GET() {
  try {
    const equipment = await prisma.equipment.findMany({
      where: { isActive: true },
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });
    return ok(equipment);
  } catch (e) { return serverError(e); }
}

// POST est dÃ©sormais sÃ©curisÃ©
export async function POST(req: NextRequest) {
  try { await requireAdmin(); } catch { return forbidden(); }

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.errors[0].message);
    
    const slug = parsed.data.name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
    const item = await prisma.equipment.create({ data: { ...parsed.data, slug } });
    return created(item);
  } catch (e) { return serverError(e); }
}

