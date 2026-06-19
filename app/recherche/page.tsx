"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { MapPin, ChevronDown, Heart, Check, Star, Info, X, ChevronRight, Loader2 } from "lucide-react";

function ResultatsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [data, setData] = useState<any[]>([]);
  // 🚀 NOUVEAU : Deux états de loading distincts
  const [isFirstLoad, setIsFirstLoad] = useState(true); // Pour le tout premier affichage
  const [isFetching, setIsFetching] = useState(false);  // Pour les clics sur les filtres
  
  // Gestion des URL
  const initialType = searchParams.get("type") || "Tous";
  let normalizedType = "Tous";
  if (initialType.toLowerCase() === "hotel") normalizedType = "Hôtel";
  else if (initialType.toLowerCase() === "residence") normalizedType = "Résidence";
  else if (initialType.toLowerCase() === "evenement") normalizedType = "Événement";
  else if (initialType !== "Tous") normalizedType = initialType.charAt(0).toUpperCase() + initialType.slice(1);
  
  const [categorieActive, setCategorieActive] = useState(normalizedType);

  const dest = searchParams.get("dest") || "";
  const displayDest = dest || "La Côtière";
  const adults = searchParams.get("adults") || "2";

  // Filtres statiques de démonstration
  const villesFiltres = [
    { nom: "Assinie-Mafia", count: 24 },
    { nom: "San Pedro", count: 18 },
    { nom: "Grand-Bassam", count: 35 },
    { nom: "Jacqueville", count: 12 },
    { nom: "Grand-Béréby", count: 8 },
    { nom: "Sassandra", count: 5 }
  ];

  const typeFiltres = [
    { nom: "Hôtel", count: 65 },
    { nom: "Résidence", count: 119 }, // Modifié pour correspondre à ta DB
    { nom: "Complexe hôtelier", count: 1 },
    { nom: "Villa", count: 14 }
  ];

  const popFiltres = [
    { nom: "Hôtel", count: 65 },
    { nom: "Résidence", count: 119 },
    { nom: "Pas de prépaiement", count: 49 },
    { nom: "Piscine", count: 39 }
  ];

  // 🚀 NOUVEAU : Fonction unique pour mettre à jour TOUS les paramètres d'un coup de manière fluide
  const updateFiltersInUrl = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null) {
      params.delete(key);
      if (key === "type") params.delete("categorie"); // Nettoyage de l'ancien format
    } else {
      params.set(key, value);
    }
    router.push(`/recherche?${params.toString()}`, { scroll: false }); // scroll: false évite que la page remonte d'un coup
  };

  const handleCityChange = (cityName: string) => {
    const isChecked = dest.toLowerCase() === cityName.toLowerCase();
    updateFiltersInUrl("dest", isChecked ? null : cityName);
  };

  const handleCategoryChange = (catName: string) => {
    const isChecked = categorieActive === catName;
    const newValue = isChecked ? "Tous" : catName;
    setCategorieActive(newValue);
    updateFiltersInUrl("type", newValue === "Tous" ? null : newValue.toLowerCase());
  };

  // 🚀 NOUVEAU : Fetch optimisé
  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true); // Active l'effet visuel de transparence (ne vide pas l'écran)
      try {
        const res = await fetch(`/api/recherche?${searchParams.toString()}`);
        const json = await res.json();
        setData(json.data || json || []); 
      } catch (err) {
        console.error("Erreur recherche:", err);
      } finally {
        setIsFetching(false);
        setIsFirstLoad(false); // Le premier chargement est terminé pour de bon
      }
    };
    fetchData();
  }, [searchParams]);

  // Si c'est le tout premier chargement de la page, on affiche le grand spinner
  if (isFirstLoad) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 bg-white">
      <div className="w-10 h-10 border-4 border-[#0071c2]/20 border-t-[#0071c2] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-white pb-20 font-sans">
      
      {/* ================= BREADCRUMB ================= */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 pb-2 text-[11px] text-[#0071c2]">
        <Link href="/" className="hover:underline">Accueil</Link> &gt; 
        <span className="mx-1 hover:underline cursor-pointer">Côte-d'Ivoire</span> &gt; 
        <span className="mx-1 hover:underline cursor-pointer">{displayDest}</span> &gt; 
        <span className="text-slate-500 mx-1">Résultats de votre recherche</span>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row gap-4 mt-2">
        
        {/* ================= COLONNE DE GAUCHE : SIDEBAR FILTRES ================= */}
        <aside className="w-full md:w-[260px] shrink-0">
          
          <div className="border border-[#c6c6c6] rounded bg-[#e9f0fa] h-[140px] mb-4 flex items-center justify-center relative overflow-hidden cursor-pointer hover:border-[#0071c2] transition-colors">
            <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&q=80" alt="Carte" className="absolute inset-0 w-full h-full object-cover opacity-60" />
            <button className="relative z-10 bg-[#0071c2] text-white px-3 py-1.5 rounded text-[12px] font-bold hover:bg-[#005999] flex items-center gap-1.5">
              <MapPin size={14} /> Voir sur la carte
            </button>
          </div>

          <div className="border border-[#c6c6c6] rounded bg-white shadow-sm transition-opacity duration-300">
            <div className="p-3 border-b border-[#c6c6c6] bg-[#f8f8f8]">
              <h2 className="font-bold text-slate-900 !text-[18px] md:!text-[20px]">Filtrer par :</h2>
            </div>

            {/* VILLES */}
            <div className="p-3 border-b border-[#c6c6c6] bg-blue-50/30">
              <h3 className="!text-[15px] md:!text-[18px] font-bold text-slate-900 mb-3">Destinations La Côtière</h3>
              <div className="flex flex-col gap-2">
                {villesFiltres.map((ville) => {
                  const isChecked = dest.toLowerCase() === ville.nom.toLowerCase();
                  return (
                    <label key={ville.nom} className="flex items-start justify-between cursor-pointer group">
                      <div className="flex items-start gap-2.5">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 mt-0.5 rounded-sm border-gray-400 text-[#0071c2] focus:ring-0 cursor-pointer transition-colors"
                          checked={isChecked}
                          onChange={() => handleCityChange(ville.nom)}
                        />
                        <span className={`text-[12px] ${isChecked ? 'font-bold text-[#0071c2]' : 'text-[#1a1a1a]'}`}>
                          {ville.nom}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500">{ville.count}</span>
                    </label>
                  );
                })}
              </div>
            </div>
            
            {/* BUDGET */}
            <div className="p-3 border-b border-[#c6c6c6]">
              <h3 className="!text-[15px] md:!text-[18px] font-bold text-slate-900 mb-2">Votre budget (par nuit)</h3>
              <p className="text-sm text-slate-600 mb-4">De XOF 15 000 à XOF 200 000+</p>
              
              <div className="h-10 flex items-end gap-[1px] mb-1 px-1">
                {[2, 4, 3, 7, 5, 10, 8, 4, 3, 2, 5, 8, 12, 16, 14, 9, 6, 4, 2].map((h, i) => (
                  <div key={i} className="flex-1 bg-[#e7e7e7] rounded-t-sm" style={{ height: `${h * 10}%` }}></div>
                ))}
              </div>
              
              <div className="relative h-4 flex items-center">
                <div className="absolute w-full h-1 bg-[#c6c6c6] rounded"></div>
                <div className="absolute w-[60%] h-1 bg-[#0071c2] rounded left-0"></div>
                <div className="absolute w-4 h-4 bg-white border-[3px] border-[#0071c2] rounded-full left-[60%] top-1/2 -translate-y-1/2 cursor-pointer shadow"></div>
                <div className="absolute w-4 h-4 bg-white border-[3px] border-[#0071c2] rounded-full left-0 top-1/2 -translate-y-1/2 cursor-pointer shadow"></div>
              </div>
            </div>

            {/* TYPES D'ÉTABLISSEMENTS */}
            <div className="p-3">
              <h3 className="!text-[15px] md:!text-[18px] font-bold text-slate-900 mb-3">Type d'établissement</h3>
              <div className="flex flex-col gap-2">
                {typeFiltres.map((cat) => {
                  const isChecked = Boolean(categorieActive === cat.nom);

                  return (
                    <label key={cat.nom} className="flex items-start justify-between cursor-pointer group">
                      <div className="flex items-start gap-2.5">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 mt-0.5 rounded-sm border-gray-400 text-[#0071c2] focus:ring-0 cursor-pointer transition-colors"
                          checked={isChecked}
                          onChange={() => handleCategoryChange(cat.nom)}
                        />
                        <span className={`text-[12px] ${isChecked ? 'font-bold text-[#0071c2]' : 'text-[#1a1a1a]'}`}>{cat.nom}</span>
                      </div>
                      <span className="text-[11px] text-slate-500">{cat.count}</span>
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
            <h1 className="!text-[20px] md:!text-[22px] font-bold text-slate-900 flex items-center gap-3">
              {displayDest} : {data.length} établissements trouvés
              {/* Petit loader discret quand on clique sur un filtre */}
              {isFetching && <Loader2 className="animate-spin text-[#0071c2]" size={20} />}
            </h1>
            <div className="flex items-center gap-2">
              <button className="border border-[#0071c2] text-[#0071c2] rounded-full px-4 py-1.5 text-[12px] font-bold hover:bg-blue-50">
                Liste
              </button>
              <button className="border border-transparent text-slate-600 px-4 py-1.5 text-[12px] font-bold hover:bg-gray-100 rounded-full">
                Mosaïque
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2 mb-2">
            <div className="flex gap-2 items-center">
              <button className="border border-[#c6c6c6] rounded-full px-3 py-1 text-[12px] font-medium text-slate-700 flex items-center gap-2 hover:bg-gray-50">
                <ChevronDown size={14} className="rotate-180" /> Trier par : Sélection pour les longs séjours <ChevronDown size={14} />
              </button>
              {categorieActive !== "Tous" && (
                <button className="border border-[#0071c2] bg-[#f0f6fd] text-[#0071c2] rounded-full px-3 py-1 text-[12px] font-medium flex items-center gap-1 transition-all">
                  {categorieActive} <X size={12} className="cursor-pointer" onClick={() => handleCategoryChange("Tous")} />
                </button>
              )}
            </div>
            
            <div className="border border-[#c6c6c6] rounded p-2 text-[12px] text-slate-700 flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2">
                <Info size={16} className="text-slate-500 shrink-0" />
                <span>Consultez les dernières consignes aux voyageurs. Pensez à vérifier les mesures en vigueur.</span>
              </div>
              <X size={16} className="text-slate-400 cursor-pointer shrink-0" />
            </div>
          </div>
          
          {/* 🚀 L'EFFET DE FLUIDITÉ EST ICI : transition-opacity et pointer-events */}
          <div className={`flex flex-col gap-3 transition-opacity duration-300 ease-in-out ${isFetching ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            {data.length === 0 && !isFetching ? (
               <div className="bg-white border border-[#c6c6c6] rounded p-8 text-center mt-4 shadow-sm">
                  <p className="text-sm font-bold text-slate-700 mb-2">Aucun établissement trouvé</p>
                  <p className="text-sm text-slate-500">Essayez de modifier vos filtres ou de changer de destination.</p>
                  <button onClick={() => router.push('/recherche')} className="mt-4 text-[#0071c2] font-bold text-sm hover:underline">
                    Effacer tous les filtres
                  </button>
               </div>
            ) : (
              data.map((item) => (
                <div key={item.id} className="bg-white border border-[#c6c6c6] rounded-lg p-3.5 flex flex-col sm:flex-row gap-4 hover:bg-[#f8f8f8] transition-colors relative">
                  
                  <button className="absolute top-3 right-3 sm:top-3 sm:left-[165px] z-10 w-8 h-8 flex items-center justify-center bg-white rounded-full text-slate-400 hover:text-red-500 shadow-sm border border-transparent hover:border-gray-200 shrink-0 transition-transform hover:scale-110">
                    <Heart size={16} />
                  </button>

                  <div className="w-full sm:w-[200px] h-[200px] rounded overflow-hidden shrink-0 bg-slate-100">
                    <img 
                      src={item.image?.url || item.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80"} 
                      alt={item.titre} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
                    />
                  </div>

                  <div className="flex-1 flex flex-col pt-0.5">
                    <div className="flex items-start gap-2">
                      <h3 className="!text-[15px] md:!text-[18px] font-bold text-[#0071c2] leading-tight hover:text-[#005999] cursor-pointer">
                        {item.titre}
                      </h3>
                      <div className="flex gap-0.5 text-[#febb02] mt-1">
                        <Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" />
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 mt-1 mb-3">
                      <span className="text-[#0071c2] text-[11px] underline cursor-pointer hover:text-[#005999]">
                        {item.destination || displayDest}
                      </span>
                      <span className="text-[#0071c2] text-[11px] underline cursor-pointer hover:text-[#005999]">Indiquer sur la carte</span>
                      <span className="text-[11px] text-slate-600 ml-1">À proximité de la plage</span>
                    </div>
                    
                    <div className="border-l-[3px] border-[#c6c6c6] pl-2.5">
                      <p className="text-[11px] font-bold text-slate-900 mb-0.5">{item.type}</p>
                      <p className="text-[10px] text-slate-600 mb-2 line-clamp-2">{item.description || "Aucune description fournie."}</p>
                      
                      {item.type === 'Hôtel' && (
                        <p className="text-sm font-bold text-[#008009] mb-1">Petit-déjeuner compris</p>
                      )}
                      
                      <div className="flex items-start gap-1.5 text-[11px] font-bold text-[#008009]">
                        <Check size={14} className="shrink-0 mt-[1px]" /> Annulation gratuite
                      </div>
                      <div className="flex items-start gap-1.5 text-[11px] font-bold text-[#008009]">
                        <Check size={14} className="shrink-0 mt-[1px]" /> Aucun prépaiement requis <span className="font-normal text-slate-600">– Payez sur place</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between items-end min-w-[140px] text-right border-t sm:border-t-0 sm:border-l border-[#e7e7e7] pt-3 sm:pt-0 sm:pl-3 mt-3 sm:mt-0">
                    
                    <div className="flex gap-2">
                      <div className="flex flex-col items-end pt-0.5">
                        <span className="font-bold text-slate-900 text-[14px] leading-tight">
                          {item.rating >= 9 ? "Superbe" : item.rating >= 8 ? "Très bien" : "Bien"}
                        </span>
                        <span className="text-slate-500 text-[10px]">Expériences vécues</span>
                      </div>
                      <div className="bg-[#003b95] text-white font-bold px-1.5 py-1.5 rounded-t rounded-br text-[13px] flex items-center justify-center min-w-[28px] h-[28px]">
                        {item.rating?.toString().replace('.', ',') || "8,0"}
                      </div>
                    </div>

                    <div className="flex flex-col items-end w-full mt-4">
                      <span className="text-[11px] text-slate-500 mb-0.5">1 nuit, {adults} adultes</span>
                      <span className="text-[16px] font-bold text-slate-900 leading-none mb-1">
                        {item.prix ? `XOF ${item.prix.toLocaleString('fr-FR')}` : "Sur devis"}
                      </span>
                      {item.prix && (
                        <span className="text-[10px] text-slate-500 mb-3">+ taxes et frais</span>
                      )}
                      
                      <Link 
                          href={`/services/${(item.type || 'hotel').toLowerCase()}/${item.id}`}
                          className="bg-[#0071c2] hover:bg-[#005999] text-white font-bold py-2 px-4 rounded text-[13px] w-full text-center flex items-center justify-between"
                        >
                          Voir les disponibilités <ChevronRight size={14} />
                      </Link>
                    </div>

                  </div>

                </div>
              ))
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