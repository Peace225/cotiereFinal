import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { ok, badRequest, serverError, unauthorized } from "@/lib/api-response";
import { getSession } from "@/lib/auth";

const MAX_SIZE = 100 * 1024 * 1024; // 100MB
const ALLOWED_TYPES = [
  "image/jpeg", "image/png", "image/webp", "image/gif",
  "video/mp4", "video/webm", "video/quicktime", "video/x-m4v",
  "application/pdf", "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // OBLIGATOIRE, pas de fallback ANON
);

async function uploadToSupabaseStorage(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const filePath = `uploads/${fileName}`;

  const { error } = await supabaseAdmin.storage.from("annonces").upload(filePath, buffer, {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw new Error(`Supabase: ${error.message}`);

  const { data } = supabaseAdmin.storage.from("annonces").getPublicUrl(filePath);
  return data.publicUrl;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return unauthorized();

    const formData = await req.formData();
    let files = formData.getAll("files") as File[];
    if (files.length === 0) {
      const singleFile = formData.get("file") || formData.get("image");
      if (singleFile instanceof File) files = [singleFile];
    }

    if (!files || files.length === 0) return badRequest("Aucun fichier fourni");

    const urls: string[] = [];
    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) return badRequest(`${file.name}: format ${file.type} non supporté`);
      if (file.size > MAX_SIZE) return badRequest(`${file.name}: trop lourd (max 100MB)`);
      const url = await uploadToSupabaseStorage(file);
      urls.push(url);
    }

    return ok({ url: urls[0], urls });
  } catch (e: any) {
    console.error("UPLOAD ERROR:", e);
    return serverError(e.message);
  }
}