"use client";
import { useEffect, useState } from "react";
import {
  RefreshCw, Building2, Phone, Trash2, CheckCircle, Pencil, Plus, X,
  BookOpen, Mail, Globe, MapPin, Clock, Search, Filter,
} from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import ExportButton from "@/components/admin/ExportButton";
import ImageUploader from "@/components/admin/ImageUploader";

// --- Types ---

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

type AnnuaireContact = {
  id: string;
  nom: string;
  type: string;
  ville: string;
  region: string;
  telephone?: string | null;
  email?: string | null;
  adresse?: string | null;
  siteWeb?: string | null;
  horaires?: string | null;
  isActive: boolean;
  createdAt: string;
};

type CatalogueService = {
  id: string;
  nom: string;
  description: string;
  image: string;
  categorie: string;
};

// --- Constantes ---

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

const TYPE_LABELS: Record<string, string> = {
  mairie: "Mairie",
  conseil: "Conseil",
  service: "Service public",
  prefecture: "Préfecture",
  sous_prefecture: "Sous-préfecture",
  autre: "Autre",
};

const TYPE_COLORS: Record<string, string> = {
  mairie: "bg-blue-100 text-blue-700",
  conseil: "bg-purple-100 text-purple-700",
  service: "bg-green-100 text-green-700",
  prefecture: "bg-orange-100 text-orange-700",
  sous_prefecture: "bg-yellow-100 text-yellow-700",
  autre: "bg-gray-100 text-gray-600",
};

const emptyServiceForm = { nom: "", categorie: "", description: "", image: "" };
const emptyAnnuaireForm = {
  nom: "", type: "mairie", ville: "", region: "",
  telephone: "", email: "", adresse: "", siteWeb: "", horaires: "",
};

function matchesCollectivites(r: EventRequest) {
  return (r.eventType?.toLowerCase() ?? "").includes("collectivit");
}

// --- Composant principal ---

export default function AdminCollectivitesPage() {
  const [catalogueServices, setCatalogueServices] = useState<CatalogueService[]>([]);
  const [requests, setRequests] = useState<EventRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [tab, setTab] = useState<"catalogue" | "reservations" | "annuaire">("reservations");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyServiceForm);

  const [annuaire, setAnnuaire] = useState<AnnuaireContact[]>([]);
  const [annuaireLoading, setAnnuaireLoading] = useState(false);
  const [annuaireSearch, setAnnuaireSearch] = useState("");
  const [annuaireTypeFilter, setAnnuaireTypeFilter] = useState("ALL");
  const [showAnnuaireModal, setShowAnnuaireModal] = useState(false);
  const [editingContact, setEditingContact] = useState<AnnuaireContact | null>(null);
  const [annuaireForm, setAnnuaireForm] = useState(emptyAnnuaireForm);

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

  async function loadAnnuaire() {
    setAnnuaireLoading(true);
    try {
      const params = new URLSearchParams();
      if (annuaireTypeFilter !== "ALL") params.set("type", annuaireTypeFilter);
      if (annuaireSearch) params.set("search", annuaireSearch);
      const res = await fetch(`/api/admin/collectivites/annuaire?${params}`);
      const data = await res.json();
      setAnnuaire(data.contacts ?? []);
    } catch {}
    setAnnuaireLoading(false);
  }

  useEffect(() => { load(); }, []);
  useEffect(() => { if (tab === "annuaire") loadAnnuaire(); }, [tab, annuaireTypeFilter]);

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

  function deleteService(id: string) {
    if (!confirm("Supprimer ce service du catalogue ?")) return;
    setCatalogueServices(prev => prev.filter(s => s.id !== id));
  }

  function openNewContact() {
    setEditingContact(null);
    setAnnuaireForm(emptyAnnuaireForm);
    setShowAnnuaireModal(true);
  }

  function openEditContact(c: AnnuaireContact) {
    setEditingContact(c);
    setAnnuaireForm({
      nom: c.nom, type: c.type, ville: c.ville, region: c.region ?? "",
      telephone: c.telephone ?? "", email: c.email ?? "",
      adresse: c.adresse ?? "", siteWeb: c.siteWeb ?? "", horaires: c.horaires ?? "",
    });
    setShowAnnuaireModal(true);
  }

  async function saveContact() {
    const payload = {
      ...annuaireForm,
      telephone: annuaireForm.telephone || null,
      email: annuaireForm.email || null,
      adresse: annuaireForm.adresse || null,
      siteWeb: annuaireForm.siteWeb || null,
      horaires: annuaireForm.horaires || null,
    };
    if (editingContact) {
      await fetch(`/api/admin/collectivites/annuaire/${editingContact.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/admin/collectivites/annuaire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    setShowAnnuaireModal(false);
    loadAnnuaire();
  }

  async function deleteContact(id: string) {
    if (!confirm("Supprimer ce contact de l'annuaire ?")) return;
    await fetch(`/api/admin/collectivites/annuaire/${id}`, { method: "DELETE" });
    setAnnuaire(prev => prev.filter(c => c.id !== id));
  }

  const filteredAnnuaire = annuaire.filter(c => {
    if (!annuaireSearch) return true;
    const q = annuaireSearch.toLowerCase();
    return c.nom.toLowerCase().includes(q) || c.ville.toLowerCase().includes(q) || (c.region ?? "").toLowerCase().includes(q);
  });

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

  const exportAnnuaire = filteredAnnuaire.map(c => ({
    nom: c.nom,
    type: TYPE_LABELS[c.type] ?? c.type,
    ville: c.ville,
    region: c.region,
    telephone: c.telephone ?? "",
    email: c.email ?? "",
    adresse: c.adresse ?? "",
  }));
  
  const exportAnnuaireColumns = [
    { key: "nom", label: "Nom" },
    { key: "type", label: "Type" },
    { key: "ville", label: "Ville" },
    { key: "region", label: "Région" },
    { key: "telephone", label: "Téléphone" },
    { key: "email", label: "Email" },
    { key: "adresse", label: "Adresse" },
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
            <h1 className="text-2xl font-black text-[#0c4a6e]">Collectivités & Services</h1>
          </div>
          <div className="flex gap-2 flex-wrap">
            {tab === "catalogue" && (
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 bg-[#c9a84c] hover:bg-[#b8973b] text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors shadow-md"
              >
                <Plus size={15} /> Ajouter un service
              </button>
            )}
            {tab === "annuaire" && (
              <button
                onClick={openNewContact}
                className="flex items-center gap-2 bg-[#c9a84c] hover:bg-[#b8973b] text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors shadow-md"
              >
                <Plus size={15} /> Ajouter un contact
              </button>
            )}
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
            <button
              onClick={() => setTab("annuaire")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "annuaire" ? "bg-[#0c4a6e] text-white" : "bg-white text-gray-500 border border-gray-200"}`}
            >
              <BookOpen size={14} /> Annuaire ({annuaire.length})
            </button>
          </div>
        </div>

        {/* Onglet Catalogue */}
        {tab === "catalogue" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {catalogueServices.length === 0 ? (
              <div className="col-span-full py-16 text-center text-gray-400 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <BookOpen size={40} className="mx-auto mb-3 text-gray-200" />
                <p className="font-medium">Aucun service dans le catalogue</p>
                <p className="text-sm mt-1">Cliquez sur &quot;Ajouter un service&quot; pour commencer</p>
              </div>
            ) : (
              catalogueServices.map(s => (
                <div key={s.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col justify-between">
                  <div>
                    <div className="relative h-40 bg-gray-100">
                      <img src={s.image} alt={s.nom} className="w-full h-full object-cover" />
                      <span className="absolute top-3 right-3 bg-[#0c4a6e] text-[#c9a84c] text-xs font-bold px-2 py-1 rounded-full">
                        {s.categorie}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-[#0c4a6e] mb-1">{s.nom}</h3>
                      <p className="text-xs text-gray-400 mb-3 line-clamp-2">{s.description}</p>
                    </div>
                  </div>
                  <div className="p-4 pt-0">
                    <div className="flex gap-2">
                      <button onClick={() => deleteService(s.id)} className="w-full flex items-center justify-center gap-1 text-xs font-bold py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors">
                        <Trash2 size={13} /> Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Onglet Demandes */}
        {tab === "reservations" && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {[
                { label: "Total", value: requests.length, color: "text-blue-500", bg: "bg-blue-50", filterVal: "ALL" },
                { label: "En attente", value: requests.filter(r => r.status === "PENDING").length, color: "text-yellow-500", bg: "bg-yellow-50", filterVal: "PENDING" },
                { label: "Confirmés", value: requests.filter(r => r.status === "CONFIRMED").length, color: "text-green-500", bg: "bg-green-50", filterVal: "CONFIRMED" },
              ].map(s => {
                const isActive = filter === s.filterVal;
                return (
                  <button
                    key={s.label}
                    onClick={() => setFilter(s.filterVal)}
                    className={"bg-white rounded-2xl p-5 shadow-sm border flex items-center justify-between w-full text-left transition-all " +
                      (isActive ? "border-[#c9a84c] ring-2 ring-[#c9a84c]/30 shadow-md" : "border-gray-100 hover:border-[#c9a84c]/40 hover:shadow-md cursor-pointer")}
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
                              <span className="font-mono text-xs text-gray-400">{r.reference?.slice(-8) ?? r.id.slice(-8)}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <p className="font-semibold text-[#0c4a6e]">{r.clientFirstName} {r.clientLastName}</p>
                            <p className="text-xs text-gray-400">{r.clientEmail}</p>
                          </td>
                          <td className="px-4 py-3">
                            <a href={`https://wa.me/${r.clientPhone?.replace(/\s/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-green-600 text-xs flex items-center gap-1 hover:underline">
                              <Phone size={11} /> {r.clientPhone}
                            </a>
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-[#0c4a6e]">
                            <span>{r.eventType}</span>
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
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* Onglet Annuaire */}
        {tab === "annuaire" && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Total", value: annuaire.length, type: "ALL", color: "text-blue-500", bg: "bg-blue-50" },
                { label: "Mairies", value: annuaire.filter(c => c.type === "mairie").length, type: "mairie", color: "text-blue-600", bg: "bg-blue-50" },
                { label: "Conseils", value: annuaire.filter(c => c.type === "conseil").length, type: "conseil", color: "text-purple-500", bg: "bg-purple-50" },
                { label: "Services publics", value: annuaire.filter(c => c.type === "service").length, type: "service", color: "text-green-500", bg: "bg-green-50" },
              ].map(s => {
                const isActive = annuaireTypeFilter === s.type;
                return (
                  <button
                    key={s.label}
                    onClick={() => setAnnuaireTypeFilter(s.type)}
                    className={"bg-white rounded-2xl p-4 shadow-sm border flex items-center justify-between w-full text-left transition-all " +
                      (isActive ? "border-[#c9a84c] ring-2 ring-[#c9a84c]/30" : "border-gray-100 hover:border-[#c9a84c]/40 hover:shadow-md")}
                  >
                    <div>
                      <p className={"text-xs mb-1 " + (isActive ? "text-[#c9a84c] font-semibold" : "text-gray-400")}>{s.label}</p>
                      <p className="text-2xl font-black text-[#0c4a6e]">{s.value}</p>
                    </div>
                    <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center`}>
                      <Building2 size={18} className={s.color} />
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, ville, région..."
                  value={annuaireSearch}
                  onChange={e => setAnnuaireSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8] bg-white"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-gray-400" />
                <select
                  value={annuaireTypeFilter}
                  onChange={e => setAnnuaireTypeFilter(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8] bg-white"
                >
                  <option value="ALL">Tous les types</option>
                  <option value="mairie">Mairies</option>
                  <option value="conseil">Conseils</option>
                  <option value="service">Services publics</option>
                  <option value="prefecture">Préfectures</option>
                  <option value="sous_prefecture">Sous-préfectures</option>
                  <option value="autre">Autres</option>
                </select>
              </div>
              <button
                onClick={loadAnnuaire}
                className="flex items-center gap-2 bg-[#c9a84c] hover:bg-[#b8973b] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                <RefreshCw size={14} className={annuaireLoading ? "animate-spin" : ""} /> Actualiser
              </button>
              <div className="ml-auto">
                <ExportButton data={exportAnnuaire} columns={exportAnnuaireColumns} filename="annuaire-collectivites" />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <div className="w-1 h-5 bg-[#c9a84c] rounded-full" />
                <BookOpen size={16} className="text-[#0c4a6e]" />
                <h2 className="font-bold text-[#0c4a6e]">Annuaire des mairies, conseils & services publics</h2>
                <span className="ml-auto text-xs text-gray-400">{filteredAnnuaire.length} contact(s)</span>
              </div>

              {annuaireLoading ? (
                <div className="py-16 text-center text-gray-400">
                  <RefreshCw size={32} className="animate-spin mx-auto mb-3" /> Chargement...
                </div>
              ) : filteredAnnuaire.length === 0 ? (
                <div className="py-16 text-center">
                  <BookOpen size={40} className="mx-auto mb-3 text-gray-200" />
                  <p className="text-gray-400 font-medium">Aucun contact dans l&apos;annuaire</p>
                  <p className="text-gray-300 text-sm mt-1">Cliquez sur &quot;Ajouter un contact&quot; pour commencer</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        {["Nom", "Type", "Ville / Région", "Contact", "Horaires", "Actions"].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredAnnuaire.map(c => (
                        <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <p className="font-semibold text-[#0c4a6e]">{c.nom}</p>
                            {c.adresse && (
                              <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                <MapPin size={10} /> {c.adresse}
                              </p>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${TYPE_COLORS[c.type] ?? "bg-gray-100 text-gray-600"}`}>
                              {TYPE_LABELS[c.type] ?? c.type}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <p className="font-medium text-gray-700">{c.ville}</p>
                            {c.region && <p className="text-xs text-gray-400">{c.region}</p>}
                          </td>
                          <td className="px-4 py-3 space-y-1">
                            {c.telephone && (
                              <a href={`tel:${c.telephone}`} className="text-xs text-blue-600 flex items-center gap-1 hover:underline">
                                <Phone size={10} /> {c.telephone}
                              </a>
                            )}
                            {c.email && (
                              <a href={`mailto:${c.email}`} className="text-xs text-gray-500 flex items-center gap-1 hover:underline">
                                <Mail size={10} /> {c.email}
                              </a>
                            )}
                            {c.siteWeb && (
                              <a href={c.siteWeb} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-500 flex items-center gap-1 hover:underline">
                                <Globe size={10} /> Site web
                              </a>
                            )}
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-500">
                            {c.horaires || "-"}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button onClick={() => openEditContact(c)} className="text-blue-500 hover:text-blue-700">
                                <Pencil size={14} />
                              </button>
                              <button onClick={() => deleteContact(c.id)} className="text-red-400 hover:text-red-600">
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

        {/* Modal Ajout Service */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-[#0c4a6e]">Ajouter un service</h3>
                <button onClick={() => setShowModal(false)}><X size={20} className="text-gray-400" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Nom du service</label>
                  <input type="text" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" placeholder="Ex: Conseil stratégique" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Catégorie</label>
                  <input type="text" value={form.categorie} onChange={e => setForm({ ...form, categorie: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" placeholder="Ex: Conseil" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Description</label>
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" placeholder="Description du service..." />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Image (URL ou Upload)</label>
                  <input type="text" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8] mb-3" placeholder="https://..." />
                  {/* Intégration optionnelle du ImageUploader importé */}
                  <ImageUploader onUpload={(url: string) => setForm({ ...form, image: url })} />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700">Annuler</button>
                <button onClick={saveService} className="flex items-center gap-2 bg-[#0c4a6e] hover:bg-[#08334c] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                  <CheckCircle size={16} /> Enregistrer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Ajout/Edit Annuaire */}
        {showAnnuaireModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-[#0c4a6e]">
                  {editingContact ? "Modifier le contact" : "Ajouter un contact"}
                </h3>
                <button onClick={() => setShowAnnuaireModal(false)}><X size={20} className="text-gray-400" /></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 mb-1">Nom *</label>
                  <input type="text" value={annuaireForm.nom} onChange={e => setAnnuaireForm({ ...annuaireForm, nom: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Type *</label>
                  <select value={annuaireForm.type} onChange={e => setAnnuaireForm({ ...annuaireForm, type: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]">
                    <option value="mairie">Mairie</option>
                    <option value="conseil">Conseil</option>
                    <option value="service">Service public</option>
                    <option value="prefecture">Préfecture</option>
                    <option value="sous_prefecture">Sous-préfecture</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Ville *</label>
                  <input type="text" value={annuaireForm.ville} onChange={e => setAnnuaireForm({ ...annuaireForm, ville: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Région</label>
                  <input type="text" value={annuaireForm.region} onChange={e => setAnnuaireForm({ ...annuaireForm, region: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Téléphone</label>
                  <input type="text" value={annuaireForm.telephone} onChange={e => setAnnuaireForm({ ...annuaireForm, telephone: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Email</label>
                  <input type="email" value={annuaireForm.email} onChange={e => setAnnuaireForm({ ...annuaireForm, email: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Horaires</label>
                  <input type="text" value={annuaireForm.horaires} onChange={e => setAnnuaireForm({ ...annuaireForm, horaires: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" placeholder="Ex: Lun-Ven 08h-16h" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 mb-1">Adresse</label>
                  <input type="text" value={annuaireForm.adresse} onChange={e => setAnnuaireForm({ ...annuaireForm, adresse: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 mb-1">Site Web</label>
                  <input type="text" value={annuaireForm.siteWeb} onChange={e => setAnnuaireForm({ ...annuaireForm, siteWeb: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" placeholder="https://..." />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setShowAnnuaireModal(false)} className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700">Annuler</button>
                <button onClick={saveContact} className="flex items-center gap-2 bg-[#0c4a6e] hover:bg-[#08334c] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                  <CheckCircle size={16} /> Enregistrer
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}