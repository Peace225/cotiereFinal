"use client";
import { useEffect, useState } from "react";
import { CheckCircle, Trash2, Music, Clock, Pencil, Plus, X } from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import ExportButton from "@/components/admin/ExportButton";
import ImageUploader from "@/components/admin/ImageUploader";

type Booking = {
  id: string; reference: string; clientFirstName: string; clientLastName: string;
  clientPhone: string; artistName?: string; serviceType: string; sessionDate: string;
  sessionDuration: string; totalAmount?: number; status: string; adminNotes?: string; createdAt?: string;
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700", CONFIRMED: "bg-green-100 text-green-700",
  REFUSED: "bg-red-100 text-red-700", CANCELLED: "bg-gray-100 text-gray-600", COMPLETED: "bg-blue-100 text-blue-700",
};
const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente", CONFIRMED: "Confirmé", REFUSED: "Refusé", CANCELLED: "Annulé", COMPLETED: "Terminé",
};

const DEFAULT_CATALOGUE_SERVICES: typeof EMPTY_SERVICES = [];
const EMPTY_SERVICES: { id: string; nom: string; description: string; prix: string; image: string; categorie: string }[] = [];
const emptyServiceForm = { nom: "", categorie: "", prix: "", description: "", image: "" };

export default function AdminMusiquePage() {
  const [catalogueServices, setCatalogueServices] = useState(DEFAULT_CATALOGUE_SERVICES);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [tab, setTab] = useState<"catalogue" | "reservations">("reservations");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyServiceForm);
  const [savingForm, setSavingForm] = useState(false);

  useEffect(() => {
    fetch("/api/music/bookings?limit=500")
      .then(r => r.json())
      .then(d => { setBookings(d.data?.bookings ?? []); setLoading(false); })
      .catch(() => setLoading(false));
    fetch("/api/musique/services")
      .then(r => r.json())
      .then(d => { if (d.data) setCatalogueServices(d.data); })
      .catch(() => {});
  }, []);

  async function changeStatus(id: string, status: string, booking: Booking) {
    await fetch(`/api/music/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));

    if (status === "CONFIRMED" || status === "REFUSED") {
      let phone = booking.clientPhone.replace(/[\s\-().+]/g, "");
      if (phone.startsWith("00")) phone = phone.slice(2);
      if (phone.startsWith("0") && phone.length <= 10) phone = "225" + phone;
      if (!phone || phone.length < 8) return;

      const clientName = `${booking.clientFirstName} ${booking.clientLastName}`.toUpperCase();
      const ref = booking.reference.slice(-6).toUpperCase();
      const date = new Date(booking.sessionDate).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });

      const msg = status === "CONFIRMED"
        ? `CONFIRMATION DE RESERVATION ${ref}\n\nBonjour *${clientName}*,\n\nVotre session *${booking.serviceType}* du *${date}* est confirmee !\n\nDuree : ${booking.sessionDuration}\n${booking.totalAmount ? `Montant : ${booking.totalAmount.toLocaleString()} FCFA\n` : ""}Notre equipe vous contactera pour les details.\n\n-- *COTIERE MEDIA GROUP*\n_1er site officiel des villes et villages du littoral ivoirien_\nTel: 07 47 72 29 31`
        : `RESERVATION ${ref} - NON RETENUE\n\nBonjour *${clientName}*,\n\nVotre demande pour *${booking.serviceType}* n'a pas pu etre acceptee.\n\nContactez-nous pour plus d'informations.\n-- *COTIERE MEDIA GROUP*\n_1er site officiel des villes et villages du littoral ivoirien_\nTel: 07 47 72 29 31`;

      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
    }
  }

  async function deleteBooking(id: string) {
    if (!confirm("Supprimer cette réservation ?")) return;
    await fetch(`/api/music/bookings/${id}`, { method: "DELETE" });
    setBookings(prev => prev.filter(b => b.id !== id));
  }

  async function saveService() {
    if (!form.nom) return;
    setSavingForm(true);
    try {
      const res = await fetch("/api/musique/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.data) {
        setCatalogueServices(prev => [...prev, data.data]);
        setShowModal(false);
        setForm(emptyServiceForm);
      } else {
        alert(`Erreur ${res.status} : ${data.error ?? "Impossible de sauvegarder."}\nVérifiez que vous êtes connecté en tant qu'admin.`);
      }
    } catch {
      alert("Erreur réseau. Vérifiez votre connexion et réessayez.");
    }
    setSavingForm(false);
  }

  async function deleteService(id: string) {
    if (!confirm("Supprimer ce service ?")) return;
    await fetch(`/api/musique/services/${id}`, { method: "DELETE" });
    setCatalogueServices(prev => prev.filter(s => s.id !== id));
  }

  const filtered = bookings.filter(b => filter === "ALL" || b.status === filter);
  const pending = bookings.filter(b => b.status === "PENDING").length;
  const confirmed = bookings.filter(b => b.status === "CONFIRMED").length;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Music size={20} className="text-purple-600" />
            </div>
            <h1 className="text-2xl font-black text-[#0c4a6e]">Music & Management</h1>
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
              Réservations ({bookings.length})
            </button>
          </div>
        </div>

        {/* Onglet Catalogue */}
        {tab === "catalogue" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {catalogueServices.map(s => (
              <div key={s.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <div className="relative h-40 bg-gray-100">
                  <img src={s.image} alt={s.nom} className="w-full h-full object-cover" />
                  <span className="absolute top-3 right-3 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {s.categorie}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-[#0c4a6e] mb-1">{s.nom}</h3>
                  <p className="text-xs text-gray-500 mb-1">{s.prix}</p>
                  <p className="text-xs text-gray-400 mb-3 line-clamp-2">{s.description}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => deleteService(s.id)}
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
                { label: "Total", value: bookings.length, color: "text-blue-500", bg: "bg-blue-50" },
                { label: "En attente", value: pending, color: "text-yellow-500", bg: "bg-yellow-50" },
                { label: "Confirmées", value: confirmed, color: "text-green-500", bg: "bg-green-50" },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">{s.label}</p>
                    <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
                  </div>
                  <div className={`w-10 h-10 ${s.bg} rounded-xl`} />
                </div>
              ))}
            </div>

            {/* Filtre */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {["ALL", "PENDING", "CONFIRMED", "COMPLETED", "REFUSED", "CANCELLED"].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === f ? "bg-[#0c4a6e] text-white" : "bg-white text-gray-500 border border-gray-200 hover:border-gray-300"}`}>
                  {f === "ALL" ? "Tous" : STATUS_LABELS[f]}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <div className="w-1 h-5 bg-purple-500 rounded-full" />
                <h2 className="font-bold text-[#0c4a6e]">Réservations</h2>
                <span className="ml-auto text-xs text-gray-400">{filtered.length} résultat(s)</span>
                <ExportButton
                  data={filtered.map(b => ({
                    reference: b.reference ?? b.id,
                    client: b.clientFirstName + " " + b.clientLastName,
                    telephone: b.clientPhone,
                    artiste: b.artistName ?? "—",
                    service: b.serviceType ?? "—",
                    date_commande: b.createdAt ? new Date(b.createdAt).toLocaleString("fr-FR") : "—",
                    duree: b.sessionDuration,
                    montant: b.totalAmount ? `${b.totalAmount.toLocaleString()} FCFA` : "—",
                    statut: b.status,
                  }))}
                  columns={[
                    { key: "reference", label: "Référence" },
                    { key: "client", label: "Client" },
                    { key: "telephone", label: "Téléphone" },
                    { key: "artiste", label: "Artiste" },
                    { key: "service", label: "Service" },
                    { key: "date_commande", label: "Date commande" },
                    { key: "duree", label: "Durée" },
                    { key: "montant", label: "Montant" },
                    { key: "statut", label: "Statut" },
                  ]}
                  filename={"musique-reservations-" + new Date().toISOString().split("T")[0]}
                  label="Réservations"
                />
              </div>

              {loading ? (
                <div className="py-12 text-center text-gray-400">Chargement...</div>
              ) : filtered.length === 0 ? (
                <div className="py-12 text-center text-gray-400">Aucune réservation.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>{["Réf", "Client", "WhatsApp", "Artiste", "Service", "Date commande", "Durée", "Montant", "Statut", "Action"].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">{h}</th>
                      ))}</tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filtered.map(b => (
                        <tr key={b.id} className="hover:bg-gray-50">
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-2">
                              <img src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=60&q=80" alt="service" className="w-9 h-9 rounded-lg object-cover shrink-0 border border-gray-100" />
                              <span className="font-mono text-xs text-gray-400">{b.reference?.slice(-6)}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-semibold text-[#0c4a6e] text-sm">{b.clientFirstName} {b.clientLastName}</td>
                          <td className="px-4 py-3">
                            <a href={`https://wa.me/${b.clientPhone?.replace(/\s/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-green-600 text-xs font-medium">{b.clientPhone}</a>
                          </td>
                          <td className="px-4 py-3 text-gray-600 text-xs">{b.artistName ?? "—"}</td>
                          <td className="px-4 py-3 text-gray-600 text-xs">
                            <a href="/services/music" target="_blank" rel="noopener noreferrer" className="hover:underline text-[#0c4a6e] font-medium text-xs">
                              {b.serviceType} ↗
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
                            ) : new Date(b.sessionDate).toLocaleDateString("fr-FR")}
                          </td>
                          <td className="px-4 py-3 text-gray-600 text-xs">{b.sessionDuration}</td>
                          <td className="px-4 py-3 text-xs font-semibold text-[#0c4a6e]">{b.totalAmount ? `${b.totalAmount.toLocaleString()} FCFA` : "—"}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${STATUS_COLORS[b.status]}`}>{STATUS_LABELS[b.status]}</span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <select value="" onChange={e => { if (e.target.value) changeStatus(b.id, e.target.value, b); }}
                                className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs bg-white focus:outline-none">
                                <option value="">Statut</option>
                                <option value="CONFIRMED">Confirmer</option>
                                <option value="COMPLETED">Terminer</option>
                                <option value="REFUSED">Refuser</option>
                                <option value="CANCELLED">Annuler</option>
                              </select>
                              <button onClick={() => deleteBooking(b.id)} className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100">
                                <Trash2 size={13} />
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

      {/* Modal Ajouter un service musical */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
              <h3 className="font-bold text-[#0c4a6e] text-lg">Ajouter un service musical</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du service *</label>
                <input type="text" placeholder="Enregistrement studio" value={form.nom}
                  onChange={e => setForm(f => ({ ...f, nom: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <input type="text" placeholder="Studio / Production / Management..." value={form.categorie}
                  onChange={e => setForm(f => ({ ...f, categorie: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prix</label>
                <input type="text" placeholder="À partir de 50 000 FCFA" value={form.prix}
                  onChange={e => setForm(f => ({ ...f, prix: e.target.value }))}
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
              <button onClick={saveService} disabled={!form.nom || savingForm}
                className="flex-1 bg-[#c9a84c] hover:bg-[#b8973b] text-white font-bold py-2.5 rounded-xl disabled:opacity-60">
                {savingForm ? "Enregistrement..." : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


