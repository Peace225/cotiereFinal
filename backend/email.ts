/**
 * Service d'envoi d'emails â€” COTIERE MEDIA GROUP
 * Utilise Resend (https://resend.com)
 * En local : configure RESEND_API_KEY dans .env
 * Sans clÃ© : les emails sont loggÃ©s dans la console (mode dev)
 */

import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM = "COTIERE MEDIA GROUP <noreply@cotiere.ci>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@cotiere.ci";
const BASE_URL = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

// â”€â”€â”€ Couleurs brand â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const GOLD = "#c9a84c";
const BLUE = "#0c4a6e";

// â”€â”€â”€ Layout HTML commun â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function layout(content: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0f9ff;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f9ff;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr>
          <td style="background:${BLUE};padding:24px 32px;text-align:center;">
            <span style="color:${GOLD};font-size:24px;font-weight:900;letter-spacing:2px;">COTIERE</span>
            <span style="color:#fff;font-size:13px;font-weight:300;margin-left:8px;">MEDIA GROUP</span>
          </td>
        </tr>
        <!-- Content -->
        <tr><td style="padding:32px;">${content}</td></tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;padding:20px 32px;text-align:center;border-top:1px solid #e2e8f0;">
            <p style="margin:0;color:#94a3b8;font-size:12px;">
              COTIERE MEDIA GROUP â€” Littoral Ivoirien<br>
              ðŸ“ž 07 47 72 29 31 / 05 86 87 89 20 / 01 02 17 18 03<br>
              <em style="color:#cbd5e1;">"Nous Croyons en la force des NTIC"</em>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function badge(text: string, color = GOLD): string {
  return `<span style="display:inline-block;background:${color};color:#fff;font-size:12px;font-weight:700;padding:4px 12px;border-radius:20px;letter-spacing:1px;">${text}</span>`;
}

function infoRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:8px 0;color:#64748b;font-size:13px;width:40%;">${label}</td>
    <td style="padding:8px 0;color:#1e293b;font-size:13px;font-weight:600;">${value}</td>
  </tr>`;
}

function button(text: string, url: string): string {
  return `<a href="${url}" style="display:inline-block;background:${GOLD};color:#fff;font-weight:700;font-size:14px;padding:12px 28px;border-radius:10px;text-decoration:none;margin-top:16px;">${text}</a>`;
}

// â”€â”€â”€ Envoi gÃ©nÃ©rique â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
async function send(to: string, subject: string, html: string): Promise<void> {
  if (!resend) {
    // Mode dev sans clÃ© : log dans la console
    console.log("\nðŸ“§ [EMAIL - MODE DEV]");
    console.log(`  Ã€      : ${to}`);
    console.log(`  Sujet  : ${subject}`);
    console.log("  (Configurez RESEND_API_KEY dans .env pour envoyer de vrais emails)\n");
    return;
  }
  try {
    await resend.emails.send({ from: FROM, to, subject, html });
  } catch (err) {
    console.error("[EMAIL ERROR]", err);
    // Ne pas faire planter l'app si l'email Ã©choue
  }
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// AUTH
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

export async function sendVerificationEmail(email: string, token: string): Promise<void> {
  const link = `${BASE_URL}/api/auth/verify-email?token=${token}`;
  const html = layout(`
    <h2 style="color:${BLUE};margin:0 0 8px;">VÃ©rifiez votre adresse email</h2>
    <p style="color:#475569;font-size:14px;margin:0 0 24px;">
      Bienvenue sur COTIERE MEDIA GROUP ! Cliquez sur le bouton ci-dessous pour activer votre compte.
    </p>
    <div style="text-align:center;margin:24px 0;">
      ${button("VÃ©rifier mon email", link)}
    </div>
    <p style="color:#94a3b8;font-size:12px;margin-top:24px;">
      Ce lien expire dans 24h. Si vous n'avez pas crÃ©Ã© de compte, ignorez cet email.
    </p>
  `);
  await send(email, "VÃ©rifiez votre adresse email â€” COTIERE", html);
}

export async function sendResetPasswordEmail(email: string, token: string): Promise<void> {
  const link = `${BASE_URL}/reinitialiser-mot-de-passe?token=${token}`;
  const html = layout(`
    <h2 style="color:${BLUE};margin:0 0 8px;">RÃ©initialisation de mot de passe</h2>
    <p style="color:#475569;font-size:14px;margin:0 0 24px;">
      Vous avez demandÃ© Ã  rÃ©initialiser votre mot de passe. Cliquez sur le bouton ci-dessous.
    </p>
    <div style="text-align:center;margin:24px 0;">
      ${button("RÃ©initialiser mon mot de passe", link)}
    </div>
    <p style="color:#94a3b8;font-size:12px;margin-top:24px;">
      Ce lien expire dans 1h. Si vous n'avez pas fait cette demande, ignorez cet email.
    </p>
  `);
  await send(email, "RÃ©initialisation de mot de passe â€” COTIERE", html);
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// STUDIO+
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

interface StudioBookingData {
  reference: string;
  clientFirstName: string;
  clientLastName: string;
  clientEmail: string;
  eventType: string;
  eventDate: Date | string;
  eventTimeSlot: string;
  eventLocation: string;
  services: string[];
  estimatedPriceMin?: number | null;
  estimatedPriceMax?: number | null;
}

export async function sendStudioBookingConfirmation(booking: StudioBookingData): Promise<void> {
  const date = new Date(booking.eventDate).toLocaleDateString("fr-FR", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
  const servicesList = booking.services.map(s => `<li style="margin:4px 0;color:#475569;font-size:13px;">â€¢ ${s}</li>`).join("");
  const priceRange = booking.estimatedPriceMin && booking.estimatedPriceMax
    ? `${booking.estimatedPriceMin.toLocaleString("fr-FR")} â€“ ${booking.estimatedPriceMax.toLocaleString("fr-FR")} FCFA`
    : "Devis sur mesure";

  const html = layout(`
    <div style="margin-bottom:20px;">${badge("HBL Studio+")}</div>
    <h2 style="color:${BLUE};margin:0 0 8px;">Demande reÃ§ue !</h2>
    <p style="color:#475569;font-size:14px;margin:0 0 24px;">
      Bonjour <strong>${booking.clientFirstName}</strong>, nous avons bien reÃ§u votre demande de rÃ©servation.
      Notre Ã©quipe vous contactera dans les <strong>24 Ã  48h</strong> avec un devis dÃ©taillÃ©.
    </p>
    <div style="background:#f8fafc;border-radius:10px;padding:20px;margin-bottom:24px;">
      <p style="margin:0 0 12px;font-weight:700;color:${BLUE};font-size:13px;">RÃ‰CAPITULATIF DE VOTRE DEMANDE</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${infoRow("RÃ©fÃ©rence", booking.reference)}
        ${infoRow("Type d'Ã©vÃ©nement", booking.eventType)}
        ${infoRow("Date", date)}
        ${infoRow("CrÃ©neau", booking.eventTimeSlot)}
        ${infoRow("Lieu", booking.eventLocation)}
        ${infoRow("Tarif indicatif", priceRange)}
      </table>
    </div>
    <p style="color:#475569;font-size:13px;margin:0 0 8px;font-weight:600;">Services demandÃ©s :</p>
    <ul style="margin:0 0 24px;padding:0;list-style:none;">${servicesList}</ul>
    <p style="color:#94a3b8;font-size:12px;">
      Conservez votre numÃ©ro de rÃ©fÃ©rence : <strong style="color:${BLUE};">${booking.reference}</strong>
    </p>
  `);
  await send(booking.clientEmail, `Demande STUDIO+ reÃ§ue â€” ${booking.reference}`, html);
}

export async function sendStudioBookingAdminNotif(booking: StudioBookingData): Promise<void> {
  const date = new Date(booking.eventDate).toLocaleDateString("fr-FR", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
  const html = layout(`
    <div style="margin-bottom:20px;">${badge("NOUVELLE DEMANDE STUDIO+", "#ef4444")}</div>
    <h2 style="color:${BLUE};margin:0 0 16px;">Nouvelle demande de rÃ©servation</h2>
    <div style="background:#f8fafc;border-radius:10px;padding:20px;margin-bottom:24px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        ${infoRow("RÃ©fÃ©rence", booking.reference)}
        ${infoRow("Client", `${booking.clientFirstName} ${booking.clientLastName}`)}
        ${infoRow("Email", booking.clientEmail)}
        ${infoRow("Type d'Ã©vÃ©nement", booking.eventType)}
        ${infoRow("Date", date)}
        ${infoRow("Lieu", booking.eventLocation)}
      </table>
    </div>
    <div style="text-align:center;">
      ${button("Voir dans le dashboard", `${BASE_URL}/admin/studio`)}
    </div>
  `);
  await send(ADMIN_EMAIL, `[STUDIO+] Nouvelle demande â€” ${booking.reference}`, html);
}

export async function sendStudioStatusUpdate(
  booking: StudioBookingData & { clientEmail: string; status: string; adminNotes?: string | null; quotePdfUrl?: string | null }
): Promise<void> {
  const statusLabels: Record<string, { label: string; color: string; msg: string }> = {
    CONFIRMED: { label: "CONFIRMÃ‰E", color: "#16a34a", msg: "Votre rÃ©servation a Ã©tÃ© <strong>confirmÃ©e</strong>. Notre Ã©quipe vous contactera pour finaliser les dÃ©tails." },
    REFUSED:   { label: "REFUSÃ‰E",   color: "#dc2626", msg: "Votre demande n'a pas pu Ãªtre acceptÃ©e pour cette date. N'hÃ©sitez pas Ã  nous recontacter pour une autre date." },
    CANCELLED: { label: "ANNULÃ‰E",   color: "#f59e0b", msg: "Votre rÃ©servation a Ã©tÃ© annulÃ©e." },
    COMPLETED: { label: "TERMINÃ‰E",  color: "#0284c7", msg: "Merci pour votre confiance ! Nous espÃ©rons vous revoir bientÃ´t." },
  };
  const s = statusLabels[booking.status] ?? { label: booking.status, color: GOLD, msg: "" };
  const html = layout(`
    <div style="margin-bottom:20px;">${badge(s.label, s.color)}</div>
    <h2 style="color:${BLUE};margin:0 0 8px;">Mise Ã  jour de votre rÃ©servation</h2>
    <p style="color:#475569;font-size:14px;margin:0 0 16px;">
      Bonjour <strong>${booking.clientFirstName}</strong>, ${s.msg}
    </p>
    <div style="background:#f8fafc;border-radius:10px;padding:16px;margin-bottom:16px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        ${infoRow("RÃ©fÃ©rence", booking.reference)}
        ${infoRow("Statut", s.label)}
      </table>
    </div>
    ${booking.adminNotes ? `<div style="background:#fef9ec;border-left:4px solid ${GOLD};padding:12px 16px;border-radius:0 8px 8px 0;margin-bottom:16px;"><p style="margin:0;color:#475569;font-size:13px;"><strong>Message de l'Ã©quipe :</strong><br>${booking.adminNotes}</p></div>` : ""}
    ${booking.quotePdfUrl ? `<div style="text-align:center;">${button("TÃ©lÃ©charger le devis PDF", booking.quotePdfUrl)}</div>` : ""}
  `);
  await send(booking.clientEmail, `RÃ©servation STUDIO+ ${s.label} â€” ${booking.reference}`, html);
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// EXCURSIONS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

interface ExcursionBookingData {
  reference: string;
  clientFirstName: string;
  clientLastName: string;
  clientEmail: string;
  excursionTitle: string;
  bookingDate: Date | string;
  timeSlot: string;
  guideLanguage: string;
  adultsCount: number;
  childrenCount: number;
  totalAmount: number;
  depositAmount?: number | null;
}

export async function sendExcursionBookingConfirmation(booking: ExcursionBookingData): Promise<void> {
  const date = new Date(booking.bookingDate).toLocaleDateString("fr-FR", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
  const html = layout(`
    <div style="margin-bottom:20px;">${badge("COTIERE TOURISM")}</div>
    <h2 style="color:${BLUE};margin:0 0 8px;">RÃ©servation confirmÃ©e !</h2>
    <p style="color:#475569;font-size:14px;margin:0 0 24px;">
      Bonjour <strong>${booking.clientFirstName}</strong>, votre rÃ©servation d'excursion a bien Ã©tÃ© enregistrÃ©e.
      Vous recevrez une confirmation dÃ©finitive sous 24h.
    </p>
    <div style="background:#f8fafc;border-radius:10px;padding:20px;margin-bottom:24px;">
      <p style="margin:0 0 12px;font-weight:700;color:${BLUE};font-size:13px;">DÃ‰TAILS DE VOTRE EXCURSION</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${infoRow("RÃ©fÃ©rence", booking.reference)}
        ${infoRow("Excursion", booking.excursionTitle)}
        ${infoRow("Date", date)}
        ${infoRow("CrÃ©neau", booking.timeSlot)}
        ${infoRow("Langue du guide", booking.guideLanguage)}
        ${infoRow("Adultes", String(booking.adultsCount))}
        ${infoRow("Enfants", String(booking.childrenCount))}
        ${infoRow("Montant total", `${booking.totalAmount.toLocaleString("fr-FR")} FCFA`)}
        ${booking.depositAmount ? infoRow("Acompte (30%)", `${booking.depositAmount.toLocaleString("fr-FR")} FCFA`) : ""}
      </table>
    </div>
    <div style="background:#ecfdf5;border-radius:10px;padding:16px;margin-bottom:16px;">
      <p style="margin:0;color:#166534;font-size:13px;">
        ðŸ“ <strong>Point de rendez-vous :</strong> Notre Ã©quipe vous communiquera le lieu exact de rendez-vous par email ou tÃ©lÃ©phone.
      </p>
    </div>
    <p style="color:#94a3b8;font-size:12px;">RÃ©fÃ©rence : <strong style="color:${BLUE};">${booking.reference}</strong></p>
  `);
  await send(booking.clientEmail, `Excursion rÃ©servÃ©e â€” ${booking.reference}`, html);
}

export async function sendExcursionBookingAdminNotif(booking: ExcursionBookingData): Promise<void> {
  const date = new Date(booking.bookingDate).toLocaleDateString("fr-FR", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
  const html = layout(`
    <div style="margin-bottom:20px;">${badge("NOUVELLE RÃ‰SERVATION EXCURSION", "#ef4444")}</div>
    <h2 style="color:${BLUE};margin:0 0 16px;">Nouvelle rÃ©servation d'excursion</h2>
    <div style="background:#f8fafc;border-radius:10px;padding:20px;margin-bottom:24px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        ${infoRow("RÃ©fÃ©rence", booking.reference)}
        ${infoRow("Client", `${booking.clientFirstName} ${booking.clientLastName}`)}
        ${infoRow("Email", booking.clientEmail)}
        ${infoRow("Excursion", booking.excursionTitle)}
        ${infoRow("Date", date)}
        ${infoRow("Participants", `${booking.adultsCount} adulte(s) + ${booking.childrenCount} enfant(s)`)}
        ${infoRow("Montant", `${booking.totalAmount.toLocaleString("fr-FR")} FCFA`)}
      </table>
    </div>
    <div style="text-align:center;">
      ${button("Voir dans le dashboard", `${BASE_URL}/admin/excursions`)}
    </div>
  `);
  await send(ADMIN_EMAIL, `[EXCURSION] Nouvelle rÃ©servation â€” ${booking.reference}`, html);
}

export async function sendExcursionStatusUpdate(
  booking: ExcursionBookingData & { status: string; adminNotes?: string | null; voucherPdfUrl?: string | null }
): Promise<void> {
  const statusLabels: Record<string, { label: string; color: string; msg: string }> = {
    CONFIRMED: { label: "CONFIRMÃ‰E", color: "#16a34a", msg: "Votre excursion est <strong>confirmÃ©e</strong> ! PrÃ©parez-vous pour une belle aventure." },
    REFUSED:   { label: "REFUSÃ‰E",   color: "#dc2626", msg: "Votre rÃ©servation n'a pas pu Ãªtre acceptÃ©e. Contactez-nous pour trouver une alternative." },
    CANCELLED: { label: "ANNULÃ‰E",   color: "#f59e0b", msg: "Votre rÃ©servation a Ã©tÃ© annulÃ©e." },
    COMPLETED: { label: "TERMINÃ‰E",  color: "#0284c7", msg: "Merci d'avoir choisi COTIERE TOURISM ! Nous espÃ©rons que vous avez passÃ© un excellent moment." },
  };
  const s = statusLabels[booking.status] ?? { label: booking.status, color: GOLD, msg: "" };
  const html = layout(`
    <div style="margin-bottom:20px;">${badge(s.label, s.color)}</div>
    <h2 style="color:${BLUE};margin:0 0 8px;">Mise Ã  jour de votre excursion</h2>
    <p style="color:#475569;font-size:14px;margin:0 0 16px;">
      Bonjour <strong>${booking.clientFirstName}</strong>, ${s.msg}
    </p>
    <div style="background:#f8fafc;border-radius:10px;padding:16px;margin-bottom:16px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        ${infoRow("RÃ©fÃ©rence", booking.reference)}
        ${infoRow("Excursion", booking.excursionTitle)}
        ${infoRow("Statut", s.label)}
      </table>
    </div>
    ${booking.adminNotes ? `<div style="background:#fef9ec;border-left:4px solid ${GOLD};padding:12px 16px;border-radius:0 8px 8px 0;margin-bottom:16px;"><p style="margin:0;color:#475569;font-size:13px;"><strong>Message de l'Ã©quipe :</strong><br>${booking.adminNotes}</p></div>` : ""}
    ${booking.voucherPdfUrl ? `<div style="text-align:center;">${button("TÃ©lÃ©charger votre voucher", booking.voucherPdfUrl)}</div>` : ""}
  `);
  await send(booking.clientEmail, `Excursion ${s.label} â€” ${booking.reference}`, html);
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// EVENTS & ORGANISATION
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

interface EventRequestData {
  reference: string;
  clientFirstName: string;
  clientLastName: string;
  clientEmail: string;
  eventType: string;
  eventDate: Date | string;
  eventLocation: string;
  guestCount: number;
  services: string[];
  budget?: string | null;
}

export async function sendEventRequestConfirmation(request: EventRequestData): Promise<void> {
  const date = new Date(request.eventDate).toLocaleDateString("fr-FR", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
  const servicesList = request.services.map(s => `<li style="margin:4px 0;color:#475569;font-size:13px;">â€¢ ${s}</li>`).join("");
  const html = layout(`
    <div style="margin-bottom:20px;">${badge("COTIERE EVENT & ORGANISATION")}</div>
    <h2 style="color:${BLUE};margin:0 0 8px;">Demande reÃ§ue !</h2>
    <p style="color:#475569;font-size:14px;margin:0 0 24px;">
      Bonjour <strong>${request.clientFirstName}</strong>, nous avons bien reÃ§u votre demande d'organisation d'Ã©vÃ©nement.
      Notre Ã©quipe vous enverra un devis personnalisÃ© dans les <strong>24 Ã  48h</strong>.
    </p>
    <div style="background:#f8fafc;border-radius:10px;padding:20px;margin-bottom:24px;">
      <p style="margin:0 0 12px;font-weight:700;color:${BLUE};font-size:13px;">RÃ‰CAPITULATIF DE VOTRE DEMANDE</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${infoRow("RÃ©fÃ©rence", request.reference)}
        ${infoRow("Type d'Ã©vÃ©nement", request.eventType)}
        ${infoRow("Date", date)}
        ${infoRow("Lieu", request.eventLocation)}
        ${infoRow("Nombre d'invitÃ©s", String(request.guestCount))}
        ${request.budget ? infoRow("Budget indicatif", request.budget) : ""}
      </table>
    </div>
    <p style="color:#475569;font-size:13px;margin:0 0 8px;font-weight:600;">Services demandÃ©s :</p>
    <ul style="margin:0 0 24px;padding:0;list-style:none;">${servicesList}</ul>
    <p style="color:#94a3b8;font-size:12px;">RÃ©fÃ©rence : <strong style="color:${BLUE};">${request.reference}</strong></p>
  `);
  await send(request.clientEmail, `Demande Ã©vÃ©nement reÃ§ue â€” ${request.reference}`, html);
}

export async function sendEventRequestAdminNotif(request: EventRequestData): Promise<void> {
  const date = new Date(request.eventDate).toLocaleDateString("fr-FR", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
  const html = layout(`
    <div style="margin-bottom:20px;">${badge("NOUVELLE DEMANDE Ã‰VÃ‰NEMENT", "#ef4444")}</div>
    <h2 style="color:${BLUE};margin:0 0 16px;">Nouvelle demande d'organisation</h2>
    <div style="background:#f8fafc;border-radius:10px;padding:20px;margin-bottom:24px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        ${infoRow("RÃ©fÃ©rence", request.reference)}
        ${infoRow("Client", `${request.clientFirstName} ${request.clientLastName}`)}
        ${infoRow("Email", request.clientEmail)}
        ${infoRow("Type d'Ã©vÃ©nement", request.eventType)}
        ${infoRow("Date", date)}
        ${infoRow("Lieu", request.eventLocation)}
        ${infoRow("InvitÃ©s", String(request.guestCount))}
        ${request.budget ? infoRow("Budget", request.budget) : ""}
      </table>
    </div>
    <div style="text-align:center;">
      ${button("Voir dans le dashboard", `${BASE_URL}/admin/evenements`)}
    </div>
  `);
  await send(ADMIN_EMAIL, `[EVENT] Nouvelle demande â€” ${request.reference}`, html);
}

export async function sendEventStatusUpdate(
  request: EventRequestData & { status: string; adminNotes?: string | null; quotePdfUrl?: string | null }
): Promise<void> {
  const statusLabels: Record<string, { label: string; color: string; msg: string }> = {
    CONFIRMED: { label: "CONFIRMÃ‰E", color: "#16a34a", msg: "Votre demande a Ã©tÃ© <strong>acceptÃ©e</strong>. Notre Ã©quipe vous contactera pour finaliser l'organisation." },
    REFUSED:   { label: "REFUSÃ‰E",   color: "#dc2626", msg: "Votre demande n'a pas pu Ãªtre acceptÃ©e. N'hÃ©sitez pas Ã  nous recontacter." },
    CANCELLED: { label: "ANNULÃ‰E",   color: "#f59e0b", msg: "Votre demande a Ã©tÃ© annulÃ©e." },
    COMPLETED: { label: "TERMINÃ‰E",  color: "#0284c7", msg: "Merci pour votre confiance ! Nous espÃ©rons avoir rÃ©pondu Ã  vos attentes." },
  };
  const s = statusLabels[request.status] ?? { label: request.status, color: GOLD, msg: "" };
  const html = layout(`
    <div style="margin-bottom:20px;">${badge(s.label, s.color)}</div>
    <h2 style="color:${BLUE};margin:0 0 8px;">Mise Ã  jour de votre demande</h2>
    <p style="color:#475569;font-size:14px;margin:0 0 16px;">
      Bonjour <strong>${request.clientFirstName}</strong>, ${s.msg}
    </p>
    <div style="background:#f8fafc;border-radius:10px;padding:16px;margin-bottom:16px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        ${infoRow("RÃ©fÃ©rence", request.reference)}
        ${infoRow("Ã‰vÃ©nement", request.eventType)}
        ${infoRow("Statut", s.label)}
      </table>
    </div>
    ${request.adminNotes ? `<div style="background:#fef9ec;border-left:4px solid ${GOLD};padding:12px 16px;border-radius:0 8px 8px 0;margin-bottom:16px;"><p style="margin:0;color:#475569;font-size:13px;"><strong>Message de l'Ã©quipe :</strong><br>${request.adminNotes}</p></div>` : ""}
    ${request.quotePdfUrl ? `<div style="text-align:center;">${button("TÃ©lÃ©charger le devis PDF", request.quotePdfUrl)}</div>` : ""}
  `);
  await send(request.clientEmail, `Demande Ã©vÃ©nement ${s.label} â€” ${request.reference}`, html);
}


