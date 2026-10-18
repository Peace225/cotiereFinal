import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSession } from "@/lib/auth";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const MAX_SIZE = 100 * 1024 * 1024;

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Missing env NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
  }
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Non connecté" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = (formData.get("file") || formData.get("image") || (formData.getAll("files")[0] as any)) as File | null;

    if (!file) return NextResponse.json({ error: "Aucun fichier" }, { status: 400 });
    if (file.size > MAX_SIZE) return NextResponse.json({ error: `Fichier trop lourd ${Math.round(file.size/1024/1024)}MB > 100MB` }, { status: 400 });

    const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
    const fileName = `uploads/${Date.now()}-${Math.random().toString(36).slice(2,8)}.${ext}`;

    const supabaseAdmin = getSupabaseAdmin();

    const { error } = await supabaseAdmin.storage.from("annonces").upload(fileName, file, {
      contentType: file.type,
      upsert: false,
      cacheControl: "3600",
    });

    if (error) {
      console.error("Supabase upload error:", error);
      return NextResponse.json({ error: `Supabase: ${error.message}` }, { status: 500 });
    }

    const { data } = supabaseAdmin.storage.from("annonces").getPublicUrl(fileName);
    return NextResponse.json({ url: data.publicUrl, urls: [data.publicUrl] });

  } catch (e: any) {
    console.error("UPLOAD CRASH:", e);
    return NextResponse.json({ error: e.message || "Erreur serveur upload" }, { status: 500 });
  }
}