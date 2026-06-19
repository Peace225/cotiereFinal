"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { RefreshCw, CheckCircle, Clock, TrendingUp, Users, ListChecks } from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import DevisButton from "@/components/admin/DevisButton";
import ExportButton from "@/components/admin/ExportButton";

type Booking = {
  id: string; reference: string;
  clientFirstName: string; clientLastName: string; clientPhone: string;
  eventType?: string; eventDate?: string; bookingDate?: string;
  eventLocation?: string; description?: string;
  createdAt?: string;
  status: string; totalAmount?: number; estimatedPriceMin?: number;
  type: "studio" | "event" | "excursion";
  excursion?: { title: string };
  isGeneric?: boolean;
  isMarket?: boolean;
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-green-100 text-green-700",
  REFUSED: "bg-red-100 text-red-700",
  CANCELLED: "bg-gray-100 text-gray-600",
  COMPLETED: "bg-blue-100 text-blue-700",
};
const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente", CONFIRMED: "Confirmé", REFUSED: "Refusé",
  CANCELLED: "Annulé", COMPLETED: "Terminé",
};
const TYPE_LABELS: Record<string, string> = {
  studio: "Studio+", event: "Événement", excursion: "Excursion",
};
const TYPE_COLORS: Record<string, string> = {
  studio: "bg-blue-50 text-blue-600",
  event: "bg-purple-50 text-purple-600",
  excursion: "bg-green-50 text-green-600",
};

function getEventBadge(b: Booking) {
  if (b.isMarket) return { label: "Market", color: "bg-orange-50 text-orange-600" };
  if (b.isGeneric) return { label: b.eventType ?? "Réservation", color: "bg-amber-50 text-amber-600" };
  return { label: TYPE_LABELS[b.type], color: TYPE_COLORS[b.type] };
}


export default function ReservationsAdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [changingId, setChangingId] = useState<string | null>(null);

  async function loadData() {
    setLoading(true);
    try {
      const [studioRes, eventRes, excursionRes] = await Promise.all([
        fetch("/api/studio/bookings?limit=500"),
        fetch("/api/events/requests?limit=500"),
        fetch("/api/excursions/bookings?limit=500"),
      ]);
      const [studioData, eventData, excursionData] = await Promise.all([
        studioRes.json(), eventRes.json(), excursionRes.json(),
      ]);
      const all: Booking[] = [
        ...(studioData.data?.bookings ?? []).map((b: any) => ({ ...b, type: "studio" as const })),
        ...(eventData.data?.requests ?? eventData.data ?? []).map((b: any) => ({
          ...b, type: "event" as const,
          isGeneric: b.reference?.startsWith("RES-"),
          isMarket: b.eventType === "Commande Market",
        })),
        ...(excursionData.data?.bookings ?? excursionData.data ?? []).map((b: any) => ({ ...b, type: "excursion" as const })),
      ].sort((a, b) => {
        const da = new Date(a.createdAt ?? a.eventDate ?? a.bookingDate ?? 0).getTime();
        const db = new Date(b.createdAt ?? b.eventDate ?? b.bookingDate ?? 0).getTime();
        return db - da;
      });
      setBookings(all);
    } catch {}
    setLoading(false);
  }

  useEffect(() => { loadData(); }, []);

  async function changeStatus(id: string, status: string, type: "studio" | "event" | "excursion", booking: Booking) {
    setChangingId(id);
    const urls: Record<string, string> = {
      studio: `/api/studio/bookings/${id}`,
      event: `/api/events/requests/${id}`,
      excursion: `/api/excursions/bookings/${id}`,
    };
    await fetch(urls[type], { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));

    if ((status === "CONFIRMED" || status === "REFUSED") && booking?.clientPhone) {
      let phone = booking.clientPhone.replace(/[\s\-().+]/g, "");
      if (phone.startsWith("00")) phone = phone.slice(2);
      if (phone.startsWith("0") && phone.length <= 10) phone = "225" + phone;
      if (phone && phone.length >= 8) {
        const clientName = (booking.clientFirstName + " " + booking.clientLastName).toUpperCase();
        const ref = (booking.reference ?? booking.id).slice(-6).toUpperCase();
        const service = booking.excursion?.title ?? booking.eventType ?? "votre service";
        const date = booking.eventDate ?? booking.bookingDate;
        const dateStr = date ? new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" }) : "Non precisee";
        const prix = booking.totalAmount
          ? booking.totalAmount.toLocaleString("fr-FR") + " FCFA"
          : booking.estimatedPriceMin
          ? "A partir de " + booking.estimatedPriceMin.toLocaleString("fr-FR") + " FCFA"
          : "Sur devis";
        const pageUrl = booking.eventLocation?.startsWith("http") ? booking.eventLocation : null;

        let msgConfirmed = "";
        let msgRefused = "";

        if (booking.isMarket) {
          let marketAdresse = "";
          let articlesFormatted = "";
          if (booking.description) {
            const lines = booking.description.split("\n");
            const serviceLine = lines.find((l) => l.startsWith("Service :"));
            const msgLine = lines.find((l) => l.startsWith("Message :"));
            if (msgLine) marketAdresse = msgLine.replace("Message : ", "");
            if (serviceLine) {
              const details = serviceLine.replace("Service : ", "");
              const parts = details.split(" | Total:");
              const articlesPart = parts[0] ?? details;
              const totalPart = parts[1] ? parts[1].trim() : "";
              articlesFormatted = articlesPart.split(", ").map((a: string) => "- " + a.replace(/\((\d[\d\s]*FCFA)\)/, "= $1")).join("\n");
              if (totalPart) articlesFormatted += "\n\nTOTAL: " + totalPart;
            }
          }
          msgConfirmed = "COMMANDE COTIERE MARKET [" + ref + "]\n\nBonjour " + clientName + ",\n\nVotre commande a ete CONFIRMEE !\n\n" + (marketAdresse ? marketAdresse + "\n\n" : "") + (articlesFormatted ? "ARTICLES:\n" + articlesFormatted + "\n\n" : "") + (pageUrl ? "Voir sur le site: " + pageUrl + "\n\n" : "") + "Notre livreur vous contactera pour la livraison.\n\nMerci de votre confiance.\n-- COTIERE MEDIA GROUP\n1er site officiel des villes et villages du littoral ivoirien\nTel: 07 47 72 29 31";
          msgRefused = "COMMANDE COTIERE MARKET [" + ref + "] - NON DISPONIBLE\n\nBonjour " + clientName + ",\n\nNous sommes desoles, votre commande n a pas pu etre traitee.\n\nContactez-nous pour plus d informations.\n\n-- COTIERE MEDIA GROUP\n1er site officiel des villes et villages du littoral ivoirien\nTel: 07 47 72 29 31";
        } else {
          msgConfirmed = "CONFIRMATION DE RESERVATION " + ref + "\n\nBonjour " + clientName + ",\n\nVotre demande de reservation a ete confirmee avec succes !\n\nService: " + service + "\nDate: " + dateStr + "\nPrix: " + prix + "\n" + (pageUrl ? "Voir sur le site: " + pageUrl + "\n" : "") + "\nNotre equipe vous contactera pour finaliser les details.\n\nMerci de votre confiance.\n-- COTIERE MEDIA GROUP\n1er site officiel des villes et villages du littoral ivoirien\nTel: 07 47 72 29 31";
          msgRefused = "RESERVATION " + ref + " - NON RETENUE\n\nBonjour " + clientName + ",\n\nNous sommes desoles, votre demande pour " + service + " n a pas pu etre acceptee pour le " + dateStr + ".\n\nContactez-nous pour plus d informations.\n\n-- COTIERE MEDIA GROUP\n1er site officiel des villes et villages du littoral ivoirien\nTel: 07 47 72 29 31";
        }

        const msg = encodeURIComponent(status === "CONFIRMED" ? msgConfirmed : msgRefused);
        window.open("https://wa.me/" + phone + "?text=" + msg, "_blank");
      }
    }
    setChangingId(null);
  }

  async function deleteBooking(id: string, type: "studio" | "event" | "excursion") {
    if (!confirm("Supprimer définitivement cette réservation ?")) return;
    const urls: Record<string, string> = {
      studio: `/api/studio/bookings/${id}`,
      event: `/api/events/requests/${id}`,
      excursion: `/api/excursions/bookings/${id}`,
    };
    await fetch(urls[type], { method: "DELETE" });
    setBookings(prev => prev.filter(b => b.id !== id));
  }

  const filtered = bookings
    .filter(b => filter === "ALL" || b.status === filter)
    .filter(b => {
      if (typeFilter === "ALL") return true;
      if (typeFilter === "market") return b.isMarket === true;
      return b.type === typeFilter && !b.isMarket;
    });

  const total = bookings.length;
  const pending = bookings.filter(b => b.status === "PENDING").length;
  const confirmed = bookings.filter(b => b.status === "CONFIRMED").length;
  // Inclure totalAmount ET estimatedPriceMin pour le revenu
  const revenue = bookings.filter(b => b.status === "CONFIRMED" || b.status === "COMPLETED")
    .reduce((s, b) => s + (b.totalAmount ?? b.estimatedPriceMin ?? 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Réservations", value: total, icon: ListChecks, color: "text-blue-500", bg: "bg-blue-50", filterVal: "ALL" },
            { label: "En attente", value: pending, icon: Clock, color: "text-yellow-500", bg: "bg-yellow-50", filterVal: "PENDING" },
            { label: "Confirmées", value: confirmed, icon: CheckCircle, color: "text-green-500", bg: "bg-green-50", filterVal: "CONFIRMED" },
            { label: "Revenu Total", value: revenue > 0 ? revenue.toLocaleString() + " FCFA" : "—", icon: TrendingUp, color: "text-[#c9a84c]", bg: "bg-amber-50", filterVal: null },
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
                <div className={"w-12 h-12 " + s.bg + " rounded-xl flex items-center justify-center"}>
                  <Icon size={22} className={s.color} />
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            <select value={filter} onChange={e => setFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8] bg-white">
              <option value="ALL">Tous les statuts</option>
              <option value="PENDING">En attente</option>
              <option value="CONFIRMED">Confirmés</option>
              <option value="COMPLETED">Terminés</option>
              <option value="REFUSED">Refusés</option>
              <option value="CANCELLED">Annulés</option>
            </select>
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8] bg-white">
              <option value="ALL">Tous les services</option>
              <option value="studio">Studio+</option>
              <option value="event">Événements</option>
              <option value="excursion">Excursions</option>
              <option value="market">Market</option>
            </select>
            <button onClick={loadData} className="flex items-center gap-2 bg-[#c9a84c] hover:bg-[#b8973b] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Actualiser
            </button>
          </div>
          <Link href="/admin/clients" className="flex items-center gap-2 bg-[#0284c7] hover:bg-[#0369a1] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
            <Users size={14} /> Liste des clients
          </Link>
          <ExportButton
            data={filtered.map(b => ({ reference: b.reference ?? b.id, client: b.clientFirstName + " " + b.clientLastName, telephone: b.clientPhone, service: b.excursion?.title ?? b.eventType ?? "—", type: b.isMarket ? "Market" : b.type, date: b.eventDate ?? b.bookingDate ?? "—", montant: b.totalAmount ?? b.estimatedPriceMin ?? "—", statut: b.status }))}
            columns={[{ key: "reference", label: "Référence" }, { key: "client", label: "Client" }, { key: "telephone", label: "Téléphone" }, { key: "service", label: "Service" }, { key: "type", label: "Type" }, { key: "date", label: "Date" }, { key: "montant", label: "Montant (FCFA)" }, { key: "statut", label: "Statut" }]}
            filename={"reservations-" + new Date().toISOString().split("T")[0]}
            label="Réservations"
          />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <div className="w-1 h-5 bg-[#c9a84c] rounded-full" />
            <h2 className="font-bold text-[#0c4a6e]">Réservations</h2>
            <span className="ml-auto text-xs text-gray-400">{filtered.length} résultat(s)</span>
          </div>
          {loading ? (
            <div className="py-16 text-center text-gray-400"><RefreshCw size={32} className="animate-spin mx-auto mb-3" />Chargement...</div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-gray-400">Aucune réservation trouvée.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {["ID", "Client", "WhatsApp", "Service", "Type", "Date commande", "Prix", "Statut", "Action"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((b) => {
                    const date = b.eventDate ?? b.bookingDate;
                    const service = b.excursion?.title ?? b.eventType ?? "—";

                    // Image par type/service
                    const SERVICE_IMAGES: Record<string, string> = {
                      "studio": "https://images.unsplash.com/photo-1601506521793-dc748fc80b67?w=60&q=80",
                      "excursion": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=60&q=80",
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
                    const produitName = (b.eventType ?? "").replace(/^Commander\s*:\s*/i, "").trim();
                    const imgSrc = SERVICE_IMAGES[produitName] ?? SERVICE_IMAGES[b.eventType ?? ""] ?? SERVICE_IMAGES[b.type] ?? "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=60&q=80";

                    // Lien vers le service sur le site
                    const MARKET_IDS: Record<string, string> = { "Attieke frais (1kg)": "1", "Attieke frais (5kg)": "2", "Poisson braise": "3", "Crevettes fraiches (500g)": "4", "Homard": "5", "Ananas frais": "6", "Mangues (1kg)": "7", "Panier mixte fruits de mer": "8" };
                    const HOTEL_IDS: Record<string, string> = { "Chambre Standard": "1", "Chambre Superieure": "2", "Chambre Supérieure": "2", "Suite Familiale": "3" };
                    const siteUrl = MARKET_IDS[produitName] ? `/services/market/${MARKET_IDS[produitName]}`
                      : HOTEL_IDS[b.eventType ?? ""] ? `/services/hebergement/${HOTEL_IDS[b.eventType ?? ""]}`
                      : b.type === "studio" ? "/services/studio"
                      : b.type === "excursion" ? `/services/tourisme/${(b as any).excursionId ?? ""}`
                      : b.isMarket ? "/services/market"
                      : "/services/evenements";

                    // Prix — pour les events, extraire depuis description si disponible
                    let prixDisplay = b.totalAmount ? b.totalAmount.toLocaleString() + " FCFA"
                      : b.estimatedPriceMin ? b.estimatedPriceMin.toLocaleString() + " FCFA"
                      : null;
                    if (!prixDisplay && b.description) {
                      const totalMatch = b.description.match(/Total:\s*([\d\s]+)\s*FCFA/i);
                      if (totalMatch) prixDisplay = parseInt(totalMatch[1].replace(/\s/g, "")).toLocaleString() + " FCFA";
                    }

                    return (
                      <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <img src={imgSrc} alt={service} className="w-9 h-9 rounded-lg object-cover shrink-0 border border-gray-100" />
                            <span className="font-mono text-xs text-gray-400">{b.reference?.slice(-6) ?? b.id.slice(-6)}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3"><p className="font-semibold text-[#0c4a6e]">{b.clientFirstName} {b.clientLastName}</p></td>
                        <td className="px-4 py-3">
                          <a href={"https://wa.me/" + b.clientPhone?.replace(/\s/g, "")} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 text-xs font-medium flex items-center gap-1">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 shrink-0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                            {b.clientPhone}
                          </a>
                        </td>
                        <td className="px-4 py-3 text-gray-600 text-xs max-w-[120px] truncate">{service}</td>
                        <td className="px-4 py-3">
                          <a href={siteUrl} target="_blank" rel="noopener noreferrer"
                            className={"text-xs px-2 py-1 rounded-full font-semibold hover:opacity-80 transition-opacity " + getEventBadge(b).color}>
                            {getEventBadge(b).label} ↗
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
                          ) : date ? new Date(date).toLocaleDateString("fr-FR") : "—"}
                        </td>
                        <td className="px-4 py-3 text-xs font-semibold text-[#0c4a6e]">
                          {prixDisplay ?? <span className="text-gray-400 font-normal">Sur devis</span>}
                        </td>
                        <td className="px-4 py-3">
                          <span className={"text-xs px-2.5 py-1 rounded-full font-semibold " + STATUS_COLORS[b.status]}>{STATUS_LABELS[b.status]}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <select value="" disabled={changingId === b.id} onChange={e => { if (e.target.value) changeStatus(b.id, e.target.value, b.type, b); }} className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#38bdf8] bg-white cursor-pointer">
                              <option value="">Changer statut</option>
                              <option value="PENDING">En attente</option>
                              <option value="CONFIRMED">Confirmer</option>
                              <option value="COMPLETED">Terminer</option>
                              <option value="REFUSED">Refuser</option>
                              <option value="CANCELLED">Annuler</option>
                            </select>
                            <DevisButton label="Devis" data={{ reference: b.reference ?? b.id, clientFirstName: b.clientFirstName, clientLastName: b.clientLastName, clientEmail: "", clientPhone: b.clientPhone, eventType: b.excursion?.title ?? b.eventType ?? "Service", eventDate: b.eventDate ?? b.bookingDate ?? new Date().toISOString(), eventLocation: "", services: [b.excursion?.title ?? b.eventType ?? "Service"], estimatedPriceMin: b.estimatedPriceMin, totalAmount: b.totalAmount, createdAt: b.eventDate ?? new Date().toISOString() }} />
                            <button onClick={() => deleteBooking(b.id, b.type)} className="text-red-400 hover:text-red-600 transition-colors p-1.5 rounded-lg hover:bg-red-50" title="Supprimer">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
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
      </div>
    </div>
  );
}


