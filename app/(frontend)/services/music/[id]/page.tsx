"use client";
import { useParams } from "next/navigation";
import { ArrowRight, Phone, ChevronLeft, Check, Clock } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const PACKS: Record<string, {
  label: string; price: string; desc: string; featured: boolean;
  image: string; included: string[];
  process: { step: string; desc: string }[];
}> = {
  "pack-demo": {
    label: "Pack Démo",
    price: "50 000 FCFA",
    desc: "Idéal pour tester le studio et enregistrer vos premières maquettes.",
    featured: false,
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80",
    included: ["2h de studio d'enregistrement", "Ingénieur du son", "Mixage basique", "Fichiers bruts livrés", "1 révision incluse"],
    process: [{ step: "Réservation", desc: "Choix du créneau via WhatsApp" }, { step: "Session", desc: "2h en cabine avec ingénieur" }, { step: "Mixage", desc: "Mix basique inclus" }, { step: "Livraison", desc: "Fichiers sous 48h" }],
  },
  "pack-single": {
    label: "Pack Single",
    price: "150 000 FCFA",
    desc: "La solution complète pour sortir un single professionnel prêt pour les plateformes.",
    featured: true,
    image: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&q=80",
    included: ["4h de studio d'enregistrement", "Ingénieur du son expérimenté", "Mixage professionnel", "Mastering pour streaming (Spotify, Apple Music)", "2 révisions incluses", "Export WAV 24bit + MP3", "Livraison sous 5-7 jours"],
    process: [{ step: "Réservation", desc: "Briefing et choix du créneau" }, { step: "Enregistrement", desc: "4h en cabine professionnelle" }, { step: "Mix & Master", desc: "Mixage et mastering pro" }, { step: "Livraison", desc: "Fichiers finaux sous 7 jours" }],
  },
  "pack-album": {
    label: "Pack Album",
    price: "Sur devis",
    desc: "Pour les projets ambitieux : albums complets, EPs, bandes originales.",
    featured: false,
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
    included: ["Sessions illimitées sur la durée du projet", "Ingénieur du son dédié", "Mixage et mastering de tous les titres", "Arrangements et production musicale", "Management artistique inclus", "Distribution sur les plateformes", "Stratégie de promotion"],
    process: [{ step: "Consultation", desc: "Évaluation du projet et devis" }, { step: "Production", desc: "Sessions d'enregistrement" }, { step: "Post-prod", desc: "Mix, master, arrangements" }, { step: "Distribution", desc: "Mise en ligne et promotion" }],
  },
};

export default function MusicPackDetailPage() {
  const { id } = useParams<{ id: string }>();
  const pack = PACKS[id as string];
  const [form, setForm] = useState({ firstName: "", phone: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    const msg = encodeURIComponent(`RÉSERVATION ${pack?.label}\n\nNom : ${form.firstName}\nTél : ${form.phone}\nEmail : ${form.email || "—"}\n\nMessage :\n${form.message}`);
    setTimeout(() => { window.open(`https://wa.me/2250747722931?text=${msg}`, "_blank"); setSending(false); setSent(true); }, 800);
  }

  if (!pack) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-gray-500 text-lg">Pack introuvable.</p>
      <Link href="/services/music" className="btn-primary">Retour à la musique</Link>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative text-white py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src={pack.image} alt={pack.label} className="w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/20" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/services/music" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6 transition-colors">
            <ChevronLeft size={16} /> Retour à la musique
          </Link>
          <div className="max-w-2xl">
            {pack.featured && <span className="bg-[#c9a84c] text-white text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block">⭐ Le plus populaire</span>}
            <h1 className="text-3xl sm:text-4xl font-bold mt-3 mb-2">{pack.label}</h1>
            <p className="text-[#c9a84c] font-black text-2xl mb-3">{pack.price}</p>
            <p className="text-gray-100 text-lg leading-relaxed mb-6">{pack.desc}</p>
            <a href="#reserver" className="btn-primary">Réserver ce pack <ArrowRight size={18} /></a>
          </div>
        </div>
      </section>

      {/* Contenu */}
      <section className="py-16 bg-[#f0f9ff]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h2 className="section-title mb-6">Ce qui est inclus</h2>
              <ul className="space-y-3">
                {pack.included.map(item => (
                  <li key={item} className="flex items-start gap-3 text-gray-700 text-sm">
                    <Check size={16} className="text-green-500 shrink-0 mt-0.5" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="section-title mb-6">Comment ça se passe ?</h2>
              <div className="space-y-4">
                {pack.process.map((p, i) => (
                  <div key={p.step} className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-[#c9a84c] text-white rounded-full flex items-center justify-center text-sm font-black shrink-0">{i + 1}</div>
                    <div>
                      <p className="font-bold text-[#0c4a6e] text-sm">{p.step}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Formulaire */}
      <section id="reserver" className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="section-title">Réserver — {pack.label}</h2>
            <p className="text-gray-500 mt-2 flex items-center justify-center gap-1"><Clock size={14} /> Réponse sous 24h</p>
          </div>
          {sent ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-green-500" />
              </div>
              <h3 className="font-bold text-[#0c4a6e] text-lg mb-2">Demande envoyée !</h3>
              <p className="text-gray-500 text-sm mb-6">Notre équipe vous contactera sous 24h.</p>
              <Link href="/services/music" className="btn-primary justify-center">Retour</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Prénom / Nom *</label>
                  <input required type="text" placeholder="Jean Kouamé" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Téléphone *</label>
                  <input required type="tel" placeholder="07 XX XX XX XX" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                <input type="email" placeholder="jean@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Décrivez votre projet *</label>
                <textarea required rows={4} placeholder="Style musical, nombre de titres, date souhaitée..." value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c] resize-none" />
              </div>
              <button type="submit" disabled={sending} className="btn-primary w-full justify-center py-3 disabled:opacity-60">
                {sending ? "Envoi..." : <>Envoyer ma demande <ArrowRight size={16} /></>}
              </button>
              <a href="tel:+2250747722931" className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors">
                <Phone size={16} /> Appeler directement
              </a>
            </form>
          )}
        </div>
      </section>

      {/* Autres packs */}
      <section className="py-12 bg-[#f8fafc]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="font-bold text-[#0c4a6e] mb-6 text-center">Comparer les packs</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(PACKS).map(([pid, p]) => (
              <Link key={pid} href={`/services/music/${pid}`}
                className={`rounded-2xl p-5 border transition-all hover:shadow-md ${pid === id ? "border-[#c9a84c] ring-2 ring-[#c9a84c]/30 bg-[#fffbf0]" : "border-gray-100 bg-white hover:border-[#c9a84c]/40"}`}>
                {p.featured && <span className="bg-[#c9a84c] text-white text-xs font-bold px-2 py-0.5 rounded-full mb-2 inline-block">Populaire</span>}
                <h4 className="font-bold text-[#0c4a6e] mb-1">{p.label}</h4>
                <p className="text-[#c9a84c] font-black text-lg mb-1">{p.price}</p>
                <p className="text-gray-400 text-xs">{pid === id ? "Pack actuel ✓" : "Voir ce pack →"}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
