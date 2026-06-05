"use client";
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight, CheckCircle, ChevronLeft, Loader2, Clock, Tv, Radio, Globe, Smartphone, Star, Users, Megaphone, Phone, Share2, Check } from "lucide-react";

const PACKS: Record<string, {
  label: string; price: string; desc: string; featured: boolean;
  image: string; tagline: string; fullDesc: string;
  included: { title: string; detail: string }[];
  bonus: string[];
  process: { step: string; desc: string }[];
  targets: string[];
  faq: { q: string; a: string }[];
}> = {
  "pack-starter": {
    label: "Pack Starter",
    price: "75 000 FCFA",
    desc: "Idéal pour les petits commerces et artisans",
    featured: false,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
    tagline: "Lancez votre visibilité sans vous ruiner",
    fullDesc: "Le Pack Starter est conçu pour les petits commerces, artisans et indépendants qui souhaitent se faire connaître sur le littoral ivoirien avec un budget maîtrisé. En combinant radio et réseaux sociaux, vous touchez à la fois les auditeurs locaux et les internautes de votre zone.",
    included: [
      { title: "1 spot radio (30s) × 10 passages", detail: "Votre jingle diffusé 10 fois sur les radios partenaires du littoral sur une durée de 7 jours." },
      { title: "1 post sponsorisé Facebook/Instagram", detail: "Une publication boostée ciblant les habitants de votre ville et des environs, pendant 7 jours." },
      { title: "Conception du visuel incluse", detail: "Notre équipe crée votre visuel publicitaire (affiche, bannière) sans frais supplémentaires." },
    ],
    bonus: ["Conseil stratégique offert", "Rapport de diffusion radio", "Statistiques du post sponsorisé"],
    process: [
      { step: "Commande", desc: "Vous remplissez le formulaire avec votre activité et vos objectifs." },
      { step: "Brief créatif", desc: "Notre équipe vous contacte sous 24h pour le brief." },
      { step: "Production", desc: "Création du jingle et du visuel en 2-3 jours." },
      { step: "Diffusion", desc: "Lancement de la campagne radio + réseaux sociaux." },
    ],
    targets: ["Artisans & commerçants", "Restaurants & maquis", "Coiffeurs & salons", "Boutiques de mode", "Prestataires de services", "Auto-entrepreneurs"],
    faq: [
      { q: "Puis-je choisir les horaires de diffusion radio ?", a: "Oui, nous vous proposons des créneaux matin, midi ou soir selon votre cible." },
      { q: "Le visuel est-il utilisable ailleurs ?", a: "Oui, vous recevez le fichier source pour l'utiliser sur vos propres réseaux." },
      { q: "Combien de temps dure la campagne ?", a: "7 jours pour la radio et 7 jours pour le post sponsorisé." },
      { q: "Peut-on renouveler le pack ?", a: "Oui, avec une remise de 10% à partir du 2ème renouvellement." },
    ],
  },
  "pack-visibilite": {
    label: "Pack Visibilité",
    price: "200 000 FCFA",
    desc: "Pour les PME et commerçants du littoral",
    featured: true,
    image: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=1200&q=80",
    tagline: "La solution complète pour dominer votre marché local",
    fullDesc: "Le Pack Visibilité est notre offre la plus populaire. Il combine TV, radio, réseaux sociaux et SMS marketing pour une présence maximale sur tous les canaux. Idéal pour les PME qui veulent s'imposer comme référence dans leur secteur sur le littoral ivoirien.",
    included: [
      { title: "1 spot TV (30s) × 5 passages", detail: "Votre publicité diffusée 5 fois sur CÔTIÈRE TV, la chaîne locale du littoral." },
      { title: "1 spot radio × 20 passages", detail: "Votre jingle diffusé 20 fois sur les radios partenaires sur 14 jours." },
      { title: "Campagne réseaux sociaux 7 jours", detail: "Posts sponsorisés sur Facebook, Instagram et TikTok avec ciblage géographique précis." },
      { title: "SMS marketing 500 contacts", detail: "Envoi d'un SMS promotionnel à 500 contacts ciblés de notre base de données du littoral." },
      { title: "Conception complète incluse", detail: "Spot TV, jingle radio, visuels réseaux sociaux et texte SMS — tout est créé par notre équipe." },
    ],
    bonus: ["Rapport complet de campagne", "Statistiques détaillées", "Conseil stratégique offert", "1 révision gratuite sur les créatifs"],
    process: [
      { step: "Commande", desc: "Formulaire de commande avec description de votre activité." },
      { step: "Brief & stratégie", desc: "Réunion (présentiel ou WhatsApp) pour définir le message et la cible." },
      { step: "Production", desc: "Tournage spot TV, enregistrement radio, création visuels en 5-7 jours." },
      { step: "Lancement", desc: "Diffusion simultanée sur tous les canaux." },
      { step: "Rapport", desc: "Rapport de campagne envoyé en fin de diffusion." },
    ],
    targets: ["PME & entreprises locales", "Hôtels & restaurants", "Agences immobilières", "Cliniques & pharmacies", "Écoles & formations", "Grandes surfaces & supermarchés"],
    faq: [
      { q: "Peut-on personnaliser les canaux inclus ?", a: "Oui, nous pouvons adapter le mix selon vos besoins spécifiques." },
      { q: "Quelle est la durée totale de la campagne ?", a: "14 jours de diffusion complète sur tous les canaux." },
      { q: "Le spot TV est-il réalisé par votre équipe ?", a: "Oui, notre équipe HBL Studio+ s'occupe du tournage et du montage." },
      { q: "Peut-on cibler une ville spécifique ?", a: "Oui, le ciblage géographique est personnalisable par ville ou zone." },
    ],
  },
  "pack-premium": {
    label: "Pack Premium",
    price: "Sur devis",
    desc: "Pour les grandes entreprises et institutions",
    featured: false,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
    tagline: "Une présence médiatique totale et sur mesure",
    fullDesc: "Le Pack Premium est notre offre haut de gamme, entièrement personnalisée selon vos objectifs et votre budget. Conçu pour les grandes entreprises, institutions et marques qui veulent une présence médiatique totale et durable sur le littoral ivoirien et au-delà.",
    included: [
      { title: "Campagne multi-supports illimitée", detail: "TV, radio, web, SMS, affichage — tous les canaux activés selon votre stratégie." },
      { title: "Spot TV + Radio + Web", detail: "Production professionnelle de tous vos contenus publicitaires." },
      { title: "Affichage physique", detail: "Pose d'affiches et banderoles dans les points stratégiques des villes du littoral." },
      { title: "Reporting mensuel", detail: "Rapport détaillé chaque mois avec KPIs, statistiques et recommandations." },
      { title: "Accompagnement stratégique", detail: "Un consultant dédié pour piloter votre stratégie de communication tout au long de la campagne." },
    ],
    bonus: ["Consultant dédié", "Accès prioritaire aux événements CÔTIÈRE", "Sponsoring d'événements inclus", "Relations presse", "Contenu éditorial sur le site CÔTIÈRE"],
    process: [
      { step: "Audit", desc: "Analyse de votre marque, vos objectifs et votre marché." },
      { step: "Stratégie", desc: "Élaboration d'un plan de communication sur mesure." },
      { step: "Production", desc: "Création de tous les contenus publicitaires." },
      { step: "Déploiement", desc: "Lancement coordonné sur tous les canaux." },
      { step: "Suivi", desc: "Reporting mensuel et optimisation continue." },
    ],
    targets: ["Grandes entreprises", "Banques & assurances", "Opérateurs télécom", "Institutions publiques", "ONG & organisations internationales", "Marques nationales"],
    faq: [
      { q: "Comment est calculé le devis ?", a: "Le devis est établi selon vos objectifs, la durée de la campagne et les canaux choisis." },
      { q: "Quelle est la durée minimale d'engagement ?", a: "Nous recommandons un minimum de 3 mois pour des résultats optimaux." },
      { q: "Peut-on inclure des événements ?", a: "Oui, le sponsoring d'événements CÔTIÈRE est inclus dans ce pack." },
      { q: "Y a-t-il un consultant dédié ?", a: "Oui, un consultant CÔTIÈRE est assigné à votre compte pour toute la durée." },
    ],
  },
};

export default function PackDetailPage() {
  const params = useParams();
  const packSlug = params?.pack as string;
  const pack = PACKS[packSlug];

  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", email: "", description: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const title = `${pack?.label} — Tout Le Monde A Droit À La Pub | CÔTIÈRE`;
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
          documentType: pack?.label ?? packSlug,
          description: form.description,
        }),
      });
      const msg = encodeURIComponent(
        `COMMANDE — ${pack?.label}\n\n*Client:* ${form.firstName} ${form.lastName}\n*Tel:* ${form.phone}\n*Email:* ${form.email || "Non renseigné"}\n*Activité:* ${form.description || "Non précisé"}\n\n-- CÔTIÈRE MEDIA GROUP\nTel: 07 47 72 29 31`
      );
      window.open(`https://wa.me/2250747722931?text=${msg}`, "_blank");
      setSent(true);
    } catch {}
    setLoading(false);
  }

  if (!pack) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#0c4a6e] mb-4">Pack introuvable</h1>
          <Link href="/services/afrouba" className="btn-primary">Retour aux packs</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">

      {/* Hero */}
      <section className="relative text-white py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src={pack.image} alt={pack.label} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/20" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/services/afrouba" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6 transition-colors">
            <ChevronLeft size={16} /> Retour aux packs
          </Link>
          <div className="max-w-2xl">
            {pack.featured && (
              <span className="bg-[#c9a84c] text-white text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block">⭐ Le plus populaire</span>
            )}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3 mb-2">{pack.label}</h1>
            <p className="text-[#c9a84c] font-semibold text-xl mb-3">{pack.price}</p>
            <p className="text-white/80 text-sm mb-3 italic">"{pack.tagline}"</p>
            <p className="text-gray-100 text-base leading-relaxed mb-6">{pack.fullDesc}</p>
            <div className="flex gap-3 flex-wrap">
              <a href="#commander" className="btn-primary">
                Commander ce pack <ArrowRight size={18} />
              </a>
              <a href="tel:+2250747722931"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
                <Phone size={16} /> Nous appeler
              </a>
              <button onClick={handleShare}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
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
          <div className="text-center mb-10">
            <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest">Contenu du pack</span>
            <h2 className="section-title mt-2">Ce qui est inclus</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pack.included.map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex gap-4">
                <div className="w-10 h-10 bg-[#c9a84c]/10 rounded-xl flex items-center justify-center shrink-0">
                  <CheckCircle size={20} className="text-[#c9a84c]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0c4a6e] text-sm mb-1">{item.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bonus */}
          <div className="mt-8 bg-[#0c4a6e] rounded-2xl p-6 text-white">
            <h3 className="font-bold text-[#c9a84c] mb-4 flex items-center gap-2">
              <Star size={16} className="text-[#c9a84c]" /> Bonus inclus
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {pack.bonus.map(b => (
                <div key={b} className="flex items-center gap-2 text-sm text-white/80">
                  <span className="w-1.5 h-1.5 bg-[#c9a84c] rounded-full shrink-0" /> {b}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Processus */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest">Étapes</span>
            <h2 className="section-title mt-2">Comment ça se passe ?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {pack.process.map((p, i) => (
              <div key={p.step} className="text-center">
                <div className="w-12 h-12 bg-[#c9a84c] text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold shadow-md">{i + 1}</div>
                <h3 className="font-bold text-[#0c4a6e] text-sm mb-1">{p.step}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cibles + FAQ */}
      <section className="py-16 bg-[#f0f9ff]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Cibles */}
            <div>
              <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest">Pour qui ?</span>
              <h2 className="section-title mt-2 mb-6">Ce pack est fait pour vous si...</h2>
              <div className="space-y-3">
                {pack.targets.map(t => (
                  <div key={t} className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100">
                    <Users size={16} className="text-[#c9a84c] shrink-0" />
                    <span className="text-sm text-gray-700 font-medium">{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div>
              <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest">Questions fréquentes</span>
              <h2 className="section-title mt-2 mb-6">FAQ</h2>
              <div className="space-y-4">
                {pack.faq.map(f => (
                  <div key={f.q} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <p className="font-semibold text-[#0c4a6e] text-sm mb-1">{f.q}</p>
                    <p className="text-gray-500 text-xs leading-relaxed">{f.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparaison des packs */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="font-bold text-[#0c4a6e] text-center mb-6">Comparer les packs</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(PACKS).map(([slug, p]) => (
              <Link key={slug} href={`/services/afrouba/packs/${slug}`}
                className={`rounded-2xl p-5 border transition-all hover:shadow-md ${slug === packSlug ? "border-[#c9a84c] ring-2 ring-[#c9a84c]/30 bg-[#fffbf0]" : "border-gray-100 bg-white hover:border-[#c9a84c]/40"}`}>
                {p.featured && <span className="bg-[#c9a84c] text-white text-xs font-bold px-2 py-0.5 rounded-full mb-2 inline-block">Populaire</span>}
                <h4 className="font-bold text-[#0c4a6e] mb-1">{p.label}</h4>
                <p className="text-[#c9a84c] font-black text-lg mb-1">{p.price}</p>
                <p className="text-gray-400 text-xs mb-3">{p.desc}</p>
                {slug === packSlug ? (
                  <span className="text-xs text-[#c9a84c] font-semibold">Pack actuel ✓</span>
                ) : (
                  <span className="text-xs text-[#0c4a6e] font-semibold flex items-center gap-1">Voir ce pack <ArrowRight size={11} /></span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Formulaire de commande */}
      <section id="commander" className="py-16 bg-[#f0f9ff]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest">Commander</span>
            <h2 className="section-title mt-2">Démarrer avec le {pack.label}</h2>
            <p className="text-gray-500 mt-2 text-sm">Remplissez ce formulaire — notre équipe vous contacte sous 24h.</p>
          </div>

          {sent ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-500" />
              </div>
              <h3 className="font-bold text-[#0c4a6e] text-lg mb-2">Commande envoyée !</h3>
              <p className="text-gray-500 text-sm mb-2">Votre demande pour le <strong>{pack.label}</strong> a bien été reçue.</p>
              <p className="text-gray-400 text-xs mb-6">Notre équipe vous contactera sous 24h pour confirmer et démarrer votre campagne.</p>
              <Link href="/services/afrouba" className="btn-primary justify-center">Retour aux packs</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
              <div className="bg-[#fffbf0] border border-[#c9a84c]/30 rounded-xl px-4 py-3 text-sm text-[#0c4a6e] font-medium">
                Pack sélectionné : <strong className="text-[#c9a84c]">{pack.label} — {pack.price}</strong>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Prénom *</label>
                  <input required type="text" placeholder="Jean" value={form.firstName}
                    onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Nom *</label>
                  <input required type="text" placeholder="Kouamé" value={form.lastName}
                    onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Téléphone *</label>
                  <input required type="tel" placeholder="07 XX XX XX XX" value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                  <input type="email" placeholder="jean@email.com" value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Décrivez votre activité / ce que vous souhaitez promouvoir *</label>
                <textarea required rows={4}
                  placeholder="Ex: Je tiens un restaurant à Grand-Lahou, je veux promouvoir mon menu du jour et attirer plus de clients le weekend..."
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c] resize-none" />
              </div>

              <button type="submit" disabled={loading}
                className="btn-primary w-full justify-center py-3 font-bold disabled:opacity-60 shadow-md">
                {loading
                  ? <><Loader2 size={15} className="animate-spin" /> Envoi en cours...</>
                  : <>Confirmer ma commande <ArrowRight size={16} /></>}
              </button>
              <button type="button" onClick={handleShare}
                className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-gray-600 border border-gray-200 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                {copied ? <Check size={15} className="text-green-500" /> : <Share2 size={15} />}
                {copied ? "Lien copié !" : "Partager ce pack"}
              </button>
              <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-1">
                <Clock size={10} /> Réponse sous 24h · Devis gratuit & sans engagement immédiat
              </p>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
