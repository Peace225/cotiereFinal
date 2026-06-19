"use client";
import { useState, useEffect } from "react";
import { ArrowRight, Briefcase, CheckCircle, Phone, Loader2 } from "lucide-react";

const SECTEURS_FALLBACK = ["Tourisme", "Agro-alimentaire", "Pêche & aquaculture", "Immobilier", "Culture & arts", "Numérique", "Commerce", "Autre"];

type DbSecteur = { id: string; nom: string; categorie: string; couleur: string; description: string; image: string };

export default function OpportunitesPage() {
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", email: "", secteur: "", projet: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dbSecteurs, setDbSecteurs] = useState<DbSecteur[]>([]);
  const [secteursLoaded, setSecteursLoaded] = useState(false);

  // Charger les secteurs depuis l'API
  useEffect(() => {
    fetch("/api/opportunites/secteurs")
      .then(r => r.json())
      .then(d => {
        if (d.data?.length > 0) setDbSecteurs(d.data);
        setSecteursLoaded(true);
      })
      .catch(() => { setSecteursLoaded(true); });
  }, []);

  // Liste des noms de secteurs pour les selects
  const secteursList = dbSecteurs.length > 0 ? dbSecteurs.map(s => s.nom) : SECTEURS_FALLBACK;


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
            <p className="text-white text-lg font-medium">Identification, mise en relation, promotion et accompagnement dans les secteurs porteurs du littoral ivoirien.</p>
            <a href="#demande" className="btn-primary mt-8 inline-flex items-center gap-2">Soumettre un projet <ArrowRight size={18} /></a>
          </div>
        </div>
      </section>

      {/* Secteurs porteurs — dynamiques depuis la DB */}
      <section id="services" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title mb-10">Secteurs porteurs</h2>
          {!secteursLoaded ? (
            <div className="flex justify-center py-12">
              <Loader2 size={32} className="animate-spin text-[#c9a84c]" />
            </div>
          ) : dbSecteurs.length === 0 ? (
            <p className="text-center text-gray-400 py-12">Aucun secteur disponible pour le moment.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {dbSecteurs.map((s) => (
                <div key={s.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 transition-all hover:shadow-md hover:border-[#c9a84c]/30">
                  <div className="relative h-36 overflow-hidden bg-gray-100">
                    {s.image ? (
                      <img
                        src={s.image}
                        alt={s.nom}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0c4a6e]/10 to-[#c9a84c]/10">
                        <Briefcase size={40} className="text-[#0c4a6e]/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <span className={`absolute top-3 right-3 ${s.couleur} text-white text-xs font-bold px-2.5 py-1 rounded-full`}>
                      {s.categorie}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-[#0c4a6e] mb-2 group-hover:text-[#c9a84c] transition-colors">{s.nom}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">{s.description}</p>
                    <button
                      onClick={() => {
                        setForm(f => ({ ...f, secteur: s.nom }));
                        document.getElementById("demande")?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="mt-4 w-full flex items-center justify-center gap-2 bg-[#0c4a6e] hover:bg-[#c9a84c] text-white text-xs font-semibold py-2.5 rounded-lg transition-colors"
                    >
                      <ArrowRight size={13} /> Soumettre un projet
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
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
                  {secteursList.map(s => <option key={s} value={s}>{s}</option>)}
                </select></div>
              <div><label className="block text-xs font-medium text-gray-700 mb-1">Description du projet</label>
                <textarea rows={4} placeholder="Décrivez votre projet, vos besoins ou votre idée d'investissement..." value={form.projet} onChange={e => setForm(f => ({ ...f, projet: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8] resize-none" /></div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60">
                {loading ? "Envoi..." : <><span>Soumettre mon projet</span><ArrowRight size={16} /></>}
              </button>
              <p className="text-xs text-gray-400 text-center">Réponse sous 48h à Gratuit et confidentiel</p>
            </form>
          )}
        </div>
      </section>

      <section className="py-16 bg-[#0c4a6e] text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-black mb-4">Vous préférez nous appeler ?</h2>
          <p className="text-gray-300 mb-8">Notre équipe est disponible du lundi au samedi de 8h à 18h.</p>
          <a href="tel:+2250747722931" className="inline-flex items-center gap-2 bg-[#c9a84c] hover:bg-[#b8973b] text-white font-bold px-8 py-4 rounded-xl transition-colors">
            <Phone size={18} /> 07 47 72 29 31
          </a>
        </div>
      </section>

    </div>
  );
}