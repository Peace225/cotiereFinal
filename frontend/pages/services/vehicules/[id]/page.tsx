import { ArrowRight, Phone, Car, Shield, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import ReservationModal from "@/components/frontend/ReservationModal";

const vehicules = [
  {
    id: "citadine", nom: "Voiture Citadine", categorie: "Économique", description: "Idéale pour les déplacements en ville. Climatisée, économique en carburant.", prix: "15 000 FCFA/jour", caution: "50 000 FCFA", places: 5, image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=80",
  },
  {
    id: "suv", nom: "4x4 / SUV", categorie: "Tout-terrain", description: "Parfait pour les excursions et les routes difficiles du littoral. Confort et puissance.", prix: "35 000 FCFA/jour", caution: "150 000 FCFA", places: 7, image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&q=80",
  },
  {
    id: "moto", nom: "Moto / Scooter", categorie: "Deux-roues", description: "Pratique pour se déplacer rapidement dans les ruelles et sur la côte.", prix: "8 000 FCFA/jour", caution: "30 000 FCFA", places: 2, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  },
  {
    id: "avec-chauffeur", nom: "Avec Chauffeur", categorie: "Service premium", description: "Chauffeur professionnel disponible 24h/24. Connaît parfaitement le littoral ivoirien.", prix: "50 000 FCFA/jour", caution: "Aucune", places: 4, image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&q=80",
  },
  {
    id: "minibus", nom: "Bus / Minibus", categorie: "Groupe", description: "Pour vos sorties en groupe, excursions et transferts d'équipes. Climatisé.", prix: "80 000 FCFA/jour", caution: "200 000 FCFA", places: 20, image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80",
  },
  {
    id: "luxe", nom: "Véhicule de Luxe", categorie: "Premium", description: "Mercedes, BMW ou équivalent pour vos occasions spéciales et déplacements VIP.", prix: "100 000 FCFA/jour", caution: "500 000 FCFA", places: 5, image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80",
  },
];

const avantages = [
  { icon: Shield, label: "Assurance incluse", desc: "Tous nos véhicules sont assurés" },
  { icon: Clock, label: "Disponible 24h/24", desc: "Service disponible à toute heure" },
  { icon: MapPin, label: "Livraison possible", desc: "Livraison à votre hôtel ou adresse" },
  { icon: Car, label: "Flotte récente", desc: "Véhicules de moins de 3 ans" },
];

export default function VehiculesPage() {
  return (
    <div className="min-h-screen">
      <section className="relative text-white py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1600&q=80" alt="Location Véhicules" className="w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest">Location de véhicules</span>
            <h1 className="text-2xl sm:text-2xl sm:text-4xl md:text-5xl font-bold mt-2 mb-4">Location Véhicules</h1>
            <p className="text-gray-100 text-lg leading-relaxed">
              Voitures, 4x4, motos, bus et véhicules avec chauffeur pour tous vos déplacements sur le littoral ivoirien.
            </p>
            <div className="flex gap-3 mt-8">
              <a href="#catalogue" className="btn-primary inline-flex items-center gap-2">Voir les véhicules <ArrowRight size={18} /></a>
              <a href="tel:+2250747722931" className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-bold px-5 py-3 rounded-xl hover:bg-white/20 transition-colors">
                <Phone size={18} /> Réserver
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 bg-[#f0f9ff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {avantages.map(a => {
              const Icon = a.icon;
              return (
                <div key={a.label} className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-100">
                  <div className="w-12 h-12 bg-[#0c4a6e]/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Icon size={22} className="text-[#0c4a6e]" />
                  </div>
                  <p className="font-bold text-[#0c4a6e] text-sm mb-1">{a.label}</p>
                  <p className="text-gray-400 text-xs">{a.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="catalogue" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest">Notre flotte</span>
            <h2 className="section-title mt-2">Choisissez votre véhicule</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicules.map(v => (
              <div key={v.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 card-hover">
                <div className="relative h-44">
                  <img src={v.image} alt={v.nom} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 bg-[#c9a84c] text-white text-xs font-bold px-2.5 py-1 rounded-full">{v.categorie}</span>
                  <span className="absolute top-3 right-3 bg-white/90 text-[#0c4a6e] text-xs font-bold px-2.5 py-1 rounded-full">{v.places} places</span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-[#0c4a6e] mb-1">{v.nom}</h3>
                  <p className="text-xs text-gray-500 mb-2">{v.description}</p>
                  <div className="flex justify-between text-xs mb-4">
                    <span className="font-bold text-[#c9a84c]">{v.prix}</span>
                    <span className="text-gray-400">Caution: {v.caution}</span>
                  </div>
                  <Link href="/reservation" className="btn-primary w-full justify-center text-sm py-2">
                    Réserver <ArrowRight size={14} />
                  </Link>
                  <Link href={"/services/vehicules/" + v.id} className="mt-2 w-full flex items-center justify-center gap-1 text-sm font-semibold text-[#0c4a6e] border border-[#0c4a6e]/20 rounded-xl py-2 hover:bg-[#0c4a6e]/5 transition-colors">
                    Voir détail <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0c4a6e] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Besoin d&apos;un véhicule sur mesure ?</h2>
          <p className="text-gray-300 mb-8">Contactez-nous pour un devis personnalisé ou une location longue durée.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="btn-primary inline-flex items-center gap-2">Nous contacter <ArrowRight size={18} /></Link>
            <a href="tel:+2250747722931" className="flex items-center gap-2 bg-white/10 border border-white/30 text-white font-bold px-5 py-3 rounded-xl hover:bg-white/20 transition-colors">
              <Phone size={18} /> 07 47 72 29 31
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
