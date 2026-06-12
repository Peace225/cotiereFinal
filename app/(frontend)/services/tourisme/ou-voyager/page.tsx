"use client";

import { ArrowRight, Ship, Camera, Globe, Compass, Clock, MapPin } from "lucide-react";
import Link from "next/link";

// Force le rendu dynamique pour assurer la stabilité du build sur Vercel
export const dynamic = 'force-dynamic';

const destinations = [
  { id: "grand-bassam", name: "Grand-Bassam", subtitle: "Patrimoine UNESCO", image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80", desc: "Ancienne capitale coloniale classée au patrimoine mondial de l'UNESCO.", duration: "Journée complète", price: "15 000 FCFA" },
  { id: "assinie", name: "Assinie-Mafia", subtitle: "Plages & Lagune", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80", desc: "Station balnéaire prisée entre océan et lagune d'Aby.", duration: "Week-end", price: "25 000 FCFA" },
  { id: "jacqueville", name: "Jacqueville", subtitle: "Île & Lagune Ébrié", image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80", desc: "Île accessible par pont, entre lagune Ébrié et océan Atlantique.", duration: "Journée", price: "12 000 FCFA" },
];

const activities = [
  { icon: Ship, label: "Excursions en bateau", desc: "Découverte de la lagune et de l'océan" },
  { icon: Camera, label: "Visites patrimoine", desc: "Circuits guidés des sites historiques" },
  { icon: Globe, label: "Guides multilingues", desc: "Guides en 6 langues disponibles" },
  { icon: Compass, label: "Safari nature", desc: "Observation de la faune et flore" },
];

export default function OuVoyagerPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[#0c4a6e]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <Link href="/services/tourisme" className="text-white/70 hover:text-white text-sm flex items-center gap-1 mb-4">← Retour au Tourisme</Link>
            <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest">Tourisme & Voyage</span>
            <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">Où Voyager</h1>
            <p className="text-gray-100 text-lg leading-relaxed">
              Découvrez les plus belles destinations du littoral ivoirien. Excursions guidées, visites culturelles et aventures nature sur 500 km de côtes.
            </p>
            <a href="#destinations" className="btn-primary mt-8 inline-block">Voir les destinations</a>
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section id="destinations" className="py-16 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map(d => (
              <div key={d.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="h-48 overflow-hidden">
                  <img src={d.image} alt={d.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-[#0c4a6e] text-lg mb-1">{d.name}</h3>
                  <p className="text-gray-500 text-sm mb-4">{d.desc}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                    <span className="flex items-center gap-1"><Clock size={12} /> {d.duration}</span>
                    <span className="flex items-center gap-1 text-[#c9a84c] font-semibold"><MapPin size={12} /> {d.price}</span>
                  </div>
                  <Link href="/services/tourisme" className="btn-primary w-full justify-center text-sm py-2">
                    Réserver ce voyage <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}