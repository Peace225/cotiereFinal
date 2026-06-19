"use client";
import { useEffect, useState } from "react";
import { CreditCard, CheckCircle, XCircle, Clock, ListChecks } from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import ExportButton from "@/components/admin/ExportButton";

type Payment = {
  id: string; reference: string; amount: number; method: string;
  status: string; phoneNumber?: string; paidAt?: string; createdAt: string;
};

const STATUS_COLORS: Record<string, string> = {
  UNPAID: "bg-yellow-100 text-yellow-700",
  PARTIAL: "bg-blue-100 text-blue-700",
  PAID: "bg-green-100 text-green-700",
  REFUNDED: "bg-gray-100 text-gray-600",
};
const STATUS_LABELS: Record<string, string> = {
  UNPAID: "En attente", PARTIAL: "Partiel", PAID: "Paye", REFUNDED: "Rembourse",
};
const METHOD_LABELS: Record<string, string> = {
  ORANGE_MONEY: "Orange Money", MTN_MONEY: "MTN MoMo", WAVE: "Wave",
  MOOV_MONEY: "Moov Money", CASH: "Especes", BANK_TRANSFER: "Virement",
};


export default function AdminPaiementsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    fetch("/api/payments")
      .then(r => r.json())
      .then(d => { setPayments(d.data ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/payments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setPayments(prev => prev.map(p => p.id === id ? { ...p, status, paidAt: status === "PAID" ? new Date().toISOString() : p.paidAt } : p));
  }

  const filtered = payments.filter(p => filter === "ALL" || p.status === filter);
  const totalPaid = payments.filter(p => p.status === "PAID").reduce((s, p) => s + p.amount, 0);
  const pending = payments.filter(p => p.status === "UNPAID").length;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
            <CreditCard size={20} className="text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#0c4a6e]">Paiements</h1>
            <p className="text-gray-500 text-sm">{pending} en attente de confirmation</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
          {[
            { label: "Total paiements", value: payments.length, color: "text-blue-500", bg: "bg-blue-50", icon: ListChecks, filterVal: "ALL" },
            { label: "En attente", value: pending, color: "text-yellow-500", bg: "bg-yellow-50", icon: Clock, filterVal: "UNPAID" },
            { label: "CA confirmÃ©", value: totalPaid > 0 ? totalPaid.toLocaleString("fr-FR") + " FCFA" : "0 FCFA", color: "text-green-500", bg: "bg-green-50", icon: CheckCircle, filterVal: "PAID" },
          ].map(s => {
            const isActive = filter === s.filterVal;
            const Icon = s.icon;
            return (
              <button key={s.label} onClick={() => setFilter(s.filterVal)}
                className={"bg-white rounded-2xl p-5 shadow-sm border flex items-center justify-between w-full text-left transition-all cursor-pointer " +
                  (isActive ? "border-[#c9a84c] ring-2 ring-[#c9a84c]/30 shadow-md" : "border-gray-100 hover:border-[#c9a84c]/40 hover:shadow-md")}>
                <div>
                  <p className={"text-xs mb-1 " + (isActive ? "text-[#c9a84c] font-semibold" : "text-gray-400")}>{s.label}</p>
                  <p className="text-2xl font-black text-[#0c4a6e]">{s.value}</p>
                </div>
                <div className={`w-12 h-12 ${s.bg} rounded-xl flex items-center justify-center`}>
                  <Icon size={22} className={s.color} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Filtres */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {["ALL", "UNPAID", "PARTIAL", "PAID", "REFUNDED"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === f ? "bg-[#0c4a6e] text-white" : "bg-white text-gray-500 border border-gray-200"}`}>
              {f === "ALL" ? "Tous" : STATUS_LABELS[f]}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <div className="w-1 h-5 bg-green-500 rounded-full" />
            <h2 className="font-bold text-[#0c4a6e]">Historique des paiements</h2>
            <span className="ml-auto text-xs text-gray-400">{filtered.length} resultat(s)</span>
            <ExportButton
              data={filtered.map(p => ({
                reference: p.reference ?? p.id,
                montant: p.amount.toLocaleString("fr-FR") + " FCFA",
                methode: METHOD_LABELS[p.method] ?? p.method,
                numero: p.phoneNumber ?? "â€”",
                statut: STATUS_LABELS[p.status] ?? p.status,
                date: new Date(p.createdAt).toLocaleDateString("fr-FR"),
                date_paiement: p.paidAt ? new Date(p.paidAt).toLocaleDateString("fr-FR") : "â€”",
              }))}
              columns={[
                { key: "reference", label: "RÃ©fÃ©rence" },
                { key: "montant", label: "Montant" },
                { key: "methode", label: "MÃ©thode" },
                { key: "numero", label: "NumÃ©ro" },
                { key: "statut", label: "Statut" },
                { key: "date", label: "Date crÃ©ation" },
                { key: "date_paiement", label: "Date paiement" },
              ]}
              filename={"paiements-" + new Date().toISOString().split("T")[0]}
              label="Paiements"
            />
          </div>

          {loading ? (
            <div className="py-8 space-y-3 px-6">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-gray-400">Aucun paiement.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>{["Reference", "Montant", "Methode", "Numero", "Statut", "Date", "Action"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs text-gray-400">{p.reference}</td>
                      <td className="px-4 py-3 font-bold text-[#0c4a6e]">{p.amount.toLocaleString("fr-FR")} FCFA</td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{METHOD_LABELS[p.method] ?? p.method}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{p.phoneNumber ?? "â€”"}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${STATUS_COLORS[p.status]}`}>
                          {STATUS_LABELS[p.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {new Date(p.createdAt).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="px-4 py-3">
                        {p.status === "UNPAID" && (
                          <div className="flex gap-1">
                            <button onClick={() => updateStatus(p.id, "PAID")}
                              className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 hover:bg-green-100 px-2.5 py-1.5 rounded-lg transition-colors">
                              <CheckCircle size={12} /> Confirmer
                            </button>
                            <button onClick={() => updateStatus(p.id, "REFUNDED")}
                              className="flex items-center gap-1 text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-lg transition-colors">
                              <XCircle size={12} /> Refuser
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


