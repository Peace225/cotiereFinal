import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, badRequest, serverError, forbidden } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth"; // Import de votre système de sécurité

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  // Sécurisation de la route
  try { await requireAdmin(); } catch { return forbidden(); }

  try {
    const { id } = await params;
    const { status, adminNotes } = await req.json();
    
    // ✅ CORRIGÉ : Utilisation du modèle pluriel afrouba_requests
    const request = await prisma.afrouba_requests.update({ 
      where: { id }, 
      data: { status, adminNotes } 
    });
    return ok(request);
  } catch (e) { return serverError(e); }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  // Sécurisation de la route
  try { await requireAdmin(); } catch { return forbidden(); }

  try {
    const { id } = await params;
    
    // ✅ CORRIGÉ : Utilisation du modèle pluriel afrouba_requests
    await prisma.afrouba_requests.delete({ where: { id } });
    return ok({ message: "Supprimé" });
  } catch (e) { return serverError(e); }
}