"use client";
import { useEffect, useState } from "react";
import { RefreshCw, Briefcase, Phone, Trash2, CheckCircle, Pencil, Plus, X, ImageOff } from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import ExportButton from "@/components/admin/ExportButton";
import ImageUploader from "@/components/admin/ImageUploader";

type EventRequest = {
  id: string;
  reference: string;
  clientFirstName: string;
  clientLastName: string;
  clientEmail: string;
  clientPhone: string;
  eventType: string;
  eventDate: string;
  eventLocation: string;
  description?: string;
  status: string;
  createdAt: string;
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
  CONFIRMED: "bg-green-100 text-green-700 border-green-200",
  REFUSED: "bg-red-100 text-red-700 border-red-200",
  CANCELLED: "bg-gray-100 text-gray-600 border-gray-200",
  COMPLETED: "bg-blue-100 text-blue-700 border-blue-200",
};
const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmé",
  REFUSED: "Refusé",
  CANCELLED: "Annulé",
  COMPLETED: "Terminé",
};

const DEFAULT_CATALOGUE_SECTEURS: Secteur[] = [];

type Secteur = {
  id: string;
  nom: string;
  description: string;
  image: string;
  categorie: string;
  couleur: string;
  isActive?: boolean;
};

const emptySecteurForm = { nom: "", categorie: "", couleur: "bg-cyan-500", description: "", image: "" };

function matchesOpportunites(r: EventRequest) {
  const type = r.eventType?.toLowerCase() ?? "";
  return type.includes("opportunit");
}

export default function AdminOpportunitesPage() {
  const [catalogueSecteurs, setCatalogueSecteurs] = useState<Secteur[]>(DEFAULT_CATALOGUE_SECTEURS);
  const [requests, setRequests] = useState<EventRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [tab, setTab] = useState<"catalogue" | "reservations">("reservations");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptySecteurForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [savingForm, setSavingForm] = useState(false);

  async function loadSecteurs() {
    try {
      // Admin : charger tous les secteurs (actifs et inactifs)
      const res = await fetch("/api/opportunites/secteurs?admin=1");
      const data = await res.json();
      if (data.data) setCatalogueSecteurs(data.data);
    } catch {}
  }

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/events/requests?limit=200");
      const data = await res.json();
      const all: EventRequest[] = data.data?.requests ?? [];
      setRequests(all.filter(matchesOpportunites));
    } catch {}
    setLoading(false);
  }

  useEffect(() => { load(); loadSecteurs(); }, []);

  async function changeStatus(id: string, status: string) {
    await fetch(`/api/events/requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  }

  async function deleteRequest(id: string) {
    if (!confirm("Supprimer cette demande ?")) return;
    await fetch(`/api/events/requests/${id}`, { method: "DELETE" });
    setRequests(prev => prev.filter(r => r.id !== id));
  }

  async function saveSecteur() {
    if (!form.nom) return;
    setSavingForm(true);
    try {
      if (editId) {
        const res = await fetch(`/api/opportunites/secteurs/${editId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nom: form.nom,
            categorie: form.categorie || form.nom,
            couleur: form.couleur,
            description: form.description || form.nom,
            image: form.image || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80",
          }),
        });
        const data = await res.json();
        if (res.ok && data.data) {
          setCatalogueSecteurs(prev => prev.map(s => s.id === editId ? { ...s, ...data.data } : s));
        } else {
          alert(`Impossible de modifier : ${data.error ?? `Erreur ${res.status}`}`);
        }
      } else {
        const res = await fetch("/api/opportunites/secteurs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nom: form.nom,
            categorie: form.categorie || form.nom,
            couleur: form.couleur,
            description: form.description || form.nom,
            image: form.image || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80",
          }),
        });
        const data = await res.json();
        if (res.ok && data.data) {
          setCatalogueSecteurs(prev => [...prev, data.data]);
        } else {
          const msg = data.error ?? `Erreur ${res.status}`;
          alert(`Impossible de sauvegarder le secteur : ${msg}\n\nVérifiez que vous êtes bien connecté en tant qu'admin.`);
        }
      }
    } catch {
      alert("Erreur réseau lors de la sauvegarde du secteur.");
    }
    setSavingForm(false);
    setShowModal(false);
    setEditId(null);
    setForm(emptySecteurForm);
  }

  async function toggleSecteurActive(s: Secteur) {
    const res = await fetch(`/api/opportunites/secteurs/${s.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !s.isActive }),
    });
    if (res.ok) {
      setCatalogueSecteurs(prev => prev.map(x => x.id === s.id ? { ...x, isActive: !x.isActive } : x));
    }
  }

  function openEdit(s: Secteur) {
    // Si l'image est une URL locale (/uploads/...), on la remplace par l'image par défaut
    const imageUrl = s.image?.startsWith("/uploads/") ? "" : s.image;
    setForm({ nom: s.nom, categorie: s.categorie, couleur: s.couleur, description: s.description, image: imageUrl });
    setEditId(s.id);
    setShowModal(true);
  }

  async function deleteSecteur(id: string) {
    if (!confirm("Supprimer ce secteur ?")) return;
    await fetch(`/api/opportunites/secteurs/${id}`, { method: "DELETE" });
    setCatalogueSecteurs(prev => prev.filter(s => s.id !== id));
  }

  const filtered = filter === "ALL" ? requests : requests.filter(r => r.status === filter);

  const exportData = filtered.map(r => ({
    reference: r.reference,
    client: `${r.clientFirstName} ${r.clientLastName}`,
    telephone: r.clientPhone,
    secteur: r.eventType,
    date: new Date(r.createdAt).toLocaleDateString("fr-FR"),
    statut: STATUS_LABELS[r.status] ?? r.status,
  }));

  const exportColumns = [
    { key: "reference", label: "Référence" },
    { key: "client", label: "Client" },
    { key: "telephone", label: "Téléphone" },
    { key: "secteur", label: "Secteur/Projet" },
    { key: "date", label: "Date" },
    { key: "statut", label: "Statut" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0c4a6e] rounded-xl flex items-center justify-center">
              <Briefcase size={20} className="text-[#c9a84c]" />
            </div>
            <h1 className="text-2xl font-black text-[#0c4a6e]">CÔTIÈRE Opportunités</h1>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => { setEditId(null); setForm(emptySecteurForm); setShowModal(true); }}
              className="flex items-center gap-2 bg-[#c9a84c] hover:bg-[#b8973b] text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors shadow-md"
            >
              <Plus size={15} /> Ajouter un secteur
            </button>
            <button
              onClick={() => setTab("catalogue")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "catalogue" ? "bg-[#0c4a6e] text-white" : "bg-white text-gray-500 border border-gray-200"}`}
            >
              Secteurs ({catalogueSecteurs.length})
            </button>
            <button
              onClick={() => setTab("reservations")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "reservations" ? "bg-[#0c4a6e] text-white" : "bg-white text-gray-500 border border-gray-200"}`}
            >
              Demandes ({requests.length})
            </button>
          </div>
        </div>

        {/* Onglet Catalogue */}
        {tab === "catalogue" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {catalogueSecteurs.map(s => (
              <div key={s.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <div className="relative h-36 bg-gray-100">
                  {s.image ? (
                    <img
                      src={s.image}
                      alt={s.nom}
                      className="w-full h-full object-cover"
                      onError={e => {
                        const img = e.target as HTMLImageElement;
                        img.style.display = "none";
                        const parent = img.parentElement;
                        if (parent && !parent.querySelector(".img-fallback")) {
                          const fallback = document.createElement("div");
                          fallback.className = "img-fallback w-full h-full flex flex-col items-center justify-center text-gray-300 gap-1 absolute inset-0";
                          fallback.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg><span style="font-size:10px;color:#9ca3af">Image non disponible</span>`;
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-1">
                      <ImageOff size={36} />
                      <span className="text-xs text-gray-400">Aucune image</span>
                    </div>
                  )}
                  <span className={`absolute top-3 right-3 ${s.couleur} text-white text-xs font-bold px-2 py-1 rounded-full`}>
                    {s.categorie}
                  </span>
                  <span className={`absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full font-bold ${s.isActive !== false ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                    {s.isActive !== false ? "ACTIF" : "INACTIF"}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-[#0c4a6e] mb-1">{s.nom}</h3>
                  <p className="text-xs text-gray-400 mb-3 line-clamp-2">{s.description}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleSecteurActive(s)}
                      className={`flex-1 flex items-center justify-center gap-1 text-xs font-bold py-2 rounded-lg transition-colors ${s.isActive !== false ? "bg-orange-100 text-orange-600 hover:bg-orange-200" : "bg-green-100 text-green-600 hover:bg-green-200"}`}>
                      <CheckCircle size={13} /> {s.isActive !== false ? "Désactiver" : "Activer"}
                    </button>
                    <button
                      onClick={() => openEdit(s)}
                      className="flex-1 flex items-center justify-center gap-1 text-xs font-bold py-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors">
                      <Pencil size={13} /> Modifier
                    </button>
                    <button
                      onClick={() => deleteSecteur(s.id)}
                      className="flex-1 flex items-center justify-center gap-1 text-xs font-bold py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors">
                      <Trash2 size={13} /> Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Onglet Demandes */}
        {tab === "reservations" && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {[
                { label: "Total", value: requests.length, color: "text-blue-500", bg: "bg-blue-50", filterVal: "ALL" },
                { label: "En attente", value: requests.filter(r => r.status === "PENDING").length, color: "text-yellow-500", bg: "bg-yellow-50", filterVal: "PENDING" },
                { label: "Confirmés", value: requests.filter(r => r.status === "CONFIRMED").length, color: "text-green-500", bg: "bg-green-50", filterVal: "CONFIRMED" },
              ].map(s => {
                const isActive = s.filterVal && filter === s.filterVal;
                return (
                  <button
                    key={s.label}
                    onClick={() => s.filterVal && setFilter(s.filterVal)}
                    className={"bg-white rounded-2xl p-5 shadow-sm border flex items-center justify-between w-full text-left transition-all " +
                      (isActive ? "border-[#c9a84c] ring-2 ring-[#c9a84c]/30 shadow-md" : "border-gray-100 hover:border-[#c9a84c]/40 hover:shadow-md") +
                      (s.filterVal ? " cursor-pointer" : " cursor-default")}
                  >
                    <div>
                      <p className={"text-xs mb-1 " + (isActive ? "text-[#c9a84c] font-semibold" : "text-gray-400")}>{s.label}</p>
                      <p className="text-3xl font-black text-[#0c4a6e]">{s.value}</p>
                    </div>
                    <div className={`w-12 h-12 ${s.bg} rounded-xl flex items-center justify-center`}>
                      <Briefcase size={22} className={s.color} />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Filtres */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <select
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8] bg-white"
              >
                <option value="ALL">Tous les statuts</option>
                <option value="PENDING">En attente</option>
                <option value="CONFIRMED">Confirmés</option>
                <option value="COMPLETED">Terminés</option>
                <option value="REFUSED">Refusés</option>
              </select>
              <button
                onClick={load}
                className="flex items-center gap-2 bg-[#c9a84c] hover:bg-[#b8973b] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Actualiser
              </button>
              <div className="ml-auto">
                <ExportButton data={exportData} columns={exportColumns} filename="opportunites-demandes" />
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <div className="w-1 h-5 bg-[#c9a84c] rounded-full" />
                <h2 className="font-bold text-[#0c4a6e]">Demandes CÔTIÈRE Opportunités</h2>
                <span className="ml-auto text-xs text-gray-400">{filtered.length} résultat(s)</span>
              </div>

              {loading ? (
                <div className="py-16 text-center text-gray-400">
                  <RefreshCw size={32} className="animate-spin mx-auto mb-3" /> Chargement...
                </div>
              ) : filtered.length === 0 ? (
                <div className="py-16 text-center text-gray-400">Aucune demande trouvée.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        {["Réf.", "Client", "WhatsApp", "Secteur/Projet", "Date", "Statut", "Action"].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filtered.map(r => (
                        <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-2">
                              <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=60&q=80" alt="Opportunités" className="w-9 h-9 rounded-lg object-cover shrink-0 border border-gray-100" />
                              <span className="font-mono text-xs text-gray-400">{r.reference?.slice(-8) ?? r.id.slice(-8)}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <p className="font-semibold text-[#0c4a6e]">{r.clientFirstName} {r.clientLastName}</p>
                            <p className="text-xs text-gray-400">{r.clientEmail}</p>
                          </td>
                          <td className="px-4 py-3">
                            <a
                              href={`https://wa.me/${r.clientPhone?.replace(/\s/g, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 text-xs flex items-center gap-1 hover:underline"
                            >
                              <Phone size={11} /> {r.clientPhone}
                            </a>
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-[#0c4a6e]">
                            <a href="/services/opportunites" target="_blank" rel="noopener noreferrer" className="hover:underline">
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
                              <select
                                value=""
                                onChange={e => { if (e.target.value) changeStatus(r.id, e.target.value); }}
                                className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#38bdf8] bg-white cursor-pointer"
                              >
                                <option value="">Changer statut</option>
                                <option value="PENDING">En attente</option>
                                <option value="CONFIRMED">Confirmer</option>
                                <option value="COMPLETED">Terminer</option>
                                <option value="REFUSED">Refuser</option>
                              </select>
                              <button onClick={() => deleteRequest(r.id)} className="text-red-400 hover:text-red-600 transition-colors">
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

      {/* Modal Ajouter / Modifier un secteur */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
              <h3 className="font-bold text-[#0c4a6e] text-lg">{editId ? "Modifier" : "Ajouter"} un secteur</h3>
              <button onClick={() => { setShowModal(false); setEditId(null); setForm(emptySecteurForm); }} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du secteur *</label>
                <input type="text" placeholder="Tourisme" value={form.nom}
                  onChange={e => setForm(f => ({ ...f, nom: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <input type="text" placeholder="Tourisme / Agriculture / Commerce..." value={form.categorie}
                  onChange={e => setForm(f => ({ ...f, categorie: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Couleur du badge</label>
                <select value={form.couleur} onChange={e => setForm(f => ({ ...f, couleur: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8] bg-white">
                  <option value="bg-cyan-500">Cyan</option>
                  <option value="bg-green-500">Vert</option>
                  <option value="bg-blue-500">Bleu</option>
                  <option value="bg-orange-500">Orange</option>
                  <option value="bg-purple-500">Violet</option>
                  <option value="bg-indigo-500">Indigo</option>
                  <option value="bg-yellow-500">Jaune</option>
                  <option value="bg-red-500">Rouge</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea rows={3} placeholder="Description du secteur..." value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8] resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                {editId && !form.image && (
                  <div className="mb-2 p-2.5 bg-orange-50 border border-orange-200 rounded-lg text-xs text-orange-700 flex items-start gap-2">
                    <span className="shrink-0 mt-0.5">⚠️</span>
                    <span>L'image précédente était stockée localement et n'est plus disponible. Veuillez uploader une nouvelle image.</span>
                  </div>
                )}
                <ImageUploader value={form.image} onChange={val => setForm(f => ({ ...f, image: val }))} />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3 shrink-0">
              <button onClick={() => { setShowModal(false); setEditId(null); setForm(emptySecteurForm); }} className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50">Annuler</button>
              <button onClick={saveSecteur} disabled={!form.nom || savingForm}
                className="flex-1 bg-[#c9a84c] hover:bg-[#b8973b] text-white font-bold py-2.5 rounded-xl disabled:opacity-60">
                {savingForm ? "Enregistrement..." : editId ? "Modifier" : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
