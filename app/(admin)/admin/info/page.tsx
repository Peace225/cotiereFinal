"use client";
import { useEffect, useState } from "react";
import { RefreshCw, Newspaper, Phone, Trash2, Plus, Pencil, X, CheckCircle } from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import ExportButton from "@/components/admin/ExportButton";
import ImageUploader from "@/components/admin/ImageUploader";

type Prestation = {
  id: string; nom: string; categorie: string; description: string;
  prix: string; image: string; isActive: boolean;
};

type EventRequest = {
  id: string; reference: string; clientFirstName: string; clientLastName: string;
  clientEmail: string; clientPhone: string; eventType: string;
  description?: string; status: string; createdAt: string;
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
  CONFIRMED: "bg-green-100 text-green-700 border-green-200",
  REFUSED: "bg-red-100 text-red-700 border-red-200",
  CANCELLED: "bg-gray-100 text-gray-600 border-gray-200",
  COMPLETED: "bg-blue-100 text-blue-700 border-blue-200",
};
const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente", CONFIRMED: "Confirmé", REFUSED: "Refusé",
  CANCELLED: "Annulé", COMPLETED: "Terminé",
};

const DEFAULT_PRESTATIONS: Prestation[] = [
  { id: "reportages", nom: "Reportages vidéo et photo", categorie: "Vidéo", description: "Captation vidéo HD/4K, photojournalisme, montage inclus.", prix: "Sur devis", image: "/Images/cotiere-info.png", isActive: true },
  { id: "interviews", nom: "Interviews et émissions", categorie: "TV/Radio", description: "Studio, plateau TV, diffusion multi-canaux.", prix: "Sur devis", image: "/Images/cotiere-info.png", isActive: true },
  { id: "couverture", nom: "Couverture d'événements", categorie: "Live", description: "Live, multi-caméras, réseaux sociaux en temps réel.", prix: "Sur devis", image: "/Images/cotiere-info.png", isActive: true },
  { id: "contenus", nom: "Publication de contenus", categorie: "Digital", description: "Articles, communiqués, réseaux sociaux, newsletter.", prix: "Sur devis", image: "/Images/cotiere-info.png", isActive: true },
];

const emptyForm = { nom: "", categorie: "", description: "", prix: "", image: "" };

export default function AdminInfoPage() {
  const [prestations, setPrestations] = useState<Prestation[]>([]);
  const [loadingPrestations, setLoadingPrestations] = useState(true);
  const [requests, setRequests] = useState<EventRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"catalogue" | "reservations">("catalogue");
  const [filter, setFilter] = useState("ALL");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // ── Chargement des prestations depuis la DB ───────────────────────────────
  async function loadPrestations() {
    setLoadingPrestations(true);
    try {
      const res = await fetch("/api/info/prestations");
      const data = await res.json();
      setPrestations(data.data ?? DEFAULT_PRESTATIONS);
    } catch {
      setPrestations(DEFAULT_PRESTATIONS);
    }
    setLoadingPrestations(false);
  }

  async function loadRequests() {
    setLoading(true);
    try {
      const res = await fetch("/api/events/requests?limit=500");
      const data = await res.json();
      const all: EventRequest[] = data.data?.requests ?? data.data ?? [];
      setRequests(all.filter(r => {
        const t = (r.eventType ?? "").toLowerCase();
        return t.includes("info") || t.includes("cotiere info");
      }));
    } catch {}
    setLoading(false);
  }

  useEffect(() => { loadRequests(); loadPrestations(); }, []);

  async function changeStatus(id: string, status: string) {
    await fetch(`/api/events/requests/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  }

  async function deleteRequest(id: string) {
    if (!confirm("Supprimer cette demande ?")) return;
    await fetch(`/api/events/requests/${id}`, { method: "DELETE" });
    setRequests(prev => prev.filter(r => r.id !== id));
  }

  // ── CRUD prestations ──────────────────────────────────────────────────────
  async function savePrestation() {
    if (!form.nom) return;
    setSaving(true);
    try {
      if (editId) {
        const res = await fetch(`/api/info/prestations/${editId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nom: form.nom, categorie: form.categorie, description: form.description, prix: form.prix, image: form.image }),
        });
        const data = await res.json();
        if (res.ok && data.data) setPrestations(prev => prev.map(x => x.id === editId ? data.data : x));
        else alert(`Erreur : ${data.error ?? "Impossible de modifier."}`);
      } else {
        const res = await fetch("/api/info/prestations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nom: form.nom, categorie: form.categorie, description: form.description, prix: form.prix, image: form.image }),
        });
        const data = await res.json();
        if (res.ok && data.data) setPrestations(prev => [...prev, data.data]);
        else alert(`Erreur : ${data.error ?? "Impossible de créer."}`);
      }
      setShowModal(false); setForm(emptyForm); setEditId(null);
    } catch { alert("Erreur réseau."); }
    setSaving(false);
  }

  function openEdit(p: Prestation) {
    setForm({ nom: p.nom, categorie: p.categorie, description: p.description, prix: p.prix, image: p.image });
    setEditId(p.id); setShowModal(true);
  }

  async function togglePrestation(p: Prestation) {
    const res = await fetch(`/api/info/prestations/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !p.isActive }),
    });
    if (res.ok) setPrestations(prev => prev.map(x => x.id === p.id ? { ...x, isActive: !x.isActive } : x));
  }

  async function deletePrestation(id: string) {
    if (!confirm("Supprimer cette prestation ?")) return;
    const res = await fetch(`/api/info/prestations/${id}`, { method: "DELETE" });
    if (res.ok) setPrestations(prev => prev.filter(x => x.id !== id));
    else alert("Impossible de supprimer cette prestation.");
  }

  const filtered = filter === "ALL" ? requests : requests.filter(r => r.status === filter);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Newspaper size={20} className="text-green-600" />
            </div>
            <h1 className="text-2xl font-black text-[#0c4a6e]">COTIERE INFO+</h1>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => { setShowModal(true); setEditId(null); setForm(emptyForm); }}
              className="flex items-center gap-2 bg-[#c9a84c] hover:bg-[#b8973b] text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors shadow-md">
              <Plus size={15} /> Ajouter une prestation
            </button>
            <button onClick={() => setTab("catalogue")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "catalogue" ? "bg-[#0c4a6e] text-white" : "bg-white text-gray-500 border border-gray-200"}`}>
              Prestations INFO+ ({prestations.length})
            </button>
            <button onClick={() => setTab("reservations")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "reservations" ? "bg-[#0c4a6e] text-white" : "bg-white text-gray-500 border border-gray-200"}`}>
              Réservations ({requests.length})
            </button>
          </div>
        </div>

        {/* Onglet Catalogue */}
        {tab === "catalogue" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {loadingPrestations ? (
              <div className="col-span-3 py-12 text-center text-gray-400">Chargement des prestations...</div>
            ) : prestations.map(p => (
              <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <div className="relative h-40 bg-white">
                  <img src={p.image} alt={p.nom} className="w-full h-full object-contain p-0.5" />
                  <span className={`absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full font-bold ${p.isActive ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                    {p.isActive ? "ACTIF" : "INACTIF"}
                  </span>
                  <span className="absolute top-3 right-3 bg-[#c9a84c] text-white text-xs font-bold px-2 py-1 rounded-full">
                    {p.categorie}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-[#0c4a6e] mb-1">{p.nom}</h3>
                  <p className="text-xs text-gray-500 mb-1">{p.prix}</p>
                  <p className="text-xs text-gray-400 mb-3">{p.description}</p>
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

        {/* Onglet Réservations */}
        {tab === "reservations" && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: "Total", value: requests.length, color: "text-blue-500", bg: "bg-blue-50" },
                { label: "En attente", value: requests.filter(r => r.status === "PENDING").length, color: "text-yellow-500", bg: "bg-yellow-50" },
                { label: "Confirmés", value: requests.filter(r => r.status === "CONFIRMED").length, color: "text-green-500", bg: "bg-green-50" },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
                  <div><p className="text-gray-400 text-xs mb-1">{s.label}</p><p className={`text-3xl font-black ${s.color}`}>{s.value}</p></div>
                  <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center`}><Newspaper size={18} className={s.color} /></div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <select value={filter} onChange={e => setFilter(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8] bg-white">
                <option value="ALL">Tous les statuts</option>
                <option value="PENDING">En attente</option>
                <option value="CONFIRMED">Confirmés</option>
                <option value="COMPLETED">Terminés</option>
                <option value="REFUSED">Refusés</option>
              </select>
              <button onClick={loadRequests}
                className="flex items-center gap-2 bg-[#c9a84c] hover:bg-[#b8973b] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Actualiser
              </button>
              <div className="ml-auto">
                <ExportButton
                  data={filtered.map(r => ({
                    reference: r.reference, client: `${r.clientFirstName} ${r.clientLastName}`,
                    telephone: r.clientPhone, prestation: r.eventType,
                    date: new Date(r.createdAt).toLocaleDateString("fr-FR"), statut: STATUS_LABELS[r.status] ?? r.status,
                  }))}
                  columns={[
                    { key: "reference", label: "Référence" }, { key: "client", label: "Client" },
                    { key: "telephone", label: "Téléphone" }, { key: "prestation", label: "Prestation" },
                    { key: "date", label: "Date" }, { key: "statut", label: "Statut" },
                  ]}
                  filename={"info-reservations-" + new Date().toISOString().split("T")[0]}
                  label="Réservations"
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <div className="w-1 h-5 bg-green-500 rounded-full" />
                <h2 className="font-bold text-[#0c4a6e]">Demandes INFO+</h2>
                <span className="ml-auto text-xs text-gray-400">{filtered.length} résultat(s)</span>
              </div>
              {loading ? (
                <div className="py-12 text-center text-gray-400"><RefreshCw size={28} className="animate-spin mx-auto mb-2" /> Chargement...</div>
              ) : filtered.length === 0 ? (
                <div className="py-12 text-center text-gray-400">Aucune demande trouvée.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>{["Réf.", "Client", "WhatsApp", "Prestation demandée", "Date", "Statut", "Action"].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">{h}</th>
                      ))}</tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filtered.map(r => (
                        <tr key={r.id} className="hover:bg-gray-50">
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-2">
                              <img src="/Images/cotiere-info.png" alt="info" className="w-9 h-9 rounded-lg object-contain bg-white p-0.5 shrink-0 border border-gray-100" />
                              <span className="font-mono text-xs text-gray-400">{r.reference?.slice(-8)}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <p className="font-semibold text-[#0c4a6e]">{r.clientFirstName} {r.clientLastName}</p>
                            <p className="text-xs text-gray-400">{r.clientEmail}</p>
                          </td>
                          <td className="px-4 py-3">
                            <a href={`https://wa.me/${r.clientPhone?.replace(/\s/g, "")}`} target="_blank" rel="noopener noreferrer"
                              className="text-green-600 text-xs flex items-center gap-1 hover:underline">
                              <Phone size={11} /> {r.clientPhone}
                            </a>
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-[#0c4a6e]">
                            <a href="/services/info" target="_blank" rel="noopener noreferrer"
                              className="hover:underline text-[#0c4a6e] font-medium">
                              {r.eventType} ↗
                            </a>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-500">
                            {new Date(r.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${STATUS_COLORS[r.status] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}>
                              {STATUS_LABELS[r.status] ?? r.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <select value="" onChange={e => { if (e.target.value) changeStatus(r.id, e.target.value); }}
                                className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs bg-white focus:outline-none">
                                <option value="">Changer statut</option>
                                <option value="PENDING">En attente</option>
                                <option value="CONFIRMED">Confirmer</option>
                                <option value="COMPLETED">Terminer</option>
                                <option value="REFUSED">Refuser</option>
                              </select>
                              <button onClick={() => deleteRequest(r.id)} className="text-red-400 hover:text-red-600">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Modal Ajouter/Modifier */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
              <h3 className="font-bold text-[#0c4a6e] text-lg">{editId ? "Modifier" : "Ajouter"} une prestation</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto">
              {[
                { key: "nom", label: "Nom de la prestation *", placeholder: "Reportages vidéo et photo" },
                { key: "categorie", label: "Catégorie *", placeholder: "Vidéo / TV/Radio / Live / Digital..." },
                { key: "prix", label: "Prix *", placeholder: "Sur devis" },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input type="text" placeholder={placeholder} value={(form as any)[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea rows={2} placeholder="Description de la prestation..." value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8] resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                <ImageUploader value={form.image} onChange={val => setForm(f => ({ ...f, image: val }))} />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3 shrink-0">
              <button onClick={() => setShowModal(false)} className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50">Annuler</button>
              <button onClick={savePrestation} disabled={!form.nom || saving}
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
