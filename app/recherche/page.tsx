"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, Tag, ArrowRight, ArrowLeft } from "lucide-react";

function ResultatsContent() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categorieActive, setCategorieActive] = useState("Tous");

  // Liste des catégories pour la barre de filtre
  const categories = ["Tous", "Hôtel", "Excursion", "Événement", "Market"];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/recherche?${searchParams.toString()}`);
        const json = await res.json();
        setData(json.data || []);
      } catch (err) {
        console.error("Erreur recherche:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchParams]);

  // Filtrage local en temps réel selon la catégorie sélectionnée
  const dataFiltree = categorieActive === "Tous" 
    ? data 
    : data.filter(item => item.type === categorieActive);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <div className="w-10 h-10 border-4 border-[#c9a84c]/30 border-t-[#c9a84c] rounded-full animate-spin" />
      <p className="text-gray-500 font-medium">Recherche en cours...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6">
      {/* En-tête avec bouton de retour */}
      <div className="mb-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#0c4a6e] transition-colors mb-6">
          <ArrowLeft size={16} /> Retour à l'accueil
        </Link>
        <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">Résultats</h1>
        <p className="text-gray-500 font-medium">{dataFiltree.length} service(s) trouvé(s)</p>
      </div>

      {/* Barre de Filtres par Catégorie */}
      <div className="flex gap-2 mb-10 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategorieActive(cat)}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
              categorieActive === cat 
                ? "bg-[#0c4a6e] text-white shadow-lg" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grille des résultats */}
      {data.length === 0 ? (
        <div className="bg-gray-50 rounded-3xl p-12 text-center border-2 border-dashed border-gray-200">
          <Search size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-900">Aucun résultat</h3>
          <p className="text-gray-500 mt-2">Essayez de modifier vos critères de recherche.</p>
          <Link href="/" className="inline-block mt-6 bg-[#0c4a6e] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#0c4a6e]/90">
            Retour à l'accueil
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dataFiltree.map((item) => (
            <div key={item.id} className="group bg-white border border-gray-100 rounded-3xl p-5 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col">
              <div className="aspect-[16/10] bg-gray-100 rounded-2xl mb-5 overflow-hidden">
                {item.image ? (
                  <img src={item.image} alt={item.titre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">Image indisponible</div>
                )}
              </div>

              <div className="flex items-center gap-2 mb-3">
                <Tag size={14} className="text-[#c9a84c]" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#c9a84c]">{item.type || "Service"}</span>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#0c4a6e] transition-colors">{item.titre}</h3>
              <p className="text-sm text-gray-500 line-clamp-2 mb-6 flex-1">{item.description || "Aucune description disponible."}</p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-lg font-black text-gray-900">{item.prix ? `${item.prix} FCFA` : "Sur devis"}</span>
                <Link href={`/services/${item.type.toLowerCase()}/${item.id}`} 
                  className="bg-gray-900 text-white px-5 py-3 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-[#0c4a6e] transition-colors">
                  Détails <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-gray-500">Chargement...</div>}>
      <ResultatsContent />
    </Suspense>
  );
}