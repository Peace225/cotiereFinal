// app/activite/[id]/page.tsx
import { notFound } from "next/navigation";
import { Star, MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";

// Simulation de base de données
const activities = [
  { id: 1, title: "Station Balnéaire d'Assinie", location: "Assinie-Mafia", rating: 4.8, reviews: 1240, image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80", price: "15.000" },
  { id: 2, title: "Le Quartier France", location: "Grand-Bassam", rating: 4.7, reviews: 950, image: "https://images.unsplash.com/photo-1512100356356-de1b84283e39?w=800&q=80", price: "5.000" },
  { id: 3, title: "Baie des Sirènes", location: "Grand-Béréby", rating: 4.9, reviews: 630, image: "https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?w=800&q=80", price: "20.000" },
  { id: 4, title: "Les Falaises de Sassandra", location: "Sassandra", rating: 4.6, reviews: 420, image: "https://images.unsplash.com/photo-1542314831-c6a4d27de6a1?w=800&q=80", price: "10.000" },
  { id: 5, title: "Plage de Monogaga", location: "San Pedro", rating: 4.8, reviews: 780, image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80", price: "8.000" }
];

// Utilisation de 'async' pour gérer les paramètres de manière moderne
export default async function ActivityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const activity = activities.find((a) => a.id.toString() === id);

  if (!activity) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 font-bold">
        <ArrowLeft size={20} /> Retour aux découvertes
      </Link>

      <div className="grid md:grid-cols-2 gap-12">
        <img 
          src={activity.image} 
          alt={activity.title} 
          className="w-full h-[500px] object-cover rounded-[2rem] shadow-2xl" 
        />

        <div className="flex flex-col justify-center">
          <h1 className="!text-[20px] md:!text-[25px] font-black text-slate-900 mb-4">{activity.title}</h1>
          
          <div className="flex items-center gap-6 mb-6 text-slate-600">
            <div className="flex items-center gap-2 font-bold">
              <MapPin className="text-blue-600" size={20} /> {activity.location}
            </div>
            <div className="flex items-center gap-1 font-bold">
              <Star className="text-yellow-400 fill-yellow-400" size={20} /> {activity.rating} ({activity.reviews} avis)
            </div>
          </div>

          <p className="text-sm text-slate-600 mb-8 leading-relaxed">
            Découvrez l'un des joyaux les plus prisés de la côte ivoirienne. 
            Une expérience unique alliant détente, culture et paysages à couper le souffle.
          </p>

          <div className="bg-[#f8fafc] p-6 rounded-2xl border border-slate-100 mb-8">
            <div className="flex justify-between items-center text-xl">
              <span className="font-bold text-slate-500">Tarif unique</span>
              <span className="font-black text-slate-900 text-2xl">{activity.price} XOF</span>
            </div>
          </div>
          
          <button className="w-full bg-[#003b95] text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-800 transition shadow-lg shadow-blue-900/20">
            Réserver mon accès
          </button>
        </div>
      </div>
    </div>
  );
}