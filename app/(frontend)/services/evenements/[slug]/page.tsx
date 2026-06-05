"use client";
import { useParams } from "next/navigation";
import { ArrowRight, Phone, ChevronLeft, Check, Clock } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import EventRequestForm from "@/components/frontend/events/EventRequestForm";

const SERVICES: Record<string, {
  label: string; image: string; subtitle: string; description: string;
  priceRange: string; included: string[];
}> = {
  "decoration": { label: "Décoration & scénographie", image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80", subtitle: "Fleurs · Lumières · Scénographie sur mesure", description: "Transformez votre lieu en un espace magique. Notre équipe de décorateurs crée des ambiances uniques pour tous vos événements.", priceRange: "150 000 — 500 000 FCFA", included: ["Consultation design gratuite", "Décoration florale", "Éclairage d'ambiance", "Mobilier et accessoires", "Montage et démontage inclus", "Scénographie personnalisée"] },
  "traiteur": { label: "Traiteur & restauration", image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80", subtitle: "Cuisine ivoirienne & internationale · Service à table", description: "Une gastronomie d'exception pour vos événements. Nos chefs préparent des menus sur mesure alliant saveurs locales et cuisine internationale.", priceRange: "5 000 — 25 000 FCFA / personne", included: ["Menu personnalisé", "Cuisine ivoirienne & internationale", "Service à table professionnel", "Vaisselle et nappage inclus", "Cocktail et boissons", "Chef cuisinier expérimenté"] },
  "sonorisation": { label: "Sonorisation & éclairage", image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80", subtitle: "Sono professionnelle · Jeux de lumières · DJ", description: "Une ambiance sonore et lumineuse parfaite pour votre événement. Matériel professionnel et techniciens expérimentés.", priceRange: "100 000 — 400 000 FCFA", included: ["Système sono professionnel", "Jeux de lumières LED", "Micro HF et filaires", "DJ ou animateur (option)", "Technicien son dédié", "Installation et démontage"] },
  "securite": { label: "Sécurité événementielle", image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80", subtitle: "Agents formés · Contrôle d'accès · Sécurité VIP", description: "Assurez la sécurité de vos invités avec notre équipe d'agents professionnels formés à la sécurité événementielle.", priceRange: "50 000 — 200 000 FCFA", included: ["Agents de sécurité certifiés", "Contrôle d'accès", "Gestion des flux", "Sécurité VIP", "Coordination avec les autorités", "Rapport de sécurité"] },
  "hotesses": { label: "Hôtesses & accueil", image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80", subtitle: "Accueil professionnel · Tenue élégante · Multilingue", description: "Des hôtesses professionnelles pour accueillir vos invités avec élégance et assurer le bon déroulement de votre événement.", priceRange: "30 000 — 80 000 FCFA / hôtesse", included: ["Hôtesses formées", "Tenue élégante fournie", "Accueil et orientation", "Gestion des badges", "Service multilingue", "Coordination logistique"] },
  "animation": { label: "Animation & spectacles", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80", subtitle: "Artistes · Animations · Spectacles sur mesure", description: "Rendez votre événement inoubliable avec nos animations et spectacles. Artistes locaux et internationaux disponibles.", priceRange: "100 000 — 500 000 FCFA", included: ["Artistes et performers", "Animation musicale live", "Spectacles de danse", "Magie et prestidigitation", "Animation enfants (option)", "Coordination artistique"] },
};

export default function EvenementServicePage() {
  const { slug } = useParams<{ slug: string }>();
  const service = SERVICES[slug as string];
  const [showForm, setShowForm] = useState(false);

  if (!service) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-gray-500 text-lg">Service introuvable.</p>
      <Link href="/services/evenements" className="btn-primary">Retour aux événements</Link>
    </div>
  );

  return (
    <div className="min-h-screen">
      <section className="relative text-white py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src={service.image} alt={service.label} className="w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/20" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/services/evenements" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6 transition-colors">
            <ChevronLeft size={16} /> Retour aux événements
          </Link>
          <div className="max-w-2xl">
            <span className="bg-[#c9a84c] text-white text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block">CÔTIÈRE EVENT</span>
            <h1 className="text-3xl sm:text-4xl font-bold mt-3 mb-2">{service.label}</h1>
            <p className="text-white/70 text-sm mb-4">{service.subtitle}</p>
            <p className="text-gray-100 text-lg leading-relaxed mb-6">{service.description}</p>
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-2xl font-black text-[#c9a84c]">{service.priceRange}</span>
              <button onClick={() => setShowForm(true)} className="btn-primary">Demander un devis <ArrowRight size={18} /></button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#f0f9ff]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title mb-8 text-center">Ce qui est inclus</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {service.included.map(item => (
              <div key={item} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-start gap-3">
                <Check size={16} className="text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {showForm ? (
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="section-title">Demande de devis — {service.label}</h2>
              <p className="text-gray-500 mt-2 flex items-center justify-center gap-1"><Clock size={14} /> Réponse sous 24h</p>
            </div>
            <EventRequestForm />
          </div>
        </section>
      ) : (
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="section-title mb-4">Obtenir un devis gratuit</h2>
            <p className="text-gray-500 mb-8">Décrivez votre événement, nous vous préparons un devis personnalisé sous 24h.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <button onClick={() => setShowForm(true)} className="btn-primary">Demander un devis <ArrowRight size={18} /></button>
              <a href="tel:+2250747722931" className="flex items-center gap-2 bg-[#0c4a6e] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#0a3d5c] transition-colors">
                <Phone size={18} /> 07 47 72 29 31
              </a>
            </div>
          </div>
        </section>
      )}

      <section className="py-12 bg-[#f8fafc]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="font-bold text-[#0c4a6e] mb-6 text-center">Nos autres prestations</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(SERVICES).filter(([s]) => s !== slug).map(([s, svc]) => (
              <Link key={s} href={`/services/evenements/${s}`}
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
