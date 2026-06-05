"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Camera, Compass, Building2, Music, Users,
  TrendingUp, LogOut, BarChart2, ListChecks,
  CalendarOff, CreditCard, ShoppingBag, Star, Package,
  FileText, Tv, Briefcase, Menu, X, CalendarDays, MapPin,
} from "lucide-react";
import NotificationBell from "@/components/admin/NotificationBell";

const NAV_LINKS = [
  { label: "Vue d'ensemble", href: "/admin/dashboard", icon: TrendingUp },
  { label: "CÔTIÈRE Studio", href: "/admin/studio", icon: Camera },
  { label: "Guichet Unique", href: "/admin/location", icon: Package },
  { label: "Tourisme & Véhicules", href: "/admin/excursions", icon: Compass },
  { label: "CÔTIÈRE Hébergement", href: "/admin/hebergement", icon: Building2 },
  { label: "CÔTIÈRE Market", href: "/admin/market", icon: ShoppingBag },
  { label: "Réservations", href: "/admin/reservations", icon: ListChecks },
  { label: "CÔTIÈRE Musique", href: "/admin/musique", icon: Music },
  { label: "Médias & INFO+", href: "/admin/medias", icon: Tv },
  { label: "Tout Le Monde A Droit À La Pub", href: "/admin/afrouba", icon: FileText },
  { label: "CÔTIÈRE Collectivités", href: "/admin/collectivites", icon: Building2 },
  { label: "CÔTIÈRE Opportunités", href: "/admin/opportunites", icon: Briefcase },
  { label: "Contenus par Ville", href: "/admin/villes", icon: MapPin },
  { label: "RDV Événements À Venir", href: "/admin/rdv", icon: CalendarDays },
  { label: "Calendrier", href: "/admin/calendrier", icon: CalendarOff },
  { label: "Paiements", href: "/admin/paiements", icon: CreditCard },
  { label: "Avis", href: "/admin/avis", icon: Star },
  { label: "Statistiques", href: "/admin/statistiques", icon: BarChart2 },
  { label: "Clients", href: "/admin/clients", icon: Users },
];

export default function AdminNavbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="bg-[#0c4a6e] text-white shadow-lg sticky top-0 z-50">
        {/* Ligne 1 : Logo + infos + actions */}
        <div className="px-4 py-2 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard">
              <img
                src="/Images/cotiere-media-group.png"
                alt="COTIERE MEDIA GROUP"
                className="h-7 w-auto object-contain rounded-lg border-2 border-[#c9a84c] p-0.5"
              />
            </Link>
            <span className="text-white/50 text-xs hidden sm:block font-medium">Administration</span>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell />
            <div className="flex items-center gap-1.5 text-xs text-white/60">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="hidden sm:block">En ligne</span>
            </div>
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors"
              title="Retour au site"
            >
              <LogOut size={14} />
              <span className="hidden sm:block">Site</span>
            </Link>
            {/* Hamburger mobile */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {/* Ligne 2 : Navigation desktop — scroll horizontal */}
        <div className="hidden lg:block px-2 py-1 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-0.5 min-w-max">
            {NAV_LINKS.map((l) => {
              const Icon = l.icon;
              const isActive = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  title={l.label}
                  className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-[11px] font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-[#c9a84c] text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon size={12} />
                  {l.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Ligne 2 mobile : lien actif visible */}
        <div className="lg:hidden px-4 py-1.5 border-t border-white/10">
          {(() => {
            const active = NAV_LINKS.find(l => l.href === pathname);
            const Icon = active?.icon ?? TrendingUp;
            return (
              <div className="flex items-center gap-2 text-[#c9a84c] text-xs font-semibold">
                <Icon size={13} />
                <span>{active?.label ?? "Administration"}</span>
              </div>
            );
          })()}
        </div>
      </nav>

      {/* Drawer mobile */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="absolute top-0 left-0 h-full w-72 max-w-[85vw] bg-[#0c4a6e] shadow-2xl overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Header drawer */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <img
                  src="/Images/cotiere-media-group.png"
                  alt="COTIERE"
                  className="h-7 w-auto object-contain rounded-lg border-2 border-[#c9a84c] p-0.5"
                />
                <span className="text-white text-sm font-bold">Admin</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="text-white/60 hover:text-white">
                <X size={18} />
              </button>
            </div>

            {/* Liens */}
            <nav className="py-2">
              {NAV_LINKS.map((l) => {
                const Icon = l.icon;
                const isActive = pathname === l.href;
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-[#c9a84c] text-white"
                        : "text-white/75 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon size={16} />
                    {l.label}
                  </Link>
                );
              })}
            </nav>

            {/* Footer drawer */}
            <div className="px-4 py-4 border-t border-white/10 mt-2">
              <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors">
                <LogOut size={15} />
                Retour au site
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
