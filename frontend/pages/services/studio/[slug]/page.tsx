import { ArrowRight, Sparkles, Camera, Video, Radio, Play } from "lucide-react";
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
  { slug: "tournage-video", image: "https://images.unsplash.com/photo-1601506521793-dc748fc80b67?w=800&q=80", label: "Tournage vidéo pro", icon: Video },
  { slug: "photographie", image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80", label: "Photographie", icon: Camera },
  { slug: "streaming-live", image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800&q=80", label: "Streaming live", icon: Radio },
  { slug: "drone", image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80", label: "Drone aérien", icon: Play },
  { slug: "regie-mobile", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80", label: "Régie mobile TV", icon: Video },
  { slug: "montage-video", image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80", label: "Montage", icon: Play },
  { slug: "livraison", image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80", label: "Livraison 4K", icon: ArrowRight },
];

const tarifs = [
  { label: "Photo", price: "100 000", range: "— 200 000 FCFA", desc: "Shooting pro + retouches", image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80", popular: false },
  { label: "Vidéo", price: "150 000", range: "— 300 000 FCFA", desc: "Tournage + montage 4K", image: "https://images.unsplash.com/photo-1601506521793-dc748fc80b67?w=800&q=80", popular: true },
  { label: "Pack Complet", price: "400 000", range: "— 800 000 FCFA", desc: "Photo + Vidéo + Drone + Live", image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80", popular: false },
];

export default function StudioPage() {
  return (
    <div className="min-h-screen bg-[#020617]">
      {/* HERO */}
      <section className="relative h- min-h- flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="/Images/hbl-entreprise.png" alt="HBL Studio+" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-[#020617]/70 to-[#020617]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,168,76,0.2),transparent_50%)]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 px-3 py-1.5 rounded-full mb-6">
              <Sparkles size={14} className="text-[#c9a84c]" />
              <span className="text- font-semibold tracking-widest uppercase text-white/80">Studio Pro 4K</span>
            </div>

            <h1 className="text-[clamp(2.75rem,9vw,5rem)] font-black leading-[0.85] tracking-tighter text-white mb-6">
              HBL
              <span className="block bg-gradient-to-r from-[#c9a84c] via-[#e0c070] to-[#c9a84c] bg-clip-text text-transparent">Studio+</span>
            </h1>

            <p className="text-white/70 text-base sm:text-lg leading-relaxed mb-8 max-w-xl">
              Production vidéo et photo pour mariages, conférences, concerts. Streaming live, drone FPV, régie multicam.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <a href="#reservation" className="group inline-flex items-center justify-center gap-2 bg-[#c9a84c] hover:bg-[#d4b456] text-black font-semibold px-7 py-3.5 rounded-xl transition-all active:scale-[0.98]">
                Réserver maintenant
                <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
              </a>
              <a href="tel:+2250747722931" className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 backdrop-blur border border-white/15 text-white px-7 py-3.5 rounded-xl transition-all">
                Appeler
              </a>
            </div>

            <div className="flex items-center gap-6 mt-10 pt-6 border-t border-white/10">
              {[
                { label: "Projets", value: "500+" },
                { label: "4K", value: "100%" },
                { label: "Délai", value: "24h" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-xl font-bold text-white">{stat.value}</div>
                  <div className="text- text-white/50 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRESTATIONS */}
      <section className="relative py-16 sm:py-24 -mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Nos prestations</h2>
            <p className="text-white/50 text-sm">7 expertises, un seul studio</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-4">
            {services.map((s) => {
              const Icon = s.icon;
              return (
                <Link key={s.slug} href={`/services/studio/${s.slug}`} className="group">
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-white/[0.03] border border-white/10 hover:border-[#c9a84c]/50 transition-all">
                    <img src={s.image} alt={s.label} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    <div className="absolute top-3 left-3 w-8 h-8 rounded-lg bg-black/60 backdrop-blur flex items-center justify-center group-hover:bg-[#c9a84c] transition-colors">
                      <Icon size={14} className="text-white group-hover:text-black" />
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white text- font-medium leading-tight group-hover:text-[#c9a84c] transition-colors">{s.label}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* TARIFS */}
      <section className="py-16 sm:py-20 bg-[#0a0f1c] border-y border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Tarifs transparents</h2>
            <p className="text-white/50 text-sm">Devis détaillé sous 24h, sans engagement</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {tarifs.map((p) => (
              <div key={p.label} className={`relative group ${p.popular? "md:-mt-4 md:mb-4" : ""}`}>
                {p.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <span className="bg-[#c9a84c] text-black text- font-bold uppercase tracking-wider px-3 py-1 rounded-full">Populaire</span>
                  </div>
                )}

                <div className="relative h-full bg-white/[0.03] backdrop-blur border border-white/10 rounded- overflow-hidden hover:bg-white/[0.05] hover:border-white/20 transition-all">
                  <div className="relative h-48">
                    <img src={p.image} alt={p.label} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1c] via-[#0a0f1c]/60 to-transparent" />
                  </div>

                  <div className="p-6">
                    <h3 className="text-white font-bold text-lg mb-1">{p.label}</h3>
                    <p className="text-white/50 text-xs mb-4">{p.desc}</p>

                    <div className="flex items-baseline gap-1 mb-6">
                      <span className="text-2xl font-bold text-[#c9a84c]">{p.price}</span>
                      <span className="text-white/40 text-sm">{p.range}</span>
                    </div>

                    <a href="#reservation" className="block w-full text-center bg-white/5 hover:bg-[#c9a84c] hover:text-black border border-white/10 text-white/80 font-medium text-sm py-2.5 rounded-xl transition-all">
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
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Demande de réservation</h2>
            <p className="text-white/50 text-sm">Réponse garantie sous 24h</p>
          </div>

          <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded- p-6 sm:p-8">
            <StudioBookingForm />
          </div>
        </div>
      </section>

      <div className="border-t border-white/5">
        <ReviewsSection serviceType="studio" title="Avis sur HBL Studio+" />
      </div>
    </div>
  );
}