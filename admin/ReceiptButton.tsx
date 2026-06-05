"use client";
import { useState } from "react";
import { Receipt, Loader2 } from "lucide-react";
import type { ReceiptData } from "@/lib/receipt-pdf";

type Props = { data: ReceiptData; label?: string };

export default function ReceiptButton({ data, label = "Reçu PDF" }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    try {
      const { generateReceiptPDF } = await import("@/lib/receipt-pdf");
      await generateReceiptPDF(data);
    } catch {
      alert("Erreur lors de la génération du reçu");
    }
    setLoading(false);
  }

  return (
    <button
      onClick={handleGenerate}
      disabled={loading}
      className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors disabled:opacity-60"
    >
      {loading ? <Loader2 size={13} className="animate-spin" /> : <Receipt size={13} />}
      {loading ? "Génération..." : label}
    </button>
  );
}
