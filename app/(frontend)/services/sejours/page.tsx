"use client";

import Link from "next/link";
import { MapPin, Star, BedDouble, Wifi, Coffee, ArrowRight, Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

// Données de test (à remplacer plus tard par un appel Prisma vers votre base de données)
const mockHebergements = [
  {
    id: 1,
    nom: "La Baie des Sirènes",
    type: "Hôtel 4 Étoiles",
    ville: "Grand-Béréby",
    prix: "85 000",
    note: 4.8,
    avis: 124,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    tags: ["Piscine", "Vue sur mer", "Petit-déjeuner inclus"]
  },
  {
    id: 2,
    nom: "Villa Assinie Paradise",
    type: "Résidence Privée",
    ville: "Assinie-Mafia",
    prix: "150 000",
    note: 4.9,
    avis: 89,
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
    tags: ["Accès lagune", "Cuisine équipée", "Wifi Haut Débit"]
  },
  {
    id: 3,
    nom: "Hôtel Étoile du Sud",
    type: "Hôtel 3 Étoiles",
    ville: "Grand-Bassam",
    prix: "45 000",
    note: 4.5,
    avis: 210,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
    tags: ["Proche plage", "Restaurant", "Climatisation"]
  },
  {
    id: 4,
    nom: "Résidence Les Cocotiers",
    type: "Appartement",
    ville: "San Pedro",
    prix: "60 000",
    note: 4.6,
    avis: 56,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    tags: ["Sécurisé", "Centre-ville", "Parking privé"]
  }
];

const categories = ["Tout", "Hôtels", "Résidences", "Villas", "Maisons d'hôtes"];

export default function SejoursPage() {
  const [activeCategory, setActiveCategory] = useState("Tout");

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      
      {/* HEADER & RECHERCHE */}
      <div className="bg-[#003b95] text-white py-16 md:py-20 px-4 mb-12">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">
            Trouvez votre hébergement idéal
          </h1>
          <p className="text-blue-100 text-sm md:text-lg mb-10 max-w-2xl mx-auto">
            Hôtels étoilés, résidences privées ou villas en bord de mer. Découvrez les plus belles adresses des villes côtières.
          </p>

          {/* Barre de recherche simplifiée */}
          <div className="max-w-3xl mx-auto bg-white p-2 rounded-2xl md:rounded-full shadow-xl flex flex-col md:flex-row gap-2">
            <div className="flex-1 flex items-center bg-slate-50 rounded-xl md:rounded-full px-4 py-3">
              <MapPin className="text-slate-400 mr-2" size={20} />
              <input 
                type="text" 
                placeholder="Où allez-vous ? (ex: Assinie, Bassam...)" 
                className="bg-transparent w-full outline-none text-slate-800 placeholder:text-slate-400"
              />
            </div>
            <button className="bg-[#c9a84c] hover:bg-[#b8973b] text-white font-bold py-3 px-8 rounded-xl md:rounded-full transition-colors flex items-center justify-center gap-2">
              <Search size={20} /> Rechercher
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        
        {/* FILTRES DE CATÉGORIES */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex overflow-x-auto w-full md:w-auto gap-2 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.map((cat) => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-full font-bold text-sm transition-all ${
                  activeCategory === cat 
                    ? "bg-[#003b95] text-white shadow-md" 
                    : "bg-white text-slate-600 border border-slate-200 hover:border-[#003b95] hover:text-[#003b95]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <button className="flex items-center gap-2 text-slate-600 bg-white px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 font-medium text-sm w-full md:w-auto justify-center shadow-sm">
            <SlidersHorizontal size={16} /> Plus de filtres
          </button>
        </div>

        {/* GRILLE DES HÉBERGEMENTS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockHebergements.map((item) => (
            <Link href={`/services/hebergement/${item.id}`} key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all group flex flex-col">
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.nom} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-black text-[#003b95]">
                  {item.type}
                </div>
              </div>

              {/* Contenu */}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-black text-lg text-slate-900 line-clamp-1">{item.nom}</h3>
                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-md">
                    <Star size={14} className="text-amber-500 fill-amber-500" />
                    <span className="text-xs font-bold text-amber-700">{item.note}</span>
                  </div>
                </div>
                
                <p className="text-slate-500 text-sm flex items-center gap-1.5 mb-4">
                  <MapPin size={14} /> {item.ville}
                </p>

                {/* Équipements (Tags) */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {item.tags.map((tag, i) => (
                    <span key={i} className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Prix et Bouton */}
                <div className="mt-auto pt-4 border-t border-slate-50 flex items-end justify-between">
                  <div>
                    <span className="text-xs text-slate-500 block mb-0.5">À partir de</span>
                    <div className="font-black text-lg text-[#003b95]">
                      {item.prix} <span className="text-sm font-bold text-slate-400">XOF<span className="font-normal">/nuit</span></span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* BOUTON VOIR PLUS */}
        <div className="mt-12 text-center">
          <button className="bg-white border border-slate-200 text-[#003b95] font-bold py-3 px-8 rounded-xl hover:bg-slate-50 hover:border-[#003b95] transition-all shadow-sm">
            Charger plus d'hébergements
          </button>
        </div>

      </div>
    </div>
  );
}