
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import {
  Menu,
  X,
  UserCircle,
  HelpCircle,
  ShoppingCart,
  Bed,
  Camera,
  Plane,
  Newspaper,
  Briefcase,
  CalendarDays,
  Building2,
  LogIn,
  UserPlus,
  Bus,
  ArrowUpRight,
  Sparkles,
  ChevronRight,
} from "lucide-react";

import { useCart } from "@/components/frontend/CartContext";

// ======================================================
// SERVICES CÔTIÈRE MEDIA GROUP
// ======================================================

const services = [
  {
    label: "Séjours",
    href: "/services/sejours",
    Icon: Bed,
  },
  {
    label: "HBL Studio+",
    href: "/services/studio",
    Icon: Camera,
  },
  {
    label: "Côtière Transport",
    href: "/services/transport",
    Icon: Bus,
  },
  {
    label: "Sites Touristiques",
    href: "/services/tourisme",
    Icon: Plane,
  },
  {
    label: "Cotier Info+",
    href: "/services/info",
    Icon: Newspaper,
  },
  {
    label: "Market & Distribution",
    href: "/services/market",
    Icon: ShoppingCart,
  },
  {
    label: "Annuaire des collectivités",
    href: "/services/collectivites",
    Icon: Building2,
  },
  {
    label: "Opportunités",
    href: "/services/opportunites",
    Icon: Briefcase,
  },
  {
    label: "Agenda",
    href: "/services/rdv",
    Icon: CalendarDays,
  },
];

type NavbarProps = {
  session?: unknown;
};

// ======================================================
// NAVBAR
// ======================================================

export default function Navbar({ session }: NavbarProps) {
  const pathname = usePathname();
  const { cartCount } = useCart();

  const [mobileOpen, setMobileOpen] = useState(false);

  // Fermer le menu après navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Fermer avec Escape et bloquer le scroll mobile
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

  // Détection du service actif
  const isActive = (href: string) => {
    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  };

  return (
    <>
      {/* ==================================================
          HEADER PRINCIPAL
      ================================================== */}

      <header
        className="
          sticky top-0 z-50
          w-full
          bg-[#003b95]
          text-white
          shadow-[0_8px_30px_rgba(0,30,90,0.18)]
        "
      >

        {/* ================================================
            TOP BAR
        ================================================ */}

        <div
          className="
            border-b border-white/10
            bg-[#002e7a]
          "
        >
          <div
            className="
              mx-auto max-w-7xl
              flex items-center justify-between
              gap-3
              px-4 py-2
              sm:px-6 lg:px-8
            "
          >

            {/* DEVISE + DRAPEAU */}

            <div
              className="
                flex shrink-0 items-center gap-2
                rounded-xl
                border border-white/10
                bg-white/5
                px-3 py-1.5
              "
            >
              <span className="text-xs font-bold tracking-wide">
                XOF
              </span>

              <span className="h-3 w-px bg-white/25" />

              <span
                role="img"
                aria-label="Côte d'Ivoire"
                className="text-base leading-none"
              >
                🇨🇮
              </span>
            </div>

            {/* ACTIONS UTILISATEUR */}

            <div className="flex items-center gap-1.5 sm:gap-2">

              {/* AIDE */}

              <Link
                href="/aide"
                aria-label="Aide"
                title="Centre d'aide"
                className="
                  flex items-center justify-center
                  rounded-full p-2
                  text-white/80
                  transition-all duration-300
                  hover:bg-white/10
                  hover:text-[#f5d98a]
                "
              >
                <HelpCircle size={18} />
              </Link>

              {/* AUTHENTIFICATION */}

              {!session ? (
                <>
                  {/* INSCRIPTION */}

                  <Link
                    href="/inscription"
                    title="S'inscrire"
                    className="
                      group flex items-center gap-1.5
                      rounded-xl
                      bg-white
                      px-3 py-2
                      text-[11px] font-black
                      text-[#003b95]
                      shadow-sm
                      transition-all duration-300
                      hover:-translate-y-0.5
                      hover:bg-[#f5d98a]
                    "
                  >
                    <UserPlus
                      size={15}
                      className="transition-transform group-hover:scale-110"
                    />

                    <span className="hidden sm:inline">
                      S'inscrire
                    </span>
                  </Link>

                  {/* CONNEXION */}

                  <Link
                    href="/connexion"
                    title="Se connecter"
                    className="
                      group flex items-center gap-1.5
                      rounded-xl
                      border border-white/20
                      bg-white/10
                      px-3 py-2
                      text-[11px] font-bold
                      transition-all duration-300
                      hover:border-[#c9a84c]/60
                      hover:bg-white/20
                      hover:text-[#f5d98a]
                    "
                  >
                    <LogIn
                      size={15}
                      className="transition-transform group-hover:scale-110"
                    />

                    <span className="hidden sm:inline">
                      Connexion
                    </span>
                  </Link>
                </>
              ) : (
                <Link
                  href="/mon-espace"
                  className="
                    flex items-center gap-2
                    rounded-xl
                    bg-gradient-to-r
                    from-[#b58b32]
                    to-[#f5d98a]
                    px-3 py-2
                    text-xs font-black
                    text-[#002e7a]
                    transition-all duration-300
                    hover:brightness-110
                  "
                >
                  <UserCircle size={17} />

                  <span className="hidden sm:inline">
                    Mon espace
                  </span>
                </Link>
              )}

              {/* PANIER */}

              <Link
                href="/cart"
                aria-label={`Panier : ${cartCount} articles`}
                title="Mon panier"
                className="
                  group relative ml-1
                  flex items-center justify-center
                  rounded-full p-2
                  text-white/90
                  transition-all duration-300
                  hover:bg-white/10
                  hover:text-[#f5d98a]
                "
              >
                <ShoppingCart
                  size={21}
                  className="transition-transform group-hover:scale-110"
                />

                {cartCount > 0 && (
                  <span
                    className="
                      absolute -right-1 -top-1
                      flex min-h-[17px] min-w-[17px]
                      items-center justify-center
                      rounded-full
                      border border-[#003b95]
                      bg-red-500
                      px-1
                      text-[9px] font-black
                      text-white
                    "
                  >
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>

            </div>
          </div>
        </div>

        {/* ================================================
            BARRE LOGO + PARTENAIRE + BURGER
        ================================================ */}

        <div className="mx-auto max-w-[1500px] px-3 sm:px-4 lg:px-6">

          <div
            className="
              flex min-h-[76px]
              items-center justify-between
              gap-3 py-3
            "
          >

            {/* LOGO */}

            <Link
              href="/"
              className="
                group flex min-w-0
                items-center gap-2.5
                sm:gap-3
              "
            >
              <div
                className="
                  relative shrink-0
                  overflow-hidden rounded-xl
                  border border-[#c9a84c]/50
                  bg-white/10
                  p-1.5
                  transition-all duration-300
                  group-hover:border-[#f5d98a]
                  group-hover:shadow-[0_0_20px_rgba(201,168,76,0.25)]
                "
              >
                <Image
                  src="/Images/cotiere-media-group.png"
                  alt="Côtière Media Group"
                  width={48}
                  height={48}
                  priority
                  className="
                    h-9 w-9 object-contain
                    sm:h-11 sm:w-11
                    transition-transform duration-300
                    group-hover:scale-105
                  "
                />
              </div>

              <div className="min-w-0">
                <span
                  className="
                    block text-xs
                    font-black tracking-wide
                    sm:text-sm md:text-base
                    text-white
                    transition-colors duration-300
                    group-hover:text-[#f5d98a]
                  "
                >
                  CÔTIÈRE{" "}
                  <span className="text-[#c9a84c]">
                    MEDIA
                  </span>{" "}
                  GROUP
                </span>

                <span
                  className="
                    hidden sm:block
                    text-[10px]
                    font-medium tracking-widest
                    text-white/50
                  "
                >
                  EXPLOREZ • DÉCOUVREZ • VIVEZ
                </span>
              </div>
            </Link>

            {/* ACTIONS À DROITE */}

            <div className="flex shrink-0 items-center gap-3">

              {/* ==========================================
                  BOUTON PARTENAIRE PREMIUM
              ========================================== */}

              <Link
                href="/submit"
                className="
                  group relative
                  hidden md:inline-flex
                  items-center justify-center
                  gap-2.5
                  overflow-hidden
                  whitespace-nowrap
                  rounded-full
                  bg-gradient-to-r
                  from-[#b58b32]
                  via-[#f7e2a1]
                  to-[#c9a84c]
                  bg-[length:200%_100%]
                  px-6 py-3.5
                  text-xs font-black
                  tracking-wide
                  text-[#142e52]
                  ring-1 ring-white/20
                  shadow-[0_5px_22px_rgba(201,168,76,0.35)]
                  transition-all duration-500
                  hover:-translate-y-0.5
                  hover:bg-right
                  hover:shadow-[0_10px_30px_rgba(201,168,76,0.55)]
                  active:scale-95
                "
              >
                {/* REFLET LUMINEUX */}

                <span
                  aria-hidden="true"
                  className="
                    pointer-events-none
                    absolute inset-y-0 -left-1/2
                    w-1/3
                    -skew-x-12
                    bg-gradient-to-r
                    from-transparent
                    via-white/50
                    to-transparent
                    transition-transform duration-700
                    group-hover:translate-x-[500%]
                  "
                />

                <Sparkles
                  size={17}
                  className="
                    relative z-10
                    transition-transform duration-300
                    group-hover:rotate-12
                    group-hover:scale-110
                  "
                />

                <span className="relative z-10">
                  Devenir partenaire
                </span>

                <ArrowUpRight
                  size={18}
                  className="
                    relative z-10
                    transition-transform duration-300
                    group-hover:-translate-y-0.5
                    group-hover:translate-x-0.5
                  "
                />
              </Link>

              {/* MENU BURGER MOBILE/TABLETTE */}

              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Ouvrir le menu des services"
                aria-expanded={mobileOpen}
                aria-controls="cotiere-mobile-menu"
                className="
                  group flex lg:hidden
                  items-center gap-2
                  rounded-xl
                  border border-[#c9a84c]/40
                  bg-white/10
                  px-3.5 py-3
                  text-white
                  shadow-sm
                  transition-all duration-300
                  hover:border-[#c9a84c]
                  hover:bg-white/20
                  hover:text-[#f5d98a]
                "
              >
                <Menu
                  size={22}
                  className="transition-transform group-hover:scale-110"
                />

                <span className="hidden sm:inline text-xs font-bold">
                  Nos services
                </span>
              </button>

            </div>
          </div>

          {/* ==============================================
              NAVIGATION DES SERVICES DESKTOP
              SANS CARTES NI BORDURES ARRONDIES
          ============================================== */}

          <nav
            aria-label="Navigation des services"
            className="
              hidden lg:grid
              w-full
              grid-cols-9
              items-stretch
              gap-2
              pb-4 pt-3
            "
          >
            {services.map((service) => {
              const active = isActive(service.href);
              const Icon = service.Icon;

              return (
                <Link
                  key={service.href}
                  href={service.href}
                  title={service.label}
                  aria-current={active ? "page" : undefined}
                  className={`
                    group relative
                    flex min-w-0
                    items-center justify-center
                    gap-1.5
                    px-1 py-3
                    text-center
                    text-[10px] xl:text-[11px]
                    font-semibold
                    leading-tight
                    transition-all duration-300
                    ${
                      active
                        ? "text-[#f5d98a]"
                        : "text-white/85 hover:text-[#f5d98a]"
                    }
                  `}
                >
                  {/* ICÔNE */}

                  <Icon
                    size={17}
                    strokeWidth={active ? 2.5 : 2}
                    className="
                      shrink-0
                      transition-transform duration-300
                      group-hover:scale-110
                    "
                  />

                  {/* TEXTE */}

                  <span className="min-w-0 whitespace-normal">
                    {service.label}
                  </span>

                  {/* SOULIGNEMENT DORÉ */}

                  <span
                    aria-hidden="true"
                    className={`
                      absolute bottom-0 left-1/2
                      h-[2px]
                      -translate-x-1/2
                      rounded-full
                      bg-[#c9a84c]
                      transition-all duration-300
                      ${
                        active
                          ? "w-3/4"
                          : "w-0 group-hover:w-3/4"
                      }
                    `}
                  />
                </Link>
              );
            })}
          </nav>

        </div>
      </header>

      {/* ==================================================
          MENU MOBILE / TABLETTE
      ================================================== */}

      <div
        id="cotiere-mobile-menu"
        aria-hidden={!mobileOpen}
        className={`
          fixed inset-0 z-[100]
          lg:hidden
          transition-[visibility,opacity] duration-300
          ${
            mobileOpen
              ? "visible opacity-100"
              : "invisible opacity-0 pointer-events-none"
          }
        `}
      >

        {/* OVERLAY */}

        <button
          type="button"
          aria-label="Fermer le menu"
          tabIndex={mobileOpen ? 0 : -1}
          onClick={() => setMobileOpen(false)}
          className="
            absolute inset-0
            bg-slate-950/65
            backdrop-blur-sm
          "
        />

        {/* TIROIR */}

        <aside
          role="dialog"
          aria-modal={mobileOpen}
          aria-label="Navigation des services"
          inert={!mobileOpen}
          className={`
            absolute inset-y-0 right-0
            flex h-full
            w-[88vw] max-w-sm
            flex-col
            bg-[#003b95]
            text-white
            shadow-2xl
            transition-transform duration-300
            ${
              mobileOpen
                ? "translate-x-0"
                : "translate-x-full"
            }
          `}
        >

          {/* HEADER DU TIROIR */}

          <div
            className="
              flex shrink-0
              items-center justify-between
              border-b border-white/10
              bg-[#002e7a]
              p-5
            "
          >
            <div>
              <h2 className="text-base font-black tracking-wide">
                CÔTIÈRE{" "}
                <span className="text-[#c9a84c]">
                  MEDIA
                </span>
              </h2>

              <p className="mt-1 text-[10px] tracking-widest text-white/50">
                NOS SERVICES
              </p>
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Fermer le menu"
              className="
                rounded-full
                border border-white/15
                bg-white/10
                p-2.5
                transition-all duration-300
                hover:rotate-90
                hover:bg-white/20
              "
            >
              <X size={21} />
            </button>
          </div>

          {/* SERVICES MOBILE */}

          <nav
            aria-label="Services mobiles"
            className="
              flex-1
              space-y-2
              overflow-y-auto
              overscroll-contain
              px-4 py-5
              [scrollbar-width:thin]
              [scrollbar-color:#c9a84c_transparent]
            "
          >
            <p
              className="
                mb-4 px-3
                text-[11px] font-black
                uppercase tracking-[0.2em]
                text-[#c9a84c]
              "
            >
              Explorez nos services
            </p>

            {services.map((service) => {
              const active = isActive(service.href);
              const Icon = service.Icon;

              return (
                <Link
                  key={service.href}
                  href={service.href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`
                    group flex items-center
                    gap-3 rounded-xl
                    border px-4 py-3.5
                    text-xs font-semibold
                    transition-all duration-300
                    ${
                      active
                        ? "border-[#c9a84c]/70 bg-[#c9a84c] text-[#002e7a] shadow-lg"
                        : "border-white/10 bg-white/5 text-white/85 hover:border-[#c9a84c]/50 hover:bg-white/10 hover:text-[#f5d98a]"
                    }
                  `}
                >
                  <div
                    className={`
                      flex h-9 w-9 shrink-0
                      items-center justify-center
                      rounded-lg
                      ${
                        active
                          ? "bg-[#002e7a]/10"
                          : "bg-white/10"
                      }
                    `}
                  >
                    <Icon
                      size={19}
                      className="
                        transition-transform duration-300
                        group-hover:scale-110
                      "
                    />
                  </div>

                  <span className="flex-1 leading-snug">
                    {service.label}
                  </span>

                  <ChevronRight
                    size={17}
                    className="
                      opacity-50
                      transition-all duration-300
                      group-hover:translate-x-1
                      group-hover:opacity-100
                    "
                  />
                </Link>
              );
            })}
          </nav>

          {/* BOUTON PARTENAIRE MOBILE */}

          <div
            className="
              shrink-0
              border-t border-white/10
              bg-[#002e7a]
              p-4
              pb-[max(1rem,env(safe-area-inset-bottom))]
            "
          >
            <Link
              href="/submit"
              onClick={() => setMobileOpen(false)}
              className="
                group relative
                flex w-full
                items-center justify-center
                gap-2.5
                overflow-hidden
                rounded-xl
                bg-gradient-to-r
                from-[#b58b32]
                via-[#f7e2a1]
                to-[#c9a84c]
                px-5 py-4
                text-sm font-black
                text-[#002e7a]
                shadow-[0_6px_22px_rgba(201,168,76,0.35)]
                transition-all duration-300
                hover:brightness-110
                hover:shadow-[0_8px_28px_rgba(201,168,76,0.5)]
                active:scale-[0.98]
              "
            >
              <Sparkles
                size={18}
                className="
                  transition-transform duration-300
                  group-hover:rotate-12
                "
              />

              <span>Devenir partenaire</span>

              <ArrowUpRight
                size={18}
                className="
                  transition-transform duration-300
                  group-hover:translate-x-1
                  group-hover:-translate-y-0.5
                "
              />
            </Link>

            <p className="mt-3 text-center text-[10px] text-white/50">
              Rejoignez notre réseau de partenaires
            </p>
          </div>

        </aside>
      </div>
    </>
  );
}
