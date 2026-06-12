"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle, Phone, Clock, Loader2, ChevronLeft, Share2, Check } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

// Force le rendu dynamique pour éviter les erreurs de génération statique au build
export const dynamic = 'force-dynamic';

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
    included: ["Réalisation du spot (30s ou 60s)", "Tournage professionnel", "Montage et habillage graphique", "Diffusion sur CÔTIÈRE TV", "Planning personnalisé", "Rapport de diffusion", "Archive numérique"],
    process: [
      { step: "Brief créatif", desc: "Échange sur vos objectifs" },
      { step: "Production", desc: "Tournage et montage" },
      { step: "Validation", desc: "Vous validez le spot" },
      { step: "Diffusion", desc: "Passage à l'antenne" },
    ],
    targets: ["Commerces", "Restaurants", "PME", "Événements"],
    examples: ["Spot restaurant", "Annonce boutique", "Promotion événement"],
  },
  "publicite-radio": {
    title: "Publicité Radio",
    subtitle: "Jingles & annonces · Radios FM locales",
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=1200&q=80",
    price: "À partir de 25 000 FCFA",
    description: "Faites entendre votre message sur les radios locales du littoral ivoirien.",
    included: ["Création jingle", "Voix off pro", "Diffusion radios partenaires"],
    process: [{ step: "Rédaction", desc: "Concept sonore" }, { step: "Enregistrement", desc: "Session studio" }, { step: "Validation", desc: "Approbation" }, { step: "Diffusion", desc: "Passages radio" }],
    targets: ["Artisans", "Pharmacies", "Écoles"],
    examples: ["Jingle promo", "Annonce école"],
  },
  "publicite-web": {
    title: "Publicité Web",
    subtitle: "Social Media · Ciblage précis",
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1200&q=80",
    price: "À partir de 30 000 FCFA",
    description: "Touchez votre audience sur les réseaux sociaux.",
    included: ["Visuels & contenus", "Campagnes sponsorisées", "Ciblage littoral"],
    process: [{ step: "Stratégie", desc: "Objectifs" }, { step: "Création", desc: "Visuels" }, { step: "Lancement", desc: "Mise en ligne" }, { step: "Optimisation", desc: "Suivi" }],
    targets: ["E-commerce", "Immobilier", "Food"],
    examples: ["Lancement produit", "Lead generation"],
  },
  "sms-whatsapp": {
    title: "SMS & WhatsApp Marketing",
    subtitle: "Messages ciblés · Taux d'ouverture 95%",
    image: "https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=1200&q=80",
    price: "À partir de 15 000 FCFA",
    description: "Communication directe et efficace.",
    included: ["Rédaction", "Envoi massif", "Rapport d'envoi"],
    process: [{ step: "Rédaction", desc: "Message" }, { step: "Ciblage", desc: "Sélection" }, { step: "Envoi", desc: "Diffusion" }, { step: "Rapport", desc: "Stats" }],
    targets: ["Promos flash", "Fidélisation"],
    examples: ["Promo weekend", "Invitation"],
  },
  "affichage-flyers": {
    title: "Affichage & Flyers",
    subtitle: "Impression & Distribution",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
    price: "À partir de 20 000 FCFA",
    description: "Supports print professionnels.",
    included: ["Conception", "Impression", "Distribution"],
    process: [{ step: "Brief", desc: "Style" }, { step: "Maquette", desc: "Design" }, { step: "Validation", desc: "Approbation" }, { step: "Impression", desc: "Livraison" }],
    targets: ["Restaurants", "Événements"],
    examples: ["Flyer restaurant", "Affiche concert"],
  },
  "sponsoring-evenements": {
    title: "Sponsoring d'Événements",
    subtitle: "Concerts · Galas · Foires",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=80",
    price: "Sur devis",
    description: "Visibilité incomparable sur le littoral.",
    included: ["Logo sur supports", "Mention TV/Radio"],
    process: [{ step: "Sélection", desc: "Événement cible" }, { step: "Contrat", desc: "Signature" }, { step: "Intégration", desc: "Visibilité" }, { step: "Événement", desc: "Présence" }],
    targets: ["Entreprises", "Banques"],
    examples: ["Sponsor concert", "Partenaire foire"],
  },
};

export default function SupportDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const support = slug ? SUPPORTS[slug] : null;

  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", email: "", budget: "", description: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleShare() {
    if (typeof window !== "undefined") {
      const url = window.location.href;
      const title = `${support?.title} — CÔTIÈRE`;
      if (navigator.share) { navigator.share({ title, url }).catch(() => {}); }
      else { navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); }); }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/afrouba", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, documentType: support?.title }),
      });
      const msg = encodeURIComponent(`DEMANDE PUBLICITÉ — ${support?.title}\nClient: ${form.firstName} ${form.lastName}`);
      if (typeof window !== "undefined") { window.open(`https://wa.me/2250747722931?text=${msg}`, "_blank"); }
      setSent(true);
    } catch {}
    setLoading(false);
  }

  if (!support) return <div className="min-h-screen flex items-center justify-center">Support introuvable.</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative text-white py-20 overflow-hidden bg-[#0c4a6e]">
        <div className="relative max-w-7xl mx-auto px-4">
          <Link href="/services/afrouba" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6"><ChevronLeft size={16} /> Retour</Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{support.title}</h1>
          <p className="text-xl text-gray-200">{support.subtitle}</p>
        </div>
      </section>

      <section className="py-16 px-4 max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-4">À propos</h2>
          <p className="text-gray-600 mb-8">{support.description}</p>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold mb-4">Ce qui est inclus</h3>
              <ul className="space-y-2">
                {support.included.map(i => <li key={i} className="flex gap-2 text-sm"><Check size={16} className="text-green-500" /> {i}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Processus</h3>
              <ul className="space-y-2">
                {support.process.map((p, i) => <li key={p.step} className="text-sm"><strong>{i+1}. {p.step}</strong>: {p.desc}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="demande" className="py-16 px-4 bg-[#f0f9ff]">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl p-8 shadow-sm">
          {sent ? (
            <div className="text-center py-12"><CheckCircle size={48} className="text-green-500 mx-auto mb-4" /><h3>Demande envoyée !</h3></div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input required className="w-full border p-3 rounded-lg" placeholder="Prénom" onChange={e => setForm({...form, firstName: e.target.value})} />
              <input required className="w-full border p-3 rounded-lg" placeholder="Nom" onChange={e => setForm({...form, lastName: e.target.value})} />
              <input required type="tel" className="w-full border p-3 rounded-lg" placeholder="Téléphone" onChange={e => setForm({...form, phone: e.target.value})} />
              <button disabled={loading} className="w-full bg-[#c9a84c] text-white p-3 rounded-lg">{loading ? "Envoi..." : "Demander un devis"}</button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}