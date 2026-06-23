"use client";

import Link from "next/link";
import { Heart, MapPin } from "lucide-react";

export default function PropertyCard({ item }: { item: any }) {
  if (!item) return null;

  const imageSrc = item.images && item.images.length > 0 
    ? item.images[0] 
    : "/Images/default-placeholder.jpg";
    
  const prix = item.pricePerNight || item.price || 0;
  const rating = item.rating || 8.9;

  return (
    <Link 
      href={`/hebergement/${item.slug || item.id}`} 
      // Ajout de w-[200px], shrink-0 et snap-start pour le carrousel
      className="group flex flex-col h-full bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-blue-300 transition-all duration-300 w-[200px] md:w-[220px] shrink-0 snap-start"
    >
      {/* ZONE IMAGE PLUS COMPACTE */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 shrink-0">
        <img 
          src={imageSrc} 
          alt={item.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        <button 
          onClick={(e) => e.preventDefault()} 
          className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur rounded-full shadow-sm hover:bg-white transition"
        >
          <Heart size={14} className="text-slate-400 hover:text-red-500" />
        </button>
      </div>

      {/* ZONE CONTENU RÉDUITE */}
      <div className="p-2.5 flex flex-col flex-grow">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold text-slate-900 !text-[11px] md:!text-[12px] line-clamp-2 leading-tight group-hover:text-blue-700 transition">
            {item.name}
          </h3>
          <div className="bg-[#003b95] text-white px-1 py-0.5 rounded text-[9px] font-bold shrink-0">
            {rating}
          </div>
        </div>

        <div className="flex items-center text-[9px] text-slate-500 mb-2 truncate">
          <MapPin size={10} className="mr-1 shrink-0 text-blue-500" />
          <span className="truncate">{item.ville || "Abidjan"}</span>
        </div>

        {/* PIED DE CARTE */}
        <div className="mt-auto pt-2 border-t border-slate-50 flex items-end justify-end">
          <div className="flex items-baseline gap-0.5">
            <span className="text-[13px] font-black text-slate-900">
              {prix.toLocaleString('fr-FR')} 
            </span>
            <span className="text-[9px] font-bold text-slate-600">XOF</span>
          </div>
        </div>
      </div>
    </Link>
  );
}