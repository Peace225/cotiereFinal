import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Kouamé Adjoua",
    role: "Mariée · Abidjan",
    text: "HBL Studio+ a immortalisé notre mariage avec une qualité exceptionnelle. Le drone a capturé des moments uniques.",
    rating: 5,
    avatar: "KA",
    color: "from-violet-600 to-fuchsia-500",
  },
  {
    name: "Jean-Pierre Mensah",
    role: "Directeur d'entreprise",
    text: "Séminaire organisé par CÔTIÈRE EVENT, logistique, sono, restauration : tout était parfait. Je recommande vivement.",
    rating: 5,
    avatar: "JM",
    color: "from-blue-600 to-cyan-400",
  },
  {
    name: "Sarah Koné",
    role: "Touriste · France",
    text: "L'excursion en bateau était inoubliable. Notre guide multilingue connaissait chaque recoin du littoral.",
    rating: 5,
    avatar: "SK",
    color: "from-emerald-600 to-teal-400",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="relative py-16 sm:py-24 lg:py-32 overflow-hidden bg-[#020617]">
      {/* Fond */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(201,168,76,0.12),transparent_60%)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w- h- sm:w- sm:h- bg-[#c9a84c]/[0.06] rounded-full blur- sm:blur- pointer-events-none" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 px-3.5 py-1.5 rounded-full mb-5">
            <span className="w-1.5 h-1.5 bg-[#c9a84c] rounded-full animate-pulse" />
            <span className="text- sm:text- font-semibold tracking-[0.16em] sm:tracking-[0.18em] uppercase text-white/70">Témoignages vérifiés</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.1]">
            Ils nous font <span className="bg-gradient-to-r from-[#c9a84c] to-[#e0c070] bg-clip-text text-transparent">confiance</span>
          </h2>
          <p className="mt-3 text-white/60 text-sm sm:text-base max-w-xl mx-auto px-4">Plus de 500 clients accompagnés sur tout le littoral ivoirien</p>
        </div>

        {/* Mobile: scroll horizontal, Desktop: grid */}
        <div className="md:hidden -mx-4 px-4 overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 pb-4 snap-x snap-mandatory">
            {testimonials.map((t) => (
              <div key={t.name} className="w-[85%] shrink-0 snap-center">
                <TestimonialCard t={t} />
              </div>
            ))}
          </div>
        </div>

        <div className="hidden md:grid md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} t={t} />
          ))}
        </div>

        {/* Stats */}
        <div className="mt-14 sm:mt-20 grid grid-cols-3 gap-6 sm:flex sm:flex-wrap sm:justify-center sm:gap-12 lg:gap-16 text-center">
          {[
            { v: "4.9/5", l: "Note moyenne" },
            { v: "98%", l: "Clients satisfaits" },
            { v: "500+", l: "Projets livrés" },
          ].map((s) => (
            <div key={s.l}>
              <p className="text-xl sm:text-2xl lg:text-3xl font-black text-white">{s.v}</p>
              <p className="text- sm:text- uppercase tracking-widest text-white/40 mt-1">{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ t }: { t: any }) {
  return (
    <div className="group relative h-full">
      <div className={`absolute -inset- rounded- sm:rounded- bg-gradient-to-b ${t.color} opacity-0 group-hover:opacity-60 sm:group-hover:opacity-100 transition-opacity duration-500 blur-sm`} />

      <div className="relative h-full bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded- sm:rounded- p-6 sm:p-8 transition-all duration-300 active:scale-[0.98] sm:hover:-translate-y-1">
        <Quote size={40} className="sm:hidden absolute top-4 right-4 text-white/[0.05]" strokeWidth={1.5} />
        <Quote size={52} className="hidden sm:block absolute top-5 right-5 text-white/[0.04]" strokeWidth={1} />

        <div className="flex items-center gap-1 mb-4">
          {Array.from({ length: t.rating }).map((_, i) => (
            <Star key={i} size={16} className="sm:w- sm:h- text-[#c9a84c] fill-[#c9a84c]" />
          ))}
          <span className="ml-1.5 text- text-white/40">5.0</span>
        </div>

        <p className="text- sm:text- leading-relaxed text-white/85 mb-6 min-h- sm:min-h-">
          "{t.text}"
        </p>

        <div className="flex items-center gap-3 pt-5 border-t border-white/5">
          <div className="relative shrink-0">
            <div className={`absolute -inset-1 rounded-full bg-gradient-to-br ${t.color} opacity-50 blur-md`} />
            <div className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-xs sm:text-sm font-bold ring-2 ring-white/10`}>
              {t.avatar}
            </div>
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-white text- sm:text- truncate">{t.name}</p>
            <p className="text-white/50 text- truncate">{t.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}