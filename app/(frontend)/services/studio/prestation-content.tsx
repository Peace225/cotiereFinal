"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Phone, ChevronRight, Clock, Star, Camera, Video, Radio, Plane, Tv, Film, Package } from "lucide-react";

type Prestation = {
  title: string; subtitle: string; icon: React.ReactNode;
  heroImage: string; description: string; longDesc: string;
  priceRange: string; duration: string;
  included: string[]; process: { step: string; desc: string }[];
  gallery: string[]; useCases: string[];
};

const PRESTATIONS: Record<string, Prestation> = {
  "tournage-video": {
    title: "Tournage Vidéo Professionnel",
    subtitle: "Caméras 4K · Son HD · Éclairage pro",
    icon: <Video size={20} />,
    heroImage: "https://images.unsplash.com/photo-1601506521793-dc748fc80b67?w=1600&q=80",
    description: "Captez chaque moment avec une qualité cinématographique",
    longDesc: "Notre équipe de tournage professionnel intervient sur tous types d'événements avec du matériel haut de gamme : caméras 4K, stabilisateurs, éclairage LED professionnel et prise de son HD. Nous couvrons mariages, conférences, baptêmes, concerts, événements d'entreprise et clips musicaux. Chaque tournage est préparé en amont avec un brief détaillé pour garantir un résultat à la hauteur de vos attentes.",
    priceRange: "150 000 — 300 000 FCFA",
    duration: "Demi-journée à journée complète",
    included: ["Caméras 4K professionnelles (x2 minimum)", "Stabilisateur motorisé (gimbal)", "Éclairage LED professionnel", "Prise de son HD (micro-cravate + perche)", "Opérateur caméra expérimenté", "Directeur de production", "Repérages préalables", "Montage inclus (selon forfait)"],
    process: [
      { step: "Brief & préparation", desc: "Échange sur vos besoins, repérages du lieu, planning de tournage" },
      { step: "Tournage", desc: "Intervention de l'équipe avec tout le matériel professionnel" },
      { step: "Dérushage", desc: "Sélection des meilleures prises et organisation des rushes" },
      { step: "Montage & livraison", desc: "Montage professionnel et livraison dans les délais convenus" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1601506521793-dc748fc80b67?w=600&q=80",
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&q=80",
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&q=80",
    ],
    useCases: ["Mariages & cérémonies", "Conférences & séminaires", "Baptêmes & communions", "Concerts & spectacles", "Clips musicaux", "Publicités & spots TV", "Documentaires", "Événements d'entreprise"],
  },
  "photographie": {
    title: "Photographie Professionnelle",
    subtitle: "Appareils plein format · Retouche incluse",
    icon: <Camera size={20} />,
    heroImage: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1600&q=80",
    description: "Des photos qui racontent votre histoire",
    longDesc: "Nos photographes professionnels capturent les moments forts de vos événements avec des appareils plein format et des objectifs haut de gamme. Chaque photo est retouchée avec soin pour un rendu naturel et élégant. Nous livrons vos photos en haute résolution, prêtes pour l'impression ou le partage numérique, dans un délai de 5 à 10 jours ouvrés.",
    priceRange: "100 000 — 200 000 FCFA",
    duration: "2h à journée complète",
    included: ["Appareils plein format (x2)", "Objectifs professionnels (grand angle, portrait, télé)", "Flash & éclairage d'appoint", "Photographe professionnel", "Retouche de toutes les photos", "Livraison en haute résolution", "Galerie en ligne privée", "Droits d'utilisation complets"],
    process: [
      { step: "Consultation", desc: "Discussion sur le style souhaité, repérages et planning" },
      { step: "Séance photo", desc: "Couverture complète de votre événement" },
      { step: "Sélection & retouche", desc: "Tri des meilleures photos et retouche professionnelle" },
      { step: "Livraison", desc: "Galerie en ligne + fichiers haute résolution sous 5-10 jours" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600&q=80",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80",
      "https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=600&q=80",
    ],
    useCases: ["Mariages & fiançailles", "Portraits professionnels", "Événements corporate", "Baptêmes & anniversaires", "Shooting produits", "Photos de presse", "Reportages", "Portraits de famille"],
  },
  "streaming-live": {
    title: "Streaming en Direct (Live)",
    subtitle: "Multi-plateformes · HD · Encodage temps réel",
    icon: <Radio size={20} />,
    heroImage: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=1600&q=80",
    description: "Diffusez votre événement en direct dans le monde entier",
    longDesc: "Notre service de streaming professionnel vous permet de diffuser vos événements en direct sur YouTube, Facebook, Instagram, Zoom ou toute autre plateforme. Nous gérons l'encodage, la connexion internet de secours, les graphiques en incrustation et la régie technique en temps réel. Idéal pour les conférences, concerts, cérémonies religieuses et événements d'entreprise.",
    priceRange: "80 000 — 150 000 FCFA",
    duration: "Selon durée de l'événement",
    included: ["Encodeur streaming professionnel", "Connexion internet dédiée (4G/5G de secours)", "Diffusion multi-plateformes simultanée", "Graphiques & incrustations en temps réel", "Technicien streaming dédié", "Monitoring de la qualité en direct", "Enregistrement de la diffusion", "Lien de rediffusion après l'événement"],
    process: [
      { step: "Configuration", desc: "Paramétrage des plateformes, test de connexion et répétition technique" },
      { step: "Mise en ligne", desc: "Démarrage du stream avec vérification de la qualité" },
      { step: "Diffusion live", desc: "Gestion technique en temps réel, incrustations et monitoring" },
      { step: "Archivage", desc: "Enregistrement et mise à disposition de la rediffusion" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=600&q=80",
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    ],
    useCases: ["Conférences & séminaires", "Concerts & spectacles", "Cérémonies religieuses", "Mariages pour invités distants", "Formations en ligne", "Lancements de produits", "Assemblées générales", "Événements sportifs"],
  },
  "drone": {
    title: "Prises de Vue Aériennes par Drone",
    subtitle: "Drone 4K · Pilote certifié · Vues panoramiques",
    icon: <Plane size={20} />,
    heroImage: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1600&q=80",
    description: "Des perspectives uniques depuis les airs",
    longDesc: "Nos pilotes de drone certifiés capturent des images aériennes spectaculaires en 4K. Que ce soit pour des survols de sites touristiques, des couvertures d'événements ou des productions cinématographiques, nos drones offrent des perspectives uniques impossibles à obtenir autrement. Nous respectons toutes les réglementations en vigueur pour les vols en Côte d'Ivoire.",
    priceRange: "100 000 — 200 000 FCFA",
    duration: "2h à demi-journée",
    included: ["Drone professionnel 4K (DJI Mavic/Phantom)", "Pilote certifié", "Autorisations de vol (selon zone)", "Stabilisation 3 axes", "Photos & vidéos aériennes", "Livraison des fichiers bruts + montage", "Assurance responsabilité civile"],
    process: [
      { step: "Repérage & autorisations", desc: "Étude de la zone de vol, demande d'autorisations si nécessaire" },
      { step: "Briefing technique", desc: "Plan de vol, points d'intérêt et angles souhaités" },
      { step: "Tournage aérien", desc: "Prises de vue photos et vidéo selon le plan établi" },
      { step: "Livraison", desc: "Fichiers bruts + montage des séquences aériennes" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&q=80",
      "https://images.unsplash.com/photo-1508444845599-5c89863b1c44?w=600&q=80",
      "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=600&q=80",
    ],
    useCases: ["Mariages & cérémonies", "Immobilier & architecture", "Tourisme & paysages", "Événements sportifs", "Clips musicaux", "Publicités", "Documentaires", "Cartographie de sites"],
  },
  "regie-mobile": {
    title: "Régie Mobile pour Rendu TV",
    subtitle: "Multi-caméras · Mixage audio · Diffusion pro",
    icon: <Tv size={20} />,
    heroImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80",
    description: "La qualité broadcast pour vos événements",
    longDesc: "Notre régie mobile est un studio de production complet sur roues. Elle permet de gérer plusieurs caméras simultanément, de mixer le son en temps réel, d'incruster des graphiques et de produire un rendu de qualité broadcast. Idéale pour les grandes conférences, les concerts, les émissions en direct et les événements nécessitant une production télévisuelle professionnelle.",
    priceRange: "200 000 — 400 000 FCFA",
    duration: "Journée complète",
    included: ["Régie mobile complète", "Mélangeur vidéo multi-caméras", "Console de mixage audio professionnelle", "Écrans de monitoring", "Incrustations & graphiques en temps réel", "Technicien régie dédié", "Câblage & installation complète", "Enregistrement master HD"],
    process: [
      { step: "Installation", desc: "Mise en place de la régie et câblage de toutes les caméras" },
      { step: "Tests & répétition", desc: "Vérification de tous les flux vidéo et audio" },
      { step: "Production live", desc: "Gestion en temps réel de la régie pendant l'événement" },
      { step: "Démontage & livraison", desc: "Récupération du master et démontage du matériel" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
      "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=600&q=80",
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&q=80",
    ],
    useCases: ["Grandes conférences", "Concerts & festivals", "Émissions TV en direct", "Cérémonies officielles", "Événements sportifs", "Galas & soirées de gala", "Assemblées générales", "Retransmissions sportives"],
  },
  "montage-video": {
    title: "Montage Vidéo Post-Production",
    subtitle: "Effets visuels · Étalonnage · Musique",
    icon: <Film size={20} />,
    heroImage: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&q=80",
    description: "Transformez vos rushes en chef-d'œuvre",
    longDesc: "Notre équipe de monteurs professionnels transforme vos rushes bruts en vidéos finales de haute qualité. Nous maîtrisons les logiciels de montage professionnels (Premiere Pro, DaVinci Resolve, After Effects) pour créer des vidéos avec des effets visuels, un étalonnage colorimétrique soigné, une bande sonore adaptée et des sous-titres si nécessaire. Délai de livraison : 5 à 15 jours selon la complexité.",
    priceRange: "50 000 — 150 000 FCFA",
    duration: "5 à 15 jours ouvrés",
    included: ["Montage professionnel (Premiere Pro / DaVinci)", "Étalonnage colorimétrique", "Effets visuels & transitions", "Habillage graphique (titres, génériques)", "Mixage audio & musique", "Sous-titres (sur demande)", "2 révisions incluses", "Export multi-formats (MP4, MOV, 4K)"],
    process: [
      { step: "Réception des rushes", desc: "Transfert sécurisé de vos fichiers vidéo bruts" },
      { step: "Montage rough cut", desc: "Premier montage pour validation de la structure" },
      { step: "Finition & étalonnage", desc: "Effets, couleurs, son et habillage graphique" },
      { step: "Livraison finale", desc: "Export en haute qualité et livraison dans les formats souhaités" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&q=80",
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&q=80",
      "https://images.unsplash.com/photo-1601506521793-dc748fc80b67?w=600&q=80",
    ],
    useCases: ["Films de mariage", "Clips musicaux", "Publicités & spots", "Documentaires", "Vidéos corporate", "Teasers & trailers", "Vidéos réseaux sociaux", "Films institutionnels"],
  },
  "livraison": {
    title: "Livraison sur Clé USB / Lien de Téléchargement",
    subtitle: "Haute résolution · Sécurisé · Rapide",
    icon: <Package size={20} />,
    heroImage: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1600&q=80",
    description: "Vos fichiers livrés en toute sécurité",
    longDesc: "Nous proposons plusieurs modes de livraison de vos fichiers finaux : clé USB haute vitesse gravée à votre nom, lien de téléchargement sécurisé (valable 30 jours), transfert WeTransfer ou Google Drive. Tous les fichiers sont livrés en haute résolution, organisés par dossiers et accompagnés d'un bon de livraison détaillant le contenu.",
    priceRange: "10 000 — 20 000 FCFA",
    duration: "Immédiat à 48h",
    included: ["Clé USB haute vitesse (32 Go minimum)", "Gravure personnalisée avec votre nom/événement", "Lien de téléchargement sécurisé (30 jours)", "Fichiers organisés par dossiers", "Formats multiples (MP4, JPG, RAW sur demande)", "Bon de livraison détaillé", "Sauvegarde sur nos serveurs (6 mois)"],
    process: [
      { step: "Préparation des fichiers", desc: "Organisation, renommage et vérification de tous les fichiers" },
      { step: "Export & compression", desc: "Export dans les formats et résolutions souhaités" },
      { step: "Gravure / Upload", desc: "Gravure sur clé USB ou upload sur serveur sécurisé" },
      { step: "Livraison", desc: "Remise en main propre ou envoi du lien de téléchargement" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80",
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&q=80",
      "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600&q=80",
    ],
    useCases: ["Livraison de films de mariage", "Remise de photos d'événements", "Transfert de rushes bruts", "Archives numériques", "Partage avec invités", "Envoi à distance", "Backup professionnel"],
  },
};

export default function StudioPrestationPage() {
  const { slug } = useParams<{ slug: string }>();
  const data = PRESTATIONS[slug];

  if (!data) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-gray-500">Prestation introuvable.</p>
      <Link href="/services/studio" className="btn-primary">Retour au Studio</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc]">

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-[#0c4a6e] transition-colors">Accueil</Link>
          <ChevronRight size={14} />
          <Link href="/services/studio" className="hover:text-[#0c4a6e] transition-colors">HBL Studio+</Link>
          <ChevronRight size={14} />
          <span className="text-[#0c4a6e] font-semibold truncate">{data.title}</span>
        </div>
      </div>

      {/* Hero */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img src={data.heroImage} alt={data.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-5xl mx-auto">
          <Link href="/services/studio" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-3 transition-colors">
            <ArrowLeft size={15} /> Retour aux prestations
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-[#c9a84c] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
              {data.icon} HBL Studio+
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
                  <Link key={s} href={`/services/studio/${s}`}
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
                <p className="text-xs text-gray-400 mt-1">FCFA · devis gratuit sous 24h</p>
              </div>

              <div className="space-y-2 mb-5">
                <div className="flex justify-between text-sm py-1.5 border-b border-gray-50">
                  <span className="text-gray-500">Durée</span>
                  <span className="font-semibold text-[#0c4a6e] text-right text-xs">{data.duration}</span>
                </div>
                <div className="flex justify-between text-sm py-1.5">
                  <span className="text-gray-500">Devis</span>
                  <span className="font-semibold text-green-600 text-xs">Gratuit & sans engagement</span>
                </div>
              </div>

              <Link href="/services/studio#reservation" className="btn-primary w-full justify-center">
                Demander un devis <ArrowRight size={16} />
              </Link>

              <a href="tel:+2250747722931" className="mt-2 w-full flex items-center justify-center gap-2 text-sm font-semibold text-[#0c4a6e] border border-[#0c4a6e]/20 py-2.5 rounded-xl hover:bg-[#0c4a6e]/5 transition-colors">
                <Phone size={15} /> Appeler maintenant
              </a>

              <div className="mt-4 flex items-start gap-2 bg-[#f0f9ff] border border-[#bae6fd] rounded-xl p-3">
                <Star size={14} className="text-[#c9a84c] fill-[#c9a84c] shrink-0 mt-0.5" />
                <p className="text-xs text-[#0c4a6e] leading-relaxed">
                  <strong>Devis personnalisé</strong> envoyé sous 24h après étude de votre demande.
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

