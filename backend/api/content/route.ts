import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, forbidden, badRequest, serverError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth";

// GET /api/admin/content — Récupérer le contenu du site
export async function GET() {
  // Sécurisation ajoutée : Seul un admin peut lire la configuration globale
  try { await requireAdmin(); } catch { return forbidden(); }

  try {
    const content = await prisma.siteContent.findMany();
    // Transformer en objet clé/valeur
    const result = Object.fromEntries(content.map((c) => [c.key, c.value]));
    return ok(result);
  } catch (e) {
    return serverError(e);
  }
}

// PUT /api/admin/content — Mettre à jour le contenu (admin)
export async function PUT(req: NextRequest) {
  try { await requireAdmin(); } catch { return forbidden(); }

  try {
    const body = await req.json() as Record<string, string>;

    if (typeof body !== "object" || Array.isArray(body))
      return badRequest("Format invalide : objet clé/valeur attendu");

    const updates = await Promise.all(
      Object.entries(body).map(([key, value]) =>
        prisma.siteContent.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        })
      )
    );

    return ok(updates);
  } catch (e) {
    return serverError(e);
  }
}