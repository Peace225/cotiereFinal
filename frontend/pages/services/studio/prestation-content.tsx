"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Phone, ChevronRight, Clock, Star, Camera, Video, Radio, Plane, Tv, Film, Package, Sparkles, Shield } from "lucide-react";

type Prestation = {
  title: string; subtitle: string; icon: React.ReactNode;
  heroImage: string; description: string; longDesc: string;
  priceRange: string; duration: string;
  included: string[]; process: { step: string; desc: string }[];
  gallery: string[]; useCases: string[];
};

const PRESTATIONS: Record<string, Prestation> = {
  "tournage-video": {
    title: "Tournage Vidéo Pro",
    subtitle: "Caméras 4K · Son HD · Éclairage cinéma",
    icon: <Video size={18} />,
    heroImage: "https://images.unsplash.com/photo-1601506521793-dc748fc80b67?w=1920&q=80",
    description: "Captez chaque moment avec une qualité cinématographique",
    longDesc: "Équipe complète avec caméras 4K, stabilisateurs motorisés et prise de son HD. Nous couvrons mariages, conférences, concerts et clips. Brief préalable, repérages et montage inclus.",
    priceRange: "150 000 — 300 000 FCFA",
    duration: "Demi-journée à journée",
    included: ["Caméras 4K x2", "Gimbal stabilisé", "Éclairage LED pro", "Son HF + perche", "Opérateur certifié", "Montage inclus"],
    process: [
      { step: "Brief", desc: "Échange et repérages" },
      { step: "Tournage", desc: "Équipe sur site" },
      { step: "Dérushage", desc: "Sélection des plans" },
      { step: "Livraison", desc: "Montage final" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1601506521793-dc748fc80b67?w=800&q=80",
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80",
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80",
    ],
    useCases: ["Mariages", "Conférences", "Concerts", "Clips", "Publicités", "Corporate"],
  },
  "photographie": {
    title: "Photographie Pro",
    subtitle: "Plein format · Retouche incluse",
    icon: <Camera size={18} />,
    heroImage: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1920&q=80",
    description: "Des photos qui racontent votre histoire",
    longDesc: "Appareils plein format, objectifs premium et retouche soignée. Livraison sous 5-10 jours en haute résolution.",
    priceRange: "100 000 — 200 000 FCFA",
    duration: "2h à journée",
    included: ["Boîtiers plein format x2", "Objectifs pro", "Flash studio", "Retouche complète", "Galerie privée", "Droits inclus"],
    process: [
      { step: "Consultation", desc: "Style et planning" },
      { step: "Shooting", desc: "Couverture complète" },
      { step: "Retouche", desc: "Tri et colorimétrie" },
      { step: "Livraison", desc: "Galerie HD" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
      "https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=800&q=80",
    ],
    useCases: ["Mariages", "Portraits", "Corporate", "Événements", "Produits", "Reportages"],
  },
  "streaming-live": {
    title: "Streaming Live",
    subtitle: "Multi-plateformes · HD",
    icon: <Radio size={18} />,
    heroImage: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=1920&q=80",
    description: "Diffusez dans le monde entier",
    longDesc: "Diffusion YouTube, Facebook, Zoom avec encodeur pro et connexion 4G secours.",
    priceRange: "80 000 — 150 000 FCFA",
    duration: "Selon événement",
    included: ["Encodeur pro", "4G secours", "Multi-diffusion", "Incrustations live", "Technicien", "Replay"],
    process: [
      { step: "Setup", desc: "Config plateformes" },
      { step: "Live", desc: "Régie temps réel" },
      { step: "Monitoring", desc: "Qualité HD" },
      { step: "Replay", desc: "Archivage" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800&q=80",
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    ],
    useCases: ["Conférences", "Concerts", "Mariages", "Formations", "Lancements"],
  },
  "drone": {
    title: "Drone 4K",
    subtitle: "Pilote certifié · Vues aériennes",
    icon: <Plane size={18} />,
    heroImage: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1920&q=80",
    description: "Perspectives uniques depuis les airs",
    longDesc: "DJI Mavic/Phantom 4K, pilote certifié, autorisations incluses.",
    priceRange: "100 000 — 200 000 FCFA",
    duration: "2h à demi-journée",
    included: ["Drone 4K", "Pilote certifié", "Autorisations", "Stabilisation 3 axes", "Photos+vidéos", "Assurance"],
    process: [
      { step: "Repérage", desc: "Zone et autorisations" },
      { step: "Vol", desc: "Prises de vue" },
      { step: "Montage", desc: "Assemblage" },
      { step: "Livraison", desc: "Fichiers 4K" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80",
      "https://images.unsplash.com/photo-1508444845599-5c89863b1c44?w=800&q=80",
      "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&q=80",
    ],
    useCases: ["Mariages", "Immobilier", "Tourisme", "Clips", "Événements"],
  },
  "regie-mobile": {
    title: "Régie Mobile TV",
    subtitle: "Multi-cam · Mixage pro",
    icon: <Tv size={18} />,
    heroImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80",
    description: "Qualité broadcast sur site",
    longDesc: "Régie complète avec mélangeur vidéo, console audio et incrustations.",
    priceRange: "200 000 — 400 000 FCFA",
    duration: "Journée",
    included: ["Régie mobile", "Mélangeur multi-cam", "Console audio", "Monitoring", "Technicien", "Master HD"],
    process: [
      { step: "Install", desc: "Câblage caméras" },
      { step: "Tests", desc: "Répétition" },
      { step: "Direct", desc: "Régie live" },
      { step: "Master", desc: "Livraison" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800&q=80",
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80",
    ],
    useCases: ["Conférences", "Concerts", "TV", "Galas", "Sport"],
  },
  "montage-video": {
    title: "Montage Pro",
    subtitle: "Étalonnage · VFX",
    icon: <Film size={18} />,
    heroImage: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1920&q=80",
    description: "Transformez vos rushes",
    longDesc: "Premiere Pro, DaVinci Resolve, After Effects. 2 révisions incluses.",
    priceRange: "50 000 — 150 000 FCFA",
    duration: "5-15 jours",
    included: ["Montage pro", "Étalonnage", "VFX", "Habillage", "Mixage", "2 révisions"],
    process: [
      { step: "Rushes", desc: "Réception" },
      { step: "Rough cut", desc: "Premier montage" },
      { step: "Finition", desc: "Couleurs & effets" },
      { step: "Export", desc: "Livraison" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80",
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80",
      "https://images.unsplash.com/photo-1601506521793-dc748fc80b67?w=800&q=80",
    ],
    useCases: ["Mariages", "Clips", "Pubs", "Corporate", "Docs"],
  },
  "livraison": {
    title: "Livraison Premium",
    subtitle: "Clé USB · Lien sécurisé",
    icon: <Package size={18} />,
    heroImage: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1920&q=80",
    description: "Vos fichiers en sécurité",
    longDesc: "Clé USB gravée ou lien sécurisé 30 jours. Sauvegarde 6 mois.",
    priceRange: "10 000 — 20 000 FCFA",
    duration: "24-48h",
    included: ["Clé USB 32Go", "Gravure perso", "Lien 30j", "Organisation", "Multi-formats", "Backup 6 mois"],
    process: [
      { step: "Prépa", desc: "Organisation" },
      { step: "Export", desc: "Multi-formats" },
      { step: "Upload", desc: "Serveur sécurisé" },
      { step: "Livraison", desc: "Remise" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80",
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80",
      "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80",
    ],
    useCases: ["Mariages", "Événements", "Archives", "Partage"],
  },
};

export default function StudioPrestationPage() {
  const { slug } = useParams<{ slug: string }>();
  const data = PRESTATIONS[slug];

  if (!data) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
      <div className="text-center">
        <p className="text-white/60 mb-4">Prestation introuvable</p>
        <Link href="/services/studio" className="inline-flex items-center gap-2 bg-[#c9a84c] text-black px-5 py-2.5 rounded-xl font-medium">
          <ArrowLeft size={16} /> Retour
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      {/* Breadcrumb */}
      <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-12 flex items-center gap-2 text- text-white/50 overflow-x-auto">
          <Link href="/" className="hover:text-white whitespace-nowrap">Accueil</Link>
          <ChevronRight size={12} />
          <Link href="/services/studio" className="hover:text-white whitespace-nowrap">Studio</Link>
          <ChevronRight size={12} />
          <span className="text-[#c9a84c] truncate">{data.title}</span>
        </div>
      </div>

      {/* HERO */}
      <div className="relative h- min-h- overflow-hidden">
        <img src={data.heroImage} alt={data.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/70 to-black/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#020617_90%)]" />

        <div className="relative h-full max-w-6xl mx-auto px-4 flex flex-col justify-end pb-8 sm:pb-12">
          <Link href="/services/studio" className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text- mb-4 w-fit">
            <ArrowLeft size={14} /> Toutes les prestations
          </Link>

          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-[#c9a84c]/20 backdrop-blur border border-[#c9a84c]/30 flex items-center justify-center text-[#c9a84c]">
              {data.icon}
            </div>
            <span className="text- uppercase tracking-widest font-semibold text-[#c9a84c]">HBL Studio+</span>
          </div>

          <h1 className="text-[clamp(1.75rem,6vw,3rem)] font-black leading-[1.1] tracking-tight max-w-3xl">
            {data.title}
          </h1>
          <p className="text-white/70 mt-2 text-sm sm:text-base">{data.subtitle}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* MAIN */}
          <div className="lg:col-span-2 space-y-6">
            {/* Intro */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded- p-6 sm:p-8">
              <div className="flex items-start gap-3 mb-4">
                <Sparkles size={20} className="text-[#c9a84c] mt-0.5 shrink-0" />
                <div>
                  <h2 className="text-xl font-bold mb-2">{data.description}</h2>
                  <p className="text-white/60 leading-relaxed text-">{data.longDesc}</p>
                </div>
              </div>
            </div>

            {/* Gallery */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {data.gallery.map((img, i) => (
                <div key={i} className={`relative rounded-2xl overflow-hidden ${i === 0? "col-span-2 row-span-2 aspect-[4/3]" : "aspect-square"}`}>
                  <img src={img} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>

            {/* Inclus */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded- p-6 sm:p-8">
              <h3 className="font-bold text-lg mb-5 flex items-center gap-2">
                <Check size={18} className="text-green-400" />
                Inclus dans la prestation
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {data.included.map(item => (
                  <div key={item} className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#c9a84c]/15 flex items-center justify-center shrink-0">
                      <Check size={12} className="text-[#c9a84c]" />
                    </div>
                    <span className="text-white/80 text-">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Process */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded- p-6 sm:p-8">
              <h3 className="font-bold text-lg mb-6">Comment ça marche</h3>
              <div className="grid sm:grid-cols-2 gap-5">
                {data.process.map((p, i) => (
                  <div key={p.step} className="relative">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#c9a84c] to-[#b8973b] text-black font-bold text-sm flex items-center justify-center shrink-0">
                        {i + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-white text-">{p.step}</p>
                        <p className="text-white/50 text- mt-0.5">{p.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Use cases */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded- p-6">
              <h3 className="font-semibold mb-3 text- text-white/80">Idéal pour</h3>
              <div className="flex flex-wrap gap-2">
                {data.useCases.map(u => (
                  <span key={u} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text- text-white/70 transition-colors">
                    {u}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white/[0.05] backdrop-blur-2xl border border-white/15 rounded- p-6 shadow-2xl">
              <div className="text-center pb-5 border-b border-white/10">
                <p className="text- uppercase tracking-widest text-white/40 mb-1">À partir de</p>
                <p className="text- font-black text-[#c9a84c] leading-none">{data.priceRange.split(' — ')[0]}</p>
                <p className="text-white/40 text- mt-1">{data.duration}</p>
              </div>

              <div className="py-5 space-y-3">
                <div className="flex items-center gap-2 text- text-white/60">
                  <Shield size={14} className="text-green-400" />
                  Devis gratuit sous 24h
                </div>
                <div className="flex items-center gap-2 text- text-white/60">
                  <Clock size={14} className="text-[#c9a84c]" />
                  Réponse immédiate
                </div>
              </div>

              <div className="space-y-2.5">
                <Link href="/services/studio#reservation" className="w-full flex items-center justify-center gap-2 bg-[#c9a84c] hover:bg-[#d4b456] text-black font-semibold py-3 rounded-xl transition-all active:scale-[0.98]">
                  Demander un devis <ArrowRight size={16} />
                </Link>
                <a href="tel:+2250747722931" className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/15 text-white py-3 rounded-xl transition-all text-">
                  <Phone size={16} /> Appeler
                </a>
              </div>

              <p className="text-center text- text-white/30 mt-4">Sans engagement · Paiement sécurisé</p>
            </div>

            {/* Autres prestations desktop */}
            <div className="hidden lg:block mt-6">
              <p className="text- uppercase tracking-widest text-white/40 mb-3">Autres prestations</p>
              <div className="space-y-2">
                {Object.entries(PRESTATIONS).filter(([s]) => s!== slug).slice(0,3).map(([s, p]) => (
                  <Link key={s} href={`/services/studio/${s}`} className="group flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/5 border border-transparent hover:border-white/10 transition-all">
                    <img src={p.gallery[0]} alt="" className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text- font-medium text-white/80 group-hover:text-white truncate">{p.title}</p>
                      <p className="text- text-white/40">{p.priceRange.split(' — ')[0]}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Mobile Sticky */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 p-4 bg-gradient-to-t from-[#020617] to-transparent pointer-events-none">
        <div className="flex gap-2 pointer-events-auto">
          <a href="tel:+2250747722931" className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl flex items-center justify-center">
            <Phone size={18} className="text-white" />
          </a>
          <Link href="/services/studio#reservation" className="flex-1 bg-[#c9a84c] text-black font-semibold h-12 rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-black/50">
            Devis gratuit <ArrowRight size={16} />
          </Link>
        </div>
      </div>
      <div className="h-20 lg:hidden" />
    </div>
  );
}