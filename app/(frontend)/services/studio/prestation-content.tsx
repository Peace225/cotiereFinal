"use client";

import { useParams } from "next/navigation";
import { 
  ArrowRight, ArrowLeft, ChevronRight, Users, Wifi, Share2, Check,
  Wind, Tv, Waves, UtensilsCrossed, Sofa, Car, Dumbbell, Coffee,
  Bath, Star, MapPin, Clock, ShieldCheck, Phone, CalendarDays,
  Sparkles, Info, CheckCircle2, RefreshCw, Video, Camera, Radio, Plane, Film, Package
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import ReservationModal from "@/components/frontend/ReservationModal";
import ImageZoom from "@/components/frontend/ImageZoom";

// Force le rendu dynamique pour éviter les erreurs de build sur Vercel
export const dynamic = 'force-dynamic';

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
    longDesc: "Notre équipe intervient sur tous types d'événements avec du matériel haut de gamme : caméras 4K, stabilisateurs et éclairage LED professionnel.",
    priceRange: "150 000 — 300 000 FCFA",
    duration: "Demi-journée à journée complète",
    included: ["Caméras 4K professionnelles", "Stabilisateur motorisé", "Montage inclus"],
    process: [{ step: "Brief", desc: "Préparation" }, { step: "Tournage", desc: "Jour J" }],
    gallery: ["https://images.unsplash.com/photo-1601506521793-dc748fc80b67?w=600&q=80"],
    useCases: ["Mariages", "Conférences", "Événements d'entreprise"],
  },
  "photographie": {
    title: "Photographie Professionnelle",
    subtitle: "Appareils plein format · Retouche incluse",
    icon: <Camera size={20} />,
    heroImage: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1600&q=80",
    description: "Des photos qui racontent votre histoire",
    longDesc: "Nos photographes capturent les moments forts de vos événements avec des appareils plein format et une retouche minutieuse.",
    priceRange: "100 000 — 200 000 FCFA",
    duration: "2h à journée complète",
    included: ["Matériel plein format", "Retouche intégrale", "Galerie en ligne"],
    process: [{ step: "Consultation", desc: "Style et planning" }, { step: "Shooting", desc: "Événement" }],
    gallery: ["https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600&q=80"],
    useCases: ["Portraits", "Mariages", "Reportages"],
  },
};

export default function StudioPrestationPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const data = slug ? PRESTATIONS[slug] : null;
  const [modalOpen, setModalOpen] = useState(false);

  if (!data) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-gray-500">Prestation introuvable.</p>
      <Link href="/services/studio" className="btn-primary">Retour au Studio</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <div className="bg-white border-b px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-2 text-sm">
          <Link href="/services/studio" className="text-gray-500 hover:text-[#0c4a6e]">Studio</Link>
          <ChevronRight size={14} />
          <span className="font-semibold text-[#0c4a6e]">{data.title}</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-black text-[#0c4a6e] mb-6">{data.title}</h1>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <img src={data.heroImage} alt={data.title} className="w-full h-80 object-cover rounded-2xl" />
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h2 className="font-bold text-lg mb-4">Description</h2>
              <p className="text-gray-600">{data.longDesc}</p>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="bg-white p-6 rounded-2xl shadow-md border h-fit sticky top-24">
            <p className="text-3xl font-black text-[#c9a84c] mb-6">{data.priceRange}</p>
            <button onClick={() => setModalOpen(true)} className="w-full bg-[#0c4a6e] text-white py-3 rounded-xl font-bold mb-3">Réserver</button>
            <a href="tel:+2250747722931" className="block text-center text-sm font-semibold text-[#0c4a6e]">Appeler</a>
          </div>
        </div>
      </div>

      <ReservationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={data.title}
        details={`${data.priceRange}`}
      />
    </div>
  );
}