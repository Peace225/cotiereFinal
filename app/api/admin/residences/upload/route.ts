import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseAdminClient } from "@supabase/supabase-js";
import { requireAdmin } from "@/lib/auth";
import { randomUUID } from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BUCKET = "categories"; // ou "residences" si tu as créé ce bucket
const FOLDER = "residences";
const MAX_SIZE = 5 * 1024 * 1024; // 5 Mo

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

function jsonError(message: string, status: number) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export async function POST(request: NextRequest) {
  // 1. AUTH - Next 16: requireAdmin() lit les cookies via proxy.ts
  try {
    const session = await requireAdmin();
    console.log("[UPLOAD RESIDENCE] Admin OK", {
      userId: session.user.id,
      role: session.user.role,
    });
  } catch (error: any) {
    const message = error instanceof Error ? error.message : "";
    const status = error?.statusCode || error?.status;

    if (status === 403 || message === "FORBIDDEN") {
      console.warn("[UPLOAD RESIDENCE] 403 - Pas admin");
      return jsonError("Accès refusé : droits administrateur insuffisants.", 403);
    }

    console.warn("[UPLOAD RESIDENCE] 401 - Non connecté:", message || error);
    return jsonError("Authentification requise. Reconnecte-toi sur /connexion.", 401);
  }

  // 2. CONFIG ENV
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("[UPLOAD RESIDENCE] ENV manquant");
    return jsonError("Configuration serveur incomplète (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).", 500);
  }

  try {
    // 3. FICHIER
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string" || !(file instanceof File)) {
      return jsonError("Aucune image reçue.", 400);
    }

    // 4. FORMAT
    const extension = ALLOWED_TYPES[file.type];
    if (!extension) {
      return jsonError("Format non autorisé. JPG, PNG, WebP ou AVIF uniquement.", 400);
    }

    // 5. TAILLE
    if (file.size <= 0 || file.size > MAX_SIZE) {
      return jsonError("La photo doit faire entre 1 octet et 5 Mo.", 400);
    }

    // 6. CLIENT ADMIN (service_role = bypass RLS)
    const supabaseAdmin = createSupabaseAdminClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });

    // 7. NOM UNIQUE
    const filename = `${randomUUID()}.${extension}`;
    const filePath = `${FOLDER}/${filename}`;

    // 8. BYTES
    const bytes = new Uint8Array(await file.arrayBuffer());

    // 9. UPLOAD
    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(filePath, bytes, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("[UPLOAD RESIDENCE] Storage error:", uploadError);
      return jsonError(`Upload Supabase échoué: ${uploadError.message}`, 500);
    }

    // 10. URL PUBLIQUE
    const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(filePath);

    if (!data?.publicUrl) {
      return jsonError("Upload OK mais URL publique indisponible.", 500);
    }

    console.log("[UPLOAD RESIDENCE] OK:", filePath);

    // 11. RÉPONSE - format attendu par ton front
    return NextResponse.json(
      {
        success: true,
        url: data.publicUrl, // ton front lit result.url
        path: filePath,
        message: "Photo envoyée avec succès.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[UPLOAD RESIDENCE] Erreur interne:", error);
    return jsonError("Erreur interne pendant l'envoi.", 500);
  }
}