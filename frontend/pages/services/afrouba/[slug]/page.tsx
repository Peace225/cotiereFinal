"use client";
import { useState } from "react";
import { ArrowRight, CheckCircle, Phone, Clock, Loader2, ChevronLeft, Share2, Check } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const SUPPORTS: Record<string, {
  title: string; subtitle: string; image: string; price: string;
  description: string; included: string[]; process: { step: string; desc: string }[];
  targets: string[]; examples: string[];
}> = {
  "publicite-tv": {
    title: "Publicité TV",
    subtitle: "Spots diffusés sur CÔTIÈRE TV · Audience locale · Fort impact visuel",
    image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=1200&q=80",
    price: "À partir de 50 000 FCFA",
    description: "Diffusez votre message publicitaire sur CÔTIÈRE TV, la chaîne de référence du littoral ivoirien. Touchez des milliers de téléspectateurs dans les villes côtières avec un spot professionnel réalisé par notre équipe.",
    included: [
      "Réalisation du spot publicitaire (30s ou 60s)",
      "Tournage avec équipement professionnel",
      "Montage et habillage graphique",
      "Diffusion sur CÔTIÈRE TV",
      "Planning de diffusion personnalisé",
      "Rapport de diffusion",
      "Archive numérique du spot",
    ],
    process: [
      { step: "Brief créatif", desc: "Échange sur votre message, votre cible et vos objectifs" },
      { step: "Production", desc: "Tournage et montage de votre spot en 3-5 jours" },
      { step: "Validation", desc: "Vous validez le spot avant diffusion" },
      { step: "Diffusion", desc: "Votre spot passe à l'antenne selon le planning convenu" },
    ],
    targets: ["Commerces & boutiques", "Restaurants & hôtels", "PME locales", "Événements & galas", "Services professionnels", "Institutions"],
    examples: ["Spot 30s pour un restaurant", "Annonce d'ouverture de boutique", "Promotion d'un événement", "Campagne saisonnière"],
  },
  "publicite-radio": {
    title: "Publicité Radio",
    subtitle: "Jingles & annonces · Radios FM locales · Couverture du littoral",
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=1200&q=80",
    price: "À partir de 25 000 FCFA",
    description: "Faites entendre votre message sur les radios locales du littoral ivoirien. La radio reste le média le plus écouté en Côte d'Ivoire, notamment dans les zones côtières. Un jingle accrocheur peut transformer votre notoriété.",
    included: [
      "Création du jingle ou texte publicitaire",
      "Enregistrement en studio professionnel",
      "Voix off professionnelle",
      "Habillage musical",
      "Diffusion sur radios partenaires",
      "Passages garantis selon le pack choisi",
      "Rapport d'écoute",
    ],
    process: [
      { step: "Rédaction", desc: "Création du texte et du concept sonore" },
      { step: "Enregistrement", desc: "Session studio avec voix off et musique" },
      { step: "Validation", desc: "Écoute et approbation du jingle final" },
      { step: "Diffusion", desc: "Passages sur les radios selon le planning" },
    ],
    targets: ["Artisans & commerçants", "Pharmacies & cliniques", "Agences immobilières", "Écoles & formations", "Événements locaux", "Associations"],
    examples: ["Jingle pour une pharmacie", "Annonce de promotion commerciale", "Publicité pour une école", "Spot événementiel"],
  },
  "publicite-web": {
    title: "Publicité Web & Réseaux Sociaux",
    subtitle: "Facebook · Instagram · TikTok · Site CÔTIÈRE · Ciblage précis",
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1200&q=80",
    price: "À partir de 30 000 FCFA",
    description: "Touchez votre audience cible sur les réseaux sociaux et le web. Nos campagnes digitales sont optimisées pour le marché ivoirien avec un ciblage géographique précis sur le littoral et les grandes villes.",
    included: [
      "Création des visuels et contenus",
      "Campagne Facebook & Instagram sponsorisée",
      "Publication sur TikTok",
      "Bannière sur le site CÔTIÈRE",
      "Ciblage géographique (littoral ivoirien)",
      "Suivi des performances en temps réel",
      "Rapport détaillé (impressions, clics, portée)",
      "Optimisation continue de la campagne",
    ],
    process: [
      { step: "Stratégie", desc: "Définition de la cible, du budget et des objectifs" },
      { step: "Création", desc: "Design des visuels et rédaction des textes" },
      { step: "Lancement", desc: "Mise en ligne des campagnes sur toutes les plateformes" },
      { step: "Optimisation", desc: "Suivi quotidien et ajustements pour maximiser les résultats" },
    ],
    targets: ["E-commerce", "Restaurants & food", "Mode & beauté", "Immobilier", "Événements", "Recrutement"],
    examples: ["Campagne de lancement produit", "Promotion d'un restaurant", "Publicité pour un événement", "Génération de leads"],
  },
  "sms-whatsapp": {
    title: "SMS & WhatsApp Marketing",
    subtitle: "Messages ciblés · Base de 500+ contacts · Taux d'ouverture 95%",
    image: "https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=1200&q=80",
    price: "À partir de 15 000 FCFA",
    description: "Le SMS et WhatsApp sont les canaux de communication les plus directs et efficaces en Côte d'Ivoire. Avec un taux d'ouverture de 95%, vos messages atteignent directement votre cible dans les secondes qui suivent l'envoi.",
    included: [
      "Rédaction du message publicitaire",
      "Envoi SMS en masse (base CÔTIÈRE)",
      "Envoi WhatsApp avec image/vidéo",
      "Ciblage par zone géographique",
      "Ciblage par profil client",
      "Rapport d'envoi et de lecture",
      "Lien de suivi inclus",
    ],
    process: [
      { step: "Rédaction", desc: "Création du message court et percutant" },
      { step: "Ciblage", desc: "Sélection des contacts selon votre cible" },
      { step: "Envoi", desc: "Diffusion en masse à la date choisie" },
      { step: "Rapport", desc: "Statistiques d'envoi et de lecture" },
    ],
    targets: ["Promotions flash", "Ouvertures de boutiques", "Événements & concerts", "Offres spéciales", "Rappels de rendez-vous", "Fidélisation clients"],
    examples: ["Promo -30% ce weekend", "Invitation à un événement", "Annonce d'ouverture", "Offre exclusive abonnés"],
  },
  "affichage-flyers": {
    title: "Affichage & Flyers",
    subtitle: "Conception · Impression · Distribution · Pose d'affiches",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
    price: "À partir de 20 000 FCFA",
    description: "Supports print professionnels conçus et imprimés par notre équipe. Flyers, affiches, banderoles, kakémonos — nous gérons tout de la conception à la distribution sur le terrain dans les villes du littoral.",
    included: [
      "Conception graphique professionnelle",
      "Retouches illimitées jusqu'à validation",
      "Impression haute qualité",
      "Flyers A5 ou A4 (500 à 5000 exemplaires)",
      "Affiches A3/A2/A1",
      "Banderoles et kakémonos",
      "Distribution sur le terrain (option)",
      "Pose d'affiches dans les points stratégiques",
    ],
    process: [
      { step: "Brief design", desc: "Échange sur le style, les couleurs et le message" },
      { step: "Maquette", desc: "Création du visuel en 24-48h" },
      { step: "Validation", desc: "Approbation du design final" },
      { step: "Impression & livraison", desc: "Impression et livraison sous 3-5 jours" },
    ],
    targets: ["Commerces & boutiques", "Restaurants", "Événements & galas", "Campagnes politiques", "ONG & associations", "Établissements scolaires"],
    examples: ["Flyers pour un restaurant", "Affiche de concert", "Banderole d'inauguration", "Kakémono pour salon"],
  },
  "sponsoring-evenements": {
    title: "Sponsoring d'Événements",
    subtitle: "Concerts · Galas · Foires · Marchés · Événements CÔTIÈRE",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=80",
    price: "Sur devis",
    description: "Associez votre marque aux événements les plus populaires du littoral ivoirien. CÔTIÈRE organise et co-organise des concerts, galas, foires et marchés qui rassemblent des milliers de personnes. Une visibilité incomparable pour votre entreprise.",
    included: [
      "Logo sur tous les supports de communication",
      "Mention dans les annonces radio et TV",
      "Stand ou espace dédié sur le lieu",
      "Prise de parole lors de l'événement (option)",
      "Publication sur les réseaux sociaux CÔTIÈRE",
      "Photos et vidéos de l'événement",
      "Rapport de visibilité post-événement",
      "Accès VIP pour votre équipe",
    ],
    process: [
      { step: "Sélection", desc: "Choix de l'événement adapté à votre cible" },
      { step: "Contrat", desc: "Signature du contrat de sponsoring" },
      { step: "Intégration", desc: "Votre marque intégrée dans tous les supports" },
      { step: "Événement", desc: "Présence et visibilité le jour J" },
    ],
    targets: ["Grandes entreprises", "Banques & assurances", "Opérateurs télécom", "Brasseries & boissons", "Immobilier", "Institutions publiques"],
    examples: ["Sponsor principal d'un concert", "Partenaire d'une foire commerciale", "Sponsor d'un gala de remise de prix", "Partenaire d'un marché artisanal"],
  },
};

export default function SupportDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const support = SUPPORTS[slug];

  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", email: "", budget: "", description: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const title = `${support?.title} — Tout Le Monde A Droit À La Pub | CÔTIÈRE`;
    try {
      if (navigator.share) { navigator.share({ title, url }).catch(() => {}); return; }
    } catch {}
    navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); }).catch(() => {});
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/afrouba", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientFirstName: form.firstName,
          clientLastName: form.lastName,
          clientPhone: form.phone,
          clientEmail: form.email,
          documentType: support?.title ?? slug,
          description: `Budget: ${form.budget || "Non précisé"} | ${form.description}`,
        }),
      });
      const msg = encodeURIComponent(
        `DEMANDE PUBLICITÉ — ${support?.title}\n\n*Client:* ${form.firstName} ${form.lastName}\n*Tel:* ${form.phone}\n*Budget:* ${form.budget || "Non précisé"}\n*Détails:* ${form.description || "Aucun"}\n\n-- CÔTIÈRE MEDIA GROUP\nTel: 07 47 72 29 31`
      );
      window.open(`https://wa.me/2250747722931?text=${msg}`, "_blank");
      setSent(true);
    } catch {}
    setLoading(false);
  }

  if (!support) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#0c4a6e] mb-4">Support introuvable</h1>
          <Link href="/services/afrouba" className="btn-primary">Retour aux supports</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative text-white py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src={support.image} alt={support.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/services/afrouba" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6 transition-colors">
            <ChevronLeft size={16} /> Retour aux supports
          </Link>
          <div className="max-w-2xl">
            <span className="bg-[#c9a84c] text-white text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block">
              Tout Le Monde A Droit À La Pub
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3 mb-4">{support.title}</h1>
            <p className="text-white/80 text-sm mb-4">{support.subtitle}</p>
            <p className="text-gray-100 text-lg leading-relaxed mb-6">{support.description}</p>
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-2xl font-black text-[#c9a84c]">{support.price}</span>
              <a href="#demande" className="btn-primary">
                Demander un devis <ArrowRight size={18} />
              </a>
              <button onClick={handleShare}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm">
                {copied ? <Check size={16} className="text-green-400" /> : <Share2 size={16} />}
                {copied ? "Lien copié !" : "Partager"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Ce qui est inclus */}
      <section className="py-16 bg-[#f0f9ff]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest">Inclus dans ce support</span>
              <h2 className="section-title mt-2 mb-6">Ce que vous obtenez</h2>
              <ul className="space-y-3">
                {support.included.map(item => (
                  <li key={item} className="flex items-start gap-3 text-gray-700 text-sm">
                    <CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest">Pour qui ?</span>
              <h2 className="section-title mt-2 mb-6">Cibles idéales</h2>
              <div className="flex flex-wrap gap-2 mb-8">
                {support.targets.map(t => (
                  <span key={t} className="bg-white border border-[#bae6fd] text-[#0c4a6e] text-xs font-medium px-3 py-1.5 rounded-full">{t}</span>
                ))}
              </div>
              <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest">Exemples d'utilisation</span>
              <ul className="mt-3 space-y-2">
                {support.examples.map(ex => (
                  <li key={ex} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 bg-[#c9a84c] rounded-full shrink-0" /> {ex}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Processus */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-center mb-12">Notre processus</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {support.process.map((p, i) => (
              <div key={p.step} className="text-center">
                <div className="w-14 h-14 bg-[#c9a84c] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">{i + 1}</div>
                <h3 className="font-semibold text-[#0c4a6e] mb-2">{p.step}</h3>
                <p className="text-gray-500 text-sm">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulaire */}
      <section id="demande" className="py-16 bg-[#f0f9ff]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="section-title">Demander un devis</h2>
            <p className="text-gray-500 mt-2">Pour <strong>{support.title}</strong> — réponse sous 24h.</p>
          </div>
          {sent ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
              <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
              <h3 className="font-bold text-[#0c4a6e] text-lg mb-2">Demande envoyée !</h3>
              <p className="text-gray-500 text-sm mb-4">Notre équipe vous contactera sous 24h avec un devis personnalisé.</p>
              <Link href="/services/afrouba" className="btn-primary justify-center">Voir tous les supports</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Prénom *</label>
                  <input required type="text" placeholder="Jean" value={form.firstName}
                    onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Nom *</label>
                  <input required type="text" placeholder="Kouamé" value={form.lastName}
                    onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Téléphone *</label>
                  <input required type="tel" placeholder="07 XX XX XX XX" value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" placeholder="jean@email.com" value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Budget estimé</label>
                <select value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c] bg-white">
                  <option value="">Sélectionner...</option>
                  <option>Moins de 50 000 FCFA</option>
                  <option>50 000 – 150 000 FCFA</option>
                  <option>150 000 – 500 000 FCFA</option>
                  <option>Plus de 500 000 FCFA</option>
                  <option>À définir ensemble</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Décrivez votre projet *</label>
                <textarea required rows={3} placeholder={`Décrivez votre activité et ce que vous souhaitez promouvoir via ${support.title}...`}
                  value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c] resize-none" />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60">
                {loading ? <><Loader2 size={15} className="animate-spin" /> Envoi...</> : <>Envoyer ma demande <ArrowRight size={16} /></>}
              </button>
              <button type="button" onClick={handleShare}
                className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-gray-600 border border-gray-200 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                {copied ? <Check size={15} className="text-green-500" /> : <Share2 size={15} />}
                {copied ? "Lien copié !" : "Partager ce support"}
              </button>
              <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-1">
                <Clock size={10} /> Réponse sous 24h · Devis gratuit & sans engagement
              </p>
            </form>
          )}
        </div>
      </section>

      {/* Autres supports */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="font-bold text-[#0c4a6e] mb-6 text-center">Découvrir nos autres supports</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(SUPPORTS).filter(([s]) => s !== slug).map(([s, sup]) => (
              <Link key={s} href={`/services/afrouba/${s}`}
                className="group relative rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="relative h-28">
                  <img src={sup.image} alt={sup.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <p className="absolute bottom-2 left-3 right-3 text-white text-xs font-semibold leading-tight">{sup.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
