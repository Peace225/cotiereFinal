"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, CalendarOff } from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";


type BlockedDate = { id: string; date: string; blockReason?: string; room?: { name: string }; excursion?: { title: string } };
type Room = { id: string; name: string };
type Excursion = { id: string; title: string };

export default function AdminCalendrierPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [excursions, setExcursions] = useState<Excursion[]>([]);
  const [blockedRooms, setBlockedRooms] = useState<BlockedDate[]>([]);
  const [blockedExcursions, setBlockedExcursions] = useState<BlockedDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"rooms" | "excursions">("rooms");
  const [form, setForm] = useState({ serviceId: "", date: "", reason: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/rooms").then(r => r.json()),
      fetch("/api/excursions").then(r => r.json()),
      fetch("/api/availability").then(r => r.json()),
    ]).then(([rData, eData, aData]) => {
      setRooms(rData.data ?? []);
      setExcursions(eData.data ?? []);
      setBlockedRooms(aData.data?.rooms ?? []);
      setBlockedExcursions(aData.data?.excursions ?? []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  async function blockDate() {
    if (!form.serviceId || !form.date) return;
    setSaving(true);
    try {
      const res = await fetch("/api/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceType: tab === "rooms" ? "room" : "excursion", serviceId: form.serviceId, date: form.date, reason: form.reason }),
      });
      const data = await res.json();
      if (res.ok) {
        const service = tab === "rooms"
          ? rooms.find(r => r.id === form.serviceId)
          : excursions.find(e => e.id === form.serviceId);
        const newBlock = { ...data.data, ...(tab === "rooms" ? { room: { name: (service as Room)?.name } } : { excursion: { title: (service as Excursion)?.title } }) };
        if (tab === "rooms") setBlockedRooms(prev => [...prev, newBlock]);
        else setBlockedExcursions(prev => [...prev, newBlock]);
        setForm({ serviceId: "", date: "", reason: "" });
      } else {
        alert(`Erreur ${res.status} : ${data.error ?? "Impossible de bloquer cette date."}\nVérifiez que vous êtes connecté en tant qu'admin.`);
      }
    } catch {
      alert("Erreur réseau. Vérifiez votre connexion et réessayez.");
    }
    setSaving(false);
  }

  async function unblock(id: string, serviceType: "room" | "excursion") {
    if (!confirm("Débloquer cette date ?")) return;
    await fetch("/api/availability", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serviceType, id }),
    });
    if (serviceType === "room") setBlockedRooms(prev => prev.filter(b => b.id !== id));
    else setBlockedExcursions(prev => prev.filter(b => b.id !== id));
  }

  const blocked = tab === "rooms" ? blockedRooms : blockedExcursions;
  const services = tab === "rooms" ? rooms : excursions;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
            <CalendarOff size={20} className="text-orange-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#0c4a6e]">Calendrier de disponibilité</h1>
            <p className="text-gray-500 text-sm">Bloquer des dates pour les chambres et excursions</p>
          </div>
        </div>

        {/* Onglets */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => setTab("rooms")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "rooms" ? "bg-[#0c4a6e] text-white" : "bg-white text-gray-500 border border-gray-200"}`}>
            Chambres ({blockedRooms.length} bloquées)
          </button>
          <button onClick={() => setTab("excursions")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "excursions" ? "bg-[#0c4a6e] text-white" : "bg-white text-gray-500 border border-gray-200"}`}>
            Excursions ({blockedExcursions.length} bloquées)
          </button>
        </div>

        {/* Formulaire blocage */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <h2 className="font-bold text-[#0c4a6e] mb-4 flex items-center gap-2">
            <Plus size={16} /> Bloquer une date
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                {tab === "rooms" ? "Chambre" : "Excursion"} *
              </label>
              <select value={form.serviceId} onChange={e => setForm(f => ({ ...f, serviceId: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8] bg-white">
                <option value="">Sélectionner...</option>
                {services.map((s: any) => (
                  <option key={s.id} value={s.id}>{s.name ?? s.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Date *</label>
              <input type="date" value={form.date} min={new Date().toISOString().split("T")[0]}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Raison (optionnel)</label>
              <input type="text" placeholder="Maintenance, événement privé..." value={form.reason}
                onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" />
            </div>
          </div>
          <button onClick={blockDate} disabled={saving || !form.serviceId || !form.date}
            className="mt-4 flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50 text-sm">
            <CalendarOff size={15} />
            {saving ? "Blocage en cours..." : "Bloquer cette date"}
          </button>
        </div>

        {/* Liste des dates bloquées */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <div className="w-1 h-5 bg-orange-500 rounded-full" />
            <h2 className="font-bold text-[#0c4a6e]">Dates bloquées</h2>
            <span className="ml-auto text-xs text-gray-400">{blocked.length} date(s)</span>
          </div>
          {loading ? (
            <div className="py-12 text-center text-gray-400">Chargement...</div>
          ) : blocked.length === 0 ? (
            <div className="py-12 text-center text-gray-400">Aucune date bloquée.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {[tab === "rooms" ? "Chambre" : "Excursion", "Date bloquée", "Raison", "Action"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {blocked.map(b => (
                    <tr key={b.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-[#0c4a6e] text-sm">
                        {b.room?.name ?? b.excursion?.title ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-sm">
                        {new Date(b.date).toLocaleDateString("fr-FR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{b.blockReason ?? "—"}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => unblock(b.id, tab === "rooms" ? "room" : "excursion")}
                          className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors">
                          <Trash2 size={12} /> Débloquer
                        </button>
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
