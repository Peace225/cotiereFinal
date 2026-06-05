"use client";
import { useEffect, useState } from "react";
import { RefreshCw, Megaphone, Phone, Mail, Trash2, CheckCircle, Pencil, Plus, X } from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import ImageUploader from "@/components/admin/ImageUploader";
import ExportButton from "@/components/admin/ExportButton";

type PubRequest = {
  id: string; reference: string;
  clientFirstName: string; clientLastName: string;
  clientEmail: string; clientPhone: string;
  documentType: string; description?: string;
  status: string; createdAt: string;
};

type SupportPub = {
  id: string; nom: string; categorie: string; prix: string; description: string; image: string; isActive: boolean;
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

const DEFAULT_SUPPORTS: SupportPub[] = [
  { id: "tv", nom: "Publicité TV", categorie: "Audiovisuel", prix: "À partir de 50 000 FCFA", description: "Spots publicitaires diffusés sur CÔTIÈRE TV, la chaîne locale du littoral ivoirien.", image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400&q=80", isActive: true },
  { id: "radio", nom: "Publicité Radio", categorie: "Audiovisuel", prix: "À partir de 25 000 FCFA", description: "Jingles et annonces sur les radios locales du littoral (FM, communautaires).", image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&q=80", isActive: true },
  { id: "web", nom: "Publicité Web & Réseaux", categorie: "Digital", prix: "À partir de 30 000 FCFA", description: "Campagnes sur Facebook, Instagram, TikTok et le site CÔTIÈRE.", image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&q=80", isActive: true },
  { id: "sms", nom: "SMS & WhatsApp Marketing", categorie: "Digital", prix: "À partir de 15 000 FCFA", description: "Envoi de messages promotionnels ciblés à notre base de clients du littoral.", image: "https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=400&q=80", isActive: true },
  { id: "print", nom: "Affichage & Flyers", categorie: "Print", prix: "À partir de 20 000 FCFA", description: "Conception et impression de supports print : affiches, flyers, banderoles.", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", isActive: true },
  { id: "event", nom: "Sponsoring d'événements", categorie: "Événementiel", prix: "Sur devis", description: "Visibilité lors des événements CÔTIÈRE : concerts, galas, foires, marchés.", image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&q=80", isActive: true },
  { id: "starter", nom: "Pack Starter", categorie: "Pack", prix: "75 000 FCFA", description: "1 spot radio × 10 passages + 1 post sponsorisé + conception incluse.", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80", isActive: true },
  { id: "visibilite", nom: "Pack Visibilité", categorie: "Pack", prix: "200 000 FCFA", description: "TV + Radio + Réseaux sociaux 7j + SMS 500 contacts + conception complète.", image: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=400&q=80", isActive: true },
  { id: "premium", nom: "Pack Premium", categorie: "Pack", prix: "Sur devis", description: "Campagne multi-supports illimitée avec accompagnement stratégique.", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80", isActive: true },
];

const emptyForm = { nom: "", categorie: "Audiovisuel", prix: "", description: "", image: "" };

export default function AdminAfroubaPage() {
  const [supports, setSupports] = useState<SupportPub[]>(DEFAULT_SUPPORTS);
  const [requests, setRequests] = useState<PubRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [tab, setTab] = useState<"catalogue" | "demandes">("demandes");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/afrouba");
      const data = await res.json();
      setRequests(data.data?.requests ?? []);
    } catch {}
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function changeStatus(id: string, status: string) {
    await fetch(`/api/afrouba/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  }

  async function deleteRequest(id: string) {
    if (!confirm("Supprimer cette demande ?")) return;
    await fetch(`/api/afrouba/${id}`, { method: "DELETE" });
    setRequests(prev => prev.filter(r => r.id !== id));
  }

  function saveSupport() {
    const s: SupportPub = {
      id: editId ?? Date.now().toString(),
      nom: form.nom, categorie: form.categorie, prix: form.prix,
      description: form.description,
      image: form.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80",
      isActive: true,
    };
    if (editId) setSupports(prev => prev.map(x => x.id === editId ? s : x));
    else setSupports(prev => [...prev, s]);
    setShowModal(false); setForm(emptyForm); setEditId(null);
  }

  function openEdit(s: SupportPub) {
    setForm({ nom: s.nom, categorie: s.categorie, prix: s.prix, description: s.description, image: s.image });
    setEditId(s.id); setShowModal(true);
  }

  const filtered = filter === "ALL" ? requests : requests.filter(r => r.status === filter);

  const SUPPORT_IMAGES: Record<string, string> = {
    "tv": "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=60&q=80",
    "radio": "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=60&q=80",
    "web": "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=60&q=80",
    "sms": "https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=60&q=80",
    "pack": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=60&q=80",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <Megaphone size={20} className="text-amber-600" />
            </div>
            <h1 className="text-2xl font-black text-[#0c4a6e]">Tout Le Monde A Droit À La Pub</h1>
          </div>
          <div className="flex gap-2 flex-wrap">
            {tab === "catalogue" && (
              <button onClick={() => { setShowModal(true); setEditId(null); setForm(emptyForm); }}
                className="flex items-center gap-2 bg-[#c9a84c] hover:bg-[#b8973b] text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors shadow-md">
                <Plus size={15} /> Ajouter un support
              </button>
            )}
            <button onClick={() => setTab("catalogue")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "catalogue" ? "bg-[#0c4a6e] text-white" : "bg-white text-gray-500 border border-gray-200"}`}>
              Supports ({supports.length})
            </button>
            <button onClick={() => setTab("demandes")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "demandes" ? "bg-[#0c4a6e] text-white" : "bg-white text-gray-500 border border-gray-200"}`}>
              Demandes ({requests.length})
            </button>
          </div>
        </div>

        {/* Onglet Catalogue supports */}
        {tab === "catalogue" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {supports.map(s => (
              <div key={s.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <div className="relative h-36 bg-gray-100">
                  <img src={s.image} alt={s.nom} className="w-full h-full object-cover" />
                  <span className={`absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full font-bold ${s.isActive ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                    {s.isActive ? "ACTIF" : "INACTIF"}
                  </span>
                  <span className="absolute top-3 right-3 bg-[#c9a84c] text-white text-xs font-bold px-2 py-1 rounded-full">
                    {s.categorie}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-[#0c4a6e] mb-1">{s.nom}</h3>
                  <p className="text-xs text-[#c9a84c] font-semibold mb-1">{s.prix}</p>
                  <p className="text-xs text-gray-400 mb-3 line-clamp-2">{s.description}</p>
                  <div className="flex gap-2">
                    <button onClick={() => setSupports(prev => prev.map(x => x.id === s.id ? { ...x, isActive: !x.isActive } : x))}
                      className={`flex-1 flex items-center justify-center gap-1 text-xs font-bold py-2 rounded-lg transition-colors ${s.isActive ? "bg-orange-100 text-orange-600 hover:bg-orange-200" : "bg-green-100 text-green-600 hover:bg-green-200"}`}>
                      <CheckCircle size={13} /> {s.isActive ? "Désactiver" : "Activer"}
                    </button>
                    <button onClick={() => openEdit(s)}
                      className="flex-1 flex items-center justify-center gap-1 text-xs font-bold py-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors">
                      <Pencil size={13} /> Modifier
                    </button>
                    <button onClick={() => { if (confirm("Supprimer ?")) setSupports(prev => prev.filter(x => x.id !== s.id)); }}
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
        {tab === "demandes" && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Total", value: requests.length, color: "text-blue-500", bg: "bg-blue-50", filterVal: "ALL" },
                { label: "En attente", value: requests.filter(r => r.status === "PENDING").length, color: "text-yellow-500", bg: "bg-yellow-50", filterVal: "PENDING" },
                { label: "Confirmés", value: requests.filter(r => r.status === "CONFIRMED").length, color: "text-green-500", bg: "bg-green-50", filterVal: "CONFIRMED" },
                { label: "Terminés", value: requests.filter(r => r.status === "COMPLETED").length, color: "text-blue-500", bg: "bg-blue-50", filterVal: "COMPLETED" },
              ].map(s => {
                const isActive = filter === s.filterVal;
                return (
                  <button key={s.label} onClick={() => setFilter(s.filterVal)}
                    className={"bg-white rounded-2xl p-5 shadow-sm border flex items-center justify-between w-full text-left transition-all cursor-pointer " +
                      (isActive ? "border-[#c9a84c] ring-2 ring-[#c9a84c]/30 shadow-md" : "border-gray-100 hover:border-[#c9a84c]/40 hover:shadow-md")}>
                    <div>
                      <p className={"text-xs mb-1 " + (isActive ? "text-[#c9a84c] font-semibold" : "text-gray-400")}>{s.label}</p>
                      <p className="text-3xl font-black text-[#0c4a6e]">{s.value}</p>
                    </div>
                    <div className={`w-12 h-12 ${s.bg} rounded-xl flex items-center justify-center`}>
                      <Megaphone size={22} className={s.color} />
                    </div>
                  </button>
                );
              })}
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
              <button onClick={load} className="flex items-center gap-2 bg-[#c9a84c] hover:bg-[#b8973b] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Actualiser
              </button>
              <div className="ml-auto">
                <ExportButton
                  data={filtered.map(r => ({
                    reference: r.reference, client: `${r.clientFirstName} ${r.clientLastName}`,
                    telephone: r.clientPhone, support: r.documentType,
                    description: r.description ?? "", date: new Date(r.createdAt).toLocaleDateString("fr-FR"),
                    statut: STATUS_LABELS[r.status] ?? r.status,
                  }))}
                  columns={[
                    { key: "reference", label: "Référence" }, { key: "client", label: "Client" },
                    { key: "telephone", label: "Téléphone" }, { key: "support", label: "Support" },
                    { key: "description", label: "Description" }, { key: "date", label: "Date" },
                    { key: "statut", label: "Statut" },
                  ]}
                  filename={"pub-demandes-" + new Date().toISOString().split("T")[0]}
                  label="Demandes"
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <div className="w-1 h-5 bg-[#c9a84c] rounded-full" />
                <h2 className="font-bold text-[#0c4a6e]">Demandes publicitaires</h2>
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
                        {["Réf.", "Client", "Contact", "Support souhaité", "Budget / Détails", "Date", "Statut", "Action"].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filtered.map(r => {
                        const typeKey = (r.documentType ?? "").toLowerCase();
                        const imgSrc = Object.keys(SUPPORT_IMAGES).find(k => typeKey.includes(k))
                          ? SUPPORT_IMAGES[Object.keys(SUPPORT_IMAGES).find(k => typeKey.includes(k))!]
                          : "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=60&q=80";
                        return (
                          <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-3 py-3">
                              <div className="flex items-center gap-2">
                                <img src={imgSrc} alt="support" className="w-9 h-9 rounded-lg object-cover shrink-0 border border-gray-100" />
                                <span className="font-mono text-xs text-gray-400">{r.reference?.slice(-8)}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <p className="font-semibold text-[#0c4a6e]">{r.clientFirstName} {r.clientLastName}</p>
                            </td>
                            <td className="px-4 py-3">
                              <a href={`https://wa.me/${r.clientPhone?.replace(/\s/g, "")}`} target="_blank" rel="noopener noreferrer"
                                className="text-green-600 text-xs flex items-center gap-1 hover:underline">
                                <Phone size={11} /> {r.clientPhone}
                              </a>
                              {r.clientEmail && (
                                <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                  <Mail size={11} /> {r.clientEmail}
                                </p>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm font-medium text-[#0c4a6e]">{r.documentType || "—"}</td>
                            <td className="px-4 py-3 text-xs text-gray-500 max-w-[180px] truncate">{r.description || "—"}</td>
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
                                  className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#38bdf8] bg-white cursor-pointer">
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
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Modal Ajouter/Modifier support */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
              <h3 className="font-bold text-[#0c4a6e] text-lg">{editId ? "Modifier" : "Ajouter"} un support publicitaire</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du support *</label>
                <input type="text" placeholder="Publicité TV" value={form.nom}
                  onChange={e => setForm(f => ({ ...f, nom: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
                <select value={form.categorie} onChange={e => setForm(f => ({ ...f, categorie: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8] bg-white">
                  {["Audiovisuel", "Digital", "Print", "Événementiel", "Pack"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prix</label>
                <input type="text" placeholder="À partir de 50 000 FCFA" value={form.prix}
                  onChange={e => setForm(f => ({ ...f, prix: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea rows={3} placeholder="Description du support..." value={form.description}
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
              <button onClick={saveSupport} disabled={!form.nom}
                className="flex-1 bg-[#c9a84c] hover:bg-[#b8973b] text-white font-bold py-2.5 rounded-xl disabled:opacity-60">
                {editId ? "Modifier" : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
