import { ArrowRight, MapPin, Clock, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

type Destination = {
  name: string; subtitle: string; image: string; desc: string;
  duration: string; price: string; highlights: string[];
  images: string[];
};

const destinations: Record<string, Destination> = {
  "grand-bassam": { name: "Grand-Bassam", subtitle: "Patrimoine UNESCO", image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80", desc: "Ancienne capitale coloniale classée au patrimoine mondial de l'UNESCO. Architecture coloniale, plages, musées et artisanat local. Une destination incontournable du littoral ivoirien.", duration: "Journée complète (8h — 18h)", price: "15 000 FCFA / pers.", highlights: ["Quartier France historique", "Musée national du costume", "Plage de Grand-Bassam", "Artisans locaux", "Restaurants de fruits de mer"], images: ["https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80", "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80"] },
  "assinie": { name: "Assinie-Mafia", subtitle: "Plages & Lagune", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80", desc: "Station balnéaire prisée entre océan et lagune d'Aby. Plages de sable blanc, sports nautiques et ambiance tropicale. Le paradis des amateurs de plage.", duration: "Week-end (2 jours)", price: "25 000 FCFA / pers.", highlights: ["Plage de sable blanc", "Lagune d'Aby", "Sports nautiques", "Pêche sportive", "Hôtels de luxe"], images: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80", "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80"] },
  "jacqueville": { name: "Jacqueville", subtitle: "Île & Lagune Ébrié", image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80", desc: "Île accessible par pont, entre lagune Ébrié et océan Atlantique. Pêche traditionnelle, plages sauvages et villages de pêcheurs authentiques.", duration: "Journée (8h — 18h)", price: "12 000 FCFA / pers.", highlights: ["Pont de Jacqueville", "Villages de pêcheurs", "Plages sauvages", "Cuisine locale", "Mangroves"], images: ["https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80", "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80"] },
  "sassandra": { name: "Sassandra", subtitle: "Ville historique", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80", desc: "Ville historique à l'embouchure de la rivière Sassandra. Rochers pittoresques, plages et architecture coloniale préservée.", duration: "Week-end (2 jours)", price: "35 000 FCFA / pers.", highlights: ["Rochers de Sassandra", "Rivière Sassandra", "Plage des rochers", "Marché local", "Pêche traditionnelle"], images: ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80", "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80"] },
  "san-pedro": { name: "San-Pédro", subtitle: "2ème port de Côte d'Ivoire", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80", desc: "Ville portuaire dynamique avec de belles plages. Gastronomie de fruits de mer, vie nocturne et excursions en mer.", duration: "Week-end (2 jours)", price: "40 000 FCFA / pers.", highlights: ["Port de San-Pédro", "Plage de San-Pédro", "Fruits de mer frais", "Excursions en mer", "Vie nocturne"], images: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80", "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80"] },
  "fresco": { name: "Fresco", subtitle: "Plage sauvage préservée", image: "https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=800&q=80", desc: "L'une des plus belles plages sauvages de Côte d'Ivoire. Cadre naturel préservé, pêche artisanale et authenticité totale.", duration: "Journée (8h — 18h)", price: "20 000 FCFA / pers.", highlights: ["Plage sauvage", "Pêche artisanale", "Nature préservée", "Authenticité locale", "Coucher de soleil"], images: ["https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=800&q=80", "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80"] },
  "abidjan": { name: "Abidjan", subtitle: "Capitale économique", image: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80", desc: "Métropole dynamique sur la lagune Ébrié. Plages de Vridi et Port-Bouët, vie nocturne, gastronomie et culture ivoirienne.", duration: "Week-end (2 jours)", price: "10 000 FCFA / pers.", highlights: ["Plage de Vridi", "Lagune Ébrié", "Marché de Treichville", "Plateau (centre-ville)", "Restaurants gastronomiques"], images: ["https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80", "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80"] },
  "grand-lahou": { name: "Grand-Lahou", subtitle: "Lagune & Fleuve Bandama", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80", desc: "Ville côtière à l'embouchure du fleuve Bandama. Paysages de lagune, plages désertes et traditions de pêche ancestrales.", duration: "Journée (7h — 17h)", price: "18 000 FCFA / pers.", highlights: ["Embouchure du Bandama", "Plage de Grand-Lahou", "Pêche traditionnelle", "Lagune Tadio", "Villages authentiques"], images: ["https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80", "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80"] },
  "adiake": { name: "Adiaké", subtitle: "Lagune Aby & Pêche", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80", desc: "Ville côtière du Sud-Comoé, au bord de la lagune Aby. Connue pour sa pêche artisanale, ses villages lacustres et sa proximité avec Assinie.", duration: "Journée (8h — 18h)", price: "15 000 FCFA / pers.", highlights: ["Lagune Aby", "Villages lacustres", "Pêche artisanale", "Proximité Assinie", "Cuisine locale"], images: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80", "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80"] },
  "dabou": { name: "Dabou", subtitle: "Lagune Ébrié & Traditions", image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80", desc: "Ville historique sur la lagune Ébrié, entre Abidjan et Grand-Lahou. Riche en traditions Adjoukrou, marchés animés et paysages lagunaires.", duration: "Journée (8h — 18h)", price: "12 000 FCFA / pers.", highlights: ["Lagune Ébrié", "Culture Adjoukrou", "Marché local", "Paysages lagunaires", "Villages traditionnels"], images: ["https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80", "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80"] },
  "grand-bereby": { name: "Grand-Béreby", subtitle: "Plages vierges du Sud-Ouest", image: "https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=800&q=80", desc: "Ville côtière du Sud-Ouest ivoirien, entre San-Pédro et Tabou. Plages sauvages préservées, forêt tropicale dense et biodiversité marine exceptionnelle.", duration: "Week-end (2 jours)", price: "40 000 FCFA / pers.", highlights: ["Plages sauvages", "Forêt tropicale", "Biodiversité marine", "Pêche artisanale", "Nature préservée"], images: ["https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=800&q=80", "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=800&q=80"] },
};

async function getExcursionFromDb(id: string): Promise<Destination | null> {
  try {
    const e = await prisma.excursion.findUnique({
      where: { id },
    });
    if (!e) return null;
    return {
      name: e.title,
      subtitle: e.difficulty ?? "Littoral ivoirien",
      image: e.images[0] ?? "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
      desc: e.description,
      duration: e.duration,
      price: `${e.priceAdult.toLocaleString()} FCFA / pers.`,
      highlights: [],
      images: e.images,
    };
  } catch {
    return null;
  }
}

export default async function DestinationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // 1. Chercher dans les destinations hardcodées
  const dest = destinations[id] ?? await getExcursionFromDb(id);

  if (!dest) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-lg">Destination introuvable.</p>
        <Link href="/services/tourisme" className="btn-primary">Voir nos voyages</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-[#0c4a6e]">Accueil</Link>
          <span>/</span>
          <Link href="/services/tourisme" className="hover:text-[#0c4a6e]">Tourisme</Link>
          <span>/</span>
          <Link href="/services/tourisme#voyages" className="hover:text-[#0c4a6e]">Nos Voyages</Link>
          <span>/</span>
          <span className="text-[#0c4a6e] font-medium">{dest.name}</span>
        </div>
      </div>

      {/* Hero */}
      <section className="relative text-white overflow-hidden min-h-[400px] flex items-end">
        <div className="absolute inset-0">
          <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
        </div>
        <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 pt-24">
          <Link href="/services/tourisme#voyages" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-4 transition-colors">
            <ChevronLeft size={16} /> Retour aux voyages
          </Link>
          <span className="bg-[#c9a84c] text-white text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block">{dest.subtitle}</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">{dest.name}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
            <span className="flex items-center gap-1.5"><Clock size={14} className="text-[#c9a84c]" />{dest.duration}</span>
            <span className="flex items-center gap-1.5"><MapPin size={14} className="text-[#c9a84c]" />{dest.price}</span>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-[#0c4a6e] mb-4">À propos de {dest.name}</h2>
              <p className="text-gray-600 leading-relaxed">{dest.desc}</p>
            </div>

            {dest.highlights.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-[#0c4a6e] mb-4">Points d&apos;intérêt</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {dest.highlights.map(h => (
                    <div key={h} className="flex items-center gap-3 p-3 bg-[#f0f9ff] rounded-xl border border-[#bae6fd]">
                      <span className="w-2 h-2 bg-[#c9a84c] rounded-full shrink-0" />
                      <span className="text-sm text-gray-700 font-medium">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {dest.images.length > 1 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-[#0c4a6e] mb-4">Galerie</h2>
                <div className="grid grid-cols-2 gap-3">
                  {dest.images.map((img, i) => (
                    <img key={i} src={img} alt={`${dest.name} ${i + 1}`} className="w-full h-40 object-cover rounded-xl" />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h3 className="font-bold text-[#0c4a6e] text-lg mb-4">Infos pratiques</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm py-2 border-b border-gray-50">
                  <span className="text-gray-500">Durée</span>
                  <span className="font-semibold text-[#0c4a6e]">{dest.duration}</span>
                </div>
                <div className="flex justify-between text-sm py-2 border-b border-gray-50">
                  <span className="text-gray-500">Prix</span>
                  <span className="font-bold text-[#c9a84c]">{dest.price}</span>
                </div>
                <div className="flex justify-between text-sm py-2">
                  <span className="text-gray-500">Groupe</span>
                  <span className="font-semibold text-[#0c4a6e]">2 — 20 personnes</span>
                </div>
              </div>
              <Link href="/services/tourisme#voyages" className="btn-primary w-full justify-center mb-3">
                Réserver cette excursion <ArrowRight size={16} />
              </Link>
              <a
                href={`https://wa.me/2250747722931?text=${encodeURIComponent(`Bonjour, je souhaite réserver l'excursion : ${dest.name} (${dest.price}). Merci.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold py-3 rounded-xl transition-colors text-sm"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Réserver via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
