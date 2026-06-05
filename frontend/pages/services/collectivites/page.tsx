"use client";
import { useState } from "react";
import { ArrowRight, Phone, CheckCircle, X, Check, Clock, ChevronLeft, Loader2, GraduationCap, Building2, TrendingUp, Handshake, Award, Users } from "lucide-react";

type Service = {
  slug: string; image: string; title: string; desc: string; icon: React.ReactNode;
  subtitle: string; longDesc: string; priceRange: string;
  included: string[]; process: { step: string; desc: string }[];
  targets: string[];
};

const SERVICES: Service[] = [
  {
    slug: "coaching", image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&q=80",
    title: "Coaching & Formation", desc: "Programmes de formation professionnelle et coaching individuel ou collectif.",
    icon: <GraduationCap size={16} />, subtitle: "Formation · Coaching · Developpement des competences",
    longDesc: "Nos programmes de coaching et formation professionnelle sont concus pour renforcer les capacites des individus et des equipes. Nous intervenons en entreprise, dans les collectivites et aupres des associations pour developper les competences manageriales, techniques et comportementales.",
    priceRange: "150 000 - 500 000 FCFA",
    included: ["Audit des besoins en formation", "Programme sur mesure", "Formateurs certifies", "Supports pedagogiques", "Evaluation des acquis", "Attestation de formation", "Suivi post-formation (3 mois)", "Rapport de formation"],
    process: [{ step: "Diagnostic", desc: "Analyse des besoins et des objectifs" }, { step: "Conception", desc: "Elaboration du programme" }, { step: "Formation", desc: "Sessions en presentiel ou distanciel" }, { step: "Evaluation", desc: "Mesure des acquis et rapport final" }],
    targets: ["Entreprises & PME", "Collectivites locales", "ONG & associations", "Fonctionnaires", "Managers & cadres", "Jeunes professionnels"],
  },
  {
    slug: "institutionnel", image: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=400&q=80",
    title: "Accompagnement institutionnel", desc: "Appui aux collectivites locales dans leurs projets de developpement.",
    icon: <Building2 size={16} />, subtitle: "Mairies · Conseils régionaux · Institutions publiques",
    longDesc: "Nous accompagnons les collectivites locales et les institutions publiques dans la conception, la planification et la mise en oeuvre de leurs projets de developpement. Notre equipe apporte un appui technique et strategique pour ameliorer la gouvernance locale.",
    priceRange: "Sur devis selon projet",
    included: ["Diagnostic institutionnel", "Plan de developpement strategique", "Appui a la mobilisation de ressources", "Formation des elus et agents", "Suivi-evaluation des projets", "Rapports d'activites", "Mise en reseau avec partenaires", "Assistance technique permanente"],
    process: [{ step: "Diagnostic", desc: "Evaluation de la situation institutionnelle" }, { step: "Planification", desc: "Elaboration du plan d'action" }, { step: "Mise en oeuvre", desc: "Accompagnement dans l'execution" }, { step: "Evaluation", desc: "Mesure des resultats" }],
    targets: ["Mairies & communes", "Conseils regionaux", "Ministeres", "Etablissements publics", "Agences de developpement", "Organisations internationales"],
  },
  {
    slug: "developpement-local", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80",
    title: "Developpement local", desc: "Strategies de developpement economique pour les communes du littoral.",
    icon: <TrendingUp size={16} />, subtitle: "Économie locale · Emploi · Investissement",
    longDesc: "Nous aidons les communes et territoires du littoral ivoirien a elaborer et mettre en oeuvre des strategies de developpement economique local. Attraction des investissements, promotion du tourisme, developpement de filieres economiques, creation d'emplois.",
    priceRange: "300 000 - 1 000 000 FCFA",
    included: ["Diagnostic economique territorial", "Strategie de developpement local", "Plan d'attraction des investissements", "Promotion du territoire", "Accompagnement des porteurs de projets", "Mise en reseau avec investisseurs", "Suivi des indicateurs economiques", "Rapports trimestriels"],
    process: [{ step: "Diagnostic territorial", desc: "Analyse des potentialites" }, { step: "Strategie", desc: "Vision et axes prioritaires" }, { step: "Plan d'action", desc: "Projets et ressources" }, { step: "Mise en oeuvre", desc: "Accompagnement et suivi" }],
    targets: ["Communes & mairies", "Conseils regionaux", "Chambres de commerce", "Agences de developpement", "Investisseurs locaux", "Diaspora ivoirienne"],
  },
  {
    slug: "partenariats", image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&q=80",
    title: "Partenariats publics-prives", desc: "Facilitation de partenariats entre acteurs publics et prives.",
    icon: <Handshake size={16} />, subtitle: "PPP · Contractualisation · Negociation",
    longDesc: "Nous facilitons la mise en place de partenariats publics-prives (PPP) efficaces et durables sur le littoral ivoirien. De l'identification des opportunites a la contractualisation, nous accompagnons les deux parties pour creer des partenariats gagnant-gagnant.",
    priceRange: "Sur devis selon projet",
    included: ["Identification des opportunites PPP", "Etude de faisabilite", "Montage juridique et financier", "Facilitation des negociations", "Redaction des conventions", "Suivi de l'execution", "Resolution des litiges", "Evaluation des impacts"],
    process: [{ step: "Identification", desc: "Reperage des opportunites" }, { step: "Faisabilite", desc: "Etude technique et financiere" }, { step: "Negociation", desc: "Facilitation des discussions" }, { step: "Contractualisation", desc: "Signature et mise en oeuvre" }],
    targets: ["Collectivites locales", "Entreprises privees", "Investisseurs", "ONG & fondations", "Institutions financieres", "Organisations internationales"],
  },
  {
    slug: "certification", image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80",
    title: "Certification & Accreditation", desc: "Accompagnement dans les demarches de certification et d'accreditation.",
    icon: <Award size={16} />, subtitle: "ISO · Normes · Qualité · Conformite",
    longDesc: "Nous accompagnons les organisations dans leurs demarches de certification (ISO 9001, ISO 14001, etc.) et d'accreditation. Notre equipe guide votre organisation a travers toutes les etapes : diagnostic, mise en place du systeme de management, formation et audit.",
    priceRange: "200 000 - 800 000 FCFA",
    included: ["Diagnostic qualite initial", "Plan de mise en conformite", "Redaction des procedures", "Formation des equipes qualite", "Audit interne blanc", "Preparation a l'audit de certification", "Accompagnement post-certification", "Veille reglementaire"],
    process: [{ step: "Diagnostic", desc: "Ecart avec les exigences de la norme" }, { step: "Mise en conformite", desc: "Implementation du systeme" }, { step: "Audit interne", desc: "Verification avant certification" }, { step: "Certification", desc: "Accompagnement lors de l'audit" }],
    targets: ["Entreprises industrielles", "Etablissements de sante", "Etablissements d'enseignement", "Collectivites locales", "Laboratoires", "Prestataires de services"],
  },
  {
    slug: "animation", image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80",
    title: "Animation communautaire", desc: "Organisation d'evenements et d'activites pour les communautes locales.",
    icon: <Users size={16} />, subtitle: "Événements · Cohésion sociale · Mobilisation",
    longDesc: "Nous concevons et animons des programmes d'animation communautaire pour renforcer la cohesion sociale et mobiliser les communautes autour de projets communs. Journees citoyennes, forums, activites culturelles et sportives.",
    priceRange: "100 000 - 400 000 FCFA",
    included: ["Conception du programme", "Mobilisation des participants", "Animation des ateliers et forums", "Materiel pedagogique et logistique", "Documentation et compte-rendu", "Couverture mediatique CÃTIÃRE INFO+", "Suivi des engagements", "Rapport d'impact"],
    process: [{ step: "Conception", desc: "Objectifs et programme" }, { step: "Mobilisation", desc: "Sensibilisation des participants" }, { step: "Animation", desc: "Conduite des activites" }, { step: "Suivi", desc: "Accompagnement des engagements" }],
    targets: ["Communes & quartiers", "Associations de jeunes", "Groupements de femmes", "Chefs de communaute", "Ecoles & lycees", "ONG locales"],
  },
];
export default function CollectivitesPage() {
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", email: "", organisation: "", service: "", description: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState<Service | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [mForm, setMForm] = useState({ name: "", phone: "", email: "", org: "", message: "" });
  const [mSending, setMSending] = useState(false);
  const [mSent, setMSent] = useState(false);

  function closeModal() { setActive(null); setShowForm(false); setMSent(false); setMForm({ name: "", phone: "", email: "", org: "", message: "" }); }

  async function handleModalSubmit(e: React.FormEvent) {
    e.preventDefault(); setMSending(true);
    const msg = encodeURIComponent(`DEMANDE - ${active?.title}\n\nNom : ${mForm.name}\nTel : ${mForm.phone}\nEmail : ${mForm.email || "-"}\nOrg : ${mForm.org || "-"}\n\n${mForm.message}`);
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
          eventType: "Collectivites - " + form.service,
          eventDate: new Date().toISOString(),
          eventLocation: form.organisation || "Non précisé",
          guestCount: 1,
          services: [form.service],
          description: form.description || "",
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
          <img src="https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=1600&q=80" alt="Collectivites" className="w-full h-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/10" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-2xl sm:text-2xl sm:text-4xl md:text-5xl font-bold mt-2 mb-4">Collectivites & Services</h1>
            <p className="text-gray-100 text-lg leading-relaxed">Coaching, accompagnement institutionnel et services aux collectivites du littoral ivoirien.</p>
            <a href="#demande" className="btn-primary mt-8 inline-flex">Faire une demande <ArrowRight size={18} /></a>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#f0f9ff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest">Nos services</span>
            <h2 className="section-title mt-2">Accompagnement & developpement</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((s) => (
              <button key={s.slug} onClick={() => { setActive(s); setShowForm(false); setMSent(false); }}
                className="group bg-white rounded-xl overflow-hidden shadow-sm card-hover border border-gray-100 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#c9a84c]">
                <div className="relative h-40 overflow-hidden">
                  <img src={s.image} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute inset-0 bg-[#c9a84c]/0 group-hover:bg-[#c9a84c]/15 transition-all duration-300" />
                  <div className="absolute top-2 right-2 w-7 h-7 bg-white/0 group-hover:bg-white/90 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100">
                    <ArrowRight size={13} className="text-[#0c4a6e]" />
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-[#0a1628] mb-2 group-hover:text-[#c9a84c] transition-colors">{s.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="demande" className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="section-title">Faire une demande</h2>
            <p className="text-gray-500 mt-2">Decrivez votre besoin, nous vous repondons sous 48h.</p>
          </div>
          {sent ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
              <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
              <h3 className="font-bold text-[#0c4a6e] text-lg mb-2">Demande envoyee !</h3>
              <p className="text-gray-500 text-sm">Notre equipe vous contactera sous 48h.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium text-gray-700 mb-1">Prenom *</label>
                  <input required type="text" placeholder="Jean" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" /></div>
                <div><label className="block text-xs font-medium text-gray-700 mb-1">Nom *</label>
                  <input required type="text" placeholder="Kouame" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium text-gray-700 mb-1">Telephone *</label>
                  <input required type="tel" placeholder="07 XX XX XX XX" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" /></div>
                <div><label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" placeholder="jean@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" /></div>
              </div>
              <div><label className="block text-xs font-medium text-gray-700 mb-1">Organisation / Collectivite</label>
                <input type="text" placeholder="Mairie de Grand-Bassam, ONG..." value={form.organisation} onChange={e => setForm(f => ({ ...f, organisation: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" /></div>
              <div><label className="block text-xs font-medium text-gray-700 mb-1">Service souhaite *</label>
                <select required value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8] bg-white">
                  <option value="">Selectionner...</option>
                  {SERVICES.map(s => <option key={s.slug} value={s.title}>{s.title}</option>)}
                </select></div>
              <div><label className="block text-xs font-medium text-gray-700 mb-1">Description du besoin</label>
                <textarea rows={3} placeholder="Decrivez votre projet ou besoin..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8] resize-none" /></div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60">
                {loading ? "Envoi..." : <><span>Envoyer ma demande</span><ArrowRight size={16} /></>}
              </button>
              <p className="text-xs text-gray-400 text-center">Reponse sous 48h - Gratuit et sans engagement</p>
            </form>
          )}
        </div>
      </section>

      <section className="py-16 bg-[#38bdf8] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Vous etes une collectivite ou une institution ?</h2>
          <p className="text-gray-200 mb-8">Contactez-nous directement pour un accompagnement personnalise.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#demande" className="btn-primary">Faire une demande <ArrowRight size={18} /></a>
            <a href="tel:+2250747722931" className="flex items-center gap-2 bg-white/10 border border-white/30 text-white font-bold px-5 py-3 rounded-xl hover:bg-white/20 transition-colors">
              <Phone size={18} /> 07 47 72 29 31
            </a>
          </div>
        </div>
      </section>

      {active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="relative h-44 rounded-t-2xl overflow-hidden shrink-0">
              <img src={active.image} alt={active.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-5 right-12">
                <span className="bg-[#c9a84c] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 w-fit mb-2">{active.icon} CéTIéRE</span>
                <h2 className="text-lg font-black text-white leading-tight">{active.title}</h2>
                <p className="text-white/70 text-xs mt-0.5">{active.subtitle}</p>
              </div>
              <button onClick={closeModal} className="absolute top-3 right-3 w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white transition-colors"><X size={16} /></button>
            </div>
            <div className="p-6 space-y-5">
              {showForm ? (
                mSent ? (
                  <div className="text-center py-8">
                    <CheckCircle size={52} className="text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-[#0c4a6e] mb-2">Demande envoyee !</h3>
                    <p className="text-gray-500 text-sm mb-6">Notre equipe vous contactera sous 48h.</p>
                    <button onClick={closeModal} className="btn-primary justify-center">Fermer</button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setShowForm(false)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#0c4a6e] transition-colors"><ChevronLeft size={16} /> Retour</button>
                      <h3 className="font-bold text-[#0c4a6e] text-sm">Demande - <span className="text-[#c9a84c]">{active.title}</span></h3>
                    </div>
                    <form onSubmit={handleModalSubmit} className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div><label className="block text-xs font-semibold text-gray-600 mb-1">Prenom / Nom *</label>
                          <input type="text" required value={mForm.name} onChange={e => setMForm(f => ({ ...f, name: e.target.value }))} placeholder="Jean Kouame" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" /></div>
                        <div><label className="block text-xs font-semibold text-gray-600 mb-1">Telephone *</label>
                          <input type="tel" required value={mForm.phone} onChange={e => setMForm(f => ({ ...f, phone: e.target.value }))} placeholder="07 XX XX XX XX" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" /></div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div><label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                          <input type="email" value={mForm.email} onChange={e => setMForm(f => ({ ...f, email: e.target.value }))} placeholder="jean@email.com" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" /></div>
                        <div><label className="block text-xs font-semibold text-gray-600 mb-1">Organisation</label>
                          <input type="text" value={mForm.org} onChange={e => setMForm(f => ({ ...f, org: e.target.value }))} placeholder="Mairie, ONG..." className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" /></div>
                      </div>
                      <div><label className="block text-xs font-semibold text-gray-600 mb-1">Votre besoin *</label>
                        <textarea required value={mForm.message} onChange={e => setMForm(f => ({ ...f, message: e.target.value }))} rows={4} maxLength={500}
                          placeholder={`Decrivez votre projet pour "${active.title}" : contexte, objectifs, delais...`}
                          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c] resize-none" />
                        <p className="text-xs text-gray-400 text-right">{mForm.message.length}/500</p></div>
                      <div className="flex gap-3">
                        <button type="submit" disabled={mSending} className="flex-1 btn-primary justify-center py-3 disabled:opacity-60">
                          {mSending ? <><Loader2 size={15} className="animate-spin" /> Envoi...</> : <>Envoyer <ArrowRight size={14} /></>}
                        </button>
                        <a href="tel:+2250747722931" className="flex items-center gap-2 border border-[#0c4a6e]/20 text-[#0c4a6e] text-sm font-semibold px-4 rounded-xl hover:bg-[#0c4a6e]/5 transition-colors"><Phone size={14} /></a>
                      </div>
                      <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-1"><Clock size={10} /> Reponse sous 48h - Gratuit & sans engagement</p>
                    </form>
                  </>
                )
              ) : (
                <>
                  <div>
                    <p className="text-sm text-gray-600 leading-relaxed mb-3">{active.longDesc}</p>
                    <div className="flex items-center gap-2 bg-[#f0f9ff] border border-[#bae6fd] rounded-xl px-4 py-2">
                      <span className="text-xs text-gray-500">Tarif indicatif :</span>
                      <span className="text-sm font-black text-[#c9a84c]">{active.priceRange}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0c4a6e] mb-3 flex items-center gap-2"><Check size={14} className="text-green-500" /> Ce qui est inclus</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {active.included.map(item => (
                        <div key={item} className="flex items-start gap-2 text-xs text-gray-600"><Check size={11} className="text-[#c9a84c] shrink-0 mt-0.5" /> {item}</div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0c4a6e] mb-3">Notre approche</h4>
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
                  <div>
                    <h4 className="text-sm font-bold text-[#0c4a6e] mb-2">Pour qui ?</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {active.targets.map(t => (
                        <span key={t} className="text-xs bg-[#f0f9ff] text-[#0c4a6e] px-2.5 py-1 rounded-full border border-[#bae6fd] font-medium">{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2 border-t border-gray-100">
                    <button onClick={() => setShowForm(true)} className="flex-1 btn-primary justify-center text-sm py-2.5">Faire une demande <ArrowRight size={14} /></button>
                    <a href="tel:+2250747722931" className="flex items-center gap-2 border border-[#0c4a6e]/20 text-[#0c4a6e] text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#0c4a6e]/5 transition-colors"><Phone size={14} /> Appeler</a>
                  </div>
                  <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-1"><Clock size={10} /> Reponse sous 48h - Gratuit & sans engagement</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

