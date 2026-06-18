import { Star } from "lucide-react";
import Link from "next/link"; // Importation du composant Link

const activities = [
  { id: 1, title: "Station Balnéaire d'Assinie", location: "Assinie-Mafia", rating: 4.8, reviews: 1240, image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80", price: "15.000" },
  { id: 2, title: "Le Quartier France", location: "Grand-Bassam", rating: 4.7, reviews: 950, image: "https://images.unsplash.com/photo-1512100356356-de1b84283e39?w=800&q=80", price: "5.000" },
  { id: 3, title: "Baie des Sirènes", location: "Grand-Béréby", rating: 4.9, reviews: 630, image: "https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?w=800&q=80", price: "20.000" },
  { id: 4, title: "Les Falaises de Sassandra", location: "Sassandra", rating: 4.6, reviews: 420, image: "https://images.unsplash.com/photo-1542314831-c6a4d27de6a1?w=800&q=80", price: "10.000" },
  { id: 5, title: "Plage de Monogaga", location: "San Pedro", rating: 4.8, reviews: 780, image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80", price: "8.000" }
];

export default function ActivitiesSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="!text-[18px] md:!text-[20px] font-black text-slate-900">Découvertes touristiques</h2>
        </div>
        <Link href="/activites" className="text-blue-600 font-bold hover:underline">Voir plus</Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {activities.map((act) => (
          // Le composant Link enveloppe la carte pour la rendre cliquable
          <Link href={`/activite/${act.id}`} key={act.id}>
            <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-shadow cursor-pointer h-full">
              <img src={act.image} alt={act.title} className="h-48 w-full object-cover" />
              <div className="p-4">
                <h3 className="!text-[11px] md:!text-[12px] font-bold text-slate-900 mb-1">{act.title}</h3>
                <p className="text-sm text-slate-500 mb-2">{act.location}</p>
                <div className="flex items-center text-sm mb-3">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                  <span className="font-bold">{act.rating}</span>
                  <span className="text-slate-400 ml-1">({act.reviews} avis)</span>
                </div>
                <p className="font-bold text-slate-900">Billets à partir de XOF {act.price}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}