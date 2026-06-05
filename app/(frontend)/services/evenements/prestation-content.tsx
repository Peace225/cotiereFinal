"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Phone, ChevronRight, Clock, Star, Flower2, UtensilsCrossed, Music, Shield, Users, Sparkles } from "lucide-react";

type Prestation = {
  title: string; subtitle: string; icon: React.ReactNode;
  heroImage: string; description: string; longDesc: string;
  priceRange: string; included: string[];
  process: { step: string; desc: string }[];
  gallery: string[]; useCases: string[];
};

const PRESTATIONS: Record<string, Prestation> = {
  "decoration": {
    title: "Décoration & Scénographie",
    subtitle: "Fleurs · Mobilier · Mise en scène",
    icon: <Flower2 size={18} />,
    heroImage: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600&q=80",
    description: "Transformez chaque espace en décor de rêve",
    longDesc: "Notre équipe de décorateurs et scénographes crée des ambiances uniques et personnalisées pour vos événements. Des compositions florales aux installations artistiques, en passant par le mobilier de prestige et les éclairages d'ambiance, nous concevons des décors qui reflètent votre personnalité et impressionnent vos invités. Chaque détail est pensé pour créer une atmosphère inoubliable.",
    priceRange: "150 000 — 500 000 FCFA",
    included: ["Consultation & moodboard personnalisé", "Compositions florales (fleurs fraîches ou artificielles)", "Mobilier de prestige (tables, chaises, canapés)", "Arches & structures décoratives", "Nappage & vaisselle décorative", "Éclairage d'ambiance LED", "Tapis rouge & allée d'honneur", "Installation & démontage compris"],
    process: [
      { step: "Consultation créative", desc: "Échange sur vos goûts, couleurs et thème souhaité" },
      { step: "Moodboard & devis", desc: "Présentation visuelle du projet et devis détaillé" },
      { step: "Installation", desc: "Mise en place le jour J par notre équipe" },
      { step: "Démontage", desc: "Récupération du matériel après l'événement" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&q=80",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=80",
    ],
    useCases: ["Mariages & fiançailles", "Galas & soirées de prestige", "Baptêmes & communions", "Anniversaires", "Événements corporate", "Conférences & séminaires", "Expositions", "Lancements de produits"],
  },
  "traiteur": {
    title: "Traiteur & Restauration",
    subtitle: "Cuisine ivoirienne & internationale · Service à table",
    icon: <UtensilsCrossed size={18} />,
    heroImage: "https://images.unsplash.com/photo-1555244162-803834f70033?w=1600&q=80",
    description: "Une gastronomie à la hauteur de votre événement",
    longDesc: "Notre service traiteur propose une cuisine raffinée alliant saveurs ivoiriennes et gastronomie internationale. De l'apéritif au dessert, nos chefs cuisinent avec des produits frais et locaux pour régaler vos convives. Nous gérons tout : la conception du menu, la préparation, le service à table et le nettoyage. Capacité de 50 à 2000 personnes.",
    priceRange: "5 000 — 25 000 FCFA / personne",
    included: ["Consultation & création du menu", "Cuisine avec produits frais locaux", "Personnel de service (serveurs, maîtres d'hôtel)", "Vaisselle & couverts professionnels", "Mise en place des tables", "Service à table ou buffet", "Cocktail & boissons (sur option)", "Nettoyage après service"],
    process: [
      { step: "Dégustation", desc: "Séance de dégustation pour valider le menu" },
      { step: "Planification", desc: "Organisation logistique et commande des produits" },
      { step: "Préparation", desc: "Cuisine le jour J par notre équipe de chefs" },
      { step: "Service", desc: "Service professionnel pendant toute la durée du repas" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1555244162-803834f70033?w=600&q=80",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
    ],
    useCases: ["Mariages (50 à 2000 pers.)", "Galas & dîners de prestige", "Cocktails d'entreprise", "Buffets de conférence", "Baptêmes & anniversaires", "Déjeuners d'affaires", "Réceptions diplomatiques", "Événements culturels"],
  },
  "sonorisation": {
    title: "Sonorisation & Éclairage",
    subtitle: "Son HD · Lumières LED · Scène professionnelle",
    icon: <Music size={18} />,
    heroImage: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1600&q=80",
    description: "L'ambiance sonore et lumineuse parfaite",
    longDesc: "Notre équipe technique installe et gère des systèmes de sonorisation et d'éclairage professionnels pour tous types d'événements. Des petites salles aux grandes scènes en plein air, nous disposons du matériel adapté : enceintes line array, consoles de mixage numériques, éclairages LED motorisés, lasers et machines à fumée. Un technicien son et un technicien lumière sont présents pendant toute la durée de l'événement.",
    priceRange: "100 000 — 400 000 FCFA",
    included: ["Système de sonorisation professionnel (line array)", "Console de mixage numérique", "Microphones (filaires & HF)", "Éclairages LED motorisés (moving heads)", "Projecteurs & wash lights", "Machine à fumée & effets spéciaux", "Technicien son dédié", "Technicien lumière dédié", "Installation & démontage"],
    process: [
      { step: "Repérage technique", desc: "Visite du lieu pour planifier l'installation" },
      { step: "Installation", desc: "Mise en place du matériel son et lumière" },
      { step: "Balance & tests", desc: "Réglages et tests avant l'événement" },
      { step: "Gestion live", desc: "Techniciens présents pendant toute la durée" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80",
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80",
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&q=80",
    ],
    useCases: ["Concerts & festivals", "Mariages & galas", "Conférences & séminaires", "Soirées dansantes", "Spectacles & shows", "Événements sportifs", "Cérémonies officielles", "Lancements de produits"],
  },
  "securite": {
    title: "Sécurité Événementielle",
    subtitle: "Agents formés · Contrôle d'accès · Gestion des foules",
    icon: <Shield size={18} />,
    heroImage: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1600&q=80",
    description: "La sécurité de vos invités, notre priorité",
    longDesc: "Notre service de sécurité événementielle met à votre disposition des agents professionnels formés et expérimentés. Nous assurons le contrôle d'accès, la gestion des flux de personnes, la surveillance des biens et la sécurité rapprochée des personnalités. Nos équipes interviennent en tenue civile ou en uniforme selon vos préférences, avec une communication radio permanente.",
    priceRange: "50 000 — 200 000 FCFA",
    included: ["Agents de sécurité certifiés", "Contrôle d'accès & vérification des invitations", "Gestion des flux & placement des invités", "Surveillance périmétrique", "Communication radio entre agents", "Coordination avec les forces de l'ordre", "Rapport de sécurité post-événement", "Disponibilité 24h/24"],
    process: [
      { step: "Analyse des risques", desc: "Évaluation du site et des besoins en sécurité" },
      { step: "Plan de sécurité", desc: "Élaboration du dispositif et positionnement des agents" },
      { step: "Briefing équipe", desc: "Réunion de préparation avec tous les agents" },
      { step: "Déploiement", desc: "Mise en place du dispositif le jour J" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&q=80",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=80",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&q=80",
    ],
    useCases: ["Concerts & festivals", "Mariages & galas", "Conférences & sommets", "Événements VIP", "Cérémonies officielles", "Événements sportifs", "Soirées privées", "Expositions & salons"],
  },
  "hotesses": {
    title: "Hôtesses & Accueil",
    subtitle: "Accueil professionnel · Bilingue · Tenue élégante",
    icon: <Users size={18} />,
    heroImage: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1600&q=80",
    description: "Un accueil chaleureux et professionnel pour vos invités",
    longDesc: "Nos hôtesses et hôtes d'accueil professionnels assurent un accueil de qualité pour vos événements. Formés aux techniques d'accueil, bilingues (français/anglais) et présentés en tenue élégante, ils gèrent l'enregistrement des invités, la distribution des badges, l'orientation et l'assistance tout au long de l'événement. Disponibles pour tous types d'événements, de 2 à 50 personnes.",
    priceRange: "25 000 — 100 000 FCFA",
    included: ["Hôtesses/hôtes formés & expérimentés", "Tenue élégante fournie", "Bilingue français/anglais", "Gestion de la liste des invités", "Distribution des badges & programmes", "Orientation & assistance", "Vestiaire (sur option)", "Coordination avec l'équipe organisatrice"],
    process: [
      { step: "Briefing", desc: "Présentation de l'événement et des consignes spécifiques" },
      { step: "Préparation", desc: "Mise en place du poste d'accueil et du matériel" },
      { step: "Accueil", desc: "Réception et orientation des invités à leur arrivée" },
      { step: "Assistance", desc: "Présence tout au long de l'événement" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&q=80",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=80",
    ],
    useCases: ["Conférences & séminaires", "Salons & expositions", "Galas & soirées", "Lancements de produits", "Événements corporate", "Mariages de prestige", "Réceptions diplomatiques", "Événements sportifs VIP"],
  },
  "animation": {
    title: "Animation & Spectacles",
    subtitle: "DJ · Artistes · Animateurs · Shows",
    icon: <Sparkles size={18} />,
    heroImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1600&q=80",
    description: "Des animations qui font vibrer vos invités",
    longDesc: "Notre catalogue d'animations et de spectacles couvre tous les styles et tous les budgets. DJs professionnels, groupes de musique live, danseurs, comédiens, magiciens, cracheurs de feu, troupes de danse traditionnelle ivoirienne... Nous sélectionnons les meilleurs artistes pour créer des moments forts et inoubliables lors de votre événement.",
    priceRange: "75 000 — 300 000 FCFA",
    included: ["DJ professionnel avec matériel", "Artistes & performers sélectionnés", "Animateur/MC de soirée", "Coordination artistique", "Répétitions & briefing artistes", "Gestion des temps forts", "Effets spéciaux (fumée, confettis)", "Playlist personnalisée"],
    process: [
      { step: "Sélection artistique", desc: "Choix des artistes selon votre thème et budget" },
      { step: "Contrats & briefing", desc: "Signature des contrats et briefing des artistes" },
      { step: "Répétition", desc: "Répétition technique le jour avant ou le matin J" },
      { step: "Performance", desc: "Animation professionnelle pendant l'événement" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=80",
    ],
    useCases: ["Mariages & galas", "Soirées dansantes", "Anniversaires", "Événements corporate", "Concerts privés", "Festivals", "Cérémonies de remise de prix", "Fêtes de fin d'année"],
  },
};

export default function EvenementPrestationPage() {
  const { slug } = useParams<{ slug: string }>();
  const data = PRESTATIONS[slug];

  if (!data) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-gray-500">Prestation introuvable.</p>
      <Link href="/services/evenements" className="btn-primary">Retour aux événements</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc]">

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-[#0c4a6e] transition-colors">Accueil</Link>
          <ChevronRight size={14} />
          <Link href="/services/evenements" className="hover:text-[#0c4a6e] transition-colors">Événements</Link>
          <ChevronRight size={14} />
          <span className="text-[#0c4a6e] font-semibold truncate">{data.title}</span>
        </div>
      </div>

      {/* Hero */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img src={data.heroImage} alt={data.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-5xl mx-auto">
          <Link href="/services/evenements" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-3 transition-colors">
            <ArrowLeft size={15} /> Retour aux prestations
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-[#c9a84c] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
              {data.icon} CÔTIÈRE EVENT
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-white">{data.title}</h1>
          <p className="text-white/80 mt-1 text-sm md:text-base">{data.subtitle}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-[#0c4a6e] mb-3">{data.description}</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{data.longDesc}</p>
            </div>

            {/* Galerie */}
            <div className="grid grid-cols-3 gap-2">
              {data.gallery.map((img, i) => (
                <div key={i} className={`rounded-xl overflow-hidden ${i === 0 ? "col-span-2" : ""}`}>
                  <img src={img} alt={data.title} className="w-full object-cover hover:scale-105 transition-transform duration-300"
                    style={{ height: i === 0 ? "200px" : "96px" }} />
                </div>
              ))}
            </div>

            {/* Ce qui est inclus */}
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

            {/* Notre processus */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-[#0c4a6e] mb-5">Notre processus</h2>
              <div className="space-y-4">
                {data.process.map((p, i) => (
                  <div key={p.step} className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-[#c9a84c] text-white rounded-full flex items-center justify-center text-sm font-black shrink-0">{i + 1}</div>
                    <div>
                      <p className="font-semibold text-[#0c4a6e] text-sm">{p.step}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cas d'usage */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-[#0c4a6e] mb-4">Pour quels événements ?</h2>
              <div className="flex flex-wrap gap-2">
                {data.useCases.map(u => (
                  <span key={u} className="text-xs bg-[#f0f9ff] text-[#0c4a6e] px-3 py-1.5 rounded-full border border-[#bae6fd] font-medium">{u}</span>
                ))}
              </div>
            </div>

            {/* Autres prestations */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-[#0c4a6e] mb-4">Nos autres prestations</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.entries(PRESTATIONS).filter(([s]) => s !== slug).map(([s, p]) => (
                  <Link key={s} href={`/services/evenements/${s}`}
                    className="group relative rounded-xl overflow-hidden h-20 shadow-sm hover:shadow-md transition-shadow">
                    <img src={p.gallery[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <p className="absolute bottom-2 left-2 right-2 text-white text-xs font-semibold leading-tight">{p.title}</p>
                  </Link>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 sticky top-24">

              <div className="text-center pb-4 border-b border-gray-100 mb-4">
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Tarif indicatif</p>
                <p className="text-2xl font-black text-[#c9a84c] leading-tight">{data.priceRange}</p>
                <p className="text-xs text-gray-400 mt-1">Devis gratuit & personnalisé sous 24h</p>
              </div>

              <Link href="/services/evenements#demande" className="btn-primary w-full justify-center">
                Demander un devis <ArrowRight size={16} />
              </Link>

              <a href="tel:+2250747722931" className="mt-2 w-full flex items-center justify-center gap-2 text-sm font-semibold text-[#0c4a6e] border border-[#0c4a6e]/20 py-2.5 rounded-xl hover:bg-[#0c4a6e]/5 transition-colors">
                <Phone size={15} /> Appeler maintenant
              </a>

              <div className="mt-4 flex items-start gap-2 bg-[#f0f9ff] border border-[#bae6fd] rounded-xl p-3">
                <Star size={14} className="text-[#c9a84c] fill-[#c9a84c] shrink-0 mt-0.5" />
                <p className="text-xs text-[#0c4a6e] leading-relaxed">
                  <strong>Devis personnalisé</strong> envoyé sous 24h. Nous nous adaptons à tous les budgets.
                </p>
              </div>

              <p className="text-xs text-gray-400 text-center mt-3 flex items-center justify-center gap-1">
                <Clock size={11} /> Réponse sous 24h · Sans engagement
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

