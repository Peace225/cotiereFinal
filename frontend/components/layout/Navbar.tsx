"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Menu, X, UserCircle, HelpCircle, ShoppingCart, 
  Bed, Camera, Plane, Handshake, Newspaper, 
  Music, Tv, Briefcase, CalendarDays, FileText, Building2,
  LogIn, UserPlus
} from "lucide-react";
import { useCart } from "@/components/frontend/CartContext";

const services = [
  { label: "Séjours", href: "/services/sejours", Icon: Bed },
  { label: "HBL Studio+", href: "/services/studio", Icon: Camera },
  { label: "Tourisme & Voyage", href: "/services/tourisme", Icon: Plane },
  { label: "Partenaires Événementiels", href: "/services/evenements", Icon: Handshake },
  { label: "Cotier Info+", href: "/services/info", Icon: Newspaper },
  { label: "Music & Management", href: "/services/music", Icon: Music },
  { label: "Médias", href: "/services/medias", Icon: Tv },
  { label: "Market & Distribution", href: "/services/market", Icon: ShoppingCart },
  { label: "100% Pub", href: "/services/afrouba", Icon: FileText },
  { label: "Collectivités", href: "/services/collectivites", Icon: Building2 },
  { label: "Opportunités", href: "/services/opportunites", Icon: Briefcase },
  { label: "Agenda", href: "/services/rdv", Icon: CalendarDays },
];

export default function Navbar({ session }: { session?: any }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { cartCount } = useCart();

  // Ferme le menu mobile automatiquement lors d'un changement de page
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <>
      {/* STYLE CSS POUR UNE JOLIE BARRE DE DÉFILEMENT */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #c9a84c; /* Couleur dorée au survol */
        }
      `}} />

      <nav className="bg-[#003b95] text-white w-full z-50 shadow-xl transition-all duration-300 relative">
        
        {/* ================= TOP HEADER (Devise, Drapeau, Authentification & Panier) ================= */}
        <div className="bg-[#002e7a]/50 border-b border-white/5 py-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 text-xs font-bold tracking-wide">
            
            {/* Devise & Drapeau */}
            <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-xl border border-white/10 shrink-0">
              <button className="hover:bg-white/10 px-1 rounded transition-colors">XOF</button>
              <span className="w-[1px] h-3 bg-white/20" />
              <button className="flex items-center justify-center">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/f/fe/Flag_of_C%C3%B4te_d%27Ivoire.svg" 
                  alt="CI" 
                  className="w-5 h-3.5 object-cover rounded-sm shadow-sm"
                />
              </button>
            </div>

            {/* Icônes Haut : Compte / S'inscrire / Panier / Aide */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button className="hover:bg-white/10 p-1.5 rounded-full transition-colors flex items-center justify-center text-white/80 hover:text-white" aria-label="Aide">
                <HelpCircle size={18} strokeWidth={2} />
              </button>

              {!session ? (
                <>
                  <Link 
                    href="/inscription" 
                    title="S'inscrire" 
                    className="bg-white text-[#003b95] text-[10px] sm:text-xs font-black px-2.5 py-1.5 rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-sm flex items-center gap-1"
                  >
                    <UserPlus size={14} />
                    <span className="hidden sm:inline">S'inscrire</span>
                  </Link>
                  <Link 
                    href="/connexion" 
                    title="Se connecter" 
                    className="bg-white/10 border border-white/20 text-[10px] sm:text-xs font-bold px-2.5 py-1.5 rounded-xl hover:bg-white/20 transition-all duration-300 flex items-center gap-1"
                  >
                    <LogIn size={14} />
                    <span className="hidden sm:inline">Connexion</span>
                  </Link>
                </>
              ) : (
                <Link 
                  href="/mon-espace" 
                  className="flex items-center gap-1 bg-[#c9a84c] text-white text-[10px] sm:text-xs font-black px-3 py-1.5 rounded-xl hover:bg-[#b59744] transition-all duration-300"
                >
                  <UserCircle size={16} />
                  <span className="hidden sm:inline">Espace</span>
                </Link>
              )}

              <Link href="/cart" className="relative ml-1 hover:bg-white/10 p-1.5 rounded-full transition-colors text-white/80 hover:text-white">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-extrabold rounded-full w-3.5 h-3.5 flex items-center justify-center border border-[#003b95]">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>
            </div>

          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* ================= MAIN NAVBAR (Logo & Menu Burger) ================= */}
          <div className="flex items-center justify-between py-3">
            
            {/* Logo et Nom (Visible sur tous les écrans) */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 shrink-0 group">
              <img 
                src="/Images/cotiere-media-group.png" 
                alt="CÔTIÈRE MEDIA GROUP"
                className="h-9 md:h-11 w-auto object-contain rounded-lg border border-[#c9a84c]/50 p-1 bg-white/5 group-hover:scale-105 group-hover:border-[#c9a84c] transition-all duration-300" 
              />
              <span className="block text-xs sm:text-sm md:text-base font-extrabold tracking-wider text-white group-hover:text-[#c9a84c] transition-colors duration-300 ml-1 md:ml-0">
                CÔTIÈRE <span className="text-[#c9a84c]">MEDIA</span> GROUP
              </span>
            </Link>

            {/* Menu Burger & Devenir partenaire */}
            <div className="flex items-center gap-2 md:gap-4">
              <Link href="/submit" className="hidden md:block text-xs font-bold hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-300 whitespace-nowrap">
                Devenir Partenaire
              </Link>

              {/* Bouton Menu Burger Principal (Actif sur tous les formats) */}
              <button 
                onClick={() => setMobileOpen(!mobileOpen)} 
                className="flex items-center gap-2 bg-white/10 border border-white/20 hover:bg-white/20 text-xs font-black px-4 py-2.5 rounded-xl transition-all duration-300 text-white shadow-sm"
                aria-label="Menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                <span className="hidden sm:inline">Menu Services</span>
              </button>
            </div>
          </div>

          {/* ================= SERVICES NAVIGATION (Optionnel / Liseré de navigation en attente) ================= */}
          <div className="hidden md:flex items-center gap-3 overflow-x-auto pb-2 pt-1 w-full custom-scrollbar scroll-smooth">
            {services.map((s) => {
              const isActive = pathname === s.href;
              return (
                <Link 
                  key={s.href} 
                  href={s.href}
                  className={`group flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 ease-out border-2 flex-shrink-0 text-xs ${
                    isActive 
                      ? "border-white bg-white/15 shadow-[0_0_20px_rgba(255,255,255,0.15)]" 
                      : "border-transparent hover:border-white/50 hover:bg-white/10"
                  }`}
                >
                  <s.Icon 
                    size={16} 
                    strokeWidth={isActive ? 2.5 : 2} 
                    className={`transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`} 
                  />
                  <span className={`tracking-wide ${isActive ? "font-bold" : "font-medium"}`}>
                    {s.label}
                  </span>
                </Link>
              );
            })}
          </div>

        </div>
      </nav>

      {/* ================= MOBILE MENU (Tiroir coulissant) ================= */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${mobileOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
        {/* Overlay d'arrière-plan semi-transparent */}
        <div className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${mobileOpen ? "opacity-100" : "opacity-0"}`} onClick={() => setMobileOpen(false)} />
        
        {/* Tiroir menu - Conteneur principal forcé en hauteur et flexbox */}
        <div className={`absolute top-0 right-0 h-full max-h-screen w-[85vw] max-w-sm bg-[#003b95] shadow-2xl transition-transform duration-300 flex flex-col text-white ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}>
          
          {/* En-tête du menu mobile */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between shrink-0">
            <h2 className="text-base font-black tracking-wider uppercase">Navigation</h2>
            <button onClick={() => setMobileOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X size={22} />
            </button>
          </div>

          {/* Liste des Services / Liens - Scrollable indépendamment */}
          <div className="flex-1 overflow-y-auto py-4 px-4 space-y-1 custom-scrollbar">
            <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider px-2 block mb-1">Nos Services</span>
            {services.map((s) => {
              const isActive = pathname === s.href;
              return (
                <Link 
                  key={s.href} 
                  href={s.href} 
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-xs ${
                    isActive ? "bg-white/20 font-black text-white" : "text-white/80 hover:bg-white/5 font-bold"
                  }`}
                >
                  <s.Icon size={18} className={isActive ? "text-white" : "text-white/70"} /> 
                  <span className="tracking-wide leading-snug">{s.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Devenir Partenaire positionné tout en bas des liens de service, fixé en bas du tiroir */}
          <div className="p-4 border-t border-white/10 bg-[#002e7a] shrink-0">
            <Link 
              href="/submit" 
              onClick={() => setMobileOpen(false)} 
              className="block w-full text-center bg-[#c9a84c] hover:bg-[#b59744] text-white text-xs font-black py-3.5 rounded-xl shadow-md transition-all duration-300"
            >
              Devenir Partenaire
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}