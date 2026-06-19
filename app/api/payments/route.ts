import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, created, badRequest, serverError, forbidden } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth";
import { z } from "zod";

const paymentSchema = z.object({
  amount: z.number().int().positive(),
  method: z.enum(["ORANGE_MONEY", "MTN_MONEY", "MOOV_MONEY", "WAVE", "CASH", "BANK_TRANSFER"]),
  phoneNumber: z.string().optional(),
  // Un seul de ces champs
  studioBookingId: z.string().optional(),
  excursionBookingId: z.string().optional(),
  eventRequestId: z.string().optional(),
  hotelBookingId: z.string().optional(),
  musicBookingId: z.string().optional(),
  // Infos client pour la notif WhatsApp
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = paymentSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.errors[0].message);

    const d = parsed.data;
    const ref = `PAY-${Date.now().toString(36).toUpperCase()}`;

    // âœ… CORRECTION : Nettoyage des champs undefined pour satisfaire le typage strict de Prisma, 
    // et injection des champs id et updatedAt obligatoires.
    const paymentData: any = {
      id: crypto.randomUUID(),
      updatedAt: new Date(),
      reference: ref,
      amount: d.amount,
      method: d.method,
      status: "UNPAID",
    };

    if (d.phoneNumber) paymentData.phoneNumber = d.phoneNumber;
    if (d.studioBookingId) paymentData.studioBookingId = d.studioBookingId;
    if (d.excursionBookingId) paymentData.excursionBookingId = d.excursionBookingId;
    if (d.eventRequestId) paymentData.eventRequestId = d.eventRequestId;
    if (d.hotelBookingId) paymentData.hotelBookingId = d.hotelBookingId;
    if (d.musicBookingId) paymentData.musicBookingId = d.musicBookingId;

    const payment = await prisma.payment.create({
      data: paymentData,
    });

    // Construire le message WhatsApp pour l'admin
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
      `CÃ”TIÃˆRE MEDIA GROUP`
    );

    return created({
      id: payment.id,
      reference: ref,
      status: "UNPAID",
      adminWhatsAppUrl: `https://wa.me/2250747722931?text=${adminMsg}`,
      message: "Demande de paiement enregistree. L admin sera notifie pour confirmation.",
    });
  } catch (e) {
    return serverError(e);
  }
}

// GET /api/payments â€” Liste (admin)
export async function GET() {
  try { await requireAdmin(); } catch { return forbidden(); }
  try {
    const payments = await prisma.payment.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return ok(payments);
  } catch (e) {
    return serverError(e);
  }
}

