"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, RefreshCw, CheckCircle, Clock, TrendingUp, Users, ShoppingBag } from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import NotificationBell from "@/components/admin/NotificationBell";
import ExportButton from "@/components/admin/ExportButton";

type Booking = {
  id: string; reference: string;
  clientFirstName: string; clientLastName: string; clientPhone: string;
  eventType: string; eventDate: string; status: string;
  estimatedPriceMin?: number; estimatedPriceMax?: number; totalAmount?: number;
  createdAt?: string;
  type: "studio" | "event" | "hotel" | "excursion" | "music" | "equipment";
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

export default function AdminDashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [changingId, setChangingId] = useState<string | null>(null);

  async function loadData() {
    setLoading(true);
    try {
      const [studioRes, eventRes, excursionRes, musicRes, equipmentRes] = await Promise.all([
        fetch("/api/studio/bookings?limit=500"),
        fetch("/api/events/requests?limit=500"),
        fetch("/api/excursions/bookings?limit=500"),
        fetch("/api/music/bookings?limit=500"),
        fetch("/api/equipment/rentals?limit=500"),
      ]);
      const studioData = await studioRes.json();
      const eventData = await eventRes.json();
      const excursionData = await excursionRes.json();
      const musicData = await musicRes.json();
      const equipmentData = await equipmentRes.json();

      const studioBookings: Booking[] = (studioData.data?.bookings ?? []).map((b: any) => ({ ...b, type: "studio" }));
      const allEvents: any[] = eventData.data?.requests ?? eventData.data ?? [];
      const eventBookings: Booking[] = allEvents
        .filter((b: any) => !/chambre|suite|hébergement|hebergement/i.test(b.eventType ?? ""))
        .map((b: any) => ({ ...b, type: "event" }));
      const hotelBookings: Booking[] = allEvents
        .filter((b: any) => /chambre|suite|hébergement|hebergement/i.test(b.eventType ?? ""))
        .map((b: any) => ({ ...b, type: "hotel", eventType: b.eventType ?? "Hébergement" }));
      const excursionBookings: Booking[] = (excursionData.data?.bookings ?? []).map((b: any) => ({ ...b, type: "excursion", eventType: b.excursion?.title ?? "Excursion", eventDate: b.bookingDate }));
      const musicBookings: Booking[] = (musicData.data?.bookings ?? []).map((b: any) => ({ ...b, type: "music", eventType: b.serviceType, eventDate: b.sessionDate }));
      const equipmentBookings: Booking[] = (equipmentData.data?.rentals ?? []).map((b: any) => ({ ...b, type: "equipment", eventType: "Guichet Unique", eventDate: b.startDate }));

      setBookings([...studioBookings, ...eventBookings, ...hotelBookings, ...excursionBookings, ...musicBookings, ...equipmentBookings].sort((a, b) =>
        new Date(b.createdAt ?? b.eventDate ?? 0).getTime() - new Date(a.createdAt ?? a.eventDate ?? 0).getTime()
      ));
    } catch {}
    setLoading(false);
  }

  useEffect(() => { loadData(); }, []);

  async function changeStatus(id: string, status: string, type: "studio" | "event" | "hotel" | "excursion" | "music" | "equipment") {
    setChangingId(id);
    const urlMap: Record<string, string> = {
      studio: `/api/studio/bookings/${id}`,
      event: `/api/events/requests/${id}`,
      hotel: `/api/events/requests/${id}`,
      excursion: `/api/excursions/bookings/${id}`,
      music: `/api/music/bookings/${id}`,
      equipment: `/api/equipment/rentals/${id}`,
    };
    const url = urlMap[type] ?? `/api/events/requests/${id}`;
    await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    setChangingId(null);
  }

  const filtered = bookings
    .filter(b => filter === "ALL" || b.status === filter)
    .filter(b => {
      if (typeFilter === "ALL") return true;
      if (typeFilter === "studio") return b.type === "studio";
      if (typeFilter === "excursion") return b.type === "excursion";
      if (typeFilter === "music") return b.type === "music";
      if (typeFilter === "equipment") return b.type === "equipment";
      if (typeFilter === "hotel") return b.type === "hotel";
      if (typeFilter === "market") return b.eventType === "Commande Market";
      if (typeFilter === "event") return b.type === "event" && b.eventType !== "Commande Market";
      return true;
    });
  const total = bookings.length;
  const pending = bookings.filter(b => b.status === "PENDING").length;
  const confirmed = bookings.filter(b => b.status === "CONFIRMED").length;
  const revenue = bookings.filter(b => b.status === "CONFIRMED").reduce((s, b) => s + (b.totalAmount ?? b.estimatedPriceMin ?? 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {[
            { label: "Total Réservations", value: total, icon: Calendar, color: "text-blue-500", bg: "bg-blue-50", filterVal: "ALL" },
            { label: "En attente", value: pending, icon: Clock, color: "text-yellow-500", bg: "bg-yellow-50", filterVal: "PENDING" },
            { label: "Confirmées", value: confirmed, icon: CheckCircle, color: "text-green-500", bg: "bg-green-50", filterVal: "CONFIRMED" },
            { label: "Revenu Total", value: revenue > 0 ? `${revenue.toLocaleString()} FCFA` : "—", icon: TrendingUp, color: "text-[#c9a84c]", bg: "bg-amber-50", filterVal: null },
          ].map((s) => {
            const Icon = s.icon;
            const isActive = s.filterVal && filter === s.filterVal;
            return (
              <button
                key={s.label}
                onClick={() => s.filterVal && setFilter(s.filterVal)}
                className={"bg-white rounded-2xl p-5 shadow-sm border flex items-center justify-between w-full text-left transition-all " + (isActive ? "border-[#c9a84c] ring-2 ring-[#c9a84c]/30 shadow-md" : "border-gray-100 hover:border-[#c9a84c]/40 hover:shadow-md") + (s.filterVal ? " cursor-pointer" : " cursor-default")}
              >
                <div>
                  <p className={"text-xs mb-1 " + (isActive ? "text-[#c9a84c] font-semibold" : "text-gray-400")}>{s.label}</p>
                  <p className="text-3xl font-black text-[#0c4a6e]">{s.value}</p>
                </div>
                <div className={`w-12 h-12 ${s.bg} rounded-xl flex items-center justify-center`}>
                  <Icon size={22} className={s.color} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Filters + refresh */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <select value={filter} onChange={e => setFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8] bg-white">
              <option value="ALL">Tous les statuts</option>
              <option value="PENDING">En attente</option>
              <option value="CONFIRMED">Confirmés</option>
              <option value="COMPLETED">Terminés</option>
              <option value="REFUSED">Refusés</option>
              <option value="CANCELLED">Annulés</option>
            </select>
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8] bg-white">
              <option value="ALL">Tous les services</option>
              <option value="studio">Studio+</option>
              <option value="event">Événements</option>
              <option value="excursion">Tourisme & Voyage</option>
              <option value="hotel">Hébergement</option>
              <option value="music">Musique</option>
              <option value="equipment">Guichet Unique</option>
              <option value="market">CÔTIÈRE Market</option>
            </select>
            <button onClick={loadData}
              className="flex items-center gap-2 bg-[#c9a84c] hover:bg-[#b8973b] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Actualiser
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/admin/clients"
              className="flex items-center gap-2 bg-[#0284c7] hover:bg-[#0369a1] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
              <Users size={14} /> Liste des clients
            </Link>
          <ExportButton
            data={filtered.map(b => ({
              reference: b.reference?.slice(-6) ?? b.id.slice(-6),
              client: b.clientFirstName + " " + b.clientLastName,
              telephone: b.clientPhone,
              service: b.eventType ?? "—",
              type: b.type === "studio" ? "Studio+" : "Evenement",
              date_commande: b.eventDate ? new Date(b.eventDate).toLocaleString("fr-FR") : "—",
              prix: b.totalAmount ? b.totalAmount.toLocaleString() + " FCFA" : b.estimatedPriceMin ? b.estimatedPriceMin.toLocaleString() + " FCFA" : "Sur devis",
              statut: b.status,
            }))}
            columns={[
              { key: "reference", label: "Ref" },
              { key: "client", label: "Client" },
              { key: "telephone", label: "Telephone" },
              { key: "service", label: "Service" },
              { key: "type", label: "Type" },
              { key: "date_commande", label: "Date" },
              { key: "prix", label: "Prix" },
              { key: "statut", label: "Statut" },
            ]}
            filename={"reservations-" + new Date().toISOString().split("T")[0]}
            label="Reservations"
          />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <div className="w-1 h-5 bg-[#c9a84c] rounded-full" />
            <h2 className="font-bold text-[#0c4a6e]">Réservations</h2>
            <span className="ml-auto text-xs text-gray-400">{filtered.length} résultat(s)</span>
          </div>

          {loading ? (
            <div className="py-16 text-center text-gray-400">
              <RefreshCw size={32} className="animate-spin mx-auto mb-3" />
              Chargement...
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-gray-400">Aucune réservation trouvée.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {["ID", "Client", "WhatsApp", "Service", "Date commande", "Prix", "Statut", "Action"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((b) => {
                    const SERVICE_IMAGES: Record<string, string> = {
                      "studio": "https://images.unsplash.com/photo-1601506521793-dc748fc80b67?w=60&q=80",
                      "Mariage": "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=60&q=80",
                      "Anniversaire": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=60&q=80",
                      "Commande Market": "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=60&q=80",
                      "Chambre Standard": "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=60&q=80",
                      "Chambre Superieure": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=60&q=80",
                      "Chambre Supérieure": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=60&q=80",
                      "Suite Familiale": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=60&q=80",
                      "Attieke frais (1kg)": "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=60&q=80",
                      "Attieke frais (5kg)": "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=60&q=80",
                      "Poisson braise": "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=60&q=80",
                      "Crevettes fraiches (500g)": "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=60&q=80",
                      "Homard": "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=60&q=80",
                    };
                    const MARKET_IDS: Record<string, string> = { "Attieke frais (1kg)": "1", "Attieke frais (5kg)": "2", "Poisson braise": "3", "Crevettes fraiches (500g)": "4", "Homard": "5", "Ananas frais": "6", "Mangues (1kg)": "7", "Panier mixte fruits de mer": "8" };
                    const HOTEL_IDS: Record<string, string> = { "Chambre Standard": "1", "Chambre Superieure": "2", "Chambre Supérieure": "2", "Suite Familiale": "3" };
                    const produitName = (b.eventType ?? "").replace(/^Commander\s*:\s*/i, "").trim();
                    const imgSrc = SERVICE_IMAGES[produitName] ?? SERVICE_IMAGES[b.eventType ?? ""] ?? SERVICE_IMAGES[b.type] ?? "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=60&q=80";
                    const siteUrl = MARKET_IDS[produitName] ? `/services/market/${MARKET_IDS[produitName]}`
                      : HOTEL_IDS[b.eventType ?? ""] ? `/services/hebergement/${HOTEL_IDS[b.eventType ?? ""]}`
                      : b.type === "studio" ? "/services/studio"
                      : b.eventType === "Commande Market" ? "/services/market"
                      : "/services/evenements";
                    const createdDate = b.createdAt ? new Date(b.createdAt) : (b.eventDate ? new Date(b.eventDate) : null);
                    return (
                    <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <img src={imgSrc} alt={b.eventType} className="w-9 h-9 rounded-lg object-cover shrink-0 border border-gray-100" />
                          <span className="font-mono text-xs text-gray-400">{b.reference?.slice(-6) ?? b.id.slice(-6)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-[#0c4a6e]">{b.clientFirstName} {b.clientLastName}</p>
                        <p className="text-xs text-gray-400">{b.type === "studio" ? "Studio+" : "Événement"}</p>
                      </td>
                      <td className="px-4 py-3">
                        <a href={`https://wa.me/${b.clientPhone?.replace(/\s/g, "")}`} target="_blank" rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-700 text-xs font-medium flex items-center gap-1">
                          <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                          {b.clientPhone}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        <a href={siteUrl} target="_blank" rel="noopener noreferrer" className="hover:underline text-[#0c4a6e] font-medium">
                          {b.eventType} ↗
                        </a>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">
                        {createdDate ? (
                          <div>
                            <div>{createdDate.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}</div>
                            <div className="text-gray-400 flex items-center gap-1 mt-0.5">
                              <Clock size={10} />
                              {createdDate.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                            </div>
                          </div>
                        ) : "—"}
                      </td>
                      <td className="px-4 py-3 text-xs font-semibold text-[#0c4a6e]">
                        {b.totalAmount ? `${b.totalAmount.toLocaleString()} FCFA` :
                          b.estimatedPriceMin ? `${b.estimatedPriceMin.toLocaleString()} FCFA` : <span className="text-gray-400 font-normal">Sur devis</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${STATUS_COLORS[b.status]}`}>
                          {STATUS_LABELS[b.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value=""
                          disabled={changingId === b.id}
                          onChange={e => { if (e.target.value) changeStatus(b.id, e.target.value, b.type); }}
                          className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#38bdf8] bg-white cursor-pointer">
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
      </div>
    </div>
  );
}
