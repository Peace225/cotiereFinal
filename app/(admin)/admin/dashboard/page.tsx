"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Calendar, RefreshCw, CheckCircle, Clock, TrendingUp, Users } from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import ExportButton from "@/components/admin/ExportButton";

type BookingType = "studio" | "event" | "hotel" | "excursion" | "music" | "equipment";
type Booking = {
  id: string; reference?: string; clientFirstName: string; clientLastName: string;
  clientPhone: string; eventType: string; eventDate: string; status: string;
  estimatedPriceMin?: number; estimatedPriceMax?: number; totalAmount?: number;
  createdAt?: string; type: BookingType;
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

function getBookingDate(b: any) {
  const v = b.createdAt || b.eventDate || b.startDate || b.bookingDate || b.sessionDate;
  if (!v) return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}

export default function AdminDashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [changingId, setChangingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const opts: RequestInit = { credentials: "include" };

      const [studioRes, eventRes, excursionRes, equipmentRes] = await Promise.all([
        fetch("/api/studio/bookings?limit=500", opts),
        fetch("/api/events/requests?limit=500", opts),
        fetch("/api/excursions/bookings?limit=500", opts),
        fetch("/api/equipment/rentals?limit=500", opts),
      ]);

      const responses = [studioRes, eventRes, excursionRes, equipmentRes];

      if (responses.some(r => r.status === 401)) {
        window.location.href = "/connexion";
        return;
      }

      const [studioData, eventData, excursionData, equipmentData] = await Promise.all(
        responses.map(async r => {
          if (!r.ok) return {};
          try { return await r.json(); } catch { return {}; }
        })
      );

      const studioBookings: Booking[] = (studioData?.bookings ?? []).map((b: any) => ({ ...b, type: "studio" as const }));
      const rawEvents = Array.isArray(eventData) ? eventData : (eventData?.requests ?? []);
      const eventBookings = rawEvents.filter((b: any) => !/chambre|suite|hébergement|hebergement/i.test(b.eventType ?? "")).map((b: any) => ({ ...b, type: "event" as const }));
      const hotelBookings = rawEvents.filter((b: any) => /chambre|suite|hébergement|hebergement/i.test(b.eventType ?? "")).map((b: any) => ({ ...b, type: "hotel" as const, eventType: b.eventType ?? "Hébergement" }));
      const excursionBookings = (excursionData?.bookings ?? []).map((b: any) => ({ ...b, type: "excursion" as const, eventType: b.excursion?.title ?? b.title ?? "Excursion", eventDate: b.bookingDate ?? b.eventDate }));
      const equipmentBookings = (equipmentData?.rentals ?? []).map((b: any) => ({ ...b, type: "equipment" as const, eventType: "Guichet Unique", eventDate: b.startDate ?? b.eventDate }));

      const all = [...studioBookings, ...eventBookings, ...hotelBookings, ...excursionBookings, ...equipmentBookings]
        .sort((a, b) => (getBookingDate(b)?.getTime() ?? 0) - (getBookingDate(a)?.getTime() ?? 0));

      setBookings(all as Booking[]);
    } catch (err) {
      setError("Impossible de charger les réservations.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadData(); }, [loadData]);

  async function changeStatus(id: string, status: string, type: BookingType) {
    const urlMap: Record<BookingType, string> = {
      studio: `/api/studio/bookings/${id}`, event: `/api/events/requests/${id}`, hotel: `/api/events/requests/${id}`,
      excursion: `/api/excursions/bookings/${id}`, music: `/api/music/bookings/${id}`, equipment: `/api/equipment/rentals/${id}`,
    };
    setChangingId(id);
    try {
      const res = await fetch(urlMap[type], { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }), credentials: "include" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setBookings(prev => prev.map(b => b.id === id && b.type === type ? { ...b, status } : b));
    } catch { setError("La modification du statut a échoué."); } finally { setChangingId(null); }
  }

  const filtered = useMemo(() => bookings
    .filter(b => filter === "ALL" || b.status === filter)
    .filter(b => typeFilter === "ALL" || b.type === typeFilter), [bookings, filter, typeFilter]);

  const total = bookings.length;
  const pending = bookings.filter(b => b.status === "PENDING").length;
  const confirmed = bookings.filter(b => b.status === "CONFIRMED").length;
  const revenue = bookings.filter(b => b.status === "CONFIRMED").reduce((s, b) => s + (b.totalAmount ?? b.estimatedPriceMin ?? 0), 0);

  const stats = [
    { label: "Total Réservations", value: total, icon: Calendar, color: "text-blue-500", bg: "bg-blue-50", filterVal: "ALL" },
    { label: "En attente", value: pending, icon: Clock, color: "text-yellow-500", bg: "bg-yellow-50", filterVal: "PENDING" },
    { label: "Confirmées", value: confirmed, icon: CheckCircle, color: "text-green-500", bg: "bg-green-50", filterVal: "CONFIRMED" },
    { label: "Revenu Total", value: revenue > 0 ? `${revenue.toLocaleString("fr-FR")} FCFA` : "—", icon: TrendingUp, color: "text-[#c9a84c]", bg: "bg-amber-50", filterVal: null },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <main className="min-w-0 lg:ml-72">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          
          {/* STATS */}
          <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map(stat => {
              const Icon = stat.icon;
              const isActive = stat.filterVal !== null && filter === stat.filterVal;
              return (
                <button 
                  key={stat.label} 
                  disabled={stat.filterVal === null} 
                  onClick={() => stat.filterVal && setFilter(stat.filterVal)} 
                  className={`flex items-center justify-between rounded-2xl border bg-white p-5 text-left shadow-sm transition ${isActive ? "border-[#c9a84c] ring-2 ring-[#c9a84c]/30" : "border-gray-100"}`}
                >
                  <div>
                    <p className="text-xs text-gray-400">{stat.label}</p>
                    <p className="text-xl sm:text-2xl font-black text-[#0c4a6e]">{stat.value}</p>
                  </div>
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stat.bg}`}>
                    <Icon size={22} className={stat.color} />
                  </div>
                </button>
              );
            })}
          </section>

          {/* FILTRES ET ACTIONS */}
          <section className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2.5">
              <select 
                value={filter} 
                onChange={e => setFilter(e.target.value)} 
                className="rounded-lg border bg-white px-3 py-2 text-xs sm:text-sm text-gray-700 outline-none focus:border-[#0c4a6e]"
              >
                <option value="ALL">Tous les statuts</option>
                <option value="PENDING">En attente</option>
                <option value="CONFIRMED">Confirmés</option>
                <option value="COMPLETED">Terminés</option>
                <option value="REFUSED">Refusés</option>
                <option value="CANCELLED">Annulés</option>
              </select>

              <select 
                value={typeFilter} 
                onChange={e => setTypeFilter(e.target.value)} 
                className="rounded-lg border bg-white px-3 py-2 text-xs sm:text-sm text-gray-700 outline-none focus:border-[#0c4a6e]"
              >
                <option value="ALL">Tous les types</option>
                <option value="studio">Studio+</option>
                <option value="event">Événements</option>
                <option value="excursion">Tourisme</option>
                <option value="hotel">Hébergement</option>
                <option value="equipment">Guichet Unique</option>
              </select>

              <button 
                onClick={() => void loadData()} 
                disabled={loading} 
                className="flex items-center gap-1.5 rounded-lg bg-[#c9a84c] px-4 py-2 text-xs sm:text-sm font-semibold text-white transition hover:bg-[#b3933c] disabled:opacity-60"
              >
                <RefreshCw size={15} className={loading ? "animate-spin" : ""} /> 
                Actualiser
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link 
                href="/admin/clients" 
                className="flex items-center gap-1.5 rounded-lg bg-[#0284c7] px-4 py-2 text-xs sm:text-sm font-semibold text-white transition hover:bg-[#0369a1]"
              >
                <Users size={15} /> Clients
              </Link>
              <ExportButton 
                data={filtered} 
                columns={[{ key: "reference", label: "Ref" }, { key: "clientFirstName", label: "Client" }]} 
                filename="reservations-cotiere" 
                label="Exporter" 
              />
            </div>
          </section>

          {error && <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs sm:text-sm text-red-700">{error}</div>}

          {/* TABLEAU RESPONSIVE */}
          <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b px-4 sm:px-6 py-4">
              <div className="h-5 w-1 rounded-full bg-[#c9a84c]" />
              <h2 className="font-bold text-[#0c4a6e] text-sm sm:text-base">Réservations</h2>
              <span className="ml-auto text-xs text-gray-400">{filtered.length} résultat(s)</span>
            </div>

            {loading ? (
              <div className="py-16 text-center text-sm text-gray-400">Chargement des réservations...</div>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center text-sm text-gray-400">Aucune réservation trouvée.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-left text-sm">
                  <thead className="border-b bg-gray-50">
                    <tr>
                      {["ID", "Client", "Service", "Date", "Prix", "Statut", "Action"].map(h => (
                        <th key={h} className="px-4 py-3 text-xs font-bold uppercase text-gray-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filtered.map(b => {
                      const d = getBookingDate(b);
                      return (
                        <tr key={`${b.type}-${b.id}`} className="hover:bg-gray-50 transition">
                          <td className="px-4 py-3 font-mono text-xs text-gray-400">{b.reference?.slice(-6) ?? b.id.slice(-6)}</td>
                          <td className="px-4 py-3 font-semibold text-[#0c4a6e]">{b.clientFirstName} {b.clientLastName}</td>
                          <td className="px-4 py-3 text-xs sm:text-sm">{b.eventType}</td>
                          <td className="px-4 py-3 text-xs">{d ? d.toLocaleDateString("fr-FR") : "—"}</td>
                          <td className="px-4 py-3 text-xs font-semibold">{b.totalAmount ?? b.estimatedPriceMin ?? "Sur devis"}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-block rounded-full border px-2.5 py-1 text-[11px] font-medium ${STATUS_COLORS[b.status] ?? "bg-gray-100"}`}>
                              {STATUS_LABELS[b.status] ?? b.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <select 
                              value="" 
                              disabled={changingId === b.id} 
                              onChange={e => e.target.value && void changeStatus(b.id, e.target.value, b.type)} 
                              className="rounded-lg border bg-white px-2 py-1.5 text-xs outline-none focus:border-[#0c4a6e]"
                            >
                              <option value="">Changer...</option>
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
          </section>

        </div>
      </main>
    </div>
  );
}