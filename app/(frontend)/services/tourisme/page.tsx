"use client";
import { useEffect, useState } from "react";
import { ArrowRight, Star, Clock, Utensils, Bed, Compass, Music, Car } from "lucide-react";
import Link from "next/link";
import ExcursionBookingForm from "@/components/frontend/excursions/ExcursionBookingForm";

type Excursion = {
  id: string; title: string; duration: string; priceAdult: number; priceChild?: number;
  images: string[]; avgRating?: number;
};

const categories = [
  {
    icon: Utensils, label: "Où Manger", color: "bg-orange-50 text-orange-600",
    items: ["Restaurants gastronomiques", "Restaurants locaux (cuisine ivoirienne)", "Maquis ambiance (attiéké poisson, garba)", "Grillades au bord de l'eau", "Fast-food et restauration rapide", "Pâtisseries et glaciers"],
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
    link: "/services/tourisme/ou-manger",
  },
  {
    icon: Bed, label: "Où Dormir", color: "bg-blue-50 text-blue-600",
    items: ["Hôtels de luxe (4-5 étoiles)", "Hôtels standards (2-3 étoiles)", "Résidences bord de mer meublées", "Auberges et gîtes", "Campings aménagés", "Locations courte durée"],
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80",
    link: "/services/hebergement",
  },
  {
    icon: Compass, label: "Où Voyager", color: "bg-green-50 text-green-600",
    items: ["Excursions plage et lagune (bateau, kayak)", "Visites patrimoine UNESCO (Grand-Bassam)", "Safari et découverte nature", "Guides touristiques multilingues (6 langues)", "Observation des dauphins", "Pêche traditionnelle avec les locaux"],
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80",
    link: "/services/tourisme/ou-voyager",
  },
  {
    icon: Music, label: "Où Se Divertir", color: "bg-purple-50 text-purple-600",
    items: ["Maquis ambiance avec musique live", "Bars lounge et terrasses vue mer", "Nightclubs et discothèques", "Espaces événementiels privés", "Karaoké et animations", "Salles VIP pour groupes"],
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80",
    link: "/services/evenements",
  },
  {
    icon: Car, label: "Location Véhicules", color: "bg-red-50 text-red-600",
    items: ["Voitures citadines (économiques)", "4x4 et SUV (tout-terrain)", "Motos et scooters", "Location avec chauffeur professionnel", "Bus et minibus pour groupes", "Véhicules de luxe (Mercedes, BMW)"],
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&q=80",
    link: "/services/vehicules",
  },

];

// Excursions par défaut si l'API ne retourne rien
// Les IDs correspondent aux slugs de la page de détail /services/tourisme/[id]
const DEFAULT_EXCURSIONS: Excursion[] = [
  { id: "grand-bassam", title: "Grand-Bassam — Patrimoine UNESCO", duration: "Journée complète", priceAdult: 15000, images: ["https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80"], avgRating: 5 },
  { id: "assinie", title: "Week-end à Assinie-Mafia", duration: "Week-end", priceAdult: 25000, images: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80"], avgRating: 5 },
  { id: "jacqueville", title: "Jacqueville — Île & Lagune Ébrié", duration: "Journée", priceAdult: 12000, images: ["https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80"], avgRating: 4 },
  { id: "sassandra", title: "Sassandra — Ville historique & Rochers", duration: "Week-end", priceAdult: 35000, images: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80"], avgRating: 5 },
  { id: "san-pedro", title: "San-Pédro — Port & Plages du Sud-Ouest", duration: "Week-end", priceAdult: 40000, images: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80"], avgRating: 4 },
  { id: "fresco", title: "Fresco — Plage sauvage préservée", duration: "Journée", priceAdult: 20000, images: ["https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=600&q=80"], avgRating: 5 },
  { id: "abidjan", title: "Abidjan — Lagune Ébrié & Plage de Vridi", duration: "Demi-journée", priceAdult: 10000, images: ["https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600&q=80"], avgRating: 5 },
  { id: "grand-lahou", title: "Grand-Lahou — Embouchure du Bandama", duration: "Journée", priceAdult: 18000, images: ["https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80"], avgRating: 4 },
  { id: "adiake", title: "Adiaké — Lagune Aby & Pêche", duration: "Journée", priceAdult: 15000, images: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80"], avgRating: 4 },
  { id: "dabou", title: "Dabou — Lagune Ébrié & Traditions", duration: "Journée", priceAdult: 12000, images: ["https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80"], avgRating: 4 },
  { id: "grand-bereby", title: "Grand-Béreby — Plages vierges du Sud-Ouest", duration: "Week-end", priceAdult: 40000, images: ["https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=600&q=80"], avgRating: 5 },
  { id: "grand-bassam", title: "Balade en bateau sur le fleuve", duration: "3h", priceAdult: 15000, images: ["https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80"], avgRating: 5 },
];

export default function TourismePage() {
  const [excursions, setExcursions] = useState<Excursion[]>(DEFAULT_EXCURSIONS);
  const [selectedExcursion, setSelectedExcursion] = useState<Excursion | null>(null);

  useEffect(() => {
    fetch("/api/excursions")
      .then(r => r.json())
      .then(d => {
        const data = d.data ?? [];
        if (data.length > 0) setExcursions(data);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen">
      <section className="relative text-white py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/Images/cotiere-tourisme-voyage.png" alt="Tourisme & Voyage" className="w-full h-full object-contain" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-2xl sm:text-2xl sm:text-4xl md:text-5xl font-bold mt-2 mb-4">Tourisme & Voyage</h1>
            <p className="text-gray-100 text-lg leading-relaxed">
              Découvrez la beauté du littoral ivoirien avec nos guides expérimentés.
            </p>
            <a href="#voyages" className="btn-primary mt-8 inline-flex">
              Voir nos voyages <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#f0f9ff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest">5 catégories</span>
            <h2 className="section-title mt-2">Tout pour votre séjour sur le littoral</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div key={cat.label} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 card-hover">
                  <div className="relative h-40">
                    <img src={cat.image} alt={cat.label} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                      <div className={`w-8 h-8 ${cat.color} rounded-lg flex items-center justify-center`}>
                        <Icon size={16} />
                      </div>
                      <span className="text-white font-bold text-sm">{cat.label}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <ul className="space-y-1">
                      {cat.items.slice(0, 4).map(item => (
                        <li key={item} className="text-xs text-gray-600 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-[#c9a84c] rounded-full shrink-0" />
                          {item}
                        </li>
                      ))}
                      {cat.items.length > 4 && <li className="text-xs text-gray-400">+{cat.items.length - 4} autres...</li>}
                    </ul>
                    {cat.link && (
                      <Link href={cat.link} className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#0c4a6e] border border-[#0c4a6e]/20 px-3 py-1.5 rounded-lg hover:bg-[#0c4a6e]/5 transition-colors">
                        En savoir plus <ArrowRight size={12} />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="voyages" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest">Nos voyages</span>
            <h2 className="section-title mt-2">Explorez le littoral</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {excursions.map((e) => (
              <div key={e.id} className="bg-white rounded-xl overflow-hidden shadow-sm card-hover border border-gray-100">
                <div className="relative h-48">
                  <img src={e.images[0] ?? "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80"} alt={e.title} className="w-full h-full object-cover" />
                  <span className="absolute top-3 right-3 bg-[#c9a84c] text-white text-xs font-bold px-3 py-1 rounded-full">
                    {e.priceAdult.toLocaleString()} FCFA
                  </span>
                </div>
                <div className="p-5">
                  {e.avgRating && (
                    <div className="flex gap-1 mb-2">
                      {Array.from({ length: Math.round(e.avgRating) }).map((_, i) => (
                        <Star key={i} size={12} className="text-[#c9a84c] fill-[#c9a84c]" />
                      ))}
                    </div>
                  )}
                  <h3 className="font-semibold text-[#0a1628] mb-2">{e.title}</h3>
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                    <Clock size={14} /> <span>{e.duration}</span>
                  </div>
                  <button onClick={() => setSelectedExcursion(e)}
                    className="btn-primary w-full justify-center text-sm py-2">
                    Réserver <ArrowRight size={14} />
                  </button>
                  <a href={`/services/tourisme/${e.id}`}
                    className="mt-2 w-full flex items-center justify-center gap-1 text-sm font-semibold text-[#0c4a6e] border border-[#0c4a6e]/20 rounded-xl py-2 hover:bg-[#0c4a6e]/5 transition-colors">
                    Voir détail <ArrowRight size={13} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#38bdf8] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Voyage sur mesure ?</h2>
          <p className="text-gray-200 mb-8">Contactez-nous pour organiser un voyage personnalisé.</p>
          <Link href="/contact" className="btn-primary">Nous contacter <ArrowRight size={18} /></Link>
        </div>
      </section>

      <ExcursionBookingForm
        excursion={selectedExcursion ? {
          id: selectedExcursion.id,
          title: selectedExcursion.title,
          duration: selectedExcursion.duration,
          priceAdult: selectedExcursion.priceAdult,
          priceChild: selectedExcursion.priceChild ?? Math.round(selectedExcursion.priceAdult * 0.5),
          maxParticipants: 20,
          options: [],
          timeSlots: [],
        } : { id: "", title: "", duration: "", priceAdult: 0, priceChild: 0, maxParticipants: 20, options: [], timeSlots: [] }}
        isOpen={!!selectedExcursion}
        onClose={() => setSelectedExcursion(null)}
      />
    </div>
  );
}
