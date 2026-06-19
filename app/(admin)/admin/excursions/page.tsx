"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, CheckCircle, XCircle, Pencil, Trash2, X, Compass, Clock } from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import ImageUploader from "@/components/admin/ImageUploader";
import VoucherButton from "@/components/admin/VoucherButton";
import ExportButton from "@/components/admin/ExportButton";

type Excursion = {
  id: string; title: string; slug: string; description: string;
  duration: string; priceAdult: number; priceChild: number;
  maxParticipants: number; isActive: boolean; images: string[];
};

type Booking = {
  id: string; reference: string; clientFirstName: string; clientLastName: string;
  clientPhone: string; bookingDate: string; adultsCount: number; childrenCount: number;
  totalAmount: number; status: string; excursion?: { title: string };
  timeSlot?: string; guideLanguage?: string; depositAmount?: number; createdAt?: string;
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700", CONFIRMED: "bg-green-100 text-green-700",
  REFUSED: "bg-red-100 text-red-700", CANCELLED: "bg-gray-100 text-gray-600", COMPLETED: "bg-blue-100 text-blue-700",
};
const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente", CONFIRMED: "Confirmé", REFUSED: "Refusé", CANCELLED: "Annulé", COMPLETED: "Terminé",
};

const emptyForm = { title: "", slug: "", description: "", duration: "", priceAdult: "", priceChild: "", maxParticipants: "20", images: "" };

export default function AdminExcursionsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [excursions, setExcursions] = useState<Excursion[]>([
    { id: "1", title: "Balade en bateau sur le fleuve", slug: "balade-bateau-fleuve", description: "Découvrez le fleuve ivoirien en bateau avec un guide expérimenté.", duration: "3h", priceAdult: 15000, priceChild: 8000, maxParticipants: 20, isActive: true, images: ["https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80"] },
    { id: "2", title: "Découverte du littoral ivoirien", slug: "decouverte-littoral", description: "Explorez les plus belles plages du littoral ivoirien.", duration: "Journée", priceAdult: 25000, priceChild: 12000, maxParticipants: 15, isActive: true, images: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80"] },
    { id: "3", title: "Visite des villages de pêcheurs", slug: "villages-pecheurs", description: "Immersion dans la culture locale des villages de pêcheurs.", duration: "4h", priceAdult: 18000, priceChild: 9000, maxParticipants: 12, isActive: true, images: ["https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80"] },
  ]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [tab, setTab] = useState<"articles" | "reservations">("reservations");

  useEffect(() => {
    Promise.all([
      fetch("/api/excursions/bookings?limit=500").then(r => r.json()),
      fetch("/api/excursions").then(r => r.json()),
      fetch("/api/events/requests?limit=500").then(r => r.json()),
    ]).then(([bData, eData, evData]) => {
      const excursionBookings = (bData.data?.bookings ?? bData.data ?? []).map((b: any) => ({ ...b, _source: "excursion" }));
      const eventRequests = (evData.data?.requests ?? evData.data ?? [])
        .filter((b: any) => b.reference?.startsWith("RES-") && !/chambre|suite|hébergement|hebergement|market|studio|mariage|anniversaire|conférence|bapteme/i.test(b.eventType ?? ""))
        .map((b: any) => ({
          id: b.id,
          reference: b.reference,
          clientFirstName: b.clientFirstName,
          clientLastName: b.clientLastName,
          clientPhone: b.clientPhone,
          bookingDate: b.eventDate,
          adultsCount: 1,
          childrenCount: 0,
          totalAmount: b.totalAmount ?? 0,
          status: b.status,
          excursion: { title: b.eventType ?? "Voyage" },
          createdAt: b.createdAt,
          _source: "event",
        }));
      setBookings([...excursionBookings, ...eventRequests].sort((a: any, b: any) =>
        new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
      ));
      const apiExcursions = eData.data ?? [];
      if (apiExcursions.length > 0) setExcursions(apiExcursions);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  async function updateStatus(id: string, status: string) {
    const booking = bookings.find(b => b.id === id) as any;
    const url = booking?._source === "event"
      ? `/api/events/requests/${id}`
      : `/api/excursions/bookings/${id}`;
    await fetch(url, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  }

  async function saveExcursion() {
    setSaving(true);
    const body = {
      title: form.title, slug: form.slug || form.title.toLowerCase().replace(/\s+/g, "-"),
      description: form.description, duration: form.duration,
      priceAdult: parseInt(form.priceAdult), priceChild: parseInt(form.priceChild),
      maxParticipants: parseInt(form.maxParticipants),
      images: form.images ? form.images.split(",").map(s => s.trim()) : [],
    };
    try {
      const res = await fetch(editId ? `/api/excursions/${editId}` : "/api/excursions", {
        method: editId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        if (editId) setExcursions(prev => prev.map(e => e.id === editId ? data.data : e));
        else setExcursions(prev => [...prev, data.data]);
        setShowModal(false); setForm(emptyForm); setEditId(null);
      } else {
        alert(`Erreur ${res.status} : ${data.error ?? "Impossible de sauvegarder l'excursion."}\nVérifiez que vous êtes connecté en tant qu'admin.`);
      }
    } catch {
      alert("Erreur réseau. Vérifiez votre connexion et réessayez.");
    }
    setSaving(false);
  }

  async function deleteExcursion(id: string) {
    if (!confirm("Supprimer cette excursion ?")) return;
    await fetch(`/api/excursions/${id}`, { method: "DELETE" });
    setExcursions(prev => prev.filter(e => e.id !== id));
  }

  async function toggleActive(e: Excursion) {
    await fetch(`/api/excursions/${e.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !e.isActive }),
    });
    setExcursions(prev => prev.map(ex => ex.id === e.id ? { ...ex, isActive: !ex.isActive } : ex));
  }

  function openEdit(e: Excursion) {
    setForm({ title: e.title, slug: e.slug, description: e.description, duration: e.duration, priceAdult: String(e.priceAdult), priceChild: String(e.priceChild), maxParticipants: String(e.maxParticipants), images: e.images.join(", ") });
    setEditId(e.id); setShowModal(true);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* HEADER - Responsive */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h1 className="text-xl sm:text-2xl font-black text-[#0c4a6e]">Tourisme & Voyage</h1>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible sm:flex-wrap [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <button onClick={() => { setShowModal(true); setEditId(null); setForm(emptyForm); }}
              className="flex items-center gap-2 bg-[#c9a84c] hover:bg-[#b8973b] text-white font-bold px-3 sm:px-4 py-2 rounded-xl transition-colors shadow-md text-xs sm:text-sm whitespace-nowrap shrink-0">
              <Plus size={15} /> Ajouter une excursion
            </button>
            <button onClick={() => setTab("reservations")}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${tab === "reservations" ? "bg-[#0c4a6e] text-white" : "bg-white text-gray-500 border border-gray-200"}`}>
              Réservations ({bookings.length})
            </button>
            <button onClick={() => setTab("articles")}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${tab === "articles" ? "bg-[#0c4a6e] text-white" : "bg-white text-gray-500 border border-gray-200"}`}>
              Voyages ({excursions.length})
            </button>
          </div>
        </div>

        {tab === "articles" && (
          <>
            {excursions.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 sm:p-12 text-center text-gray-400 shadow-sm border border-gray-100">
                Aucune excursion. Cliquez sur "Ajouter" pour commencer.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {excursions.map((e) => (
                  <div key={e.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col">
                    <div className="relative h-40 sm:h-48 bg-gray-100 shrink-0">
                      {e.images[0] ? (
                        <img src={e.images[0]} alt={e.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300"><Compass size={40} /></div>
                      )}
                      <span className={`absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full font-bold shadow-sm ${e.isActive ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                        {e.isActive ? "DISPONIBLE" : "INACTIF"}
                      </span>
                    </div>
                    <div className="p-4 flex flex-col flex-1 justify-between">
                      <div>
                        <h3 className="font-bold text-[#0c4a6e] mb-1 leading-tight">{e.title}</h3>
                        <p className="text-xs text-gray-500 mb-1">Durée : {e.duration}</p>
                        <p className="text-xs text-[#c9a84c] font-semibold mb-4">Adulte : {e.priceAdult.toLocaleString()} FCFA · Enfant : {e.priceChild.toLocaleString()} FCFA</p>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-auto">
                        <button onClick={() => toggleActive(e)}
                          className={`flex-1 flex items-center justify-center gap-1 text-[11px] sm:text-xs font-bold py-2 rounded-lg transition-colors ${e.isActive ? "bg-orange-50 text-orange-600 hover:bg-orange-100" : "bg-green-50 text-green-600 hover:bg-green-100"}`}>
                          <CheckCircle size={13} /> {e.isActive ? "Désactiver" : "Activer"}
                        </button>
                        <button onClick={() => openEdit(e)}
                          className="flex-1 flex items-center justify-center gap-1 text-[11px] sm:text-xs font-bold py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                          <Pencil size={13} /> Modifier
                        </button>
                        <button onClick={() => deleteExcursion(e.id)}
                          className="flex-1 flex items-center justify-center gap-1 text-[11px] sm:text-xs font-bold py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
                          <Trash2 size={13} /> Suppr
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === "reservations" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 flex-1">
                <div className="w-1 h-5 bg-[#c9a84c] rounded-full" />
                <h2 className="font-bold text-[#0c4a6e] text-sm sm:text-base">Réservations de voyages</h2>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                <span className="text-xs text-gray-400">{bookings.length} résultat(s)</span>
                <ExportButton
                  data={bookings.map(b => ({
                    reference: b.reference ?? b.id,
                    client: b.clientFirstName + " " + b.clientLastName,
                    telephone: b.clientPhone,
                    excursion: b.excursion?.title ?? "—",
                    date_commande: b.createdAt ? new Date(b.createdAt).toLocaleString("fr-FR") : "—",
                    adultes: b.adultsCount,
                    enfants: b.childrenCount,
                    total: b.totalAmount + " FCFA",
                    statut: b.status,
                  }))}
                  columns={[
                    { key: "reference", label: "Référence" },
                    { key: "client", label: "Client" },
                    { key: "telephone", label: "Téléphone" },
                    { key: "excursion", label: "Excursion" },
                    { key: "date_commande", label: "Date commande" },
                    { key: "adultes", label: "Adultes" },
                    { key: "enfants", label: "Enfants" },
                    { key: "total", label: "Total" },
                    { key: "statut", label: "Statut" },
                  ]}
                  filename={"excursions-reservations-" + new Date().toISOString().split("T")[0]}
                  label="Réservations"
                />
              </div>
            </div>

            {loading ? <div className="py-12 text-center text-gray-400">Chargement...</div> :
              bookings.length === 0 ? <div className="py-12 text-center text-gray-400">Aucune réservation.</div> : (
                <>
                  {/* TABLET/DESKTOP */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>{["Réf", "Client", "WhatsApp", "Excursion", "Date commande", "Participants", "Total", "Statut", "Action"].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                        ))}</tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {bookings.map((b) => (
                          <tr key={b.id} className="hover:bg-gray-50">
                            <td className="px-3 py-3">
                              <div className="flex items-center gap-2">
                                <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=60&q=80" alt="service" className="w-9 h-9 rounded-lg object-cover shrink-0 border border-gray-100" />
                                <span className="font-mono text-xs text-gray-400">{b.reference?.slice(-6)}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 font-semibold text-[#0c4a6e]">{b.clientFirstName} {b.clientLastName}</td>
                            <td className="px-4 py-3">
                              <a href={`https://wa.me/${b.clientPhone?.replace(/\s/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-green-600 text-xs font-medium hover:underline">{b.clientPhone}</a>
                            </td>
                            <td className="px-4 py-3 text-gray-600 text-xs max-w-[150px] truncate">
                              <a href="/services/tourisme" target="_blank" rel="noopener noreferrer" className="hover:underline text-[#0c4a6e] font-medium text-xs">
                                {b.excursion?.title ?? "—"} ↗
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
                              ) : new Date(b.bookingDate).toLocaleDateString("fr-FR")}
                            </td>
                            <td className="px-4 py-3 text-gray-600 text-xs">{b.adultsCount}A / {b.childrenCount}E</td>
                            <td className="px-4 py-3 text-xs font-semibold text-[#0c4a6e]">{b.totalAmount.toLocaleString()} FCFA</td>
                            <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full font-semibold ${STATUS_COLORS[b.status]}`}>{STATUS_LABELS[b.status]}</span></td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1">
                                {b.status === "PENDING" && (
                                  <>
                                    <button onClick={() => updateStatus(b.id, "CONFIRMED")} className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors" title="Confirmer"><CheckCircle size={14} /></button>
                                    <button onClick={() => updateStatus(b.id, "REFUSED")} className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors" title="Refuser"><XCircle size={14} /></button>
                                  </>
                                )}
                                <VoucherButton data={{
                                  reference: b.reference, clientFirstName: b.clientFirstName, clientLastName: b.clientLastName,
                                  clientPhone: b.clientPhone, excursionTitle: b.excursion?.title ?? "Excursion", bookingDate: b.bookingDate,
                                  timeSlot: b.timeSlot, adultsCount: b.adultsCount, childrenCount: b.childrenCount,
                                  guideLanguage: b.guideLanguage, totalAmount: b.totalAmount, depositAmount: b.depositAmount,
                                }} />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* MOBILE CARDS */}
                  <div className="md:hidden divide-y divide-gray-100">
                    {bookings.map((b) => (
                      <div key={b.id} className="p-4 flex flex-col gap-2">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-[#0c4a6e] text-sm truncate">{b.clientFirstName} {b.clientLastName}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[11px] text-gray-500 font-mono">#{b.reference?.slice(-6)}</span>
                              <a href={`https://wa.me/${b.clientPhone?.replace(/\s/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-green-600 text-[11px] font-medium hover:underline">
                                {b.clientPhone}
                              </a>
                            </div>
                          </div>
                          <span className={`text-[10px] sm:text-xs px-2 py-1 rounded-full font-semibold shrink-0 ${STATUS_COLORS[b.status] ?? "bg-gray-100 text-gray-600"}`}>
                            {STATUS_LABELS[b.status] ?? b.status}
                          </span>
                        </div>
                        
                        <p className="text-xs text-gray-600 font-medium truncate mt-1">
                          {b.excursion?.title ?? "Excursion générique"}
                        </p>
                        
                        <div className="flex items-center justify-between text-[11px] sm:text-xs text-gray-500 bg-gray-50 p-2.5 rounded-lg mt-1">
                          <div className="flex flex-col gap-0.5">
                            <span>Cmd: {b.createdAt ? new Date(b.createdAt).toLocaleDateString("fr-FR") : new Date(b.bookingDate).toLocaleDateString("fr-FR")}</span>
                            <span className="font-medium text-gray-700">{b.adultsCount} Adultes, {b.childrenCount} Enfants</span>
                          </div>
                          <span className="font-bold text-[#0c4a6e] text-sm">{b.totalAmount.toLocaleString()} FCFA</span>
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                          {b.status === "PENDING" && (
                            <>
                              <button onClick={() => updateStatus(b.id, "CONFIRMED")} className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-green-50 text-green-600 rounded-lg text-[11px] font-semibold hover:bg-green-100 transition-colors">
                                <CheckCircle size={13} /> Oui
                              </button>
                              <button onClick={() => updateStatus(b.id, "REFUSED")} className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-red-50 text-red-600 rounded-lg text-[11px] font-semibold hover:bg-red-100 transition-colors">
                                <XCircle size={13} /> Non
                              </button>
                            </>
                          )}
                          <div className={b.status === "PENDING" ? "shrink-0" : "w-full"}>
                            <VoucherButton data={{
                              reference: b.reference, clientFirstName: b.clientFirstName, clientLastName: b.clientLastName,
                              clientPhone: b.clientPhone, excursionTitle: b.excursion?.title ?? "Excursion", bookingDate: b.bookingDate,
                              timeSlot: b.timeSlot, adultsCount: b.adultsCount, childrenCount: b.childrenCount,
                              guideLanguage: b.guideLanguage, totalAmount: b.totalAmount, depositAmount: b.depositAmount,
                            }} />
                          </div>
                        </div>
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
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col mx-auto overflow-hidden">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 shrink-0 bg-gray-50/50">
              <h3 className="font-bold text-[#0c4a6e] text-lg">{editId ? "Modifier" : "Ajouter"} une excursion</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-700 bg-white rounded-full p-1 shadow-sm transition-colors"><X size={20} /></button>
            </div>
            <div className="p-4 sm:p-6 space-y-4 overflow-y-auto">
              {[
                { key: "title", label: "Titre *", placeholder: "Balade en bateau" },
                { key: "duration", label: "Durée *", placeholder: "3h" },
                { key: "priceAdult", label: "Prix adulte (FCFA) *", placeholder: "15000", type: "number" },
                { key: "priceChild", label: "Prix enfant (FCFA) *", placeholder: "8000", type: "number" },
                { key: "maxParticipants", label: "Max participants", placeholder: "20", type: "number" },
              ].map(({ key, label, placeholder, type }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input type={type ?? "text"} placeholder={placeholder}
                    value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8] transition-shadow" />
                </div>
              ))}
              {/* Upload images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
                <ImageUploader value={form.images} onChange={val => setForm(f => ({ ...f, images: val }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea rows={3} placeholder="Description de l'excursion..."
                  value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8] resize-none transition-shadow" />
              </div>
            </div>
            <div className="p-4 sm:p-6 border-t border-gray-100 flex gap-3 shrink-0 bg-gray-50/50">
              <button onClick={() => setShowModal(false)} className="flex-1 bg-white border border-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors shadow-sm text-sm sm:text-base">Annuler</button>
              <button onClick={saveExcursion} disabled={saving}
                className="flex-1 bg-[#c9a84c] hover:bg-[#b8973b] text-white font-bold py-2.5 rounded-xl transition-colors shadow-md disabled:opacity-60 text-sm sm:text-base">
                {saving ? "Enregistrement..." : editId ? "Modifier" : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

