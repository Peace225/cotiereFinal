import Link from "next/link";
import { ArrowRight } from "lucide-react";

const services = [
  { title: "CÔTIÈRE HBL Studio+", desc: "Production vidéo & photo, streaming, drone, régie mobile.", href: "/services/studio", image: "/Images/hbl.png", accent: "#3b82f6" },
  { title: "CÔTIÈRE Tourisme & Voyage", desc: "Excursions guidées multilingues, balades en bateau.", href: "/services/tourisme", image: "/Images/cotiere-tourisme-voyage.png", accent: "#10b981" },
  { title: "CÔTIÈRE Hébergement", desc: "Chambres, résidences meublées, restaurant africain & européen.", href: "/services/hebergement", image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80", accent: "#f59e0b" },
  { title: "CÔTIÈRE Music & Management", desc: "Studio d'enregistrement, mixage, mastering, management.", href: "/services/music", image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&q=80", accent: "#ec4899" },
  { title: "Guichet Unique de l'Industrie Événementielle & Audiovisuelle", desc: "Tentes, tables, sono, groupe électrogène, équipements nautiques.", href: "/services/location", image: "/Images/guichet-unique.png", accent: "#14b8a6" },
  { title: "CÔTIÈRE MÉDIAS", desc: "TV, FM, Magazine & INFO+ — le groupe multimédia du littoral.", href: "/services/medias", image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&q=80", accent: "#ef4444" },
  { title: "CÔTIÈRE Market & Distribution", desc: "Attiéké, poissons, fruits de mer — produits locaux frais.", href: "/services/market", image: "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=600&q=80", accent: "#84cc16" },
  { title: "Tout Le Monde A Droit À La Pub", desc: "Documents administratifs en langue locale Dida-Avikam.", href: "/services/afrouba", image: "/Images/pub.jpeg", accent: "#6366f1" },
  { title: "CÔTIÈRE Collectivités", desc: "Coaching, accompagnement institutionnel, développement local.", href: "/services/collectivites", image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80", accent: "#64748b" },
  { title: "CÔTIÈRE Opportunités", desc: "Offres d'emploi, appels d'offres et opportunités d'affaires du littoral.", href: "/services/opportunites", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80", accent: "#f97316" },
  { title: "Le RDV Des Événements À Venir", desc: "Festivals, galas, conférences, fêtes culturelles et tournois sportifs du littoral ivoirien.", href: "/services/rdv", image: "/Images/rdv.jpeg", accent: "#8b5cf6" },
];

export default function ServicesGrid() {
  return (
    <section id="services" className="relative py-16 sm:py-24 lg:py-32 bg-[#fafafa] overflow-hidden">
      {/* fond */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(201,168,76,0.08),transparent_60%)]" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/30 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header mobile-first */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#c9a84c]/20 shadow-sm mb-5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c9a84c] opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c9a84c]" />
            </span>
            <span className="text- font-semibold tracking-[0.18em] uppercase text-[#9a7d2e]">Nos expertises</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-[1.1] mb-4">
            Tout le littoral,
            <span className="block mt-1 bg-gradient-to-r from-[#0c4a6e] via-slate-800 to-[#0c4a6e] bg-clip-text text-transparent">dans un seul groupe</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg px-4">
            12 pôles métiers pensés pour le tourisme, la culture et l'économie locale ivoirienne.
          </p>
        </div>

        {/* Grid responsive */}
        <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {services.map((s) => (
            <Link key={s.title} href={s.href} className="group block touch-manipulation">
              <article className="relative h-full bg-white rounded-3xl border border-slate-200/70 overflow-hidden transition-all duration-300 active:scale-[0.98] sm:hover:-translate-y-1.5 sm:hover:shadow-xl">
                {/* halo */}
                <div className="absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl blur-2xl pointer-events-none" style={{ background: `radial-gradient(400px circle at 50% 0%, ${s.accent}20, transparent 60%)` }} />

                {/* Image */}
                <div className="relative h-40 sm:h-44 overflow-hidden">
                  <img src={s.image} alt={s.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent" />
                  <div className="absolute top-3 left-3 w-8 h-8 rounded-xl bg-white/90 backdrop-blur flex items-center justify-center shadow-md">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.accent }} />
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5">
                  <h3 className="font-bold text-slate-900 text- leading-snug mb-2 line-clamp-2 min-h- group-active:text-[#0c4a6e]">
                    {s.title}
                  </h3>
                  <p className="text-slate-500 text- leading-relaxed line-clamp-2 min-h-">
                    {s.desc}
                  </p>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                    <span className="text- font-semibold" style={{ color: s.accent }}>Découvrir</span>
                    <div className="w-7 h-7 rounded-full bg-slate-100 group-active:bg-[#c9a84c] flex items-center justify-center transition-colors">
                      <ArrowRight size={14} className="text-slate-500 group-active:text-white" />
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h- scale-x-0 group-hover:scale-x-100 transition-transform origin-left" style={{ backgroundColor: s.accent }} />
              </article>
            </Link>
          ))}
        </div>

        {/* CTA mobile full-width */}
        <div className="mt-14 sm:mt-20 text-center px-4">
          <div className="inline-flex w-full sm:w-auto flex-col sm:flex-row items-center gap-3 sm:gap-4 p-1.5 sm:p-2 bg-white rounded-2xl sm:rounded-full shadow-lg border border-slate-200">
            <span className="hidden sm:block pl-5 pr-2 text-sm text-slate-600">Prêt à lancer votre projet?</span>
            <Link href="/reservation" className="w-full sm:w-auto bg-[#0c4a6e] active:bg-[#083854] text-white font-semibold px-6 py-3.5 rounded-xl sm:rounded-full text- flex items-center justify-center gap-2 min-h- touch-manipulation">
              Réserver maintenant
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}