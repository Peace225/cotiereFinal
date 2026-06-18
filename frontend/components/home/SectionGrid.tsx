"use client";

import PropertyCard from "./PropertyCard";
import type { Room } from "@prisma/client";

interface SectionGridProps {
  title: string;
  data: Room[];
  seeAllHref?: string; // pour rendre le bouton utile
}

export default function SectionGrid({ title, data, seeAllHref = "#" }: SectionGridProps) {
  if (!data?.length) return null;

  return (
    <section className="w-full">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="!text-[18px] md:!text-[20px] font-bold text-slate-900 tracking-tight">
          {title}
        </h2>
        
        <a href={seeAllHref} className="text-xs font-bold text-[#003b95] hover:underline transition-colors">
          Voir tout
        </a>
      </div>

      {/* --- LE CARROUSEL EST ICI --- */}
      {/* flex et overflow-x-auto créent le défilement horizontal */}
      {/* Les classes bizarres à la fin servent à cacher la barre de défilement pour un look plus "app natif" */}
      <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {data.map((property) => (
          <PropertyCard key={property.id} item={property} />
        ))}
      </div>
    </section>
  );
}