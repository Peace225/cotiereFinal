"use client";

import { useEffect, useState, useMemo } from "react";
import { MapPin, Clock, Star, Compass, Filter } from "lucide-react";
import Link from "next/link";
import ExcursionBookingForm from "@/components/frontend/excursions/ExcursionBookingForm";

export const dynamic = 'force-dynamic';

type Excursion = {
  id: string; 
  title: string; 
  location: string;
  duration: string; 
  priceAdult: number; 
  priceChild?: number;
  images: string[]; 
  avgRating?: number;
  reviews?: number;
};

// Liste des destinations côtières
const ALL_DESTINATIONS = [
  "Abidjan", "Aboisso", "Adiaké", "Assinie Mafia", "Dabou", 
  "Fresco", "Grand-Bassam", "Grand-Béréby", "Grand-Lahou", 
  "Jacqueville", "San-Pédro", "Sassandra", "Tabou"
];

// Catalogue complet des excursions côtières premium
const DEFAULT_EXCURSIONS: Excursion[] = [
  { 
    id: "abidjan-baie", title: "Croisière Baie des Milliardaires", location: "Abidjan", duration: "Demi-journée", priceAdult: 25000, 
    images: ["https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80"], avgRating: 4.8, reviews: 340 
  },
  { 
    id: "aboisso-bia", title: "Évasion Naturelle sur la rivière Bia", location: "Aboisso", duration: "Journée", priceAdult: 18000, 
    images: ["https://images.unsplash.com/photo-1501183638710-841dd1904471?w=800&q=80"], avgRating: 4.6, reviews: 85 
  },
  { 
    id: "adiake-ehotile", title: "Balade Lagunaire & Îles Ehotilé", location: "Adiaké", duration: "Journée", priceAdult: 20000, 
    images: ["https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80"], avgRating: 4.9, reviews: 112 
  },
  { 
    id: "assinie-detente", title: "Week-end Évasion Premium", location: "Assinie Mafia", duration: "Week-end", priceAdult: 45000, 
    images: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80"], avgRating: 4.9, reviews: 520 
  },
  { 
    id: "dabou-lagune", title: "Découverte des Plantations", location: "Dabou", duration: "Demi-journée", priceAdult: 15000, 
    images: ["https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80"], avgRating: 4.5, reviews: 65 
  },
  { 
    id: "fresco-lamantins", title: "Écotourisme: Les Lamantins", location: "Fresco", duration: "Journée", priceAdult: 22000, 
    images: ["https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=80"], avgRating: 4.8, reviews: 90 
  },
  { 
    id: "grand-bassam-unesco", title: "Circuit Historique UNESCO", location: "Grand-Bassam", duration: "Demi-journée", priceAdult: 15000, 
    images: ["https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80"], avgRating: 4.7, reviews: 410 
  },
  { 
    id: "bereby-plongee", title: "Plongée & Safari Baie des Sirènes", location: "Grand-Béréby", duration: "2 Jours", priceAdult: 65000, 
    images: ["https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?w=800&q=80"], avgRating: 5.0, reviews: 215 
  },
  { 
    id: "lahou-azagny", title: "Safari Parc National d'Azagny", location: "Grand-Lahou", duration: "Journée", priceAdult: 28000, 
    images: ["https://images.unsplash.com/photo-1537726235470-1698299dc20a?w=800&q=80"], avgRating: 4.8, reviews: 134 
  },
  { 
    id: "jacqueville-ebrie", title: "Détente Lagune Ébrié", location: "Jacqueville", duration: "Journée", priceAdult: 12000, 
    images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80"], avgRating: 4.6, reviews: 180 
  },
  { 
    id: "sanpedro-monogaga", title: "Plage de Monogaga", location: "San-Pédro", duration: "Journée", priceAdult: 25000, 
    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80"], avgRating: 4.9, reviews: 156 
  },
  { 
    id: "sassandra-falaises", title: "Croisière Pont Weygand", location: "Sassandra", duration: "Journée", priceAdult: 20000, 
    images: ["https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80"], avgRating: 4.7, reviews: 105 
  },
  { 
    id: "tabou-tabaoule", title: "Surf & Plage de Tabaoulé", location: "Tabou", duration: "Week-end", priceAdult: 40000, 
    images: ["https://images.unsplash.com/photo-1551882547-ff40c0d13966?w=800&q=80"], avgRating: 4.8, reviews: 75 
  }
];

export default function TourismePage() {
  const [excursions, setExcursions] = useState<Excursion[]>(DEFAULT_EXCURSIONS);
  const [selectedExcursion, setSelectedExcursion] = useState<Excursion | null>(null);
  
  // États de filtrage
  const [selectedDestination, setSelectedDestination] = useState<string>("Toutes");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    // Remplacer par ton vrai appel API Supabase plus tard
    fetch("/api/excursions")
      .then(r => r.json())
      .then(d => { if (d.data?.length > 0) setExcursions(d.data); })
      .catch(() => {});
  }, []);

  // Logique de filtrage dynamique
  const filteredExcursions = useMemo(() => {
    return excursions.filter((exc) => {
      const matchesDest = selectedDestination === "Toutes" || exc.location === selectedDestination;
      const matchesSearch = exc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            exc.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDest && matchesSearch;
    });
  }, [excursions, selectedDestination, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      
      {/* HEADER / HERO SECTION */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[#003b95] text-white p-8 md:p-14 shadow-xl">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-3">
              <Compass size={12} /> Découvertes Côtières
            </span>
            <h1 className="!text-3xl md:text-5xl font-black leading-tight mb-3">
              Explorez le littoral Ivoirien
            </h1>
            <p className="text-white/80 text-sm md:text-base max-w-xl">
              De Tabou à Assinie, embarquez pour des excursions inoubliables avec nos guides locaux expérimentés.
            </p>
          </div>
          <div className="absolute top-0 right-0 w-full md:w-1/2 h-full opacity-30 md:opacity-40 bg-[url('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#003b95] via-[#003b95]/80 to-transparent"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* BARRE DE FILTRES LATÉRALE */}
        <div className="bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm h-fit space-y-5 lg:sticky lg:top-28">
          <div className="flex items-center gap-2 font-black text-slate-900 text-base border-b border-slate-100 pb-2">
            <Filter size={16} className="text-[#003b95]" />
            Trouver un circuit
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1.5">Recherche</label>
              <input 
                type="text" 
                placeholder="Ex: Croisière, Safari..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#003b95] bg-slate-50 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1.5">Destination Côtière</label>
              <select
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#003b95] bg-slate-50 focus:bg-white transition-colors cursor-pointer"
              >
                <option value="Toutes">Toutes les villes ({ALL_DESTINATIONS.length})</option>
                {ALL_DESTINATIONS.map((dest, i) => (
                  <option key={i} value={dest}>{dest}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* GRILLE DES EXCURSIONS RÉDUITES */}
        <div className="lg:col-span-3">
          <div className="text-slate-500 text-xs font-medium mb-4">
            {filteredExcursions.length} circuit(s) disponible(s)
          </div>

          {filteredExcursions.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center text-slate-500 text-sm shadow-sm">
              Aucune excursion trouvée pour <strong>{selectedDestination}</strong>.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredExcursions.map(e => (
                <div key={e.id} className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col">
                  {/* Image Réduite */}
                  <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                    <img 
                      src={e.images[0]} 
                      alt={e.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-2 left-2 bg-white/95 backdrop-blur text-slate-900 text-[9px] font-black px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                      <Clock size={10} /> {e.duration}
                    </div>
                    <div className="absolute top-2 right-2 bg-[#003b95]/90 backdrop-blur text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm flex items-center gap-1">
                      <Star size={8} className="fill-yellow-400 text-yellow-400" /> {e.avgRating}
                    </div>
                  </div>
                  
                  {/* Contenu Compact */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] text-[#003b95] font-bold mb-1 flex items-center gap-1">
                        <MapPin size={10} /> {e.location}
                      </p>
                      <h3 className="!text-base font-black text-slate-900 leading-snug mb-2 line-clamp-1 group-hover:text-[#003b95] transition-colors">
                        {e.title}
                      </h3>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-50">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[9px] uppercase font-bold text-slate-400">Tarif / Adulte</span>
                        <div className="text-sm font-black text-slate-900">
                          {e.priceAdult.toLocaleString()} <span className="text-[9px] font-bold text-slate-500">XOF</span>
                        </div>
                      </div>

                      <div className="flex gap-1.5">
                        <Link 
                          href={`/services/tourisme/${e.id}`} 
                          className="flex-1 text-center bg-slate-50 text-slate-600 font-bold py-2 rounded-lg text-xs hover:bg-slate-100 transition-colors"
                        >
                          Détails
                        </Link>
                        <button 
                          onClick={() => setSelectedExcursion(e)} 
                          className="flex-1 bg-[#003b95] text-white font-black py-2 rounded-lg text-xs hover:bg-blue-800 transition-colors"
                        >
                          Réserver
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MODAL DE RÉSERVATION */}
      {selectedExcursion && (
        <ExcursionBookingForm
          excursion={{
            id: selectedExcursion.id,
            title: selectedExcursion.title,
            duration: selectedExcursion.duration,
            priceAdult: selectedExcursion.priceAdult,
            priceChild: selectedExcursion.priceChild ?? Math.round(selectedExcursion.priceAdult * 0.5),
            maxParticipants: 20,
            options: [],
            timeSlots: []
          }}
          isOpen={true}
          onClose={() => setSelectedExcursion(null)}
        />
      )}
    </div>
  );
}