"use client";
import { useState } from "react";
import { ArrowRight, X, Check, Phone, Clock, Music, Mic2, Sliders, Users, Radio, Video, Star, Loader2, CheckCircle, ChevronLeft } from "lucide-react";
import Link from "next/link";

type Service = {
  slug: string; label: string; image: string; icon: React.ReactNode;
  subtitle: string; description: string; priceRange: string;
  included: string[]; process: { step: string; desc: string }[];
  useCases: string[];
};

const SERVICES: Service[] = [
  {
    slug: "studio",
    label: "Studio d'enregistrement professionnel",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&q=80",
    icon: <Mic2 size={18} />,
    subtitle: "Cabine insonorisée · Matériel haut de gamme · Ingénieur son",
    description: "Enregistrez votre musique dans des conditions professionnelles",
    priceRange: "25 000 — 80 000 FCFA / session",
    included: [
      "Cabine d'enregistrement insonorisée",
      "Microphones professionnels (Neumann, Shure)",
      "Interface audio haute résolution",
      "Ingénieur du son expérimenté",
      "Monitoring de studio (enceintes Yamaha/Adam)",
      "Logiciels DAW (Pro Tools, Logic Pro)",
      "Instruments disponibles sur place",
      "Fichiers bruts livrés après session",
    ],
    process: [
      { step: "Réservation", desc: "Choix du créneau et confirmation par WhatsApp" },
      { step: "Préparation", desc: "Briefing avec l'ingénieur son sur votre projet" },
      { step: "Enregistrement", desc: "Session en cabine avec assistance technique" },
      { step: "Livraison", desc: "Fichiers bruts remis en fin de session" },
    ],
    useCases: ["Singles & albums", "Voix off & jingles", "Podcasts", "Bandes originales", "Démos artistiques", "Musique de film"],
  },
  {
    slug: "mixage",
    label: "Mixage & mastering",
    image: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=600&q=80",
    icon: <Sliders size={18} />,
    subtitle: "Mix professionnel · Mastering · Prêt pour streaming",
    description: "Donnez à votre musique le son qu'elle mérite",
    priceRange: "30 000 — 100 000 FCFA / titre",
    included: [
      "Mixage multipiste professionnel",
      "Égalisation & compression avancées",
      "Effets & traitements (reverb, delay, saturation)",
      "Mastering pour streaming (Spotify, Apple Music)",
      "Mastering pour CD & vinyle",
      "2 révisions incluses",
      "Export en WAV 24bit/48kHz",
      "Livraison sous 5-7 jours ouvrés",
    ],
    process: [
      { step: "Réception des stems", desc: "Envoi sécurisé de vos pistes multipistes" },
      { step: "Mix rough", desc: "Premier mix pour validation de la direction" },
      { step: "Finition", desc: "Affinage du mix et mastering final" },
      { step: "Livraison", desc: "Fichiers WAV + MP3 haute qualité" },
    ],
    useCases: ["Singles & EPs", "Albums complets", "Bandes originales", "Jingles publicitaires", "Musique de film", "Podcasts"],
  },
  {
    slug: "composition",
    label: "Composition & arrangements",
    image: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=600&q=80",
    icon: <Music size={18} />,
    subtitle: "Compositeurs · Arrangeurs · Tous styles musicaux",
    description: "Des compositions originales sur mesure pour vos projets",
    priceRange: "50 000 — 200 000 FCFA / titre",
    included: [
      "Composition musicale originale",
      "Arrangements orchestraux ou électroniques",
      "Écriture de paroles (sur demande)",
      "Tous styles : afrobeat, gospel, pop, jazz, classique",
      "Instruments live ou virtuels",
      "Droits d'auteur transférés",
      "3 propositions musicales initiales",
      "Révisions illimitées jusqu'à validation",
    ],
    process: [
      { step: "Brief créatif", desc: "Échange sur le style, l'ambiance et les références" },
      { step: "Propositions", desc: "3 démos musicales pour choisir la direction" },
      { step: "Développement", desc: "Composition complète et arrangements" },
      { step: "Livraison", desc: "Fichiers finaux + cession des droits" },
    ],
    useCases: ["Génériques TV & radio", "Musique de pub", "Bandes originales", "Hymnes d'entreprise", "Musique de mariage", "Jingles"],
  },
  {
    slug: "management",
    label: "Management d'artistes",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80",
    icon: <Users size={18} />,
    subtitle: "Développement de carrière · Booking · Stratégie",
    description: "Nous développons votre carrière artistique",
    priceRange: "Contrat sur mesure",
    included: [
      "Stratégie de développement artistique",
      "Booking de concerts & événements",
      "Négociation de contrats",
      "Relations presse & médias",
      "Gestion des réseaux sociaux",
      "Développement de l'image artistique",
      "Accès au réseau CÔTIÈRE",
      "Suivi personnalisé mensuel",
    ],
    process: [
      { step: "Audition & évaluation", desc: "Écoute de votre musique et évaluation du potentiel" },
      { step: "Contrat de management", desc: "Signature d'un contrat adapté à votre situation" },
      { step: "Plan de développement", desc: "Élaboration de la stratégie sur 12 mois" },
      { step: "Accompagnement", desc: "Suivi régulier et ajustement de la stratégie" },
    ],
    useCases: ["Artistes émergents", "Groupes de musique", "Chanteurs & rappeurs", "Artistes gospel", "DJs professionnels", "Musiciens de session"],
  },
  {
    slug: "promotion",
    label: "Promotion & distribution",
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80",
    icon: <Radio size={18} />,
    subtitle: "Streaming · Radio · Réseaux sociaux · Presse",
    description: "Faites entendre votre musique partout",
    priceRange: "40 000 — 150 000 FCFA",
    included: [
      "Distribution sur Spotify, Apple Music, Deezer, YouTube Music",
      "Pitching aux radios ivoiriennes & africaines",
      "Campagnes réseaux sociaux (Instagram, TikTok, Facebook)",
      "Communiqués de presse",
      "Placement en playlist",
      "Publicité digitale ciblée",
      "Reporting mensuel des streams",
      "Collecte des royalties",
    ],
    process: [
      { step: "Préparation", desc: "Préparation des assets (artwork, bio, photos)" },
      { step: "Distribution", desc: "Mise en ligne sur toutes les plateformes" },
      { step: "Promotion", desc: "Campagnes radio, réseaux sociaux et presse" },
      { step: "Suivi", desc: "Reporting mensuel et optimisation des campagnes" },
    ],
    useCases: ["Sorties de singles", "Lancements d'albums", "Artistes en développement", "Labels indépendants", "Artistes établis", "Compilations"],
  },
  {
    slug: "clip",
    label: "Clip vidéo & shooting",
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&q=80",
    icon: <Video size={18} />,
    subtitle: "Réalisation · Tournage 4K · Montage · Effets",
    description: "Des clips vidéo qui subliment votre musique",
    priceRange: "200 000 — 600 000 FCFA",
    included: [
      "Réalisation & direction artistique",
      "Tournage en 4K (caméras professionnelles)",
      "Drone pour prises aériennes",
      "Éclairage professionnel",
      "Costumes & maquillage (sur option)",
      "Montage vidéo professionnel",
      "Étalonnage colorimétrique",
      "Livraison en HD pour YouTube & réseaux sociaux",
    ],
    process: [
      { step: "Concept & storyboard", desc: "Développement du concept visuel et du scénario" },
      { step: "Pré-production", desc: "Casting, repérages, costumes et logistique" },
      { step: "Tournage", desc: "1 à 2 jours de tournage selon le concept" },
      { step: "Post-production", desc: "Montage, étalonnage et effets visuels" },
    ],
    useCases: ["Clips musicaux", "Lyric videos", "Behind the scenes", "Teasers & trailers", "Performances live", "Shootings photos"],
  },
];

const packs = [
  { id: "pack-demo",   label: "Pack Démo",   price: "50 000 FCFA",  desc: "2h studio + mixage basique",              featured: false, image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&q=80" },
  { id: "pack-single", label: "Pack Single", price: "150 000 FCFA", desc: "4h studio + mixage pro + mastering",       featured: true,  image: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=600&q=80" },
  { id: "pack-album",  label: "Pack Album",  price: "Sur devis",    desc: "Sessions illimitées + management",         featured: false, image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80" },
];

export default function MusicPage() {
  const [activeService, setActiveService] = useState<Service | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Formulaire de devis
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", projectDesc: "", budget: "", deadline: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState("");

  function closeModal() { setActiveService(null); setShowForm(false); setSent(false); setFormError(""); setForm({ firstName: "", lastName: "", email: "", phone: "", projectDesc: "", budget: "", deadline: "" }); }

  async function handleDevisSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.firstName || !form.phone || !form.projectDesc) { setFormError("Veuillez remplir les champs obligatoires."); return; }
    setSending(true); setFormError("");
    // Envoi WhatsApp admin
    const msg = encodeURIComponent(
      `DEMANDE DE DEVIS — ${activeService?.label}\n\n` +
      `Nom : ${form.firstName} ${form.lastName}\n` +
      `Tél : ${form.phone}\n` +
      `Email : ${form.email || "Non renseigné"}\n` +
      `Budget : ${form.budget || "Non précisé"}\n` +
      `Délai : ${form.deadline || "Non précisé"}\n\n` +
      `Projet :\n${form.projectDesc}`
    );
    setTimeout(() => {
      window.open(`https://wa.me/2250747722931?text=${msg}`, "_blank");
      setSending(false);
      setSent(true);
    }, 800);
  }

  return (
    <div className="min-h-screen">

      {/* Hero */}
      <section className="relative text-white py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1600&q=80"
            alt="Studio musique" className="w-full h-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/10" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-2xl sm:text-2xl sm:text-4xl md:text-5xl font-bold mt-2 mb-2">CÔTIÈRE MUSIC & MANAGEMENT</h1>
            <p className="text-[#c9a84c] font-semibold text-lg mb-3">« Nous apportons une valeur ajoutée à votre talent »</p>
            <p className="text-gray-100 text-lg leading-relaxed">
              Label musical professionnel : studio d'enregistrement, mixage, mastering, management d'artistes
              et organisation de concerts sur le littoral ivoirien.
            </p>
            <a href="#packs" className="btn-primary mt-8 inline-flex">
              Voir nos packs <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* Services — cartes cliquables → modal */}
      <section className="py-16 bg-[#f0f9ff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-center mb-10">Nos services musicaux</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {SERVICES.map((s) => (
              <button
                key={s.slug}
                onClick={() => setActiveService(s)}
                className="group relative rounded-xl overflow-hidden shadow-sm card-hover text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
              >
                <div className="relative h-36">
                  <img src={s.image} alt={s.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute inset-0 bg-[#c9a84c]/0 group-hover:bg-[#c9a84c]/20 transition-all duration-300" />
                  <p className="absolute bottom-3 left-3 right-3 text-white text-xs font-semibold leading-tight">{s.label}</p>
                  <div className="absolute top-2 right-2 w-6 h-6 bg-white/0 group-hover:bg-white/90 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100">
                    <ArrowRight size={11} className="text-[#0c4a6e]" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Packs */}
      <section id="packs" className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="section-title mb-10">Nos packs studio</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packs.map((p) => (
              <div key={p.label} className={`group relative rounded-2xl overflow-hidden shadow-md card-hover ${p.featured ? "ring-2 ring-[#c9a84c]" : ""}`}>
                <div className="relative h-44">
                  <img src={p.image} alt={p.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  {p.featured && <span className="absolute top-3 left-3 bg-[#c9a84c] text-white text-xs font-bold px-3 py-1 rounded-full">Populaire</span>}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-bold text-white text-base">{p.label}</h3>
                    <p className="text-[#c9a84c] font-bold text-lg">{p.price}</p>
                  </div>
                </div>
                <div className="bg-white p-4">
                  <p className="text-gray-500 text-sm mb-4">{p.desc}</p>
                  <a href={`https://wa.me/2250747722931?text=${encodeURIComponent(`Réservation Studio Musique\n\n${p.label} - ${p.price}\n${p.desc}\n\nBonjour, je souhaite réserver ce pack studio.`)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="btn-primary w-full justify-center text-sm py-2">
                    Réserver <ArrowRight size={14} />
                  </a>
                  <Link href={`/services/music/${p.id}`}
                    className="mt-2 w-full flex items-center justify-center gap-1 text-sm font-semibold text-[#0c4a6e] border border-[#0c4a6e]/20 rounded-xl py-2 hover:bg-[#0c4a6e]/5 transition-colors">
                    Voir détail <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MODAL ── */}
      {activeService && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setActiveService(null)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Panel */}
          <div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image hero */}
            <div className="relative h-48 rounded-t-2xl overflow-hidden shrink-0">
              <img src={activeService.image} alt={activeService.label} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-5 right-12">
                <span className="bg-[#c9a84c] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 w-fit mb-2">
                  {activeService.icon} CÔTIÈRE MUSIC
                </span>
                <h2 className="text-xl font-black text-white leading-tight">{activeService.label}</h2>
                <p className="text-white/70 text-xs mt-0.5">{activeService.subtitle}</p>
              </div>
              <button
                onClick={() => setActiveService(null)}
                className="absolute top-3 right-3 w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-5">

              {/* ── VUE FORMULAIRE ── */}
              {showForm ? (
                <>
                  {sent ? (
                    /* Succès */
                    <div className="text-center py-8">
                      <CheckCircle size={52} className="text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg font-bold text-[#0c4a6e] mb-2">Demande envoyée !</h3>
                      <p className="text-gray-500 text-sm mb-6">Notre équipe vous contactera sous 24h avec un devis personnalisé.</p>
                      <button onClick={closeModal} className="btn-primary justify-center">Fermer</button>
                    </div>
                  ) : (
                    /* Formulaire */
                    <>
                      <div className="flex items-center gap-3 mb-1">
                        <button onClick={() => setShowForm(false)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#0c4a6e] transition-colors">
                          <ChevronLeft size={16} /> Retour
                        </button>
                        <h3 className="font-bold text-[#0c4a6e]">Demande de devis — <span className="text-[#c9a84c]">{activeService.label}</span></h3>
                      </div>
                      <p className="text-xs text-gray-400 mb-4">Remplissez ce formulaire, nous vous répondons sous 24h avec un devis gratuit.</p>

                      <form onSubmit={handleDevisSubmit} className="space-y-4">
                        {/* Nom & Prénom */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Prénom *</label>
                            <input type="text" required value={form.firstName}
                              onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                              placeholder="Jean" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Nom</label>
                            <input type="text" value={form.lastName}
                              onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                              placeholder="Kouamé" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
                          </div>
                        </div>

                        {/* Téléphone & Email */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Téléphone *</label>
                            <input type="tel" required value={form.phone}
                              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                              placeholder="07 XX XX XX XX" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                            <input type="email" value={form.email}
                              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                              placeholder="jean@email.com" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
                          </div>
                        </div>

                        {/* Budget & Délai */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Budget estimé</label>
                            <select value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))}
                              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c] bg-white">
                              <option value="">Sélectionner...</option>
                              <option>Moins de 50 000 FCFA</option>
                              <option>50 000 — 150 000 FCFA</option>
                              <option>150 000 — 300 000 FCFA</option>
                              <option>Plus de 300 000 FCFA</option>
                              <option>À définir ensemble</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Délai souhaité</label>
                            <select value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
                              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c] bg-white">
                              <option value="">Sélectionner...</option>
                              <option>Urgent (moins d'1 semaine)</option>
                              <option>Dans 2 semaines</option>
                              <option>Dans 1 mois</option>
                              <option>Dans 2-3 mois</option>
                              <option>Pas de contrainte</option>
                            </select>
                          </div>
                        </div>

                        {/* Description du projet */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">Description de votre projet *</label>
                          <textarea required value={form.projectDesc}
                            onChange={e => setForm(f => ({ ...f, projectDesc: e.target.value }))}
                            rows={4} maxLength={500}
                            placeholder={`Décrivez votre projet pour "${activeService.label}" : style musical, nombre de titres, références, attentes particulières...`}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c] resize-none" />
                          <p className="text-xs text-gray-400 text-right mt-1">{form.projectDesc.length}/500</p>
                        </div>

                        {formError && <p className="text-red-500 text-xs bg-red-50 px-3 py-2 rounded-lg">{formError}</p>}

                        <div className="flex gap-3 pt-1">
                          <button type="submit" disabled={sending}
                            className="flex-1 btn-primary justify-center py-3 disabled:opacity-60">
                            {sending ? <><Loader2 size={15} className="animate-spin" /> Envoi...</> : <>Envoyer ma demande <ArrowRight size={15} /></>}
                          </button>
                          <a href="tel:+2250747722931"
                            className="flex items-center gap-2 border border-[#0c4a6e]/20 text-[#0c4a6e] text-sm font-semibold px-4 rounded-xl hover:bg-[#0c4a6e]/5 transition-colors">
                            <Phone size={14} />
                          </a>
                        </div>
                        <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-1">
                          <Clock size={10} /> Réponse sous 24h · Devis gratuit & sans engagement
                        </p>
                      </form>
                    </>
                  )}
                </>
              ) : (
                /* ── VUE DÉTAIL ── */
                <>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-[#0c4a6e] mb-1">{activeService.description}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {activeService.included.slice(0, 2).join(" · ")}...
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-lg font-black text-[#c9a84c] leading-tight">{activeService.priceRange}</p>
                  <p className="text-xs text-gray-400">FCFA</p>
                </div>
              </div>

              {/* Ce qui est inclus */}
              <div>
                <h4 className="text-sm font-bold text-[#0c4a6e] mb-3 flex items-center gap-2">
                  <Check size={15} className="text-green-500" /> Ce qui est inclus
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {activeService.included.map(item => (
                    <div key={item} className="flex items-start gap-2 text-xs text-gray-600">
                      <Check size={11} className="text-[#c9a84c] shrink-0 mt-0.5" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Processus */}
              <div>
                <h4 className="text-sm font-bold text-[#0c4a6e] mb-3">Notre processus</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {activeService.process.map((p, i) => (
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
                  {activeService.useCases.map(u => (
                    <span key={u} className="text-xs bg-[#f0f9ff] text-[#0c4a6e] px-2.5 py-1 rounded-full border border-[#bae6fd] font-medium">{u}</span>
                  ))}
                </div>
              </div>

              {/* CTAs */}
              <div className="flex gap-3 pt-2 border-t border-gray-100">
                <button
                  onClick={() => setShowForm(true)}
                  className="flex-1 btn-primary justify-center text-sm py-2.5"
                >
                  Demander un devis <ArrowRight size={14} />
                </button>
                <a href="tel:+2250747722931"
                  className="flex items-center gap-2 border border-[#0c4a6e]/20 text-[#0c4a6e] text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#0c4a6e]/5 transition-colors">
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
