"use client";
import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Calendar, Plus, Pencil, Trash2, X, Clock, RefreshCw } from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import ImageUploader from "@/components/admin/ImageUploader";
import ExportButton from "@/components/admin/ExportButton";

type EventReq = {
  id: string; reference: string; clientFirstName: string; clientLastName: string;
  clientPhone: string; eventType: string; eventDate: string; guestCount: number;
  status: string; budget?: string; createdAt?: string;
};

type Prestation = {
  id: string; label: string; description: string; image: string; isActive: boolean;
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700", CONFIRMED: "bg-green-100 text-green-700",
  REFUSED: "bg-red-100 text-red-700", CANCELLED: "bg-gray-100 text-gray-600", COMPLETED: "bg-blue-100 text-blue-700",
};
const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente", CONFIRMED: "Confirmé", REFUSED: "Refusé", CANCELLED: "Annulé", COMPLETED: "Terminé",
};

export default function AdminEvenementsPage() {
  const [requests, setRequests] = useState<EventReq[]>([]);
  const [prestations, setPrestations] = useState<Prestation[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPrestations, setLoadingPrestations] = useState(true);
  const [tab, setTab] = useState<"reservations" | "prestations">("reservations");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ label: "", description: "", image: "" });
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // ── Chargement des demandes ───────────────────────────────────────────────
  async function loadRequests() {
    setLoading(true);
    try {
      const res = await fetch("/api/events/requests?limit=500");
      const data = await res.json();
      setRequests(data.data?.requests ?? data.data ?? []);
    } catch {}
    setLoading(false);
  }

  // ── Chargement des prestations depuis la DB ───────────────────────────────
  async function loadPrestations() {
    setLoadingPrestations(true);
    try {
      const res = await fetch("/api/events/prestations?all=true");
      const data = await res.json();
      setPrestations(data.data ?? []);
    } catch {}
    setLoadingPrestations(false);
  }

  useEffect(() => { loadRequests(); loadPrestations(); }, []);

  // ── Statut demande ────────────────────────────────────────────────────────
  async function updateStatus(id: string, status: string) {
    await fetch(`/api/events/requests/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  }

  // ── CRUD prestations ──────────────────────────────────────────────────────
  function openEdit(p: Prestation) {
    setForm({ label: p.label, description: p.description ?? "", image: p.image });
    setEditId(p.id);
    setShowModal(true);
  }

  async function savePrestation() {
    if (!form.label) return;
    setSaving(true);
    try {
      if (editId) {
        // Modification → PATCH /api/events/prestations/[id]
        const res = await fetch(`/api/events/prestations/${editId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ label: form.label, description: form.description, image: form.image }),
        });
        const data = await res.json();
        if (res.ok && data.data) {
          setPrestations(prev => prev.map(p => p.id === editId ? { ...p, ...data.data } : p));
        } else {
          alert(`Erreur : ${data.error ?? "Impossible de modifier la prestation."}`);
          setSaving(false);
          return;
        }
      } else {
        // Création → POST /api/events/prestations
        const res = await fetch("/api/events/prestations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ label: form.label, description: form.description, image: form.image }),
        });
        const data = await res.json();
        if (res.ok && data.data) {
          setPrestations(prev => [...prev, data.data]);
        } else {
          alert(`Erreur : ${data.error ?? "Impossible de créer la prestation."}`);
          setSaving(false);
          return;
        }
      }
      setShowModal(false);
      setForm({ label: "", description: "", image: "" });
      setEditId(null);
    } catch {
      alert("Erreur réseau. Vérifiez votre connexion.");
    }
    setSaving(false);
  }

  async function deletePrestation(id: string) {
    if (!confirm("Supprimer cette prestation ?")) return;
    const res = await fetch(`/api/events/prestations/${id}`, { method: "DELETE" });
    if (res.ok) {
      setPrestations(prev => prev.filter(p => p.id !== id));
    } else {
      alert("Impossible de supprimer cette prestation.");
    }
  }

  async function togglePrestation(p: Prestation) {
    const res = await fetch(`/api/events/prestations/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !p.isActive }),
    });
    if (res.ok) {
      setPrestations(prev => prev.map(x => x.id === p.id ? { ...x, isActive: !x.isActive } : x));
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h1 className="text-2xl font-black text-[#0c4a6e]">Événements & Organisation</h1>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => { setShowModal(true); setEditId(null); setForm({ label: "", description: "", image: "" }); }}
              className="flex items-center gap-2 bg-[#c9a84c] hover:bg-[#b8973b] text-white font-bold px-4 py-2 rounded-xl transition-colors shadow-md text-sm">
              <Plus size={15} /> Ajouter une prestation
            </button>
            <button onClick={() => setTab("reservations")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "reservations" ? "bg-[#0c4a6e] text-white" : "bg-white text-gray-500 border border-gray-200"}`}>
              Demandes ({requests.length})
            </button>
            <button onClick={() => setTab("prestations")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "prestations" ? "bg-[#0c4a6e] text-white" : "bg-white text-gray-500 border border-gray-200"}`}>
              Prestations ({prestations.length})
            </button>
          </div>
        </div>

        {/* ── Onglet Prestations ── */}
        {tab === "prestations" && (
          <>
            {loadingPrestations ? (
              <div className="py-16 text-center text-gray-400">
                <RefreshCw size={32} className="animate-spin mx-auto mb-3" /> Chargement des prestations...
              </div>
            ) : prestations.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center text-gray-400 shadow-sm border border-gray-100">
                <Calendar size={40} className="mx-auto mb-3 opacity-30" />
                <p className="font-medium mb-1">Aucune prestation</p>
                <p className="text-sm">Cliquez sur "Ajouter une prestation" pour commencer.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {prestations.map((p) => (
                  <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                    <div className="relative h-40 bg-gray-100">
                      {p.image ? (
                        <img src={p.image} alt={p.label} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300"><Calendar size={40} /></div>
                      )}
                      <span className={`absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full font-bold ${p.isActive ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                        {p.isActive ? "ACTIF" : "INACTIF"}
                      </span>
                    </div>
                    <div className="p-4">
                      <p className="font-bold text-[#0c4a6e] mb-1">{p.label}</p>
                      {p.description && <p className="text-xs text-gray-400 mb-3 line-clamp-2">{p.description}</p>}
                      <div className="flex gap-2">
                        <button onClick={() => togglePrestation(p)}
                          className={`flex-1 flex items-center justify-center gap-1 text-xs font-bold py-2 rounded-lg transition-colors ${p.isActive ? "bg-orange-100 text-orange-600 hover:bg-orange-200" : "bg-green-100 text-green-600 hover:bg-green-200"}`}>
                          <CheckCircle size={13} /> {p.isActive ? "Désactiver" : "Activer"}
                        </button>
                        <button onClick={() => openEdit(p)}
                          className="flex-1 flex items-center justify-center gap-1 text-xs font-bold py-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors">
                          <Pencil size={13} /> Modifier
                        </button>
                        <button onClick={() => deletePrestation(p.id)}
                          className="flex-1 flex items-center justify-center gap-1 text-xs font-bold py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors">
                          <Trash2 size={13} /> Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── Onglet Demandes ── */}
        {tab === "reservations" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <div className="w-1 h-5 bg-[#c9a84c] rounded-full" />
              <h2 className="font-bold text-[#0c4a6e]">Demandes d'événements</h2>
              <span className="ml-auto text-xs text-gray-400">{requests.length} demande(s)</span>
              <button onClick={loadRequests} className="flex items-center gap-1.5 text-xs bg-[#c9a84c] hover:bg-[#b8973b] text-white font-semibold px-3 py-1.5 rounded-lg transition-colors ml-2">
                <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Actualiser
              </button>
              <ExportButton
                data={requests.map(r => ({
                  reference: r.reference ?? r.id,
                  client: r.clientFirstName + " " + r.clientLastName,
                  telephone: r.clientPhone,
                  type: r.eventType ?? "—",
                  date_commande: r.createdAt ? new Date(r.createdAt).toLocaleString("fr-FR") : "—",
                  invites: r.guestCount,
                  budget: r.budget ?? "—",
                  statut: r.status,
                }))}
                columns={[
                  { key: "reference", label: "Référence" },
                  { key: "client", label: "Client" },
                  { key: "telephone", label: "Téléphone" },
                  { key: "type", label: "Type" },
                  { key: "date_commande", label: "Date commande" },
                  { key: "invites", label: "Invités" },
                  { key: "budget", label: "Budget" },
                  { key: "statut", label: "Statut" },
                ]}
                filename={"evenements-demandes-" + new Date().toISOString().split("T")[0]}
                label="Demandes"
              />
            </div>
            {loading ? <div className="py-12 text-center text-gray-400">Chargement...</div> :
              requests.length === 0 ? <div className="py-12 text-center text-gray-400">Aucune demande.</div> : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>{["Réf", "Client", "WhatsApp", "Type", "Date commande", "Invités", "Budget", "Statut", "Action"].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                      ))}</tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {requests.map((r) => (
                        <tr key={r.id} className="hover:bg-gray-50">
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-2">
                              <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=60&q=80" alt="service" className="w-9 h-9 rounded-lg object-cover shrink-0 border border-gray-100" />
                              <span className="font-mono text-xs text-gray-400">{r.reference?.slice(-6)}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-semibold text-[#0c4a6e]">{r.clientFirstName} {r.clientLastName}</td>
                          <td className="px-4 py-3">
                            <a href={`https://wa.me/${r.clientPhone?.replace(/\s/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-green-600 text-xs font-medium">{r.clientPhone}</a>
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            <a href="/services/evenements" target="_blank" rel="noopener noreferrer" className="hover:underline text-[#0c4a6e] font-medium text-xs">
                              {r.eventType} ↗
                            </a>
                          </td>
                          <td className="px-4 py-3 text-gray-600 text-xs">
                            {r.createdAt ? (
                              <div>
                                <div>{new Date(r.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}</div>
                                <div className="text-gray-400 flex items-center gap-1 mt-0.5">
                                  <Clock size={10} />
                                  {new Date(r.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                                </div>
                              </div>
                            ) : new Date(r.eventDate).toLocaleDateString("fr-FR")}
                          </td>
                          <td className="px-4 py-3 text-gray-600">{r.guestCount}</td>
                          <td className="px-4 py-3 text-gray-600 text-xs">{r.budget ?? "—"}</td>
                          <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full font-semibold ${STATUS_COLORS[r.status]}`}>{STATUS_LABELS[r.status]}</span></td>
                          <td className="px-4 py-3">
                            {r.status === "PENDING" && (
                              <div className="flex gap-1">
                                <button onClick={() => updateStatus(r.id, "CONFIRMED")} className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"><CheckCircle size={14} /></button>
                                <button onClick={() => updateStatus(r.id, "REFUSED")} className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"><XCircle size={14} /></button>
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

      {/* ── Modal Ajouter / Modifier prestation ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="font-bold text-[#0c4a6e] text-lg">{editId ? "Modifier" : "Ajouter"} une prestation</h3>
              <button onClick={() => { setShowModal(false); setEditId(null); setForm({ label: "", description: "", image: "" }); }} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la prestation *</label>
                <input type="text" placeholder="Ex: Décoration florale"
                  value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea rows={3} placeholder="Décrivez cette prestation..."
                  value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8] resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                <ImageUploader value={form.image} onChange={val => setForm(f => ({ ...f, image: val }))} />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button onClick={() => { setShowModal(false); setEditId(null); setForm({ label: "", description: "", image: "" }); }}
                className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50">Annuler</button>
              <button onClick={savePrestation} disabled={saving || !form.label}
                className="flex-1 bg-[#c9a84c] hover:bg-[#b8973b] text-white font-bold py-2.5 rounded-xl disabled:opacity-60">
                {saving ? "Enregistrement..." : editId ? "Modifier" : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


