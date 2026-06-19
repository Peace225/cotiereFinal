"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { TrendingUp, Eye, Calendar, Camera, BarChart2, FileText, Users, CreditCard, RefreshCw } from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import ExportButton from "@/components/admin/ExportButton";

// DonnÃ©es simulÃ©es pour les visites (analytics)
const generateDailyData = (days: number) => {
  const data = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    data.push({
      date: d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }),
      visits: Math.floor(Math.random() * 120) + 10,
    });
  }
  return data;
};

const servicesPopulaires = [
  { label: "HBL Studio+", visits: 342, color: "bg-blue-500", pct: 85 },
  { label: "Tourisme & Voyage", visits: 289, color: "bg-green-500", pct: 72 },
  { label: "Ã‰vÃ©nements", visits: 241, color: "bg-purple-500", pct: 60 },
  { label: "HÃ©bergement", visits: 198, color: "bg-orange-500", pct: 49 },
  { label: "Music & Management", visits: 156, color: "bg-pink-500", pct: 39 },
  { label: "MÃ©dias", visits: 112, color: "bg-red-500", pct: 28 },
];

const pagesVisitees = [
  { label: "Accueil",          visits: 1237, icon: "Home" },
  { label: "Services Studio+", visits: 342,  icon: "Camera" },
  { label: "Tourisme",         visits: 289,  icon: "Waves" },
  { label: "Ã‰vÃ©nements",       visits: 241,  icon: "PartyPopper" },
  { label: "Contact",          visits: 198,  icon: "Phone" },
  { label: "RÃ©servation",      visits: 187,  icon: "Calendar" },
  { label: "Ã€ propos",         visits: 143,  icon: "Info" },
  { label: "HÃ©bergement",      visits: 112,  icon: "Hotel" },
];

interface DashboardStats {
  totalReservations: number;
  pendingReservations: number;
  confirmedReservations: number;
  totalRevenue: number;
  totalClients: number;
  recentBookings: Array<{
    reference: string;
    service: string;
    client: string;
    amount: number;
    status: string;
    date: string;
  }>;
}
export default function StatistiquesPage() {
  const [period, setPeriod] = useState(30);
  const [activeTab, setActiveTab] = useState<"visites" | "reservations">("reservations");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  const dailyData = generateDailyData(period);
  const totalVisits = dailyData.reduce((s, d) => s + d.visits, 0);
  const todayVisits = dailyData[dailyData.length - 1]?.visits ?? 0;
  const weekVisits = dailyData.slice(-7).reduce((s, d) => s + d.visits, 0);
  const maxVisits = Math.max(...dailyData.map(d => d.visits));

  useEffect(() => {
    setLoadingStats(true);
    fetch("/api/admin/dashboard")
      .then(r => r.json())
      .then(d => {
        if (d.data) {
          const raw = d.data;
          const totalRes = (raw.stats?.studio?.total ?? 0) + (raw.stats?.excursions?.total ?? 0) + (raw.stats?.events?.total ?? 0);
          const pendingRes = (raw.stats?.studio?.pending ?? 0) + (raw.stats?.excursions?.pending ?? 0) + (raw.stats?.events?.pending ?? 0);

          // Construire recentBookings depuis les 3 sources
          const recentStudio = (raw.recent?.studio ?? []).map((b: any) => ({
            reference: b.reference,
            service: "STUDIO+",
            client: `${b.clientFirstName} ${b.clientLastName}`,
            amount: b.totalAmount ?? 0,
            status: b.status,
            date: b.createdAt,
          }));
          const recentExcursions = (raw.recent?.excursions ?? []).map((b: any) => ({
            reference: b.reference,
            service: b.excursion?.title ?? "Excursion",
            client: `${b.clientFirstName} ${b.clientLastName}`,
            amount: b.totalAmount ?? 0,
            status: b.status,
            date: b.createdAt,
          }));
          const recentEvents = (raw.recent?.events ?? []).map((b: any) => ({
            reference: b.reference,
            service: "Ã‰vÃ©nement",
            client: `${b.clientFirstName} ${b.clientLastName}`,
            amount: b.totalAmount ?? 0,
            status: b.status,
            date: b.createdAt,
          }));

          const allRecent = [...recentStudio, ...recentExcursions, ...recentEvents]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 10);

          setStats({
            totalReservations: totalRes,
            pendingReservations: pendingRes,
            confirmedReservations: totalRes - pendingRes,
            totalRevenue: raw.stats?.totalRevenue ?? 0,
            totalClients: raw.stats?.totalClients ?? 0,
            recentBookings: allRecent,
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoadingStats(false));
  }, []);

  // DonnÃ©es pour export CSV/PDF
  const exportServicesData = servicesPopulaires.map(s => ({ service: s.label, visites: s.visits, pourcentage: `${s.pct}%` }));
  const exportDailyData = dailyData.map(d => ({ date: d.date, visites: d.visits }));
  const exportReservationsData = (stats?.recentBookings ?? []).map(b => ({
    reference: b.reference,
    service: b.service,
    client: b.client,
    montant: b.amount ? `${b.amount.toLocaleString("fr-FR")} FCFA` : "â€”",
    statut: b.status,
    date: new Date(b.date).toLocaleDateString("fr-FR"),
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <BarChart2 size={22} className="text-[#c9a84c]" />
            <h1 className="text-xl font-black text-[#0c4a6e]">Statistiques & Rapports</h1>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              {[7, 30, 90].map(d => (
                <button key={d} onClick={() => setPeriod(d)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${period === d ? "bg-[#c9a84c] text-white shadow-md" : "bg-white text-gray-500 border border-gray-200 hover:border-[#c9a84c]"}`}>
                  {d}j
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-100 shadow-sm mb-6 w-fit">
          {[
            { id: "reservations", label: "RÃ©servations", icon: Calendar },
            { id: "visites", label: "Visites site", icon: Eye },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as "visites" | "reservations")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id ? "bg-[#0c4a6e] text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Icon size={15} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* â”€â”€ Onglet RÃ©servations â”€â”€ */}
        {activeTab === "reservations" && (
          <>
            {/* Stats rÃ©servations */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Total rÃ©servations", value: stats?.totalReservations ?? "â€”", color: "from-blue-500 to-blue-600", icon: Calendar },
                { label: "En attente", value: stats?.pendingReservations ?? "â€”", color: "from-amber-500 to-orange-500", icon: RefreshCw },
                { label: "ConfirmÃ©es", value: stats?.confirmedReservations ?? "â€”", color: "from-green-500 to-emerald-600", icon: TrendingUp },
                { label: "Clients", value: stats?.totalClients ?? "â€”", color: "from-purple-500 to-violet-600", icon: Users },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-2xl p-5 text-white shadow-lg`}>
                    <div className="flex items-start justify-between mb-3">
                      <p className="text-white/80 text-xs font-medium">{s.label}</p>
                      <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                        <Icon size={18} />
                      </div>
                    </div>
                    <p className="text-4xl font-black mb-1">
                      {loadingStats ? <span className="text-2xl opacity-60">...</span> : s.value}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Revenu total */}
            {stats?.totalRevenue !== undefined && (
              <div className="bg-gradient-to-r from-[#0c4a6e] to-[#0e5a82] rounded-2xl p-5 text-white shadow-lg mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#c9a84c] rounded-xl flex items-center justify-center">
                    <CreditCard size={22} />
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Chiffre d'affaires total</p>
                    <p className="text-3xl font-black text-[#c9a84c]">
                      {stats.totalRevenue.toLocaleString("fr-FR")} FCFA
                    </p>
                  </div>
                </div>
                <ExportButton
                  data={exportReservationsData}
                  columns={[
                    { key: "reference", label: "RÃ©fÃ©rence" },
                    { key: "service", label: "Service" },
                    { key: "client", label: "Client" },
                    { key: "montant", label: "Montant" },
                    { key: "statut", label: "Statut" },
                    { key: "date", label: "Date" },
                  ]}
                  filename={`reservations-${new Date().toISOString().split("T")[0]}`}
                  format="both"
                  label="Exporter"
                />
              </div>
            )}

            {/* Tableau rÃ©servations rÃ©centes */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <FileText size={18} className="text-[#c9a84c]" />
                  <h2 className="font-bold text-[#0c4a6e]">RÃ©servations rÃ©centes</h2>
                </div>
                <Link href="/admin/reservations" className="text-xs text-[#38bdf8] hover:underline font-medium">
                  Voir tout â†’
                </Link>
              </div>
              {loadingStats ? (
                <div className="flex justify-center py-10">
                  <RefreshCw size={20} className="animate-spin text-[#38bdf8]" />
                </div>
              ) : (stats?.recentBookings?.length ?? 0) === 0 ? (
                <div className="text-center py-10 text-gray-400 text-sm">Aucune rÃ©servation</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-xs text-gray-500 uppercase">
                        <th className="px-4 py-3 text-left font-semibold">RÃ©fÃ©rence</th>
                        <th className="px-4 py-3 text-left font-semibold">Service</th>
                        <th className="px-4 py-3 text-left font-semibold">Client</th>
                        <th className="px-4 py-3 text-right font-semibold">Montant</th>
                        <th className="px-4 py-3 text-center font-semibold">Statut</th>
                        <th className="px-4 py-3 text-right font-semibold">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {stats?.recentBookings?.map((b) => {
                        const statusColors: Record<string, string> = {
                          PENDING: "bg-amber-50 text-amber-700",
                          CONFIRMED: "bg-green-50 text-green-700",
                          CANCELLED: "bg-gray-100 text-gray-500",
                          REFUSED: "bg-red-50 text-red-700",
                          COMPLETED: "bg-blue-50 text-blue-700",
                        };
                        const statusLabels: Record<string, string> = {
                          PENDING: "En attente", CONFIRMED: "ConfirmÃ©e",
                          CANCELLED: "AnnulÃ©e", REFUSED: "RefusÃ©e", COMPLETED: "TerminÃ©e",
                        };
                        return (
                          <tr key={b.reference} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 font-mono text-xs text-gray-500">{b.reference}</td>
                            <td className="px-4 py-3 font-medium text-[#0c4a6e]">{b.service}</td>
                            <td className="px-4 py-3 text-gray-700">{b.client}</td>
                            <td className="px-4 py-3 text-right font-bold text-[#0c4a6e]">
                              {b.amount ? `${b.amount.toLocaleString("fr-FR")} FCFA` : "â€”"}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${statusColors[b.status] ?? "bg-gray-100 text-gray-500"}`}>
                                {statusLabels[b.status] ?? b.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right text-gray-500 text-xs">
                              {new Date(b.date).toLocaleDateString("fr-FR")}
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

        {/* â”€â”€ Onglet Visites â”€â”€ */}
        {activeTab === "visites" && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: `Visites (${period}j)`, value: totalVisits, sub: "DonnÃ©es simulÃ©es", color: "from-blue-500 to-blue-600", icon: Eye },
                { label: "Aujourd'hui", value: todayVisits, sub: "Estimation", color: "from-green-500 to-emerald-600", icon: Calendar },
                { label: "Cette semaine", value: weekVisits, sub: "7 derniers jours", color: "from-purple-500 to-violet-600", icon: TrendingUp },
                { label: "Taux conversion", value: "2%", sub: `${Math.floor(totalVisits * 0.02)} sessions`, color: "from-orange-500 to-amber-500", icon: BarChart2 },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-2xl p-5 text-white shadow-lg`}>
                    <div className="flex items-start justify-between mb-3">
                      <p className="text-white/80 text-xs font-medium">{s.label}</p>
                      <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                        <Icon size={18} />
                      </div>
                    </div>
                    <p className="text-4xl font-black mb-1">{s.value}</p>
                    <p className="text-white/70 text-xs">{s.sub}</p>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-2 mb-6 justify-end">
              <ExportButton
                data={exportServicesData}
                columns={[{ key: "service", label: "Service" }, { key: "visites", label: "Visites" }, { key: "pourcentage", label: "%" }]}
                filename={`stats-services-${new Date().toISOString().split("T")[0]}`}
                label="Services"
              />
              <ExportButton
                data={exportDailyData}
                columns={[{ key: "date", label: "Date" }, { key: "visites", label: "Visites" }]}
                filename={`stats-visites-${period}j-${new Date().toISOString().split("T")[0]}`}
                format="csv"
                label="Visites"
              />
            </div>

            {/* Graphique */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
              <div className="flex items-center gap-2 mb-6">
                <BarChart2 size={18} className="text-[#c9a84c]" />
                <h2 className="font-bold text-[#0c4a6e]">Visites par jour</h2>
                <span className="text-xs text-gray-400 ml-1">(donnÃ©es simulÃ©es)</span>
              </div>
              <div className="flex items-end gap-1 h-40 overflow-x-auto pb-2">
                {dailyData.map((d, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 min-w-[28px] group">
                    <span className="text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">{d.visits}</span>
                    <div
                      className="w-5 bg-[#c9a84c] hover:bg-[#b8973b] rounded-t transition-all cursor-pointer"
                      style={{ height: `${(d.visits / maxVisits) * 120}px` }}
                      title={`${d.date}: ${d.visits} visites`}
                    />
                    <span className="text-[9px] text-gray-400 rotate-45 origin-left whitespace-nowrap">{d.date}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-5">
                  <Camera size={18} className="text-[#c9a84c]" />
                  <h2 className="font-bold text-[#0c4a6e]">Services les plus consultÃ©s</h2>
                </div>
                <div className="space-y-4">
                  {servicesPopulaires.map((s) => (
                    <div key={s.label}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-700 font-medium">{s.label}</span>
                        <span className="text-sm font-bold text-[#0c4a6e]">{s.visits}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${s.color} rounded-full transition-all duration-500`} style={{ width: `${s.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-5">
                  <FileText size={18} className="text-[#c9a84c]" />
                  <h2 className="font-bold text-[#0c4a6e]">Pages visitÃ©es</h2>
                </div>
                <div className="space-y-3">
                  {pagesVisitees.map((p, i) => (
                    <div key={p.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <div className="flex items-center gap-3">
                        <span className="text-gray-300 text-xs font-bold w-5">{i + 1}</span>
                        <span className="text-lg">{p.icon}</span>
                        <span className="text-sm text-gray-700">{p.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#0c4a6e]">{p.visits}</span>
                        <span className="text-xs text-gray-400">visites</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

