"use client";
import { useState, useEffect } from "react";
import { ArrowRight, X, Phone, Clock, Music, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";

type DbService = {
  id: string; nom: string; categorie: string; prix: string; description: string; image: string;
};

const packs = [
  { id: "pack-demo",   label: "Pack Démo",   price: "50 000 FCFA",  desc: "2h studio + mixage basique",        featured: false, image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&q=80" },
  { id: "pack-single", label: "Pack Single", price: "150 000 FCFA", desc: "4h studio + mixage pro + mastering", featured: true,  image: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=600&q=80" },
  { id: "pack-album",  label: "Pack Album",  price: "Sur devis",    desc: "Sessions illimitées + management",   featured: false, image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80" },
];

export default function MusicPage() {
  const [services, setServices] = useState<DbService[]>([]);
  const [servicesLoaded, setServicesLoaded] = useState(false);
  const [activeService, setActiveService] = useState<DbService | null>(null);
  const [form, setForm] = useState({ firstName: "", phone: "", projectDesc: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetch("/api/musique/services")
      .then(r => r.json())
      .then(d => { if (d.data?.length > 0) setServices(d.data); setServicesLoaded(true); })
      .catch(() => setServicesLoaded(true));
  }, []);

  function closeModal() {
    setActiveService(null);
    setSent(false);
    setFormError("");
    setForm({ firstName: "", phone: "", projectDesc: "" });
  }

  async function handleDevisSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.firstName || !form.phone || !form.projectDesc) {
      setFormError("Veuillez remplir les champs obligatoires.");
      return;
    }
    setSending(true);
    setFormError("");
    const msg = encodeURIComponent(
      `DEMANDE DE DEVIS — ${activeService?.nom}\n\nNom : ${form.firstName}\nTél : ${form.phone}\n\nProjet :\n${form.projectDesc}`
    );
    setTimeout(() => {
      window.open(`https://wa.me/2250747722931?text=${msg}`, "_blank");
      setSending(false);
      setSent(true);
    }, 800);
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative text-white py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1600&q=80" alt="Studio musique" className="w-full h-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/10" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mt-2 mb-2">CÔTIÈRE MUSIC & MANAGEMENT</h1>
            <p className="text-[#c9a84c] font-semibold text-lg mb-3">« Nous apportons une valeur ajoutée à votre talent »</p>
            <p className="text-gray-100 text-lg leading-relaxed">
              Label musical professionnel : studio d'enregistrement, mixage, mastering, management d'artistes et organisation de concerts sur le littoral ivoirien.
            </p>
            <a href="#packs" className="btn-primary mt-8 inline-flex">Voir nos packs <ArrowRight size={18} /></a>
          </div>
        </div>
      </section>

      {/* Services dynamiques depuis la DB */}
      <section className="py-16 bg-[#f0f9ff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-center mb-10">Nos services musicaux</h2>
          {!servicesLoaded ? (
            <div className="flex justify-center py-12">
              <Loader2 size={32} className="animate-spin text-[#c9a84c]" />
            </div>
          ) : services.length === 0 ? (
            <p className="text-center text-gray-400 py-8">Aucun service disponible pour le moment.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {services.map((s) => (
                <button key={s.id} onClick={() => setActiveService(s)}
                  className="group relative rounded-xl overflow-hidden shadow-sm card-hover text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#c9a84c]">
                  <div className="relative h-36">
                    <img src={s.image} alt={s.nom}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={e => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&q=80"; }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute inset-0 bg-[#c9a84c]/0 group-hover:bg-[#c9a84c]/20 transition-all duration-300" />
                    <p className="absolute bottom-3 left-3 right-3 text-white text-xs font-semibold leading-tight">{s.nom}</p>
                    {s.prix && (
                      <span className="absolute top-2 left-2 bg-[#c9a84c] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {s.prix}
                      </span>
                    )}
                    <span className="absolute top-2 right-2 bg-purple-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {s.categorie}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Packs */}
      <section id="packs" className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="section-title mb-10">Nos packs studio</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packs.map((p) => (
              <div key={p.label} className={`group relative rounded-2xl overflow-hidden shadow-md card-hover ${p.featured ? "ring-2 ring-[#c9a84c]" : ""}`}>
                <div className="relative h-44">
                  <img src={p.image} alt={p.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  {p.featured && <span className="absolute top-3 left-3 bg-[#c9a84c] text-white text-xs font-bold px-3 py-1 rounded-full">Populaire</span>}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-bold text-white text-base">{p.label}</h3>
                    <p className="text-[#c9a84c] font-bold text-lg">{p.price}</p>
                  </div>
                </div>
                <div className="bg-white p-4">
                  <p className="text-gray-500 text-sm mb-4">{p.desc}</p>
                  <a href={`https://wa.me/2250747722931?text=${encodeURIComponent(`Réservation Studio Musique\n\n${p.label} - ${p.price}\n${p.desc}\n\nBonjour, je souhaite réserver ce pack studio.`)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="btn-primary w-full justify-center text-sm py-2">
                    Réserver <ArrowRight size={14} />
                  </a>
                  <Link href={`/services/music/${p.id}`}
                    className="mt-2 w-full flex items-center justify-center gap-1 text-sm font-semibold text-[#0c4a6e] border border-[#0c4a6e]/20 rounded-xl py-2 hover:bg-[#0c4a6e]/5 transition-colors">
                    Voir détail <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#0c4a6e] text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-black mb-4">Prêt à enregistrer votre prochain titre ?</h2>
          <p className="text-gray-300 mb-8">Notre studio est disponible 7j/7. Contactez-nous pour réserver votre session.</p>
          <a href="tel:+2250747722931" className="inline-flex items-center gap-2 bg-[#c9a84c] hover:bg-[#b8973b] text-white font-bold px-8 py-4 rounded-xl transition-colors">
            <Phone size={18} /> 07 47 72 29 31
          </a>
        </div>
      </section>

      {/* Modal service */}
      {activeService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="relative h-48 rounded-t-2xl overflow-hidden">
              <img src={activeService.image} alt={activeService.nom} className="w-full h-full object-cover"
                onError={e => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&q=80"; }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-5 right-12">
                <span className="bg-[#c9a84c] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 w-fit mb-2">
                  <Music size={12} /> CÔTIÈRE MUSIC
                </span>
                <h2 className="text-xl font-black text-white leading-tight">{activeService.nom}</h2>
                <p className="text-[#c9a84c] font-bold text-sm mt-0.5">{activeService.prix}</p>
              </div>
              <button onClick={closeModal} className="absolute top-3 right-3 w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {sent ? (
                <div className="text-center py-6">
                  <CheckCircle size={48} className="text-green-500 mx-auto mb-3" />
                  <h3 className="font-bold text-[#0c4a6e] text-lg mb-2">Demande envoyée !</h3>
                  <p className="text-gray-500 text-sm mb-4">Notre équipe vous contactera sous 24h.</p>
                  <button onClick={closeModal} className="btn-primary justify-center">Fermer</button>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-600 leading-relaxed">{activeService.description}</p>
                  <div className="bg-[#f0f9ff] rounded-xl p-3 border border-[#bae6fd]">
                    <p className="text-xs text-gray-500">Tarif : <span className="font-bold text-[#c9a84c]">{activeService.prix}</span></p>
                  </div>
                  <form onSubmit={handleDevisSubmit} className="space-y-3 pt-2 border-t border-gray-100">
                    <h4 className="text-sm font-bold text-[#0c4a6e]">Demander un devis</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Prénom *</label>
                        <input type="text" required value={form.firstName}
                          onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                          placeholder="Jean"
                          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Téléphone *</label>
                        <input type="tel" required value={form.phone}
                          onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                          placeholder="07 XX XX XX XX"
                          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Description du projet *</label>
                      <textarea required value={form.projectDesc}
                        onChange={e => setForm(f => ({ ...f, projectDesc: e.target.value }))}
                        rows={3} maxLength={400}
                        placeholder={`Décrivez votre projet pour "${activeService.nom}"...`}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c] resize-none" />
                    </div>
                    {formError && <p className="text-red-500 text-xs bg-red-50 px-3 py-2 rounded-lg">{formError}</p>}
                    <div className="flex gap-3">
                      <button type="submit" disabled={sending} className="flex-1 btn-primary justify-center py-2.5 disabled:opacity-60">
                        {sending ? <><Loader2 size={14} className="animate-spin" /> Envoi...</> : <>Envoyer <ArrowRight size={14} /></>}
                      </button>
                      <a href="tel:+2250747722931" className="flex items-center gap-2 border border-[#0c4a6e]/20 text-[#0c4a6e] text-sm font-semibold px-4 rounded-xl hover:bg-[#0c4a6e]/5 transition-colors">
                        <Phone size={14} />
                      </a>
                    </div>
                    <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-1">
                      <Clock size={10} /> Réponse sous 24h · Devis gratuit
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
