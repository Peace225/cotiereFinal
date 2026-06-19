import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Heart, Check, Map, ChevronDown, Utensils, Camera, Music, Hotel, Home, Building2, Palmtree } from "lucide-react";

export const dynamic = 'force-dynamic';

const cities = [
  { nom: "Aboisso", slug: "aboisso", img: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=2000" },
  { nom: "Adiaké", slug: "adiake", img: "https://images.unsplash.com/photo-1540202404-b7118816ab9b?w=2000" },
  { nom: "Assinie Mafia", slug: "assinie-mafia", img: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=2000" },
  { nom: "Grand-Bassam", slug: "grand-bassam", img: "https://images.unsplash.com/photo-1580983554030-9b626bb36c3e?w=2000" },
  { nom: "Abidjan", slug: "abidjan", img: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=2000" },
  { nom: "Jacqueville", slug: "jacqueville", img: "https://images.unsplash.com/photo-1540202404-b7118816ab9b?w=2000" },
  { nom: "Dabou", slug: "dabou", img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=2000" },
  { nom: "Grand-Lahou", slug: "grand-lahou", img: "https://images.unsplash.com/photo-1520113412646-dfb234b6b667?w=2000" },
  { nom: "Fresco", slug: "fresco", img: "https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?w=2000" },
  { nom: "Sassandra", slug: "sassandra", img: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=2000" },
  { nom: "San Pedro", slug: "san-pedro", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=2000" },
  { nom: "Grand-Béréby", slug: "grand-bereby", img: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=2000" },
  { nom: "Tabou", slug: "tabou", img: "https://images.unsplash.com/photo-1498623116890-37e912163d5d?w=2000" },
];

export default async function DestinationPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ type?: string }> }) {
  const { slug } = await params;
  const { type = 'tout' } = await searchParams;

  const city = cities.find(c => c.slug === slug);
  if (!city) notFound();

  const searchTerm = city.nom.replace('-', ' ');

  // Utilisation de prisma.rooms pointant vers votre modèle Prisma pluriel exact
  const rooms = await prisma.rooms.findMany({
    where: { 
      OR: [
        { city: { contains: searchTerm, mode: 'insensitive' } }, 
        { quartier: { contains: searchTerm, mode: 'insensitive' } }
      ] 
    }
  });

  // ✅ CORRIGÉ : Utilisation du modèle singulier 'villeContenu' au lieu de 'ville_contenus'
  const autresLieux = await prisma.villeContenu.findMany({
    where: { ville: { contains: searchTerm, mode: 'insensitive' } }
  });

  const normalizedRooms = rooms.map(room => ({
    id: room.id, name: room.name, category: 'hebergement', typeLabel: (room as any).type || 'Hébergement',
    image: (room.images && (room.images as string[]).length > 0) ? (room.images as string[])[0] : "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800",
    location: (room as any).quartier || (room as any).city || city.nom, rating: (room as any).rating || 8.5,
    price: (room as any).pricePerNight ? `XOF ${(room as any).pricePerNight.toLocaleString()}` : 'Sur demande',
    priceContext: '1 nuit, 2 adultes', link: `/services/hotel/${(room as any).slug || room.id}`,
    features: ['Annulation gratuite', 'Petit-déjeuner inclus']
  }));

  const normalizedAutres = autresLieux.map(lieu => ({
    id: lieu.id, name: lieu.nom, category: lieu.categorie.toLowerCase(), typeLabel: lieu.categorie,
    image: lieu.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800",
    location: lieu.adresse || city.nom, rating: lieu.note || 8.0,
    price: lieu.prix || 'Sur devis', priceContext: 'Prix estimé',
    link: `/services/${lieu.categorie.toLowerCase()}/${lieu.id}`,
    features: [lieu.description?.substring(0, 50) || 'Lieu incontournable']
  }));

  const allItems = [...normalizedRooms, ...normalizedAutres];
  const displayedItems = type === 'tout' ? allItems : allItems.filter(item => item.category === type);

  const counts = {
    tout: allItems.length,
    hebergement: normalizedRooms.length,
    restaurant: normalizedAutres.filter(i => i.category === 'restaurant').length,
    nightclub: normalizedAutres.filter(i => i.category === 'nightclub').length,
    tourisme: normalizedAutres.filter(i => i.category === 'tourisme').length,
  };

  const categories = [
    { id: 'tout', label: 'Tous', icon: Building2, count: counts.tout },
    { id: 'hebergement', label: 'Hébergements', icon: Hotel, count: counts.hebergement },
    { id: 'restaurant', label: 'Restaurants', icon: Utensils, count: counts.restaurant },
    { id: 'nightclub', label: 'Night Clubs', icon: Music, count: counts.nightclub },
    { id: 'tourisme', label: 'Activités', icon: Camera, count: counts.tourisme },
  ];

  return (
    <div className="bg-[#f0f2f5] min-h-screen">
      {/* HERO */}
      <div className="relative h-[42vh] min-h-[320px]">
        <img src={city.img} alt={city.nom} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
        <div className="relative z-10 h-full max-w-[1200px] mx-auto px-4 flex flex-col justify-end pb-10">
          <nav className="text-white/80 text-sm mb-3 flex items-center gap-2">
            <Link href="/" className="hover:underline">Accueil</Link>
            <ChevronDown className="w-3 h-3 rotate-[-90deg]" />
            <span>Destinations</span>
            <ChevronDown className="w-3 h-3 rotate-[-90deg]" />
            <span className="text-white">{city.nom}</span>
          </nav>
          <h1 className="!text-[22px] md:!text-[25px] font-bold text-white tracking-tight">{city.nom}</h1>
          <p className="text-white/90 mt-2 flex items-center gap-2 text-sm"><Palmtree className="w-4 h-4" /> Côte d'Ivoire • {allItems.length} établissements trouvés</p>
        </div>
      </div>

      {/* TABS */}
      <div className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-[1200px] mx-auto px-4 flex gap-6 overflow-x-auto">
          {categories.map(cat => {
            const active = type === cat.id;
            const Icon = cat.icon;
            return (
              <Link key={cat.id} href={`/destinations/${slug}?type=${cat.id}`}
                className={`flex items-center gap-2 py-4 border-b-2 whitespace-nowrap transition ${active ? 'border-[#003580] text-[#003580]' : 'border-transparent text-gray-600 hover:text-black'}`}>
                <Icon className="w-4 h-4" />
                <span className="font-medium text-sm">{cat.label}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded ${active ? 'bg-[#003580]/10 text-[#003580]' : 'bg-gray-100'}`}>{cat.count}</span>
              </Link>
            )
          })}
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* FILTRES */}
        <aside className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h3 className="!text-[15px] md:!text-[18px] font-semibold text-gray-900">Filtrer</h3>
              <button className="text-xs text-[#006ce4] hover:underline">Réinitialiser</button>
            </div>

            <div className="space-y-5">
              <div>
                <h4 className="!text-[12px] md:!text-[14px] font-medium mb-2">Carte</h4>
                <button className="w-full flex items-center justify-center gap-2 border rounded-xl py-2.5 hover:bg-gray-50">
                  <Map className="w-4 h-4" /> Voir sur la carte
                </button>
              </div>

              <div className="border-t pt-4">
                <h4 className="!text-[12px] md:!text-[14px] font-medium mb-3">Votre budget</h4>
                <div className="space-y-2 text-sm">
                  {['Moins de 25 000 XOF', '25 000 - 50 000 XOF', '50 000 - 100 000 XOF', 'Plus de 100 000 XOF'].map(b => (
                    <label key={b} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <span>{b}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* LISTE */}
        <main className="lg:col-span-9">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">{displayedItems.length} résultats à {city.nom}</p>
            <button className="text-sm flex items-center gap-1 border rounded-lg px-3 py-1.5 bg-white hover:bg-gray-50">
              Trier par: Recommandés <ChevronDown className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-4">
            {displayedItems.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col md:flex-row">
                <div className="relative md:w-[280px] h-[220px] md:h-auto flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  <button className="absolute top-3 right-3 bg-white/90 backdrop-blur p-1.5 rounded-full hover:bg-white">
                    <Heart className="w-4 h-4 text-gray-700" />
                  </button>
                </div>

                <div className="flex-1 p-5 flex flex-col">
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="!text-[18px] md:!text-[20px] font-semibold text-[#1a1a1a] hover:text-[#006ce4] transition">
                          <Link href={item.link}>{item.name}</Link>
                        </h2>
                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" /> {item.location} • <span className="text-[#006ce4] hover:underline cursor-pointer">Voir sur la carte</span>
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="flex items-center gap-2 justify-end">
                          <div className="text-right">
                            <div className="text-xs text-gray-600">Excellent</div>
                            <div className="text-xs text-gray-500">124 avis</div>
                          </div>
                          <div className="bg-[#003580] text-white text-sm font-bold px-2.5 py-1.5 rounded-lg min-w-[36px] text-center">
                            {item.rating.toFixed(1)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <span className="inline-flex items-center gap-1 text-xs bg-gray-100 px-2.5 py-1 rounded-full">
                        <Home className="w-3 h-3" /> {item.typeLabel}
                      </span>
                    </div>

                    <div className="mt-4 space-y-1.5">
                      {item.features.slice(0, 2).map((f, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-[#008009]">
                          <Check className="w-4 h-4" /> <span className="font-medium">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* PRIX - colonne droite */}
                <div className="md:w-[220px] p-5 border-t md:border-t-0 md:border-l border-gray-100 flex flex-col justify-between bg-[#fbfcff]">
                  <div className="text-right">
                    <div className="text-xs text-gray-500">{item.priceContext}</div>
                    <div className="text-2xl font-bold text-gray-900 mt-1">{item.price}</div>
                    <div className="text-xs text-gray-500 mt-1">Taxes et frais compris</div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <Link href={item.link} className="block w-full bg-[#006ce4] hover:bg-[#0057b8] text-white text-center font-medium py-2.5 rounded-lg transition text-sm">
                      Voir la disponibilité
                    </Link>
                    <div className="text-[11px] text-center text-[#008009] font-medium">Réservation gratuite</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {displayedItems.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
              <p className="text-gray-600">Aucun résultat pour ce filtre.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}