import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, created, badRequest, forbidden, serverError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth"; // Protection ajoutée
import { z } from "zod";

const paymentSchema = z.object({
  amount: z.number().int().positive(),
  method: z.enum(["ORANGE_MONEY", "MTN_MONEY", "MOOV_MONEY", "WAVE", "CASH", "BANK_TRANSFER"]),
  phoneNumber: z.string().optional(),
  studioBookingId: z.string().optional(),
  excursionBookingId: z.string().optional(),
  eventRequestId: z.string().optional(),
  hotelBookingId: z.string().optional(),
  musicBookingId: z.string().optional(),
  clientName: z.string().optional(),
  clientPhone: z.string().optional(),
  serviceLabel: z.string().optional(),
});

const METHOD_LABELS: Record<string, string> = {
  ORANGE_MONEY: "Orange Money",
  MTN_MONEY: "MTN MoMo",
  MOOV_MONEY: "Moov Money",
  WAVE: "Wave",
  CASH: "Especes",
  BANK_TRANSFER: "Virement bancaire",
};

// GET : Protégé - Liste des paiements (Admin uniquement)
export async function GET() {
  // Sécurisation : Seuls les admins peuvent voir l'historique des transactions
  try { await requireAdmin(); } catch { return forbidden(); }

  try {
    const payments = await prisma.payment.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return ok(payments);
  } catch (e) { return serverError(e); }
}

// POST : Public - Soumission de paiement par le client
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = paymentSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.errors[0].message);

    const d = parsed.data;
    const ref = `PAY-${Date.now().toString(36).toUpperCase()}`;

    const payment = await prisma.payment.create({
      data: {
        reference: ref,
        amount: d.amount,
        method: d.method,
        status: "UNPAID",
        phoneNumber: d.phoneNumber,
        studioBookingId: d.studioBookingId,
        excursionBookingId: d.excursionBookingId,
        eventRequestId: d.eventRequestId,
        hotelBookingId: d.hotelBookingId,
        musicBookingId: d.musicBookingId,
      },
    });

    const adminMsg = encodeURIComponent(
      `NOUVELLE DEMANDE DE PAIEMENT ${ref}\n\n` +
      `Client: ${d.clientName || "Non precise"}\n` +
      `Tel client: ${d.clientPhone || "Non precise"}\n` +
      `Service: ${d.serviceLabel || "Non precise"}\n` +
      `Montant: ${d.amount.toLocaleString("fr-FR")} FCFA\n` +
      `Methode: ${METHOD_LABELS[d.method]}\n` +
      (d.phoneNumber ? `Numero paiement: ${d.phoneNumber}\n` : "") +
      `\nReference: ${ref}\n` +
      `\nVeuillez confirmer la reception du paiement dans l admin.\n` +
      `CÔTIÈRE MEDIA GROUP`
    );

    return created({
      id: payment.id,
      reference: ref,
      status: "UNPAID",
      adminWhatsAppUrl: `https://wa.me/2250747722931?text=${adminMsg}`,
      message: "Demande de paiement enregistree. L admin sera notifie pour confirmation.",
    });
  } catch (e) { return serverError(e); }
}