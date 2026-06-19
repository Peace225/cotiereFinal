"use client";
import { useEffect, useState } from "react";
import { RefreshCw, Car, Phone, Trash2, Plus, Pencil, X, CheckCircle } from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import ExportButton from "@/components/admin/ExportButton";
import ImageUploader from "@/components/admin/ImageUploader";

type Vehicule = {
  id: string; nom: string; categorie: string; description: string;
  prix: string; caution: string; places: number; image: string; isActive: boolean;
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
  PENDING: "En attente", CONFIRMED: "ConfirmÃ©", REFUSED: "RefusÃ©",
  CANCELLED: "AnnulÃ©", COMPLETED: "TerminÃ©",
};

const DEFAULT_VEHICULES: Vehicule[] = [
  { id: "citadine", nom: "Voiture Citadine", categorie: "Ã‰conomique", description: "IdÃ©ale pour les dÃ©placements en ville. ClimatisÃ©e, Ã©conomique en carburant.", prix: "15 000 FCFA/jour", caution: "50 000 FCFA", places: 5, image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&q=80", isActive: true },
  { id: "suv", nom: "4x4 / SUV", categorie: "Tout-terrain", description: "Parfait pour les excursions et les routes difficiles du littoral.", prix: "35 000 FCFA/jour", caution: "150 000 FCFA", places: 7, image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&q=80", isActive: true },
  { id: "moto", nom: "Moto / Scooter", categorie: "Deux-roues", description: "Pratique pour se dÃ©placer rapidement dans les ruelles et sur la cÃ´te.", prix: "8 000 FCFA/jour", caution: "30 000 FCFA", places: 2, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", isActive: true },
  { id: "avec-chauffeur", nom: "Avec Chauffeur", categorie: "Service premium", description: "Chauffeur professionnel disponible 24h/24.", prix: "50 000 FCFA/jour", caution: "Aucune", places: 4, image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&q=80", isActive: true },
  { id: "minibus", nom: "Bus / Minibus", categorie: "Groupe", description: "Pour vos sorties en groupe, excursions et transferts d'Ã©quipes.", prix: "80 000 FCFA/jour", caution: "200 000 FCFA", places: 20, image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&q=80", isActive: true },
  { id: "luxe", nom: "VÃ©hicule de Luxe", categorie: "Premium", description: "Mercedes, BMW ou Ã©quivalent pour vos occasions spÃ©ciales.", prix: "100 000 FCFA/jour", caution: "500 000 FCFA", places: 5, image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&q=80", isActive: true },
];

const emptyForm = { nom: "", categorie: "", description: "", prix: "", caution: "", places: "5", image: "" };

export default function AdminVehiculesPage() {
  const [vehicules, setVehicules] = useState<Vehicule[]>([]);
  const [loadingVehicules, setLoadingVehicules] = useState(true);
  const [requests, setRequests] = useState<EventRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"vehicules" | "reservations">("vehicules");
  const [filter, setFilter] = useState("ALL");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // â”€â”€ Chargement des vÃ©hicules depuis la DB â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  async function loadVehicules() {
    setLoadingVehicules(true);
    try {
      const res = await fetch("/api/vehicules");
      const data = await res.json();
      setVehicules(data.data ?? []);
    } catch {}
    setLoadingVehicules(false);
  }

  async function loadRequests() {
    setLoading(true);
    try {
      const res = await fetch("/api/events/requests?limit=500");
      const data = await res.json();
      const all: EventRequest[] = data.data?.requests ?? data.data ?? [];
      setRequests(all.filter(r => {
        const t = (r.eventType ?? "").toLowerCase();
        return t.includes("vehicule") || t.includes("voiture") || t.includes("location v") || t.includes("moto") || t.includes("chauffeur") || t.includes("minibus");
      }));
    } catch {}
    setLoading(false);
  }

  useEffect(() => { loadRequests(); loadVehicules(); }, []);

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

  // â”€â”€ CRUD vÃ©hicules â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  async function saveVehicule() {
    if (!form.nom) return;
    setSaving(true);
    try {
      if (editId) {
        const res = await fetch(`/api/vehicules/${editId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nom: form.nom, categorie: form.categorie, description: form.description, prix: form.prix, caution: form.caution, places: parseInt(form.places) || 5, image: form.image }),
        });
        const data = await res.json();
        if (res.ok && data.data) setVehicules(prev => prev.map(x => x.id === editId ? data.data : x));
        else alert(`Erreur : ${data.error ?? "Impossible de modifier."}`);
      } else {
        const res = await fetch("/api/vehicules", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nom: form.nom, categorie: form.categorie, description: form.description, prix: form.prix, caution: form.caution, places: parseInt(form.places) || 5, image: form.image }),
        });
        const data = await res.json();
        if (res.ok && data.data) setVehicules(prev => [...prev, data.data]);
        else alert(`Erreur : ${data.error ?? "Impossible de crÃ©er."}`);
      }
      setShowModal(false); setForm(emptyForm); setEditId(null);
    } catch { alert("Erreur rÃ©seau."); }
    setSaving(false);
  }

  function openEdit(v: Vehicule) {
    setForm({ nom: v.nom, categorie: v.categorie, description: v.description, prix: v.prix, caution: v.caution, places: String(v.places), image: v.image });
    setEditId(v.id); setShowModal(true);
  }

  async function toggleActive(v: Vehicule) {
    const res = await fetch(`/api/vehicules/${v.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !v.isActive }),
    });
    if (res.ok) setVehicules(prev => prev.map(x => x.id === v.id ? { ...x, isActive: !x.isActive } : x));
  }

  async function deleteVehicule(id: string) {
    if (!confirm("Supprimer ce vÃ©hicule ?")) return;
    const res = await fetch(`/api/vehicules/${id}`, { method: "DELETE" });
    if (res.ok) setVehicules(prev => prev.filter(x => x.id !== id));
    else alert("Impossible de supprimer ce vÃ©hicule.");
  }

  const filtered = filter === "ALL" ? requests : requests.filter(r => r.status === filter);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <Car size={20} className="text-red-600" />
            </div>
            <h1 className="text-2xl font-black text-[#0c4a6e]">Location de VÃ©hicules</h1>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => { setShowModal(true); setEditId(null); setForm(emptyForm); }}
              className="flex items-center gap-2 bg-[#c9a84c] hover:bg-[#b8973b] text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors shadow-md">
              <Plus size={15} /> Ajouter un vÃ©hicule
            </button>
            <button onClick={() => setTab("vehicules")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "vehicules" ? "bg-[#0c4a6e] text-white" : "bg-white text-gray-500 border border-gray-200"}`}>
              VÃ©hicules ({vehicules.length})
            </button>
            <button onClick={() => setTab("reservations")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "reservations" ? "bg-[#0c4a6e] text-white" : "bg-white text-gray-500 border border-gray-200"}`}>
              RÃ©servations ({requests.length})
            </button>
          </div>
        </div>

        {/* Onglet VÃ©hicules */}
        {tab === "vehicules" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {loadingVehicules ? (
              <div className="col-span-3 py-12 text-center text-gray-400">Chargement des vÃ©hicules...</div>
            ) : vehicules.length === 0 ? (
              <div className="col-span-3 py-12 text-center text-gray-400">Aucun vÃ©hicule. Cliquez sur "Ajouter" pour commencer.</div>
            ) : vehicules.map(v => (
              <div key={v.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <div className="relative h-40 bg-gray-100">
                  <img src={v.image} alt={v.nom} className="w-full h-full object-cover" />
                  <span className={`absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full font-bold ${v.isActive ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                    {v.isActive ? "DISPONIBLE" : "INDISPONIBLE"}
                  </span>
                  <span className="absolute top-3 right-3 bg-[#c9a84c] text-white text-xs font-bold px-2 py-1 rounded-full">
                    {v.categorie}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-[#0c4a6e] mb-1">{v.nom}</h3>
                  <p className="text-xs text-gray-500 mb-1">{v.places} places Â· {v.prix}</p>
                  <p className="text-xs text-gray-400 mb-3">Caution : {v.caution}</p>
                  <div className="flex gap-2">
                    <button onClick={() => toggleActive(v)}
                      className={`flex-1 flex items-center justify-center gap-1 text-xs font-bold py-2 rounded-lg transition-colors ${v.isActive ? "bg-orange-100 text-orange-600 hover:bg-orange-200" : "bg-green-100 text-green-600 hover:bg-green-200"}`}>
                      <CheckCircle size={13} /> {v.isActive ? "DÃ©sactiver" : "Activer"}
                    </button>
                    <button onClick={() => openEdit(v)}
                      className="flex-1 flex items-center justify-center gap-1 text-xs font-bold py-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors">
                      <Pencil size={13} /> Modifier
                    </button>
                    <button onClick={() => deleteVehicule(v.id)}
                      className="flex-1 flex items-center justify-center gap-1 text-xs font-bold py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors">
                      <Trash2 size={13} /> Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Onglet RÃ©servations */}
        {tab === "reservations" && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: "Total", value: requests.length, color: "text-blue-500", bg: "bg-blue-50" },
                { label: "En attente", value: requests.filter(r => r.status === "PENDING").length, color: "text-yellow-500", bg: "bg-yellow-50" },
                { label: "ConfirmÃ©s", value: requests.filter(r => r.status === "CONFIRMED").length, color: "text-green-500", bg: "bg-green-50" },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
                  <div><p className="text-gray-400 text-xs mb-1">{s.label}</p><p className={`text-3xl font-black ${s.color}`}>{s.value}</p></div>
                  <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center`}><Car size={18} className={s.color} /></div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <select value={filter} onChange={e => setFilter(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8] bg-white">
                <option value="ALL">Tous les statuts</option>
                <option value="PENDING">En attente</option>
                <option value="CONFIRMED">ConfirmÃ©s</option>
                <option value="COMPLETED">TerminÃ©s</option>
                <option value="REFUSED">RefusÃ©s</option>
              </select>
              <button onClick={loadRequests}
                className="flex items-center gap-2 bg-[#c9a84c] hover:bg-[#b8973b] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Actualiser
              </button>
              <div className="ml-auto">
                <ExportButton
                  data={filtered.map(r => ({
                    reference: r.reference, client: `${r.clientFirstName} ${r.clientLastName}`,
                    telephone: r.clientPhone, vehicule: r.eventType,
                    date: new Date(r.createdAt).toLocaleDateString("fr-FR"), statut: STATUS_LABELS[r.status] ?? r.status,
                  }))}
                  columns={[
                    { key: "reference", label: "RÃ©fÃ©rence" }, { key: "client", label: "Client" },
                    { key: "telephone", label: "TÃ©lÃ©phone" }, { key: "vehicule", label: "VÃ©hicule" },
                    { key: "date", label: "Date" }, { key: "statut", label: "Statut" },
                  ]}
                  filename={"vehicules-reservations-" + new Date().toISOString().split("T")[0]}
                  label="RÃ©servations"
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <div className="w-1 h-5 bg-red-500 rounded-full" />
                <h2 className="font-bold text-[#0c4a6e]">Demandes de location</h2>
                <span className="ml-auto text-xs text-gray-400">{filtered.length} rÃ©sultat(s)</span>
              </div>
              {loading ? (
                <div className="py-12 text-center text-gray-400"><RefreshCw size={28} className="animate-spin mx-auto mb-2" /> Chargement...</div>
              ) : filtered.length === 0 ? (
                <div className="py-12 text-center text-gray-400">Aucune demande trouvÃ©e.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>{["RÃ©f.", "Client", "WhatsApp", "VÃ©hicule demandÃ©", "Date", "Statut", "Action"].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">{h}</th>
                      ))}</tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filtered.map(r => {
                        // Image par type de vÃ©hicule
                        const VEHICULE_IMAGES: Record<string, string> = {
                          "citadine": "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=60&q=80",
                          "voiture": "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=60&q=80",
                          "suv": "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=60&q=80",
                          "4x4": "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=60&q=80",
                          "moto": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=60&q=80",
                          "scooter": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=60&q=80",
                          "chauffeur": "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=60&q=80",
                          "minibus": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=60&q=80",
                          "bus": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=60&q=80",
                          "luxe": "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=60&q=80",
                          "premium": "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=60&q=80",
                        };
                        const typeKey = (r.eventType ?? "").toLowerCase();
                        const imgSrc = Object.keys(VEHICULE_IMAGES).find(k => typeKey.includes(k))
                          ? VEHICULE_IMAGES[Object.keys(VEHICULE_IMAGES).find(k => typeKey.includes(k))!]
                          : "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=60&q=80";
                        // ID du vÃ©hicule pour le lien
                        const VEHICULE_IDS: Record<string, string> = {
                          "citadine": "citadine", "voiture": "citadine",
                          "suv": "suv", "4x4": "suv",
                          "moto": "moto", "scooter": "moto",
                          "chauffeur": "avec-chauffeur",
                          "minibus": "minibus", "bus": "minibus",
                          "luxe": "luxe", "premium": "luxe",
                        };
                        const vehiculeId = Object.keys(VEHICULE_IDS).find(k => typeKey.includes(k))
                          ? VEHICULE_IDS[Object.keys(VEHICULE_IDS).find(k => typeKey.includes(k))!]
                          : "";
                        return (
                        <tr key={r.id} className="hover:bg-gray-50">
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-2">
                              <img src={imgSrc} alt="vÃ©hicule" className="w-9 h-9 rounded-lg object-cover shrink-0 border border-gray-100" />
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
                            <a href={vehiculeId ? `/services/vehicules/${vehiculeId}` : "/services/vehicules"}
                              target="_blank" rel="noopener noreferrer"
                              className="hover:underline text-[#0c4a6e] font-medium">
                              {r.eventType} â†—
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

      {/* Modal Ajouter/Modifier */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
              <h3 className="font-bold text-[#0c4a6e] text-lg">{editId ? "Modifier" : "Ajouter"} un vÃ©hicule</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto">
              {[
                { key: "nom", label: "Nom du vÃ©hicule *", placeholder: "Voiture Citadine" },
                { key: "categorie", label: "CatÃ©gorie *", placeholder: "Ã‰conomique / Tout-terrain / Premium..." },
                { key: "prix", label: "Prix *", placeholder: "15 000 FCFA/jour" },
                { key: "caution", label: "Caution", placeholder: "50 000 FCFA" },
                { key: "places", label: "Nombre de places", placeholder: "5", type: "number" },
              ].map(({ key, label, placeholder, type }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input type={type ?? "text"} placeholder={placeholder} value={(form as any)[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea rows={2} placeholder="Description du vÃ©hicule..." value={form.description}
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
              <button onClick={saveVehicule} disabled={!form.nom || saving}
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


