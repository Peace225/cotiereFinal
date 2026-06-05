import { ArrowRight, MapPin, Clock, Users, Star, Compass, Ship, Camera, Globe } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { buildMeta } from "@/lib/seo";

export const metadata: Metadata = buildMeta({
  title: "Où Voyager — Excursions & Découvertes sur le Littoral Ivoirien",
  description: "Excursions plage et lagune, visites patrimoine UNESCO, safari nature, guides multilingues. Découvrez le littoral ivoirien avec CÔTIÈRE.",
  path: "/services/tourisme/ou-voyager",
});

const destinations = [
  {
    id: "grand-bassam",
    name: "Grand-Bassam",
    subtitle: "Patrimoine UNESCO",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80",
    desc: "Ancienne capitale coloniale classée au patrimoine mondial de l'UNESCO. Architecture coloniale, plages, musées et artisanat local.",
    duration: "Journée complète",
    price: "15 000 FCFA / pers.",
    highlights: ["Quartier France historique", "Musée national du costume", "Plage de Grand-Bassam", "Artisans locaux"],
  },
  {
    id: "assinie",
    name: "Assinie-Mafia",
    subtitle: "Plages & Lagune",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80",
    desc: "Station balnéaire prisée entre océan et lagune d'Aby. Plages de sable blanc, sports nautiques et ambiance tropicale.",
    duration: "Week-end",
    price: "25 000 FCFA / pers.",
    highlights: ["Plage de sable blanc", "Lagune d'Aby", "Sports nautiques", "Pêche sportive"],
  },
  {
    id: "jacqueville",
    name: "Jacqueville",
    subtitle: "Île & Lagune Ébrié",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80",
    desc: "Île accessible par pont, entre lagune Ébrié et océan Atlantique. Pêche traditionnelle, plages sauvages et villages de pêcheurs.",
    duration: "Journée",
    price: "12 000 FCFA / pers.",
    highlights: ["Pont de Jacqueville", "Villages de pêcheurs", "Plages sauvages", "Cuisine locale"],
  },
  {
    id: "sassandra",
    name: "Sassandra",
    subtitle: "Ville historique",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80",
    desc: "Ville historique à l'embouchure de la rivière Sassandra. Rochers pittoresques, plages et architecture coloniale préservée.",
    duration: "Week-end",
    price: "35 000 FCFA / pers.",
    highlights: ["Rochers de Sassandra", "Rivière Sassandra", "Plage des rochers", "Marché local"],
  },
  {
    id: "san-pedro",
    name: "San-Pédro",
    subtitle: "2ème port de Côte d'Ivoire",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    desc: "Ville portuaire dynamique avec de belles plages. Gastronomie de fruits de mer, vie nocturne et excursions en mer.",
    duration: "Week-end",
    price: "40 000 FCFA / pers.",
    highlights: ["Port de San-Pédro", "Plage de San-Pédro", "Fruits de mer frais", "Excursions en mer"],
  },
  {
    id: "fresco",
    name: "Fresco",
    subtitle: "Plage sauvage préservée",
    image: "https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=600&q=80",
    desc: "L'une des plus belles plages sauvages de Côte d'Ivoire. Cadre naturel préservé, pêche artisanale et authenticité totale.",
    duration: "Journée",
    price: "20 000 FCFA / pers.",
    highlights: ["Plage sauvage", "Pêche artisanale", "Nature préservée", "Authenticité locale"],
  },
  {
    id: "abidjan",
    name: "Abidjan",
    subtitle: "Capitale économique",
    image: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600&q=80",
    desc: "Métropole dynamique sur la lagune Ébrié. Plages de Vridi et Port-Bouët, vie nocturne, gastronomie et culture ivoirienne au cœur de la ville.",
    duration: "Week-end",
    price: "10 000 FCFA / pers.",
    highlights: ["Plage de Vridi", "Lagune Ébrié", "Marché de Treichville", "Plateau (centre-ville)"],
  },
  {
    id: "grand-lahou",
    name: "Grand-Lahou",
    subtitle: "Lagune & Fleuve Bandama",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80",
    desc: "Ville côtière à l'embouchure du fleuve Bandama. Paysages de lagune, plages désertes et traditions de pêche ancestrales.",
    duration: "Journée",
    price: "18 000 FCFA / pers.",
    highlights: ["Embouchure du Bandama", "Plage de Grand-Lahou", "Pêche traditionnelle", "Lagune Tadio"],
  },
  {
    id: "aboisso",
    name: "Aboisso",
    subtitle: "Porte du Sud-Comoé",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80",
    desc: "Ville proche de la frontière ghanéenne et de la lagune Aby. Point de départ idéal pour explorer Assinie et les villages de pêcheurs du Sud-Comoé.",
    duration: "Journée",
    price: "15 000 FCFA / pers.",
    highlights: ["Lagune Aby", "Villages de pêcheurs", "Forêt classée", "Frontière Ghana"],
  },
  {
    id: "adiake",
    name: "Adiaké",
    subtitle: "Lagune Aby & Pêche",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80",
    desc: "Ville côtière du Sud-Comoé, au bord de la lagune Aby. Connue pour sa pêche artisanale, ses villages lacustres et sa proximité avec Assinie.",
    duration: "Journée",
    price: "15 000 FCFA / pers.",
    highlights: ["Lagune Aby", "Villages lacustres", "Pêche artisanale", "Proximité Assinie"],
  },
  {
    id: "dabou",
    name: "Dabou",
    subtitle: "Lagune Ébrié & Traditions",
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80",
    desc: "Ville historique sur la lagune Ébrié, entre Abidjan et Grand-Lahou. Riche en traditions Adjoukrou, marchés animés et paysages lagunaires.",
    duration: "Journée",
    price: "12 000 FCFA / pers.",
    highlights: ["Lagune Ébrié", "Culture Adjoukrou", "Marché local", "Paysages lagunaires"],
  },
  {
    id: "grand-bereby",
    name: "Grand-Béreby",
    subtitle: "Plages vierges du Sud-Ouest",
    image: "https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=600&q=80",
    desc: "Ville côtière du Sud-Ouest ivoirien, entre San-Pédro et Tabou. Plages sauvages préservées, forêt tropicale dense et biodiversité marine exceptionnelle.",
    duration: "Week-end",
    price: "40 000 FCFA / pers.",
    highlights: ["Plages sauvages", "Forêt tropicale", "Biodiversité marine", "Pêche artisanale"],
  },
  {
    id: "tabou",
    name: "Tabou",
    subtitle: "Extrême Sud-Ouest",
    image: "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=600&q=80",
    desc: "Ville frontalière avec le Libéria, aux confins du littoral ivoirien. Plages vierges, forêt tropicale dense et biodiversité exceptionnelle.",
    duration: "Week-end",
    price: "45 000 FCFA / pers.",
    highlights: ["Plages vierges", "Forêt tropicale", "Frontière Libéria", "Biodiversité rare"],
  },
];
const activities = [
  { icon: Ship, label: "Excursions en bateau", desc: "Découverte de la lagune et de l'océan en bateau traditionnel ou moderne" },
  { icon: Camera, label: "Visites patrimoine", desc: "Circuits guidés des sites historiques et culturels du littoral" },
  { icon: Globe, label: "Guides multilingues", desc: "Guides disponibles en 6 langues : français, anglais, espagnol, arabe, allemand, chinois" },
  { icon: Compass, label: "Safari nature", desc: "Observation de la faune et flore du littoral ivoirien" },
];

export default function OuVoyagerPage() {
  return (
    <div className="min-h-screen">

      {/* Hero */}
      <section className="relative text-white py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80"
            alt="Où Voyager" className="w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <Link href="/services/tourisme" className="text-white/70 hover:text-white text-sm flex items-center gap-1 mb-4 transition-colors">
              ← Retour au Tourisme
            </Link>
            <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest">Tourisme & Voyage</span>
            <h1 className="text-2xl sm:text-2xl sm:text-4xl md:text-5xl font-bold mt-2 mb-4">Où Voyager</h1>
            <p className="text-gray-100 text-lg leading-relaxed">
              Découvrez les plus belles destinations du littoral ivoirien. Excursions guidées, visites culturelles et aventures nature sur 500 km de côtes.
            </p>
            <a href="#destinations" className="btn-primary mt-8 inline-flex">
              Voir les destinations <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* Activités */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {activities.map(a => {
              const Icon = a.icon;
              return (
                <div key={a.label} className="bg-[#f0f9ff] rounded-2xl p-5 border border-[#bae6fd]">
                  <div className="w-10 h-10 bg-[#0c4a6e]/10 rounded-xl flex items-center justify-center mb-3">
                    <Icon size={20} className="text-[#0c4a6e]" />
                  </div>
                  <h3 className="font-bold text-[#0c4a6e] text-sm mb-1">{a.label}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{a.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section id="destinations" className="py-16 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest">Nos destinations</span>
            <h2 className="section-title mt-2">Les incontournables du littoral</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map(d => (
              <div key={d.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm card-hover border border-gray-100">
                <div className="relative h-48 overflow-hidden">
                  <img src={d.image} alt={d.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="bg-[#c9a84c] text-white text-xs font-bold px-2.5 py-1 rounded-full">{d.subtitle}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-[#0c4a6e] text-lg mb-1">{d.name}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-3">{d.desc}</p>

                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                    <span className="flex items-center gap-1"><Clock size={12} /> {d.duration}</span>
                    <span className="flex items-center gap-1 text-[#c9a84c] font-semibold"><MapPin size={12} /> {d.price}</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {d.highlights.map(h => (
                      <span key={h} className="text-xs bg-[#f0f9ff] text-[#0c4a6e] px-2 py-0.5 rounded-full border border-[#bae6fd]">{h}</span>
                    ))}
                  </div>

                  <Link href="/services/tourisme#voyages"
                    className="btn-primary w-full justify-center text-sm py-2">
                    Réserver ce voyage <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#0c4a6e] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Voyage sur mesure ?</h2>
          <p className="text-gray-300 mb-8">Contactez-nous pour organiser un voyage personnalisé selon vos envies et votre budget.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/services/tourisme" className="btn-primary">Voir tous les voyages <ArrowRight size={18} /></Link>
            <Link href="/contact" className="flex items-center gap-2 bg-white/10 border border-white/30 text-white font-bold px-5 py-3 rounded-xl hover:bg-white/20 transition-colors">
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
