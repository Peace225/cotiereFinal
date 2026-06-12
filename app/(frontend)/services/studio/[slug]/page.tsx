"use client";

import { useParams } from "next/navigation";
import { 
  ArrowRight, Phone, ChevronLeft, Check, Clock 
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import StudioBookingForm from "@/components/frontend/studio/StudioBookingForm";

// Force le rendu dynamique pour éviter les erreurs de génération statique au build
export const dynamic = 'force-dynamic';

const SERVICES: Record<string, {
  label: string; image: string; subtitle: string; description: string;
  priceRange: string; included: string[];
  process: { step: string; desc: string }[];
}> = {
  "tournage-video": {
    label: "Tournage vidéo professionnel",
    image: "https://images.unsplash.com/photo-1601506521793-dc748fc80b67?w=800&q=80",
    subtitle: "Caméras 4K · Équipe professionnelle · Montage inclus",
    description: "Captez vos moments les plus précieux avec notre équipe de tournage professionnelle. Mariages, conférences, événements d'entreprise, clips musicaux.",
    priceRange: "150 000 — 300 000 FCFA",
    included: ["Caméras 4K", "Équipe de 2 caméramen", "Montage complet", "Livraison USB + Cloud"],
    process: [{ step: "Réservation", desc: "Briefing" }, { step: "Tournage", desc: "Jour J" }, { step: "Livraison", desc: "Sous 7 jours" }],
  },
  "photographie": {
    label: "Photographie professionnelle",
    image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80",
    subtitle: "Appareils plein format · Retouche pro",
    description: "Des photos professionnelles qui immortalisent vos événements avec créativité.",
    priceRange: "100 000 — 200 000 FCFA",
    included: ["Matériel pro", "Retouche intégrale", "Galerie privée"],
    process: [{ step: "Brief", desc: "Définition du style" }, { step: "Shooting", desc: "Séance photo" }, { step: "Retouche", desc: "Sous 5 jours" }],
  },
  // Vous pouvez ajouter les autres services ici (drone, streaming, etc.)
};

export default function StudioServicePage() {
  const params = useParams();
  const slug = params?.slug as string;
  const service = slug ? SERVICES[slug] : null;
  const [showForm, setShowForm] = useState(false);

  if (!service) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-gray-500 text-lg">Service introuvable.</p>
      <Link href="/services/studio" className="btn-primary">Retour au studio</Link>
    </div>
  );

  return (
    <div className="min-h-screen">
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
            <h1 className="text-3xl font-bold mb-3">{service.label}</h1>
            <p className="text-gray-100 text-lg mb-6">{service.description}</p>
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-2xl font-black text-[#c9a84c]">{service.priceRange}</span>
              <button onClick={() => setShowForm(true)} className="btn-primary">Réserver maintenant <ArrowRight size={18} /></button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#f0f9ff]">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Ce qui est inclus</h2>
          <ul className="grid md:grid-cols-2 gap-4">
            {service.included.map(item => (
              <li key={item} className="flex items-start gap-3 text-sm text-gray-700">
                <Check size={16} className="text-green-500 mt-1" /> {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {showForm ? (
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-center text-2xl font-bold mb-8">Réserver — {service.label}</h2>
            <StudioBookingForm />
          </div>
        </section>
      ) : (
        <section className="py-16 bg-white text-center">
          <button onClick={() => setShowForm(true)} className="btn-primary">Faire une demande <ArrowRight size={18} /></button>
        </section>
      )}
    </div>
  );
}