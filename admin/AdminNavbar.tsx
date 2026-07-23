"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Camera, TrendingUp, LogOut, ListChecks,
  ShoppingBag, Briefcase, Menu, X, CalendarDays,
  LayoutGrid, UtensilsCrossed, Bus, Building2,
} from "lucide-react";
import NotificationBell from "@/components/admin/NotificationBell";

const NAV_LINKS = [
  { label: "Vue d'ensemble", href: "/admin/dashboard", icon: TrendingUp },
  { label: "Accueil - Hôtels & Résidences", href: "/admin/categories", icon: LayoutGrid },
  { label: "Restaurants & Gastronomie", href: "/admin/restaurants", icon: UtensilsCrossed },
  { label: "Côtière Transport", href: "/admin/transport", icon: Bus },
  { label: "Annuaire Collectivités", href: "/admin/collectivites", icon: Building2 },
  { label: "HBL Studio+", href: "/admin/studio", icon: Camera },
  { label: "CÔTIÈRE Market", href: "/admin/market", icon: ShoppingBag },
  { label: "CÔTIÈRE Opportunités", href: "/admin/opportunites", icon: Briefcase },
  { label: "RDV Événements À Venir", href: "/admin/rdv", icon: CalendarDays },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Empêcher le scroll du body quand le menu mobile est ouvert
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mobileOpen]);

  return (
    <>
      {/* ========================================== */}
      {/* 1. BARRE SUPÉRIEURE MOBILE UNIQUEMENT      */}
      {/* ========================================== */}
      <div className="lg:hidden bg-[#0c4a6e] text-white sticky top-0 z-40 px-4 py-3 flex items-center justify-between border-b border-white/10 shadow-md">
        <div className="flex items-center gap-3">
          <Link href="/admin/dashboard" className="group">
            <img
              src="/Images/cotiere-media-group.png"
              alt="COTIERE MEDIA GROUP"
              className="h-7 w-auto object-contain rounded-lg border border-[#c9a84c]/70 p-0.5 bg-white/5"
            />
          </Link>
          <div className="flex flex-col">
            <span className="text-white text-xs font-bold">CÔTIÈRE</span>
            <span className="text-[#c9a84c] text-[9px] uppercase tracking-wider font-semibold">Admin</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <NotificationBell />
          <button 
            onClick={() => setMobileOpen(true)} 
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white"
            aria-label="Ouvrir le menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* ========================================== */}
      {/* 2. SIDEBAR FIXE (DESKTOP)                  */}
      {/* ========================================== */}
      <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-72 bg-gradient-to-b from-[#0c4a6e] to-[#08334c] text-white shadow-2xl z-45 border-r border-white/10">
        
        {/* En-tête de la Sidebar */}
        <div className="p-6 border-b border-white/10 flex items-center gap-3 bg-black/10">
          <Link href="/admin/dashboard" className="group">
            <img
              src="/Images/cotiere-media-group.png"
              alt="COTIERE MEDIA GROUP"
              className="h-9 w-auto object-contain rounded-xl border-2 border-[#c9a84c]/70 group-hover:border-[#c9a84c] transition-colors p-0.5 shadow-sm bg-white/5"
            />
          </Link>
          <div className="flex flex-col">
            <span className="text-white font-bold tracking-wide text-sm">CÔTIÈRE</span>
            <span className="text-[#c9a84c] text-[10px] font-semibold uppercase tracking-wider">Administration</span>
          </div>
        </div>

        {/* Statut & Notifications (Desktop Header interne) */}
        <div className="px-6 py-3.5 border-b border-white/5 flex items-center justify-between bg-black/5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            <span className="text-xs font-medium text-white/80">En ligne</span>
          </div>
          <NotificationBell />
        </div>

        {/* Liens de Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 custom-scrollbar">
          {NAV_LINKS.map((l) => {
            const Icon = l.icon;
            const isActive = pathname === l.href;
            return (
              <Link 
                key={l.href} 
                href={l.href} 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group
                  ${isActive 
                    ? "bg-[#c9a84c] text-[#0c4a6e] shadow-lg shadow-[#c9a84c]/25 font-bold" 
                    : "text-white/75 hover:bg-white/10 hover:text-white hover:translate-x-1"
                  }`}
              >
                <Icon size={18} className={`${isActive ? "text-[#0c4a6e]" : "text-[#c9a84c] group-hover:text-white"} transition-colors`} />
                <span className="truncate">{l.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Pied de Sidebar */}
        <div className="p-4 border-t border-white/10 bg-black/20">
          <Link 
            href="/" 
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all text-sm font-medium group"
          >
            <LogOut size={16} className="text-[#c9a84c] group-hover:-translate-x-1 transition-transform" /> 
            <span>Site public</span>
          </Link>
        </div>
      </aside>

      {/* ========================================== */}
      {/* 3. MENU MOBILE DRAWER (GLISSEMENT LATÉRAL) */}
      {/* ========================================== */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] flex">
          {/* Arrière-plan sombre avec flou */}
          <div 
            className="absolute inset-0 bg-[#0c4a6e]/80 backdrop-blur-sm transition-opacity" 
            onClick={() => setMobileOpen(false)} 
          />
          
          {/* Panneau latéral mobile */}
          <div 
            className="relative flex flex-col h-full w-[85%] max-w-sm bg-gradient-to-b from-[#0c4a6e] to-[#08334c] shadow-2xl overflow-hidden ml-auto" 
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-5 border-b border-white/10 bg-black/10">
              <div className="flex items-center gap-3">
                <img src="/Images/cotiere-media-group.png" alt="COTIERE" className="h-8 w-auto object-contain rounded-lg border-2 border-[#c9a84c] p-0.5 bg-white/5" />
                <span className="text-white text-base font-bold tracking-wide">Menu Admin</span>
              </div>
              <button 
                onClick={() => setMobileOpen(false)} 
                className="text-white/70 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors"
                aria-label="Fermer le menu"
              >
                <X size={20} />
              </button>
            </div>
            
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5 custom-scrollbar">
              {NAV_LINKS.map((l) => {
                const Icon = l.icon;
                const isActive = pathname === l.href;
                return (
                  <Link 
                    key={l.href} 
                    href={l.href} 
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300
                      ${isActive 
                        ? "bg-[#c9a84c] text-[#0c4a6e] shadow-md shadow-[#c9a84c]/20 font-bold" 
                        : "text-white/75 hover:bg-white/10 hover:text-white"
                      }`}
                  >
                    <Icon size={18} className={isActive ? "text-[#0c4a6e]" : "text-[#c9a84c]"} />
                    <span>{l.label}</span>
                  </Link>
                );
              })}
            </nav>
            
            <div className="p-4 border-t border-white/10 bg-black/20">
              <Link 
                href="/" 
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all text-sm font-medium"
              >
                <LogOut size={18} /> Retour au site public
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}