import Link from "next/link";
import { ArrowRight, Phone, MessageCircle, Sparkles } from "lucide-react";

export default function CtaSection() {
  return (
    <section className="relative py-20 sm:py-28 lg:py-36 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80"
          alt="Littoral ivoirien"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/70 to-black/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,168,76,0.15),transparent_60%)]" />
      </div>

      {/* Halo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w- h- sm:w- sm:h- bg-[#c9a84c]/15 rounded-full blur- sm:blur- pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
        {/* Carte */}
        <div className="relative bg-white/[0.04] backdrop-blur-xl sm:backdrop-blur-2xl border border-white/10 rounded- sm:rounded- p-6 sm:p-10 lg:p-14 text-center shadow-2xl">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/50 to-transparent" />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#c9a84c]/10 border border-[#c9a84c]/20 text-[#e0c070] px-3 py-1.5 sm:px-4 sm:py-2 rounded-full mb-6 sm:mb-8">
            <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c9a84c] opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-[#c9a84c]" />
            </span>
            <span className="text- sm:text- font-semibold tracking-[0.15em] sm:tracking-[0.18em] uppercase">Prêt à commencer?</span>
            <Sparkles size={12} className="hidden sm:block text-[#c9a84c]/80" />
          </div>

          <h2 className="text- sm:text- lg:text- font-black leading-[1.1] tracking-tight text-white mb-4 sm:mb-6">
            Réservez votre service
            <br />
            <span className="bg-gradient-to-r from-[#c9a84c] via-[#e0c070] to-[#c9a84c] bg-clip-text text-transparent">dès maintenant</span>
          </h2>

          <p className="text-white/70 text- sm:text-base lg:text-lg leading-relaxed mb-8 sm:mb-10 max-w-xl mx-auto px-2">
            Notre équipe vous répond sous 24h. Devis gratuit, accompagnement premium, sans engagement.
          </p>

          {/* Boutons */}
          <div className="flex flex-col gap-3 sm:gap-3 max-w-md mx-auto">
            <Link
              href="/reservation"
              className="group w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#c9a84c] to-[#b8973b] text-black font-bold text- sm:text- px-6 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl active:scale-[0.98] transition-all"
            >
              Faire une réservation
              <ArrowRight size={18} className="transition-transform group-active:translate-x-0.5" />
            </Link>

            <div className="grid grid-cols-2 gap-3">
              <a
                href="https://wa.me/2250747722931"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366]/15 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-white font-medium text- sm:text- py-3.5 rounded-xl backdrop-blur active:scale-[0.98] transition-all"
              >
                <MessageCircle size={16} />
                <span className="hidden xs:inline">WhatsApp</span>
                <span className="xs:hidden">WA</span>
              </a>

              <a
                href="tel:+2250747722931"
                className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/15 text-white/90 font-medium text- sm:text- py-3.5 rounded-xl backdrop-blur active:scale-[0.98] transition-all"
              >
                <Phone size={16} />
                <span className="truncate">07 47 72 29</span>
              </a>
            </div>
          </div>

          {/* Trust */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-white/5">
            <div className="flex -space-x-2">
              {[1,2,3].map(i => (
                <div key={i} className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-[#020617] bg-gradient-to-br from-[#c9a84c]/40 to-[#c9a84c]/20" />
              ))}
            </div>
            <p className="text- sm:text- text-white/50 text-center">
              <span className="text-[#c9a84c] font-semibold">500+</span> clients satisfaits
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}