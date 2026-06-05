"use client";
import { useParams } from "next/navigation";
import { ArrowRight, Phone, Car, Shield, Clock, MapPin, Users, ChevronLeft } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import ReservationModal from "@/components/frontend/ReservationModal";
import ImageZoom from "@/components/frontend/ImageZoom";

const vehicules = [
  { id: "citadine", nom: "Voiture Citadine", categorie: "Économique", description: "Idéale pour les déplacements en ville. Climatisée, économique en carburant. Parfaite pour explorer les villes du littoral ivoirien.", prix: "15 000 FCFA/jour", caution: "50 000 FCFA", places: 5, image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80", features: ["Climatisation", "GPS inclus", "Assurance tous risques", "Kilométrage illimité"] },
  { id: "suv", nom: "4x4 / SUV", categorie: "Tout-terrain", description: "Parfait pour les excursions et les routes difficiles du littoral. Confort et puissance pour 7 personnes.", prix: "35 000 FCFA/jour", caution: "150 000 FCFA", places: 7, image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80", features: ["4x4 tout-terrain", "Climatisation", "7 places", "Idéal excursions"] },
  { id: "moto", nom: "Moto / Scooter", categorie: "Deux-roues", description: "Pratique pour se déplacer rapidement dans les ruelles et sur la côte. Économique et agile.", prix: "8 000 FCFA/jour", caution: "30 000 FCFA", places: 2, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80", features: ["Casque fourni", "Assurance incluse", "Économique", "Facile à garer"] },
  { id: "avec-chauffeur", nom: "Avec Chauffeur", categorie: "Service premium", description: "Chauffeur professionnel disponible 24h/24. Connaît parfaitement le littoral ivoirien. Service VIP.", prix: "50 000 FCFA/jour", caution: "Aucune", places: 4, image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80", features: ["Chauffeur professionnel", "Disponible 24h/24", "Connaissance du littoral", "Service VIP"] },
  { id: "minibus", nom: "Bus / Minibus", categorie: "Groupe", description: "Pour vos sorties en groupe, excursions et transferts d'équipes. Climatisé, jusqu'à 20 personnes.", prix: "80 000 FCFA/jour", caution: "200 000 FCFA", places: 20, image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80", features: ["20 places", "Climatisation", "Idéal groupes", "Chauffeur inclus"] },
  { id: "luxe", nom: "Véhicule de Luxe", categorie: "Premium", description: "Mercedes, BMW ou équivalent pour vos occasions spéciales et déplacements VIP. Confort absolu.", prix: "100 000 FCFA/jour", caution: "500 000 FCFA", places: 5, image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80", features: ["Véhicule premium", "Chauffeur en costume", "Bouteille d'eau offerte", "Parfait occasions spéciales"] },
];

export default function VehiculeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const v = vehicules.find(x => x.id === id);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  if (!v) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-gray-500 text-lg">Véhicule introuvable.</p>
      <Link href="/services/vehicules" className="btn-primary">Retour aux véhicules</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-[#0c4a6e]">Accueil</Link>
          <span>/</span>
          <Link href="/services/vehicules" className="hover:text-[#0c4a6e]">Véhicules</Link>
          <span>/</span>
          <span className="text-[#0c4a6e] font-medium">{v.nom}</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <Link href="/services/vehicules" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#0c4a6e] mb-6 transition-colors">
          <ChevronLeft size={16} /> Retour aux véhicules
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Galerie images */}
            <div className="relative md:h-full min-h-[300px] bg-gray-100 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none overflow-hidden">
              <span className="absolute top-4 left-4 bg-[#c9a84c] text-white text-xs font-bold px-3 py-1.5 rounded-full z-10">{v.categorie}</span>
              <span className="absolute top-4 right-4 bg-white/90 text-[#0c4a6e] text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 z-10">
                <Users size={12} /> {v.places} places
              </span>
              <ImageZoom
                images={[v.image]}
                alt={v.nom}
                activeImg={activeImg}
                setActiveImg={setActiveImg}
              />
            </div>

            {/* Infos */}
            <div className="p-8 flex flex-col justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[#0c4a6e] mb-2">{v.nom}</h1>
                <p className="text-gray-600 mb-6 leading-relaxed">{v.description}</p>

                <div className="bg-[#faf8f4] rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500 text-sm">Prix / jour</span>
                    <span className="text-2xl font-black text-[#c9a84c]">{v.prix}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">Caution</span>
                    <span className="text-sm font-semibold text-[#0c4a6e]">{v.caution}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-6">
                  {v.features.map(f => (
                    <div key={f} className="flex items-center gap-2 text-xs text-gray-600 bg-[#f0f9ff] px-3 py-2 rounded-lg">
                      <span className="w-1.5 h-1.5 bg-[#c9a84c] rounded-full shrink-0" /> {f}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <button onClick={() => setModalOpen(true)} className="btn-primary w-full justify-center py-3">
                  Réserver maintenant <ArrowRight size={16} />
                </button>
                <a href={`https://wa.me/2250747722931?text=${encodeURIComponent(`Bonjour, je souhaite louer : ${v.nom} (${v.prix}). Merci.`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold py-3 rounded-xl transition-colors">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Réserver via WhatsApp
                </a>
                <a href="tel:+2250747722931" className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <Phone size={16} /> Appeler pour réserver
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Avantages */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Shield, label: "Assurance incluse" },
            { icon: Clock, label: "Disponible 24h/24" },
            { icon: MapPin, label: "Livraison possible" },
            { icon: Car, label: "Flotte récente" },
          ].map(a => {
            const Icon = a.icon;
            return (
              <div key={a.label} className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
                <Icon size={20} className="text-[#c9a84c] mx-auto mb-2" />
                <p className="text-xs font-semibold text-[#0c4a6e]">{a.label}</p>
              </div>
            );
          })}
        </div>

        {/* Autres véhicules */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-[#0c4a6e] mb-4">Autres véhicules disponibles</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {vehicules.filter(x => x.id !== v.id).slice(0, 3).map(x => (
              <Link key={x.id} href={`/services/vehicules/${x.id}`}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#f0f9ff] transition-colors group">
                <img src={x.image} alt={x.nom} className="w-14 h-10 object-cover rounded-lg shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-[#0c4a6e] group-hover:text-[#c9a84c] transition-colors">{x.nom}</p>
                  <p className="text-xs text-gray-400">{x.prix}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <ReservationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`Location : ${v.nom}`}
        details={`${v.nom} — ${v.prix} — Caution: ${v.caution}`}
      />
    </div>
  );
}
