import { NextRequest } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { ok, badRequest, serverError, unauthorized } from "@/lib/api-response";
import { getSession } from "@/lib/auth";

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ALLOWED_DOC_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOC_TYPES];

// Upload vers Cloudinary si configurÃ© (images uniquement), sinon stockage local
async function uploadFile(file: File): Promise<string> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  const isImage = file.type.startsWith("image/");

  if (isImage && cloudName && apiKey && apiSecret) {
    // Upload Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    const timestamp = Math.round(Date.now() / 1000);
    const str = `folder=cotiere&timestamp=${timestamp}${apiSecret}`;
    const crypto = await import("crypto");
    const signature = crypto.createHash("sha1").update(str).digest("hex");

    const fd = new FormData();
    fd.append("file", dataUri);
    fd.append("api_key", apiKey);
    fd.append("timestamp", String(timestamp));
    fd.append("signature", signature);
    fd.append("folder", "cotiere");

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body: fd });
    const data = await res.json();
    if (data.secure_url) return data.secure_url;
    throw new Error("Cloudinary upload failed");
  }

  // Stockage local
  const uploadDir = join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  const bytes = await file.arrayBuffer();
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  await writeFile(join(uploadDir, filename), Buffer.from(bytes));
  return `/uploads/${filename}`;
}

// POST /api/upload
export async function POST(req: NextRequest) {
  try {
    // VÃ©rifier l'authentification
    const session = await getSession();
    if (!session) return unauthorized();

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) return badRequest("Aucun fichier fourni");
    if (files.length > 10) return badRequest("Maximum 10 fichiers Ã  la fois");

    const urls: string[] = [];
    const errors: string[] = [];

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        errors.push(`${file.name} : format non supportÃ© (JPG, PNG, WEBP, PDF, DOC, DOCX)`);
        continue;
      }
      if (file.size > MAX_SIZE) {
        errors.push(`${file.name} : fichier trop lourd (max 10MB)`);
        continue;
      }
      try {
        const url = await uploadFile(file);
        urls.push(url);
      } catch {
        errors.push(`${file.name} : erreur lors de l'upload`);
      }
    }

    if (urls.length === 0 && errors.length > 0) return badRequest(errors[0]);
    return ok({ urls, errors: errors.length > 0 ? errors : undefined });
  } catch (e) {
    return serverError(e);
  }
}


