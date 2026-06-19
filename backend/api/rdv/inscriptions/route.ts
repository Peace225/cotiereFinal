import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth"; // Protection ajoutée

function generateRef() {
  return "RDV-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).slice(2, 6).toUpperCase();
}

// GET — Liste des inscriptions (Admin uniquement)
export async function GET() {
  // Sécurisation : Seuls les admins peuvent consulter la liste des inscrits
  try { await requireAdmin(); } catch { return new NextResponse("Non autorisé", { status: 401 }); }

  try {
    const inscriptions = await prisma.rdvInscription.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ data: { inscriptions } });
  } catch (e) {
    return new NextResponse("Erreur serveur", { status: 500 });
  }
}

// POST — Inscription à un RDV (Public)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clientName, clientPhone, clientEmail, evenementSlug, evenementTitre, evenementDate, evenementLieu, participants, message } = body;
    
    if (!clientName || !clientPhone || !evenementSlug) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
    }
    
    const inscription = await prisma.rdvInscription.create({
      data: {
        reference: generateRef(),
        clientName,
        clientPhone,
        clientEmail: clientEmail || null,
        evenementSlug,
        evenementTitre,
        evenementDate,
        evenementLieu,
        participants: parseInt(participants) || 1,
        message: message || null,
        status: "PENDING",
      },
    });
    return NextResponse.json({ data: { inscription } }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

