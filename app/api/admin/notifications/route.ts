
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const IS_DEV = process.env.NODE_ENV === "development";

async function getSupabaseClient() {
  const cookieStore = await cookies();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Configuration Supabase manquante");
  }

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },

      setAll() {
        // La mise à jour des cookies doit être
        // prise en charge par le proxy/middleware
        // d'authentification de l'application.
      },
    },
  });
}

function handleError(error: unknown) {
  const message =
    error instanceof Error ? error.message : "Erreur inconnue";

  if (message === "UNAUTHORIZED") {
    return NextResponse.json(
      { error: "Authentification requise" },
      { status: 401 }
    );
  }

  if (message === "FORBIDDEN") {
    return NextResponse.json(
      { error: "Accès administrateur refusé" },
      { status: 403 }
    );
  }

  console.error("API Notifications:", error);

  return NextResponse.json(
    {
      error: "Erreur serveur",
      ...(IS_DEV ? { details: message } : {}),
    },
    { status: 500 }
  );
}

// ================================================
// GET : CHARGER LES NOTIFICATIONS
// ================================================

export async function GET() {
  try {
    await requireAdmin();

    const supabase = await getSupabaseClient();

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .order("createdat", { ascending: false })
      .limit(50);

    if (error) {
      console.error("SUPABASE NOTIFICATIONS GET:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });

      throw new Error(
        `${error.code}: ${error.message}`
      );
    }

    const notifications = data ?? [];

    // Compatible avec deux conventions de nommage,
    // en attendant de confirmer le schéma SQL.
    const normalized = notifications.map((item) => {
      const isRead = Boolean(
        item.isRead ?? item.isread ?? false
      );

      return {
        ...item,
        isRead,
        createdAt:
          item.createdAt ??
          item.createdat ??
          new Date().toISOString(),
      };
    });

    const unreadCount = normalized.filter(
      (notification) => !notification.isRead
    ).length;

    return NextResponse.json(
      {
        data: {
          notifications: normalized,
          unreadCount,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    return handleError(error);
  }
}

// ================================================
// PATCH : MARQUER TOUT COMME LU
// ================================================

export async function PATCH() {
  try {
    await requireAdmin();

    const supabase = await getSupabaseClient();

    const { error } = await supabase
      .from("notifications")
      .update({ isread: true })
      .eq("isread", false);

    if (error) {
      console.error("SUPABASE NOTIFICATIONS PATCH:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });

      throw new Error(
        `${error.code}: ${error.message}`
      );
    }

    return NextResponse.json(
      {
        message: "Notifications marquées comme lues",
        success: true,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    return handleError(error);
  }
}
