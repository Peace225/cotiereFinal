
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// =====================================================
// CONFIGURATION
// =====================================================

const noCacheHeaders = {
  "Cache-Control": "no-store, max-age=0",
};

// =====================================================
// RÉPONSE JSON STANDARDISÉE
// =====================================================

function jsonResponse(
  data: Record<string, unknown>,
  status: number = 200
) {
  return NextResponse.json(data, {
    status,
    headers: noCacheHeaders,
  });
}

// =====================================================
// GET /api/auth/verify-session
// =====================================================

export async function GET() {
  try {
    // ===============================================
    // 1. DIAGNOSTIC DES COOKIES SUPABASE
    // ===============================================

    const cookieStore = await cookies();

    const allCookieNames = cookieStore
      .getAll()
      .map((cookie) => cookie.name);

    const supabaseCookieNames = allCookieNames.filter(
      (name) =>
        name.startsWith("sb-") &&
        name.includes("auth-token")
    );

    const hasSupabaseCookies =
      supabaseCookieNames.length > 0;

    // Ne jamais afficher les valeurs des cookies.
    console.log("[AUTH DEBUG] Cookies Supabase :", {
      detected: hasSupabaseCookies,
      count: supabaseCookieNames.length,
      names: supabaseCookieNames,
    });

    // ===============================================
    // 2. CRÉER LE CLIENT SUPABASE SERVEUR
    // ===============================================

    const supabase = await createClient();

    // ===============================================
    // 3. VÉRIFIER LA SESSION SUPABASE
    // ===============================================

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.warn(
        "[AUTH] SUPABASE_SESSION_INVALID",
        {
          hasCookies: hasSupabaseCookies,
          error:
            authError?.message ??
            "Aucun utilisateur Supabase reconnu",
        }
      );

      return jsonResponse(
        {
          success: false,
          authenticated: false,
          isAdmin: false,
          step: hasSupabaseCookies
            ? "SUPABASE_SESSION_INVALID"
            : "SUPABASE_COOKIES_MISSING",
          error: hasSupabaseCookies
            ? "Le serveur reçoit des cookies Supabase, mais la session n'est pas valide."
            : "Aucun cookie de session Supabase n'a été reçu par le serveur.",
        },
        401
      );
    }

    console.log(
      "[AUTH] SUPABASE_SESSION_VALID"
    );

    // ===============================================
    // 4. VÉRIFIER LE COMPTE PRISMA
    // ===============================================

    // IMPORTANT :
    // public.users.id est un CUID Prisma.
    // public.users.supabase_user_id contient
    // l'UUID de Supabase Auth.

    const dbUser = await prisma.user.findUnique({
      where: {
        supabaseUserId: user.id,
      },
      select: {
        id: true,
        role: true,
      },
    });

    if (!dbUser) {
      console.warn(
        "[AUTH] PRISMA_ACCOUNT_NOT_LINKED"
      );

      return jsonResponse(
        {
          success: false,
          authenticated: true,
          isAdmin: false,
          step: "PRISMA_ACCOUNT_NOT_LINKED",
          error:
            "Le compte Supabase est reconnu, mais aucun compte Prisma ne lui est associé.",
        },
        403
      );
    }

    console.log("[AUTH] PRISMA_ACCOUNT_FOUND");

    // ===============================================
    // 5. VÉRIFIER LE RÔLE ADMINISTRATEUR
    // ===============================================

    const role = String(dbUser.role)
      .trim()
      .toUpperCase();

    const isAdmin =
      role === "ADMIN" ||
      role === "SUPER_ADMIN";

    if (!isAdmin) {
      console.warn(
        "[AUTH] ROLE_INSUFFICIENT",
        role
      );

      return jsonResponse(
        {
          success: true,
          authenticated: true,
          isAdmin: false,
          step: "ROLE_INSUFFICIENT",
          role,
        },
        200
      );
    }

    // ===============================================
    // 6. ADMINISTRATEUR AUTORISÉ
    // ===============================================

    console.log(
      "[AUTH] ADMIN_AUTHORIZED",
      {
        role,
      }
    );

    return jsonResponse(
      {
        success: true,
        authenticated: true,
        isAdmin: true,
        step: "ADMIN_AUTHORIZED",
        role,
      },
      200
    );

  } catch (error) {
    // ===============================================
    // 7. GESTION DES ERREURS SERVEUR
    // ===============================================

    console.error(
      "[AUTH] SERVER_ERROR",
      error
    );

    return jsonResponse(
      {
        success: false,
        authenticated: false,
        isAdmin: false,
        step: "SERVER_ERROR",
        error:
          "Erreur interne lors de la vérification de l'authentification.",
      },
      500
    );
  }
}
