"use client";
import { useState } from "react";
import { Download, Loader2 } from "lucide-react";

type Column = { key: string; label: string };
type Row = Record<string, any>;

type Props = {
  data: Row[];
  columns: Column[];
  filename?: string;
  format?: "pdf" | "csv" | "both";
  label?: string;
};

export default function ExportButton({ data, columns, filename = "export", format = "both", label = "Exporter" }: Props) {
  const [loading, setLoading] = useState(false);

  async function exportCSV() {
    const header = columns.map(c => `"${c.label}"`).join(";");
    const rows = data.map(row =>
      columns.map(c => {
        const val = row[c.key] ?? "";
        return `"${String(val).replace(/"/g, '""')}"`;
      }).join(";")
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function exportPDF() {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const W = 297;
    const margin = 15;
    let y = 15;

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

    // En-tête
    doc.setFillColor(12, 74, 110);
    doc.rect(0, 0, W, 28, "F");

    if (logoDataUrl) {
      doc.addImage(logoDataUrl, "PNG", margin, 3, 28, 14);
    } else {
      doc.setTextColor(201, 168, 76);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("CÔTIÈRE MEDIA GROUP", margin, 12);
    }

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("1er site officiel des villes et villages du littoral ivoirien", margin + (logoDataUrl ? 30 : 0), 12);
    doc.text(`Rapport: ${filename} — ${new Date().toLocaleDateString("fr-FR")}`, margin + (logoDataUrl ? 30 : 0), 20);

    y = 38;

    // En-têtes colonnes
    const colW = (W - margin * 2) / columns.length;
    doc.setFillColor(240, 249, 255);
    doc.rect(margin, y - 5, W - margin * 2, 10, "F");
    doc.setTextColor(12, 74, 110);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    columns.forEach((col, i) => {
      doc.text(col.label.toUpperCase(), margin + i * colW + 2, y);
    });
    y += 8;

    // Lignes
    doc.setFont("helvetica", "normal");
    doc.setTextColor(50, 50, 50);
    data.forEach((row, ri) => {
      if (y > 185) {
        doc.addPage();
        y = 20;
      }
      if (ri % 2 === 0) {
        doc.setFillColor(248, 250, 252);
        doc.rect(margin, y - 4, W - margin * 2, 8, "F");
      }
      columns.forEach((col, i) => {
        const val = String(row[col.key] ?? "—");
        doc.text(val.slice(0, 20), margin + i * colW + 2, y);
      });
      y += 8;
    });

    // Pied de page
    doc.setFillColor(12, 74, 110);
    doc.rect(0, 195, W, 10, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text(`CÔTIÈRE MEDIA GROUP — ${data.length} enregistrement(s) — Généré le ${new Date().toLocaleDateString("fr-FR")}`, margin, 201);

    doc.save(`${filename}.pdf`);
  }

  async function handleExport(type: "pdf" | "csv") {
    setLoading(true);
    try {
      if (type === "csv") await exportCSV();
      else await exportPDF();
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  if (format === "csv") return (
    <button onClick={() => handleExport("csv")} disabled={loading || data.length === 0}
      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors disabled:opacity-50">
      {loading ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
      {label} CSV
    </button>
  );

  if (format === "pdf") return (
    <button onClick={() => handleExport("pdf")} disabled={loading || data.length === 0}
      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors disabled:opacity-50">
      {loading ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
      {label} PDF
    </button>
  );

  return (
    <div className="flex gap-2">
      <button onClick={() => handleExport("csv")} disabled={loading || data.length === 0}
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors disabled:opacity-50">
        {loading ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
        CSV
      </button>
      <button onClick={() => handleExport("pdf")} disabled={loading || data.length === 0}
        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors disabled:opacity-50">
        {loading ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
        PDF
      </button>
    </div>
  );
}
