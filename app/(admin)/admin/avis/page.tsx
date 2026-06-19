"use client";
import { useEffect, useState } from "react";
import { Star, CheckCircle, Trash2, Clock, ListChecks } from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import ExportButton from "@/components/admin/ExportButton";

type Review = {
  id: string; serviceType: string; rating: number; comment?: string;
  isApproved: boolean; createdAt: string;
  user: { firstName: string; lastName: string };
};


export default function AdminAvisPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("pending");

  useEffect(() => {
    fetch("/api/reviews?all=true")
      .then(r => r.json())
      .then(d => { setReviews(d.data ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function approve(id: string) {
    await fetch(`/api/reviews/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isApproved: true }) });
    setReviews(prev => prev.map(r => r.id === id ? { ...r, isApproved: true } : r));
  }

  async function reject(id: string) {
    await fetch(`/api/reviews/${id}`, { method: "DELETE" });
    setReviews(prev => prev.filter(r => r.id !== id));
  }

  const filtered = reviews.filter(r => {
    if (filter === "pending") return !r.isApproved;
    if (filter === "approved") return r.isApproved;
    return true;
  });

  const pending = reviews.filter(r => !r.isApproved).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
            <Star size={20} className="text-yellow-500 fill-yellow-500" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#0c4a6e]">Avis clients</h1>
            <p className="text-gray-500 text-sm">{pending} avis en attente de modÃ©ration</p>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
          {[
            { label: "Total", value: reviews.length, color: "text-blue-500", bg: "bg-blue-50", icon: ListChecks, filterVal: "all" },
            { label: "En attente", value: pending, color: "text-yellow-500", bg: "bg-yellow-50", icon: Clock, filterVal: "pending" },
            { label: "ApprouvÃ©s", value: reviews.filter(r => r.isApproved).length, color: "text-green-500", bg: "bg-green-50", icon: CheckCircle, filterVal: "approved" },
          ].map(s => {
            const isActive = filter === s.filterVal;
            const Icon = s.icon;
            return (
              <button key={s.label} onClick={() => setFilter(s.filterVal as any)}
                className={"bg-white rounded-2xl p-5 shadow-sm border flex items-center justify-between w-full text-left transition-all cursor-pointer " +
                  (isActive ? "border-[#c9a84c] ring-2 ring-[#c9a84c]/30 shadow-md" : "border-gray-100 hover:border-[#c9a84c]/40 hover:shadow-md")}>
                <div>
                  <p className={"text-xs mb-1 " + (isActive ? "text-[#c9a84c] font-semibold" : "text-gray-400")}>{s.label}</p>
                  <p className="text-3xl font-black text-[#0c4a6e]">{s.value}</p>
                </div>
                <div className={`w-12 h-12 ${s.bg} rounded-xl flex items-center justify-center`}>
                  <Icon size={22} className={s.color} />
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between mb-6 gap-3">
          <div className="flex flex-wrap gap-2">
            {[["pending", "En attente"], ["approved", "ApprouvÃ©s"], ["all", "Tous"]].map(([val, label]) => (
              <button key={val} onClick={() => setFilter(val as any)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filter === val ? "bg-[#0c4a6e] text-white" : "bg-white text-gray-500 border border-gray-200"}`}>
                {label} {val === "pending" && pending > 0 && <span className="ml-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{pending}</span>}
              </button>
            ))}
          </div>
          <ExportButton
            data={filtered.map(r => ({
              client: r.user.firstName + " " + r.user.lastName,
              service: r.serviceType,
              note: r.rating + "/5",
              commentaire: r.comment ?? "â€”",
              statut: r.isApproved ? "ApprouvÃ©" : "En attente",
              date: new Date(r.createdAt).toLocaleDateString("fr-FR"),
            }))}
            columns={[
              { key: "client", label: "Client" },
              { key: "service", label: "Service" },
              { key: "note", label: "Note" },
              { key: "commentaire", label: "Commentaire" },
              { key: "statut", label: "Statut" },
              { key: "date", label: "Date" },
            ]}
            filename={"avis-clients-" + new Date().toISOString().split("T")[0]}
            label="Avis"
          />
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="bg-white rounded-2xl p-12 text-center text-gray-400">Chargement...</div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center text-gray-400">Aucun avis.</div>
          ) : filtered.map(r => (
            <div key={r.id} className={`bg-white rounded-2xl p-5 shadow-sm border ${!r.isApproved ? "border-yellow-200" : "border-gray-100"}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-[#0c4a6e]">{r.user.firstName} {r.user.lastName}</span>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{r.serviceType}</span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={13} className={i < r.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"} />
                      ))}
                    </div>
                    {!r.isApproved && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-semibold">En attente</span>}
                    {r.isApproved && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">ApprouvÃ©</span>}
                  </div>
                  {r.comment && <p className="text-gray-600 text-sm">{r.comment}</p>}
                  <p className="text-xs text-gray-400 mt-2">{new Date(r.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  {!r.isApproved && (
                    <button onClick={() => approve(r.id)} className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-colors">
                      <CheckCircle size={13} /> Approuver
                    </button>
                  )}
                  <button onClick={() => reject(r.id)} className="flex items-center gap-1 text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors">
                    <Trash2 size={13} /> Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


