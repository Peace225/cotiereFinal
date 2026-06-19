import { ArrowRight } from "lucide-react";
import Link from "next/link";
import EventRequestForm from "@/components/frontend/events/EventRequestForm";
import ReviewsSection from "@/components/frontend/ReviewsSection";
import PrestationsSection from "@/components/frontend/events/PrestationsSection";
import type { Metadata } from "next";
import { buildMeta } from "@/lib/seo";

// Force le rendu dynamique pour Ã©viter les erreurs de build liÃ©es aux hooks de session
export const dynamic = 'force-dynamic';

export const metadata: Metadata = buildMeta({
  title: "CÃ”TIÃˆRE EVENT â€” Organisation d'Ã©vÃ©nements mariages, galas, confÃ©rences",
  description: "Organisation complÃ¨te de vos Ã©vÃ©nements : mariages, galas, confÃ©rences, anniversaires. DÃ©coration, traiteur, sonorisation. Devis gratuit sous 24h.",
  path: "/services/evenements",
});

export default function EvenementsPage() {
  return (
    <div className="min-h-screen">
      <section className="relative text-white py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1600&q=80" alt="Ã‰vÃ©nements" className="w-full h-full object-cover opacity-90" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-2xl sm:text-2xl sm:text-4xl md:text-5xl font-bold mt-2 mb-4">CÃ”TIÃˆRE EVENT & ORGANISATION</h1>
            <p className="text-gray-100 text-lg leading-relaxed">
              Organisation complÃ¨te de vos Ã©vÃ©nements : mariages, galas, confÃ©rences, anniversaires.
              Nous gÃ©rons tout de A Ã  Z pour que vous profitiez pleinement de votre journÃ©e.
            </p>
            <a href="#demande" className="btn-primary mt-8 inline-flex">
              Demander un devis <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* Prestations dynamiques depuis la DB */}
      <PrestationsSection />

      <section id="demande" className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="section-title">Demande de devis</h2>
            <p className="text-gray-500 mt-2">DÃ©crivez votre Ã©vÃ©nement, nous vous prÃ©parons un devis personnalisÃ© sous 24h.</p>
          </div>
          <EventRequestForm />
        </div>
      </section>

      <ReviewsSection serviceType="event" title="Avis sur nos Ã©vÃ©nements" />
    </div>
  );
}

