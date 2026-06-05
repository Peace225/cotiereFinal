"use client";
import { useParams } from "next/navigation";
import { ArrowRight, Phone, ChevronLeft, Check, Clock } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import StudioBookingForm from "@/components/frontend/studio/StudioBookingForm";

const SERVICES: Record<string, {
  label: string; image: string; subtitle: string; description: string;
  priceRange: string; included: string[];
  process: { step: string; desc: string }[];
}> = {
  "tournage-video": {
    label: "Tournage vidéo professionnel",
    image: "https://images.unsplash.com/photo-1601506521793-dc748fc80b67?w=800&q=80",
    subtitle: "Caméras 4K · Équipe professionnelle · Montage inclus",
    description: "Captez vos moments les plus précieux avec notre équipe de tournage professionnelle. Mariages, conférences, événements d'entreprise, clips musicaux — nous couvrons tous vos besoins audiovisuels.",
    priceRange: "150 000 — 300 000 FCFA",
    included: ["Caméras 4K professionnelles", "Équipe de 2 caméramen", "Éclairage professionnel", "Prise de son HD", "Montage vidéo complet", "Livraison sur clé USB + lien cloud", "Droits de diffusion inclus"],
    process: [{ step: "Réservation", desc: "Choix de la date et briefing" }, { step: "Repérages", desc: "Visite du lieu si nécessaire" }, { step: "Tournage", desc: "Jour J avec toute l'équipe" }, { step: "Livraison", desc: "Vidéo montée sous 7 jours" }],
  },
  "photographie": {
    label: "Photographie professionnelle",
    image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80",
    subtitle: "Appareils plein format · Retouche pro · Livraison rapide",
    description: "Des photos professionnelles qui immortalisent vos événements. Notre photographe capture chaque instant avec précision et créativité.",
    priceRange: "100 000 — 200 000 FCFA",
    included: ["Appareil plein format professionnel", "Objectifs multiples (portrait, grand angle)", "Éclairage studio portable", "Retouche professionnelle de toutes les photos", "Livraison en haute résolution", "Galerie en ligne privée", "Droits d'utilisation complets"],
    process: [{ step: "Brief", desc: "Définition du style et des attentes" }, { step: "Shooting", desc: "Séance photo le jour J" }, { step: "Sélection", desc: "Vous choisissez vos meilleures photos" }, { step: "Retouche", desc: "Livraison sous 5 jours" }],
  },
  "streaming-live": {
    label: "Streaming en direct (live)",
    image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800&q=80",
    subtitle: "YouTube · Facebook · Multi-plateformes · HD",
    description: "Diffusez votre événement en direct sur toutes les plateformes. Touchez votre audience partout dans le monde en temps réel.",
    priceRange: "100 000 — 250 000 FCFA",
    included: ["Encodeur streaming professionnel", "Connexion internet dédiée (4G/fibre)", "Diffusion simultanée multi-plateformes", "Graphiques et habillage en direct", "Archivage de la diffusion", "Modération du chat (sur option)", "Rapport de visionnage"],
    process: [{ step: "Configuration", desc: "Paramétrage des plateformes" }, { step: "Test", desc: "Test technique 1h avant" }, { step: "Live", desc: "Diffusion en direct" }, { step: "Archive", desc: "Vidéo disponible après l'événement" }],
  },
  "drone": {
    label: "Prises de vue aériennes par drone",
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80",
    subtitle: "DJI Pro · 4K · Pilote certifié · Vues spectaculaires",
    description: "Des images aériennes spectaculaires de vos événements et propriétés. Notre pilote certifié capture des vues uniques du littoral ivoirien.",
    priceRange: "80 000 — 200 000 FCFA",
    included: ["Drone DJI professionnel (4K)", "Pilote certifié ANAC", "Autorisation de vol incluse", "Vidéo et photos aériennes", "Montage des séquences drone", "Livraison en 4K", "Assurance responsabilité civile"],
    process: [{ step: "Autorisation", desc: "Demande d'autorisation de vol" }, { step: "Repérage", desc: "Visite du site et planification" }, { step: "Tournage", desc: "Prises de vue aériennes" }, { step: "Montage", desc: "Livraison sous 5 jours" }],
  },
  "regie-mobile": {
    label: "Régie mobile pour rendu TV",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    subtitle: "Multi-caméras · Mixage en direct · Qualité broadcast",
    description: "Une régie mobile complète pour vos événements nécessitant une production de qualité télévisuelle. Conférences, galas, concerts.",
    priceRange: "300 000 — 600 000 FCFA",
    included: ["Régie mobile complète", "4 à 8 caméras selon l'événement", "Mixage audio/vidéo en direct", "Écrans de retour", "Enregistrement multi-caméras", "Diffusion TV ou streaming", "Techniciens spécialisés"],
    process: [{ step: "Planification", desc: "Étude technique du lieu" }, { step: "Installation", desc: "Mise en place la veille" }, { step: "Production", desc: "Régie en direct le jour J" }, { step: "Livraison", desc: "Fichiers master sous 48h" }],
  },
  "montage-video": {
    label: "Montage vidéo post-production",
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80",
    subtitle: "Premiere Pro · After Effects · Étalonnage · Motion design",
    description: "Transformez vos rushes bruts en une vidéo professionnelle et percutante. Notre équipe de montage maîtrise tous les styles.",
    priceRange: "50 000 — 150 000 FCFA",
    included: ["Montage professionnel (Premiere Pro)", "Étalonnage colorimétrique", "Habillage graphique et titres", "Musique libre de droits", "Effets visuels (After Effects)", "2 révisions incluses", "Export multi-formats (MP4, MOV, 4K)"],
    process: [{ step: "Réception", desc: "Envoi de vos rushes" }, { step: "Montage", desc: "Assemblage et rythme" }, { step: "Finition", desc: "Étalonnage et effets" }, { step: "Livraison", desc: "Fichiers finaux sous 7 jours" }],
  },
  "livraison": {
    label: "Livraison sur clé USB / lien de téléchargement",
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80",
    subtitle: "Clé USB · Cloud · Formats multiples · Livraison rapide",
    description: "Recevez vos fichiers dans le format de votre choix. Clé USB personnalisée, lien de téléchargement sécurisé ou les deux.",
    priceRange: "Inclus dans nos forfaits",
    included: ["Clé USB 64Go personnalisée aux couleurs de l'événement", "Lien de téléchargement sécurisé (30 jours)", "Fichiers en haute résolution", "Formats multiples (MP4, MOV, JPEG, RAW)", "Sauvegarde cloud 1 an", "Livraison à domicile possible", "Packaging premium"],
    process: [{ step: "Préparation", desc: "Organisation des fichiers" }, { step: "Export", desc: "Conversion multi-formats" }, { step: "Packaging", desc: "Clé USB personnalisée" }, { step: "Livraison", desc: "Remise en main propre ou envoi" }],
  },
};

export default function StudioServicePage() {
  const { slug } = useParams<{ slug: string }>();
  const service = SERVICES[slug as string];
  const [showForm, setShowForm] = useState(false);

  if (!service) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-gray-500 text-lg">Service introuvable.</p>
      <Link href="/services/studio" className="btn-primary">Retour au studio</Link>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative text-white py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src={service.image} alt={service.label} className="w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/services/studio" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6 transition-colors">
            <ChevronLeft size={16} /> Retour au studio
          </Link>
          <div className="max-w-2xl">
            <span className="bg-[#c9a84c] text-white text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block">HBL Studio+</span>
            <h1 className="text-3xl sm:text-4xl font-bold mt-3 mb-3">{service.label}</h1>
            <p className="text-white/70 text-sm mb-4">{service.subtitle}</p>
            <p className="text-gray-100 text-lg leading-relaxed mb-6">{service.description}</p>
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-2xl font-black text-[#c9a84c]">{service.priceRange}</span>
              <button onClick={() => setShowForm(true)} className="btn-primary">
                Réserver maintenant <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Ce qui est inclus */}
      <section className="py-16 bg-[#f0f9ff]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h2 className="section-title mb-6">Ce qui est inclus</h2>
              <ul className="space-y-3">
                {service.included.map(item => (
                  <li key={item} className="flex items-start gap-3 text-gray-700 text-sm">
                    <Check size={16} className="text-green-500 shrink-0 mt-0.5" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="section-title mb-6">Notre processus</h2>
              <div className="space-y-4">
                {service.process.map((p, i) => (
                  <div key={p.step} className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-[#c9a84c] text-white rounded-full flex items-center justify-center text-sm font-black shrink-0">{i + 1}</div>
                    <div>
                      <p className="font-bold text-[#0c4a6e] text-sm">{p.step}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Formulaire */}
      {showForm ? (
        <section id="reservation" className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="section-title">Réserver — {service.label}</h2>
              <p className="text-gray-500 mt-2 flex items-center justify-center gap-1">
                <Clock size={14} /> Réponse sous 24-48h avec un devis détaillé
              </p>
            </div>
            <StudioBookingForm />
          </div>
        </section>
      ) : (
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="section-title mb-4">Prêt à réserver ?</h2>
            <p className="text-gray-500 mb-8">Remplissez le formulaire, nous vous répondons sous 24-48h avec un devis détaillé.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <button onClick={() => setShowForm(true)} className="btn-primary">
                Faire une demande <ArrowRight size={18} />
              </button>
              <a href="tel:+2250747722931" className="flex items-center gap-2 bg-[#0c4a6e] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#0a3d5c] transition-colors">
                <Phone size={18} /> 07 47 72 29 31
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Autres services */}
      <section className="py-12 bg-[#f8fafc]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="font-bold text-[#0c4a6e] mb-6 text-center">Nos autres prestations</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(SERVICES).filter(([s]) => s !== slug).slice(0, 6).map(([s, svc]) => (
              <Link key={s} href={`/services/studio/${s}`}
                className="group relative rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="relative h-24">
                  <img src={svc.image} alt={svc.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <p className="absolute bottom-2 left-3 right-3 text-white text-xs font-semibold leading-tight">{svc.label}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
