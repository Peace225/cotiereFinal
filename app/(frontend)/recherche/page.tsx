"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { MapPin, ChevronDown, Heart, Check, Star, Info, X, ChevronRight, Loader2, Building2 } from "lucide-react";

function ResultatsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [data, setData] = useState<any[]>([]);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  const initialType = searchParams.get("type") || "Tous";
  
  const normalizeText = (t: string) => {
    if (!t) return "";
    return t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  };

  const normalizeType = (t: string) => {
    const low = normalizeText(t);
    if (low.includes("hotel")) return "Hôtel";
    if (low.includes("residence")) return "Résidence";
    if (low.includes("villa")) return "Villa";
    return "Tous";
  };

  const [categorieActive, setCategorieActive] = useState(normalizeType(initialType));
  const dest = searchParams.get("dest") || "";
  const displayDest = dest || "La Côtière";
  const adults = searchParams.get("adults") || "2";

  const villesFiltres = [
    { nom: "Assinie-Mafia" },
    { nom: "San Pedro" },
    { nom: "Grand-Bassam" },
    { nom: "Jacqueville" },
    { nom: "Grand-Béréby" },
    { nom: "Sassandra" }
  ];

  const typeFiltres = [
    { nom: "Hôtel" },
    { nom: "Résidence" },
    { nom: "Villa" }
  ];

  const updateFiltersInUrl = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value) {
      params.delete(key);
      if (key === "type") params.delete("categorie");
    } else {
      params.set(key, value);
    }
    router.push(`/recherche?${params.toString()}`, { scroll: false });
  };

  const handleCityChange = (city: string) => {
    const isChecked = dest.toLowerCase() === city.toLowerCase();
    updateFiltersInUrl("dest", isChecked ? null : city);
  };

  const handleCategoryChange = (cat: string) => {
    const newValue = categorieActive === cat ? "Tous" : cat;
    setCategorieActive(newValue);
    const apiValue = newValue === "Tous" ? null : newValue.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ /g, "-");
    updateFiltersInUrl("type", apiValue);
  };

  useEffect(() => { 
    setCategorieActive(normalizeType(initialType)); 
  }, [initialType]);

  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);

      try {
        const res = await fetch("/api/categories", { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          const allItems = Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : []);

          let filtered = allItems.filter((item: any) => {
            if (item.isActive === false) return false;
            return true;
          });

          const currentType = searchParams.get("type");
          if (currentType && currentType.toLowerCase() !== "tous") {
            const cleanSearchType = normalizeText(currentType).replace(/-/g, " ");
            filtered = filtered.filter((item: any) => {
              const itemType = normalizeText(item.type || "");
              return itemType.includes(cleanSearchType);
            });
          }

          const currentDest = searchParams.get("dest");
          if (currentDest) {
            const cleanSearchDest = normalizeText(currentDest);
            filtered = filtered.filter((item: any) => {
              const itemCity = normalizeText(item.ville || item.city || item.destination || "");
              const itemQuartier = normalizeText(item.quartier || "");
              const itemAddress = normalizeText(item.adresse || "");
              return itemCity.includes(cleanSearchDest) || itemQuartier.includes(cleanSearchDest) || itemAddress.includes(cleanSearchDest);
            });
          }

          setData(filtered);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des données de recherche :", err);
        setData([]);
      } finally {
        setIsFetching(false);
        setIsFirstLoad(false);
      }
    };

    fetchData();
  }, [searchParams]);

  if (isFirstLoad) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 bg-white">
      <div className="w-10 h-10 border-4 border-[#0071c2]/20 border-t-[#0071c2] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-white pb-20 font-sans">
      
      {/* ================= BREADCRUMB ================= */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 pb-2 text-xs text-[#0071c2]">
        <Link href="/" className="hover:underline">Accueil</Link> &gt; 
        <span className="mx-1">Côte d'Ivoire</span> &gt; 
        <span className="mx-1">{displayDest}</span> &gt; 
        <span className="text-slate-500 mx-1">Résultats de votre recherche</span>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row gap-4 mt-2">
        
        {/* ================= COLONNE DE GAUCHE : SIDEBAR FILTRES ================= */}
        <aside className="w-full md:w-64 shrink-0">
          
          <div className="border border-[#c6c6c6] rounded bg-[#e9f0fa] h-32 mb-4 flex items-center justify-center relative overflow-hidden cursor-pointer hover:border-[#0071c2] transition-colors">
            <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&q=80" alt="Carte" className="absolute inset-0 w-full h-full object-cover opacity-60" />
            <button className="relative z-10 bg-[#0071c2] text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-[#005999] flex items-center gap-1.5">
              <MapPin size={14} /> Voir sur la carte
            </button>
          </div>

          <div className="border border-[#c6c6c6] rounded bg-white shadow-sm">
            <div className="p-3 border-b border-[#c6c6c6] bg-[#f8f8f8]">
              <h2 className="font-bold text-slate-900 text-sm!">Filtrer par :</h2>
            </div>

            {/* VILLES */}
            <div className="p-3 border-b border-[#c6c6c6] bg-blue-50/30">
              <h3 className="text-xs! font-bold text-slate-900 mb-3 uppercase tracking-wider">Destinations La Côtière</h3>
              <div className="flex flex-col gap-2">
                {villesFiltres.map((ville) => {
                  const isChecked = dest.toLowerCase() === ville.nom.toLowerCase();
                  return (
                    <label key={ville.nom} className="flex items-center justify-between cursor-pointer group">
                      <div className="flex items-center gap-2.5">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded-sm border-gray-400 text-[#0071c2] focus:ring-0 cursor-pointer"
                          checked={isChecked}
                          onChange={() => handleCityChange(ville.nom)}
                        />
                        <span className={`text-xs ${isChecked ? 'font-bold text-[#0071c2]' : 'text-[#1a1a1a]'}`}>
                          {ville.nom}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* TYPES D'ÉTABLISSEMENTS */}
            <div className="p-3">
              <h3 className="text-xs! font-bold text-slate-900 mb-3 uppercase tracking-wider">Type d'établissement</h3>
              <div className="flex flex-col gap-2">
                {typeFiltres.map((cat) => {
                  const isChecked = Boolean(categorieActive === cat.nom);
                  return (
                    <label key={cat.nom} className="flex items-center justify-between cursor-pointer group">
                      <div className="flex items-center gap-2.5">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded-sm border-gray-400 text-[#0071c2] focus:ring-0 cursor-pointer"
                          checked={isChecked}
                          onChange={() => handleCategoryChange(cat.nom)}
                        />
                        <span className={`text-xs ${isChecked ? 'font-bold text-[#0071c2]' : 'text-[#1a1a1a]'}`}>{cat.nom}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

          </div>
        </aside>

        {/* ================= COLONNE DE DROITE : RÉSULTATS DYNAMIQUES ================= */}
        <main className="flex-1 flex flex-col gap-3 relative">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
            {/* TAILLE DE POLICE RÉDUITE ICI */}
            <h1 className="text-lg! font-bold text-slate-800 flex items-center gap-2">
              {displayDest} : {data.length} établissement(s) trouvé(s)
              {isFetching && <Loader2 className="animate-spin text-[#0071c2]" size={16} />}
            </h1>
          </div>

          <div className="flex flex-col gap-2 mb-2">
            <div className="flex gap-2 items-center">
              {categorieActive !== "Tous" && (
                <button className="border border-[#0071c2] bg-[#f0f6fd] text-[#0071c2] rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1">
                  {categorieActive} <X size={12} className="cursor-pointer" onClick={() => handleCategoryChange("Tous")} />
                </button>
              )}
            </div>
          </div>
          
          <div className={`flex flex-col gap-3 transition-opacity duration-300 ${isFetching ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            {data.length === 0 && !isFetching ? (
               <div className="bg-white border border-[#c6c6c6] rounded p-12 text-center mt-4 shadow-sm">
                  <Building2 size={40} className="mx-auto mb-3 text-slate-400" />
                  <p className="text-base font-bold text-slate-700 mb-1">Aucun établissement trouvé</p>
                  <p className="text-sm text-slate-500 mb-4">Aucun hôtel ou résidence ne correspond à votre recherche dans notre base de données.</p>
                  <button onClick={() => router.push('/recherche')} className="text-[#0071c2] font-bold text-sm hover:underline">
                    Effacer tous les filtres
                  </button>
               </div>
            ) : (
              data.map((item) => {
                const itemTitle = item.nom || item.title || "Établissement sans nom";
                const itemDest = [item.quartier, item.ville, item.city].filter(Boolean).join(", ") || displayDest;
                const rawType = (item.type || "résidence").toLowerCase();
                const itemType = rawType.includes("hotel") ? "Hôtel" : rawType.includes("villa") ? "Villa" : "Résidence";
                const itemDesc = item.description || "Séjour de qualité sur le littoral ivoirien.";
                const itemRating = item.rating || 8.5;
                const itemPrix = item.prix_nuit || item.price || item.prix;
                
                const itemImg = Array.isArray(item.images) && item.images.length > 0 
                  ? item.images[0] 
                  : (item.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80");

                return (
                  <div key={item.id} className="bg-white border border-[#c6c6c6] rounded-lg p-3.5 flex flex-col sm:flex-row gap-4 hover:bg-[#f8f8f8] transition-colors relative shadow-sm">
                    
                    <button className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-white rounded-full text-slate-400 hover:text-red-500 shadow-sm border border-transparent hover:border-gray-200 shrink-0">
                      <Heart size={16} />
                    </button>

                    <div className="w-full sm:w-52 h-44 rounded overflow-hidden shrink-0 bg-slate-100">
                      <img 
                        src={itemImg} 
                        alt={itemTitle} 
                        className="w-full h-full object-cover" 
                      />
                    </div>

                    <div className="flex-1 flex flex-col pt-0.5">
                      <div className="flex items-start gap-2">
                        <h3 className="text-base font-bold text-[#0071c2] leading-tight hover:text-[#005999] cursor-pointer">
                          {itemTitle}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1.5 mt-1 mb-3">
                        <span className="text-[#0071c2] text-xs underline cursor-pointer">
                          {itemDest}
                        </span>
                      </div>
                      
                      <div className="border-l-2 border-[#c6c6c6] pl-2.5">
                        <p className="text-xs font-bold text-slate-900 mb-0.5">{itemType}</p>
                        <p className="text-xs text-slate-600 mb-2 line-clamp-2">{itemDesc}</p>
                        
                        <div className="flex items-start gap-1.5 text-xs font-bold text-[#008009]">
                          <Check size={14} className="shrink-0 mt-0.5" /> Annulation gratuite
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between items-end min-w-[140px] text-right border-t sm:border-t-0 sm:border-l border-[#e7e7e7] pt-3 sm:pt-0 sm:pl-3">
                      
                      <div className="flex gap-2">
                        <div className="flex flex-col items-end pt-0.5">
                          <span className="font-bold text-slate-900 text-xs leading-tight">
                            {itemRating >= 9 ? "Superbe" : "Très bien"}
                          </span>
                        </div>
                        <div className="bg-[#003b95] text-white font-bold px-2 py-1.5 rounded text-xs flex items-center justify-center h-7">
                          {itemRating.toString().replace('.', ',')}
                        </div>
                      </div>

                      <div className="flex flex-col items-end w-full mt-4">
                        <span className="text-[10px] text-slate-500 mb-0.5">1 nuit, {adults} adultes</span>
                        <span className="text-sm font-bold text-slate-900 leading-none mb-1">
                          {itemPrix ? `${Number(itemPrix).toLocaleString('fr-FR')} FCFA` : "Sur devis"}
                        </span>
                        
                        <Link 
                            href={`/services/sejours/${encodeURIComponent(item.id)}`}
                            className="bg-[#0071c2] hover:bg-[#005999] text-white font-bold py-2 px-3 rounded text-xs w-full text-center flex items-center justify-between mt-2"
                          >
                            Voir les disponibilités <ChevronRight size={14} />
                        </Link>
                      </div>

                    </div>

                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh] bg-white">
        <div className="w-10 h-10 border-4 border-[#0071c2]/20 border-t-[#0071c2] rounded-full animate-spin" />
      </div>
    }>
      <ResultatsContent />
    </Suspense>
  );
}