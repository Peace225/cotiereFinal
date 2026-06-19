// GÃ©nÃ©rateur de PDF cÃ´tÃ© client avec jsPDF
// Usage: import { generateDevisPDF, generateVoucherPDF } from "@/lib/pdf"

export type DevisData = {
  reference: string;
  clientFirstName: string;
  clientLastName: string;
  clientEmail: string;
  clientPhone: string;
  eventType: string;
  eventDate: string;
  eventLocation: string;
  eventDuration?: string;
  guestCount?: number;
  services: string[];
  estimatedPriceMin?: number;
  estimatedPriceMax?: number;
  totalAmount?: number;
  adminNotes?: string;
  createdAt: string;
};

export type VoucherData = {
  reference: string;
  clientFirstName: string;
  clientLastName: string;
  clientPhone: string;
  excursionTitle: string;
  bookingDate: string;
  timeSlot?: string;
  adultsCount: number;
  childrenCount: number;
  guideLanguage?: string;
  totalAmount: number;
  depositAmount?: number;
};

export async function generateDevisPDF(data: DevisData): Promise<void> {
  const { jsPDF } = await import("jspdf");

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210;
  const margin = 20;
  let y = 20;

  // Charger le logo
  let logoDataUrl: string | null = null;
  try {
    const res = await fetch("/Images/cotiere-media-group.png");
    const blob = await res.blob();
    logoDataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  } catch {}

  // En-tÃªte
  doc.setFillColor(12, 74, 110); // #0c4a6e
  doc.rect(0, 0, W, 45, "F");

  if (logoDataUrl) {
    doc.addImage(logoDataUrl, "PNG", margin, 5, 40, 20);
  } else {
    doc.setTextColor(201, 168, 76);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("COTIERE MEDIA GROUP", margin, 18);
  }

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("1er site officiel des villes et villages du littoral ivoirien", margin, 32);
  doc.text("Tel: 07 47 72 29 31 | contact@cotiere.ci", margin, 39);

  y = 60;

  // Titre devis
  doc.setTextColor(12, 74, 110);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("DEVIS DE RESERVATION", margin, y);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text(`Reference: ${data.reference}`, W - margin - 60, y);
  y += 6;
  doc.text(`Date: ${new Date(data.createdAt).toLocaleDateString("fr-FR")}`, W - margin - 60, y);

  y += 12;
  doc.setDrawColor(201, 168, 76);
  doc.setLineWidth(0.5);
  doc.line(margin, y, W - margin, y);
  y += 10;

  // Infos client
  doc.setTextColor(12, 74, 110);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("INFORMATIONS CLIENT", margin, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(10);
  const clientLines = [
    [`Nom:`, `${data.clientFirstName} ${data.clientLastName}`],
    [`Email:`, data.clientEmail],
    [`Telephone:`, data.clientPhone],
  ];
  clientLines.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, margin, y);
    doc.setFont("helvetica", "normal");
    doc.text(value, margin + 30, y);
    y += 6;
  });

  y += 5;
  doc.setDrawColor(220, 220, 220);
  doc.line(margin, y, W - margin, y);
  y += 10;

  // DÃ©tails Ã©vÃ©nement
  doc.setTextColor(12, 74, 110);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("DETAILS DE L'EVENEMENT", margin, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(10);
  const eventLines: [string, string][] = [
    ["Type:", data.eventType],
    ["Date:", new Date(data.eventDate).toLocaleDateString("fr-FR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })],
    ["Lieu:", data.eventLocation],
  ];
  if (data.eventDuration) eventLines.push(["Duree:", data.eventDuration]);
  if (data.guestCount) eventLines.push(["Invites:", `${data.guestCount} personnes`]);
  eventLines.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, margin, y);
    doc.setFont("helvetica", "normal");
    doc.text(value, margin + 30, y);
    y += 6;
  });

  y += 5;
  doc.setDrawColor(220, 220, 220);
  doc.line(margin, y, W - margin, y);
  y += 10;

  // Services
  doc.setTextColor(12, 74, 110);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("SERVICES DEMANDES", margin, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(10);
  data.services.forEach(s => {
    doc.text(`â€¢ ${s}`, margin + 5, y);
    y += 6;
  });

  y += 5;
  doc.setDrawColor(220, 220, 220);
  doc.line(margin, y, W - margin, y);
  y += 10;

  // Tarif
  doc.setTextColor(12, 74, 110);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("ESTIMATION TARIFAIRE", margin, y);
  y += 7;
  doc.setFontSize(10);

  if (data.totalAmount) {
    doc.setFillColor(240, 249, 255);
    doc.rect(margin, y - 3, W - margin * 2, 12, "F");
    doc.setTextColor(12, 74, 110);
    doc.setFont("helvetica", "bold");
    doc.text("MONTANT TOTAL:", margin + 5, y + 5);
    doc.setFontSize(13);
    doc.text(`${data.totalAmount.toLocaleString("fr-FR")} FCFA`, W - margin - 50, y + 5);
    y += 18;
  } else if (data.estimatedPriceMin && data.estimatedPriceMax) {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(50, 50, 50);
    doc.text("Tarif indicatif:", margin, y);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(12, 74, 110);
    doc.text(`${data.estimatedPriceMin.toLocaleString("fr-FR")} - ${data.estimatedPriceMax.toLocaleString("fr-FR")} FCFA`, margin + 35, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.text("* Tarif indicatif - Devis definitif apres etude de votre demande", margin, y);
    y += 10;
  }

  if (data.adminNotes) {
    y += 5;
    doc.setTextColor(12, 74, 110);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("NOTES:", margin, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(10);
    const noteLines = doc.splitTextToSize(data.adminNotes, W - margin * 2);
    doc.text(noteLines, margin, y);
    y += noteLines.length * 5 + 5;
  }

  // Pied de page
  const footerY = 275;
  doc.setFillColor(12, 74, 110);
  doc.rect(0, footerY, W, 22, "F");
  if (logoDataUrl) {
    doc.addImage(logoDataUrl, "PNG", margin, footerY + 2, 20, 10);
  }
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("COTIERE MEDIA GROUP | 07 47 72 29 31 | contact@cotiere.ci", margin + (logoDataUrl ? 22 : 0), footerY + 8);
  doc.text("1er site officiel des villes et villages du littoral ivoirien", margin + (logoDataUrl ? 22 : 0), footerY + 15);

  doc.save(`Devis-${data.reference}.pdf`);
}

export async function generateVoucherPDF(data: VoucherData): Promise<void> {
  const { jsPDF } = await import("jspdf");

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210;
  const margin = 20;
  let y = 20;

  // Charger le logo
  let logoDataUrl: string | null = null;
  try {
    const res = await fetch("/Images/cotiere-media-group.png");
    const blob = await res.blob();
    logoDataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  } catch {}

  // En-tÃªte
  doc.setFillColor(12, 74, 110);
  doc.rect(0, 0, W, 45, "F");

  if (logoDataUrl) {
    doc.addImage(logoDataUrl, "PNG", margin, 5, 40, 20);
  } else {
    doc.setTextColor(201, 168, 76);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("COTIERE MEDIA GROUP", margin, 18);
  }

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("1er site officiel des villes et villages du littoral ivoirien", margin, 32);
  doc.text("Tel: 07 47 72 29 31", margin, 39);

  y = 60;

  // Titre voucher
  doc.setFillColor(201, 168, 76);
  doc.rect(margin, y - 5, W - margin * 2, 16, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("VOUCHER DE RESERVATION", W / 2, y + 5, { align: "center" });
  y += 20;

  // Reference
  doc.setTextColor(12, 74, 110);
  doc.setFontSize(11);
  doc.text(`Reference: ${data.reference}`, margin, y);
  y += 12;

  // Infos client
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("CLIENT", margin, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(50, 50, 50);
  doc.text(`${data.clientFirstName} ${data.clientLastName}`, margin, y);
  y += 5;
  doc.text(`Tel: ${data.clientPhone}`, margin, y);
  y += 12;

  // DÃ©tails excursion
  doc.setTextColor(12, 74, 110);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("DETAILS DE L'EXCURSION", margin, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(10);

  const details: [string, string][] = [
    ["Excursion:", data.excursionTitle],
    ["Date:", new Date(data.bookingDate).toLocaleDateString("fr-FR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })],
    ["Creneau:", data.timeSlot ?? "Non prÃ©cisÃ©"],
    ["Adultes:", `${data.adultsCount} personne(s)`],
    ["Enfants:", `${data.childrenCount} personne(s)`],
    ["Langue guide:", data.guideLanguage ?? "FranÃ§ais"],
  ];
  details.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, margin, y);
    doc.setFont("helvetica", "normal");
    doc.text(value, margin + 35, y);
    y += 7;
  });

  y += 5;
  // Montant
  doc.setFillColor(240, 249, 255);
  doc.rect(margin, y, W - margin * 2, 20, "F");
  doc.setTextColor(12, 74, 110);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("MONTANT TOTAL:", margin + 5, y + 8);
  doc.setFontSize(14);
  doc.text(`${data.totalAmount.toLocaleString("fr-FR")} FCFA`, W - margin - 50, y + 8);
  if (data.depositAmount) {
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Acompte (30%): ${data.depositAmount.toLocaleString("fr-FR")} FCFA`, margin + 5, y + 15);
  }
  y += 30;

  // Instructions
  doc.setTextColor(12, 74, 110);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("INSTRUCTIONS", margin, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(10);
  const instructions = [
    "â€¢ Presentez ce voucher le jour de l'excursion",
    "â€¢ Arrivez 15 minutes avant l'heure de depart",
    "â€¢ Portez des vetements confortables et de la creme solaire",
    "â€¢ En cas d'annulation, contactez-nous 48h a l'avance",
  ];
  instructions.forEach(line => { doc.text(line, margin, y); y += 6; });

  // Pied de page
  const footerY = 275;
  doc.setFillColor(12, 74, 110);
  doc.rect(0, footerY, W, 22, "F");
  if (logoDataUrl) {
    doc.addImage(logoDataUrl, "PNG", margin, footerY + 2, 20, 10);
  }
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.text("COTIERE MEDIA GROUP | 07 47 72 29 31 | contact@cotiere.ci", margin + (logoDataUrl ? 22 : 0), footerY + 8);
  doc.text("1er site officiel des villes et villages du littoral ivoirien", margin + (logoDataUrl ? 22 : 0), footerY + 15);

  doc.save(`Voucher-${data.reference}.pdf`);
}


