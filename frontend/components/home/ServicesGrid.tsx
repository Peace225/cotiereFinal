"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const categories = [
  // L'URL pointe maintenant vers la page de recherche avec le paramètre de filtre
  { title: "Hôtels", desc: "20 juin-1er juil., 2 adultes", href: "/recherche?type=hotel", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80", count: "53 disponibles" },
  { title: "Résidences meublées", desc: "20 juin-1er juil., 2 adultes", href: "/recherche?type=residence", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80", count: "150 disponibles" },
  { title: "Restaurants & Gastronomie", desc: "Réservez votre table", href: "/recherche?type=restaurant", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80", count: "45 ouverts" },
  { title: "Complexes hôteliers", desc: "20 juin-1er juil., 2 adultes", href: "/recherche?type=complexe", image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80", count: "12 disponibles" },
  { title: "Villas privées", desc: "20 juin-1er juil., 2 adultes", href: "/recherche?type=villa", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80", count: "7 disponibles" },
  { title: "Studios HBL+", desc: "Production photo & vidéo", href: "/recherche?type=studio", image: "/images/hbl.png", count: "3 studios" },
];

export default function ServicesGridPremium() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -280 : 280,
        behavior: "smooth"
      });
    }
  };

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">

        <div className="mb-3">
          {/* h2 ultra-minimaliste conservé selon tes réglages */}
          <h2 className="!text-[18px] md:!text-[20px] font-bold text-slate-900">
            Abidjan : recherchez par type d'établissement
          </h2>
        </div>

        <div className="relative group">
          <button
            onClick={() => scroll("left")}
            className="absolute -left-3 top-[38%] -translate-y-1/2 z-10 p-1 bg-white/90 backdrop-blur rounded-full shadow border border-slate-200 text-slate-600 hover:text-[#003b95] opacity-0 group-hover:opacity-100 hidden md:flex transition-all"
            aria-label="Gauche"
          >
            <ChevronLeft size={14} strokeWidth={2.5} />
          </button>

          <div
            ref={scrollRef}
            className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {categories.map((cat) => (
              <Link
                href={cat.href}
                key={cat.title}
                className="snap-start shrink-0 w-[210px] md:w-[230px] group"
              >
                <div className="flex flex-col">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-slate-100">
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="pt-1.5">
                    {/* h3 ultra-fin conservé */}
                    <h3 className="!text-[14px] font-medium text-slate-900 leading-tight">
                      {cat.title}
                    </h3>
                    <p className="text-[12px] text-slate-500 leading-snug mt-0.5 line-clamp-1">
                      {cat.desc}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1 font-medium uppercase tracking-wide">
                      {cat.count}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute -right-3 top-[38%] -translate-y-1/2 z-10 p-1 bg-white/90 backdrop-blur rounded-full shadow border border-slate-200 text-slate-600 hover:text-[#003b95] opacity-0 group-hover:opacity-100 hidden md:flex transition-all"
            aria-label="Droite"
          >
            <ChevronRight size={14} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </section>
  );
}