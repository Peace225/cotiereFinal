"use client";
import { useState } from "react";
import { Ticket, Loader2 } from "lucide-react";
import type { VoucherData } from "@/lib/pdf";

type Props = { data: VoucherData };

export default function VoucherButton({ data }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    try {
      const { generateVoucherPDF } = await import("@/lib/pdf");
      await generateVoucherPDF(data);
    } catch (e) {
      alert("Erreur lors de la génération du voucher");
    }
    setLoading(false);
  }

  return (
    <button onClick={handleGenerate} disabled={loading}
      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors disabled:opacity-60">
      {loading ? <Loader2 size={13} className="animate-spin" /> : <Ticket size={13} />}
      {loading ? "Génération..." : "Voucher PDF"}
    </button>
  );
}
