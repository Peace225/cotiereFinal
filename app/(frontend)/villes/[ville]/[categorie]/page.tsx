"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { MapPin, ChevronLeft, Phone, Globe, Star, Loader2, ArrowRight } from "lucide-react";

type Contenu = {
  id: string; nom: string; description?: string; adresse?: string;
  telephone?: string; whatsapp?: string; siteWeb?: string;
  image?: string; prix?: string; note?: number;
};

const VILLES_NOMS: Record<string, string> = {
  "aboisso": "Aboisso", "adiake": "Adiaké", "assinie-mafia": "Assinie-Mafia",
  "grand-bassam": "Grand-Bassam", "abidjan": "Abidjan", "jacqueville": "Jacqueville",
  "dabou": "Dabou", "grand-lahou": "Grand-Lahou", "fresco": "Fresco",
  "sassandra": "Sassandra", "san-pedro": "San-Pédro", "grand-bereby": "Grand-Béréby",
  "tabou": "Tabou",
};

const CATEGORIES_LABELS: Record<string, { label: string; emoji: string; description: string }> = {
  "hotels":      { label: "Hôtels",                  emoji: "🏨", description: "Hôtels et établissements hôteliers" },
  "residences":  { label: "Résidences",               emoji: "🏠", description: "Résidences meublées et appartements" },
  "plages":      { label: "Plages",                   emoji: "🏖️", description: "Plages et espaces balnéaires" },
  "restaurants": { label: "Restaurants",              emoji: "🍽️", description: "Restaurants, maquis et gastronomie locale" },
  "sites":       { label: "Sites touristiques",       emoji: "🏛️", description: "Monuments, sites naturels et culturels" },
  "transport":   { label: "Compagnies de transport",  emoji: "🚌", description: "Bus, taxis, bateaux et transferts" },
};

export default function VilleCategoriePageClient() {
  const params = useParams();
  const ville = params.ville as string;
  const categorie = params.categorie as string;
  const [contenus, setContenus] = useState<Contenu[]>([]);
  const [loading, setLoading] = useState(true);

  const villeNom = VILLES_NOMS[ville] ?? ville;
  const catInfo = CATEGORIES_LABELS[categorie];

  useEffect(() => {
    fetch(`/api/villes/${ville}/${categorie}`)
      .then(r => r.json())
      .then(d => { setContenus(d.data ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [ville, categorie]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3">
          <Link href={`/villes/${ville}`} className="flex items-center gap-1.5 text-gray-500 hover:text-[#0c4a6e] text-sm transition-colors">
            <ChevronLeft size={16} /> {villeNom}
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-sm font-semibold text-[#0c4a6e]">{catInfo?.label}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Titre */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <MapPin size={16} className="text-[#c9a84c]" />
            <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest">{villeNom}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0c4a6e]">
            {catInfo?.emoji} {catInfo?.label} à {villeNom}
          </h1>
          <p className="text-gray-500 mt-1">{catInfo?.description}</p>
        </div>

        {/* Contenu */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={36} className="animate-spin text-[#c9a84c]" />
          </div>
        ) : contenus.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-4xl mb-4">{catInfo?.emoji}</p>
            <h3 className="text-lg font-bold text-[#0c4a6e] mb-2">
              Aucun contenu disponible pour le moment
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              Les {catInfo?.label.toLowerCase()} de {villeNom} seront bientôt disponibles.
            </p>
            <Link href={`/villes/${ville}`}
              className="inline-flex items-center gap-2 bg-[#0c4a6e] text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-[#083a57] transition-colors text-sm">
              <ChevronLeft size={14} /> Retour à {villeNom}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {contenus.map((c) => (
              <div key={c.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                {/* Image */}
                <div className="relative h-44 bg-gray-100">
                  {c.image ? (
                    <img src={c.image} alt={c.nom} className="w-full h-full object-cover"
                      onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">
                      {catInfo?.emoji}
                    </div>
                  )}
                  {c.note && (
                    <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[#c9a84c] text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                      <Star size={10} fill="currentColor" /> {c.note.toFixed(1)}
                    </span>
                  )}
                </div>
                {/* Infos */}
                <div className="p-4">
                  <h3 className="font-bold text-[#0c4a6e] text-base mb-1">{c.nom}</h3>
                  {c.description && <p className="text-gray-500 text-xs leading-relaxed mb-2 line-clamp-2">{c.description}</p>}
                  {c.adresse && (
                    <p className="flex items-center gap-1 text-xs text-gray-400 mb-2">
                      <MapPin size={11} /> {c.adresse}
                    </p>
                  )}
                  {c.prix && (
                    <p className="text-[#c9a84c] font-bold text-sm mb-3">{c.prix}</p>
                  )}
                  <div className="flex gap-2 flex-wrap">
                    {c.telephone && (
                      <a href={`tel:${c.telephone}`}
                        className="flex items-center gap-1 text-xs bg-[#0c4a6e] text-white px-3 py-1.5 rounded-lg hover:bg-[#083a57] transition-colors">
                        <Phone size={11} /> Appeler
                      </a>
                    )}
                    {c.whatsapp && (
                      <a href={`https://wa.me/${c.whatsapp.replace(/\s/g, "")}`} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 transition-colors">
                        WhatsApp
                      </a>
                    )}
                    {c.siteWeb && (
                      <a href={c.siteWeb} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors">
                        <Globe size={11} /> Site web
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA réservation */}
        {contenus.length > 0 && (
          <div className="mt-10 bg-[#0c4a6e] rounded-2xl p-6 text-white text-center">
            <h3 className="font-bold text-lg mb-2">Vous souhaitez réserver ?</h3>
            <p className="text-white/70 text-sm mb-4">Notre équipe vous accompagne dans votre séjour à {villeNom}.</p>
            <Link href="/reservation"
              className="inline-flex items-center gap-2 bg-[#c9a84c] hover:bg-[#b8973b] text-white font-bold px-6 py-3 rounded-xl transition-colors">
              Réserver maintenant <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
