import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, forbidden, badRequest, serverError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth";

// GET /api/admin/content â€” RÃ©cupÃ©rer le contenu du site
export async function GET() {
  try {
    const content = await prisma.site_content.findMany();
    // Transformer en objet clÃ©/valeur
    const result = Object.fromEntries(content.map((c) => [c.key, c.value]));
    return ok(result);
  } catch (e) {
    return serverError(e);
  }
}

// PUT /api/admin/content â€” Mettre Ã  jour le contenu (admin)
export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return forbidden();
  }

  try {
    const body = await req.json() as Record<string, string>;

    if (typeof body !== "object" || Array.isArray(body))
      return badRequest("Format invalide : objet clÃ©/valeur attendu");

    const now = new Date();

    const updates = await Promise.all(
      Object.entries(body).map(([key, value]) =>
        prisma.site_content.upsert({
          where: { key },
          // Mise Ã  jour : on met Ã  jour la valeur et la date de modification
          update: { 
            value,
            updatedAt: now 
          },
          // CrÃ©ation : on injecte l'identifiant unique ainsi que la clÃ© et la valeur
          create: { 
            id: crypto.randomUUID(),
            key, 
            value,
            createdAt: now,  // â† ajoutÃ©
            updatedAt: now,  // â† ajoutÃ©
          },
        })
      )
    );

    return ok(updates);
  } catch (e) {
    return serverError(e);
  }
}

