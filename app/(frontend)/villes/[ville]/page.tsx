import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Hotel, Home, Waves, UtensilsCrossed, Landmark, Bus, ArrowRight, ChevronLeft } from "lucide-react";

type VilleData = {
  nom: string;
  region: string;
  description: string;
  image: string;
  slug: string;
};

const VILLES: Record<string, VilleData> = {
  "aboisso":       { nom: "Aboisso",       region: "Sud-Comoé",    slug: "aboisso",       description: "Ville frontalière du Sud-Comoé, porte d'entrée vers la lagune Aby et les forêts tropicales.", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80" },
  "adiake":        { nom: "Adiaké",        region: "Sud-Comoé",    slug: "adiake",        description: "Ville côtière au bord de la lagune Aby, connue pour sa pêche artisanale et ses villages lacustres.", image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80" },
  "assinie-mafia": { nom: "Assinie-Mafia", region: "Sud-Comoé",    slug: "assinie-mafia", description: "Station balnéaire prisée entre océan et lagune d'Aby. Plages de sable blanc et sports nautiques.", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80" },
  "grand-bassam":  { nom: "Grand-Bassam",  region: "Sud-Comoé",    slug: "grand-bassam",  description: "Ancienne capitale coloniale classée au patrimoine mondial de l'UNESCO. Architecture, plages et artisanat.", image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80" },
  "abidjan":       { nom: "Abidjan",       region: "Lagunes",      slug: "abidjan",       description: "Capitale économique de Côte d'Ivoire sur la lagune Ébrié. Plages de Vridi, gastronomie et culture.", image: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80" },
  "jacqueville":   { nom: "Jacqueville",   region: "Lagunes",      slug: "jacqueville",   description: "Île accessible par pont entre lagune Ébrié et océan. Plages sauvages et villages de pêcheurs.", image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80" },
  "dabou":         { nom: "Dabou",         region: "Lagunes",      slug: "dabou",         description: "Ville historique sur la lagune Ébrié, riche en traditions Adjoukrou et paysages lagunaires.", image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80" },
  "grand-lahou":   { nom: "Grand-Lahou",   region: "Grands-Ponts", slug: "grand-lahou",   description: "Ville côtière à l'embouchure du fleuve Bandama. Lagune, plages désertes et pêche ancestrale.", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80" },
  "fresco":        { nom: "Fresco",        region: "Grands-Ponts", slug: "fresco",        description: "L'une des plus belles plages sauvages de Côte d'Ivoire. Nature préservée et authenticité totale.", image: "https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=800&q=80" },
  "sassandra":     { nom: "Sassandra",     region: "Bas-Sassandra", slug: "sassandra",    description: "Ville historique à l'embouchure de la rivière Sassandra. Rochers pittoresques et architecture coloniale.", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80" },
  "san-pedro":     { nom: "San-Pédro",     region: "Bas-Sassandra", slug: "san-pedro",    description: "2ème port de Côte d'Ivoire. Plages, gastronomie de fruits de mer et excursions en mer.", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80" },
  "grand-bereby":  { nom: "Grand-Béréby",  region: "Bas-Sassandra", slug: "grand-bereby", description: "Plages vierges du Sud-Ouest ivoirien. Forêt tropicale dense et biodiversité marine exceptionnelle.", image: "https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=800&q=80" },
  "tabou":         { nom: "Tabou",         region: "Bas-Sassandra", slug: "tabou",        description: "Ville frontalière du Grand-Ouest, entre forêt et océan. Plages sauvages et nature préservée.", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80" },
};

const CATEGORIES = [
  {
    id: "hotels",
    label: "Hôtels",
    icon: Hotel,
    color: "bg-blue-50 text-blue-600 border-blue-100",
    iconBg: "bg-blue-100",
    description: "Hôtels et établissements hôteliers",
    href: (slug: string) => `/villes/${slug}/hotels`,
  },
  {
    id: "residences",
    label: "Résidences",
    icon: Home,
    color: "bg-green-50 text-green-600 border-green-100",
    iconBg: "bg-green-100",
    description: "Résidences meublées et appartements",
    href: (slug: string) => `/villes/${slug}/residences`,
  },
  {
    id: "plages",
    label: "Plages",
    icon: Waves,
    color: "bg-cyan-50 text-cyan-600 border-cyan-100",
    iconBg: "bg-cyan-100",
    description: "Plages et espaces balnéaires",
    href: (slug: string) => `/villes/${slug}/plages`,
  },
  {
    id: "restaurants",
    label: "Restaurants",
    icon: UtensilsCrossed,
    color: "bg-orange-50 text-orange-600 border-orange-100",
    iconBg: "bg-orange-100",
    description: "Restaurants, maquis et gastronomie locale",
    href: (slug: string) => `/villes/${slug}/restaurants`,
  },
  {
    id: "sites",
    label: "Sites touristiques",
    icon: Landmark,
    color: "bg-purple-50 text-purple-600 border-purple-100",
    iconBg: "bg-purple-100",
    description: "Monuments, sites naturels et culturels",
    href: (slug: string) => `/villes/${slug}/sites`,
  },
  {
    id: "transport",
    label: "Compagnies de transport",
    icon: Bus,
    color: "bg-yellow-50 text-yellow-600 border-yellow-100",
    iconBg: "bg-yellow-100",
    description: "Bus, taxis, bateaux et transferts",
    href: (slug: string) => `/villes/${slug}/transport`,
  },
];

export async function generateStaticParams() {
  return Object.keys(VILLES).map(ville => ({ ville }));
}

export async function generateMetadata({ params }: { params: Promise<{ ville: string }> }) {
  const { ville } = await params;
  const data = VILLES[ville];
  if (!data) return { title: "Ville introuvable" };
  return {
    title: `${data.nom} — Hôtels, Plages, Restaurants | CÔTIÈRE`,
    description: data.description,
  };
}

export default async function VillePage({ params }: { params: Promise<{ ville: string }> }) {
  const { ville } = await params;
  const data = VILLES[ville];
  if (!data) notFound();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative text-white py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src={data.image} alt={data.nom} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-6 transition-colors">
            <ChevronLeft size={16} /> Accueil
          </Link>
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={16} className="text-[#c9a84c]" />
            <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest">{data.region}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black mb-4">{data.nom}</h1>
          <p className="text-white/80 text-lg max-w-2xl leading-relaxed">{data.description}</p>
        </div>
      </section>

      {/* Catégories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest">Explorer</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0c4a6e] mt-2">
              Que cherchez-vous à {data.nom} ?
            </h2>
            <p className="text-gray-500 mt-2">Sélectionnez une catégorie pour découvrir les meilleures adresses</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.id}
                  href={cat.href(data.slug)}
                  className={`group flex flex-col items-center text-center p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${cat.color}`}
                >
                  <div className={`w-14 h-14 ${cat.iconBg} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon size={26} />
                  </div>
                  <h3 className="font-bold text-[#0c4a6e] text-base mb-1">{cat.label}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-3">{cat.description}</p>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#c9a84c] group-hover:gap-2 transition-all">
                    Voir <ArrowRight size={12} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Autres villes */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-lg font-bold text-[#0c4a6e] mb-6">Autres villes du littoral</h3>
          <div className="flex flex-wrap gap-2">
            {Object.values(VILLES).filter(v => v.slug !== data.slug).map(v => (
              <Link
                key={v.slug}
                href={`/villes/${v.slug}`}
                className="flex items-center gap-1.5 bg-gray-50 hover:bg-[#faf8f4] border border-gray-200 hover:border-[#c9a84c]/40 text-gray-700 hover:text-[#c9a84c] text-sm font-medium px-4 py-2 rounded-full transition-all"
              >
                <MapPin size={12} /> {v.nom}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
