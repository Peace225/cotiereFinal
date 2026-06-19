import Link from "next/link";
import { ArrowRight, Phone, MessageCircle } from "lucide-react";

const services = [
  {
    title: "HBL Studio+",
    desc: "Production vidÃ©o, photo, drone, streaming",
    href: "/services/studio#reservation",
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&q=80",
    available: true,
  },
  {
    title: "Tourisme & Voyage",
    desc: "Balades en bateau, excursions guidÃ©es",
    href: "/services/tourisme",
    image: "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=600&q=80",
    available: true,
  },
  {
    title: "Ã‰vÃ©nements",
    desc: "Mariages, galas, confÃ©rences, anniversaires",
    href: "/services/evenements#demande",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=80",
    available: true,
  },
  {
    title: "HÃ©bergement",
    desc: "Chambres, rÃ©sidences meublÃ©es",
    href: "/services/hebergement#chambres",
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80",
    available: true,
  },
  {
    title: "Music & Management",
    desc: "Studio d'enregistrement, mixage, mastering",
    href: "/services/music#packs",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&q=80",
    available: true,
  },
  {
    title: "MÃ©dias & PublicitÃ©",
    desc: "TV, Radio, Magazine â€” espaces publicitaires",
    href: "/services/medias",
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&q=80",
    available: true,
  },
];

export default function ReservationPage() {
  return (
    <div className="min-h-screen bg-[#f0f9ff]">
      <section className="relative text-white py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/Images/1.jpg" alt="RÃ©servation" className="w-full h-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Faire une rÃ©servation</h1>
          <p className="text-gray-200 text-lg max-w-2xl mx-auto">
            Choisissez le service qui vous intÃ©resse et remplissez le formulaire de demande.
            Notre Ã©quipe vous rÃ©pond sous 24h.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest">Ã‰tape 1</span>
            <h2 className="section-title mt-2">Quel service souhaitez-vous rÃ©server ?</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <Link key={s.title} href={s.href}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                <div className="relative h-44 overflow-hidden">
                  <img src={s.image} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <h3 className="absolute bottom-3 left-4 right-4 font-bold text-white text-base leading-tight">{s.title}</h3>
                </div>
                <div className="p-4">
                  <p className="text-gray-500 text-sm leading-relaxed mb-3">{s.desc}</p>
                  <div className="flex items-center gap-1 text-[#c9a84c] text-sm font-bold group-hover:gap-2 transition-all">
                    RÃ©server ce service <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-16 bg-white rounded-2xl p-8 shadow-sm text-center">
            <h3 className="text-xl font-bold text-[#0c4a6e] mb-3">Vous ne savez pas quel service choisir ?</h3>
            <p className="text-gray-500 mb-6">Contactez-nous directement, notre Ã©quipe vous guidera vers la meilleure solution.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="https://wa.me/2250747722931" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#25D366] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#1ebe5d] transition-colors">
                <MessageCircle size={18} /> WhatsApp
              </a>
              <a href="tel:+2250747722931"
                className="flex items-center gap-2 btn-outline">
                <Phone size={18} /> 07 47 72 29 31
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}



