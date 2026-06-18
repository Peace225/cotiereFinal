"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, MapPin, ArrowRight, Heart, Check } from "lucide-react";

export default function ResultatsRecherche() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [categorieActive, setCategorieActive] = useState("Tous");

  // On récupère les paramètres
  const dest = searchParams.get("dest") || "Toutes les destinations";
  const adults = searchParams.get("adults") || "2";
  const rooms = searchParams.get("rooms") || "1";

  const categories = ["Tous", "Hôtel", "Excursion", "Événement", "Market"];

  useEffect(() => {
    // Si l'URL n'a pas de paramètres, on ne lance pas la recherche
    if (searchParams.toString().length === 0) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/recherche?${searchParams.toString()}`);
        const json = await res.json();
        setData(json.data || json || []);
      } catch (err) {
        console.error("Erreur recherche:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchParams]);

  // Si on n'a encore rien cherché, on ne retourne rien (la section reste invisible)
  if (searchParams.toString().length === 0) return null;

  const dataFiltree = categorieActive === "Tous" 
    ? data 
    : data.filter(item => item.type === categorieActive);

  if (loading) return (
    <div id="resultats-section" className="flex flex-col items-center justify-center min-h-[40vh] space-y-6 bg-gray-50 py-20">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-[#0071c2]/20 border-t-[#0071c2] rounded-full animate-spin" />
      </div>
      <p className="text-[#0071c2] font-bold text-lg animate-pulse">Recherche des meilleures offres...</p>
    </div>
  );

  return (
    <div id="resultats-section" className="min-h-screen bg-gray-50 pt-10 pb-20 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Titre des résultats */}
        <div className="mb-8">
          <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-2 tracking-tight">
            {dest} : {dataFiltree.length} {dataFiltree.length > 1 ? "établissements trouvés" : "établissement trouvé"}
          </h2>
          <p className="text-gray-500 font-medium text-sm flex items-center gap-3">
            <span>{adults} adultes</span>
            <span className="w-1 h-1 rounded-full bg-gray-400" />
            <span>{rooms} chambre(s)</span>
          </p>
        </div>

        {/* Barre de Filtres */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 flex gap-2 mb-8 overflow-x-auto custom-scrollbar relative z-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategorieActive(cat)}
              className={`px-6 py-3 rounded-lg text-sm font-bold transition-all whitespace-nowrap flex-1 md:flex-none ${
                categorieActive === cat 
                  ? "bg-[#febb02] text-gray-900 shadow-sm" 
                  : "bg-transparent text-gray-600 hover:bg-gray-50 hover:text-[#0071c2]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grille des résultats (identique au design Premium) */}
        {data.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center border border-gray-200 shadow-sm mt-8">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search size={32} className="text-[#0071c2]" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Aucun résultat trouvé</h3>
            <p className="text-gray-500 max-w-md mx-auto">Nous n'avons trouvé aucun établissement correspondant à vos critères. Essayez de modifier vos filtres ci-dessus.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dataFiltree.map((item) => (
              <div key={item.id} className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col relative">
                
                {/* Icône Favoris */}
                <button className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 hover:bg-white shadow-sm transition-colors">
                  <Heart size={20} />
                </button>

                {/* Image */}
                <div className="aspect-[4/3] bg-gray-100 overflow-hidden relative">
                  {item.image ? (
                    <img src={item.image} alt={item.titre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200 font-medium">Image non disponible</div>
                  )}
                  <div className="absolute top-4 left-4 bg-[#febb02] text-gray-900 text-xs font-black px-3 py-1.5 rounded uppercase tracking-widest shadow-md">
                    {item.type || "Service"}
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <h3 className="text-xl font-bold text-[#0071c2] group-hover:text-[#005999] transition-colors leading-tight line-clamp-2">
                      {item.titre}
                    </h3>
                    <div className="flex items-center gap-1.5 bg-[#003b95] text-white px-2 py-1 rounded-md shrink-0">
                      <span className="text-sm font-bold">{item.rating || "8.5"}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-sm font-medium text-[#0071c2] mb-3 hover:underline cursor-pointer w-fit">
                    <MapPin size={14} />
                    {item.destination || dest}
                  </div>

                  <p className="text-xs text-gray-600 line-clamp-2 mb-4 flex-1">
                    {item.description || "Un hébergement exceptionnel sur le littoral ivoirien."}
                  </p>

                  <div className="space-y-1 mb-4">
                    <div className="flex items-start gap-1.5 text-[11px] font-bold text-[#008009]">
                      <Check size={14} className="shrink-0 mt-0.5" /> Annulation GRATUITE
                    </div>
                    <div className="flex items-start gap-1.5 text-[11px] font-bold text-[#008009]">
                      <Check size={14} className="shrink-0 mt-0.5" /> Aucun prépaiement
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex flex-col items-end">
                    <span className="text-[11px] text-gray-500 mb-0.5">Prix pour {adults} adultes</span>
                    <div className="flex items-baseline gap-1 mb-3">
                      <span className="text-2xl font-black text-gray-900">{item.prix ? `${item.prix.toLocaleString('fr-FR')} FCFA` : "Sur devis"}</span>
                    </div>
                    
                    <Link href={`/services/${item.type?.toLowerCase() || 'hotel'}/${item.id}`} 
                      className="w-full bg-[#0071c2] hover:bg-[#005999] text-white text-sm font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-md">
                      Voir les disponibilités <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}