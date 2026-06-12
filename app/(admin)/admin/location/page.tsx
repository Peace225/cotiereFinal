"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, X, Package } from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import ImageUploader from "@/components/admin/ImageUploader";
import ExportButton from "@/components/admin/ExportButton";

type Equipment = { id: string; name: string; category: string; totalStock: number; pricePerDay: number; depositValue: number; images: string[]; isActive: boolean };
type Rental = { id: string; reference: string; clientFirstName: string; clientLastName: string; clientPhone: string; startDate: string; endDate: string; daysCount: number; totalAmount: number; depositAmount: number; status: string; items: { equipment: { name: string }; quantity: number }[] };

const STATUS_COLORS: Record<string, string> = { PENDING: "bg-yellow-100 text-yellow-700", CONFIRMED: "bg-green-100 text-green-700", CANCELLED: "bg-gray-100 text-gray-600", COMPLETED: "bg-blue-100 text-blue-700" };
const STATUS_LABELS: Record<string, string> = { PENDING: "En attente", CONFIRMED: "Confirmé", CANCELLED: "Annulé", COMPLETED: "Terminé" };

const emptyForm = { name: "", category: "Tentes", totalStock: "10", pricePerDay: "", depositValue: "", images: "" };

export default function AdminLocationPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"equipment" | "rentals">("equipment");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/equipment").then(r => r.json()),
      fetch("/api/equipment/rentals?limit=500").then(r => r.json()),
      fetch("/api/events/requests?limit=500").then(r => r.json()),
    ]).then(([eData, rData, evData]) => {
      setEquipment(eData.data ?? []);
      const realRentals = rData.data ?? [];
      const genericRentals = (evData.data?.requests ?? evData.data ?? [])
        .filter((b: any) => {
          const t = (b.eventType ?? "").toLowerCase();
          return t.includes("guichet") || t.includes("location mat") || t.startsWith("location :") || t.startsWith("location:");
        })
        .map((b: any) => ({
          id: b.id,
          reference: b.reference ?? b.id,
          clientFirstName: b.clientFirstName,
          clientLastName: b.clientLastName,
          clientPhone: b.clientPhone,
          startDate: b.eventDate ?? b.createdAt,
          endDate: b.eventDate ?? b.createdAt,
          daysCount: 1,
          totalAmount: b.totalAmount ?? 0,
          depositAmount: 0,
          status: b.status,
          items: [{ equipment: { name: (b.eventType ?? "Location matériel").replace(/^Location\s*:\s*/i, "").split("|")[0].trim().slice(0, 50) }, quantity: 1 }],
          _source: "event",
        }));
      const eventRequests = (evData.data?.requests ?? evData.data ?? [])
        .filter((b: any) => {
          const t = (b.eventType ?? "").toLowerCase();
          return !t.includes("guichet") && !t.includes("location") && !t.includes("chambre") && !t.includes("suite") && !t.includes("hébergement") && !t.startsWith("rés");
        })
        .map((b: any) => ({
          id: b.id,
          reference: b.reference ?? b.id,
          clientFirstName: b.clientFirstName,
          clientLastName: b.clientLastName,
          clientPhone: b.clientPhone,
          startDate: b.eventDate ?? b.createdAt,
          endDate: b.eventDate ?? b.createdAt,
          daysCount: 1,
          totalAmount: b.totalAmount ?? b.estimatedPriceMin ?? 0,
          depositAmount: 0,
          status: b.status,
          items: [{ equipment: { name: b.eventType ?? "Événement" }, quantity: 1 }],
          _source: "event",
        }));
      setRentals([...realRentals, ...genericRentals, ...eventRequests].sort((a: any, b: any) =>
        new Date(b.startDate ?? 0).getTime() - new Date(a.startDate ?? 0).getTime()
      ));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  async function saveEquipment() {
    setSaving(true);
    const body = {
      name: form.name, category: form.category,
      totalStock: parseInt(form.totalStock),
      pricePerDay: parseInt(form.pricePerDay),
      depositValue: parseInt(form.depositValue),
      images: form.images ? form.images.split(",").map(s => s.trim()).filter(Boolean) : [],
    };
    try {
      const res = await fetch(editId ? `/api/equipment/${editId}` : "/api/equipment", {
        method: editId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        if (editId) setEquipment(prev => prev.map(e => e.id === editId ? data.data : e));
        else setEquipment(prev => [...prev, data.data]);
        setShowModal(false); setForm(emptyForm); setEditId(null);
      } else {
        alert(`Erreur ${res.status} : ${data.error ?? "Impossible de sauvegarder l'équipement."}\nVérifiez que vous êtes connecté en tant qu'admin.`);
      }
    } catch {
      alert("Erreur réseau. Vérifiez votre connexion et réessayez.");
    }
    setSaving(false);
  }

  async function updateRentalStatus(id: string, status: string) {
    const rental = rentals.find(r => r.id === id) as any;
    const url = rental?._source === "event"
      ? `/api/events/requests/${id}`
      : `/api/equipment/rentals/${id}`;
    await fetch(url, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    setRentals(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* HEADER - Responsive */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div className="flex items-start sm:items-center gap-3 min-w-0">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center shrink-0 mt-1 sm:mt-0">
              <Package size={20} className="text-orange-600" />
            </div>
            <h1 className="text-base sm:text-xl lg:text-2xl font-black text-[#0c4a6e] leading-tight break-words flex-1">
              GUICHET UNIQUE DE L'INDUSTRIE EVENEMENTIELLE ET AUDIOPROTHÉSISTE
            </h1>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible sm:flex-wrap [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <button onClick={() => { setShowModal(true); setEditId(null); setForm(emptyForm); }}
              className="flex items-center gap-2 bg-[#c9a84c] hover:bg-[#b8973b] text-white font-bold px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm transition-colors shadow-md whitespace-nowrap shrink-0">
              <Plus size={15} /> Ajouter équipement
            </button>
            <button onClick={() => setTab("equipment")} className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${tab === "equipment" ? "bg-[#0c4a6e] text-white" : "bg-white text-gray-500 border-gray-200"}`}>
              Équipements ({equipment.length})
            </button>
            <button onClick={() => setTab("rentals")} className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${tab === "rentals" ? "bg-[#0c4a6e] text-white" : "bg-white text-gray-500 border-gray-200"}`}>
              Locations ({rentals.length})
            </button>
            <div className="shrink-0">
              <ExportButton
                data={rentals.map(r => ({
                  reference: r.reference ?? r.id,
                  client: r.clientFirstName + " " + r.clientLastName,
                  telephone: r.clientPhone,
                  materiel: r.items?.map(i => `${i.equipment.name} ×${i.quantity}`).join(", ") ?? "—",
                  debut: new Date(r.startDate).toLocaleDateString("fr-FR"),
                  fin: new Date(r.endDate).toLocaleDateString("fr-FR"),
                  jours: r.daysCount,
                  total: r.totalAmount.toLocaleString() + " FCFA",
                  caution: r.depositAmount.toLocaleString() + " FCFA",
                  statut: STATUS_LABELS[r.status] ?? r.status,
                }))}
                columns={[
                  { key: "reference", label: "Référence" },
                  { key: "client", label: "Client" },
                  { key: "telephone", label: "Téléphone" },
                  { key: "materiel", label: "Matériel" },
                  { key: "debut", label: "Début" },
                  { key: "fin", label: "Fin" },
                  { key: "jours", label: "Jours" },
                  { key: "total", label: "Total" },
                  { key: "caution", label: "Caution" },
                  { key: "statut", label: "Statut" },
                ]}
                filename={"location-emplacements-" + new Date().toISOString().split("T")[0]}
                label="Emplacements"
              />
            </div>
          </div>
        </div>

        {tab === "equipment" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {equipment.length === 0 ? (
              <div className="col-span-full bg-white rounded-2xl p-12 text-center text-gray-400">Aucun équipement. Cliquez sur "Ajouter".</div>
            ) : equipment.map(e => (
              <div key={e.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border-gray-100 flex flex-col">
                <div className="relative h-40 sm:h-36 bg-gray-100 shrink-0">
                  {e.images[0] ? <img src={e.images[0]} alt={e.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-300"><Package size={40} /></div>}
                  <span className="absolute top-3 left-3 bg-white/90 text-[#0c4a6e] text-xs font-bold px-2 py-1 rounded-full shadow-sm">{e.category}</span>
                </div>
                <div className="p-4 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="font-bold text-[#0c4a6e] mb-1">{e.name}</h3>
                    <p className="text-xs text-gray-500 mb-1">Stock: {e.totalStock} | {e.pricePerDay.toLocaleString()} FCFA/j</p>
                    <p className="text-xs text-gray-400 mb-4">Caution: {e.depositValue.toLocaleString()} FCFA</p>
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <button onClick={() => { setForm({ name: e.name, category: e.category, totalStock: String(e.totalStock), pricePerDay: String(e.pricePerDay), depositValue: String(e.depositValue), images: e.images.join(", ") }); setEditId(e.id); setShowModal(true); }}
                      className="flex-1 flex items-center justify-center gap-1 text-xs font-bold py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                      <Pencil size={13} /> Modifier
                    </button>
                    <button onClick={async () => { if (confirm("Désactiver?")) { await fetch(`/api/equipment/${e.id}`, { method: "DELETE" }); setEquipment(prev => prev.filter(x => x.id !== e.id)); } }}
                      className="flex-1 flex items-center justify-center gap-1 text-xs font-bold py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
                      <Trash2 size={13} /> Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "rentals" && (
          <div className="bg-white rounded-2xl shadow-sm border-gray-100 overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 flex-1">
                <div className="w-1 h-5 bg-orange-500 rounded-full" />
                <h2 className="font-bold text-[#0c4a6e] text-sm sm:text-base">Demandes — Location & Événements</h2>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                <span className="text-xs text-gray-400">{rentals.length} résultat(s)</span>
                <ExportButton
                  data={rentals.map(r => ({
                    reference: r.reference ?? r.id,
                    client: r.clientFirstName + " " + r.clientLastName,
                    telephone: r.clientPhone,
                    materiel: r.items?.map(i => `${i.equipment.name} ×${i.quantity}`).join(", ") ?? "—",
                    debut: new Date(r.startDate).toLocaleDateString("fr-FR"),
                    fin: new Date(r.endDate).toLocaleDateString("fr-FR"),
                    jours: r.daysCount,
                    total: r.totalAmount.toLocaleString() + " FCFA",
                    caution: r.depositAmount.toLocaleString() + " FCFA",
                    statut: r.status,
                  }))}
                  columns={[
                    { key: "reference", label: "Référence" },
                    { key: "client", label: "Client" },
                    { key: "telephone", label: "Téléphone" },
                    { key: "materiel", label: "Matériel" },
                    { key: "debut", label: "Début" },
                    { key: "fin", label: "Fin" },
                    { key: "jours", label: "Jours" },
                    { key: "total", label: "Total" },
                    { key: "caution", label: "Caution" },
                    { key: "statut", label: "Statut" },
                  ]}
                  filename={"location-rentals-" + new Date().toISOString().split("T")[0]}
                  label="Locations"
                />
              </div>
            </div>

            {loading ? <div className="py-12 text-center text-gray-400">Chargement...</div> :
              rentals.length === 0 ? <div className="py-12 text-center text-gray-400">Aucune location.</div> : (
                <>
                  {/* TABLET/DESKTOP */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>{["Réf", "Client", "Matériel", "Période", "Total", "Caution", "Statut", "Action"].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">{h}</th>
                        ))}</tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {rentals.map(r => {
                          const SERVICE_IMAGES: Record<string, string> = {
                            "tente": "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=60&q=80",
                            "table": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=60&q=80",
                            "chaise": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=60&q=80",
                            "sono": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=60&q=80",
                            "eclairage": "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=60&q=80",
                            "groupe": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=60&q=80",
                            "mariage": "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=60&q=80",
                            "anniversaire": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=60&q=80",
                            "conference": "https://images.unsplash.com/photo-1497366216548-37526070297c?w=60&q=80",
                            "bapteme": "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=60&q=80",
                          };
                          const itemName = (r.items?.[0]?.equipment?.name ?? "").toLowerCase();
                          const imgSrc = Object.keys(SERVICE_IMAGES).find(k => itemName.includes(k))
                            ? SERVICE_IMAGES[Object.keys(SERVICE_IMAGES).find(k => itemName.includes(k))!]
                            : "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=60&q=80";
                          return (
                            <tr key={r.id} className="hover:bg-gray-50">
                              <td className="px-3 py-3">
                                <div className="flex items-center gap-2">
                                  <img src={imgSrc} alt="service" className="w-9 h-9 rounded-lg object-cover shrink-0 border-gray-100" />
                                  <span className="font-mono text-xs text-gray-400">{r.reference}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 font-semibold text-[#0c4a6e] text-sm">{r.clientFirstName} {r.clientLastName}</td>
                              <td className="px-4 py-3 text-xs text-gray-600 max-w-[150px]">
                                <a href="/services/location" target="_blank" rel="noopener noreferrer"
                                  className="hover:underline text-[#0c4a6e] font-medium truncate block max-w-[140px]">
                                  {(r.items?.map(i => `${i.equipment.name} ×${i.quantity}`).join(", ") ?? "—")
                                    .replace(/Service\s*:/i, "").split("|")[0].trim().slice(0, 40) || "Location matériel"} ↗
                                </a>
                              </td>
                              <td className="px-4 py-3 text-xs text-gray-600">{new Date(r.startDate).toLocaleDateString("fr-FR")} → {new Date(r.endDate).toLocaleDateString("fr-FR")} ({r.daysCount}j)</td>
                              <td className="px-4 py-3 text-xs font-bold text-[#0c4a6e]">{r.totalAmount.toLocaleString()} FCFA</td>
                              <td className="px-4 py-3 text-xs text-gray-500">{r.depositAmount.toLocaleString()} FCFA</td>
                              <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full font-semibold ${STATUS_COLORS[r.status] ?? "bg-gray-100 text-gray-600"}`}>{STATUS_LABELS[r.status] ?? r.status}</span></td>
                              <td className="px-4 py-3">
                                <select value="" onChange={e => { if (e.target.value) updateRentalStatus(r.id, e.target.value); }}
                                  className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#0c4a6e]">
                                  <option value="">Statut</option>
                                  <option value="CONFIRMED">Confirmer</option>
                                  <option value="COMPLETED">Terminer</option>
                                  <option value="CANCELLED">Annuler</option>
                                </select>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* MOBILE CARDS */}
                  <div className="md:hidden divide-y divide-gray-100">
                    {rentals.map(r => (
                      <div key={r.id} className="p-4 flex flex-col gap-2">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-[#0c4a6e] text-sm truncate">{r.clientFirstName} {r.clientLastName}</p>
                            <p className="text-[11px] text-gray-500 font-mono mt-0.5">{r.reference}</p>
                          </div>
                          <span className={`text-[10px] sm:text-xs px-2 py-1 rounded-full font-semibold shrink-0 ${STATUS_COLORS[r.status] ?? "bg-gray-100 text-gray-600"}`}>
                            {STATUS_LABELS[r.status] ?? r.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {r.items?.map(i => `${i.equipment.name} ×${i.quantity}`).join(", ")}
                        </p>
                        <div className="flex items-center justify-between text-[11px] sm:text-xs text-gray-500 bg-gray-50 p-2 rounded-lg mt-1">
                          <span>{new Date(r.startDate).toLocaleDateString("fr-FR")} → {new Date(r.endDate).toLocaleDateString("fr-FR")} <span className="font-semibold">({r.daysCount}j)</span></span>
                          <span className="font-bold text-[#0c4a6e] text-xs">{r.totalAmount.toLocaleString()} FCFA</span>
                        </div>
                        <select value="" onChange={e => { if (e.target.value) updateRentalStatus(r.id, e.target.value); }}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs bg-white mt-2 focus:outline-none focus:ring-1 focus:ring-[#0c4a6e]">
                          <option value="">Changer le statut...</option>
                          <option value="CONFIRMED">Confirmer</option>
                          <option value="COMPLETED">Terminer</option>
                          <option value="CANCELLED">Annuler</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </>
              )}
          </div>
        )}
      </div>

      {/* MODAL - Responsive fixes */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col overflow-hidden mx-auto">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 shrink-0 bg-gray-50/50">
              <h3 className="font-bold text-[#0c4a6e] text-lg">{editId ? "Modifier" : "Ajouter"} un équipement</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-700 bg-white rounded-full p-1 shadow-sm transition-colors"><X size={20} /></button>
            </div>
            <div className="p-4 sm:p-6 space-y-4 overflow-y-auto">
              {[
                { key: "name", label: "Nom *", placeholder: "Tente 4 places" },
                { key: "totalStock", label: "Stock total *", placeholder: "20", type: "number" },
                { key: "pricePerDay", label: "Prix / jour (FCFA) *", placeholder: "8000", type: "number" },
                { key: "depositValue", label: "Valeur caution (FCFA) *", placeholder: "25000", type: "number" },
              ].map(({ key, label, placeholder, type }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input type={type ?? "text"} placeholder={placeholder} value={(form as any)[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8] transition-shadow" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8] bg-white transition-shadow">
                  {["Tentes", "Tables", "Chaises", "Sono/Audio", "Eclairage", "Electricite", "Divers"].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
                <ImageUploader value={form.images} onChange={val => setForm(f => ({ ...f, images: val }))} />
              </div>
            </div>
            <div className="p-4 sm:p-6 border-t border-gray-100 flex gap-3 shrink-0 bg-gray-50/50">
              <button onClick={() => setShowModal(false)} className="flex-1 bg-white border border-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors shadow-sm text-sm sm:text-base">Annuler</button>
              <button onClick={saveEquipment} disabled={saving} className="flex-1 bg-[#c9a84c] hover:bg-[#b8973b] text-white font-bold py-2.5 rounded-xl disabled:opacity-60 transition-colors shadow-md text-sm sm:text-base">
                {saving ? "Enregistrement..." : editId ? "Modifier" : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}