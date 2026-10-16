import "server-only";

import { cookies, headers } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { prisma } from "./prisma";

// =====================================================
// TYPES
// =====================================================
export type AuthSession = {
  user: {
    id: string;
    email: string | null;
    name: string;
    role: string;
    supabaseId: string;
  };
};

// =====================================================
// CLIENT SUPABASE SERVEUR
// =====================================================
export async function createClient() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl ||!supabaseAnonKey) {
    throw new Error("SUPABASE_CONFIG_MISSING");
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {}
      },
    },
  });
}

// =====================================================
// SESSION - CORRIGÉ POUR TA DB RÉELLE
// =====================================================
export async function getSession(): Promise<AuthSession | null> {
  try {
    const supabase = await createClient();

    let {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const headerStore = await headers();
      const authorization = headerStore.get("authorization");
      const match = authorization?.match(/^Bearer\s+(\S+)$/i);
      if (match?.[1]) {
        const bearerResult = await supabase.auth.getUser(match[1]);
        if (!bearerResult.error && bearerResult.data.user) {
          user = bearerResult.data.user;
        }
      }
    }

    if (!user) return null;

    // ON NE SÉLECTIONNE QUE LES COLONNES QUI EXISTENT VRAIMENT
    const dbUser = await prisma.user.findFirst({
      where: {
        OR: [{ supabaseUserId: user.id }, { id: user.id }],
      },
      select: {
        id: true,
        email: true,
        role: true,
        supabaseUserId: true,
      },
    });

    if (!dbUser) {
      console.warn("[AUTH] PRISMA_ACCOUNT_NOT_LINKED", {
        supabaseId: user.id,
        email: user.email,
      });
      return null;
    }

    const role = String(dbUser.role).trim().toUpperCase();

    return {
      user: {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.email || "Admin",
        role,
        supabaseId: user.id,
      },
    };
  } catch (error) {
    console.error("[AUTH] SESSION_ERROR", error);
    return null;
  }
}

// =====================================================
// GUARDS
// =====================================================
export async function requireAuth(): Promise<AuthSession> {
  const session = await getSession();
  if (!session) {
    const err: any = new Error("UNAUTHORIZED");
    err.status = 401;
    err.statusCode = 401;
    throw err;
  }
  return session;
}

export async function requireAdmin(): Promise<AuthSession> {
  const session = await requireAuth();
  if (!session.user.role.includes("ADMIN")) {
    console.warn("[AUTH] FORBIDDEN - role:", session.user.role);
    const err: any = new Error("FORBIDDEN");
    err.status = 403;
    err.statusCode = 403;
    throw err;
  }
  return session;
}