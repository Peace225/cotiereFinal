"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, UserCircle, ArrowRight } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Camera, Waves, Hotel, Music, Package, Tv, ShoppingCart, FileText, Building2, Briefcase, CalendarDays } from "lucide-react";
import { useCart } from "@/components/frontend/CartContext";

const services = [
  { label: "COTIERE HBL Studio+",                    href: "/services/studio",        Icon: Camera },
  { label: "COTIERE Tourisme et Voyage",              href: "/services/tourisme",      Icon: Waves },
  { label: "COTIERE Hebergement et Restauration",     href: "/services/hebergement",   Icon: Hotel },
  { label: "COTIERE Music et Management",             href: "/services/music",         Icon: Music },
  { label: "Guichet Unique Evenementiel Audiovisuel", href: "/services/location",      Icon: Package },
  { label: "COTIERE MEDIAS",                          href: "/services/medias",        Icon: Tv },
  { label: "COTIERE Market et Distribution",          href: "/services/market",        Icon: ShoppingCart },
  { label: "Tout Le Monde A Droit A La Pub",          href: "/services/afrouba",       Icon: FileText },
  { label: "COTIERE Collectivites",                   href: "/services/collectivites", Icon: Building2 },
  { label: "COTIERE Opportunites",                    href: "/services/opportunites",  Icon: Briefcase },
  { label: "Le RDV Des Evenements A Venir",           href: "/services/rdv",           Icon: CalendarDays },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropOpen, setDropOpen]     = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const { data: session }           = useSession();
  const pathname                    = usePathname();
  const { cartCount }               = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); setDropOpen(false); }, [pathname]);

  const accountHref = session ? "/mon-espace" : "/connexion";

  return (
    <>
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100"
            : "bg-[#0c4a6e]/90 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            <Link href="/" className="flex items-center shrink-0">
              <img src="/Images/cotiere-media-group.png" alt="COTIERE MEDIA GROUP"
                className="h-10 w-auto object-contain rounded-lg border-2 border-[#c9a84c] p-0.5" />
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {[
                { label: "Accueil",  href: "/" },
                { label: "A propos", href: "/a-propos" },
                { label: "Contact",  href: "/contact" },
              ].map(({ label, href }) => (
                <Link key={href} href={href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === href ? "text-[#c9a84c]"
                      : scrolled ? "text-gray-600 hover:text-[#0c4a6e] hover:bg-gray-50"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}>
                  {label}
                </Link>
              ))}

              <div
                className="relative"
                onMouseEnter={() => setDropOpen(true)}
                onMouseLeave={() => setDropOpen(false)}
              >
                <button
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    scrolled ? "text-gray-600 hover:text-[#0c4a6e] hover:bg-gray-50"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  Services
                  <ChevronDown size={14} className={`transition-transform duration-200 ${dropOpen ? "rotate-180" : ""}`} />
                </button>

                {dropOpen && (
                  <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 max-h-[80vh] overflow-y-auto">
                    <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 pt-1">Nos services</p>
                    {services.map((s) => (
                      <Link
                        key={s.href}
                        href={s.href}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#faf8f4] hover:text-[#c9a84c] transition-colors group"
                      >
                        <s.Icon size={15} className="text-gray-400 group-hover:text-[#c9a84c] shrink-0" />
                        <span className="font-medium leading-tight">{s.label}</span>
                        <ArrowRight size={12} className="ml-auto shrink-0 opacity-0 group-hover:opacity-100 text-[#c9a84c] transition-opacity" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-3">
              <Link href="/services/market"
                className="relative flex items-center justify-center w-9 h-9 rounded-lg transition-colors text-[#c9a84c] hover:bg-[#c9a84c]/10"
                aria-label="Panier">
                <ShoppingCart size={19} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>
              <Link href={accountHref}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors px-3 py-2 rounded-lg ${
                  scrolled ? "text-gray-600 hover:text-[#0c4a6e] hover:bg-gray-50"
                  : "text-white/80 hover:text-white hover:bg-white/10"
                }`}>
                <UserCircle size={17} />
                {session ? "Mon espace" : "Connexion"}
              </Link>
              <Link href="/reservation" className="btn-primary text-sm py-2 px-5">Reserver</Link>
            </div>

            <button
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                scrolled ? "text-gray-700 hover:bg-gray-100" : "text-white hover:bg-white/10"
              }`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${mobileOpen ? "visible" : "invisible"}`}>
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${mobileOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setMobileOpen(false)}
        />
        <div className={`absolute top-0 right-0 h-full w-80 max-w-[90vw] bg-white shadow-2xl transition-transform duration-300 flex flex-col ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <img src="/Images/cotiere-media-group.png" alt="COTIERE MEDIA GROUP"
              className="h-9 w-auto object-contain rounded-lg border-2 border-[#c9a84c] p-0.5" />
            <button onClick={() => setMobileOpen(false)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
            {[{ label: "Accueil", href: "/" }, { label: "A propos", href: "/a-propos" }, { label: "Contact", href: "/contact" }].map(({ label, href }) => (
              <Link key={href} href={href}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  pathname === href ? "bg-[#faf8f4] text-[#c9a84c]" : "text-gray-700 hover:bg-gray-50"
                }`}>
                {label}
              </Link>
            ))}
            <div className="pt-2 pb-1">
              <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Nos services</p>
              {services.map((s) => (
                <Link key={s.href} href={s.href}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-[#faf8f4] hover:text-[#c9a84c] transition-colors">
                  <s.Icon size={14} className="text-gray-400 shrink-0" />
                  {s.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="px-4 py-4 border-t border-gray-100 space-y-2">
            <Link href={accountHref}
              className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <UserCircle size={18} className="text-[#0c4a6e]" />
              {session ? "Mon espace" : "Se connecter"}
            </Link>
            <Link href="/reservation" className="btn-primary w-full justify-center">Reserver maintenant</Link>
          </div>
        </div>
      </div>

      <div className="h-16 lg:h-16" />
    </>
  );
}
