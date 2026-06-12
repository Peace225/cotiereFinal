"use client";

import { ArrowRight, Phone, ChevronLeft, MapPin, Clock, Star, Utensils } from "lucide-react";
import Link from "next/link";

// Force le rendu dynamique pour éviter les erreurs de génération statique au build
export const dynamic = 'force-dynamic';

const restaurants: Record<string, {
  nom: string; categorie: string; description: string; prix: string;
  image: string; note: number; images: string[];
  horaires: string; adresse: string; specialites: string[];
}> = {
  "le-littoral": { 
    nom: "Restaurant Le Littoral", 
    categorie: "Gastronomique", 
    description: "Cuisine ivoirienne et internationale avec vue sur la mer. Spécialités : poisson braisé, attiéké, fruits de mer. Un cadre exceptionnel pour vos repas d'affaires ou en famille.", 
    prix: "15 000 – 40 000 FCFA", 
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80", 
    note: 5, 
    images: ["https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80", "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80"], 
    horaires: "Lun-Dim : 11h00 – 23h00", 
    adresse: "Bord de mer, Littoral ivoirien", 
    specialites: ["Poisson braisé", "Attiéké aux fruits de mer", "Homard grillé", "Cocktails tropicaux"] 
  },
  "chez-adjoua": { 
    nom: "Maquis Chez Adjoua", 
    categorie: "Maquis local", 
    description: "Ambiance authentique, attiéké poisson, garba et grillades au bord de l'eau. L'adresse incontournable pour découvrir la vraie cuisine ivoirienne.", 
    prix: "2 000 – 8 000 FCFA", 
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80", 
    note: 5, 
    images: ["https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80"], 
    horaires: "Lun-Dim : 07h00 – 22h00", 
    adresse: "Village de pêcheurs, Littoral", 
    specialites: ["Attiéké poisson", "Garba", "Grillades", "Alloco"] 
  },
};

export default function RestaurantDetailPage({ params }: { params: { id: string } }) {
  const r = restaurants[params.id];

  if (!r) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-gray-500 text-lg">Restaurant introuvable.</p>
      <Link href="/services/tourisme/ou-manger" className="btn-primary">Voir toutes les adresses</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-[#0c4a6e]">Accueil</Link>
          <span>/</span>
          <Link href="/services/tourisme" className="hover:text-[#0c4a6e]">Tourisme</Link>
          <span>/</span>
          <Link href="/services/tourisme/ou-manger" className="hover:text-[#0c4a6e]">Où Manger</Link>
          <span>/</span>
          <span className="text-[#0c4a6e] font-medium">{r.nom}</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <Link href="/services/tourisme/ou-manger" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#0c4a6e] mb-6 transition-colors">
          <ChevronLeft size={16} /> Retour aux restaurants
        </Link>

        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <div className="relative h-72 md:h-full min-h-[300px]">
              <img src={r.image} alt={r.nom} className="w-full h-full object-cover" />
              <span className="absolute top-4 left-4 bg-[#c9a84c] text-white text-xs font-bold px-3 py-1.5 rounded-full">{r.categorie}</span>
            </div>
            <div className="p-8">
              <div className="flex items-start justify-between mb-3">
                <h1 className="text-2xl font-bold text-[#0c4a6e]">{r.nom}</h1>
                <div className="flex gap-0.5 shrink-0">
                  {Array.from({ length: r.note }).map((_, i) => (
                    <Star key={i} size={14} className="text-[#c9a84c] fill-[#c9a84c]" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">{r.description}</p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <Utensils size={16} className="text-[#c9a84c] shrink-0" />
                  <span className="font-semibold text-[#0c4a6e]">{r.prix}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock size={16} className="text-[#c9a84c] shrink-0" />
                  <span className="text-gray-600">{r.horaires}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin size={16} className="text-[#c9a84c] shrink-0" />
                  <span className="text-gray-600">{r.adresse}</span>
                </div>
              </div>

              <div className="space-y-3">
                <Link href="/reservation" className="btn-primary w-full justify-center text-center py-3 rounded-xl font-bold">
                  Réserver une table <ArrowRight size={16} className="inline ml-1" />
                </Link>
                <a href="tel:+2250747722931" className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <Phone size={16} /> Appeler pour réserver
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Spécialités */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-xl font-bold text-[#0c4a6e] mb-4">Nos spécialités</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {r.specialites.map(s => (
              <div key={s} className="bg-[#faf8f4] rounded-xl p-3 text-center border border-[#c9a84c]/20">
                <p className="text-sm font-semibold text-[#0c4a6e]">{s}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}