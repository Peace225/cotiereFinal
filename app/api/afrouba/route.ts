import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, badRequest, serverError, forbidden } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth";
import { z } from "zod";

const createSchema = z.object({
  clientFirstName: z.string().min(2),
  clientLastName: z.string().min(2),
  clientPhone: z.string().min(8),
  clientEmail: z.string().email(),
  documentType: z.string(),
  description: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) return badRequest("Données invalides");
    const d = parsed.data;
    
    const request = await prisma.afrouba_requests.create({
      data: {
        id: crypto.randomUUID(),
        reference: `AFR-${Date.now().toString(36).toUpperCase()}`,
        clientFirstName: d.clientFirstName,
        clientLastName: d.clientLastName,
        clientPhone: d.clientPhone,
        clientEmail: d.clientEmail,
        documentType: d.documentType,
        description: d.description,
        updatedAt: new Date(),
      },
    });
    return ok({ request });
  } catch (e) { return serverError(e); }
}

export async function GET() {
  try { await requireAdmin(); } catch { return forbidden(); }
  try {
    const requests = await prisma.afrouba_requests.findMany({ orderBy: { createdAt: "desc" } });
    return ok({ requests });
  } catch (e) { return serverError(e); }
}

