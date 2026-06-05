import { Target, Globe, Zap, Award } from "lucide-react";

const stats = [
  { value: "11", label: "Services", desc: "Communication, tourisme, musique et plus", Icon: Target },
  { value: "6", label: "Langues", desc: "FR · EN · ES · DE · IT · PT", Icon: Globe },
  { value: "24h", label: "Délai de réponse", desc: "Pour toute demande de devis", Icon: Zap },
  { value: "100%", label: "Professionnel", desc: "Équipe expérimentée et certifiée", Icon: Award },
];

export default function StatsSection() {
  return (
    <section className="relative py-16 sm:py-24 lg:py-32 overflow-hidden isolate">
      {/* Fond */}
      <div className="absolute inset-0 -z-10">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80"
          alt="Littoral ivoirien"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/90 via-[#0c4a6e]/85 to-[#020617]/95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.18),transparent_65%)]" />
      </div>

      {/* Halo - taille adaptée mobile */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w- h- sm:w- sm:h- bg-[#c9a84c]/10 rounded-full blur- sm:blur- -z-10 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        {/* En-tête */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] animate-pulse" />
            <span className="text- sm:text- tracking-[0.18em] sm:tracking-[0.2em] uppercase font-medium text-white/70">Nos chiffres clés</span>
          </div>
        </div>

        {/* Grid : 2 colonnes mobile, 4 desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
          {stats.map((s) => {
            const Icon = s.Icon;
            return (
              <div key={s.label} className="group relative">
                {/* Lueur */}
                <div className="absolute -inset-0.5 rounded- sm:rounded- bg-gradient-to-b from-[#c9a84c]/20 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 hidden sm:block" />

                <div className="relative h-full bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded- sm:rounded- p-5 sm:p-7 text-center transition-all duration-300 active:scale-[0.98] sm:hover:-translate-y-1.5">
                  {/* Trait or */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 sm:w-12 h- bg-gradient-to-r from-transparent via-[#c9a84c]/80 to-transparent" />

                  <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 relative">
                    <div className="absolute inset-0 bg-[#c9a84c]/20 rounded-xl sm:rounded-2xl blur-lg" />
                    <div className="relative w-full h-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl flex items-center justify-center backdrop-blur">
                      <Icon size={18} className="sm:hidden text-[#c9a84c]" strokeWidth={2} />
                      <Icon size={22} className="hidden sm:block text-[#c9a84c]" strokeWidth={1.75} />
                    </div>
                  </div>

                  <p className="text-3xl sm:text-4xl lg:text- font-black leading-none tracking-tight mb-1.5">
                    <span className="bg-gradient-to-b from-white to-white/80 bg-clip-text text-transparent">
                      {s.value}
                    </span>
                  </p>

                  <p className="text-white font-semibold text- sm:text- mb-1">{s.label}</p>
                  <p className="text-white/55 text- sm:text-xs leading-snug px-1">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Signature */}
        <div className="mt-12 sm:mt-16 text-center">
          <p className="inline-flex items-center gap-2 text-white/40 text- sm:text-xs">
            <span className="w-6 sm:w-8 h-px bg-gradient-to-r from-transparent to-white/20" />
            <span className="whitespace-nowrap">CÔTIÈRE Media Group</span>
            <span className="hidden sm:inline">· Littoral Ivoirien</span>
            <span className="w-6 sm:w-8 h-px bg-gradient-to-l from-transparent to-white/20" />
          </p>
        </div>
      </div>
    </section>
  );
}