"use client";
import { useState } from "react";
import { ArrowRight, Phone, X, Check, Clock, Video, Mic2, Calendar, FileText, ChevronLeft, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";

type Prestation = {
  slug: string; label: string; image: string; icon: React.ReactNode;
  subtitle: string; description: string; priceRange: string;
  included: string[]; process: { step: string; desc: string }[];
  useCases: string[];
};

const PRESTATIONS: Prestation[] = [
  {
    slug: "reportages",
    label: "Reportages vidéo et photo",
    image: "/Images/cotiere-info.png",
    icon: <Video size={16} />,
    subtitle: "Caméras 4K · Photojournalisme · Montage inclus",
    description: "Des reportages professionnels qui racontent l'histoire du littoral",
    priceRange: "80 000 — 250 000 FCFA",
    included: [
      "Équipe de tournage (caméraman + photographe)",
      "Caméras 4K professionnelles",
      "Prise de son HD",
      "Montage vidéo complet",
      "Retouche photo professionnelle",
      "Livraison en HD (vidéo + photos)",
      "Droits de diffusion inclus",
      "Publication sur CÔTIÈRE INFO+",
    ],
    process: [
      { step: "Brief éditorial", desc: "Définition du sujet, angle et format du reportage" },
      { step: "Repérages", desc: "Visite du lieu et planification du tournage" },
      { step: "Tournage", desc: "Reportage sur le terrain avec l'équipe CÔTIÈRE" },
      { step: "Montage & diffusion", desc: "Post-production et publication sur nos médias" },
    ],
    useCases: ["Événements culturels", "Portraits d'entreprises", "Sujets sociaux", "Tourisme & patrimoine", "Politique locale", "Sport & loisirs"],
  },
  {
    slug: "interviews",
    label: "Interviews et émissions spéciales",
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&q=80",
    icon: <Mic2 size={16} />,
    subtitle: "Studio · Plateau TV · Diffusion multi-canaux",
    description: "Donnez la parole à vos experts et personnalités",
    priceRange: "60 000 — 200 000 FCFA",
    included: [
      "Studio d'interview professionnel",
      "Éclairage plateau TV",
      "Journaliste/animateur expérimenté",
      "Prise de son HD",
      "Montage et habillage graphique",
      "Diffusion sur CÔTIÈRE TV & FM",
      "Publication sur réseaux sociaux",
      "Archive numérique permanente",
    ],
    process: [
      { step: "Préparation", desc: "Élaboration des questions et briefing de l'invité" },
      { step: "Installation plateau", desc: "Mise en place du décor et des équipements" },
      { step: "Enregistrement", desc: "Interview ou émission en studio ou sur le terrain" },
      { step: "Diffusion", desc: "Montage et diffusion sur tous nos canaux" },
    ],
    useCases: ["Personnalités politiques", "Chefs d'entreprise", "Artistes & culturels", "Experts & spécialistes", "Associations", "Institutions publiques"],
  },
  {
    slug: "couverture-evenements",
    label: "Couverture d'événements",
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&q=80",
    icon: <Calendar size={16} />,
    subtitle: "Live · Multi-caméras · Réseaux sociaux en temps réel",
    description: "Votre événement couvert en direct et en différé",
    priceRange: "100 000 — 350 000 FCFA",
    included: [
      "Équipe complète (journaliste + caméraman + photographe)",
      "Couverture live sur réseaux sociaux",
      "Streaming en direct (sur option)",
      "Photos & vidéos de l'événement",
      "Article de presse publié sur CÔTIÈRE INFO+",
      "Diffusion radio CÔTIÈRE FM",
      "Montage du résumé vidéo",
      "Rapport de couverture médiatique",
    ],
    process: [
      { step: "Accréditation", desc: "Demande d'accréditation et planification de la couverture" },
      { step: "Déploiement", desc: "Arrivée de l'équipe avant le début de l'événement" },
      { step: "Couverture live", desc: "Reportage en temps réel sur tous nos canaux" },
      { step: "Publication", desc: "Article + vidéo publiés dans les 24h" },
    ],
    useCases: ["Conférences & sommets", "Festivals & concerts", "Cérémonies officielles", "Inaugurations", "Événements sportifs", "Galas & remises de prix"],
  },
  {
    slug: "contenus-informatifs",
    label: "Publication de contenus informatifs",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80",
    icon: <FileText size={16} />,
    subtitle: "Articles · Communiqués · Réseaux sociaux · Newsletter",
    description: "Diffusez votre message auprès du littoral ivoirien",
    priceRange: "25 000 — 100 000 FCFA",
    included: [
      "Rédaction d'articles de presse",
      "Communiqués de presse officiels",
      "Publication sur CÔTIÈRE INFO+",
      "Diffusion sur nos réseaux sociaux (Facebook, Instagram, TikTok)",
      "Mention dans la newsletter CÔTIÈRE",
      "Référencement Google News",
      "Traduction français/anglais (sur option)",
      "Rapport de portée & statistiques",
    ],
    process: [
      { step: "Brief contenu", desc: "Définition du message, du ton et de la cible" },
      { step: "Rédaction", desc: "Création du contenu par notre équipe éditoriale" },
      { step: "Validation", desc: "Relecture et validation par le client" },
      { step: "Publication & diffusion", desc: "Mise en ligne et partage sur tous nos canaux" },
    ],
    useCases: ["Annonces officielles", "Lancements de produits", "Communiqués d'entreprise", "Appels à projets", "Offres d'emploi", "Événements à venir"],
  },
];

const actualites = [
  { id: "grand-bassam-patrimoine", titre: "Grand-Bassam : le patrimoine UNESCO à l'honneur", date: "Avril 2026", image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80", categorie: "Patrimoine" },
  { id: "tourisme-saison-record", titre: "Tourisme littoral : une saison record attendue", date: "Mars 2026", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80", categorie: "Tourisme" },
  { id: "pecheurs-littoral", titre: "Les pêcheurs du littoral à l'honneur", date: "Mars 2026", image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80", categorie: "Culture" },
  { id: "developpement-economique", titre: "Développement économique de la Côtière ivoirienne", date: "Février 2026", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80", categorie: "Économie" },
  { id: "festival-musique-2026", titre: "Festival de musique du littoral 2026", date: "Février 2026", image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80", categorie: "Culture" },
  { id: "nouvelles-infrastructures", titre: "Nouvelles infrastructures pour la Côtière", date: "Janvier 2026", image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80", categorie: "Infrastructure" },
];

export default function InfoPage() {
  const [active, setActive] = useState<Prestation | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ firstName: "", phone: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");

  function closeModal() { setActive(null); setShowForm(false); setSent(false); setErr(""); setForm({ firstName: "", phone: "", email: "", message: "" }); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.firstName || !form.phone || !form.message) { setErr("Veuillez remplir les champs obligatoires."); return; }
    setSending(true); setErr("");
    const msg = encodeURIComponent(
      `DEMANDE CÔTIÈRE INFO+ — ${active?.label}\n\n` +
      `Nom : ${form.firstName}\nTél : ${form.phone}\nEmail : ${form.email || "—"}\n\nMessage :\n${form.message}`
    );
    setTimeout(() => { window.open(`https://wa.me/2250747722931?text=${msg}`, "_blank"); setSending(false); setSent(true); }, 800);
  }

  return (
    <div className="min-h-screen">
      <section className="relative text-white py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/Images/cotiere-info.png" alt="COTIERE INFO+" className="w-full h-full object-contain" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest">Service Média</span>
            <h1 className="text-2xl sm:text-2xl sm:text-4xl md:text-5xl font-bold mt-2 mb-4">CÔTIÈRE INFO+</h1>
            <p className="text-[#c9a84c] font-semibold text-lg mb-3">« La voix officielle du littoral Ivoirien »</p>
            <p className="text-gray-100 text-lg leading-relaxed">
              Service d'information et de communication dédié au littoral ivoirien.
              Couverture médiatique et diffusion d'informations locales et régionales.
            </p>
            <div className="flex gap-3 mt-8">
              <a href="#actualites" className="btn-primary inline-flex">Nos actualités <ArrowRight size={18} /></a>
              <a href="tel:+2250747722931" className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-bold px-5 py-3 rounded-xl hover:bg-white/20 transition-colors">
                <Phone size={18} /> Nous contacter
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Prestations — cartes cliquables → modal */}
      <section className="py-16 bg-[#f0f9ff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest">Nos prestations</span>
            <h2 className="section-title mt-2">Ce que nous faisons</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PRESTATIONS.map((p) => (
              <button key={p.slug} onClick={() => { setActive(p); setShowForm(false); setSent(false); }}
                className="group relative rounded-xl overflow-hidden shadow-sm card-hover text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#c9a84c]">
                <div className="relative h-40">
                  <img src={p.image} alt={p.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute inset-0 bg-[#c9a84c]/0 group-hover:bg-[#c9a84c]/20 transition-all duration-300" />
                  <p className="absolute bottom-3 left-3 right-3 text-white text-xs font-semibold leading-tight">{p.label}</p>
                  <div className="absolute top-2 right-2 w-6 h-6 bg-white/0 group-hover:bg-white/90 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100">
                    <ArrowRight size={11} className="text-[#0c4a6e]" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Actualités */}
      <section id="actualites" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest">Actualités</span>
            <h2 className="section-title mt-2">Les dernières nouvelles du littoral</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {actualites.map((a) => (
              <div key={a.titre} className="group bg-white rounded-xl overflow-hidden shadow-sm card-hover border border-gray-100">
                <div className="relative h-44 overflow-hidden">
                  <img src={a.image} alt={a.titre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <span className="absolute top-3 left-3 bg-[#c9a84c] text-white text-xs font-bold px-2.5 py-1 rounded-full">{a.categorie}</span>
                </div>
                <div className="p-5">
                  <p className="text-xs text-gray-400 mb-2">{a.date}</p>
                  <h3 className="font-bold text-[#0a1628] mb-3 leading-tight">{a.titre}</h3>
                  <Link href={"/services/info/" + a.id} className="text-[#38bdf8] text-sm font-semibold hover:underline flex items-center gap-1">
                    Lire la suite <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#0c4a6e] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Vous avez un événement à couvrir ?</h2>
          <p className="text-gray-300 mb-8">Contactez CÔTIÈRE INFO+ pour une couverture médiatique professionnelle de votre événement.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="btn-primary">Nous contacter <ArrowRight size={18} /></Link>
            <a href="tel:+2250747722931" className="flex items-center gap-2 bg-white/10 border border-white/30 text-white font-bold px-5 py-3 rounded-xl hover:bg-white/20 transition-colors">
              <Phone size={18} /> 07 47 72 29 31
            </a>
          </div>
        </div>
      </section>

      {/* ── MODAL ── */}
      {active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>

            {/* Hero image */}
            <div className="relative h-44 rounded-t-2xl overflow-hidden shrink-0">
              <img src={active.image} alt={active.label} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-5 right-12">
                <span className="bg-[#c9a84c] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 w-fit mb-2">
                  {active.icon} CÔTIÈRE INFO+
                </span>
                <h2 className="text-lg font-black text-white leading-tight">{active.label}</h2>
                <p className="text-white/70 text-xs mt-0.5">{active.subtitle}</p>
              </div>
              <button onClick={closeModal} className="absolute top-3 right-3 w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white transition-colors">
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {showForm ? (
                /* ── FORMULAIRE ── */
                sent ? (
                  <div className="text-center py-8">
                    <CheckCircle size={52} className="text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-[#0c4a6e] mb-2">Demande envoyée !</h3>
                    <p className="text-gray-500 text-sm mb-6">Notre équipe vous contactera sous 24h.</p>
                    <button onClick={closeModal} className="btn-primary justify-center">Fermer</button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setShowForm(false)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#0c4a6e] transition-colors">
                        <ChevronLeft size={16} /> Retour
                      </button>
                      <h3 className="font-bold text-[#0c4a6e] text-sm">Demande — <span className="text-[#c9a84c]">{active.label}</span></h3>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">Prénom / Nom *</label>
                          <input type="text" required value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                            placeholder="Jean Kouamé" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">Téléphone *</label>
                          <input type="tel" required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                            placeholder="07 XX XX XX XX" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                        <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                          placeholder="jean@email.com" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Votre demande *</label>
                        <textarea required value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                          rows={4} maxLength={500}
                          placeholder={`Décrivez votre besoin pour "${active.label}" : sujet, date, lieu, objectifs...`}
                          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c] resize-none" />
                        <p className="text-xs text-gray-400 text-right">{form.message.length}/500</p>
                      </div>
                      {err && <p className="text-red-500 text-xs bg-red-50 px-3 py-2 rounded-lg">{err}</p>}
                      <div className="flex gap-3">
                        <button type="submit" disabled={sending} className="flex-1 btn-primary justify-center py-3 disabled:opacity-60">
                          {sending ? <><Loader2 size={15} className="animate-spin" /> Envoi...</> : <>Envoyer <ArrowRight size={14} /></>}
                        </button>
                        <a href="tel:+2250747722931" className="flex items-center gap-2 border border-[#0c4a6e]/20 text-[#0c4a6e] text-sm font-semibold px-4 rounded-xl hover:bg-[#0c4a6e]/5 transition-colors">
                          <Phone size={14} />
                        </a>
                      </div>
                      <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-1">
                        <Clock size={10} /> Réponse sous 24h · Sans engagement
                      </p>
                    </form>
                  </>
                )
              ) : (
                /* ── DÉTAIL ── */
                <>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-[#0c4a6e] mb-1">{active.description}</h3>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-base font-black text-[#c9a84c]">{active.priceRange}</p>
                      <p className="text-xs text-gray-400">FCFA</p>
                    </div>
                  </div>

                  {/* Inclus */}
                  <div>
                    <h4 className="text-sm font-bold text-[#0c4a6e] mb-3 flex items-center gap-2">
                      <Check size={15} className="text-green-500" /> Ce qui est inclus
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {active.included.map(item => (
                        <div key={item} className="flex items-start gap-2 text-xs text-gray-600">
                          <Check size={11} className="text-[#c9a84c] shrink-0 mt-0.5" /> {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Processus */}
                  <div>
                    <h4 className="text-sm font-bold text-[#0c4a6e] mb-3">Notre processus</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {active.process.map((p, i) => (
                        <div key={p.step} className="bg-[#f8fafc] rounded-xl p-3 text-center border border-gray-100">
                          <div className="w-6 h-6 bg-[#c9a84c] text-white rounded-full flex items-center justify-center text-xs font-black mx-auto mb-2">{i + 1}</div>
                          <p className="text-xs font-bold text-[#0c4a6e] leading-tight">{p.step}</p>
                          <p className="text-[10px] text-gray-400 mt-1 leading-tight">{p.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cas d'usage */}
                  <div>
                    <h4 className="text-sm font-bold text-[#0c4a6e] mb-2">Pour qui ?</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {active.useCases.map(u => (
                        <span key={u} className="text-xs bg-[#f0f9ff] text-[#0c4a6e] px-2.5 py-1 rounded-full border border-[#bae6fd] font-medium">{u}</span>
                      ))}
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="flex gap-3 pt-2 border-t border-gray-100">
                    <button onClick={() => setShowForm(true)} className="flex-1 btn-primary justify-center text-sm py-2.5">
                      Faire une demande <ArrowRight size={14} />
                    </button>
                    <a href="tel:+2250747722931" className="flex items-center gap-2 border border-[#0c4a6e]/20 text-[#0c4a6e] text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#0c4a6e]/5 transition-colors">
                      <Phone size={14} /> Appeler
                    </a>
                  </div>
                  <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-1">
                    <Clock size={10} /> Réponse sous 24h · Devis gratuit & sans engagement
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
