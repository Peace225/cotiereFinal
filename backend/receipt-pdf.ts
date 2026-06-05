/**
 * Générateur de reçu de paiement PDF — COTIERE MEDIA GROUP
 * Côté client uniquement (jsPDF)
 */

export type ReceiptData = {
  reference: string;
  paymentReference: string;
  clientFirstName: string;
  clientLastName: string;
  clientEmail?: string;
  clientPhone?: string;
  serviceLabel: string;
  serviceType: string;
  amount: number;
  method: string;
  transactionId?: string;
  paidAt: string;
};

const METHOD_LABELS: Record<string, string> = {
  ORANGE_MONEY: "Orange Money",
  MTN_MONEY: "MTN MoMo",
  MOOV_MONEY: "Moov Money",
  WAVE: "Wave",
  CASH: "Espèces",
  BANK_TRANSFER: "Virement bancaire",
};

export async function generateReceiptPDF(data: ReceiptData): Promise<void> {
  const { jsPDF } = await import("jspdf");

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210;
  const margin = 20;
  let y = 20;

  // En-tête
  doc.setFillColor(12, 74, 110);
  doc.rect(0, 0, W, 40, "F");
  doc.setTextColor(201, 168, 76);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("COTIERE MEDIA GROUP", margin, 18);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Votre partenaire multimedia sur le littoral ivoirien", margin, 28);
  doc.text("Tel: 07 47 72 29 31 | contact@cotiere.ci", margin, 35);

  y = 55;

  // Badge REÇU
  doc.setFillColor(201, 168, 76);
  doc.rect(margin, y - 5, W - margin * 2, 16, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("REÇU DE PAIEMENT", W / 2, y + 5, { align: "center" });
  y += 22;

  // Références
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Réf. paiement : ${data.paymentReference}`, margin, y);
  doc.text(`Date : ${new Date(data.paidAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}`, W - margin - 70, y);
  y += 12;

  doc.setDrawColor(201, 168, 76);
  doc.setLineWidth(0.5);
  doc.line(margin, y, W - margin, y);
  y += 10;

  // Infos client
  doc.setTextColor(12, 74, 110);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("CLIENT", margin, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(10);
  doc.text(`${data.clientFirstName} ${data.clientLastName}`, margin, y);
  y += 5;
  if (data.clientEmail) { doc.text(data.clientEmail, margin, y); y += 5; }
  if (data.clientPhone) { doc.text(`Tél : ${data.clientPhone}`, margin, y); y += 5; }
  y += 8;

  doc.setDrawColor(220, 220, 220);
  doc.line(margin, y, W - margin, y);
  y += 10;

  // Détail service
  doc.setTextColor(12, 74, 110);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("DÉTAIL DU SERVICE", margin, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(10);

  const rows: [string, string][] = [
    ["Service :", data.serviceType],
    ["Description :", data.serviceLabel],
    ["Référence :", data.reference],
  ];
  rows.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, margin, y);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(value, W - margin * 2 - 40);
    doc.text(lines, margin + 40, y);
    y += lines.length * 5 + 2;
  });

  y += 8;
  doc.setDrawColor(220, 220, 220);
  doc.line(margin, y, W - margin, y);
  y += 10;

  // Détail paiement
  doc.setTextColor(12, 74, 110);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("DÉTAIL DU PAIEMENT", margin, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(10);

  const payRows: [string, string][] = [
    ["Mode de paiement :", METHOD_LABELS[data.method] ?? data.method],
  ];
  if (data.transactionId) payRows.push(["N° transaction :", data.transactionId]);
  payRows.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, margin, y);
    doc.setFont("helvetica", "normal");
    doc.text(value, margin + 50, y);
    y += 6;
  });

  y += 8;

  // Montant total — encadré
  doc.setFillColor(240, 249, 255);
  doc.rect(margin, y, W - margin * 2, 22, "F");
  doc.setDrawColor(12, 74, 110);
  doc.setLineWidth(0.5);
  doc.rect(margin, y, W - margin * 2, 22);
  doc.setTextColor(12, 74, 110);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("MONTANT PAYÉ :", margin + 8, y + 9);
  doc.setFontSize(16);
  doc.setTextColor(201, 168, 76);
  doc.text(`${data.amount.toLocaleString("fr-FR")} FCFA`, W - margin - 8, y + 12, { align: "right" });
  y += 32;

  // Message de confirmation
  doc.setFillColor(236, 253, 245);
  doc.rect(margin, y, W - margin * 2, 16, "F");
  doc.setTextColor(22, 163, 74);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("✓  Paiement confirmé — Merci pour votre confiance !", W / 2, y + 10, { align: "center" });
  y += 26;

  // Pied de page
  const footerY = 275;
  doc.setFillColor(12, 74, 110);
  doc.rect(0, footerY, W, 22, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("COTIERE MEDIA GROUP | 07 47 72 29 31 | contact@cotiere.ci", margin, footerY + 8);
  doc.text("Ce reçu est un document officiel. Conservez-le précieusement.", margin, footerY + 15);

  doc.save(`Recu-${data.paymentReference}.pdf`);
}
