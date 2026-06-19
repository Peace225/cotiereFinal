import { NextRequest } from "next/server";
import { ok, badRequest, serverError } from "@/lib/api-response";

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ALLOWED_DOC_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOC_TYPES];

async function uploadToCloudinary(file: File): Promise<string> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) throw new Error("Cloudinary non configurÃ©");

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const base64 = buffer.toString("base64");
  const dataUri = `data:${file.type};base64,${base64}`;

  const timestamp = Math.round(Date.now() / 1000);
  const crypto = await import("crypto");
  // Pour les docs, on utilise l'upload 'raw', pour les images 'image'
  const isImage = file.type.startsWith("image/");
  const resourceType = isImage ? "image" : "raw";
  
  const str = `folder=cotiere&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash("sha1").update(str).digest("hex");

  const fd = new FormData();
  fd.append("file", dataUri);
  fd.append("api_key", apiKey);
  fd.append("timestamp", String(timestamp));
  fd.append("signature", signature);
  fd.append("folder", "cotiere");

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, { 
    method: "POST", 
    body: fd 
  });
  
  const data = await res.json();
  if (data.secure_url) return data.secure_url;
  throw new Error("Upload Ã©chouÃ©");
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) return badRequest("Aucun fichier fourni");
    if (files.length > 10) return badRequest("Maximum 10 fichiers");

    const urls: string[] = [];
    const errors: string[] = [];

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        errors.push(`${file.name} : format non supportÃ©`);
        continue;
      }
      if (file.size > MAX_SIZE) {
        errors.push(`${file.name} : trop lourd`);
        continue;
      }
      try {
        const url = await uploadToCloudinary(file);
        urls.push(url);
      } catch (e) {
        errors.push(`${file.name} : erreur upload`);
      }
    }

    return ok({ urls, errors: errors.length > 0 ? errors : undefined });
  } catch (e) {
    return serverError(e);
  }
}

