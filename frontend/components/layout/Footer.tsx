"use client";

import Link from "next/link";
import { useState } from "react";
import { Phone, MapPin, ArrowRight, ChevronDown, MessageCircle } from "lucide-react";

const services = [
  ["CÔTIÈRE HBL Studio+", "/services/studio"],
  ["CÔTIÈRE Tourisme & Voyage", "/services/tourisme"],
  ["CÔTIÈRE Hébergement & Restauration", "/services/hebergement"],
  ["CÔTIÈRE Music & Management", "/services/music"],
  ["Guichet Unique Événementiel", "/services/location"],
  ["CÔTIÈRE MÉDIAS", "/services/medias"],
  ["CÔTIÈRE Market & Distribution", "/services/market"],
  ["Tout Le Monde A Droit À La Pub", "/services/afrouba"],
  ["CÔTIÈRE Collectivités", "/services/collectivites"],
  ["CÔTIÈRE Opportunités", "/services/opportunites"],
  ["Le RDV Des Événements", "/services/rdv"],
];

export default function Footer() {
  const [openSection, setOpenSection] = useState<string | null>("services");

  return (
    <footer className="relative overflow-hidden">
      {/* Background premium */}
      <div className="absolute inset-0 bg-[#020617]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0c4a6e]/95 via-[#0b3f5c] to-[#020617]" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/60 to-transparent" />

      {/* Halo */}
      <div className="absolute -bottom-20 -right-20 w- h- sm:w- sm:h- bg-[#c9a84c]/10 rounded-full blur- pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-10 sm:pt-14 pb-8">
          {/* Mobile brand */}
          <div className="lg:hidden text-center mb-8">
            <img
              src="/Images/cotiere-media-group.png"
              alt="COTIERE MEDIA GROUP"
              className="h-12 mx-auto mb-3"
            />
            <p className="inline-flex items-center gap-1.5 text- text-[#c9a84c] px-3 py-1 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/20">
              1er site officiel du littoral ivoirien
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Brand Desktop */}
            <div className="hidden lg:block lg:col-span-4">
              <img
                src="/Images/cotiere-media-group.png"
                alt="COTIERE"
                className="h-14 mb-4"
              />
              <p className="text-white/60 text-sm mb-5 max-w- leading-relaxed">
                Le groupe multimédia qui valorise les 13 villes du littoral ivoirien.
              </p>
              <div className="flex gap-2">
                <a href="https://facebook.com" target="_blank" aria-label="Facebook"
                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-[#c9a84c] border border-white/10 flex items-center justify-center text-white/70 hover:text-black transition-all">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
                <a href="https://instagram.com" target="_blank" aria-label="Instagram"
                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-[#c9a84c] border border-white/10 flex items-center justify-center text-white/70 hover:text-black transition-all">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/></svg>
                </a>
              </div>
            </div>

            {/* Services & Links */}
            <div className="lg:col-span-8">
              {/* Mobile Accordion */}
              <div className="lg:hidden">
                <button
                  onClick={() => setOpenSection(openSection === "services"? null : "services")}
                  className="w-full flex items-center justify-between py-3 border-b border-white/10"
                >
                  <span className="text-white font-semibold text- uppercase tracking-wider">Nos Services</span>
                  <ChevronDown size={18} className={`text-[#c9a84c] transition-transform ${openSection === "services"? "rotate-180" : ""}`} />
                </button>

                {openSection === "services" && (
                  <div className="py-3 grid grid-cols-1 gap-2">
                    {services.map(([label, href]) => (
                      <Link key={href} href={href} className="flex items-center gap-2 py-2 text-white/70 active:text-[#c9a84c] text-">
                        <ArrowRight size={14} className="text-[#c9a84c]/60" />
                        {label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Desktop Grid */}
              <div className="hidden lg:grid grid-cols-3 gap-8">
                <div>
                  <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-3 h-0.5 bg-[#c9a84c]"/>Services
                  </h4>
                  <div className="space-y-2.5">
                    {services.slice(0, 4).map(([label, href]) => (
                      <Link key={href} href={href} className="block text-white/60 hover:text-[#c9a84c] text- transition-colors">
                        {label}
                      </Link>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-4 opacity-0">.</h4>
                  <div className="space-y-2.5">
                    {services.slice(4, 8).map(([label, href]) => (
                      <Link key={href} href={href} className="block text-white/60 hover:text-[#c9a84c] text- transition-colors">
                        {label}
                      </Link>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-3 h-0.5 bg-[#c9a84c]"/>Contact
                  </h4>
                  <div className="space-y-3">
                    <a href="tel:+2250747722931" className="flex items-center gap-2.5 group">
                      <div className="w-8 h-8 rounded-lg bg-[#c9a84c]/15 flex items-center justify-center group-hover:bg-[#c9a84c]/25 transition-colors">
                        <Phone size={14} className="text-[#c9a84c]" />
                      </div>
                      <span className="text-white/80 text- group-hover:text-white">07 47 72 29 31</span>
                    </a>
                    <a href="https://wa.me/2250747722931" target="_blank" className="flex items-center gap-2.5 group">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                        <MessageCircle size={14} className="text-white/70" />
                      </div>
                      <span className="text-white/80 text- group-hover:text-white">WhatsApp 24h/7</span>
                    </a>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                        <MapPin size={14} className="text-white/50" />
                      </div>
                      <span className="text-white/60 text-">Littoral Ivoirien</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Contact Bar */}
          <div className="lg:hidden grid grid-cols-3 gap-2.5 mt-6 pt-6 border-t border-white/5">
            <a href="tel:+2250747722931" className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/[0.03] active:bg-white/10 border border-white/5">
              <Phone size={18} className="text-[#c9a84c]" />
              <span className="text- text-white/60">Appeler</span>
            </a>
            <a href="https://wa.me/2250747722931" target="_blank" className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/[0.03] active:bg-white/10 border border-white/5">
              <MessageCircle size={18} className="text-[#c9a84c]" />
              <span className="text- text-white/60">WhatsApp</span>
            </a>
            <Link href="/reservation" className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-[#c9a84c]/15 active:bg-[#c9a84c]/25 border border-[#c9a84c]/20">
              <ArrowRight size={18} className="text-[#c9a84c]" />
              <span className="text- text-[#c9a84c]">Réserver</span>
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-white/40 text- sm:text-xs order-2 sm:order-1">
              © {new Date().getFullYear()} <span className="text-[#c9a84c] font-medium">CÔTIÈRE MEDIA GROUP</span> · Tous droits réservés
            </p>
            <div className="flex items-center gap-1.5 order-1 sm:order-2">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-white/50 text-">En ligne</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}