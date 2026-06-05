import { ArrowRight, Phone, MapPin, Star, Utensils } from "lucide-react";
import Link from "next/link";

const restaurants = [
  {
    id: "le-littoral", nom: "Restaurant Le Littoral", categorie: "Gastronomique", description: "Cuisine ivoirienne et internationale avec vue sur la mer. Spécialités : poisson braisé, attiéké, fruits de mer.", prix: "15 000 – 40 000 FCFA", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80", note: 5,
    images: ["https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80", "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80"],
    horaires: "Lun-Dim : 11h00 – 23h00", adresse: "Bord de mer, Littoral ivoirien", specialites: ["Poisson braisé", "Attiéké aux fruits de mer", "Homard grillé", "Cocktails tropicaux"],
  },
  {
    id: "chez-adjoua", nom: "Maquis Chez Adjoua", categorie: "Maquis local", description: "Ambiance authentique, attiéké poisson, garba et grillades au bord de l'eau. Incontournable.", prix: "2 000 – 8 000 FCFA", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80", note: 5,
    images: ["https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80", "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80", "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=800&q=80"],
    horaires: "Lun-Dim : 07h00 – 22h00", adresse: "Village de pêcheurs, Littoral", specialites: ["Attiéké poisson", "Garba", "Grillades", "Alloco"],
  },
  {
    id: "grillades-bord-mer", nom: "Grillades du Bord de Mer", categorie: "Grillades", description: "Poissons et fruits de mer grillés à la braise, directement sur la plage. Fraîcheur garantie.", prix: "5 000 – 20 000 FCFA", image: "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=600&q=80", note: 4,
    images: ["https://images.unsplash.com/photo-1534482421-64566f976cfa?w=800&q=80", "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=800&q=80", "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80"],
    horaires: "Mar-Dim : 12h00 – 22h00", adresse: "Plage principale, Littoral", specialites: ["Poisson braisé", "Crevettes grillées", "Homard", "Brochettes"],
  },
  {
    id: "saveurs-ivoire", nom: "Restaurant Saveurs d'Ivoire", categorie: "Cuisine ivoirienne", description: "Plats traditionnels ivoiriens : foutou, sauce graine, kedjenou de poulet, alloco.", prix: "3 000 – 12 000 FCFA", image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=80", note: 4,
    images: ["https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80", "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80"],
    horaires: "Lun-Sam : 10h00 – 21h00", adresse: "Centre-ville, Littoral", specialites: ["Foutou sauce graine", "Kedjenou de poulet", "Alloco", "Riz gras"],
  },
  {
    id: "patisserie-littoral", nom: "Café Pâtisserie du Littoral", categorie: "Pâtisserie", description: "Pâtisseries françaises et africaines, glaces artisanales, café et jus de fruits frais.", prix: "1 000 – 5 000 FCFA", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80", note: 4,
    images: ["https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80", "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80"],
    horaires: "Lun-Dim : 07h00 – 20h00", adresse: "Rue principale, Littoral", specialites: ["Croissants", "Glaces artisanales", "Jus frais", "Café"],
  },
  {
    id: "fastfood-cotiere", nom: "Fast-Food Côtière", categorie: "Fast-food", description: "Burgers, sandwichs, brochettes et boissons fraîches. Service rapide et prix abordables.", prix: "1 500 – 6 000 FCFA", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80", note: 3,
    images: ["https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80", "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80"],
    horaires: "Lun-Dim : 08h00 – 23h00", adresse: "Zone commerciale, Littoral", specialites: ["Burgers", "Sandwichs", "Brochettes", "Boissons fraîches"],
  },
];

const categories = [
  { label: "Restaurants gastronomiques", desc: "Cuisine raffinée avec vue sur mer", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&q=80" },
  { label: "Restaurants locaux", desc: "Cuisine ivoirienne authentique", image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&q=80" },
  { label: "Maquis ambiance", desc: "Attiéké poisson, garba, grillades", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&q=80" },
  { label: "Grillades bord de l'eau", desc: "Poissons et fruits de mer frais", image: "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=200&q=80" },
  { label: "Fast-food & snacks", desc: "Restauration rapide et abordable", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80" },
  { label: "Pâtisseries & glaciers", desc: "Douceurs et boissons fraîches", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&q=80" },
];

export default function OuMangerPage() {
  return (
    <div className="min-h-screen">
      <section className="relative text-white py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80" alt="Où Manger" className="w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest">Guide gastronomique</span>
            <h1 className="text-2xl sm:text-2xl sm:text-4xl md:text-5xl font-bold mt-2 mb-4">Où Manger sur le Littoral</h1>
            <p className="text-gray-100 text-lg leading-relaxed">
              Découvrez les meilleures adresses culinaires du littoral ivoirien — des maquis authentiques aux restaurants gastronomiques.
            </p>
            <div className="flex gap-3 mt-8">
              <a href="#restaurants" className="btn-primary inline-flex items-center gap-2">Voir les adresses <ArrowRight size={18} /></a>
              <a href="tel:+2250747722931" className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-bold px-5 py-3 rounded-xl hover:bg-white/20 transition-colors">
                <Phone size={18} /> Nous contacter
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-[#f0f9ff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-center mb-8">Types de restauration</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map(c => (
              <div key={c.label} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:border-[#c9a84c]/40 transition-colors card-hover">
                <div className="h-24 overflow-hidden">
                  <img src={c.image} alt={c.label} className="w-full h-full object-cover" />
                </div>
                <div className="p-3 text-center">
                  <p className="font-bold text-[#0c4a6e] text-xs mb-1">{c.label}</p>
                  <p className="text-gray-400 text-xs">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="restaurants" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest">Nos adresses</span>
            <h2 className="section-title mt-2">Les meilleures tables du littoral</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map(r => (
              <div key={r.nom} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 card-hover">
                <div className="relative h-44">
                  <img src={r.image} alt={r.nom} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 bg-[#c9a84c] text-white text-xs font-bold px-2.5 py-1 rounded-full">{r.categorie}</span>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-[#0c4a6e]">{r.nom}</h3>
                    <div className="flex gap-0.5 shrink-0">
                      {Array.from({ length: r.note }).map((_, i) => (
                        <Star key={i} size={11} className="text-[#c9a84c] fill-[#c9a84c]" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{r.description}</p>
                  <div className="flex items-center gap-1 text-xs text-[#0c4a6e] font-semibold mb-3">
                    <Utensils size={12} /> {r.prix}
                  </div>
                  <Link href="/reservation" className="btn-primary w-full justify-center text-sm py-2">
                    Réserver <ArrowRight size={14} />
                  </Link>
                  <Link href={"/services/tourisme/ou-manger/" + r.id} className="mt-2 w-full flex items-center justify-center gap-1 text-sm font-semibold text-[#0c4a6e] border border-[#0c4a6e]/20 rounded-xl py-2 hover:bg-[#0c4a6e]/5 transition-colors">
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
          <h2 className="text-3xl font-bold mb-4">Vous connaissez une bonne adresse ?</h2>
          <p className="text-gray-300 mb-8">Partagez vos bonnes adresses avec la communauté CÔTIÈRE.</p>
          <Link href="/contact" className="btn-primary inline-flex items-center gap-2">
            Nous contacter <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
