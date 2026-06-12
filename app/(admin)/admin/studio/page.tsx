"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Calendar, Package, Clock, CheckCircle, XCircle } from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import ImageUploader from "@/components/admin/ImageUploader";

// --- Types ---
type Booking = { id: string; reference: string; clientFirstName: string; clientLastName: string; clientPhone: string; eventType: string; status: string; createdAt?: string; };
type Service = { id: string; label: string; description: string; image: string; isActive: boolean };

const STATUS_COLORS: any = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  CONFIRMED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  REFUSED: "bg-rose-50 text-rose-700 border-rose-200"
};

export default function AdminStudioPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [tab, setTab] = useState<"reservations" | "services">("reservations");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ label: "", description: "", image: "" });
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/studio/bookings?limit=500").then(r => r.json()),
      fetch("/api/studio/services").then(r => r.json())
    ]).then(([b, s]) => {
      setBookings(b.data?.bookings ?? []);
      setServices(s.data ?? []);
    });
  }, []);

  async function saveService() {
    const res = await fetch(editId ? `/api/studio/services/${editId}` : "/api/studio/services", {
      method: editId ? "PATCH" : "POST",
      body: JSON.stringify(form)
    });
    if (res.ok) {
      const { data } = await res.json();
      setServices(prev => editId ? prev.map(s => s.id === editId ? data : s) : [...prev, data]);
      setShowModal(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNavbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#0c4a6e] tracking-tight">HBL Studio+</h1>
            <p className="text-slate-500 text-sm mt-1">Gestion administrative et opérationnelle du studio.</p>
          </div>
          <button onClick={() => { setEditId(null); setShowModal(true); }} 
            className="bg-[#0c4a6e] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-[#083344] transition-all shadow-lg shadow-[#0c4a6e]/20">
            <Plus size={18} /> Nouvelle prestation
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {[ { id: "reservations", label: "Réservations", icon: Calendar }, { id: "services", label: "Prestations", icon: Package } ].map(item => (
            <button key={item.id} onClick={() => setTab(item.id as any)} 
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${tab === item.id ? "bg-[#c9a84c] text-white shadow-md" : "bg-white text-slate-600 border border-slate-200"}`}>
              <item.icon size={18} /> {item.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {tab === "services" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map(s => (
              <div key={s.id} className="bg-white rounded-3xl p-3 shadow-sm border border-slate-100 hover:shadow-lg transition-all">
                <div className="h-40 bg-slate-100 rounded-2xl overflow-hidden relative">
                  <img src={s.image} className="w-full h-full object-cover" alt={s.label} />
                  <button onClick={() => { setEditId(s.id); setForm(s); setShowModal(true); }} className="absolute top-2 right-2 p-2 bg-white/90 rounded-full text-slate-700 hover:text-[#c9a84c]"><Pencil size={14}/></button>
                </div>
                <div className="p-2">
                  <h3 className="font-bold text-slate-800 truncate">{s.label}</h3>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="md:hidden">
              {bookings.map(b => (
                <div key={b.id} className="p-4 border-b border-slate-50 space-y-2">
                  <div className="flex justify-between font-bold text-sm text-[#0c4a6e]">{b.clientFirstName} {b.clientLastName}</div>
                  <p className="text-xs text-slate-500">{b.eventType} • {b.clientPhone}</p>
                </div>
              ))}
            </div>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold">
                  <tr><th className="px-6 py-4">Client</th><th className="px-6 py-4">Service</th><th className="px-6 py-4">Statut</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {bookings.map(b => (
                    <tr key={b.id}>
                      <td className="px-6 py-4 font-semibold text-[#0c4a6e]">{b.clientFirstName} {b.clientLastName}</td>
                      <td className="px-6 py-4 text-slate-600">{b.eventType}</td>
                      <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${STATUS_COLORS[b.status]}`}>{b.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-6">
            <h2 className="text-lg font-black text-[#0c4a6e] mb-4">{editId ? "Modifier" : "Nouvelle"} prestation</h2>
            <div className="space-y-4">
              <input value={form.label} onChange={e => setForm({...form, label: e.target.value})} className="w-full bg-slate-50 p-3 rounded-xl border-none" placeholder="Nom du service" />
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full bg-slate-50 p-3 rounded-xl border-none" rows={3} placeholder="Description" />
              <ImageUploader value={form.image} onChange={val => setForm({...form, image: val})} />
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 py-3 font-bold text-slate-500">Annuler</button>
              <button onClick={saveService} className="flex-1 py-3 bg-[#c9a84c] text-white font-bold rounded-xl shadow-lg">Enregistrer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}