"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, UtensilsCrossed, Star, Wifi, Wind, Tv, Waves, Sofa, Car, Dumbbell, Coffee, Bath, MapPin, Clock } from "lucide-react";
import ReservationModal from "@/components/frontend/ReservationModal";

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  "Wifi":           <Wifi size={11} className="text-[#38bdf8]" />,
  "Climatisation":  <Wind size={11} className="text-[#38bdf8]" />,
  "TV":             <Tv size={11} className="text-[#38bdf8]" />,
  "Terrasse":       <Waves size={11} className="text-[#38bdf8]" />,
  "Bar":            <UtensilsCrossed size={11} className="text-[#38bdf8]" />,
  "Salon VIP":      <Sofa size={11} className="text-[#38bdf8]" />,
  "Parking":        <Car size={11} className="text-[#38bdf8]" />,
  "Piscine":        <Waves size={11} className="text-[#38bdf8]" />,
  "Climatisé":      <Wind size={11} className="text-[#38bdf8]" />,
  "Petit-déjeuner": <Coffee size={11} className="text-[#38bdf8]" />,
  "Musique live":   <Star size={11} className="text-[#38bdf8]" />,
};

function AmenityBadge({ name }: { name: string }) {
  const icon = AMENITY_ICONS[name] ?? <Star size={11} className="text-[#38bdf8]" />;
  return (
    <span className="flex items-center gap-1 text-xs bg-[#f0f9ff] text-[#38bdf8] px-2 py-1 rounded-full">
      {icon} {name}
    </span>
  );
}

type Restaurant = {
  id: string; name: string; specialty: string; priceRange: string;
  images: string[]; amenities: string[]; openingHours: string; location: string; isActive: boolean;
};

const DEFAULT_RESTAURANTS: Restaurant[] = [
  { id: "1", name: "Le Lagon Bleu", specialty: "Gastronomie Africaine & Européenne", priceRange: "10 000 - 25 000 FCFA", images: ["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80"], amenities: ["Terrasse", "Bar", "Wifi", "Climatisé"], openingHours: "11h00 - 23h00", location: "Bord de mer", isActive: true },
  { id: "2", name: "La Brise du Littoral", specialty: "Poissons frais & Grillades", priceRange: "8 000 - 20 000 FCFA", images: ["https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80"], amenities: ["Terrasse", "Musique live", "Parking"], openingHours: "12h00 - 00h00", location: "Plage principale", isActive: true },
  { id: "3", name: "Le Maquis Select", specialty: "Spécialités ivoiriennes authentiques", priceRange: "5 000 - 15 000 FCFA", images: ["https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&q=80"], amenities: ["Salon VIP", "Parking", "Wifi"], openingHours: "10h00 - 22h00", location: "Centre-ville", isActive: true },
];

const amenityImages = [
  { image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&q=80", label: "Wifi haut débit" },
  { image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&q=80", label: "Petits-déjeuners & Brunchs" },
  { image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80", label: "Cuisine africaine & européenne" },
  { image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=400&q=80", label: "Parking sécurisé" },
  { image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80", label: "Terrasses panoramiques" },
  { image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80", label: "Salons privés & Événements" },
];

export default function RestaurationPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>(DEFAULT_RESTAURANTS);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  useEffect(() => {
    fetch("/api/restaurants")
      .then(r => r.json())
      .then(d => {
        if (d.data?.length > 0) setRestaurants(d.data.filter((rest: Restaurant) => rest.isActive));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen">
      <section className="relative text-white py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80" alt="Restauration" className="w-full h-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/10" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mt-2 mb-4">Restauration & Gastronomie</h1>
            <p className="text-gray-100 text-lg leading-relaxed">
              Découvrez les meilleures tables du littoral ivoirien. Entre saveurs locales authentiques et cuisine européenne raffinée, profitez d'expériences culinaires uniques.
            </p>
            <a href="#restaurants" className="btn-primary mt-8 inline-flex">
              Voir les restaurants <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#f0f9ff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-center mb-10">Ambiance & services culinaires</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {amenityImages.map((a) => (
              <div key={a.label} className="group relative rounded-xl overflow-hidden shadow-sm card-hover">
                <div className="relative h-36">
                  <img src={a.image} alt={a.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <p className="absolute bottom-3 left-3 right-3 text-white text-xs font-semibold leading-tight">{a.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Types de restauration */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest">Nos catégories</span>
            <h2 className="section-title mt-2">Tous les styles de cuisine</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {[
              { label: "Restaurants gastronomiques", stars: 5, slug: "gastronomiques", image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=400&q=80" },
              { label: "Maquis et brasseries", stars: 3, slug: "maquis-brasseries", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80" },
              { label: "Fruits de mer & Grillades", stars: 0, slug: "fruits-de-mer", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80" },
              { label: "Salons de thé & Pâtisseries", stars: 0, slug: "salons-de-the", image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&q=80" },
              { label: "Bars & Lounges de plage", stars: 0, slug: "lounges-plage", image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&q=80" },
              { label: "Restauration événementielle", stars: 0, slug: "evenementiel", image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&q=80" },
            ].map((t) => (
              <Link key={t.label} href={`/services/restauration/type/${t.slug}`}
                className="group relative rounded-xl overflow-hidden shadow-sm card-hover cursor-pointer">
                <div className="relative h-32">
                  <img src={t.image} alt={t.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute inset-0 bg-[#c9a84c]/0 group-hover:bg-[#c9a84c]/20 transition-all duration-300" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-white text-xs font-semibold leading-tight">{t.label}</p>
                    {t.stars > 0 && (
                      <div className="flex items-center gap-0.5 mt-1">
                        {Array.from({ length: t.stars }).map((_, i) => (
                          <Star key={i} size={10} className="text-[#c9a84c] fill-[#c9a84c]" />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="absolute top-2 right-2 w-6 h-6 bg-white/0 group-hover:bg-white/90 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100">
                    <ArrowRight size={12} className="text-[#0c4a6e]" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="bg-[#f0f9ff] rounded-2xl p-5 border border-[#bae6fd] text-center">
            <p className="text-sm text-[#0c4a6e] font-medium flex items-center justify-center gap-2">
              <UtensilsCrossed size={16} className="text-[#c9a84c]" /> <strong>Réservation de table</strong> — Commandez en ligne ou réservez votre espace VIP pour vos événements
            </p>
          </div>
        </div>
      </section>

      <section id="restaurants" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest">Nos tables</span>
            <h2 className="section-title mt-2">Choisissez votre restaurant</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {restaurants.filter(r => r.isActive).map((r) => (
              <div key={r.id} className="bg-white rounded-xl overflow-hidden shadow-sm card-hover border border-gray-100">
                <div className="relative h-48">
                  <img src={r.images[0] ?? "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80"} alt={r.name} className="w-full h-full object-cover" />
                  <span className="absolute top-3 right-3 bg-[#c9a84c] text-white text-xs font-bold px-3 py-1 rounded-full">
                    {r.priceRange}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-[#0a1628] mb-1">{r.name}</h3>
                  <p className="text-xs text-[#c9a84c] font-medium mb-3">{r.specialty}</p>
                  <div className="flex flex-col gap-1 text-gray-500 text-sm mb-3">
                    <div className="flex items-center gap-2">
                      <Clock size={14} /> <span>{r.openingHours}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} /> <span>{r.location}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {r.amenities.map((a) => (
                      <AmenityBadge key={a} name={a} />
                    ))}
                  </div>
                  <button onClick={() => setSelectedRestaurant(r)}
                    className="btn-primary w-full justify-center text-sm py-2">
                    Réserver une table <ArrowRight size={14} />
                  </button>
                  <a href={`/services/restauration/${r.id}`}
                    className="mt-2 w-full flex items-center justify-center gap-1 text-sm font-semibold text-[#0c4a6e] border border-[#0c4a6e]/20 rounded-xl py-2 hover:bg-[#0c4a6e]/5 transition-colors">
                    Voir la carte &amp; détails <ArrowRight size={13} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {selectedRestaurant && (
        <ReservationModal
          isOpen={!!selectedRestaurant}
          onClose={() => setSelectedRestaurant(null)}
          title={selectedRestaurant.name}
          details={`Restaurant · ${selectedRestaurant.specialty} · ${selectedRestaurant.priceRange}`}
        />
      )}
    </div>
  );
}