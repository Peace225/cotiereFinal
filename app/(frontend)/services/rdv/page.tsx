"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, MapPin, Clock, Users, Phone, Ticket, Music, Trophy, Mic2, PartyPopper, Star, Palette, Zap, X, Loader2, CheckCircle, RefreshCw } from "lucide-react";

type Evenement = {
  id: string; slug: string; icon?: string; titre: string; categorie: string;
  date: string; heure: string; lieu: string; ville: string;
  image: string; badge: string; badgeColor: string; prix: string;
  description: string; isActive: boolean;
};

const ICON_MAP: Record<string, React.ElementType> = { Music, Trophy, Mic2, PartyPopper, Star, Zap, Palette };
const CATEGORIE_ICON: Record<string, React.ElementType> = {
  Festival: Music, Gala: Trophy, "Conférence": Mic2,
  "Fête culturelle": PartyPopper, Salon: Star, Sport: Zap, Formation: Palette,
};
const CATEGORIES = ["Tous", "Festival", "Gala", "Conférence", "Fête culturelle", "Salon", "Sport", "Formation"];

export default function RdvPage() {
  const [evenements, setEvenements] = useState<Evenement[]>([]);
  const [loading, setLoading] = useState(true);
  const [categorie, setCategorie] = useState("Tous");
  const [showSoumettreModal, setShowSoumettreModal] = useState(false);
  const [soumForm, setSoumForm] = useState({ nom: "", telephone: "", email: "", titreEv: "", dateEv: "", lieuEv: "", description: "" });
  const [soumSending, setSoumSending] = useState(false);
  const [soumSent, setSoumSent] = useState(false);

  useEffect(() => {
    fetch("/api/evenements")
      .then(r => r.json())
      .then(d => setEvenements(d.data?.evenements ?? []))
      .catch(() => setEvenements([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = categorie === "Tous"
    ? evenements
    : evenements.filter(e => e.categorie === categorie);

  async function handleSoumettreSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSoumSending(true);
    const msg = encodeURIComponent(
      `SOUMISSION ÉVÉNEMENT — CÔTIÈRE RDV\n\nOrganisateur : ${soumForm.nom}\nTel : ${soumForm.telephone}\nEmail : ${soumForm.email || "—"}\n\nÉvénement : ${soumForm.titreEv}\nDate prévue : ${soumForm.dateEv || "—"}\nLieu : ${soumForm.lieuEv || "—"}\n\nDescription :\n${soumForm.description || "—"}`
    );
    setTimeout(() => {
      window.open(`https://wa.me/2250747722931?text=${msg}`, "_blank");
      setSoumSending(false);
      setSoumSent(true);
    }, 800);
  }

  return (
    <div className="min-h-screen">

      {/* HERO */}
      <section className="relative text-white overflow-hidden min-h-[320px]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628] via-[#0c2d4a]/95 to-[#0c4a6e]/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        {/* Cercles décoratifs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#c9a84c]/5 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#38bdf8]/5 rounded-full -translate-x-1/3 translate-y-1/3 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between gap-8">
            <div className="flex-1 min-w-0">
              <span className="text-[#c9a84c] text-xs font-bold uppercase tracking-widest bg-[#c9a84c]/10 border border-[#c9a84c]/30 px-3 py-1 rounded-full inline-block mb-4">Agenda du littoral</span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mt-2 mb-4 leading-tight">Le RDV Des<br className="hidden sm:block" /> Événements À Venir</h1>
              <p className="text-[#c9a84c] font-semibold text-base mb-3">Ne manquez plus aucun événement du littoral ivoirien</p>
              <p className="text-gray-300 text-base leading-relaxed max-w-lg">Festivals, galas, conférences, fêtes culturelles et tournois sportifs — retrouvez ici tous les événements à venir sur la côte ivoirienne.</p>
              <div className="flex flex-wrap gap-3 mt-8">
                <a href="#evenements" className="btn-primary inline-flex items-center gap-2">Voir les événements <ArrowRight size={18} /></a>
                <a href="tel:+2250747722931" className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold px-5 py-3 rounded-xl hover:bg-white/20 transition-colors"><Phone size={18} /> Nous contacter</a>
              </div>
            </div>
            <div className="shrink-0 w-52 md:w-64 lg:w-80 hidden sm:flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-white/5 rounded-3xl blur-2xl scale-110" />
                <img src="/Images/rdv.jpeg" alt="Le RDV Des Événements À Venir" className="relative w-full h-auto object-contain drop-shadow-2xl rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-[#0c4a6e] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
            {[{ value: "17+", label: "Événements à venir" },{ value: "8", label: "Villes du littoral" },{ value: "25 000+", label: "Participants attendus" },{ value: "100%", label: "Couverture CÔTIÈRE" }].map(s => (
              <div key={s.label}><p className="text-3xl font-black text-[#c9a84c]">{s.value}</p><p className="text-sm text-gray-300 mt-1">{s.label}</p></div>
            ))}
          </div>
        </div>
      </section>

      {/* EVENEMENTS */}
      <section id="evenements" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest">Agenda 2026</span>
            <h2 className="section-title mt-2">Événements à venir</h2>
            <p className="text-gray-500 mt-2">Cliquez sur un événement pour voir tous les détails et vous inscrire.</p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategorie(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${categorie === cat ? "bg-[#0c4a6e] text-white shadow-md" : "bg-white text-gray-500 border border-gray-200 hover:border-[#c9a84c] hover:text-[#c9a84c]"}`}>
                {cat}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-3 py-16 text-center text-gray-400">
                <RefreshCw size={32} className="animate-spin mx-auto mb-3" /> Chargement des événements...
              </div>
            ) : filtered.length === 0 ? (
              <div className="col-span-3 py-16 text-center text-gray-400">Aucun événement dans cette catégorie.</div>
            ) : filtered.map(ev => {
              const Icon = CATEGORIE_ICON[ev.categorie] ?? Star;
              return (
                <Link key={ev.slug} href={`/services/rdv/${ev.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#c9a84c] transition-all hover:shadow-lg hover:border-[#c9a84c]/30 hover:-translate-y-1">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={ev.image || "/Images/rdv.jpeg"} 
                      alt={ev.titre} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={e => { (e.currentTarget as HTMLImageElement).src = "/Images/rdv.jpeg"; }} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className={`absolute top-3 left-3 ${ev.badgeColor} text-white text-xs font-bold px-2.5 py-1 rounded-full`}>{ev.badge}</span>
                    <span className="absolute top-3 right-3 bg-black/40 text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm">{ev.categorie}</span>
                    <div className="absolute bottom-3 right-3 w-8 h-8 bg-white/0 group-hover:bg-white/90 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100">
                      <ArrowRight size={14} className="text-[#0c4a6e]" />
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 bg-[#0c4a6e]/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#c9a84c]/15 transition-colors">
                        <Icon size={18} className="text-[#0c4a6e] group-hover:text-[#c9a84c] transition-colors" />
                      </div>
                      <h3 className="font-bold text-[#0c4a6e] leading-tight group-hover:text-[#c9a84c] transition-colors text-sm">{ev.titre}</h3>
                    </div>
                    <div className="space-y-1.5 text-xs text-gray-500">
                      <div className="flex items-center gap-2"><Calendar size={12} className="text-[#c9a84c] shrink-0" /><span className="font-medium text-[#0c4a6e]">{ev.date}</span></div>
                      <div className="flex items-center gap-2"><Clock size={12} className="text-[#c9a84c] shrink-0" /><span>{ev.heure}</span></div>
                      <div className="flex items-center gap-2"><MapPin size={12} className="text-[#c9a84c] shrink-0" /><span>{ev.lieu}</span></div>
                      <div className="flex items-center gap-2"><Ticket size={12} className="text-[#c9a84c] shrink-0" /><span className="font-semibold text-[#0c4a6e]">{ev.prix}</span></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-3 leading-relaxed line-clamp-2">{ev.description}</p>
                    <div className="mt-4 flex items-center gap-1 text-[#c9a84c] text-xs font-semibold group-hover:gap-2 transition-all">
                      Voir les détails <ArrowRight size={12} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* SOUMETTRE */}
      <section className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest">Organisateurs</span>
          <h2 className="section-title mt-2">Vous organisez un événement ?</h2>
          <p className="text-gray-500 mt-3 mb-8">Faites connaître votre événement sur CÔTIÈRE et touchez des milliers de personnes sur tout le littoral ivoirien.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[{ icon: Users, title: "Visibilité maximale", desc: "Votre événement vu par des milliers de personnes sur le littoral" },{ icon: Calendar, title: "Publication rapide", desc: "Mise en ligne sous 24h après validation de votre demande" },{ icon: Phone, title: "Couverture CÔTIÈRE", desc: "Option couverture média : TV, radio, réseaux sociaux" }].map(f => {
              const FIcon = f.icon;
              return (
                <div key={f.title} className="bg-[#f8fafc] rounded-2xl p-5 border border-gray-100 text-center">
                  <div className="w-10 h-10 bg-[#0c4a6e]/10 rounded-xl flex items-center justify-center mx-auto mb-3"><FIcon size={18} className="text-[#0c4a6e]" /></div>
                  <h4 className="font-bold text-[#0c4a6e] text-sm mb-1">{f.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
          <button
            onClick={() => { setShowSoumettreModal(true); setSoumSent(false); setSoumForm({ nom: "", telephone: "", email: "", titreEv: "", dateEv: "", lieuEv: "", description: "" }); }}
            className="inline-flex items-center gap-2 bg-[#c9a84c] hover:bg-[#b8973b] text-white font-bold px-8 py-4 rounded-xl transition-colors">
            <Phone size={18} /> Soumettre mon événement
          </button>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#0c4a6e] text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-black mb-4">Vous préférez nous appeler ?</h2>
          <p className="text-gray-300 mb-8">Notre équipe est disponible du lundi au samedi de 8h à 18h.</p>
          <a href="tel:+2250747722931" className="inline-flex items-center gap-2 bg-[#c9a84c] hover:bg-[#b8973b] text-white font-bold px-8 py-4 rounded-xl transition-colors"><Phone size={18} /> 07 47 72 29 31</a>
        </div>
      </section>

      {/* MODAL SOUMETTRE UN EVENEMENT */}
      {showSoumettreModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowSoumettreModal(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="font-black text-[#0c4a6e] text-lg">Soumettre votre événement</h2>
                <p className="text-xs text-gray-400 mt-0.5">Mise en ligne sous 24h après validation</p>
              </div>
              <button onClick={() => setShowSoumettreModal(false)} className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors">
                <X size={16} className="text-gray-500" />
              </button>
            </div>
            <div className="p-6">
              {soumSent ? (
                <div className="text-center py-8">
                  <CheckCircle size={52} className="text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-[#0c4a6e] mb-2">Soumission envoyée !</h3>
                  <p className="text-gray-500 text-sm mb-6">Notre équipe examinera votre événement et vous contactera sous 24h.</p>
                  <button onClick={() => setShowSoumettreModal(false)} className="btn-primary justify-center">Fermer</button>
                </div>
              ) : (
                <form onSubmit={handleSoumettreSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Votre nom *</label>
                      <input type="text" required value={soumForm.nom} onChange={e => setSoumForm(f => ({ ...f, nom: e.target.value }))}
                        placeholder="Jean Kouamé" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Téléphone *</label>
                      <input type="tel" required value={soumForm.telephone} onChange={e => setSoumForm(f => ({ ...f, telephone: e.target.value }))}
                        placeholder="07 XX XX XX XX" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                    <input type="email" value={soumForm.email} onChange={e => setSoumForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="jean@email.com" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Titre de l'événement *</label>
                    <input type="text" required value={soumForm.titreEv} onChange={e => setSoumForm(f => ({ ...f, titreEv: e.target.value }))}
                      placeholder="Ex : Festival de Musique de Bassam" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Date prévue</label>
                      <input type="text" value={soumForm.dateEv} onChange={e => setSoumForm(f => ({ ...f, dateEv: e.target.value }))}
                        placeholder="Ex : 15 Juillet 2026" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Lieu</label>
                      <input type="text" value={soumForm.lieuEv} onChange={e => setSoumForm(f => ({ ...f, lieuEv: e.target.value }))}
                        placeholder="Ex : Grand-Bassam" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Description de l'événement *</label>
                    <textarea required value={soumForm.description} onChange={e => setSoumForm(f => ({ ...f, description: e.target.value }))}
                      rows={4} maxLength={500}
                      placeholder="Décrivez votre événement : type, public cible, programme, nombre de participants attendus..."
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c] resize-none" />
                    <p className="text-xs text-gray-400 text-right">{soumForm.description.length}/500</p>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="submit" disabled={soumSending} className="flex-1 btn-primary justify-center py-3 disabled:opacity-60">
                      {soumSending ? <><Loader2 size={15} className="animate-spin" /> Envoi...</> : <>Soumettre mon événement <ArrowRight size={14} /></>}
                    </button>
                    <a href="tel:+2250747722931" className="flex items-center gap-2 border border-[#0c4a6e]/20 text-[#0c4a6e] text-sm font-semibold px-4 rounded-xl hover:bg-[#0c4a6e]/5 transition-colors">
                      <Phone size={14} />
                    </a>
                  </div>
                  <p className="text-xs text-gray-400 text-center">Réponse sous 24h — Gratuit et sans engagement</p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}