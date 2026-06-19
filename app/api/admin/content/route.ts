import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, forbidden, badRequest, serverError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const content = await prisma.site_content.findMany();
    const result = Object.fromEntries(content.map((c) => [c.key, c.value]));
    return ok(result);
  } catch (e) {
    return serverError(e);
  }
}

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
    const updates = await Promise.all(
      Object.entries(body).map(([key, value]) =>
        prisma.site_content.upsert({
          where: { key },
          update: { value, updatedAt: new Date() },
          create: { id: crypto.randomUUID(), key, value, updatedAt: new Date() },
        })
      )
    );
    return ok(updates);
  } catch (e) {
    return serverError(e);
  }
}

