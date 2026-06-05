import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, serverError } from "@/lib/api-response";

const DEFAULT_TEMPLATES = [
  { key: "confirmation_reservation", label: "Confirmation de réservation", subject: "Votre réservation COTIERE est confirmée", content: "Bonjour {{clientName}},\n\nVotre réservation pour {{service}} du {{date}} a été confirmée.\n\nMontant : {{montant}} FCFA\n\nMerci de votre confiance.\nCÔTIÈRE MEDIA GROUP\n07 47 72 29 31" },
  { key: "refus_reservation", label: "Refus de réservation", subject: "Votre demande CÔTIÈRE", content: "Bonjour {{clientName}},\n\nNous sommes désolés, votre demande pour {{service}} n'a pas pu être acceptée.\n\nContactez-nous pour plus d'informations.\nCÔTIÈRE MEDIA GROUP\n07 47 72 29 31" },
  { key: "rappel_reservation", label: "Rappel 48h avant", subject: "Rappel : votre réservation COTIERE demain", content: "Bonjour {{clientName}},\n\nRappel : votre {{service}} est prévu le {{date}}.\n\nN'oubliez pas de vous présenter 15 minutes avant.\nCÔTIÈRE MEDIA GROUP\n07 47 72 29 31" },
  { key: "devis_envoye", label: "Envoi de devis", subject: "Votre devis HBL Studio+", content: "Bonjour {{clientName}},\n\nVeuillez trouver ci-joint votre devis pour {{service}}.\n\nMontant estimé : {{montant}} FCFA\n\nCe devis est valable 30 jours.\nCÔTIÈRE MEDIA GROUP\n07 47 72 29 31" },
];

export async function GET() {
  try {
    const stored = await prisma.siteContent.findMany({
      where: { key: { startsWith: "email_template_" } },
    });

    const templates = DEFAULT_TEMPLATES.map(t => {
      const stored_t = stored.find(s => s.key === `email_template_${t.key}`);
      return {
        key: t.key,
        label: t.label,
        subject: stored_t ? JSON.parse(stored_t.value).subject : t.subject,
        content: stored_t ? JSON.parse(stored_t.value).content : t.content,
        isCustom: !!stored_t,
      };
    });

    return ok(templates);
  } catch (e) { return serverError(e); }
}

export async function POST(req: NextRequest) {
  try {
    const { key, subject, content } = await req.json();
    await prisma.siteContent.upsert({
      where: { key: `email_template_${key}` },
      update: { value: JSON.stringify({ subject, content }) },
      create: { key: `email_template_${key}`, value: JSON.stringify({ subject, content }), type: "json" },
    });
    return ok({ message: "Template sauvegardé" });
  } catch (e) { return serverError(e); }
}
