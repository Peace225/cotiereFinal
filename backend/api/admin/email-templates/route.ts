import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, serverError } from "@/lib/api-response";

const DEFAULT_TEMPLATES = [
  { key: "confirmation_reservation", label: "Confirmation de rÃ©servation", subject: "Votre rÃ©servation COTIERE est confirmÃ©e", content: "Bonjour {{clientName}},\n\nVotre rÃ©servation pour {{service}} du {{date}} a Ã©tÃ© confirmÃ©e.\n\nMontant : {{montant}} FCFA\n\nMerci de votre confiance.\nCÃ”TIÃˆRE MEDIA GROUP\n07 47 72 29 31" },
  { key: "refus_reservation", label: "Refus de rÃ©servation", subject: "Votre demande CÃ”TIÃˆRE", content: "Bonjour {{clientName}},\n\nNous sommes dÃ©solÃ©s, votre demande pour {{service}} n'a pas pu Ãªtre acceptÃ©e.\n\nContactez-nous pour plus d'informations.\nCÃ”TIÃˆRE MEDIA GROUP\n07 47 72 29 31" },
  { key: "rappel_reservation", label: "Rappel 48h avant", subject: "Rappel : votre rÃ©servation COTIERE demain", content: "Bonjour {{clientName}},\n\nRappel : votre {{service}} est prÃ©vu le {{date}}.\n\nN'oubliez pas de vous prÃ©senter 15 minutes avant.\nCÃ”TIÃˆRE MEDIA GROUP\n07 47 72 29 31" },
  { key: "devis_envoye", label: "Envoi de devis", subject: "Votre devis HBL Studio+", content: "Bonjour {{clientName}},\n\nVeuillez trouver ci-joint votre devis pour {{service}}.\n\nMontant estimÃ© : {{montant}} FCFA\n\nCe devis est valable 30 jours.\nCÃ”TIÃˆRE MEDIA GROUP\n07 47 72 29 31" },
];

export async function GET() {
  try {
    // âœ… CORRIGÃ‰ : Utilisation du modÃ¨le pluriel site_content
    const stored = await prisma.site_content.findMany({
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
    
    // âœ… CORRIGÃ‰ : Utilisation du modÃ¨le pluriel site_content avec gÃ©nÃ©ration d'ID
    await prisma.site_content.upsert({
      where: { key: `email_template_${key}` },
      update: { value: JSON.stringify({ subject, content }) },
      create: { 
        id: crypto.randomUUID(),
        key: `email_template_${key}`, 
        value: JSON.stringify({ subject, content }), 
        type: "json" 
      },
    });
    return ok({ message: "Template sauvegardÃ©" });
  } catch (e) { return serverError(e); }
}

