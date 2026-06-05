"use client";
import { useEffect, useState } from "react";
import { ArrowRight, Star, Clock, Utensils, Bed, Compass, Music, Car, MapPin, Sparkles } from "lucide-react";
import Link from "next/link";
import ExcursionBookingForm from "@/components/frontend/excursions/ExcursionBookingForm";

type Excursion = {
  id: string; title: string; duration: string; priceAdult: number; priceChild?: number;
  images: string[]; avgRating?: number; location?: string;
};

const categories = [
  {
    icon: Utensils, label: "Où Manger", color: "from-orange-500 to-amber-500",
    items: ["Restaurants gastronomiques", "Maquis ambiance", "Grillades bord de mer", "Fast-food"],
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    link: "/services/tourisme/ou-manger",
  },
  {
    icon: Bed, label: "Où Dormir", color: "from-blue-600 to-cyan-500",
    items: ["Hôtels 4-5★", "Résidences bord de mer", "Auberges", "Locations"],
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80",
    link: "/services/hebergement",
  },
  {
    icon: Compass, label: "Où Voyager", color: "from-emerald-600 to-teal-500",
    items: ["Excursions bateau", "Grand-Bassam UNESCO", "Safari nature", "Guides 6 langues"],
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    link: "/services/tourisme/ou-voyager",
  },
  {
    icon: Music, label: "Se Divertir", color: "from-violet-600 to-purple-500",
    items: ["Maquis live", "Bars lounge", "Nightclubs", "Karaoké"],
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80",
    link: "/services/evenements",
  },
  {
    icon: Car, label: "Location", color: "from-rose-600 to-red-500",
    items: ["Voitures", "4x4 SUV", "Avec chauffeur", "Bus groupes"],
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80",
    link: "/services/vehicules",
  },
];

const DEFAULT_EXCURSIONS: Excursion[] = [
  { id: "bateau-fleuve", title: "Balade en bateau lagunaire", duration: "3h", priceAdult: 15000, images: ["https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80"], avgRating: 5, location: "Abidjan" },
  { id: "littoral-decouverte", title: "Découverte du littoral", duration: "Journée", priceAdult: 25000, images: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80"], avgRating: 5, location: "Grand-Bassam" },
  { id: "villages-pecheurs", title: "Villages de pêcheurs", duration: "4h", priceAdult: 18000, images: ["https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80"], avgRating: 4, location: "Jacqueville" },
  { id: "bassam-unesco", title: "Grand-Bassam UNESCO", duration: "Journée", priceAdult: 15000, images: ["https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80"], avgRating: 5, location: "Grand-Bassam" },
  { id: "assinie", title: "Week-end Assinie-Mafia", duration: "Week-end", priceAdult: 25000, images: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80"], avgRating: 5, location: "Assinie" },
  { id: "jacqueville", title: "Jacqueville Île & Lagune", duration: "Journée", priceAdult: 12000, images: ["https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80"], avgRating: 4, location: "Jacqueville" },
];

export default function TourismePage() {
  const [excursions, setExcursions] = useState<Excursion[]>(DEFAULT_EXCURSIONS);
  const [selectedExcursion, setSelectedExcursion] = useState<Excursion | null>(null);

  useEffect(() => {
    fetch("/api/excursions")
     .then(r => r.json())
     .then(d => { if (d.data?.length) setExcursions(d.data); })
     .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#020617]">
      {/* HERO PREMIUM */}
      <section className="relative h- sm:h- min-h- flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="/Images/cotiere-tourisme-voyage.png" alt="Tourisme" className="w-full h-full object-cover scale-105" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#020617]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.15),transparent_60%)]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full mb-5">
              <Sparkles size={14} className="text-[#c9a84c]" />
              <span className="text- font-semibold tracking-widest uppercase text-white/90">Littoral Ivoirien</span>
            </div>
            <h1 className="text-[clamp(2.5rem,8vw,4.5rem)] font-black leading-[0.9] tracking-tighter text-white mb-4">
              Tourisme
              <span className="block bg-gradient-to-r from-[#c9a84c] to-[#e0c070] bg-clip-text text-transparent">& Voyage</span>
            </h1>
            <p className="text-white/70 text-base sm:text-lg leading-relaxed mb-8 max-w-lg">
              13 villes côtières, guides certifiés, expériences authentiques. De Grand-Bassam à Tabou.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="#voyages" className="group inline-flex items-center justify-center gap-2 bg-[#c9a84c] hover:bg-[#d4b456] text-black font-semibold px-6 py-3.5 rounded-xl transition-all active:scale-[0.98]">
                Explorer <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
              </a>
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 backdrop-blur border border-white/20 text-white px-6 py-3.5 rounded-xl transition-all">
                Devis gratuit
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CATÉGORIES */}
      <section className="relative py-16 sm:py-20 -mt-10 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Tout pour votre séjour</h2>
            <p className="text-white/50 text-sm">5 univers, un seul interlocuteur</p>
          </div>

          {/* Mobile: scroll horizontal */}
          <div className="lg:hidden -mx-4 px-4 overflow-x-auto scrollbar-hide">
            <div className="flex gap-4 pb-4">
              {categories.map((cat) => (
                <Link key={cat.label} href={cat.link} className="group shrink-0 w-">
                  <div className="relative h- rounded- overflow-hidden">
                    <img src={cat.image} alt={cat.label} className="w-full h-full object-cover transition-transform duration-700 group-active:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className={`absolute top-4 left-4 w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-lg`}>
                      <cat.icon size={20} className="text-white" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="text-white font-bold text-lg mb-2">{cat.label}</h3>
                      <div className="space-y-1">
                        {cat.items.slice(0,3).map(item => (
                          <p key={item} className="text-white/70 text-xs flex items-center gap-1.5">
                            <span className="w-1 h-1 bg-white/60 rounded-full" />{item}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop: grid */}
          <div className="hidden lg:grid grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link key={cat.label} href={cat.link} className="group relative h- rounded- overflow-hidden">
                <img src={cat.image} alt={cat.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                <div className={`absolute top-4 left-4 w-11 h-11 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-xl`}>
                  <cat.icon size={20} className="text-white" />
                </div>
                <div className="absolute bottom-0 p-5">
                  <h3 className="text-white font-bold mb-2 group-hover:text-[#c9a84c] transition-colors">{cat.label}</h3>
                  <p className="text-white/60 text-xs opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                    Voir les options →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* EXCURSIONS */}
      <section id="voyages" className="py-16 sm:py-20 bg-[#0a0f1c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-[#c9a84c] text- font-semibold uppercase tracking-widest">Nos coups de cœur</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">Excursions premium</h2>
            </div>
            <Link href="/services/tourisme/ou-voyager" className="hidden sm:flex items-center gap-1.5 text-white/60 hover:text-[#c9a84c] text-sm">
              Tout voir <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {excursions.map((e, index) => (
              <div key={`${e.id}-${index}`} className="group relative bg-white/[0.03] backdrop-blur border border-white/10 rounded- overflow-hidden hover:bg-white/[0.05] hover:border-white/20 transition-all">
                <div className="relative h- overflow-hidden">
                  <img src={e.images[0]} alt={e.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                  {/* Prix */}
                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full">
                    <span className="text-[#c9a84c] font-bold text-sm">{e.priceAdult.toLocaleString()}</span>
                    <span className="text-white/60 text- ml-1">FCFA</span>
                  </div>

                  {/* Location */}
                  {e.location && (
                    <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/50 backdrop-blur px-2.5 py-1 rounded-full">
                      <MapPin size={12} className="text-white/70" />
                      <span className="text-white/80 text-">{e.location}</span>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    {e.avgRating && (
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={12} className={`${i < e.avgRating!? "text-[#c9a84c] fill-[#c9a84c]" : "text-white/20"}`} />
                        ))}
                      </div>
                    )}
                    <span className="text-white/40 text- flex items-center gap-1">
                      <Clock size={11} />{e.duration}
                    </span>
                  </div>

                  <h3 className="text-white font-semibold mb-4 line-clamp-2 min-h-">{e.title}</h3>

                  <div className="flex gap-2">
                    <button onClick={() => setSelectedExcursion(e)}
                      className="flex-1 bg-[#c9a84c] hover:bg-[#d4b456] text-black font-semibold text- py-2.5 rounded-xl transition-all active:scale-[0.98]">
                      Réserver
                    </button>
                    <Link href={`/services/tourisme/${e.id}`}
                      className="w-10 h- bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center transition-colors">
                      <ArrowRight size={16} className="text-white/60" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">Voyage sur mesure?</h3>
          <p className="text-white/60 mb-6">On crée votre itinéraire en 24h. Groupe, famille, entreprise.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/20 text-white px-6 py-3 rounded-xl transition-all">
            Discuter avec un expert <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <ExcursionBookingForm
        excursion={selectedExcursion? {
          id: selectedExcursion.id,
          title: selectedExcursion.title,
          duration: selectedExcursion.duration,
          priceAdult: selectedExcursion.priceAdult,
          priceChild: selectedExcursion.priceChild?? Math.round(selectedExcursion.priceAdult * 0.5),
          maxParticipants: 20,
          options: [],
          timeSlots: [],
        } : { id: "", title: "", duration: "", priceAdult: 0, priceChild: 0, maxParticipants: 20, options: [], timeSlots: [] }}
        isOpen={!!selectedExcursion}
        onClose={() => setSelectedExcursion(null)}
      />

      <style jsx>{`
       .scrollbar-hide::-webkit-scrollbar { display: none; }
       .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}