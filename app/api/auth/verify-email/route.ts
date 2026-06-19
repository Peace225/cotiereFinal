import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, badRequest, serverError } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");
    if (!token) return badRequest("Token manquant");

    const user = await prisma.user.findFirst({ where: { emailVerifyToken: token } });
    if (!user) return badRequest("Token invalide ou expirÃ©");

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true, emailVerifyToken: null },
    });

    return ok({ message: "Email vÃ©rifiÃ© avec succÃ¨s" });
  } catch (e) {
    return serverError(e);
  }
}


