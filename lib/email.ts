/**
 * Service d'envoi d'emails — COTIERE MEDIA GROUP
 * Utilise Resend (https://resend.com)
 * En local : configure RESEND_API_KEY dans .env
 * Sans clé : les emails sont loggés dans la console (mode dev)
 */

import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM = "COTIERE MEDIA GROUP <noreply@cotiere.ci>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@cotiere.ci";
const BASE_URL = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

// ─── Couleurs brand ───────────────────────────────────────────
const GOLD = "#c9a84c";
const BLUE = "#0c4a6e";

// ─── Layout HTML commun ───────────────────────────────────────
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
              COTIERE MEDIA GROUP — Littoral Ivoirien<br>
              📞 07 47 72 29 31 / 05 86 87 89 20 / 01 02 17 18 03<br>
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

// ─── Envoi générique ──────────────────────────────────────────
async function send(to: string, subject: string, html: string): Promise<void> {
  if (!resend) {
    // Mode dev sans clé : log dans la console
    console.log("\n📧 [EMAIL - MODE DEV]");
    console.log(`  À      : ${to}`);
    console.log(`  Sujet  : ${subject}`);
    console.log("  (Configurez RESEND_API_KEY dans .env pour envoyer de vrais emails)\n");
    return;
  }
  try {
    await resend.emails.send({ from: FROM, to, subject, html });
  } catch (err) {
    console.error("[EMAIL ERROR]", err);
    // Ne pas faire planter l'app si l'email échoue
  }
}

// ═══════════════════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════════════════

export async function sendVerificationEmail(email: string, token: string): Promise<void> {
  const link = `${BASE_URL}/api/auth/verify-email?token=${token}`;
  const html = layout(`
    <h2 style="color:${BLUE};margin:0 0 8px;">Vérifiez votre adresse email</h2>
    <p style="color:#475569;font-size:14px;margin:0 0 24px;">
      Bienvenue sur COTIERE MEDIA GROUP ! Cliquez sur le bouton ci-dessous pour activer votre compte.
    </p>
    <div style="text-align:center;margin:24px 0;">
      ${button("Vérifier mon email", link)}
    </div>
    <p style="color:#94a3b8;font-size:12px;margin-top:24px;">
      Ce lien expire dans 24h. Si vous n'avez pas créé de compte, ignorez cet email.
    </p>
  `);
  await send(email, "Vérifiez votre adresse email — COTIERE", html);
}

export async function sendResetPasswordEmail(email: string, token: string): Promise<void> {
  const link = `${BASE_URL}/reinitialiser-mot-de-passe?token=${token}`;
  const html = layout(`
    <h2 style="color:${BLUE};margin:0 0 8px;">Réinitialisation de mot de passe</h2>
    <p style="color:#475569;font-size:14px;margin:0 0 24px;">
      Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous.
    </p>
    <div style="text-align:center;margin:24px 0;">
      ${button("Réinitialiser mon mot de passe", link)}
    </div>
    <p style="color:#94a3b8;font-size:12px;margin-top:24px;">
      Ce lien expire dans 1h. Si vous n'avez pas fait cette demande, ignorez cet email.
    </p>
  `);
  await send(email, "Réinitialisation de mot de passe — COTIERE", html);
}

// ═══════════════════════════════════════════════════════════════
// STUDIO+
// ═══════════════════════════════════════════════════════════════

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
  const servicesList = booking.services.map(s => `<li style="margin:4px 0;color:#475569;font-size:13px;">• ${s}</li>`).join("");
  const priceRange = booking.estimatedPriceMin && booking.estimatedPriceMax
    ? `${booking.estimatedPriceMin.toLocaleString("fr-FR")} – ${booking.estimatedPriceMax.toLocaleString("fr-FR")} FCFA`
    : "Devis sur mesure";

  const html = layout(`
    <div style="margin-bottom:20px;">${badge("HBL Studio+")}</div>
    <h2 style="color:${BLUE};margin:0 0 8px;">Demande reçue !</h2>
    <p style="color:#475569;font-size:14px;margin:0 0 24px;">
      Bonjour <strong>${booking.clientFirstName}</strong>, nous avons bien reçu votre demande de réservation.
      Notre équipe vous contactera dans les <strong>24 à 48h</strong> avec un devis détaillé.
    </p>
    <div style="background:#f8fafc;border-radius:10px;padding:20px;margin-bottom:24px;">
      <p style="margin:0 0 12px;font-weight:700;color:${BLUE};font-size:13px;">RÉCAPITULATIF DE VOTRE DEMANDE</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${infoRow("Référence", booking.reference)}
        ${infoRow("Type d'événement", booking.eventType)}
        ${infoRow("Date", date)}
        ${infoRow("Créneau", booking.eventTimeSlot)}
        ${infoRow("Lieu", booking.eventLocation)}
        ${infoRow("Tarif indicatif", priceRange)}
      </table>
    </div>
    <p style="color:#475569;font-size:13px;margin:0 0 8px;font-weight:600;">Services demandés :</p>
    <ul style="margin:0 0 24px;padding:0;list-style:none;">${servicesList}</ul>
    <p style="color:#94a3b8;font-size:12px;">
      Conservez votre numéro de référence : <strong style="color:${BLUE};">${booking.reference}</strong>
    </p>
  `);
  await send(booking.clientEmail, `Demande STUDIO+ reçue — ${booking.reference}`, html);
}

export async function sendStudioBookingAdminNotif(booking: StudioBookingData): Promise<void> {
  const date = new Date(booking.eventDate).toLocaleDateString("fr-FR", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
  const html = layout(`
    <div style="margin-bottom:20px;">${badge("NOUVELLE DEMANDE STUDIO+", "#ef4444")}</div>
    <h2 style="color:${BLUE};margin:0 0 16px;">Nouvelle demande de réservation</h2>
    <div style="background:#f8fafc;border-radius:10px;padding:20px;margin-bottom:24px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        ${infoRow("Référence", booking.reference)}
        ${infoRow("Client", `${booking.clientFirstName} ${booking.clientLastName}`)}
        ${infoRow("Email", booking.clientEmail)}
        ${infoRow("Type d'événement", booking.eventType)}
        ${infoRow("Date", date)}
        ${infoRow("Lieu", booking.eventLocation)}
      </table>
    </div>
    <div style="text-align:center;">
      ${button("Voir dans le dashboard", `${BASE_URL}/admin/studio`)}
    </div>
  `);
  await send(ADMIN_EMAIL, `[STUDIO+] Nouvelle demande — ${booking.reference}`, html);
}

export async function sendStudioStatusUpdate(
  booking: StudioBookingData & { clientEmail: string; status: string; adminNotes?: string | null; quotePdfUrl?: string | null }
): Promise<void> {
  const statusLabels: Record<string, { label: string; color: string; msg: string }> = {
    CONFIRMED: { label: "CONFIRMÉE", color: "#16a34a", msg: "Votre réservation a été <strong>confirmée</strong>. Notre équipe vous contactera pour finaliser les détails." },
    REFUSED:   { label: "REFUSÉE",   color: "#dc2626", msg: "Votre demande n'a pas pu être acceptée pour cette date. N'hésitez pas à nous recontacter pour une autre date." },
    CANCELLED: { label: "ANNULÉE",   color: "#f59e0b", msg: "Votre réservation a été annulée." },
    COMPLETED: { label: "TERMINÉE",  color: "#0284c7", msg: "Merci pour votre confiance ! Nous espérons vous revoir bientôt." },
  };
  const s = statusLabels[booking.status] ?? { label: booking.status, color: GOLD, msg: "" };
  const html = layout(`
    <div style="margin-bottom:20px;">${badge(s.label, s.color)}</div>
    <h2 style="color:${BLUE};margin:0 0 8px;">Mise à jour de votre réservation</h2>
    <p style="color:#475569;font-size:14px;margin:0 0 16px;">
      Bonjour <strong>${booking.clientFirstName}</strong>, ${s.msg}
    </p>
    <div style="background:#f8fafc;border-radius:10px;padding:16px;margin-bottom:16px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        ${infoRow("Référence", booking.reference)}
        ${infoRow("Statut", s.label)}
      </table>
    </div>
    ${booking.adminNotes ? `<div style="background:#fef9ec;border-left:4px solid ${GOLD};padding:12px 16px;border-radius:0 8px 8px 0;margin-bottom:16px;"><p style="margin:0;color:#475569;font-size:13px;"><strong>Message de l'équipe :</strong><br>${booking.adminNotes}</p></div>` : ""}
    ${booking.quotePdfUrl ? `<div style="text-align:center;">${button("Télécharger le devis PDF", booking.quotePdfUrl)}</div>` : ""}
  `);
  await send(booking.clientEmail, `Réservation STUDIO+ ${s.label} — ${booking.reference}`, html);
}

// ═══════════════════════════════════════════════════════════════
// EXCURSIONS
// ═══════════════════════════════════════════════════════════════

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
    <h2 style="color:${BLUE};margin:0 0 8px;">Réservation confirmée !</h2>
    <p style="color:#475569;font-size:14px;margin:0 0 24px;">
      Bonjour <strong>${booking.clientFirstName}</strong>, votre réservation d'excursion a bien été enregistrée.
      Vous recevrez une confirmation définitive sous 24h.
    </p>
    <div style="background:#f8fafc;border-radius:10px;padding:20px;margin-bottom:24px;">
      <p style="margin:0 0 12px;font-weight:700;color:${BLUE};font-size:13px;">DÉTAILS DE VOTRE EXCURSION</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${infoRow("Référence", booking.reference)}
        ${infoRow("Excursion", booking.excursionTitle)}
        ${infoRow("Date", date)}
        ${infoRow("Créneau", booking.timeSlot)}
        ${infoRow("Langue du guide", booking.guideLanguage)}
        ${infoRow("Adultes", String(booking.adultsCount))}
        ${infoRow("Enfants", String(booking.childrenCount))}
        ${infoRow("Montant total", `${booking.totalAmount.toLocaleString("fr-FR")} FCFA`)}
        ${booking.depositAmount ? infoRow("Acompte (30%)", `${booking.depositAmount.toLocaleString("fr-FR")} FCFA`) : ""}
      </table>
    </div>
    <div style="background:#ecfdf5;border-radius:10px;padding:16px;margin-bottom:16px;">
      <p style="margin:0;color:#166534;font-size:13px;">
        📍 <strong>Point de rendez-vous :</strong> Notre équipe vous communiquera le lieu exact de rendez-vous par email ou téléphone.
      </p>
    </div>
    <p style="color:#94a3b8;font-size:12px;">Référence : <strong style="color:${BLUE};">${booking.reference}</strong></p>
  `);
  await send(booking.clientEmail, `Excursion réservée — ${booking.reference}`, html);
}

export async function sendExcursionBookingAdminNotif(booking: ExcursionBookingData): Promise<void> {
  const date = new Date(booking.bookingDate).toLocaleDateString("fr-FR", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
  const html = layout(`
    <div style="margin-bottom:20px;">${badge("NOUVELLE RÉSERVATION EXCURSION", "#ef4444")}</div>
    <h2 style="color:${BLUE};margin:0 0 16px;">Nouvelle réservation d'excursion</h2>
    <div style="background:#f8fafc;border-radius:10px;padding:20px;margin-bottom:24px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        ${infoRow("Référence", booking.reference)}
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
  await send(ADMIN_EMAIL, `[EXCURSION] Nouvelle réservation — ${booking.reference}`, html);
}

export async function sendExcursionStatusUpdate(
  booking: ExcursionBookingData & { status: string; adminNotes?: string | null; voucherPdfUrl?: string | null }
): Promise<void> {
  const statusLabels: Record<string, { label: string; color: string; msg: string }> = {
    CONFIRMED: { label: "CONFIRMÉE", color: "#16a34a", msg: "Votre excursion est <strong>confirmée</strong> ! Préparez-vous pour une belle aventure." },
    REFUSED:   { label: "REFUSÉE",   color: "#dc2626", msg: "Votre réservation n'a pas pu être acceptée. Contactez-nous pour trouver une alternative." },
    CANCELLED: { label: "ANNULÉE",   color: "#f59e0b", msg: "Votre réservation a été annulée." },
    COMPLETED: { label: "TERMINÉE",  color: "#0284c7", msg: "Merci d'avoir choisi COTIERE TOURISM ! Nous espérons que vous avez passé un excellent moment." },
  };
  const s = statusLabels[booking.status] ?? { label: booking.status, color: GOLD, msg: "" };
  const html = layout(`
    <div style="margin-bottom:20px;">${badge(s.label, s.color)}</div>
    <h2 style="color:${BLUE};margin:0 0 8px;">Mise à jour de votre excursion</h2>
    <p style="color:#475569;font-size:14px;margin:0 0 16px;">
      Bonjour <strong>${booking.clientFirstName}</strong>, ${s.msg}
    </p>
    <div style="background:#f8fafc;border-radius:10px;padding:16px;margin-bottom:16px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        ${infoRow("Référence", booking.reference)}
        ${infoRow("Excursion", booking.excursionTitle)}
        ${infoRow("Statut", s.label)}
      </table>
    </div>
    ${booking.adminNotes ? `<div style="background:#fef9ec;border-left:4px solid ${GOLD};padding:12px 16px;border-radius:0 8px 8px 0;margin-bottom:16px;"><p style="margin:0;color:#475569;font-size:13px;"><strong>Message de l'équipe :</strong><br>${booking.adminNotes}</p></div>` : ""}
    ${booking.voucherPdfUrl ? `<div style="text-align:center;">${button("Télécharger votre voucher", booking.voucherPdfUrl)}</div>` : ""}
  `);
  await send(booking.clientEmail, `Excursion ${s.label} — ${booking.reference}`, html);
}

// ═══════════════════════════════════════════════════════════════
// EVENTS & ORGANISATION
// ═══════════════════════════════════════════════════════════════

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
  const servicesList = request.services.map(s => `<li style="margin:4px 0;color:#475569;font-size:13px;">• ${s}</li>`).join("");
  const html = layout(`
    <div style="margin-bottom:20px;">${badge("COTIERE EVENT & ORGANISATION")}</div>
    <h2 style="color:${BLUE};margin:0 0 8px;">Demande reçue !</h2>
    <p style="color:#475569;font-size:14px;margin:0 0 24px;">
      Bonjour <strong>${request.clientFirstName}</strong>, nous avons bien reçu votre demande d'organisation d'événement.
      Notre équipe vous enverra un devis personnalisé dans les <strong>24 à 48h</strong>.
    </p>
    <div style="background:#f8fafc;border-radius:10px;padding:20px;margin-bottom:24px;">
      <p style="margin:0 0 12px;font-weight:700;color:${BLUE};font-size:13px;">RÉCAPITULATIF DE VOTRE DEMANDE</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${infoRow("Référence", request.reference)}
        ${infoRow("Type d'événement", request.eventType)}
        ${infoRow("Date", date)}
        ${infoRow("Lieu", request.eventLocation)}
        ${infoRow("Nombre d'invités", String(request.guestCount))}
        ${request.budget ? infoRow("Budget indicatif", request.budget) : ""}
      </table>
    </div>
    <p style="color:#475569;font-size:13px;margin:0 0 8px;font-weight:600;">Services demandés :</p>
    <ul style="margin:0 0 24px;padding:0;list-style:none;">${servicesList}</ul>
    <p style="color:#94a3b8;font-size:12px;">Référence : <strong style="color:${BLUE};">${request.reference}</strong></p>
  `);
  await send(request.clientEmail, `Demande événement reçue — ${request.reference}`, html);
}

export async function sendEventRequestAdminNotif(request: EventRequestData): Promise<void> {
  const date = new Date(request.eventDate).toLocaleDateString("fr-FR", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
  const html = layout(`
    <div style="margin-bottom:20px;">${badge("NOUVELLE DEMANDE ÉVÉNEMENT", "#ef4444")}</div>
    <h2 style="color:${BLUE};margin:0 0 16px;">Nouvelle demande d'organisation</h2>
    <div style="background:#f8fafc;border-radius:10px;padding:20px;margin-bottom:24px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        ${infoRow("Référence", request.reference)}
        ${infoRow("Client", `${request.clientFirstName} ${request.clientLastName}`)}
        ${infoRow("Email", request.clientEmail)}
        ${infoRow("Type d'événement", request.eventType)}
        ${infoRow("Date", date)}
        ${infoRow("Lieu", request.eventLocation)}
        ${infoRow("Invités", String(request.guestCount))}
        ${request.budget ? infoRow("Budget", request.budget) : ""}
      </table>
    </div>
    <div style="text-align:center;">
      ${button("Voir dans le dashboard", `${BASE_URL}/admin/evenements`)}
    </div>
  `);
  await send(ADMIN_EMAIL, `[EVENT] Nouvelle demande — ${request.reference}`, html);
}

export async function sendEventStatusUpdate(
  request: EventRequestData & { status: string; adminNotes?: string | null; quotePdfUrl?: string | null }
): Promise<void> {
  const statusLabels: Record<string, { label: string; color: string; msg: string }> = {
    CONFIRMED: { label: "CONFIRMÉE", color: "#16a34a", msg: "Votre demande a été <strong>acceptée</strong>. Notre équipe vous contactera pour finaliser l'organisation." },
    REFUSED:   { label: "REFUSÉE",   color: "#dc2626", msg: "Votre demande n'a pas pu être acceptée. N'hésitez pas à nous recontacter." },
    CANCELLED: { label: "ANNULÉE",   color: "#f59e0b", msg: "Votre demande a été annulée." },
    COMPLETED: { label: "TERMINÉE",  color: "#0284c7", msg: "Merci pour votre confiance ! Nous espérons avoir répondu à vos attentes." },
  };
  const s = statusLabels[request.status] ?? { label: request.status, color: GOLD, msg: "" };
  const html = layout(`
    <div style="margin-bottom:20px;">${badge(s.label, s.color)}</div>
    <h2 style="color:${BLUE};margin:0 0 8px;">Mise à jour de votre demande</h2>
    <p style="color:#475569;font-size:14px;margin:0 0 16px;">
      Bonjour <strong>${request.clientFirstName}</strong>, ${s.msg}
    </p>
    <div style="background:#f8fafc;border-radius:10px;padding:16px;margin-bottom:16px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        ${infoRow("Référence", request.reference)}
        ${infoRow("Événement", request.eventType)}
        ${infoRow("Statut", s.label)}
      </table>
    </div>
    ${request.adminNotes ? `<div style="background:#fef9ec;border-left:4px solid ${GOLD};padding:12px 16px;border-radius:0 8px 8px 0;margin-bottom:16px;"><p style="margin:0;color:#475569;font-size:13px;"><strong>Message de l'équipe :</strong><br>${request.adminNotes}</p></div>` : ""}
    ${request.quotePdfUrl ? `<div style="text-align:center;">${button("Télécharger le devis PDF", request.quotePdfUrl)}</div>` : ""}
  `);
  await send(request.clientEmail, `Demande événement ${s.label} — ${request.reference}`, html);
}
