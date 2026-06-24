import { notFound } from "next/navigation";
import { Star, MapPin, ArrowLeft, CheckCircle2, Compass, Map, Sun, Anchor, Coffee } from "lucide-react";
import Link from "next/link";

// 🌟 Base de données enrichie avec les activités, lieux de loisirs et détails
const activities = [
  { 
    id: 1, 
    title: "Station Balnéaire d'Assinie", 
    location: "Assinie-Mafia", 
    rating: 4.8, 
    reviews: 1240, 
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80", 
    price: "15.000",
    category: "Détente & Luxe",
    description: "Plongez dans l'exclusivité d'Assinie-Mafia, le joyau balnéaire de la Côte d'Ivoire. Coincée entre l'océan Atlantique et la lagune Aby, cette destination offre un cadre idyllique bordé de cocotiers. Parfait pour une escapade premium loin du tumulte d'Abidjan.",
    todo: ["Jet Ski sur la lagune Aby", "Balade en pirogue traditionnelle", "Surf sur les vagues de l'Atlantique", "Farniente sur les plages privées"],
    hotspots: ["La Maison d'Akoula (Beach Club)", "Musée d'Aniaba", "Parc National des Îles Ehotilé"],
    included: ["Accès plage privée", "Cocktail de bienvenue", "Transat & Parasol"]
  },
  { 
    id: 2, 
    title: "Le Quartier France", 
    location: "Grand-Bassam", 
    rating: 4.7, 
    reviews: 950, 
    image: "https://images.unsplash.com/photo-1512100356356-de1b84283e39?w=1200&q=80", 
    price: "5.000",
    category: "Histoire & Culture",
    description: "Découvrez la première capitale de la Côte d'Ivoire, classée au patrimoine mondial de l'UNESCO. Flânez à travers les vestiges coloniaux envahis par la nature et imprégnez-vous de l'artisanat local dans une ambiance hors du temps.",
    todo: ["Visite guidée des bâtiments coloniaux", "Shopping au village artisanal", "Dégustation de fruits de mer", "Ateliers de poterie"],
    hotspots: ["Musée National du Costume", "Le Phare de Grand-Bassam", "Plage d'Assoyam"],
    included: ["Visite guidée (2h)", "Billet d'entrée au musée", "Rafraîchissement"]
  },
  { 
    id: 3, 
    title: "Baie des Sirènes", 
    location: "Grand-Béréby", 
    rating: 4.9, 
    reviews: 630, 
    image: "https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?w=1200&q=80", 
    price: "20.000",
    category: "Nature Sauvage",
    description: "Un paradis caché à l'ouest du pays. La Baie des Sirènes offre des eaux cristallines, des piscines naturelles formées par les rochers et une tranquillité absolue. L'endroit rêvé pour se reconnecter avec la nature.",
    todo: ["Observation des tortues marines", "Plongée en apnée (Snorkeling)", "Pêche sportive", "Randonnée côtière"],
    hotspots: ["Les piscines naturelles de Tabaoulé", "Le village de pêcheurs", "Rochers sacrés"],
    included: ["Équipement de snorkeling", "Guide local", "Déjeuner (poisson braisé)"]
  },
  // Données de secours pour les autres IDs
  { id: 4, title: "Les Falaises de Sassandra", location: "Sassandra", rating: 4.6, reviews: 420, image: "https://images.unsplash.com/photo-1542314831-c6a4d27de6a1?w=1200&q=80", price: "10.000", category: "Aventure", description: "Vues panoramiques depuis les falaises historiques.", todo: ["Balade en bateau", "Visite du Wharf"], hotspots: ["L'embouchure du fleuve", "Marché local"], included: ["Guide"] },
  { id: 5, title: "Plage de Monogaga", location: "San Pedro", rating: 4.8, reviews: 780, image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200&q=80", price: "8.000", category: "Détente", description: "L'une des plus belles baies d'Afrique de l'Ouest.", todo: ["Baignade", "Feu de camp"], hotspots: ["Baie de Monogaga", "Forêt classée"], included: ["Accès site"] }
];

export default async function ActivityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const activity = activities.find((a) => a.id.toString() === id);

  if (!activity) {
    notFound();
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* 🌟 Bannière Image Principale */}
      <div className="relative w-full h-[50vh] md:h-[60vh]">
        <img 
          src={activity.image} 
          alt={activity.title} 
          className="w-full h-full object-cover" 
        />
        {/* Overlay gradient pour faire ressortir le bouton retour */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent"></div>
        
        <div className="absolute top-0 left-0 w-full max-w-7xl mx-auto px-4 pt-8">
          <Link href="/" className="inline-flex items-center gap-2 text-white hover:text-blue-200 transition font-bold bg-black/20 backdrop-blur-md px-4 py-2 rounded-full text-sm">
            <ArrowLeft size={20} /> Retour aux découvertes
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-24 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* 🌟 COLONNE GAUCHE : Détails de l'activité (Prend 2/3 de la largeur) */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-8 md:p-12">
            
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-black uppercase tracking-wider">
                {activity.category}
              </span>
            </div>

            <h1 className="!text-[20px] md:!text-[25px] font-black text-slate-900 mb-6 leading-tight">
              {activity.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 mb-10 text-slate-600 border-b border-slate-100 pb-8">
              <div className="flex items-center gap-2 font-bold text-lg">
                <MapPin className="text-blue-600" size={24} /> {activity.location}
              </div>
              <div className="flex items-center gap-2 font-bold text-lg">
                <Star className="text-yellow-400 fill-yellow-400" size={24} /> 
                <span className="text-slate-900">{activity.rating}</span> 
                <span className="text-slate-400">({activity.reviews} avis)</span>
              </div>
            </div>

            <h2 className="!text-[20px] md:!text-[25px] font-black text-slate-900 mb-4">A propos de ce lieu</h2>
            <p className="text-lg text-slate-600 mb-12 leading-relaxed">
              {activity.description}
            </p>

            {/* Section Activités */}
            <h2 className="!text-[20px] md:!text-[25px] font-black text-slate-900 mb-6 flex items-center gap-2">
              <Compass className="text-blue-600" /> Que faire sur place ?
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-12 text-sm">
              {activity.todo.map((item, index) => (
                <div key={index} className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl">
                  <Anchor className="text-blue-500 mt-0.5" size={20} />
                  <span className="font-semibold text-slate-700">{item}</span>
                </div>
              ))}
            </div>

            {/* Section Lieux de loisirs */}
            <h2 className="!text-[20px] md:!text-[25px]text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
              <Map className="text-blue-600" /> Points d'intérêts & Loisirs
            </h2>
            <div className="flex flex-wrap gap-3 mb-8 text-sm">
              {activity.hotspots.map((spot, index) => (
                <span key={index} className="flex items-center gap-2 bg-white border-2 border-slate-100 px-5 py-3 rounded-full font-bold text-slate-600 hover:border-blue-200 hover:text-blue-600 transition cursor-default">
                  <Coffee size={18} /> {spot}
                </span>
              ))}
            </div>
          </div>

          {/* 🌟 COLONNE DROITE : Carte de Réservation Sticky */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 bg-white/80 backdrop-blur-xl border border-white rounded-3xl shadow-2xl p-8">
              <div className="mb-8">
                <p className="text-slate-500 font-bold mb-1">Tarif d'accès à partir de</p>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-black text-blue-900">{activity.price}</span>
                  <span className="text-xl font-bold text-slate-500 mb-1">XOF</span>
                </div>
              </div>

              <div className="mb-8">
                <p className="font-bold text-slate-900 mb-4">Ce qui est inclus :</p>
                <ul className="space-y-3">
                  {activity.included.map((inc, index) => (
                    <li key={index} className="flex items-center gap-3 text-slate-600 font-medium">
                      <CheckCircle2 className="text-emerald-500" size={20} />
                      {inc}
                    </li>
                  ))}
                </ul>
              </div>
              
              <button className="w-full bg-gradient-to-r from-[#003b95] to-blue-600 text-white py-4 rounded-2xl font-black text-lg hover:shadow-lg hover:shadow-blue-900/30 transition-all transform hover:-translate-y-1">
                Réserver cette expérience
              </button>

              <p className="text-center text-sm font-medium text-slate-400 mt-4 flex items-center justify-center gap-2">
                <Sun size={16} /> Idéal pour la saison actuelle
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}