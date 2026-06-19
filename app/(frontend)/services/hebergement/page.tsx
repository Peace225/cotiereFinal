"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Users, UtensilsCrossed, Star, Wifi, Wind, Tv, Waves, Sofa, Car, Dumbbell, Coffee, Bath } from "lucide-react";
import ReservationModal from "@/components/frontend/ReservationModal";

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  "Wifi":           <Wifi size={11} className="text-[#38bdf8]" />,
  "Climatisation":  <Wind size={11} className="text-[#38bdf8]" />,
  "TV":             <Tv size={11} className="text-[#38bdf8]" />,
  "Vue mer":        <Waves size={11} className="text-[#38bdf8]" />,
  "Cuisine":        <UtensilsCrossed size={11} className="text-[#38bdf8]" />,
  "Salon":          <Sofa size={11} className="text-[#38bdf8]" />,
  "Parking":        <Car size={11} className="text-[#38bdf8]" />,
  "Piscine":        <Waves size={11} className="text-[#38bdf8]" />,
  "Gym":            <Dumbbell size={11} className="text-[#38bdf8]" />,
  "Petit-dÃ©jeuner": <Coffee size={11} className="text-[#38bdf8]" />,
  "Baignoire":      <Bath size={11} className="text-[#38bdf8]" />,
};

function AmenityBadge({ name }: { name: string }) {
  const icon = AMENITY_ICONS[name] ?? <Star size={11} className="text-[#38bdf8]" />;
  return (
    <span className="flex items-center gap-1 text-xs bg-[#f0f9ff] text-[#38bdf8] px-2 py-1 rounded-full">
      {icon} {name}
    </span>
  );
}

type Room = {
  id: string; name: string; type: string; capacity: number;
  pricePerNight: number; images: string[]; amenities: string[]; isActive: boolean;
};

const DEFAULT_ROOMS: Room[] = [
  { id: "1", name: "Chambre Standard", type: "Chambre", capacity: 2, pricePerNight: 25000, images: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80"], amenities: ["Wifi", "Climatisation", "TV"], isActive: true },
  { id: "2", name: "Chambre SupÃ©rieure", type: "Chambre", capacity: 2, pricePerNight: 40000, images: ["https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80"], amenities: ["Wifi", "Climatisation", "TV", "Vue mer"], isActive: true },
  { id: "3", name: "Suite Familiale", type: "Suite", capacity: 4, pricePerNight: 65000, images: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80"], amenities: ["Wifi", "Climatisation", "Cuisine", "Salon"], isActive: true },
];

const amenityImages = [
  { image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&q=80", label: "Wifi gratuit" },
  { image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&q=80", label: "Petit-dÃ©jeuner inclus" },
  { image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80", label: "Restaurant africain & europÃ©en" },
  { image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=400&q=80", label: "Parking sÃ©curisÃ©" },
  { image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80", label: "Climatisation" },
  { image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80", label: "Salle de rÃ©union" },
];

export default function HebergementPage() {
  const [rooms, setRooms] = useState<Room[]>(DEFAULT_ROOMS);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  useEffect(() => {
    fetch("/api/rooms")
      .then(r => r.json())
      .then(d => {
        if (d.data?.length > 0) setRooms(d.data.filter((r: Room) => r.isActive));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen">
      <section className="relative text-white py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1600&q=80" alt="HÃ©bergement" className="w-full h-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/10" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-2xl sm:text-2xl sm:text-4xl md:text-5xl font-bold mt-2 mb-4">HÃ©bergement & Restauration</h1>
            <p className="text-gray-100 text-lg leading-relaxed">
              HÃ´tels, rÃ©sidences meublÃ©es, campings et restaurant africain & europÃ©en sur le littoral ivoirien.
              Des solutions pour tous les sÃ©jours : tourisme, affaires, Ã©vÃ©nements.
            </p>
            <a href="#chambres" className="btn-primary mt-8 inline-flex">
              Voir les hÃ©bergements <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#f0f9ff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-center mb-10">Ã‰quipements & services</h2>
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

      {/* Types d'hÃ©bergement */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest">Nos formules</span>
            <h2 className="section-title mt-2">Tous types d'hÃ©bergement</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {[
              { label: "HÃ´tels de luxe", stars: 5, slug: "hotels-luxe", image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&q=80" },
              { label: "HÃ´tels standards", stars: 3, slug: "hotels-standards", image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80" },
              { label: "RÃ©sidences bord de mer meublÃ©es", stars: 0, slug: "residences", image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&q=80" },
              { label: "Auberges et gÃ®tes", stars: 0, slug: "auberges", image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80" },
              { label: "Campings amÃ©nagÃ©s", stars: 0, slug: "campings", image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&q=80" },
              { label: "Locations courte durÃ©e (Airbnb-style)", stars: 0, slug: "locations-courte-duree", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=80" },
            ].map((t) => (
              <Link key={t.label} href={`/services/hebergement/type/${t.slug}`}
                className="group relative rounded-xl overflow-hidden shadow-sm card-hover cursor-pointer">
                <div className="relative h-32">
                  <img src={t.image} alt={t.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  {/* Overlay hover */}
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
                  {/* FlÃ¨che au hover */}
                  <div className="absolute top-2 right-2 w-6 h-6 bg-white/0 group-hover:bg-white/90 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100">
                    <ArrowRight size={12} className="text-[#0c4a6e]" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="bg-[#f0f9ff] rounded-2xl p-5 border border-[#bae6fd] text-center">
            <p className="text-sm text-[#0c4a6e] font-medium flex items-center justify-center gap-2">
              <UtensilsCrossed size={16} className="text-[#c9a84c]" /> <strong>Restauration incluse</strong> â€” Restaurant africain &amp; europÃ©en disponible sur place
            </p>
          </div>
        </div>
      </section>

      <section id="chambres" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest">Nos chambres</span>
            <h2 className="section-title mt-2">Choisissez votre hÃ©bergement</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {rooms.filter(r => r.isActive).map((r) => (
              <div key={r.id} className="bg-white rounded-xl overflow-hidden shadow-sm card-hover border border-gray-100">
                <div className="relative h-48">
                  <img src={r.images[0] ?? "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80"} alt={r.name} className="w-full h-full object-cover" />
                  <span className="absolute top-3 right-3 bg-[#c9a84c] text-white text-xs font-bold px-3 py-1 rounded-full">
                    {r.pricePerNight.toLocaleString()} FCFA / nuit
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-[#0a1628] mb-1">{r.name}</h3>
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                    <Users size={14} /> <span>{r.capacity} personnes</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {r.amenities.map((a) => (
                      <AmenityBadge key={a} name={a} />
                    ))}
                  </div>
                  <button onClick={() => setSelectedRoom(r)}
                    className="btn-primary w-full justify-center text-sm py-2">
                    RÃ©server <ArrowRight size={14} />
                  </button>
                  <a href={`/services/hebergement/${r.id}`}
                    className="mt-2 w-full flex items-center justify-center gap-1 text-sm font-semibold text-[#0c4a6e] border border-[#0c4a6e]/20 rounded-xl py-2 hover:bg-[#0c4a6e]/5 transition-colors">
                    Voir dÃ©tail <ArrowRight size={13} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {selectedRoom && (
        <ReservationModal
          isOpen={!!selectedRoom}
          onClose={() => setSelectedRoom(null)}
          title={selectedRoom.name}
          details={`${selectedRoom.type} Â· ${selectedRoom.capacity} personnes Â· ${selectedRoom.pricePerNight.toLocaleString()} FCFA/nuit`}
        />
      )}
    </div>
  );
}


