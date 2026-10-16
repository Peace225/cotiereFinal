"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Camera,
  TrendingUp,
  LogOut,
  ShoppingBag,
  Briefcase,
  Menu,
  X,
  CalendarDays,
  LayoutGrid,
  UtensilsCrossed,
  Bus,
  Building2,
  Hotel,
  House,
} from "lucide-react";

import NotificationBell from "@/components/admin/NotificationBell";

const NAV_LINKS = [
  {
    label: "Vue d'ensemble",
    href: "/admin/dashboard",
    icon: TrendingUp,
  },
  {
    label: "Tous les hébergements",
    href: "/admin/categories",
    icon: LayoutGrid,
  },
  {
    label: "Hôtels",
    href: "/admin/hotels",
    icon: Hotel,
  },
  {
    label: "Résidences",
    href: "/admin/residences",
    icon: Building2,
  },
  {
    label: "Villas",
    href: "/admin/villas",
    icon: House,
  },
  {
    label: "Restaurants & Gastronomie",
    href: "/admin/restaurants",
    icon: UtensilsCrossed,
  },
  {
    label: "Côtière Transport",
    href: "/admin/transport",
    icon: Bus,
  },
  {
    label: "Annuaire Collectivités",
    href: "/admin/collectivites",
    icon: Building2,
  },
  {
    label: "HBL Studio+",
    href: "/admin/studio",
    icon: Camera,
  },
  {
    label: "CÔTIÈRE Market",
    href: "/admin/market",
    icon: ShoppingBag,
  },
  {
    label: "CÔTIÈRE Opportunités",
    href: "/admin/opportunites",
    icon: Briefcase,
  },
  {
    label: "RDV Événements À Venir",
    href: "/admin/rdv",
    icon: CalendarDays,
  },
];

// Liens rapides affichés dans la barre inférieure mobile
const QUICK_BOTTOM_LINKS = [
  { label: "Hôtels", href: "/admin/hotels", icon: Hotel },
  { label: "Résidences", href: "/admin/residences", icon: Building2 },
  { label: "Villas", href: "/admin/villas", icon: House },
  { label: "Restaurants", href: "/admin/restaurants", icon: UtensilsCrossed },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Bloquer le scroll de la page pendant l'ouverture du menu mobile.
  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [mobileOpen]);

  // Fermer le menu mobile après une navigation.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <>
      {/* BARRE SUPERIEURE MOBILE */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-[#0c4a6e] px-4 py-3 text-white shadow-md lg:hidden">
        <Link
          href="/admin/dashboard"
          onClick={closeMobileMenu}
          className="flex min-w-0 items-center gap-3"
        >
          <img
            src="/Images/cotiere-media-group.png"
            alt="Côtière Media Group"
            className="h-8 w-auto rounded-lg border border-[#c9a84c]/70 bg-white/5 p-0.5 object-contain"
          />

          <div className="flex flex-col">
            <span className="text-xs font-bold">CÔTIÈRE</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#c9a84c]">
              Administration
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <NotificationBell />

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Ouvrir le menu"
            aria-expanded={mobileOpen}
            aria-controls="admin-mobile-menu"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 transition-colors hover:bg-white/20"
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      {/* BARRE DE NAVIGATION INFÉRIEURE MOBILE (QUICK NAV) */}
      <nav 
        aria-label="Navigation rapide mobile"
        className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-slate-200 bg-white px-2 py-2 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] lg:hidden"
      >
        {QUICK_BOTTOM_LINKS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 transition-colors ${
                active ? "text-[#0c4a6e] font-bold" : "text-slate-500 hover:text-[#0c4a6e]"
              }`}
            >
              <div className={`p-1.5 rounded-xl ${active ? "bg-[#c9a84c]/20 text-[#0c4a6e]" : ""}`}>
                <Icon size={20} className={active ? "text-[#0c4a6e]" : "text-[#c9a84c]"} />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 truncate max-w-[75px]">
                {item.label.split(" ")[0]}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* SIDEBAR DESKTOP : 288 PX */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col overflow-hidden border-r border-white/10 bg-gradient-to-b from-[#0c4a6e] to-[#08334c] text-white shadow-2xl lg:flex">
        {/* LOGO FIXE */}
        <div className="flex shrink-0 items-center gap-3 border-b border-white/10 bg-black/10 p-6">
          <Link
            href="/admin/dashboard"
            className="flex min-w-0 items-center gap-3"
          >
            <img
              src="/Images/cotiere-media-group.png"
              alt="Côtière Media Group"
              className="h-10 w-auto rounded-xl border-2 border-[#c9a84c]/70 bg-white/5 p-0.5 object-contain"
            />

            <div className="min-w-0">
              <p className="text-sm font-bold tracking-wide">
                CÔTIÈRE
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#c9a84c]">
                Administration
              </p>
            </div>
          </Link>
        </div>

        {/* STATUT ET NOTIFICATIONS */}
        <div className="flex shrink-0 items-center justify-between border-b border-white/5 bg-black/5 px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-40" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
            </span>

            <span className="text-xs font-medium text-white/80">
              En ligne
            </span>
          </div>

          <NotificationBell />
        </div>

        {/* NAVIGATION AVEC SCROLL FIN */}
        <nav
          aria-label="Navigation administrateur"
          className="admin-sidebar-scroll min-h-0 flex-1 space-y-1.5 overflow-x-hidden overflow-y-auto px-4 py-5"
        >
          {NAV_LINKS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            const linkClass = active
              ? "group flex min-h-12 items-center gap-3 rounded-xl bg-[#c9a84c] px-4 py-3 text-sm font-bold text-[#0c4a6e] shadow-lg shadow-black/10 transition-colors duration-200"
              : "group flex min-h-12 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/75 transition-colors duration-200 hover:bg-white/10 hover:text-white";

            const iconClass = active
              ? "shrink-0 text-[#0c4a6e]"
              : "shrink-0 text-[#c9a84c] transition-colors group-hover:text-white";

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                title={item.label}
                className={linkClass}
              >
                <Icon size={18} className={iconClass} />

                <span className="min-w-0 flex-1 truncate">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* PIED FIXE */}
        <div className="shrink-0 border-t border-white/10 bg-black/20 p-4">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-xl bg-white/5 px-4 py-3 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            <LogOut size={17} className="text-[#c9a84c]" />
            Site public
          </Link>
        </div>
      </aside>

      {/* MENU MOBILE */}
      {mobileOpen && (
        <div
          id="admin-mobile-menu"
          className="fixed inset-0 z-[60] flex lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation administrateur"
        >
          {/* FOND SOMBRE */}
          <button
            type="button"
            aria-label="Fermer le menu"
            onClick={closeMobileMenu}
            className="absolute inset-0 bg-[#0c4a6e]/80 backdrop-blur-sm"
          />

          {/* PANNEAU MOBILE */}
          <div className="relative ml-auto flex h-full w-[85%] max-w-sm flex-col overflow-hidden bg-gradient-to-b from-[#0c4a6e] to-[#08334c] text-white shadow-2xl pb-16">
            {/* EN-TETE MOBILE */}
            <div className="flex shrink-0 items-center justify-between border-b border-white/10 bg-black/10 p-5">
              <div className="flex min-w-0 items-center gap-3">
                <img
                  src="/Images/cotiere-media-group.png"
                  alt="Côtière Media Group"
                  className="h-9 w-auto object-contain"
                />

                <span className="font-bold">
                  Menu Admin
                </span>
              </div>

              <button
                type="button"
                onClick={closeMobileMenu}
                aria-label="Fermer le menu"
                className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20"
              >
                <X size={20} />
              </button>
            </div>

            {/* NAVIGATION MOBILE */}
            <nav
              aria-label="Navigation mobile administrateur"
              className="admin-sidebar-scroll min-h-0 flex-1 space-y-1.5 overflow-x-hidden overflow-y-auto px-3 py-5"
            >
              {NAV_LINKS.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                const linkClass = active
                  ? "flex min-h-12 items-center gap-3 rounded-xl bg-[#c9a84c] px-4 py-3 text-sm font-bold text-[#0c4a6e]"
                  : "flex min-h-12 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/75 transition-colors hover:bg-white/10 hover:text-white";

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMobileMenu}
                    aria-current={active ? "page" : undefined}
                    className={linkClass}
                  >
                    <Icon size={18} className="shrink-0" />

                    <span className="min-w-0 flex-1">
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </nav>

            {/* PIED MOBILE */}
            <div className="shrink-0 border-t border-white/10 bg-black/20 p-4">
              <Link
                href="/"
                onClick={closeMobileMenu}
                className="flex items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm font-medium transition-colors hover:bg-white/20"
              >
                <LogOut size={18} />
                Retour au site public
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}