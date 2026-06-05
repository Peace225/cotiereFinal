"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Users, Star, Wifi, Wind, Tv, Waves, Sofa, Car, Coffee, Bath, ChevronLeft } from "lucide-react";
import ReservationModal from "@/components/frontend/ReservationModal";

const TYPES: Record<string, { label: string; stars: number; image: string; description: string; priceFrom: number; priceTo: number }> = {
  "hotels-luxe":           { label: "Hôtels de luxe", stars: 5, image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80", description: "Nos hôtels 5 étoiles offrent une expérience de luxe incomparable sur le littoral ivoirien. Piscines, spas, restaurants gastronomiques et service personnalisé.", priceFrom: 80000, priceTo: 250000 },
  "hotels-standards":      { label: "Hôtels standards", stars: 3, image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80", description: "Des hôtels confortables et bien équipés pour tous les budgets. Idéaux pour les voyageurs d'affaires et les familles.", priceFrom: 25000, priceTo: 65000 },
  "residences":            { label: "Résidences bord de mer", stars: 0, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80", description: "Des résidences meublées directement en bord de mer. Idéales pour les séjours prolongés avec tout le confort d'un appartement.", priceFrom: 50000, priceTo: 150000 },
  "auberges":              { label: "Auberges et gîtes", stars: 0, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80", description: "Des hébergements authentiques et chaleureux pour découvrir le littoral ivoirien dans une ambiance locale et conviviale.", priceFrom: 10000, priceTo: 30000 },
  "campings":              { label: "Campings aménagés", stars: 0, image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80", description: "Des campings bien équipés pour les amoureux de la nature. Tentes, bungalows et emplacements disponibles en bord de mer.", priceFrom: 5000, priceTo: 20000 },
  "locations-courte-duree":{ label: "Locations courte durée", stars: 0, image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80", description: "Des appartements et villas en location courte durée, style Airbnb. Flexibilité et indépendance pour votre séjour.", priceFrom: 30000, priceTo: 120000 },
};

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  "Wifi": <Wifi size={11} className="text-[#38bdf8]" />,
  "Climatisation": <Wind size={11} className="text-[#38bdf8]" />,
  "TV": <Tv size={11} className="text-[#38bdf8]" />,
  "Vue mer": <Waves size={11} className="text-[#38bdf8]" />,
  "Salon": <Sofa size={11} className="text-[#38bdf8]" />,
  "Parking": <Car size={11} className="text-[#38bdf8]" />,
  "Petit-déjeuner": <Coffee size={11} className="text-[#38bdf8]" />,
  "Baignoire": <Bath size={11} className="text-[#38bdf8]" />,
};

type Room = { id: string; name: string; type: string; capacity: number; pricePerNight: number; images: string[]; amenities: string[]; isActive: boolean };

const DEFAULT_ROOMS: Room[] = [
  { id: "1", name: "Chambre Standard", type: "Chambre", capacity: 2, pricePerNight: 25000, images: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80"], amenities: ["Wifi", "Climatisation", "TV"], isActive: true },
  { id: "2", name: "Chambre Supérieure Vue Mer", type: "Chambre", capacity: 2, pricePerNight: 55000, images: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80"], amenities: ["Wifi", "Climatisation", "TV", "Vue mer"], isActive: true },
  { id: "3", name: "Suite Junior Bord de Mer", type: "Suite", capacity: 3, pricePerNight: 85000, images: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&q=80"], amenities: ["Wifi", "Climatisation", "Salon", "Vue mer"], isActive: true },
  { id: "4", name: "Suite Prestige Panoramique", type: "Suite Prestige", capacity: 4, pricePerNight: 150000, images: ["https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80"], amenities: ["Wifi", "Climatisation", "Baignoire", "Vue mer", "Salon"], isActive: true },
  { id: "5", name: "Bungalow de Plage", type: "Bungalow", capacity: 4, pricePerNight: 120000, images: ["https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=600&q=80"], amenities: ["Wifi", "Climatisation", "Parking", "Vue mer"], isActive: true },
];

export default function HebergementTypePage() {
  const { slug } = useParams<{ slug: string }>();
  const typeInfo = TYPES[slug as string];
  const [rooms, setRooms] = useState<Room[]>(DEFAULT_ROOMS);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  useEffect(() => {
    fetch("/api/rooms")
      .then(r => r.json())
      .then(d => { if (d.data?.length > 0) setRooms(d.data.filter((r: Room) => r.isActive)); })
      .catch(() => {});
  }, []);

  const label = typeInfo?.label ?? "Hébergements";
  const image = typeInfo?.image ?? "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1600&q=80";

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative text-white py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src={image} alt={label} className="w-full h-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/services/hebergement" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6 transition-colors">
            <ChevronLeft size={16} /> Retour à l'hébergement
          </Link>
          <div className="max-w-2xl">
            {typeInfo?.stars > 0 && (
              <div className="flex gap-1 mb-3">
                {Array.from({ length: typeInfo.stars }).map((_, i) => (
                  <Star key={i} size={16} className="text-[#c9a84c] fill-[#c9a84c]" />
                ))}
              </div>
            )}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-2 mb-4">{label}</h1>
            {typeInfo && (
              <>
                <p className="text-gray-100 text-lg leading-relaxed mb-4">{typeInfo.description}</p>
                <p className="text-[#c9a84c] font-bold text-lg">{typeInfo.priceFrom.toLocaleString()} — {typeInfo.priceTo.toLocaleString()} FCFA / nuit</p>
              </>
            )}
            <a href="#chambres" className="btn-primary mt-6 inline-flex">
              Voir les chambres <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* Chambres */}
      <section id="chambres" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest">{label}</span>
            <h2 className="section-title mt-2">Nos hébergements disponibles</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {rooms.filter(r => r.isActive).map(r => (
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
                    {r.amenities.map(a => (
                      <span key={a} className="flex items-center gap-1 text-xs bg-[#f0f9ff] text-[#38bdf8] px-2 py-1 rounded-full">
                        {AMENITY_ICONS[a] ?? <Star size={11} className="text-[#38bdf8]" />} {a}
                      </span>
                    ))}
                  </div>
                  <button onClick={() => setSelectedRoom(r)} className="btn-primary w-full justify-center text-sm py-2">
                    Réserver <ArrowRight size={14} />
                  </button>
                  <Link href={`/services/hebergement/${r.id}`}
                    className="mt-2 w-full flex items-center justify-center gap-1 text-sm font-semibold text-[#0c4a6e] border border-[#0c4a6e]/20 rounded-xl py-2 hover:bg-[#0c4a6e]/5 transition-colors">
                    Voir détail <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Autres types */}
      <section className="py-12 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="font-bold text-[#0c4a6e] mb-6 text-center">Autres types d'hébergement</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(TYPES).filter(([s]) => s !== slug).map(([s, t]) => (
              <Link key={s} href={`/services/hebergement/type/${s}`}
                className="group relative rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="relative h-28">
                  <img src={t.image} alt={t.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <p className="absolute bottom-2 left-3 right-3 text-white text-xs font-semibold leading-tight">{t.label}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {selectedRoom && (
        <ReservationModal
          isOpen={!!selectedRoom}
          onClose={() => setSelectedRoom(null)}
          title={selectedRoom.name}
          details={`${selectedRoom.type} · ${selectedRoom.capacity} personnes · ${selectedRoom.pricePerNight.toLocaleString()} FCFA/nuit`}
        />
      )}
    </div>
  );
}
