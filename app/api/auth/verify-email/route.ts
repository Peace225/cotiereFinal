
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  ok,
  badRequest,
  serverError,
} from "@/lib/api-response";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // 1. Récupérer le token
    const token = req.nextUrl.searchParams
      .get("token")
      ?.trim();

    if (!token) {
      return badRequest(
        "Le token de vérification est manquant."
      );
    }

    // 2. Contrôler le format du token
    // Suppose une génération avec randomBytes(32)
    // et un encodage hexadécimal.
    if (!/^[a-f0-9]{64}$/i.test(token)) {
      return badRequest(
        "Le lien de vérification est invalide."
      );
    }

    // 3. Rechercher le compte correspondant
    const user = await prisma.user.findFirst({
      where: {
        emailVerifyToken: token,
        emailVerified: false,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return badRequest(
        "Ce lien de vérification est invalide ou déjà utilisé."
      );
    }

    // 4. Vérifier le compte et invalider le token
    const result = await prisma.user.updateMany({
      where: {
        id: user.id,
        emailVerifyToken: token,
        emailVerified: false,
      },
      data: {
        emailVerified: true,
        emailVerifyToken: null,
      },
    });

    if (result.count !== 1) {
      return badRequest(
        "Ce lien a déjà été utilisé."
      );
    }

    // 5. Réponse
    return ok({
      success: true,
      message:
        "Votre adresse e-mail a été vérifiée avec succès.",
    });

  } catch (error) {
    console.error(
      "[VERIFY EMAIL] Erreur :",
      error
    );

    return serverError(error);
  }
}
