import { ArrowRight } from "lucide-react";
import Link from "next/link";
import StudioBookingForm from "@/components/frontend/studio/StudioBookingForm";
import ReviewsSection from "@/components/frontend/ReviewsSection";
import type { Metadata } from "next";
import { buildMeta } from "@/lib/seo";

export const metadata: Metadata = buildMeta({
  title: "HBL Studio+ — Production vidéo, photo, drone et streaming",
  description: "Studio de production professionnel : tournage vidéo, photographie, streaming en direct, drone, régie mobile. Devis sous 24h.",
  path: "/services/studio",
});

const services = [
  { slug: "tournage-video",    image: "https://images.unsplash.com/photo-1601506521793-dc748fc80b67?w=400&q=80", label: "Tournage vidéo professionnel" },
  { slug: "photographie",      image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400&q=80", label: "Photographie professionnelle" },
  { slug: "streaming-live",    image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=400&q=80", label: "Streaming en direct (live)" },
  { slug: "drone",             image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&q=80", label: "Prises de vue aériennes par drone" },
  { slug: "regie-mobile",      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", label: "Régie mobile pour rendu TV" },
  { slug: "montage-video",     image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&q=80", label: "Montage vidéo post-production" },
  { slug: "livraison",         image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&q=80", label: "Livraison sur clé USB / lien de téléchargement" },
];

export default function StudioPage() {
  return (
    <div className="min-h-screen">
      <section className="relative text-white py-16 overflow-hidden min-h-[280px]">
        <div className="absolute inset-0 bg-[#0c4a6e]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-6">
            <div className="flex-1 min-w-0">
              <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest">Production professionnelle</span>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mt-2 mb-4">HBL Studio+</h1>
              <p className="text-gray-100 text-lg leading-relaxed max-w-lg">
                Production vidéo et photo professionnelle pour tous vos événements : mariages,
                conférences, baptêmes, concerts, anniversaires. Streaming en direct, drone, régie mobile.
              </p>
              <div className="flex gap-4 mt-8">
                <a href="#reservation" className="btn-primary">
                  Réserver maintenant <ArrowRight size={18} />
                </a>
              </div>
            </div>
            <div className="shrink-0 w-56 md:w-72 lg:w-96 hidden sm:block">
              <img src="/Images/hbl-entreprise.png" alt="HBL Studio+" className="w-full h-auto object-contain drop-shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Services inclus */}
      <section className="py-16 bg-[#f0f9ff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-center mb-10">Nos prestations</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {services.map((s) => (
              <Link key={s.label} href={`/services/studio/${s.slug}`}
                className="group bg-white rounded-xl overflow-hidden shadow-sm card-hover border border-gray-100 cursor-pointer">
                <div className="relative h-32 overflow-hidden">
                  <img src={s.image} alt={s.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute inset-0 bg-[#c9a84c]/0 group-hover:bg-[#c9a84c]/15 transition-all duration-300" />
                  <div className="absolute top-2 right-2 w-6 h-6 bg-white/0 group-hover:bg-white/90 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100">
                    <ArrowRight size={11} className="text-[#0c4a6e]" />
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs font-semibold text-[#0c4a6e] leading-tight text-center group-hover:text-[#c9a84c] transition-colors">{s.label}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Tarifs indicatifs */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="section-title mb-4">Tarifs indicatifs</h2>
          <p className="text-gray-500 mb-10">Les tarifs varient selon les services sélectionnés et la durée. Un devis personnalisé vous sera envoyé sous 24h.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Forfait Photo", range: "100 000 — 200 000 FCFA", desc: "Photographie professionnelle", image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600&q=80" },
              { label: "Forfait Vidéo", range: "150 000 — 300 000 FCFA", desc: "Tournage + montage", image: "https://images.unsplash.com/photo-1601506521793-dc748fc80b67?w=600&q=80" },
              { label: "Forfait Complet", range: "400 000 — 800 000 FCFA", desc: "Photo + Vidéo + Drone + Streaming", image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&q=80" },
            ].map((p) => (
              <div key={p.label} className="group relative rounded-2xl overflow-hidden shadow-md card-hover">
                <div className="relative h-44">
                  <img src={p.image} alt={p.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                    <h3 className="font-bold text-white text-base">{p.label}</h3>
                    <p className="text-[#c9a84c] font-bold text-sm">{p.range}</p>
                  </div>
                </div>
                <div className="bg-white p-4 border border-gray-100">
                  <p className="text-gray-500 text-sm">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-6">* Tarifs indicatifs — devis définitif après étude de votre demande</p>
        </div>
      </section>

      {/* Formulaire de réservation */}
      <section id="reservation" className="py-16 bg-[#f0f9ff]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="section-title">Faire une demande de réservation</h2>
            <p className="text-gray-500 mt-2">Remplissez le formulaire, nous vous répondons sous 24-48h avec un devis détaillé.</p>
          </div>
          <StudioBookingForm />
        </div>
      </section>

      <ReviewsSection serviceType="studio" title="Avis sur HBL Studio+" />
    </div>
  );
}
