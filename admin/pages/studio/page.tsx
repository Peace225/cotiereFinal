"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, XCircle, Camera, Plus, Pencil, Trash2, X, Clock } from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import ImageUploader from "@/components/admin/ImageUploader";
import ExportButton from "@/components/admin/ExportButton";

type Booking = {
  id: string; reference: string; clientFirstName: string; clientLastName: string;
  clientPhone: string; eventType: string; eventDate: string; status: string;
  estimatedPriceMin?: number; totalAmount?: number; createdAt?: string;
};
type Service = { id: string; label: string; description: string; image: string; isActive: boolean };

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700", CONFIRMED: "bg-green-100 text-green-700",
  REFUSED: "bg-red-100 text-red-700", CANCELLED: "bg-gray-100 text-gray-600", COMPLETED: "bg-blue-100 text-blue-700",
};
const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente", CONFIRMED: "Confirmé", REFUSED: "Refusé", CANCELLED: "Annulé", COMPLETED: "Terminé",
};

const INITIAL_SERVICES: Service[] = [];

export default function AdminStudioPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"reservations" | "services">("reservations");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ label: "", description: "", image: "" });
  const [editId, setEditId] = useState<string | null>(null);
  const [savingForm, setSavingForm] = useState(false);

  useEffect(() => {
    fetch("/api/studio/bookings?limit=500").then(r => r.json()).then(d => {
      setBookings(d.data?.bookings ?? []);
      setLoading(false);
    });
    fetch("/api/studio/services")
      .then(r => r.json())
      .then(d => { if (d.data) setServices(d.data); })
      .catch(() => {});
  }, []);

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/studio/bookings/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  }

  async function saveService() {
    if (!form.label) return;
    setSavingForm(true);
    try {
      if (editId) {
        const res = await fetch(`/api/studio/services/${editId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (res.ok) setServices(prev => prev.map(s => s.id === editId ? { ...s, ...data.data } : s));
        else alert(`Erreur : ${data.error ?? "Impossible de modifier."}`);
      } else {
        const res = await fetch("/api/studio/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (res.ok && data.data) setServices(prev => [...prev, data.data]);
        else alert(`Erreur ${res.status} : ${data.error ?? "Impossible de sauvegarder."}\nVérifiez que vous êtes connecté en tant qu'admin.`);
      }
    } catch {
      alert("Erreur réseau. Vérifiez votre connexion et réessayez.");
    }
    setSavingForm(false);
    setShowModal(false); setForm({ label: "", description: "", image: "" }); setEditId(null);
  }

  async function deleteService(id: string) {
    if (!confirm("Supprimer ce service ?")) return;
    await fetch(`/api/studio/services/${id}`, { method: "DELETE" });
    setServices(prev => prev.filter(s => s.id !== id));
  }

  async function toggleActive(s: Service) {
    await fetch(`/api/studio/services/${s.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !s.isActive }),
    });
    setServices(prev => prev.map(x => x.id === s.id ? { ...x, isActive: !x.isActive } : x));
  }

  function openEdit(s: Service) { setForm({ label: s.label, description: s.description ?? "", image: s.image }); setEditId(s.id); setShowModal(true); }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black text-[#0c4a6e]">HBL Studio+</h1>
          <div className="flex gap-2">
            <button onClick={() => { setShowModal(true); setEditId(null); setForm({ label: "", description: "", image: "" }); }}
              className="flex items-center gap-2 bg-[#c9a84c] hover:bg-[#b8973b] text-white font-bold px-4 py-2 rounded-xl transition-colors shadow-md text-sm">
              <Plus size={15} /> Ajouter une prestation
            </button>
            <button onClick={() => setTab("reservations")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "reservations" ? "bg-[#0c4a6e] text-white" : "bg-white text-gray-500 border border-gray-200"}`}>
              Réservations ({bookings.length})
            </button>
            <button onClick={() => setTab("services")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "services" ? "bg-[#0c4a6e] text-white" : "bg-white text-gray-500 border border-gray-200"}`}>
              Services ({services.length})
            </button>
          </div>
        </div>

        {tab === "services" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {services.map((s) => (
              <div key={s.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <div className="relative h-36">
                  {s.image ? <img src={s.image} alt={s.label} className="w-full h-full object-cover" /> :
                    <div className="w-full h-full flex items-center justify-center text-gray-300"><Camera size={40} /></div>}
                  <span className={`absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full font-bold ${s.isActive ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                    {s.isActive ? "ACTIF" : "INACTIF"}
                  </span>
                </div>
                <div className="p-4">
                  <p className="font-semibold text-[#0c4a6e] text-sm mb-3 leading-tight">{s.label}</p>
                  <div className="flex gap-2">
                    <button onClick={() => toggleActive(s)}
                      className={`flex-1 flex items-center justify-center gap-1 text-xs font-bold py-2 rounded-lg transition-colors ${s.isActive ? "bg-orange-100 text-orange-600 hover:bg-orange-200" : "bg-green-100 text-green-600 hover:bg-green-200"}`}>
                      <CheckCircle size={13} /> {s.isActive ? "Désactiver" : "Activer"}
                    </button>
                    <button onClick={() => openEdit(s)}
                      className="flex-1 flex items-center justify-center gap-1 text-xs font-bold py-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors">
                      <Pencil size={13} /> Modifier
                    </button>
                    <button onClick={() => deleteService(s.id)}
                      className="flex-1 flex items-center justify-center gap-1 text-xs font-bold py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors">
                      <Trash2 size={13} /> Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "reservations" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <div className="w-1 h-5 bg-[#c9a84c] rounded-full" />
              <h2 className="font-bold text-[#0c4a6e]">Réservations Studio+</h2>
              <span className="ml-auto text-xs text-gray-400">{bookings.length} résultat(s)</span>
              <ExportButton
                data={bookings.map(b => ({
                  reference: b.reference ?? b.id,
                  client: b.clientFirstName + " " + b.clientLastName,
                  telephone: b.clientPhone,
                  service: b.eventType ?? "—",
                  date_commande: b.createdAt ? new Date(b.createdAt).toLocaleString("fr-FR") : "—",
                  estimation: b.totalAmount ? `${b.totalAmount.toLocaleString()} FCFA` : b.estimatedPriceMin ? `${b.estimatedPriceMin.toLocaleString()} FCFA` : "—",
                  statut: b.status,
                }))}
                columns={[
                  { key: "reference", label: "Référence" },
                  { key: "client", label: "Client" },
                  { key: "telephone", label: "Téléphone" },
                  { key: "service", label: "Service" },
                  { key: "date_commande", label: "Date commande" },
                  { key: "estimation", label: "Estimation" },
                  { key: "statut", label: "Statut" },
                ]}
                filename={"studio-reservations-" + new Date().toISOString().split("T")[0]}
                label="Réservations"
              />
            </div>
            {loading ? <div className="py-12 text-center text-gray-400">Chargement...</div> :
              bookings.length === 0 ? <div className="py-12 text-center text-gray-400">Aucune réservation.</div> : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>{["Réf", "Client", "WhatsApp", "Événement", "Date commande", "Estimation", "Statut", "Action"].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                      ))}</tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {bookings.map((b) => (
                        <tr key={b.id} className="hover:bg-gray-50">
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-2">
                              <img src="https://images.unsplash.com/photo-1601506521793-dc748fc80b67?w=60&q=80" alt="service" className="w-9 h-9 rounded-lg object-cover shrink-0 border border-gray-100" />
                              <span className="font-mono text-xs text-gray-400">{b.reference?.slice(-6)}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-semibold text-[#0c4a6e]">{b.clientFirstName} {b.clientLastName}</td>
                          <td className="px-4 py-3"><a href={`https://wa.me/${b.clientPhone?.replace(/\s/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-green-600 text-xs font-medium">{b.clientPhone}</a></td>
                          <td className="px-4 py-3 text-gray-600">
                            <a href="/services/studio" target="_blank" rel="noopener noreferrer" className="hover:underline text-[#0c4a6e] font-medium text-xs">
                              {b.eventType} ↗
                            </a>
                          </td>
                          <td className="px-4 py-3 text-gray-600 text-xs">
                            {b.createdAt ? (
                              <div>
                                <div>{new Date(b.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}</div>
                                <div className="text-gray-400 flex items-center gap-1 mt-0.5">
                                  <Clock size={10} />
                                  {new Date(b.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                                </div>
                              </div>
                            ) : new Date(b.eventDate).toLocaleDateString("fr-FR")}
                          </td>
                          <td className="px-4 py-3 text-xs font-semibold text-[#0c4a6e]">{b.totalAmount ? `${b.totalAmount.toLocaleString()} FCFA` : b.estimatedPriceMin ? `${b.estimatedPriceMin.toLocaleString()} FCFA` : "—"}</td>
                          <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full font-semibold ${STATUS_COLORS[b.status]}`}>{STATUS_LABELS[b.status]}</span></td>
                          <td className="px-4 py-3">
                            {b.status === "PENDING" && (
                              <div className="flex gap-1">
                                <button onClick={() => updateStatus(b.id, "CONFIRMED")} className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"><CheckCircle size={14} /></button>
                                <button onClick={() => updateStatus(b.id, "REFUSED")} className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"><XCircle size={14} /></button>
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
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="font-bold text-[#0c4a6e] text-lg">{editId ? "Modifier" : "Ajouter"} une prestation</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la prestation *</label>
                <input type="text" placeholder="Ex: Tournage 4K" value={form.label}
                  onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea rows={3} placeholder="Décrivez cette prestation..."
                  value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8] resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
                <ImageUploader value={form.image} onChange={val => setForm(f => ({ ...f, image: val }))} />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50">Annuler</button>
              <button onClick={saveService} className="flex-1 bg-[#c9a84c] hover:bg-[#b8973b] text-white font-bold py-2.5 rounded-xl">
                {editId ? "Modifier" : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
