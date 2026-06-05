import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, badRequest, unauthorized, serverError } from "@/lib/api-response";
import { getSession } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { z } from "zod";

const updateProfileSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  nationality: z.string().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8).optional(),
});

// GET /api/auth/profile — Récupérer le profil
export async function GET() {
  try {
    const session = await getSession();
    if (!session) return unauthorized();
    const userId = (session.user as { id: string }).id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, email: true, firstName: true, lastName: true,
        phone: true, whatsapp: true, nationality: true,
        role: true, emailVerified: true, createdAt: true,
      },
    });

    if (!user) return unauthorized();
    return ok(user);
  } catch (e) {
    return serverError(e);
  }
}

// PATCH /api/auth/profile — Mettre à jour le profil
export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return unauthorized();
    const userId = (session.user as { id: string }).id;

    const body = await req.json();
    const parsed = updateProfileSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.errors[0].message);

    const { currentPassword, newPassword, ...profileData } = parsed.data;

    // Si changement de mot de passe
    if (newPassword) {
      if (!currentPassword) return badRequest("Mot de passe actuel requis");

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user?.password) return badRequest("Impossible de changer le mot de passe pour ce compte");

      const valid = await bcrypt.compare(currentPassword, user.password);
      if (!valid) return badRequest("Mot de passe actuel incorrect");

      const hashed = await bcrypt.hash(newPassword, 12);
      await prisma.user.update({ where: { id: userId }, data: { password: hashed } });
    }

    // Mettre à jour le profil
    const updated = await prisma.user.update({
      where: { id: userId },
      data: profileData,
      select: {
        id: true, email: true, firstName: true, lastName: true,
        phone: true, whatsapp: true, nationality: true, role: true,
      },
    });

    return ok(updated);
  } catch (e) {
    return serverError(e);
  }
}
