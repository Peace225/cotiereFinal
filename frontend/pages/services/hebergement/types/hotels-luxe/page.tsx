"use client";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Star, Check, MapPin, Users, Wifi, Wind, Tv, Bath, Coffee, Car, ShowerHead, Flower2, Shirt, Phone, ShieldCheck } from "lucide-react";

const ROOMS = [
  { name: "Suite Présidentielle", price: "150 000", capacity: 2, surface: 80, image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80", features: ["Vue mer panoramique", "Jacuzzi privé", "Butler dédié"] },
  { name: "Suite Royale", price: "120 000", capacity: 2, surface: 65, image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80", features: ["Terrasse privée", "Baignoire balnéo", "Salon séparé"] },
  { name: "Chambre Deluxe", price: "85 000", capacity: 2, surface: 45, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80", features: ["Vue mer", "Literie grand luxe", "Mini-bar premium"] },
];

const INCLUS = [
  "Petit-déjeuner gastronomique inclus",
  "Accès spa & piscine infinity",
  "Wifi fibre optique (500 Mbps)",
  "Service de conciergerie 24h/24",
  "Navette aéroport incluse",
  "Parking voiturier",
  "Room service 24h/24",
  "Coffre-fort numérique",
  "Peignoirs & chaussons de luxe",
  "Produits de bain Hermès / L'Occitane",
  "Bouteille de champagne à l'arrivée",
  "Ménage 2x/jour",
];

const EQUIPEMENTS_SDB = [
  { icon: <Bath size={15} />, label: "Baignoire balnéo" },
  { icon: <ShowerHead size={15} />, label: "Douche à effet pluie" },
  { icon: <Flower2 size={15} />, label: "Produits de bain premium" },
  { icon: <Shirt size={15} />, label: "Peignoirs & chaussons" },
  { icon: <ShowerHead size={15} />, label: "Sèche-cheveux professionnel" },
  { icon: <Star size={15} />, label: "Miroir éclairé anti-buée" },
];

export default function HotelsLuxePage() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Hero */}
      <section className="relative h-72 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1600&q=80" alt="Hôtels de luxe" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20" />
        <div className="absolute inset-0 flex flex-col justify-end p-8 max-w-6xl mx-auto">
          <Link href="/services/hebergement" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-4 transition-colors w-fit">
            <ArrowLeft size={16} /> Retour à l'hébergement
          </Link>
          <div className="flex items-center gap-2 mb-2">
            {[1,2,3,4,5].map(i => <Star key={i} size={16} className="text-[#c9a84c] fill-[#c9a84c]" />)}
          </div>
          <h1 className="text-4xl font-black text-white">Hôtels de Luxe</h1>
          <p className="text-white/80 mt-2 max-w-xl">Une expérience hôtelière d'exception sur le littoral ivoirien. Prestations 5 étoiles, service personnalisé et vue imprenable sur l'océan.</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-10 sm:px-6 lg:px-8 space-y-10">

        {/* Chambres disponibles */}
        <section>
          <h2 className="text-2xl font-bold text-[#0c4a6e] mb-6">Nos suites & chambres</h2>
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

        {/* Ce qui est inclus */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-[#0c4a6e] mb-5 flex items-center gap-2">
            <Check size={18} className="text-green-500" /> Tout ce qui est inclus
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {INCLUS.map(item => (
              <div key={item} className="flex items-center gap-2 text-sm text-gray-600 bg-green-50 px-3 py-2 rounded-xl">
                <Check size={13} className="text-green-500 shrink-0" /> {item}
              </div>
            ))}
          </div>
        </section>

        {/* Salle de bain */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-[#0c4a6e] mb-5 flex items-center gap-2">
            <ShowerHead size={18} className="text-[#38bdf8]" /> Salle de bain & accessoires
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {EQUIPEMENTS_SDB.map((e, i) => (
              <div key={i} className="flex items-center gap-3 bg-[#f0f9ff] border border-[#bae6fd] rounded-xl p-3">
                <div className="text-[#38bdf8]">{e.icon}</div>
                <span className="text-sm text-gray-700">{e.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Équipements */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-[#0c4a6e] mb-5">Équipements & services</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: <Wifi size={20} className="text-[#38bdf8]" />, label: "Wifi 500 Mbps" },
              { icon: <Wind size={20} className="text-[#38bdf8]" />, label: "Clim silencieuse" },
              { icon: <Tv size={20} className="text-[#38bdf8]" />, label: "TV 65\" 4K" },
              { icon: <Coffee size={20} className="text-[#38bdf8]" />, label: "Machine Nespresso" },
              { icon: <Car size={20} className="text-[#38bdf8]" />, label: "Voiturier" },
              { icon: <MapPin size={20} className="text-[#38bdf8]" />, label: "Vue mer" },
              { icon: <ShieldCheck size={20} className="text-[#38bdf8]" />, label: "Coffre-fort" },
              { icon: <Star size={20} className="text-[#38bdf8]" />, label: "Spa & piscine" },
            ].map(({ icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2 p-4 bg-[#f8fafc] rounded-xl border border-gray-100 text-center">
                {icon}
                <span className="text-xs font-medium text-gray-600">{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-r from-[#0c4a6e] to-[#0e5a82] rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-2">Réservez votre séjour de luxe</h3>
          <p className="text-white/70 mb-6">Disponibilités limitées · Réponse sous 24h · Acompte 30%</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/services/hebergement#chambres" className="btn-primary">Voir les chambres <ArrowRight size={16} /></Link>
            <a href="tel:+2250747722931" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
              <Phone size={16} /> Appeler maintenant
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

