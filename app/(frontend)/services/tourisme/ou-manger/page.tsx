"use client";

import { ArrowRight, Phone, MapPin, Star, Utensils } from "lucide-react";
import Link from "next/link";

// Directive pour stabiliser le build sur Vercel
export const dynamic = 'force-dynamic';

const restaurants = [
  {
    id: "le-littoral", nom: "Restaurant Le Littoral", categorie: "Gastronomique", description: "Cuisine ivoirienne et internationale avec vue sur la mer. Spécialités : poisson braisé, attiéké, fruits de mer.", prix: "15 000 – 40 000 FCFA", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80", note: 5,
    images: ["https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80", "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80"],
    horaires: "Lun-Dim : 11h00 – 23h00", adresse: "Bord de mer, Littoral ivoirien", specialites: ["Poisson braisé", "Attiéké aux fruits de mer", "Homard grillé", "Cocktails tropicaux"],
  },
  {
    id: "chez-adjoua", nom: "Maquis Chez Adjoua", categorie: "Maquis local", description: "Ambiance authentique, attiéké poisson, garba et grillades au bord de l'eau. Incontournable.", prix: "2 000 – 8 000 FCFA", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80", note: 5,
    images: ["https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80"],
    horaires: "Lun-Dim : 07h00 – 22h00", adresse: "Village de pêcheurs, Littoral", specialites: ["Attiéké poisson", "Garba", "Grillades", "Alloco"],
  },
  {
    id: "grillades-bord-mer", nom: "Grillades du Bord de Mer", categorie: "Grillades", description: "Poissons et fruits de mer grillés à la braise, directement sur la plage. Fraîcheur garantie.", prix: "5 000 – 20 000 FCFA", image: "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=600&q=80", note: 4,
    images: ["https://images.unsplash.com/photo-1534482421-64566f976cfa?w=800&q=80"],
    horaires: "Mar-Dim : 12h00 – 22h00", adresse: "Plage principale, Littoral", specialites: ["Poisson braisé", "Crevettes grillées", "Homard", "Brochettes"],
  },
  {
    id: "saveurs-ivoire", nom: "Restaurant Saveurs d'Ivoire", categorie: "Cuisine ivoirienne", description: "Plats traditionnels ivoiriens : foutou, sauce graine, kedjenou de poulet, alloco.", prix: "3 000 – 12 000 FCFA", image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=80", note: 4,
    images: ["https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80"],
    horaires: "Lun-Sam : 10h00 – 21h00", adresse: "Centre-ville, Littoral", specialites: ["Foutou sauce graine", "Kedjenou de poulet", "Alloco", "Riz gras"],
  },
  {
    id: "patisserie-littoral", nom: "Café Pâtisserie du Littoral", categorie: "Pâtisserie", description: "Pâtisseries françaises et africaines, glaces artisanales, café et jus de fruits frais.", prix: "1 000 – 5 000 FCFA", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80", note: 4,
    images: ["https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80"],
    horaires: "Lun-Dim : 07h00 – 20h00", adresse: "Rue principale, Littoral", specialites: ["Croissants", "Glaces artisanales", "Jus frais", "Café"],
  },
  {
    id: "fastfood-cotiere", nom: "Fast-Food Côtière", categorie: "Fast-food", description: "Burgers, sandwichs, brochettes et boissons fraîches. Service rapide et prix abordables.", prix: "1 500 – 6 000 FCFA", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80", note: 3,
    images: ["https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80"],
    horaires: "Lun-Dim : 08h00 – 23h00", adresse: "Zone commerciale, Littoral", specialites: ["Burgers", "Sandwichs", "Brochettes", "Boissons fraîches"],
  },
];

const categories = [
  { label: "Gastronomique", desc: "Cuisine raffinée avec vue sur mer", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&q=80" },
  { label: "Cuisine ivoirienne", desc: "Saveurs authentiques", image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&q=80" },
  { label: "Maquis", desc: "Ambiance conviviale", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&q=80" },
  { label: "Grillades", desc: "Feu de bois", image: "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=200&q=80" },
  { label: "Fast-food", desc: "Service rapide", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80" },
  { label: "Pâtisseries", desc: "Douceurs", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&q=80" },
];

export default function OuMangerPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative text-white py-20 bg-[#0c4a6e]">
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Où Manger sur le Littoral</h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Découvrez les meilleures adresses culinaires du littoral ivoirien.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4" id="restaurants">
        <h2 className="text-3xl font-bold text-center mb-12">Nos adresses sélectionnées</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {restaurants.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
              <img src={r.image} alt={r.nom} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="font-bold text-[#0c4a6e] text-xl mb-2">{r.nom}</h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{r.description}</p>
                <div className="flex gap-2 mb-4">
                  <Link href={`/services/tourisme/ou-manger/${r.id}`} className="btn-primary flex-1 text-center py-2 text-sm">Voir détails</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}