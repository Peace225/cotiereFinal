"use client";
import { useState } from "react";
import Link from "next/link";
import { CheckCircle, ArrowRight, Megaphone, Tv, Radio, Smartphone, Globe, Star, Users, TrendingUp, Loader2 } from "lucide-react";

const supports = [
  {
    slug: "publicite-tv",
    icon: <Tv size={22} />,
    title: "Publicité TV",
    desc: "Spots publicitaires diffusés sur CÔTIÈRE TV, la chaîne locale du littoral ivoirien.",
    price: "À partir de 50 000 FCFA",
    color: "bg-blue-50 text-blue-600",
    image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600&q=80",
  },
  {
    slug: "publicite-radio",
    icon: <Radio size={22} />,
    title: "Publicité Radio",
    desc: "Jingles et annonces sur les radios locales du littoral (FM, communautaires).",
    price: "À partir de 25 000 FCFA",
    color: "bg-purple-50 text-purple-600",
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=600&q=80",
  },
  {
    slug: "publicite-web",
    icon: <Globe size={22} />,
    title: "Publicité Web & Réseaux",
    desc: "Campagnes sur Facebook, Instagram, TikTok et le site CÔTIÈRE.",
    price: "À partir de 30 000 FCFA",
    color: "bg-green-50 text-green-600",
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80",
  },
  {
    slug: "sms-whatsapp",
    icon: <Smartphone size={22} />,
    title: "SMS & WhatsApp Marketing",
    desc: "Envoi de messages promotionnels ciblés à notre base de clients du littoral.",
    price: "À partir de 15 000 FCFA",
    color: "bg-orange-50 text-orange-600",
    image: "https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=600&q=80",
  },
  {
    slug: "affichage-flyers",
    icon: <Star size={22} />,
    title: "Affichage & Flyers",
    desc: "Conception et impression de supports print : affiches, flyers, banderoles.",
    price: "À partir de 20 000 FCFA",
    color: "bg-yellow-50 text-yellow-600",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  },
  {
    slug: "sponsoring-evenements",
    icon: <Users size={22} />,
    title: "Sponsoring d'événements",
    desc: "Visibilité lors des événements CÔTIÈRE : concerts, galas, foires, marchés.",
    price: "Sur devis",
    color: "bg-red-50 text-red-600",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80",
  },
];

const packs = [
  {
    label: "Pack Starter",
    price: "75 000 FCFA",
    desc: "Idéal pour les petits commerces et artisans",
    included: ["1 spot radio (30s) × 10 passages", "1 post sponsorisé Facebook/Instagram", "Conception du visuel incluse"],
    featured: false,
  },
  {
    label: "Pack Visibilité",
    price: "200 000 FCFA",
    desc: "Pour les PME et commerçants du littoral",
    included: ["1 spot TV (30s) × 5 passages", "1 spot radio × 20 passages", "Campagne réseaux sociaux 7 jours", "SMS marketing 500 contacts", "Conception complète incluse"],
    featured: true,
  },
  {
    label: "Pack Premium",
    price: "Sur devis",
    desc: "Pour les grandes entreprises et institutions",
    included: ["Campagne multi-supports illimitée", "Spot TV + Radio + Web", "Affichage physique", "Reporting mensuel", "Accompagnement stratégique"],
    featured: false,
  },
];

const etapes = [
  { num: "01", title: "Contactez-nous", desc: "Décrivez votre activité et vos objectifs de visibilité." },
  { num: "02", title: "Devis personnalisé", desc: "Nous vous proposons un plan de communication adapté à votre budget." },
  { num: "03", title: "Création des supports", desc: "Notre équipe crée vos visuels, spots et contenus publicitaires." },
  { num: "04", title: "Diffusion & suivi", desc: "Vos publicités sont diffusées et nous vous envoyons un rapport." },
];

export default function AfroubaPage() {
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", email: "", support: "", budget: "", description: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  const [packSent, setPackSent] = useState(false);
  const [packLoading, setPackLoading] = useState(false);
  const [packForm, setPackForm] = useState({ firstName: "", lastName: "", phone: "", email: "", description: "" });

  function openPackModal(packLabel: string) {
    setSelectedPack(packLabel);
    setPackSent(false);
    setPackForm({ firstName: "", lastName: "", phone: "", email: "", description: "" });
  }

  async function handlePackSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPackLoading(true);
    try {
      await fetch("/api/afrouba", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientFirstName: packForm.firstName,
          clientLastName: packForm.lastName,
          clientPhone: packForm.phone,
          clientEmail: packForm.email,
          documentType: selectedPack,
          description: packForm.description,
        }),
      });
      const msg = encodeURIComponent(
        `COMMANDE PACK PUBLICITAIRE\n\n*Pack choisi:* ${selectedPack}\n*Client:* ${packForm.firstName} ${packForm.lastName}\n*Tel:* ${packForm.phone}\n*Email:* ${packForm.email || "Non renseigné"}\n*Détails:* ${packForm.description || "Aucun"}\n\n-- CÔTIÈRE MEDIA GROUP\nTel: 07 47 72 29 31`
      );
      window.open(`https://wa.me/2250747722931?text=${msg}`, "_blank");
      setPackSent(true);
    } catch {}
    setPackLoading(false);
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
          documentType: form.support,
          description: `Budget: ${form.budget || "Non précisé"} | ${form.description}`,
        }),
      });
      const msg = encodeURIComponent(
        `DEMANDE PUBLICITÉ — Tout Le Monde A Droit À La Pub\n\n*Client:* ${form.firstName} ${form.lastName}\n*Tel:* ${form.phone}\n*Support souhaité:* ${form.support}\n*Budget:* ${form.budget || "Non précisé"}\n*Détails:* ${form.description || "Aucun"}\n\n-- CÔTIÈRE MEDIA GROUP\nTel: 07 47 72 29 31`
      );
      window.open(`https://wa.me/2250747722931?text=${msg}`, "_blank");
      setSent(true);
    } catch {}
    setLoading(false);
  }

  return (
    <div className="min-h-screen">

      {/* Hero */}
      <section className="relative text-white py-16 overflow-hidden min-h-[280px]">
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mt-2 mb-4">Tout Le Monde A Droit À La Pub</h1>
              <p className="text-gray-100 text-lg leading-relaxed">
                Nous vous donnons de la visibilité — TV, Radio, Web, SMS, Affichage et Événements sur le littoral ivoirien.
              </p>
              <a href="#demande" className="btn-primary mt-8 inline-flex">
                Demander un devis <ArrowRight size={18} />
              </a>
            </div>
            <div className="shrink-0 w-64 md:w-80 lg:w-96">
              <img src="/Images/pub.jpeg" alt="Tout le monde a droit à la pub" className="w-full h-auto object-contain mix-blend-multiply" />
            </div>
          </div>
        </div>
      </section>

      {/* Nos supports publicitaires */}
      <section className="py-16 bg-[#f0f9ff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest">Supports disponibles</span>
            <h2 className="section-title mt-2">Nos solutions publicitaires</h2>
            <p className="text-gray-500 mt-2 max-w-xl mx-auto">Choisissez le support qui correspond à votre activité et votre budget.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {supports.map((s) => (
              <Link key={s.title} href={`/services/afrouba/${s.slug}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  <img src={s.image} alt={s.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div className={`absolute top-3 left-3 w-9 h-9 ${s.color} rounded-xl flex items-center justify-center shadow-sm`}>
                    {s.icon}
                  </div>
                  <span className="absolute bottom-3 right-3 bg-[#c9a84c] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    {s.price}
                  </span>
                </div>
                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-[#0c4a6e] mb-1">{s.title}</h3>
                  <p className="text-gray-500 text-sm mb-3 leading-relaxed">{s.desc}</p>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#c9a84c] group-hover:gap-2 transition-all">
                    En savoir plus <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Packs */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest">Nos offres</span>
            <h2 className="section-title mt-2">Packs publicitaires</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packs.map((p) => (
              <div key={p.label} className={`rounded-2xl p-6 border ${p.featured ? "border-[#c9a84c] ring-2 ring-[#c9a84c]/30 bg-[#fffbf0]" : "border-gray-100 bg-white"} shadow-sm`}>
                {p.featured && <span className="bg-[#c9a84c] text-white text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block">Populaire</span>}
                <h3 className="font-bold text-[#0c4a6e] text-lg mb-1">{p.label}</h3>
                <p className="text-2xl font-black text-[#c9a84c] mb-1">{p.price}</p>
                <p className="text-gray-400 text-xs mb-4">{p.desc}</p>
                <ul className="space-y-2 mb-5">
                  {p.included.map(item => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle size={14} className="text-green-500 shrink-0 mt-0.5" /> {item}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => openPackModal(p.label)}
                  className="btn-primary w-full justify-center text-sm py-3 font-bold shadow-md hover:shadow-lg transition-shadow">
                  Commander ce pack <ArrowRight size={14} />
                </button>
                <Link href={`/services/afrouba/packs/${p.label === "Pack Starter" ? "pack-starter" : p.label === "Pack Visibilité" ? "pack-visibilite" : "pack-premium"}`}
                  className="mt-2 w-full flex items-center justify-center gap-1 text-sm font-semibold text-[#0c4a6e] border border-[#0c4a6e]/20 rounded-xl py-2.5 hover:bg-[#0c4a6e]/5 transition-colors">
                  Voir le détail <ArrowRight size={13} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chiffres clés */}
      <section className="py-12 bg-[#0c4a6e] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "500+", label: "Clients servis", icon: <Users size={20} /> },
              { value: "6", label: "Villes couvertes", icon: <Globe size={20} /> },
              { value: "11", label: "Supports médias", icon: <Megaphone size={20} /> },
              { value: "98%", label: "Satisfaction client", icon: <TrendingUp size={20} /> },
            ].map(s => (
              <div key={s.label}>
                <div className="flex justify-center mb-2 text-[#c9a84c]">{s.icon}</div>
                <p className="text-3xl font-black text-[#c9a84c]">{s.value}</p>
                <p className="text-white/70 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="py-16 bg-[#f0f9ff]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-center mb-12">Comment ça marche ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {etapes.map((e) => (
              <div key={e.num} className="text-center">
                <div className="w-14 h-14 bg-[#c9a84c] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">{e.num}</div>
                <h3 className="font-semibold text-[#0c4a6e] mb-2">{e.title}</h3>
                <p className="text-gray-500 text-sm">{e.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulaire de demande */}
      <section id="demande" className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="section-title">Demander un devis</h2>
            <p className="text-gray-500 mt-2">Remplissez le formulaire, nous vous répondons sous 24h.</p>
          </div>
          {sent ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-500" />
              </div>
              <h3 className="font-bold text-[#0c4a6e] text-lg mb-2">Demande envoyée !</h3>
              <p className="text-gray-500 text-sm">Notre équipe vous contactera sous 24h avec un devis personnalisé.</p>
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
                <label className="block text-xs font-medium text-gray-700 mb-1">Support publicitaire souhaité *</label>
                <select required value={form.support} onChange={e => setForm(f => ({ ...f, support: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c] bg-white">
                  <option value="">Sélectionner...</option>
                  <option>Publicité TV</option>
                  <option>Publicité Radio</option>
                  <option>Publicité Web & Réseaux sociaux</option>
                  <option>SMS & WhatsApp Marketing</option>
                  <option>Affichage & Flyers</option>
                  <option>Sponsoring d'événements</option>
                  <option>Pack Starter</option>
                  <option>Pack Visibilité</option>
                  <option>Pack Premium (sur devis)</option>
                  <option>Autre / Combinaison</option>
                </select>
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
                <label className="block text-xs font-medium text-gray-700 mb-1">Décrivez votre activité / projet *</label>
                <textarea required rows={3} placeholder="Ex: Je vends des produits alimentaires à Grand-Lahou et je veux faire connaître mon commerce..." value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c] resize-none" />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60">
                {loading ? <><Loader2 size={15} className="animate-spin" /> Envoi...</> : <>Envoyer ma demande <ArrowRight size={16} /></>}
              </button>
              <p className="text-xs text-gray-400 text-center">Réponse sous 24h · Devis gratuit & sans engagement</p>
            </form>
          )}
        </div>
      </section>

      {/* ===== MODAL COMMANDE PACK ===== */}
      {selectedPack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelectedPack(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col overflow-hidden"
            onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
              <div>
                <span className="text-xs text-[#c9a84c] font-semibold uppercase tracking-widest">Commander</span>
                <h3 className="font-black text-[#0c4a6e] text-xl mt-0.5">{selectedPack}</h3>
              </div>
              <button onClick={() => setSelectedPack(null)}
                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 transition-colors">
                <span className="text-lg leading-none">×</span>
              </button>
            </div>

            {packSent ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-green-500" />
                </div>
                <h4 className="font-bold text-[#0c4a6e] text-lg mb-2">Commande envoyée !</h4>
                <p className="text-gray-500 text-sm mb-2">Votre demande pour <strong>{selectedPack}</strong> a bien été reçue.</p>
                <p className="text-gray-400 text-xs mb-6">Notre équipe vous contactera sous 24h pour confirmer et démarrer votre campagne.</p>
                <button onClick={() => setSelectedPack(null)} className="btn-primary justify-center">Fermer</button>
              </div>
            ) : (
              <form onSubmit={handlePackSubmit} className="p-6 space-y-4 overflow-y-auto">
                <p className="text-sm text-gray-500 bg-[#f0f9ff] rounded-xl px-4 py-3">
                  Remplissez ce formulaire pour commander le <strong className="text-[#0c4a6e]">{selectedPack}</strong>. Notre équipe vous recontactera sous 24h.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Prénom *</label>
                    <input required type="text" placeholder="Jean" value={packForm.firstName}
                      onChange={e => setPackForm(f => ({ ...f, firstName: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Nom *</label>
                    <input required type="text" placeholder="Kouamé" value={packForm.lastName}
                      onChange={e => setPackForm(f => ({ ...f, lastName: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Téléphone *</label>
                    <input required type="tel" placeholder="07 XX XX XX XX" value={packForm.phone}
                      onChange={e => setPackForm(f => ({ ...f, phone: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                    <input type="email" placeholder="jean@email.com" value={packForm.email}
                      onChange={e => setPackForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Décrivez votre activité / ce que vous souhaitez promouvoir *</label>
                  <textarea required rows={3}
                    placeholder="Ex: Je tiens un restaurant à Grand-Lahou et je veux promouvoir mon menu du jour..."
                    value={packForm.description}
                    onChange={e => setPackForm(f => ({ ...f, description: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c] resize-none" />
                </div>

                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={() => setSelectedPack(null)}
                    className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm">
                    Annuler
                  </button>
                  <button type="submit" disabled={packLoading}
                    className="flex-1 btn-primary justify-center py-3 font-bold disabled:opacity-60">
                    {packLoading
                      ? <><Loader2 size={15} className="animate-spin" /> Envoi...</>
                      : <>Confirmer la commande <ArrowRight size={15} /></>}
                  </button>
                </div>
                <p className="text-xs text-gray-400 text-center">Réponse sous 24h · Sans engagement immédiat</p>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

