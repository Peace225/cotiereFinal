import { ArrowRight, MapPin, Clock, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

// Force le rendu dynamique pour éviter les erreurs de build sur Vercel
export const dynamic = 'force-dynamic';

type Destination = {
  name: string; subtitle: string; image: string; desc: string;
  duration: string; price: string; highlights: string[];
  images: string[];
};

const destinations: Record<string, Destination> = {
  "grand-bassam": { 
    name: "Grand-Bassam", 
    subtitle: "Patrimoine UNESCO", 
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80", 
    desc: "Ancienne capitale coloniale classée au patrimoine mondial de l'UNESCO.", 
    duration: "Journée complète", 
    price: "15 000 FCFA / pers.", 
    highlights: ["Quartier France", "Musée du costume", "Plage"], 
    images: ["https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80"] 
  },
  "assinie": { 
    name: "Assinie-Mafia", 
    subtitle: "Plages & Lagune", 
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80", 
    desc: "Station balnéaire prisée entre océan et lagune.", 
    duration: "Week-end (2 jours)", 
    price: "25 000 FCFA / pers.", 
    highlights: ["Plage de sable blanc", "Sports nautiques"], 
    images: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80"] 
  },
};

async function getExcursionFromDb(id: string): Promise<Destination | null> {
  try {
    // ✅ CORRIGÉ : prisma.excursions (pluriel)
    const e = await prisma.excursions.findUnique({ where: { id } });
    if (!e) return null;
    
    return {
      name: (e as any).title,
      subtitle: (e as any).difficulty ?? "Littoral ivoirien",
      image: (e as any).images?.[0] ?? "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
      desc: (e as any).description,
      duration: (e as any).duration,
      price: `${(e as any).priceAdult?.toLocaleString() ?? 0} FCFA / pers.`,
      highlights: [],
      images: (e as any).images || [],
    };
  } catch { 
    return null; 
  }
}

export default async function DestinationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const dest = destinations[id] ?? await getExcursionFromDb(id);

  if (!dest) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-lg">Destination introuvable.</p>
        <Link href="/services/tourisme" className="bg-[#003b95] text-white px-5 py-3 rounded-xl font-bold">
          Voir nos voyages
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-[#0c4a6e]">Accueil</Link>
          <span>/</span>
          <Link href="/services/tourisme" className="hover:text-[#0c4a6e]">Tourisme</Link>
          <span className="text-[#0c4a6e] font-medium">/ {dest.name}</span>
        </div>
      </div>

      <section className="relative text-white overflow-hidden min-h-[400px] flex items-end">
        <div className="absolute inset-0">
          <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
        </div>
        <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 pt-24">
          <Link href="/services/tourisme" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-4 transition-colors">
            <ChevronLeft size={16} /> Retour aux voyages
          </Link>
          <span className="bg-[#c9a84c] text-white text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block">{dest.subtitle}</span>
          <h1 className="text-3xl sm:text-5xl font-black mb-4">{dest.name}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
            {/* ✅ SYNTAXE CORRIGÉE : Utilisation de fermetures de balises correctes pour Clock */}
            <span className="flex items-center gap-1.5"><Clock size={14} className="text-[#c9a84c]" />{dest.duration}</span>
            <span className="flex items-center gap-1.5"><MapPin size={14} className="text-[#c9a84c]" />{dest.price}</span>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-[#0c4a6e] mb-4">À propos de {dest.name}</h2>
              <p className="text-gray-600 leading-relaxed">{dest.desc}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 sticky top-24">
              <Link href="/services/tourisme" className="w-full bg-[#003b95] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 mb-3 hover:bg-blue-800 transition">
                Réserver cette excursion <ArrowRight size={16} />
              </Link>
              <a
                href={`https://wa.me/2250747722931?text=${encodeURIComponent(`Bonjour, je souhaite réserver : ${dest.name}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold py-3 rounded-xl transition-colors text-sm hover:opacity-90"
              >
                Réserver via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}