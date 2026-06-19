"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Phone, ChevronRight, Clock, Star, Flower2, UtensilsCrossed, Music, Shield, Users, Sparkles } from "lucide-react";

// Force le rendu dynamique pour Ã©viter les erreurs de gÃ©nÃ©ration statique au build
export const dynamic = 'force-dynamic';

type Prestation = {
  title: string; subtitle: string; icon: React.ReactNode;
  heroImage: string; description: string; longDesc: string;
  priceRange: string; included: string[];
  process: { step: string; desc: string }[];
  gallery: string[]; useCases: string[];
};

const PRESTATIONS: Record<string, Prestation> = {
  "decoration": {
    title: "DÃ©coration & ScÃ©nographie",
    subtitle: "Fleurs Â· Mobilier Â· Mise en scÃ¨ne",
    icon: <Flower2 size={18} />,
    heroImage: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600&q=80",
    description: "Transformez chaque espace en dÃ©cor de rÃªve",
    longDesc: "Notre Ã©quipe de dÃ©corateurs et scÃ©nographes crÃ©e des ambiances uniques et personnalisÃ©es pour vos Ã©vÃ©nements. Des compositions florales aux installations artistiques, en passant par le mobilier de prestige et les Ã©clairages d'ambiance, nous concevons des dÃ©cors qui reflÃ¨tent votre personnalitÃ© et impressionnent vos invitÃ©s. Chaque dÃ©tail est pensÃ© pour crÃ©er une atmosphÃ¨re inoubliable.",
    priceRange: "150 000 â€” 500 000 FCFA",
    included: ["Consultation & moodboard personnalisÃ©", "Compositions florales (fleurs fraÃ®ches ou artificielles)", "Mobilier de prestige (tables, chaises, canapÃ©s)", "Arches & structures dÃ©coratives", "Nappage & vaisselle dÃ©corative", "Ã‰clairage d'ambiance LED", "Tapis rouge & allÃ©e d'honneur", "Installation & dÃ©montage compris"],
    process: [
      { step: "Consultation crÃ©ative", desc: "Ã‰change sur vos goÃ»ts, couleurs et thÃ¨me souhaitÃ©" },
      { step: "Moodboard & devis", desc: "PrÃ©sentation visuelle du projet et devis dÃ©taillÃ©" },
      { step: "Installation", desc: "Mise en place le jour J par notre Ã©quipe" },
      { step: "DÃ©montage", desc: "RÃ©cupÃ©ration du matÃ©riel aprÃ¨s l'Ã©vÃ©nement" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&q=80",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=80",
    ],
    useCases: ["Mariages & fianÃ§ailles", "Galas & soirÃ©es de prestige", "BaptÃªmes & communions", "Anniversaires", "Ã‰vÃ©nements corporate", "ConfÃ©rences & sÃ©minaires", "Expositions", "Lancements de produits"],
  },
  "traiteur": {
    title: "Traiteur & Restauration",
    subtitle: "Cuisine ivoirienne & internationale Â· Service Ã  table",
    icon: <UtensilsCrossed size={18} />,
    heroImage: "https://images.unsplash.com/photo-1555244162-803834f70033?w=1600&q=80",
    description: "Une gastronomie Ã  la hauteur de votre Ã©vÃ©nement",
    longDesc: "Notre service traiteur propose une cuisine raffinÃ©e alliant saveurs ivoiriennes et gastronomie internationale. De l'apÃ©ritif au dessert, nos chefs cuisinent avec des produits frais et locaux pour rÃ©galer vos convives. Nous gÃ©rons tout : la conception du menu, la prÃ©paration, le service Ã  table et le nettoyage. CapacitÃ© de 50 Ã  2000 personnes.",
    priceRange: "5 000 â€” 25 000 FCFA / personne",
    included: ["Consultation & crÃ©ation du menu", "Cuisine avec produits frais locaux", "Personnel de service (serveurs, maÃ®tres d'hÃ´tel)", "Vaisselle & couverts professionnels", "Mise en place des tables", "Service Ã  table ou buffet", "Cocktail & boissons (sur option)", "Nettoyage aprÃ¨s service"],
    process: [
      { step: "DÃ©gustation", desc: "SÃ©ance de dÃ©gustation pour valider le menu" },
      { step: "Planification", desc: "Organisation logistique et commande des produits" },
      { step: "PrÃ©paration", desc: "Cuisine le jour J par notre Ã©quipe de chefs" },
      { step: "Service", desc: "Service professionnel pendant toute la durÃ©e du repas" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1555244162-803834f70033?w=600&q=80",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
    ],
    useCases: ["Mariages (50 Ã  2000 pers.)", "Galas & dÃ®ners de prestige", "Cocktails d'entreprise", "Buffets de confÃ©rence", "BaptÃªmes & anniversaires", "DÃ©jeuners d'affaires", "RÃ©ceptions diplomatiques", "Ã‰vÃ©nements culturels"],
  },
  "sonorisation": {
    title: "Sonorisation & Ã‰clairage",
    subtitle: "Son HD Â· LumiÃ¨res LED Â· ScÃ¨ne professionnelle",
    icon: <Music size={18} />,
    heroImage: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1600&q=80",
    description: "L'ambiance sonore et lumineuse parfaite",
    longDesc: "Notre Ã©quipe technique installe et gÃ¨re des systÃ¨mes de sonorisation et d'Ã©clairage professionnels pour tous types d'Ã©vÃ©nements. Des petites salles aux grandes scÃ¨nes en plein air, nous disposons du matÃ©riel adaptÃ© : enceintes line array, consoles de mixage numÃ©riques, Ã©clairages LED motorisÃ©s, lasers et machines Ã  fumÃ©e. Un technicien son et un technicien lumiÃ¨re sont prÃ©sents pendant toute la durÃ©e de l'Ã©vÃ©nement.",
    priceRange: "100 000 â€” 400 000 FCFA",
    included: ["SystÃ¨me de sonorisation professionnel (line array)", "Console de mixage numÃ©rique", "Microphones (filaires & HF)", "Ã‰clairages LED motorisÃ©s (moving heads)", "Projecteurs & wash lights", "Machine Ã  fumÃ©e & effets spÃ©ciaux", "Technicien son dÃ©diÃ©", "Technicien lumiÃ¨re dÃ©diÃ©", "Installation & dÃ©montage"],
    process: [
      { step: "RepÃ©rage technique", desc: "Visite du lieu pour planifier l'installation" },
      { step: "Installation", desc: "Mise en place du matÃ©riel son et lumiÃ¨re" },
      { step: "Balance & tests", desc: "RÃ©glages et tests avant l'Ã©vÃ©nement" },
      { step: "Gestion live", desc: "Techniciens prÃ©sents pendant toute la durÃ©e" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80",
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80",
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&q=80",
    ],
    useCases: ["Concerts & festivals", "Mariages & galas", "ConfÃ©rences & sÃ©minaires", "SoirÃ©es dansantes", "Spectacles & shows", "Ã‰vÃ©nements sportifs", "CÃ©rÃ©monies officielles", "Lancements de produits"],
  },
  "securite": {
    title: "SÃ©curitÃ© Ã‰vÃ©nementielle",
    subtitle: "Agents formÃ©s Â· ContrÃ´le d'accÃ¨s Â· Gestion des foules",
    icon: <Shield size={18} />,
    heroImage: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1600&q=80",
    description: "La sÃ©curitÃ© de vos invitÃ©s, notre prioritÃ©",
    longDesc: "Notre service de sÃ©curitÃ© Ã©vÃ©nementielle met Ã  votre disposition des agents professionnels formÃ©s et expÃ©rimentÃ©s. Nous assurons le contrÃ´le d'accÃ¨s, la gestion des flux de personnes, la surveillance des biens et la sÃ©curitÃ© rapprochÃ©e des personnalitÃ©s. Nos Ã©quipes interviennent en tenue civile ou en uniforme selon vos prÃ©fÃ©rences, avec une communication radio permanente.",
    priceRange: "50 000 â€” 200 000 FCFA",
    included: ["Agents de sÃ©curitÃ© certifiÃ©s", "ContrÃ´le d'accÃ¨s & vÃ©rification des invitations", "Gestion des flux & placement des invitÃ©s", "Surveillance pÃ©rimÃ©trique", "Communication radio entre agents", "Coordination avec les forces de l'ordre", "Rapport de sÃ©curitÃ© post-Ã©vÃ©nement", "DisponibilitÃ© 24h/24"],
    process: [
      { step: "Analyse des risques", desc: "Ã‰valuation du site et des besoins en sÃ©curitÃ©" },
      { step: "Plan de sÃ©curitÃ©", desc: "Ã‰laboration du dispositif et positionnement des agents" },
      { step: "Briefing Ã©quipe", desc: "RÃ©union de prÃ©paration avec tous les agents" },
      { step: "DÃ©ploiement", desc: "Mise en place du dispositif le jour J" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&q=80",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=80",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&q=80",
    ],
    useCases: ["Concerts & festivals", "Mariages & galas", "ConfÃ©rences & sommets", "Ã‰vÃ©nements VIP", "CÃ©rÃ©monies officielles", "Ã‰vÃ©nements sportifs", "SoirÃ©es privÃ©es", "Expositions & salons"],
  },
  "hotesses": {
    title: "HÃ´tesses & Accueil",
    subtitle: "Accueil professionnel Â· Bilingue Â· Tenue Ã©lÃ©gante",
    icon: <Users size={18} />,
    heroImage: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1600&q=80",
    description: "Un accueil chaleureux et professionnel pour vos invitÃ©s",
    longDesc: "Nos hÃ´tesses et hÃ´tes d'accueil professionnels assurent un accueil de qualitÃ© pour vos Ã©vÃ©nements. FormÃ©s aux techniques d'accueil, bilingues (franÃ§ais/anglais) et prÃ©sentÃ©s en tenue Ã©lÃ©gante, ils gÃ¨rent l'enregistrement des invitÃ©s, la distribution des badges, l'orientation et l'assistance tout au long de l'Ã©vÃ©nement. Disponibles pour tous types d'Ã©vÃ©nements, de 2 Ã  50 personnes.",
    priceRange: "25 000 â€” 100 000 FCFA",
    included: ["HÃ´tesses/hÃ´tes formÃ©s & expÃ©rimentÃ©s", "Tenue Ã©lÃ©gante fournie", "Bilingue franÃ§ais/anglais", "Gestion de la liste des invitÃ©s", "Distribution des badges & programmes", "Orientation & assistance", "Vestiaire (sur option)", "Coordination avec l'Ã©quipe organisatrice"],
    process: [
      { step: "Briefing", desc: "PrÃ©sentation de l'Ã©vÃ©nement et des consignes spÃ©cifiques" },
      { step: "PrÃ©paration", desc: "Mise en place du poste d'accueil et du matÃ©riel" },
      { step: "Accueil", desc: "RÃ©ception et orientation des invitÃ©s Ã  leur arrivÃ©e" },
      { step: "Assistance", desc: "PrÃ©sence tout au long de l'Ã©vÃ©nement" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&q=80",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=80",
    ],
    useCases: ["ConfÃ©rences & sÃ©minaires", "Salons & expositions", "Galas & soirÃ©es", "Lancements de produits", "Ã‰vÃ©nements corporate", "Mariages de prestige", "RÃ©ceptions diplomatiques", "Ã‰vÃ©nements sportifs VIP"],
  },
  "animation": {
    title: "Animation & Spectacles",
    subtitle: "DJ Â· Artistes Â· Animateurs Â· Shows",
    icon: <Sparkles size={18} />,
    heroImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1600&q=80",
    description: "Des animations qui font vibrer vos invitÃ©s",
    longDesc: "Notre catalogue d'animations et de spectacles couvre tous les styles et tous les budgets. DJs professionnels, groupes de musique live, danseurs, comÃ©diens, magiciens, cracheurs de feu, troupes de danse traditionnelle ivoirienne... Nous sÃ©lectionnons les meilleurs artistes pour crÃ©er des moments forts et inoubliables lors de votre Ã©vÃ©nement.",
    priceRange: "75 000 â€” 300 000 FCFA",
    included: ["DJ professionnel avec matÃ©riel", "Artistes & performers sÃ©lectionnÃ©s", "Animateur/MC de soirÃ©e", "Coordination artistique", "RÃ©pÃ©titions & briefing artistes", "Gestion des temps forts", "Effets spÃ©ciaux (fumÃ©e, confettis)", "Playlist personnalisÃ©e"],
    process: [
      { step: "SÃ©lection artistique", desc: "Choix des artistes selon votre thÃ¨me et budget" },
      { step: "Contrats & briefing", desc: "Signature des contrats et briefing des artistes" },
      { step: "RÃ©pÃ©tition", desc: "RÃ©pÃ©tition technique le jour avant ou le matin J" },
      { step: "Performance", desc: "Animation professionnelle pendant l'Ã©vÃ©nement" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=80",
    ],
    useCases: ["Mariages & galas", "SoirÃ©es dansantes", "Anniversaires", "Ã‰vÃ©nements corporate", "Concerts privÃ©s", "Festivals", "CÃ©rÃ©monies de remise de prix", "FÃªtes de fin d'annÃ©e"],
  },
};

export default function EvenementPrestationPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const data = slug ? PRESTATIONS[slug] : null;

  if (!data) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-gray-500">Prestation introuvable.</p>
      <Link href="/services/evenements" className="btn-primary">Retour aux Ã©vÃ©nements</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-[#0c4a6e] transition-colors">Accueil</Link>
          <ChevronRight size={14} />
          <Link href="/services/evenements" className="hover:text-[#0c4a6e] transition-colors">Ã‰vÃ©nements</Link>
          <ChevronRight size={14} />
          <span className="text-[#0c4a6e] font-semibold truncate">{data.title}</span>
        </div>
      </div>

      <div className="relative h-64 md:h-80 overflow-hidden">
        <img src={data.heroImage} alt={data.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-5xl mx-auto">
          <Link href="/services/evenements" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-3 transition-colors">
            <ArrowLeft size={15} /> Retour aux prestations
          </Link>
          <h1 className="text-2xl md:text-4xl font-black text-white">{data.title}</h1>
          <p className="text-white/80 mt-1 text-sm md:text-base">{data.subtitle}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-[#0c4a6e] mb-3">{data.description}</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{data.longDesc}</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-[#0c4a6e] mb-4 flex items-center gap-2">
                <Check size={18} className="text-green-500" /> Ce qui est inclus
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {data.included.map(item => (
                  <div key={item} className="flex items-start gap-2 text-sm text-gray-600">
                    <Check size={13} className="text-[#c9a84c] shrink-0 mt-0.5" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 sticky top-24">
              <div className="text-center pb-4 border-b border-gray-100 mb-4">
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Tarif indicatif</p>
                <p className="text-2xl font-black text-[#c9a84c] leading-tight">{data.priceRange}</p>
              </div>
              <Link href="/services/evenements#demande" className="btn-primary w-full justify-center">
                Demander un devis <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

