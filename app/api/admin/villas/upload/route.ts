import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
const BUCKET = "categories";
const MAX_BYTES = 5 * 1024 * 1024;
const TYPES: Record<string, string> = {
  "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif",
};

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Session administrateur non autorisée." }, { status: 401 });
  }

  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      return NextResponse.json({ error: "Configuration Supabase serveur manquante." }, { status: 500 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Aucune image reçue." }, { status: 400 });
    }
    const ext = TYPES[file.type];
    if (!ext) {
      return NextResponse.json({ error: "Formats autorisés : JPG, PNG, WebP, AVIF." }, { status: 400 });
    }
    if (!file.size || file.size > MAX_BYTES) {
      return NextResponse.json({ error: "Image vide ou supérieure à 5 Mo." }, { status: 400 });
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    const path = `villas/${crypto.randomUUID()}.${ext}`;
    const supabase = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { error } = await supabase.storage.from(BUCKET).upload(path, bytes, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    });
    if (error) {
      console.error("Upload villa Supabase:", error);
      return NextResponse.json({ error: "Échec de l'envoi vers Supabase Storage." }, { status: 500 });
    }
    // Le bucket categories doit être PUBLIC pour que les images soient visibles sur le site.
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return NextResponse.json({ url: data.publicUrl, path }, { status: 201 });
  } catch (error) {
    console.error("Upload villa:", error);
    return NextResponse.json({ error: "Impossible d'envoyer l'image." }, { status: 500 });
  }
}
