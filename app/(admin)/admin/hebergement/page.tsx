"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, CheckCircle, Pencil, Trash2, X, Building2, Clock, RefreshCw } from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import ImageUploader from "@/components/admin/ImageUploader";
import ExportButton from "@/components/admin/ExportButton";

type Room = {
  id: string; name: string; type: string; capacity: number;
  pricePerNight: number; images: string[]; amenities: string[]; isActive: boolean;
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700", CONFIRMED: "bg-green-100 text-green-700",
  REFUSED: "bg-red-100 text-red-700", CANCELLED: "bg-gray-100 text-gray-600", COMPLETED: "bg-blue-100 text-blue-700",
};
const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente", CONFIRMED: "Confirmé", REFUSED: "Refusé", CANCELLED: "Annulé", COMPLETED: "Terminé",
};


const emptyForm = { name: "", type: "Chambre", capacity: "2", pricePerNight: "", amenities: "", images: "" };

export default function AdminHebergementPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [tab, setTab] = useState<"articles" | "reservations">("articles");
  const [hotelBookings, setHotelBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  useEffect(() => {
    fetch("/api/rooms")
      .then(r => r.json())
      .then(d => {
        const data = d.data ?? [];
        if (data.length > 0) setRooms(data);
        else setRooms([
          { id: "1", name: "Chambre Standard", type: "Chambre", capacity: 2, pricePerNight: 25000, images: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80"], amenities: ["Wifi", "Climatisation", "TV"], isActive: true },
          { id: "2", name: "Chambre Supérieure", type: "Chambre", capacity: 2, pricePerNight: 40000, images: ["https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80"], amenities: ["Wifi", "Climatisation", "TV", "Vue mer"], isActive: true },
          { id: "3", name: "Suite Familiale", type: "Suite", capacity: 4, pricePerNight: 65000, images: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80"], amenities: ["Wifi", "Climatisation", "Cuisine", "Salon"], isActive: true },
        ]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function loadBookings() {
    setLoadingBookings(true);
    try {
      const res = await fetch("/api/events/requests?limit=500");
      const data = await res.json();
      const all = data.data?.requests ?? data.data ?? [];
      // Filtrer uniquement les réservations hébergement
      const hotel = all.filter((b: any) =>
        /chambre|suite|hébergement|hebergement|résidence|residence|familiale|standard|supérieure|superieure/i.test(b.eventType ?? "") ||
        (b.reference?.startsWith("RES-") && /chambre|suite|hébergement|hebergement|résidence|residence|familiale|standard|supérieure|superieure/i.test(
          (b.description ?? "") + " " + (b.eventType ?? "")
        ))
      );
      setHotelBookings(hotel.sort((a: any, b: any) =>
        new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
      ));
    } catch {}
    setLoadingBookings(false);
  }

  async function changeHotelStatus(id: string, status: string, booking: any) {
    await fetch(`/api/events/requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setHotelBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));

    if (status === "CONFIRMED" || status === "REFUSED") {
      let phone = (booking.clientPhone ?? "").replace(/[\s\-().+]/g, "");
      if (phone.startsWith("00")) phone = phone.slice(2);
      if (phone.startsWith("0") && phone.length <= 10) phone = "225" + phone;
      if (!phone || phone.length < 8) return;

      const clientName = `${booking.clientFirstName} ${booking.clientLastName}`.toUpperCase();
      const ref = (booking.reference ?? booking.id).slice(-6).toUpperCase();
      const service = booking.eventType ?? "Hébergement";
      const date = booking.eventDate ? new Date(booking.eventDate).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" }) : "Non precisee";
      const pageUrl = booking.eventLocation?.startsWith("http") ? booking.eventLocation : null;

      const msgConfirmed =
        `CONFIRMATION DE RESERVATION ${ref}\n\n` +
        `Bonjour *${clientName}*,\n\n` +
        `Votre reservation a ete confirmee !\n\n` +
        `*Service:* ${service}\n` +
        `*Date:* ${date}\n` +
        (pageUrl ? `*Voir sur le site:* ${pageUrl}\n` : "") +
        `\nNotre equipe vous contactera pour les details.\n\n` +
        `-- *COTIERE MEDIA GROUP*\n_1er site officiel des villes et villages du littoral ivoirien_\nTel: 07 47 72 29 31`;

      const msgRefused =
        `RESERVATION ${ref} - NON RETENUE\n\n` +
        `Bonjour *${clientName}*,\n\n` +
        `Votre demande pour *${service}* n'a pas pu etre acceptee.\n\n` +
        `Contactez-nous pour plus d'informations.\n` +
        `-- *COTIERE MEDIA GROUP*\n_1er site officiel des villes et villages du littoral ivoirien_\nTel: 07 47 72 29 31`;

      const msg = encodeURIComponent(status === "CONFIRMED" ? msgConfirmed : msgRefused);
      window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
    }
  }

  useEffect(() => {
    if (tab === "reservations") loadBookings();
  }, [tab]);

  // Charger les réservations au montage initial aussi
  useEffect(() => {
    loadBookings();
  }, []);

  function openEdit(r: Room) {
    setForm({ name: r.name, type: r.type, capacity: String(r.capacity), pricePerNight: String(r.pricePerNight), amenities: r.amenities.join(", "), images: r.images.join(", ") });
    setEditId(r.id); setShowModal(true);
  }

  async function saveRoom() {
    setSaving(true);
    const body = {
      name: form.name,
      type: form.type,
      capacity: parseInt(form.capacity),
      pricePerNight: parseInt(form.pricePerNight),
      amenities: form.amenities ? form.amenities.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
      images: form.images ? form.images.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
    };
    try {
      const res = await fetch(editId ? `/api/rooms/${editId}` : "/api/rooms", {
        method: editId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        if (editId) setRooms(prev => prev.map(r => r.id === editId ? data.data : r));
        else setRooms(prev => [...prev, data.data]);
        setShowModal(false); setForm(emptyForm); setEditId(null);
      } else {
        alert(`Erreur ${res.status} : ${data.error ?? "Impossible de sauvegarder la chambre."}\nVérifiez que vous êtes connecté en tant qu'admin.`);
      }
    } catch {
      alert("Erreur réseau. Vérifiez votre connexion et réessayez.");
    }
    setSaving(false);
  }

  async function deleteRoom(id: string) {
    if (!confirm("Supprimer cette chambre ?")) return;
    await fetch(`/api/rooms/${id}`, { method: "DELETE" });
    setRooms(prev => prev.filter(r => r.id !== id));
  }

  async function toggleActive(r: Room) {
    await fetch(`/api/rooms/${r.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !r.isActive }),
    });
    setRooms(prev => prev.map(room => room.id === r.id ? { ...room, isActive: !room.isActive } : room));
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black text-[#0c4a6e]">Hébergement</h1>
          <div className="flex gap-2">
            <button onClick={() => { setShowModal(true); setEditId(null); setForm(emptyForm); }}
              className="flex items-center gap-2 bg-[#c9a84c] hover:bg-[#b8973b] text-white font-bold px-4 py-2 rounded-xl transition-colors shadow-md text-sm">
              <Plus size={15} /> Ajouter une chambre
            </button>
            <button onClick={() => setTab("articles")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "articles" ? "bg-[#0c4a6e] text-white" : "bg-white text-gray-500 border border-gray-200"}`}>
              Chambres ({rooms.length})
            </button>
            <button onClick={() => setTab("reservations")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "reservations" ? "bg-[#0c4a6e] text-white" : "bg-white text-gray-500 border border-gray-200"}`}>
              Réservations
            </button>
          </div>
        </div>

        {tab === "articles" && (
          <>
            {rooms.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center text-gray-400 shadow-sm border border-gray-100">
                Aucune chambre. Cliquez sur "Ajouter" pour commencer.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {rooms.map((r) => (
                  <div key={r.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                    <div className="relative h-40 bg-gray-100">
                      {r.images[0] ? (
                        <img src={r.images[0]} alt={r.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300"><Building2 size={40} /></div>
                      )}
                      <span className={`absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full font-bold ${r.isActive ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                        {r.isActive ? "DISPONIBLE" : "INDISPONIBLE"}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-[#0c4a6e] mb-1">{r.name}</h3>
                      <p className="text-xs text-gray-500 mb-1">{r.type} · {r.capacity} personnes</p>
                      <p className="text-xs text-[#c9a84c] font-semibold mb-3">{r.pricePerNight.toLocaleString()} FCFA / nuit</p>
                      <div className="flex gap-2">
                        <button onClick={() => toggleActive(r)}
                          className={`flex-1 flex items-center justify-center gap-1 text-xs font-bold py-2 rounded-lg transition-colors ${r.isActive ? "bg-orange-100 text-orange-600 hover:bg-orange-200" : "bg-green-100 text-green-600 hover:bg-green-200"}`}>
                          <CheckCircle size={13} /> {r.isActive ? "Désactiver" : "Activer"}
                        </button>
                        <button onClick={() => openEdit(r)}
                          className="flex-1 flex items-center justify-center gap-1 text-xs font-bold py-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors">
                          <Pencil size={13} /> Modifier
                        </button>
                        <button onClick={() => deleteRoom(r.id)}
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

        {tab === "reservations" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-[#c9a84c] rounded-full" />
                <h2 className="font-bold text-[#0c4a6e]">Réservations hébergement</h2>
              </div>
              <div className="flex items-center gap-2">
                <ExportButton
                  data={hotelBookings.map(b => ({
                    reference: b.reference ?? b.id,
                    client: b.clientFirstName + " " + b.clientLastName,
                    telephone: b.clientPhone,
                    chambre: b.eventType ?? "—",
                    date_commande: b.createdAt ? new Date(b.createdAt).toLocaleString("fr-FR") : "—",
                    statut: b.status,
                  }))}
                  columns={[
                    { key: "reference", label: "Référence" },
                    { key: "client", label: "Client" },
                    { key: "telephone", label: "Téléphone" },
                    { key: "chambre", label: "Chambre" },
                    { key: "date_commande", label: "Date commande" },
                    { key: "statut", label: "Statut" },
                  ]}
                  filename={"hebergement-reservations-" + new Date().toISOString().split("T")[0]}
                  label="Réservations"
                />
                <button onClick={loadBookings} className="flex items-center gap-1.5 text-xs bg-[#c9a84c] hover:bg-[#b8973b] text-white font-semibold px-3 py-1.5 rounded-lg transition-colors">
                  <RefreshCw size={12} className={loadingBookings ? "animate-spin" : ""} />
                  Actualiser
                </button>
              </div>
            </div>
            {loadingBookings ? (
              <div className="py-12 text-center text-gray-400 text-sm">Chargement...</div>
            ) : hotelBookings.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                <p className="font-medium mb-1">Aucune réservation</p>
                <p className="text-sm">Les réservations de chambres apparaîtront ici.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {["Réf", "Client", "WhatsApp", "Chambre", "Date commande", "Statut", "Action"].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                      {hotelBookings.map((b) => {
                        const HOTEL_IMAGES: Record<string, string> = {
                          "Chambre Standard": "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=60&q=80",
                          "Chambre Supérieure": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=60&q=80",
                          "Suite Familiale": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=60&q=80",
                        };
                        const HOTEL_IDS: Record<string, string> = {
                          "Chambre Standard": "1",
                          "Chambre Superieure": "2",
                          "Chambre Supérieure": "2",
                          "Suite Familiale": "3",
                        };
                        const imgSrc = HOTEL_IMAGES[b.eventType] ?? "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=60&q=80";
                        const hotelId = HOTEL_IDS[b.eventType] ?? "";
                        return (
                        <tr key={b.id} className="hover:bg-gray-50">
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-2">
                              <img src={imgSrc} alt="service" className="w-9 h-9 rounded-lg object-cover shrink-0 border border-gray-100" />
                              <span className="font-mono text-xs text-gray-400">{(b.reference ?? b.id).slice(-6)}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-semibold text-[#0c4a6e] text-sm">{b.clientFirstName} {b.clientLastName}</td>
                          <td className="px-4 py-3">
                            <a href={`https://wa.me/${b.clientPhone?.replace(/\s/g,"")}`} target="_blank" rel="noopener noreferrer"
                              className="text-green-600 text-xs font-medium">{b.clientPhone}</a>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-600">
                            <a href={`/services/hebergement/${hotelId}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-[#0c4a6e] font-medium text-xs">
                              {b.eventType ?? "—"} ↗
                            </a>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-600">
                            {b.createdAt ? (
                              <div>
                                <div>{new Date(b.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}</div>
                                <div className="text-gray-400 flex items-center gap-1 mt-0.5">
                                  <Clock size={10} />
                                  {new Date(b.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                                </div>
                              </div>
                            ) : b.eventDate ? new Date(b.eventDate).toLocaleDateString("fr-FR") : "—"}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${STATUS_COLORS[b.status] ?? "bg-gray-100 text-gray-600"}`}>
                              {STATUS_LABELS[b.status] ?? b.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <select value="" onChange={e => { if (e.target.value) changeHotelStatus(b.id, e.target.value, b); }}
                              className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#38bdf8]">
                              <option value="">Changer statut</option>
                              <option value="PENDING">En attente</option>
                              <option value="CONFIRMED">Confirmer</option>
                              <option value="COMPLETED">Terminer</option>
                              <option value="REFUSED">Refuser</option>
                              <option value="CANCELLED">Annuler</option>
                            </select>
                          </td>
                        </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="font-bold text-[#0c4a6e] text-lg">{editId ? "Modifier" : "Ajouter"} une chambre</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {[
                { key: "name", label: "Nom *", placeholder: "Chambre Standard" },
                { key: "type", label: "Type *", placeholder: "Chambre / Suite / Résidence" },
                { key: "capacity", label: "Capacité (personnes) *", placeholder: "2", type: "number" },
                { key: "pricePerNight", label: "Prix / nuit (FCFA) *", placeholder: "25000", type: "number" },
                { key: "amenities", label: "Équipements (séparés par virgule)", placeholder: "Wifi, Climatisation, TV" },
              ].map(({ key, label, placeholder, type }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input type={type ?? "text"} placeholder={placeholder}
                    value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" />
                </div>
              ))}
              {/* Upload images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
                <ImageUploader value={form.images} onChange={val => setForm(f => ({ ...f, images: val }))} />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50">Annuler</button>
              <button onClick={saveRoom} disabled={saving}
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
