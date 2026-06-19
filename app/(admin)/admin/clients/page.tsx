"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Search, Plus, X, CheckCircle, UserCheck } from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";

type Client = {
  id: string; firstName: string; lastName: string; email: string;
  phone?: string; whatsapp?: string; role: string; emailVerified: boolean; createdAt: string;
  _count: { studioBookings: number; excursionBookings: number; eventRequests: number; hotelBookings: number };
};


export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", whatsapp: "", password: "", role: "CLIENT" });

  useEffect(() => {
    fetch("/api/admin/clients")
      .then(r => r.json())
      .then(d => { setClients(d.data ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = clients.filter(c =>
    search === "" ||
    `${c.firstName} ${c.lastName} ${c.email} ${c.phone ?? ""}`.toLowerCase().includes(search.toLowerCase())
  );

  const totalBookings = (c: Client) =>
    c._count.studioBookings + c._count.excursionBookings + c._count.eventRequests + c._count.hotelBookings;

  async function saveClient() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setClients(prev => [data.data, ...prev]);
        setShowModal(false);
        setForm({ firstName: "", lastName: "", email: "", phone: "", whatsapp: "", password: "", role: "CLIENT" });
      } else {
        alert(data.error ?? "Erreur lors de la crÃ©ation");
      }
    } catch {}
    setSaving(false);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
              <Users size={20} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#0c4a6e]">Clients</h1>
              <p className="text-gray-500 text-sm">{clients.length} compte(s) enregistre(s)</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-0 sm:flex-none">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Rechercher un client..." value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8] w-full sm:w-64" />
            </div>
            <button onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-[#c9a84c] hover:bg-[#b8973b] text-white font-bold px-4 py-2 rounded-xl transition-colors shadow-md text-sm whitespace-nowrap">
              <Plus size={15} /> Ajouter un client
            </button>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
          {[
            { label: "Total clients", value: clients.length, color: "text-blue-500", bg: "bg-blue-50", icon: Users },
            { label: "Email vÃ©rifiÃ©s", value: clients.filter(c => c.emailVerified).length, color: "text-green-500", bg: "bg-green-50", icon: CheckCircle },
            { label: "Administrateurs", value: clients.filter(c => c.role === "ADMIN" || c.role === "SUPER_ADMIN").length, color: "text-purple-500", bg: "bg-purple-50", icon: UserCheck },
          ].map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-xs mb-1 text-gray-400">{s.label}</p>
                  <p className="text-3xl font-black text-[#0c4a6e]">{s.value}</p>
                </div>
                <div className={`w-12 h-12 ${s.bg} rounded-xl flex items-center justify-center`}>
                  <Icon size={22} className={s.color} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <div className="w-1 h-5 bg-[#c9a84c] rounded-full" />
            <h2 className="font-bold text-[#0c4a6e]">Liste des clients</h2>
            <span className="ml-auto text-xs text-gray-400">{filtered.length} resultat(s)</span>
          </div>

          {loading ? (
            <div className="py-8 space-y-3 px-6">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <Users size={32} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium mb-1">Aucun client</p>
              <p className="text-sm">{search ? "Aucun resultat pour cette recherche." : "Les comptes clients apparaitront ici apres inscription."}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>{["Client", "Email", "Telephone", "Role", "Reservations", "Inscrit le", "WhatsApp"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(c => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#0c4a6e] text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                            {c.firstName[0]}{c.lastName[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-[#0c4a6e]">{c.firstName} {c.lastName}</p>
                            {!c.emailVerified && <span className="text-[10px] text-orange-500 font-medium">Email non verifie</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{c.email}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{c.phone ?? "â€”"}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${c.role === "ADMIN" || c.role === "SUPER_ADMIN" ? "bg-purple-100 text-purple-700" : "bg-blue-50 text-blue-600"}`}>
                          {c.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm font-bold text-[#0c4a6e]">{totalBookings(c)}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {new Date(c.createdAt).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="px-4 py-3">
                        {(c.whatsapp || c.phone) && (
                          <a href={`https://wa.me/${(c.whatsapp || c.phone)?.replace(/[\s\-().+]/g, "")}`}
                            target="_blank" rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-700 text-xs font-medium flex items-center gap-1">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                            Contacter
                          </a>
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

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="font-bold text-[#0c4a6e] text-lg">Ajouter un client</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-3 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">PrÃ©nom *</label>
                  <input required type="text" placeholder="Jean" value={form.firstName}
                    onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Nom *</label>
                  <input required type="text" placeholder="KouamÃ©" value={form.lastName}
                    onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Email *</label>
                <input required type="email" placeholder="jean@email.com" value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">TÃ©lÃ©phone</label>
                  <input type="tel" placeholder="07 XX XX XX XX" value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">WhatsApp</label>
                  <input type="tel" placeholder="07 XX XX XX XX" value={form.whatsapp}
                    onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Mot de passe (optionnel)</label>
                <input type="password" placeholder="Laissez vide pour gÃ©nÃ©rer automatiquement" value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">RÃ´le</label>
                <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8] bg-white">
                  <option value="CLIENT">Client</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50">Annuler</button>
              <button onClick={saveClient} disabled={saving || !form.firstName || !form.lastName || !form.email}
                className="flex-1 bg-[#c9a84c] hover:bg-[#b8973b] text-white font-bold py-2.5 rounded-xl disabled:opacity-60 transition-colors">
                {saving ? "CrÃ©ation..." : "CrÃ©er le client"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


