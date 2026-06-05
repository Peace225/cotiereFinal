"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar, MapPin, Clock, Users, Phone, Ticket,
  Music, Trophy, Mic2, PartyPopper, Star, Zap, Palette,
  Share2, RefreshCw,
} from "lucide-react";
import { useParams } from "next/navigation";

type Evenement = {
  id: string; slug: string; titre: string; categorie: string;
  date: string; heure: string; lieu: string; ville: string;
  image: string; badge: string; badgeColor: string; prix: string;
  description: string; artistes?: string | null; capacite?: string;
  duree?: string | null; organisateur?: string; programme: string[];
};

const CATEGORIE_ICON: Record<string, React.ElementType> = {
  Festival: Music, Gala: Trophy, Conference: Mic2,
  "Fete culturelle": PartyPopper, Salon: Star, Sport: Zap, Formation: Palette,
};

function ShareButton({ titre, url }: { titre: string; url: string }) {
  async function handleShare() {
    if (navigator.share) {
      try { await navigator.share({ title: titre, url }); } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      alert("Lien copie dans le presse-papier !");
    }
  }
  return (
    <button onClick={handleShare}
      className="flex items-center gap-2 border border-[#0c4a6e]/20 text-[#0c4a6e] text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#0c4a6e]/5 transition-colors w-full justify-center">
      <Share2 size={16} /> Partager
    </button>
  );
}

export default function RdvDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [ev, setEv] = useState<Evenement | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [pageUrl, setPageUrl] = useState("");

  useEffect(() => { setPageUrl(window.location.href); }, []);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/evenements/${slug}`)
      .then(r => {
        if (r.status === 404) { setNotFound(true); return null; }
        return r.json();
      })
      .then(d => {
        if (d) setEv(d.data?.evenement ?? null);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw size={32} className="animate-spin text-[#c9a84c]" />
      </div>
    );
  }

  if (notFound || !ev) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <h1 className="text-2xl font-black text-[#0c4a6e]">Evenement introuvable</h1>
        <p className="text-gray-500">Cet evenement n existe pas ou a ete supprime.</p>
        <Link href="/services/rdv" className="btn-primary inline-flex items-center gap-2">
          Retour aux evenements
        </Link>
      </div>
    );
  }

  const Icon = CATEGORIE_ICON[ev.categorie] ?? Star;

  return (
    <div className="min-h-screen bg-gray-50">

      <section className="relative text-white overflow-hidden min-h-[340px] flex items-end">
        <div className="absolute inset-0">
          <img src={ev.image} alt={ev.titre} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
        </div>
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 pt-24">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/services/rdv"
              className="text-white/80 hover:text-white text-sm flex items-center gap-1 transition-colors">
              Retour aux evenements
            </Link>
            <span className={`${ev.badgeColor} text-white text-xs font-bold px-2.5 py-1 rounded-full`}>
              {ev.badge}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-4">{ev.titre}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
            <span className="flex items-center gap-1.5"><Calendar size={14} className="text-[#c9a84c]" />{ev.date}</span>
            <span className="flex items-center gap-1.5"><Clock size={14} className="text-[#c9a84c]" />{ev.heure}</span>
            <span className="flex items-center gap-1.5"><MapPin size={14} className="text-[#c9a84c]" />{ev.lieu}</span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-8">

            {(ev.artistes || ev.capacite || ev.duree || ev.ville) && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {ev.artistes && (
                  <div className="bg-white rounded-2xl p-4 border border-gray-100 text-center shadow-sm">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Artistes</p>
                    <p className="text-xl font-black text-[#0c4a6e]">{ev.artistes}</p>
                  </div>
                )}
                {ev.capacite && (
                  <div className="bg-white rounded-2xl p-4 border border-gray-100 text-center shadow-sm">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Capacite</p>
                    <p className="text-xl font-black text-[#0c4a6e]">{ev.capacite}</p>
                  </div>
                )}
                {ev.duree && (
                  <div className="bg-white rounded-2xl p-4 border border-gray-100 text-center shadow-sm">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Duree</p>
                    <p className="text-xl font-black text-[#0c4a6e]">{ev.duree}</p>
                  </div>
                )}
                {ev.ville && (
                  <div className="bg-white rounded-2xl p-4 border border-gray-100 text-center shadow-sm">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Lieu</p>
                    <p className="text-base font-black text-[#c9a84c] leading-tight">{ev.ville}</p>
                  </div>
                )}
              </div>
            )}

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-xl font-black text-[#0c4a6e] mb-4">A propos de cet evenement</h2>
              <p className="text-gray-600 leading-relaxed">{ev.description}</p>
            </div>

            {ev.programme && ev.programme.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h2 className="text-xl font-black text-[#0c4a6e] mb-4">Programme</h2>
                <div className="space-y-3">
                  {ev.programme.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-[#c9a84c] text-white rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="lg:hidden bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-3">
              <a href={`https://wa.me/2250747722931?text=${encodeURIComponent("Inscription — " + ev.titre + "\n\nDate : " + ev.date + "\nLieu : " + ev.lieu + "\n\nBonjour, je souhaite m inscrire a cet evenement.")}`}
                target="_blank" rel="noopener noreferrer" className="btn-primary w-full justify-center">
                <Ticket size={16} /> S inscrire / Reserver
              </a>
              <a href="tel:+2250747722931"
                className="flex items-center justify-center gap-2 border border-[#0c4a6e]/20 text-[#0c4a6e] text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#0c4a6e]/5 transition-colors w-full">
                <Phone size={16} /> Appeler
              </a>
              <ShareButton titre={ev.titre} url={pageUrl || ("https://cotiere.ci/services/rdv/" + ev.slug)} />
            </div>
          </div>

          <div className="space-y-6">

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-black text-[#0c4a6e] text-lg mb-5">Infos pratiques</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar size={16} className="text-[#c9a84c] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Date</p>
                    <p className="font-bold text-[#0c4a6e] text-sm">{ev.date}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={16} className="text-[#c9a84c] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Horaires</p>
                    <p className="font-bold text-[#0c4a6e] text-sm">{ev.heure}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-[#c9a84c] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Lieu</p>
                    <p className="font-bold text-[#c9a84c] text-sm">{ev.lieu}</p>
                  </div>
                </div>
                {ev.capacite && (
                  <div className="flex items-start gap-3">
                    <Users size={16} className="text-[#c9a84c] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">Capacite</p>
                      <p className="font-bold text-[#0c4a6e] text-sm">{ev.capacite}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <Ticket size={16} className="text-[#c9a84c] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Prix</p>
                    <p className="font-bold text-[#c9a84c] text-sm">{ev.prix}</p>
                  </div>
                </div>
                {ev.organisateur && (
                  <div className="flex items-start gap-3">
                    <Icon size={16} className="text-[#c9a84c] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">Organisateur</p>
                      <p className="font-bold text-[#0c4a6e] text-sm">{ev.organisateur}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-3">
              <a href={`https://wa.me/2250747722931?text=${encodeURIComponent("Inscription — " + ev.titre + "\n\nDate : " + ev.date + "\nLieu : " + ev.lieu + "\n\nBonjour, je souhaite m inscrire a cet evenement.")}`}
                target="_blank" rel="noopener noreferrer" className="btn-primary w-full justify-center">
                <Ticket size={16} /> S inscrire / Reserver
              </a>
              <a href="tel:+2250747722931"
                className="flex items-center justify-center gap-2 border border-[#0c4a6e]/20 text-[#0c4a6e] text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#0c4a6e]/5 transition-colors w-full">
                <Phone size={16} /> Appeler
              </a>
              <div className="pt-1">
                <ShareButton titre={ev.titre} url={pageUrl || ("https://cotiere.ci/services/rdv/" + ev.slug)} />
              </div>
            </div>

            <Link href="/services/rdv"
              className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-[#0c4a6e] transition-colors py-2">
              Voir tous les evenements
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}