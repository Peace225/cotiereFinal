"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, Loader2 } from "lucide-react";

type Prestation = {
  id: string;
  label: string;
  description: string;
  image: string;
  isActive: boolean;
};

// Prestations par défaut affichées si la DB est vide
const DEFAULT_PRESTATIONS: Prestation[] = [
  { id: "decoration",   image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=80", label: "Décoration & scénographie",  description: "Mise en scène florale, thématique et décoration de salle.", isActive: true },
  { id: "traiteur",     image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=400&q=80", label: "Traiteur & restauration",      description: "Service traiteur complet, buffet et repas assis.", isActive: true },
  { id: "sonorisation", image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&q=80", label: "Sonorisation & éclairage",   description: "Sono professionnelle, jeux de lumières et effets scéniques.", isActive: true },
  { id: "securite",     image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&q=80", label: "Sécurité événementielle",    description: "Agents de sécurité qualifiés pour vos événements.", isActive: true },
  { id: "hotesses",     image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&q=80", label: "Hôtesses & accueil",         description: "Personnel d'accueil professionnel et bilingue.", isActive: true },
  { id: "animation",    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80", label: "Animation & spectacles",     description: "Artistes, DJ, animateurs et spectacles vivants.", isActive: true },
];

export default function PrestationsSection() {
  const [prestations, setPrestations] = useState<Prestation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/events/prestations")
      .then(r => r.json())
      .then(d => {
        const data: Prestation[] = d.data ?? [];
        // Si la DB est vide, on affiche les prestations par défaut
        setPrestations(data.length > 0 ? data : DEFAULT_PRESTATIONS);
      })
      .catch(() => setPrestations(DEFAULT_PRESTATIONS))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 bg-[#f0f9ff]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="section-title text-center mb-10">Nos prestations événementielles</h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={32} className="animate-spin text-[#c9a84c]" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {prestations.map((s) => (
              <Link
                key={s.id}
                href={`/services/evenements/${s.id}`}
                className="group relative rounded-xl overflow-hidden shadow-sm card-hover cursor-pointer"
              >
                <div className="relative h-36">
                  {s.image ? (
                    <img
                      src={s.image}
                      alt={s.label}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#0c4a6e]/10 to-[#c9a84c]/10 flex items-center justify-center">
                      <Calendar size={40} className="text-[#0c4a6e]/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute inset-0 bg-[#c9a84c]/0 group-hover:bg-[#c9a84c]/15 transition-all duration-300" />
                  <p className="absolute bottom-3 left-3 right-3 text-white text-xs font-semibold leading-tight group-hover:text-[#c9a84c] transition-colors">
                    {s.label}
                  </p>
                  <div className="absolute top-2 right-2 w-6 h-6 bg-white/0 group-hover:bg-white/90 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100">
                    <ArrowRight size={11} className="text-[#0c4a6e]" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
