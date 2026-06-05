"use client";
import { useState } from "react";
import { FileText, Loader2 } from "lucide-react";
import type { DevisData } from "@/lib/pdf";

type Props = {
  data: DevisData;
  label?: string;
};

export default function DevisButton({ data, label = "Générer devis PDF" }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    try {
      const { generateDevisPDF } = await import("@/lib/pdf");
      await generateDevisPDF(data);
    } catch (e) {
      console.error(e);
      alert("Erreur lors de la génération du PDF");
    }
    setLoading(false);
  }

  return (
    <button onClick={handleGenerate} disabled={loading}
      className="flex items-center gap-2 bg-[#0c4a6e] hover:bg-[#0a3d5c] text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors disabled:opacity-60">
      {loading ? <Loader2 size={13} className="animate-spin" /> : <FileText size={13} />}
      {loading ? "Génération..." : label}
    </button>
  );
}
