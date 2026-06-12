"use client";

import { useEffect, useState } from "react";
import { ArrowRight, MapPin, Clock, Ship, Camera, Globe, Compass, Star } from "lucide-react";
import Link from "next/link";
import ExcursionBookingForm from "@/components/frontend/excursions/ExcursionBookingForm";

// Force le rendu dynamique pour éviter les erreurs de génération statique au build
export const dynamic = 'force-dynamic';

type Excursion = {
  id: string; title: string; duration: string; priceAdult: number; priceChild?: number;
  images: string[]; avgRating?: number;
};

const DEFAULT_EXCURSIONS: Excursion[] = [
  { id: "grand-bassam", title: "Grand-Bassam — Patrimoine UNESCO", duration: "Journée complète", priceAdult: 15000, images: ["https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80"], avgRating: 5 },
  { id: "assinie", title: "Week-end à Assinie-Mafia", duration: "Week-end", priceAdult: 25000, images: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80"], avgRating: 5 },
  { id: "jacqueville", title: "Jacqueville — Île & Lagune Ébrié", duration: "Journée", priceAdult: 12000, images: ["https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80"], avgRating: 4 },
];

export default function TourismePage() {
  const [excursions, setExcursions] = useState<Excursion[]>(DEFAULT_EXCURSIONS);
  const [selectedExcursion, setSelectedExcursion] = useState<Excursion | null>(null);

  useEffect(() => {
    fetch("/api/excursions")
      .then(r => r.json())
      .then(d => { if (d.data?.length > 0) setExcursions(d.data); })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Tourisme & Voyage</h1>
          <p className="text-gray-100 text-lg max-w-2xl">Découvrez le littoral ivoirien avec nos guides expérimentés.</p>
          <a href="#voyages" className="btn-primary mt-8 inline-block">Voir nos voyages</a>
        </div>
      </section>

      {/* Destinations Grid */}
      <section id="voyages" className="py-16 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {excursions.map(e => (
              <div key={e.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <img src={e.images[0]} alt={e.title} className="w-full h-48 object-cover rounded-xl mb-4" />
                <h3 className="font-bold text-[#0c4a6e] mb-2">{e.title}</h3>
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1"><Clock size={12} /> {e.duration}</span>
                  <span className="font-semibold text-[#c9a84c]">{e.priceAdult.toLocaleString()} FCFA</span>
                </div>
                <button onClick={() => setSelectedExcursion(e)} className="btn-primary w-full py-2">Réserver</button>
                <Link href={`/services/tourisme/${e.id}`} className="mt-2 block text-center text-sm font-semibold text-[#0c4a6e]">Voir détail</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulaire Modal */}
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