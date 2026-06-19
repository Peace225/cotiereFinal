import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, created, badRequest, serverError, forbidden } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth"; // Protection ajoutée
import { z } from "zod";

const schema = z.object({
  clientName: z.string().min(2),
  clientEmail: z.string().email(),
  clientPhone: z.string().min(6),
  companyName: z.string().optional(),
  mediaType: z.enum(["TV", "RADIO", "MAGAZINE", "DIGITAL"]),
  adType: z.string().min(2),
  duration: z.string().optional(),
  budget: z.string().optional(),
  description: z.string().optional(),
});

// GET : Protégé - Liste des demandes média (Admin uniquement)
export async function GET() {
  try { await requireAdmin(); } catch { return forbidden(); }

  try {
    // ✅ CORRIGÉ : media_ad_requests -> mediaAdRequest
    const requests = await prisma.mediaAdRequest.findMany({ 
      orderBy: { createdAt: "desc" } 
    });
    return ok({ requests });
  } catch (e) { return serverError(e); }
}

// POST : Public - Soumission d'une demande par un client
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.errors[0].message);
    
    // ✅ CORRIGÉ : media_ad_requests -> mediaAdRequest
    const request = await prisma.mediaAdRequest.create({
      data: {
        reference: `MED-${Date.now().toString(36).toUpperCase()}`,
        ...parsed.data,
      },
    });
    return created(request);
  } catch (e) { return serverError(e); }
}