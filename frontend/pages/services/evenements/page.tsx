import { ArrowRight } from "lucide-react";
import Link from "next/link";
import EventRequestForm from "@/components/frontend/events/EventRequestForm";
import ReviewsSection from "@/components/frontend/ReviewsSection";
import type { Metadata } from "next";
import { buildMeta } from "@/lib/seo";

export const metadata: Metadata = buildMeta({
  title: "CÔTIÈRE EVENT — Organisation d'événements mariages, galas, conférences",
  description: "Organisation complète de vos événements : mariages, galas, conférences, anniversaires. Décoration, traiteur, sonorisation. Devis gratuit sous 24h.",
  path: "/services/evenements",
});

const services = [
  { slug: "decoration",  image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=80", label: "Décoration & scénographie" },
  { slug: "traiteur",    image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=400&q=80", label: "Traiteur & restauration" },
  { slug: "sonorisation",image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&q=80", label: "Sonorisation & éclairage" },
  { slug: "securite",    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&q=80", label: "Sécurité événementielle" },
  { slug: "hotesses",    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&q=80", label: "Hôtesses & accueil" },
  { slug: "animation",   image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80", label: "Animation & spectacles" },
];

export default function EvenementsPage() {
  return (
    <div className="min-h-screen">
      <section className="relative text-white py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1600&q=80" alt="Événements" className="w-full h-full object-cover opacity-90" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-2xl sm:text-2xl sm:text-4xl md:text-5xl font-bold mt-2 mb-4">CÔTIÈRE EVENT & ORGANISATION</h1>
            <p className="text-gray-100 text-lg leading-relaxed">
              Organisation complète de vos événements : mariages, galas, conférences, anniversaires.
              Nous gérons tout de A à Z pour que vous profitiez pleinement de votre journée.
            </p>
            <a href="#demande" className="btn-primary mt-8 inline-flex">
              Demander un devis <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#f0f9ff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-center mb-10">Nos prestations événementielles</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {services.map((s) => (
              <Link key={s.label} href={`/services/evenements/${s.slug}`}
                className="group relative rounded-xl overflow-hidden shadow-sm card-hover cursor-pointer">
                <div className="relative h-36">
                  <img src={s.image} alt={s.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute inset-0 bg-[#c9a84c]/0 group-hover:bg-[#c9a84c]/15 transition-all duration-300" />
                  <p className="absolute bottom-3 left-3 right-3 text-white text-xs font-semibold leading-tight group-hover:text-[#c9a84c] transition-colors">{s.label}</p>
                  <div className="absolute top-2 right-2 w-6 h-6 bg-white/0 group-hover:bg-white/90 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100">
                    <ArrowRight size={11} className="text-[#0c4a6e]" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="demande" className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="section-title">Demande de devis</h2>
            <p className="text-gray-500 mt-2">Décrivez votre événement, nous vous préparons un devis personnalisé sous 24h.</p>
          </div>
          <EventRequestForm />
        </div>
      </section>

      <ReviewsSection serviceType="event" title="Avis sur nos événements" />
    </div>
  );
}
