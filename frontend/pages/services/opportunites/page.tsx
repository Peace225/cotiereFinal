"use client";
import { useState } from "react";
import { ArrowRight, Briefcase, Users, TrendingUp, Globe, CheckCircle, Phone, X, Check, Clock, ChevronLeft, Loader2, MapPin, Star } from "lucide-react";

type Service = {
  slug: string; icon: React.ElementType; title: string; desc: string;
  image: string; subtitle: string; longDesc: string;
  highlights: { icon: React.ElementType; label: string; value: string }[];
  included: string[]; examples: string[];
  gallery: string[];
};

const SERVICES: Service[] = [
  {
    slug: "identification",
    icon: Briefcase,
    title: "Identification d'opportunités",
    desc: "Nous identifions pour vous les meilleures opportunités d'affaires sur le littoral ivoirien.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80",
    subtitle: "Veille économique é Analyse de marché é Opportunités ciblées",
    longDesc: "Notre équipe d'experts analyse en permanence le tissu économique du littoral ivoirien pour identifier les meilleures opportunités d'investissement et d'affaires. Nous réalisons des études de marché approfondies, des analyses de faisabilité et des rapports sectoriels pour vous aider é prendre les meilleures décisions d'investissement.",
    highlights: [
      { icon: MapPin, label: "Zone couverte", value: "Tout le littoral ivoirien" },
      { icon: Star, label: "Secteurs analysés", value: "8 secteurs porteurs" },
      { icon: TrendingUp, label: "Opportunités/mois", value: "20+ identifiées" },
      { icon: Clock, label: "Délai de rapport", value: "5 é 10 jours" },
    ],
    included: ["étude de marché sectorielle", "Analyse de la concurrence locale", "Identification des acteurs clés", "Rapport d'opportunités personnalisé", "Cartographie des zones d'investissement", "Analyse des risques et opportunités", "Recommandations stratégiques", "Suivi trimestriel du marché"],
    examples: ["Identification de terrains disponibles pour hôtellerie", "Analyse du marché de la pêche artisanale", "Opportunités dans l'agro-tourisme", "Niches dans le commerce local", "Projets immobiliers côtiers"],
    gallery: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80",
    ],
  },
  {
    slug: "mise-en-relation",
    icon: Users,
    title: "Mise en relation",
    desc: "Connectez-vous avec des partenaires locaux, investisseurs et acteurs économiques clés.",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&q=80",
    subtitle: "Networking é Partenariats é Investisseurs é Acteurs locaux",
    longDesc: "CÔTIÈRE Opportunités dispose d'un réseau étendu d'acteurs économiques, d'investisseurs et de partenaires sur tout le littoral ivoirien. Nous facilitons les rencontres entre porteurs de projets et investisseurs, entre entreprises locales et partenaires internationaux, pour créer des synergies et accélérer le développement économique de la région.",
    highlights: [
      { icon: Users, label: "Réseau actif", value: "500+ contacts qualifiés" },
      { icon: Globe, label: "Portée", value: "Locale & internationale" },
      { icon: Briefcase, label: "Partenariats créés", value: "50+ en 2025" },
      { icon: Clock, label: "Délai de mise en relation", value: "48 é 72h" },
    ],
    included: ["Accès é notre réseau d'investisseurs", "Mise en relation avec partenaires locaux", "Organisation de rencontres B2B", "Facilitation des négociations", "Accompagnement lors des premières réunions", "Suivi des partenariats établis", "Accès aux événements networking CÔTIÈRE", "Profil d'entreprise sur notre plateforme"],
    examples: ["Mise en relation entrepreneur/investisseur", "Partenariats hételiers avec tour-opérateurs", "Connexion avec fournisseurs locaux", "Accès aux réseaux de distribution", "Partenariats avec institutions financiéres"],
    gallery: [
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&q=80",
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80",
      "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=400&q=80",
    ],
  },
  {
    slug: "promotion",
    icon: TrendingUp,
    title: "Promotion & accompagnement",
    desc: "Bénéficiez d'un accompagnement personnalisé pour développer vos projets.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    subtitle: "Coaching é Communication é Développement de projet",
    longDesc: "Notre service de promotion et d'accompagnement vous offre un suivi personnalisé tout au long du développement de votre projet. De la conception é la mise en oeuvre, nos experts vous guident, vous forment et vous aident é communiquer efficacement sur votre activité. Nous mettons également nos médias (CÔTIÈRE TV, FM, Magazine) é votre service pour promouvoir votre projet.",
    highlights: [
      { icon: Star, label: "Projets accompagnés", value: "100+ en 2025" },
      { icon: TrendingUp, label: "Taux de réussite", value: "85% des projets" },
      { icon: Users, label: "Experts disponibles", value: "10 consultants" },
      { icon: Clock, label: "Durée d'accompagnement", value: "3 é 12 mois" },
    ],
    included: ["Coaching individuel mensuel", "Plan de développement personnalisé", "Formation en gestion de projet", "Stratégie de communication", "Promotion sur CÔTIÈRE TV, FM & Magazine", "Accès aux outils de gestion", "Mise en avant sur CÔTIÈRE INFO+", "Rapport de suivi trimestriel"],
    examples: ["Lancement d'une activité touristique", "Développement d'une marque locale", "Structuration d'une PME", "Campagne de communication", "Levée de fonds pour projet"],
    gallery: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80",
    ],
  },
  {
    slug: "secteurs",
    icon: Globe,
    title: "Secteurs porteurs",
    desc: "Tourisme, agro-alimentaire, pêche, immobilier, culture et numérique.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80",
    subtitle: "8 secteurs é Potentiel élevé é Littoral ivoirien",
    longDesc: "Le littoral ivoirien regorge de secteurs économiques é fort potentiel de croissance. CÔTIÈRE Opportunités a identifié 8 secteurs porteurs oé les opportunités d'investissement sont les plus prometteuses. Chaque secteur fait l'objet d'une analyse approfondie et d'un accompagnement spécialisé pour maximiser vos chances de succés.",
    highlights: [
      { icon: Globe, label: "Secteurs couverts", value: "8 secteurs clés" },
      { icon: TrendingUp, label: "Croissance moyenne", value: "+15% / an" },
      { icon: MapPin, label: "Zone géographique", value: "500 km de côtes" },
      { icon: Briefcase, label: "Projets actifs", value: "200+ en cours" },
    ],
    included: ["Tourisme & hôtellerie balnéaire", "Agro-alimentaire & transformation", "Pêche & aquaculture", "Immobilier côtier", "Culture & arts locaux", "Numérique & tech", "Commerce & distribution", "énergie renouvelable"],
    examples: ["Hétel boutique en bord de mer", "Unité de transformation de poisson", "Ferme aquacole", "Résidence touristique", "Application mobile locale", "Marché artisanal numérique"],
    gallery: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80",
    ],
  },
];

const secteurs = ["Tourisme", "Agro-alimentaire", "Pêche & aquaculture", "Immobilier", "Culture & arts", "Numérique", "Commerce", "Autre"];

export default function OpportunitesPage() {
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", email: "", secteur: "", projet: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // Modal
  const [active, setActive] = useState<Service | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [mForm, setMForm] = useState({ name: "", phone: "", email: "", secteur: "", message: "" });
  const [mSending, setMSending] = useState(false);
  const [mSent, setMSent] = useState(false);

  function closeModal() { setActive(null); setShowForm(false); setMSent(false); setMForm({ name: "", phone: "", email: "", secteur: "", message: "" }); }

  async function handleModalSubmit(e: React.FormEvent) {
    e.preventDefault(); setMSending(true);
    const msg = encodeURIComponent(`OPPORTUNITES - ${active?.title}\n\nNom : ${mForm.name}\nTel : ${mForm.phone}\nEmail : ${mForm.email || "-"}\nSecteur : ${mForm.secteur || "-"}\n\n${mForm.message}`);
    setTimeout(() => { window.open(`https://wa.me/2250747722931?text=${msg}`, "_blank"); setMSending(false); setMSent(true); }, 800);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true);
    try {
      await fetch("/api/events/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientFirstName: form.firstName,
          clientLastName: form.lastName,
          clientPhone: form.phone,
          clientEmail: form.email || null,
          eventType: "Opportunites - " + form.secteur,
          eventDate: new Date().toISOString(),
          eventLocation: "Littoral ivoirien",
          guestCount: 1,
          services: [form.secteur],
          description: form.projet || "",
        }),
      });
      setSent(true);
    } catch {}
    setLoading(false);
  }

  return (
    <div className="min-h-screen">
      <section className="relative text-white py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1600&q=80" alt="Opportunités" className="w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest">Service</span>
            <h1 className="text-2xl sm:text-2xl sm:text-4xl md:text-5xl font-bold mt-2 mb-4">Opportunités</h1>
            <p className="text-gray-100 text-lg">Identification, mise en relation, promotion et accompagnement dans les secteurs porteurs du littoral ivoirien.</p>
            <a href="#demande" className="btn-primary mt-8 inline-flex items-center gap-2">Soumettre un projet <ArrowRight size={18} /></a>
          </div>
        </div>
      </section>

      {/* Services é cartes cliquables */}
      <section id="services" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title mb-10">Nos services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((s) => {
              const Icon = s.icon;
              return (
                <button key={s.slug} onClick={() => { setActive(s); setShowForm(false); setMSent(false); }}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 card-hover text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#c9a84c] transition-all hover:shadow-md hover:border-[#c9a84c]/30">
                  {/* Image */}
                  <div className="relative h-36 overflow-hidden">
                    <img src={s.image} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute inset-0 bg-[#c9a84c]/0 group-hover:bg-[#c9a84c]/15 transition-all duration-300" />
                    <div className="absolute top-2 right-2 w-7 h-7 bg-white/0 group-hover:bg-white/90 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100">
                      <ArrowRight size={13} className="text-[#0c4a6e]" />
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="w-10 h-10 bg-[#0c4a6e]/10 rounded-xl flex items-center justify-center mb-3 group-hover:bg-[#c9a84c]/15 transition-colors">
                      <Icon size={20} className="text-[#0c4a6e] group-hover:text-[#c9a84c] transition-colors" />
                    </div>
                    <h3 className="font-bold text-[#0c4a6e] mb-2 group-hover:text-[#c9a84c] transition-colors">{s.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Formulaire */}
      <section id="demande" className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="section-title">Soumettre votre projet</h2>
            <p className="text-gray-500 mt-2">Partagez votre idée, notre équipe vous accompagne.</p>
          </div>
          {sent ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
              <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
              <h3 className="font-bold text-[#0c4a6e] text-lg mb-2">Projet soumis !</h3>
              <p className="text-gray-500 text-sm">Notre équipe vous contactera sous 48h.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium text-gray-700 mb-1">Prénom *</label>
                  <input required type="text" placeholder="Jean" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" /></div>
                <div><label className="block text-xs font-medium text-gray-700 mb-1">Nom *</label>
                  <input required type="text" placeholder="Kouamé" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium text-gray-700 mb-1">Téléphone *</label>
                  <input required type="tel" placeholder="07 XX XX XX XX" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" /></div>
                <div><label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" placeholder="jean@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" /></div>
              </div>
              <div><label className="block text-xs font-medium text-gray-700 mb-1">Secteur d'activité *</label>
                <select required value={form.secteur} onChange={e => setForm(f => ({ ...f, secteur: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8] bg-white">
                  <option value="">Sélectionner...</option>
                  {secteurs.map(s => <option key={s} value={s}>{s}</option>)}
                </select></div>
              <div><label className="block text-xs font-medium text-gray-700 mb-1">Description du projet</label>
                <textarea rows={4} placeholder="Décrivez votre projet, vos besoins ou votre idée d'investissement..." value={form.projet} onChange={e => setForm(f => ({ ...f, projet: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8] resize-none" /></div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60">
                {loading ? "Envoi..." : <><span>Soumettre mon projet</span><ArrowRight size={16} /></>}
              </button>
              <p className="text-xs text-gray-400 text-center">Réponse sous 48h é Gratuit et confidentiel</p>
            </form>
          )}
        </div>
      </section>

      <section className="py-16 bg-[#0c4a6e] text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-black mb-4">Vous préférez nous appeler ?</h2>
          <p className="text-gray-300 mb-8">Notre équipe est disponible du lundi au samedi de 8h é 18h.</p>
          <a href="tel:+2250747722931" className="inline-flex items-center gap-2 bg-[#c9a84c] hover:bg-[#b8973b] text-white font-bold px-8 py-4 rounded-xl transition-colors">
            <Phone size={18} /> 07 47 72 29 31
          </a>
        </div>
      </section>

      {/* -- MODAL -- */}
      {active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>

            {/* Hero image */}
            <div className="relative h-52 rounded-t-2xl overflow-hidden shrink-0">
              <img src={active.image} alt={active.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-5 right-12">
                <span className="bg-[#c9a84c] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 w-fit mb-2">
                  <active.icon size={12} /> CÔTIÈRE Opportunités
                </span>
                <h2 className="text-xl font-black text-white leading-tight">{active.title}</h2>
                <p className="text-white/70 text-xs mt-0.5">{active.subtitle}</p>
              </div>
              <button onClick={closeModal} className="absolute top-3 right-3 w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white transition-colors">
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {showForm ? (
                mSent ? (
                  <div className="text-center py-8">
                    <CheckCircle size={52} className="text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-[#0c4a6e] mb-2">Demande envoyée !</h3>
                    <p className="text-gray-500 text-sm mb-6">Notre équipe vous contactera sous 48h.</p>
                    <button onClick={closeModal} className="btn-primary justify-center">Fermer</button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setShowForm(false)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#0c4a6e] transition-colors">
                        <ChevronLeft size={16} /> Retour
                      </button>
                      <h3 className="font-bold text-[#0c4a6e] text-sm">Demande à <span className="text-[#c9a84c]">{active.title}</span></h3>
                    </div>
                    <form onSubmit={handleModalSubmit} className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div><label className="block text-xs font-semibold text-gray-600 mb-1">Prénom / Nom *</label>
                          <input type="text" required value={mForm.name} onChange={e => setMForm(f => ({ ...f, name: e.target.value }))} placeholder="Jean Kouamé" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" /></div>
                        <div><label className="block text-xs font-semibold text-gray-600 mb-1">Téléphone *</label>
                          <input type="tel" required value={mForm.phone} onChange={e => setMForm(f => ({ ...f, phone: e.target.value }))} placeholder="07 XX XX XX XX" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" /></div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div><label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                          <input type="email" value={mForm.email} onChange={e => setMForm(f => ({ ...f, email: e.target.value }))} placeholder="jean@email.com" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" /></div>
                        <div><label className="block text-xs font-semibold text-gray-600 mb-1">Secteur d'intérêt</label>
                          <select value={mForm.secteur} onChange={e => setMForm(f => ({ ...f, secteur: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c] bg-white">
                            <option value="">Sélectionner...</option>
                            {secteurs.map(s => <option key={s} value={s}>{s}</option>)}
                          </select></div>
                      </div>
                      <div><label className="block text-xs font-semibold text-gray-600 mb-1">Votre message *</label>
                        <textarea required value={mForm.message} onChange={e => setMForm(f => ({ ...f, message: e.target.value }))} rows={4} maxLength={500}
                          placeholder={`Décrivez votre besoin pour "${active.title}"...`}
                          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c] resize-none" />
                        <p className="text-xs text-gray-400 text-right">{mForm.message.length}/500</p></div>
                      <div className="flex gap-3">
                        <button type="submit" disabled={mSending} className="flex-1 btn-primary justify-center py-3 disabled:opacity-60">
                          {mSending ? <><Loader2 size={15} className="animate-spin" /> Envoi...</> : <>Envoyer <ArrowRight size={14} /></>}
                        </button>
                        <a href="tel:+2250747722931" className="flex items-center gap-2 border border-[#0c4a6e]/20 text-[#0c4a6e] text-sm font-semibold px-4 rounded-xl hover:bg-[#0c4a6e]/5 transition-colors"><Phone size={14} /></a>
                      </div>
                      <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-1"><Clock size={10} /> Réponse sous 48h é Gratuit & confidentiel</p>
                    </form>
                  </>
                )
              ) : (
                <>
                  {/* Description */}
                  <p className="text-sm text-gray-600 leading-relaxed">{active.longDesc}</p>

                  {/* Galerie */}
                  <div className="grid grid-cols-3 gap-2">
                    {active.gallery.map((img, i) => (
                      <div key={i} className={`rounded-xl overflow-hidden ${i === 0 ? "col-span-2" : ""}`}>
                        <img src={img} alt={active.title} className="w-full object-cover hover:scale-105 transition-transform duration-300" style={{ height: i === 0 ? "140px" : "67px" }} />
                      </div>
                    ))}
                  </div>

                  {/* Highlights */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {active.highlights.map(h => {
                      const HIcon = h.icon;
                      return (
                        <div key={h.label} className="bg-[#f8fafc] rounded-xl p-3 text-center border border-gray-100">
                          <HIcon size={18} className="text-[#c9a84c] mx-auto mb-1.5" />
                          <p className="text-[10px] text-gray-400 uppercase tracking-wide">{h.label}</p>
                          <p className="text-xs font-bold text-[#0c4a6e] mt-0.5 leading-tight">{h.value}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Inclus */}
                  <div>
                    <h4 className="text-sm font-bold text-[#0c4a6e] mb-3 flex items-center gap-2"><Check size={14} className="text-green-500" /> Ce qui est inclus</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {active.included.map(item => (
                        <div key={item} className="flex items-start gap-2 text-xs text-gray-600"><Check size={11} className="text-[#c9a84c] shrink-0 mt-0.5" /> {item}</div>
                      ))}
                    </div>
                  </div>

                  {/* Exemples */}
                  <div>
                    <h4 className="text-sm font-bold text-[#0c4a6e] mb-2">Exemples concrets</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {active.examples.map(ex => (
                        <span key={ex} className="text-xs bg-[#f0f9ff] text-[#0c4a6e] px-2.5 py-1 rounded-full border border-[#bae6fd] font-medium">{ex}</span>
                      ))}
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="flex gap-3 pt-2 border-t border-gray-100">
                    <button onClick={() => setShowForm(true)} className="flex-1 btn-primary justify-center text-sm py-2.5">
                      En savoir plus / Demander <ArrowRight size={14} />
                    </button>
                    <a href="tel:+2250747722931" className="flex items-center gap-2 border border-[#0c4a6e]/20 text-[#0c4a6e] text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#0c4a6e]/5 transition-colors">
                      <Phone size={14} /> Appeler
                    </a>
                  </div>
                  <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-1"><Clock size={10} /> Réponse sous 48h é Gratuit & confidentiel</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
