import Link from "next/link";
import { MapPin } from "lucide-react";

// Ta liste officielle des villes du littoral
const coastalCities = [
  { nom: "Abidjan", slug: "abidjan", img: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=800", colSpan: "md:col-span-2 lg:col-span-2", rowSpan: "md:row-span-2" },
  { nom: "Assinie Mafia", slug: "assinie-mafia", img: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?q=80&w=800", colSpan: "md:col-span-2 lg:col-span-2", rowSpan: "md:row-span-1" },
  { nom: "Grand-Bassam", slug: "grand-bassam", img: "https://images.unsplash.com/photo-1580983554030-9b626bb36c3e?q=80&w=800", colSpan: "md:col-span-1", rowSpan: "md:row-span-1" },
  { nom: "San Pedro", slug: "san-pedro", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800", colSpan: "md:col-span-1", rowSpan: "md:row-span-1" },
  { nom: "Grand-Béréby", slug: "grand-bereby", img: "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=800", colSpan: "md:col-span-1", rowSpan: "md:row-span-1" },
  { nom: "Sassandra", slug: "sassandra", img: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?q=80&w=800", colSpan: "md:col-span-1", rowSpan: "md:row-span-1" },
  { nom: "Tabou", slug: "tabou", img: "https://images.unsplash.com/photo-1498623116890-37e912163d5d?q=80&w=800", colSpan: "md:col-span-1", rowSpan: "md:row-span-1" },
  { nom: "Jacqueville", slug: "jacqueville", img: "https://images.unsplash.com/photo-1540202404-b7118816ab9b?q=80&w=800", colSpan: "md:col-span-1", rowSpan: "md:row-span-1" },
  { nom: "Grand-Lahou", slug: "grand-lahou", img: "https://images.unsplash.com/photo-1520113412646-dfb234b6b667?q=80&w=800", colSpan: "md:col-span-1", rowSpan: "md:row-span-1" },
  { nom: "Fresco", slug: "fresco", img: "https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?q=80&w=800", colSpan: "md:col-span-1", rowSpan: "md:row-span-1" },
  { nom: "Aboisso", slug: "aboisso", img: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=800", colSpan: "md:col-span-2 lg:col-span-2", rowSpan: "md:row-span-1" },
];

export default function DestinationsGrid() {
  return (
    <section className="w-full">
      {/* En-tête de section */}
      <div className="mb-8">
        <h2 className="!text-[18px] md:!text-[20px] font-black text-slate-900 tracking-tight">Destination Côtière</h2>
        <p className="text-slate-500 mt-2 font-medium text-sm">
          Découvrez nos résidences et restaurants dans les plus belles villes du littoral ivoirien.
        </p>
      </div>

      {/* Grille Bento Dynamique */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3 md:gap-4 auto-rows-[160px] md:auto-rows-[220px]">
        {coastalCities.map((ville) => (
          <Link 
            key={ville.slug}
            href={`/destinations/${ville.slug}`} 
            className={`group relative rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 block ${ville.colSpan || ""} ${ville.rowSpan || ""}`}
          >
            {/* Image d'arrière-plan avec zoom ultra-fluide */}
            <img 
              src={ville.img} 
              alt={ville.nom} 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
            />
            
            {/* Overlay sombre pour la lisibilité (Gradient) */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Contenu textuel */}
            <div className="absolute bottom-4 left-4 right-4 flex flex-col">
              <h3 className="text-white font-black !text-[18px] md:!text-[20px]l tracking-wide drop-shadow-lg truncate group-hover:text-amber-400 transition-colors">
                {ville.nom}
              </h3>
              <div className="flex items-center text-slate-200 text-xs md:text-sm mt-1 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                <MapPin size={14} className="mr-1" />
                <span>Voir les offres →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}