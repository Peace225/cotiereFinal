"use client";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Star, Check, Users, Wifi, Wind, Tv, Bath, Coffee, Car, ShowerHead, Flower2, Shirt, Phone, ShieldCheck } from "lucide-react";

const ROOMS = [
  { name: "Chambre Confort", price: "40 000", capacity: 2, surface: 28, image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80", features: ["Salle de bain privée", "TV écran plat", "Climatisation"] },
  { name: "Chambre Standard Double", price: "30 000", capacity: 2, surface: 22, image: "https://images.unsplash.com/photo-1631049421450-348ccd7f8949?w=600&q=80", features: ["Douche privée", "Wifi inclus", "Vue jardin"] },
  { name: "Chambre Twin", price: "35 000", capacity: 2, surface: 25, image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&q=80", features: ["2 lits simples", "Bureau de travail", "Coffre-fort"] },
];

const INCLUS = [
  "Petit-déjeuner continental inclus",
  "Wifi haut débit gratuit",
  "Climatisation 24h/24",
  "Linge de maison & serviettes",
  "Coffre-fort en chambre",
  "Ménage quotidien",
  "Réception 24h/24",
  "Parking gratuit",
  "Eau minérale à l'arrivée",
  "Sèche-cheveux",
];

export default function HotelsStandardsPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <section className="relative h-72 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1600&q=80" alt="Hôtels standards" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20" />
        <div className="absolute inset-0 flex flex-col justify-end p-8 max-w-6xl mx-auto">
          <Link href="/services/hebergement" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-4 transition-colors w-fit">
            <ArrowLeft size={16} /> Retour à l'hébergement
          </Link>
          <div className="flex items-center gap-2 mb-2">
            {[1,2,3].map(i => <Star key={i} size={16} className="text-[#c9a84c] fill-[#c9a84c]" />)}
          </div>
          <h1 className="text-4xl font-black text-white">Hôtels Standards</h1>
          <p className="text-white/80 mt-2 max-w-xl">Confort et praticité à prix accessible. Idéal pour les voyageurs d'affaires, les familles et les séjours de courte durée.</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-10 sm:px-6 lg:px-8 space-y-10">

        <section>
          <h2 className="text-2xl font-bold text-[#0c4a6e] mb-6">Nos chambres disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ROOMS.map(r => (
              <div key={r.name} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="relative h-44">
                  <img src={r.image} alt={r.name} className="w-full h-full object-cover" />
                  <span className="absolute top-3 right-3 bg-[#c9a84c] text-white text-xs font-bold px-3 py-1 rounded-full">{r.price} FCFA/nuit</span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-[#0c4a6e] mb-1">{r.name}</h3>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1"><Users size={12} /> {r.capacity} pers.</span>
                    <span>{r.surface} m²</span>
                  </div>
                  <div className="space-y-1 mb-4">
                    {r.features.map(f => (
                      <div key={f} className="flex items-center gap-2 text-xs text-gray-600">
                        <Check size={11} className="text-[#c9a84c]" /> {f}
                      </div>
                    ))}
                  </div>
                  <Link href="/services/hebergement#chambres" className="btn-primary w-full justify-center text-sm py-2">
                    Réserver <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-[#0c4a6e] mb-5 flex items-center gap-2">
            <Check size={18} className="text-green-500" /> Ce qui est inclus
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {INCLUS.map(item => (
              <div key={item} className="flex items-center gap-2 text-sm text-gray-600">
                <Check size={13} className="text-green-500 shrink-0" /> {item}
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-[#0c4a6e] mb-5 flex items-center gap-2">
            <ShowerHead size={18} className="text-[#38bdf8]" /> Salle de bain
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { icon: <ShowerHead size={15} />, label: "Douche privée" },
              { icon: <Bath size={15} />, label: "Eau chaude 24h/24" },
              { icon: <Flower2 size={15} />, label: "Savon & shampoing" },
              { icon: <Shirt size={15} />, label: "Serviettes (2 jeux)" },
              { icon: <ShowerHead size={15} />, label: "Sèche-cheveux" },
              { icon: <Star size={15} />, label: "Kit hygiène de base" },
            ].map((e, i) => (
              <div key={i} className="flex items-center gap-3 bg-[#f0f9ff] border border-[#bae6fd] rounded-xl p-3">
                <div className="text-[#38bdf8]">{e.icon}</div>
                <span className="text-sm text-gray-700">{e.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-[#0c4a6e] mb-5">Équipements</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: <Wifi size={20} className="text-[#38bdf8]" />, label: "Wifi gratuit" },
              { icon: <Wind size={20} className="text-[#38bdf8]" />, label: "Climatisation" },
              { icon: <Tv size={20} className="text-[#38bdf8]" />, label: "TV écran plat" },
              { icon: <Coffee size={20} className="text-[#38bdf8]" />, label: "Bouilloire" },
              { icon: <Car size={20} className="text-[#38bdf8]" />, label: "Parking gratuit" },
              { icon: <ShieldCheck size={20} className="text-[#38bdf8]" />, label: "Coffre-fort" },
            ].map(({ icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2 p-4 bg-[#f8fafc] rounded-xl border border-gray-100 text-center">
                {icon}
                <span className="text-xs font-medium text-gray-600">{label}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="bg-gradient-to-r from-[#0c4a6e] to-[#0e5a82] rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-2">Réservez votre chambre</h3>
          <p className="text-white/70 mb-6">À partir de 30 000 FCFA/nuit · Petit-déjeuner inclus</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/services/hebergement#chambres" className="btn-primary">Voir les chambres <ArrowRight size={16} /></Link>
            <a href="tel:+2250747722931" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
              <Phone size={16} /> Appeler
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

