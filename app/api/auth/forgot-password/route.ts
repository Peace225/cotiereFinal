import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, badRequest, serverError } from "@/lib/api-response";
import crypto from "crypto";
import { sendResetPasswordEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return badRequest("Email requis");

    const user = await prisma.user.findUnique({ where: { email } });
    // On retourne toujours ok pour ne pas rÃ©vÃ©ler si l'email existe
    if (!user) return ok({ message: "Si cet email existe, un lien de rÃ©initialisation a Ã©tÃ© envoyÃ©." });

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 3600000); // 1h

    await prisma.user.update({
      where: { email },
      data: { resetToken: token, resetTokenExpiry: expiry },
    });

    // Envoi de l'email de reset
    await sendResetPasswordEmail(email, token);

    return ok({ message: "Si cet email existe, un lien de rÃ©initialisation a Ã©tÃ© envoyÃ©." });
  } catch (e) {
    return serverError(e);
  }
}


