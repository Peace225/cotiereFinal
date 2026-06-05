"use client";
import { useEffect, useState } from "react";
import { RefreshCw, Building2, Phone, Trash2, CheckCircle, Pencil, Plus, X } from "lucide-react";
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

const DEFAULT_CATALOGUE_SERVICES = [
  {
    id: "coaching",
    nom: "Coaching institutionnel",
    description: "Accompagnement stratégique des institutions et collectivités locales pour améliorer leur gouvernance.",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80",
    categorie: "Coaching",
  },
  {
    id: "accompagnement",
    nom: "Accompagnement collectivités",
    description: "Soutien opérationnel aux mairies et conseils régionaux dans leurs projets de développement.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80",
    categorie: "Accompagnement",
  },
  {
    id: "formation",
    nom: "Formation",
    description: "Programmes de formation pour les élus locaux et agents des collectivités territoriales.",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&q=80",
    categorie: "Formation",
  },
  {
    id: "developpement",
    nom: "Développement local",
    description: "Conception et mise en œuvre de projets de développement économique et social local.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    categorie: "Développement",
  },
  {
    id: "mediation",
    nom: "Médiation",
    description: "Services de médiation et résolution de conflits entre acteurs locaux et institutions.",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&q=80",
    categorie: "Médiation",
  },
  {
    id: "conseil",
    nom: "Conseil stratégique",
    description: "Conseil en planification stratégique et élaboration de plans de développement communaux.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80",
    categorie: "Conseil",
  },
];

const emptyServiceForm = { nom: "", categorie: "", description: "", image: "" };

function matchesCollectivites(r: EventRequest) {
  const type = r.eventType?.toLowerCase() ?? "";
  return type.includes("collectivit");
}

export default function AdminCollectivitesPage() {
  const [catalogueServices, setCatalogueServices] = useState(DEFAULT_CATALOGUE_SERVICES);
  const [requests, setRequests] = useState<EventRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [tab, setTab] = useState<"catalogue" | "reservations">("reservations");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyServiceForm);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/events/requests?limit=200");
      const data = await res.json();
      const all: EventRequest[] = data.data?.requests ?? [];
      setRequests(all.filter(matchesCollectivites));
    } catch {}
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

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

  function saveService() {
    const service = {
      id: Date.now().toString(),
      nom: form.nom,
      categorie: form.categorie,
      description: form.description,
      image: form.image || "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80",
    };
    setCatalogueServices(prev => [...prev, service]);
    setShowModal(false);
    setForm(emptyServiceForm);
  }

  const filtered = filter === "ALL" ? requests : requests.filter(r => r.status === filter);

  const exportData = filtered.map(r => ({
    reference: r.reference,
    client: `${r.clientFirstName} ${r.clientLastName}`,
    telephone: r.clientPhone,
    service: r.eventType,
    date: new Date(r.createdAt).toLocaleDateString("fr-FR"),
    statut: STATUS_LABELS[r.status] ?? r.status,
  }));

  const exportColumns = [
    { key: "reference", label: "Référence" },
    { key: "client", label: "Client" },
    { key: "telephone", label: "Téléphone" },
    { key: "service", label: "Service demandé" },
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
              <Building2 size={20} className="text-[#c9a84c]" />
            </div>
            <h1 className="text-2xl font-black text-[#0c4a6e]">CÔTIÈRE Collectivités & Services</h1>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-[#c9a84c] hover:bg-[#b8973b] text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors shadow-md"
            >
              <Plus size={15} /> Ajouter un service
            </button>
            <button
              onClick={() => setTab("catalogue")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "catalogue" ? "bg-[#0c4a6e] text-white" : "bg-white text-gray-500 border border-gray-200"}`}
            >
              Services ({catalogueServices.length})
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {catalogueServices.map(s => (
              <div key={s.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <div className="relative h-40 bg-gray-100">
                  <img src={s.image} alt={s.nom} className="w-full h-full object-cover" />
                  <span className="absolute top-3 right-3 bg-[#0c4a6e] text-[#c9a84c] text-xs font-bold px-2 py-1 rounded-full">
                    {s.categorie}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-[#0c4a6e] mb-1">{s.nom}</h3>
                  <p className="text-xs text-gray-400 mb-3 line-clamp-2">{s.description}</p>
                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-1 text-xs font-bold py-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors">
                      <CheckCircle size={13} /> Activer
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1 text-xs font-bold py-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors">
                      <Pencil size={13} /> Modifier
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1 text-xs font-bold py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors">
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
                      <Building2 size={22} className={s.color} />
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
                <ExportButton data={exportData} columns={exportColumns} filename="collectivites-demandes" />
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <div className="w-1 h-5 bg-[#c9a84c] rounded-full" />
                <h2 className="font-bold text-[#0c4a6e]">Demandes Collectivités &amp; Services</h2>
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
                        {["Réf.", "Client", "WhatsApp", "Service demandé", "Date", "Statut", "Action"].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filtered.map(r => (
                        <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-2">
                              <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=60&q=80" alt="Collectivités" className="w-9 h-9 rounded-lg object-cover shrink-0 border border-gray-100" />
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
                            <a href="/services/collectivites" target="_blank" rel="noopener noreferrer" className="hover:underline">
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

      {/* Modal Ajouter un service */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
              <h3 className="font-bold text-[#0c4a6e] text-lg">Ajouter un service</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du service *</label>
                <input type="text" placeholder="Coaching institutionnel" value={form.nom}
                  onChange={e => setForm(f => ({ ...f, nom: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <input type="text" placeholder="Coaching / Formation / Conseil..." value={form.categorie}
                  onChange={e => setForm(f => ({ ...f, categorie: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea rows={3} placeholder="Description du service..." value={form.description}
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
              <button onClick={saveService} disabled={!form.nom}
                className="flex-1 bg-[#c9a84c] hover:bg-[#b8973b] text-white font-bold py-2.5 rounded-xl disabled:opacity-60">Ajouter</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
