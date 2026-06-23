"use client";

import Link from "next/link";
import { Star, MapPin, Heart, Utensils } from "lucide-react";

export default function RestaurantCard({ restaurant }: { restaurant: any }) {
  if (!restaurant) return null;

  const imageSrc = restaurant.image || "/Images/default-restaurant.jpg";
  const titre = restaurant.nom || restaurant.name || "Restaurant partenaire";
  const note = restaurant.note || "4.8";

  return (
    <Link
      href={`/restaurants/${restaurant.slug || restaurant.id}`}
      // ⚠️ AJOUT ICI : w-[200px] md:w-[220px] shrink-0 snap-start
      className="group flex flex-col h-full w-[200px] md:w-[220px] shrink-0 snap-start bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-[#c9a84c]/50 transition-all duration-300"
    >
      {/* ZONE IMAGE (Le ratio 4/3 s'adapte automatiquement à la nouvelle largeur) */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 shrink-0">
        <img
          src={imageSrc}
          alt={titre}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />

        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-slate-800 text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded shadow-sm flex items-center gap-1">
          <Utensils size={10} className="text-[#c9a84c]" />
          <span>{restaurant.categorie || "Gastronomie"}</span>
        </div>

        <button
          onClick={(e) => e.preventDefault()}
          className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-all z-10"
        >
          <Heart size={12} className="text-slate-400 hover:text-red-500 transition-colors" />
        </button>
      </div>

      <div className="p-3 flex flex-col flex-grow">

        {/* H3 RÉDUIT */}
        <h3 className="!text-[12px] md:!text-[13px] font-semibold text-slate-900 leading-snug line-clamp-2 mb-1 group-hover:text-[#c9a84c] transition-colors">
          {titre}
        </h3>

        {/* P LOCALISATION RÉDUIT */}
        <p className="!text-[10px] text-slate-500 mb-2.5 flex items-center truncate">
          <MapPin size={10} className="mr-1 text-[#003b95] shrink-0" />
          <span className="truncate">{restaurant.ville || "Abidjan"}</span>
        </p>

        {/* PIED DE CARTE */}
        <div className="mt-auto pt-2.5 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center text-amber-400 bg-amber-50 px-1.5 py-0.5 rounded">
            <Star size={10} fill="currentColor" />
            <span className="text-[10px] font-bold text-amber-700 ml-1">{note}</span>
          </div>

          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
            {restaurant.prix || "Sur devis"}
          </span>
        </div>

      </div>
    </Link>
  );
}