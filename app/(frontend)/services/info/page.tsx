"use client";
import { useState, useEffect } from "react";
import { ArrowRight, Phone, X, Clock, Video, Mic2, Calendar, FileText, ChevronLeft, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";

type DbPrestation = {
  id: string; nom: string; categorie: string; description: string; prix: string; image: string;
};

const ICON_MAP: Record<string, React.ReactNode> = {
  "Vidéo": <Video size={16} />,
  "TV/Radio": <Mic2 size={16} />,
  "Live": <Calendar size={16} />,
  "Digital": <FileText size={16} />,
};

const actualites = [
  { id: "grand-bassam-patrimoine", titre: "Grand-Bassam : le patrimoine UNESCO à l'honneur", date: "Avril 2026", image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80", categorie: "Patrimoine" },
  { id: "tourisme-saison-record", titre: "Tourisme littoral : une saison record attendue", date: "Mars 2026", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80", categorie: "Tourisme" },
  { id: "pecheurs-littoral", titre: "Les pêcheurs du littoral à l'honneur", date: "Mars 2026", image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80", categorie: "Culture" },
  { id: "developpement-economique", titre: "Développement économique de la Côtière ivoirienne", date: "Février 2026", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80", categorie: "Économie" },
  { id: "festival-musique-2026", titre: "Festival de musique du littoral 2026", date: "Février 2026", image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80", categorie: "Culture" },
  { id: "nouvelles-infrastructures", titre: "Nouvelles infrastructures pour la Côtière", date: "Janvier 2026", image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80", categorie: "Infrastructure" },
];

export default function InfoPage() {
  const [prestations, setPrestations] = useState<DbPrestation[]>([]);
  const [prestationsLoaded, setPrestationsLoaded] = useState(false);
  const [active, setActive] = useState<DbPrestation | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ firstName: "", phone: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    fetch("/api/info/prestations")
      .then(r => r.json())
      .then(d => { if (d.data?.length > 0) setPrestations(d.data); setPrestationsLoaded(true); })
      .catch(() => setPrestationsLoaded(true));
  }, []);

  function closeModal() {
    setActive(null); setShowForm(false); setSent(false); setErr("");
    setForm({ firstName: "", phone: "", email: "", message: "" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.firstName || !form.phone || !form.message) { setErr("Veuillez remplir les champs obligatoires."); return; }
    setSending(true); setErr("");
    try {
      await fetch("/api/events/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientFirstName: form.firstName, clientLastName: "-",
          clientPhone: form.phone, clientEmail: form.email || null,
          eventType: "COTIERE INFO+ - " + active?.nom,
          eventDate: new Date().toISOString(), eventLocation: "Littoral ivoirien",
          guestCount: 1, services: [active?.nom ?? ""], description: form.message,
        }),
      });
      setSending(false); setSent(true);
    } catch { setSending(false); setErr("Erreur lors de l'envoi. Réessayez."); }
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
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mt-2 mb-4">CÔTIÈRE INFO+</h1>
            <p className="text-[#c9a84c] font-semibold text-lg mb-3">« La voix officielle du littoral Ivoirien »</p>
            <p className="text-gray-100 text-lg leading-relaxed">Service d'information et de communication dédié au littoral ivoirien.</p>
            <div className="flex gap-3 mt-8">
              <a href="#actualites" className="btn-primary inline-flex">Nos actualités <ArrowRight size={18} /></a>
              <a href="tel:+2250747722931" className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-bold px-5 py-3 rounded-xl hover:bg-white/20 transition-colors">
                <Phone size={18} /> Nous contacter
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Prestations dynamiques */}
      <section className="py-16 bg-[#f0f9ff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest">Nos prestations</span>
            <h2 className="section-title mt-2">Ce que nous faisons</h2>
          </div>
          {!prestationsLoaded ? (
            <div className="flex justify-center py-12"><Loader2 size={32} className="animate-spin text-[#c9a84c]" /></div>
          ) : prestations.length === 0 ? (
            <p className="text-center text-gray-400 py-8">Aucune prestation disponible pour le moment.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {prestations.map((p) => (
                <button key={p.id} onClick={() => { setActive(p); setShowForm(false); setSent(false); }}
                  className="group relative rounded-xl overflow-hidden shadow-sm card-hover text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#c9a84c]">
                  <div className="relative h-40">
                    <img 
                      src={p.image || "/Images/cotiere-info.png"} 
                      alt={p.nom} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={e => { (e.currentTarget as HTMLImageElement).src = "/Images/cotiere-info.png"; }} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute inset-0 bg-[#c9a84c]/0 group-hover:bg-[#c9a84c]/20 transition-all duration-300" />
                    <p className="absolute bottom-3 left-3 right-3 text-white text-xs font-semibold leading-tight">{p.nom}</p>
                    <div className="absolute top-2 right-2 w-6 h-6 bg-white/0 group-hover:bg-white/90 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100">
                      <ArrowRight size={11} className="text-[#0c4a6e]" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
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
          <p className="text-gray-300 mb-8">Contactez CÔTIÈRE INFO+ pour une couverture médiatique professionnelle.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="btn-primary">Nous contacter <ArrowRight size={18} /></Link>
            <a href="tel:+2250747722931" className="flex items-center gap-2 bg-white/10 border border-white/30 text-white font-bold px-5 py-3 rounded-xl hover:bg-white/20 transition-colors">
              <Phone size={18} /> 07 47 72 29 31
            </a>
          </div>
        </div>
      </section>

      {/* Modal */}
      {active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="relative h-44 rounded-t-2xl overflow-hidden shrink-0">
              <img 
                src={active.image || "/Images/cotiere-info.png"} 
                alt={active.nom} 
                className="w-full h-full object-cover"
                onError={e => { (e.currentTarget as HTMLImageElement).src = "/Images/cotiere-info.png"; }} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-5 right-12">
                <span className="bg-[#c9a84c] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 w-fit mb-2">
                  {ICON_MAP[active.categorie] ?? <FileText size={12} />} CÔTIÈRE INFO+
                </span>
                <h2 className="text-lg font-black text-white leading-tight">{active.nom}</h2>
                <p className="text-white/70 text-xs mt-0.5">{active.categorie} · {active.prix}</p>
              </div>
              <button onClick={closeModal} className="absolute top-3 right-3 w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="p-6 space-y-5">
              {showForm ? (
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
                      <h3 className="font-bold text-[#0c4a6e] text-sm">Demande — <span className="text-[#c9a84c]">{active.nom}</span></h3>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div><label className="block text-xs font-semibold text-gray-600 mb-1">Prénom / Nom *</label>
                          <input type="text" required value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} placeholder="Jean Kouamé" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" /></div>
                        <div><label className="block text-xs font-semibold text-gray-600 mb-1">Téléphone *</label>
                          <input type="tel" required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="07 XX XX XX XX" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" /></div>
                      </div>
                      <div><label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                        <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="jean@email.com" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" /></div>
                      <div><label className="block text-xs font-semibold text-gray-600 mb-1">Votre demande *</label>
                        <textarea required value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} rows={4} maxLength={500}
                          placeholder={`Décrivez votre besoin pour "${active.nom}"...`}
                          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c] resize-none" />
                        <p className="text-xs text-gray-400 text-right">{form.message.length}/500</p></div>
                      {err && <p className="text-red-500 text-xs bg-red-50 px-3 py-2 rounded-lg">{err}</p>}
                      <div className="flex gap-3">
                        <button type="submit" disabled={sending} className="flex-1 btn-primary justify-center py-3 disabled:opacity-60">
                          {sending ? <><Loader2 size={15} className="animate-spin" /> Envoi...</> : <>Envoyer <ArrowRight size={14} /></>}
                        </button>
                        <a href="tel:+2250747722931" className="flex items-center gap-2 border border-[#0c4a6e]/20 text-[#0c4a6e] text-sm font-semibold px-4 rounded-xl hover:bg-[#0c4a6e]/5 transition-colors"><Phone size={14} /></a>
                      </div>
                      <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-1"><Clock size={10} /> Réponse sous 24h · Sans engagement</p>
                    </form>
                  </>
                )
              ) : (
                <>
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-bold text-[#0c4a6e]">{active.description}</h3>
                    <div className="text-right shrink-0">
                      <p className="text-base font-black text-[#c9a84c]">{active.prix}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2 border-t border-gray-100">
                    <button onClick={() => setShowForm(true)} className="flex-1 btn-primary justify-center text-sm py-2.5">
                      Faire une demande <ArrowRight size={14} />
                    </button>
                    <a href="tel:+2250747722931" className="flex items-center gap-2 border border-[#0c4a6e]/20 text-[#0c4a6e] text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#0c4a6e]/5 transition-colors">
                      <Phone size={14} /> Appeler
                    </a>
                  </div>
                  <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-1"><Clock size={10} /> Réponse sous 24h · Devis gratuit & sans engagement</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}