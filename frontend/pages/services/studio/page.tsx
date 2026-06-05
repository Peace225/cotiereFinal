import { ArrowRight, Sparkles, Play, Camera, Video } from "lucide-react";
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
  { slug: "tournage-video", image: "https://images.unsplash.com/photo-1601506521793-dc748fc80b67?w=600&q=80", label: "Tournage vidéo", desc: "4K, multi-cam" },
  { slug: "photographie", image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600&q=80", label: "Photographie", desc: "Studio & reportage" },
  { slug: "streaming-live", image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=600&q=80", label: "Streaming Live", desc: "YouTube, Facebook" },
  { slug: "drone", image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&q=80", label: "Drone FPV", desc: "Vues aériennes" },
  { slug: "regie-mobile", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", label: "Régie mobile", desc: "Direct TV" },
  { slug: "montage-video", image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&q=80", label: "Montage", desc: "Post-production" },
  { slug: "motion-design", image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80", label: "Motion Design", desc: "Animations" },
  { slug: "livraison", image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80", label: "Livraison", desc: "USB & Cloud" },
];

const pricing = [
  {
    label: "Essentiel",
    price: "100 000",
    range: "à partir de",
    features: ["Photographie 2h", "50 photos retouchées", "Livraison 72h"],
    image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80",
    popular: false
  },
  {
    label: "Pro",
    price: "250 000",
    range: "à partir de",
    features: ["Vidéo 4K 4h", "Montage inclus", "Drone", "Livraison 48h"],
    image: "https://images.unsplash.com/photo-1601506521793-dc748fc80b67?w=800&q=80",
    popular: true
  },
  {
    label: "Premium",
    price: "500 000",
    range: "à partir de",
    features: ["Photo + Vidéo", "Streaming live", "Équipe complète", "Livraison 24h"],
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80",
    popular: false
  },
];

export default function StudioPage() {
  return (
    <div className="min-h-screen bg-[#020617]">
      {/* HERO */}
      <section className="relative min-h- flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0c4a6e] via-[#0b3f5c] to-[#020617]" />
          <div className="absolute inset-0 opacity-20" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur border border-white/10 px-3 py-1.5 rounded-full mb-6">
                <Sparkles size={14} className="text-[#c9a84c]" />
                <span className="text- font-semibold tracking-widest uppercase text-white/80">Production Pro</span>
              </div>

              <h1 className="text-[clamp(2.5rem,7vw,4rem)] font-black leading-[0.9] tracking-tighter text-white mb-4">
                HBL
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#c9a84c] to-[#e0c070]">Studio+</span>
              </h1>

              <p className="text-white/70 text-base sm:text-lg leading-relaxed mb-8 max-w-xl">
                Tournage 4K, photo studio, drone FPV, streaming live. Pour mariages, entreprises et événements. Devis en 24h.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <a href="#reservation" className="group inline-flex items-center justify-center gap-2 bg-[#c9a84c] hover:bg-[#d4b456] text-black font-semibold px-6 py-3.5 rounded-xl transition-all active:scale-[0.98]">
                  Réserver maintenant
                  <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                </a>
                <Link href="#prestations" className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 backdrop-blur border border-white/15 text-white px-6 py-3.5 rounded-xl transition-all">
                  <Play size={16} /> Voir nos réalisations
                </Link>
              </div>

              <div className="flex items-center gap-6 mt-10 pt-8 border-t border-white/5">
                <div>
                  <p className="text-2xl font-bold text-white">500+</p>
                  <p className="text- text-white/50 uppercase tracking-wide">Projets</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">24h</p>
                  <p className="text- text-white/50 uppercase tracking-wide">Devis</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">4K</p>
                  <p className="text- text-white/50 uppercase tracking-wide">Qualité</p>
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="relative">
                <img src="/Images/hbl-entreprise.png" alt="HBL Studio" className="w-full max-w-md mx-auto drop-shadow-2xl" />
                <div className="absolute -inset-10 bg-[#c9a84c]/20 blur- -z-10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="prestations" className="py-16 sm:py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Nos prestations</h2>
            <p className="text-white/50 text-sm">8 expertises, un seul studio</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {services.map((s) => (
              <Link key={s.slug} href={`/services/studio/${s.slug}`} className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-[#c9a84c]/50 transition-all">
                <img src={s.image} alt={s.label} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-[#c9a84c]/0 group-hover:bg-[#c9a84c]/20 transition-colors" />

                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-semibold text-sm mb-0.5 group-hover:text-[#c9a84c] transition-colors">{s.label}</h3>
                  <p className="text-white/60 text-">{s.desc}</p>
                </div>

                <div className="absolute top-3 right-3 w-7 h-7 bg-black/50 backdrop-blur rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                  <ArrowRight size={14} className="text-white" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TARIFS */}
      <section className="py-16 sm:py-20 bg-[#0a0f1c] border-y border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Tarifs transparents</h2>
            <p className="text-white/50 text-sm">À partir de • Devis détaillé sous 24h</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {pricing.map((p) => (
              <div key={p.label} className={`relative group ${p.popular? "md:-mt-4 md:mb-4" : ""}`}>
                {p.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <span className="bg-[#c9a84c] text-black text- font-bold uppercase tracking-wider px-3 py-1 rounded-full">Populaire</span>
                  </div>
                )}

                <div className={`relative h-full bg-white/[0.03] backdrop-blur border rounded- overflow-hidden transition-all ${p.popular? "border-[#c9a84c]/50 shadow-[0_0_40px_-10px_rgba(201,168,76,0.3)]" : "border-white/10 hover:border-white/20"}`}>
                  <div className="relative h-32">
                    <img src={p.image} alt={p.label} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1c] to-transparent" />
                  </div>

                  <div className="p-6">
                    <h3 className="text-white font-bold text-lg mb-1">{p.label}</h3>
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text- text-white/50">{p.range}</span>
                      <span className="text-2xl font-bold text-[#c9a84c]">{p.price}</span>
                      <span className="text- text-white/50">FCFA</span>
                    </div>

                    <ul className="space-y-2 mb-6">
                      {p.features.map(f => (
                        <li key={f} className="flex items-center gap-2 text-white/70 text-">
                          <div className="w-1 h-1 bg-[#c9a84c] rounded-full" />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <a href="#reservation" className={`block text-center font-medium text-sm py-2.5 rounded-xl transition-all ${p.popular? "bg-[#c9a84c] text-black hover:bg-[#d4b456]" : "bg-white/5 text-white hover:bg-white/10 border border-white/10"}`}>
                      Choisir
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORMULAIRE */}
      <section id="reservation" className="py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 mb-3">
              <Camera size={16} className="text-[#c9a84c]" />
              <span className="text-[#c9a84c] text- font-semibold uppercase tracking-widest">Réservation</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Parlons de votre projet</h2>
            <p className="text-white/50 text-sm">Réponse garantie sous 24h avec devis détaillé</p>
          </div>

          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded- p-6 sm:p-8">
            <StudioBookingForm />
          </div>
        </div>
      </section>

      <div className="border-t border-white/5">
        <ReviewsSection serviceType="studio" title="Ils nous font confiance" />
      </div>
    </div>
  );
}