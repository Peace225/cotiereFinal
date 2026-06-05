import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, badRequest, serverError } from "@/lib/api-response";
import bcrypt from "bcryptjs";

// POST /api/auth/reset-password
export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) return badRequest("Token et mot de passe requis");
    if (password.length < 8) return badRequest("Le mot de passe doit contenir au moins 8 caractères");

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) return badRequest("Lien invalide ou expiré. Veuillez refaire une demande.");

    const hashed = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashed,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return ok({ message: "Mot de passe réinitialisé avec succès." });
  } catch (e) {
    return serverError(e);
  }
}
