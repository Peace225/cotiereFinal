"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const fallbackCategories = [
  { title: "Hôtels", desc: "20 juin-1er juil., 2 adultes", href: "/recherche?type=hotel", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80", count: "53 DISPONIBLES" },
  { title: "Résidences meublées", desc: "20 juin-1er juil., 2 adultes", href: "/recherche?type=residence", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80", count: "150 DISPONIBLES" },
  { title: "Restaurants & Gastronomie", desc: "Réservez votre table", href: "/recherche?type=restaurant", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80", count: "45 OUVERTS" },
  { title: "Complexes hôteliers", desc: "20 juin-1er juil., 2 adultes", href: "/recherche?type=complexe", image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80", count: "12 DISPONIBLES" },
  { title: "Villas privées", desc: "20 juin-1er juil., 2 adultes", href: "/recherche?type=villa", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80", count: "7 DISPONIBLES" },
  { title: "Studios HBL+", desc: "Production photo & vidéo", href: "/recherche?type=studio", image: "/images/hbl.png", count: "3 ST" },
];

export default function ServicesGridPremium() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState(fallbackCategories);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => {
        if (d.data?.length) {
          setCategories(
            d.data.map((c: any) => ({
              title: c.title,
              desc: c.description || "",
              href: c.href || `/recherche?type=${c.type}`,
              image: c.images?.[0] || c.image,
              count: (c.count_text || "").toUpperCase(),
            }))
          );
        }
      });
  }, []);

  const scroll = (direction: "left" | "right") => {
    const scrollAmount = 276; // Largeur de la carte + gap
    scrollRef.current?.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
  };

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="mb-4">
          <h2 className="text-xl! md:text-2xl! font-bold text-[#1a1a1a]">
            Abidjan : recherchez par type d'établissement
          </h2>
        </div>

        <div className="relative group">
          {/* Bouton Gauche */}
          <button 
            onClick={() => scroll("left")} 
            className="absolute -left-4 top-[35%] -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.15)] border border-slate-100 text-slate-700 hover:text-black opacity-0 group-hover:opacity-100 hidden md:flex transition-all hover:scale-105"
          >
            <ChevronLeft size={20} strokeWidth={2} />
          </button>

          {/* Container Scrollable */}
          <div 
            ref={scrollRef} 
            className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {categories.map((cat) => (
              <Link href={cat.href} key={cat.title} className="snap-start shrink-0 w-[260px] group cursor-pointer block">
                <div className="flex flex-col">
                  {/* Image Container avec ratio */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-100">
                    <img 
                      src={cat.image} 
                      alt={cat.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                    />
                  </div>
                  
                  {/* Textes alignés à gauche */}
                  <div className="pt-3">
                    <h3 className="text-base! font-bold text-slate-900 leading-tight">
                      {cat.title}
                    </h3>
                    <p className="text-sm! text-slate-500 leading-snug mt-1 line-clamp-1">
                      {cat.desc}
                    </p>
                    <p className="text-xs! text-slate-400 mt-1 font-semibold uppercase tracking-wider">
                      {cat.count}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Bouton Droite */}
          <button 
            onClick={() => scroll("right")} 
            className="absolute -right-4 top-[35%] -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.15)] border border-slate-100 text-slate-700 hover:text-black opacity-0 group-hover:opacity-100 hidden md:flex transition-all hover:scale-105"
          >
            <ChevronRight size={20} strokeWidth={2} />
          </button>
        </div>
      </div>
    </section>
  );
}