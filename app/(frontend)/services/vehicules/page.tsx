"use client";
import { useState } from "react";
import { ArrowRight, Phone, Car, Shield, Clock, MapPin, X, CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";

const vehicules = [
  { id: "citadine", nom: "Voiture Citadine", categorie: "Ã‰conomique", description: "IdÃ©ale pour les dÃ©placements en ville. ClimatisÃ©e, Ã©conomique en carburant.", prix: "15 000 FCFA/jour", caution: "50 000 FCFA", places: 5, image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=80" },
  { id: "suv", nom: "4x4 / SUV", categorie: "Tout-terrain", description: "Parfait pour les excursions et les routes difficiles du littoral. Confort et puissance.", prix: "35 000 FCFA/jour", caution: "150 000 FCFA", places: 7, image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&q=80" },
  { id: "moto", nom: "Moto / Scooter", categorie: "Deux-roues", description: "Pratique pour se dÃ©placer rapidement dans les ruelles et sur la cÃ´te.", prix: "8 000 FCFA/jour", caution: "30 000 FCFA", places: 2, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80" },
  { id: "avec-chauffeur", nom: "Avec Chauffeur", categorie: "Service premium", description: "Chauffeur professionnel disponible 24h/24. ConnaÃ®t parfaitement le littoral ivoirien.", prix: "50 000 FCFA/jour", caution: "Aucune", places: 4, image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&q=80" },
  { id: "minibus", nom: "Bus / Minibus", categorie: "Groupe", description: "Pour vos sorties en groupe, excursions et transferts d'Ã©quipes. ClimatisÃ©.", prix: "80 000 FCFA/jour", caution: "200 000 FCFA", places: 20, image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80" },
  { id: "luxe", nom: "VÃ©hicule de Luxe", categorie: "Premium", description: "Mercedes, BMW ou Ã©quivalent pour vos occasions spÃ©ciales et dÃ©placements VIP.", prix: "100 000 FCFA/jour", caution: "500 000 FCFA", places: 5, image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80" },
];

const avantages = [
  { icon: Shield, label: "Assurance incluse", desc: "Tous nos vÃ©hicules sont assurÃ©s" },
  { icon: Clock, label: "Disponible 24h/24", desc: "Service disponible Ã  toute heure" },
  { icon: MapPin, label: "Livraison possible", desc: "Livraison Ã  votre hÃ´tel ou adresse" },
  { icon: Car, label: "Flotte rÃ©cente", desc: "VÃ©hicules de moins de 3 ans" },
];

type Vehicule = typeof vehicules[0];

function ReservationVehiculeModal({ vehicule, onClose }: { vehicule: Vehicule; onClose: () => void }) {
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", email: "", dateDebut: "", dateFin: "", adresse: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.firstName || !form.phone || !form.dateDebut) { setErr("Veuillez remplir les champs obligatoires."); return; }
    setSending(true); setErr("");
    try {
      await fetch("/api/events/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientFirstName: form.firstName,
          clientLastName: form.lastName || "-",
          clientPhone: form.phone,
          clientEmail: form.email || null,
          eventType: "Vehicule - " + vehicule.nom,
          eventDate: new Date(form.dateDebut).toISOString(),
          eventLocation: form.adresse || "Ã€ dÃ©finir",
          guestCount: vehicule.places,
          services: [vehicule.nom],
          description: `VÃ©hicule : ${vehicule.nom} (${vehicule.prix})\nDu : ${form.dateDebut}\nAu : ${form.dateFin || "Ã€ dÃ©finir"}\nAdresse : ${form.adresse || "Ã€ dÃ©finir"}`,
        }),
      });
      setSent(true);
    } catch { setErr("Erreur lors de l'envoi. RÃ©essayez."); }
    setSending(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-[#0c4a6e]">RÃ©server â€” {vehicule.nom}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{vehicule.prix} Â· {vehicule.places} places</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <div className="p-5">
          {sent ? (
            <div className="text-center py-8">
              <CheckCircle size={52} className="text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-[#0c4a6e] mb-2">Demande envoyÃ©e !</h3>
              <p className="text-gray-500 text-sm mb-6">Notre Ã©quipe vous contactera sous 24h pour confirmer la rÃ©servation.</p>
              <button onClick={onClose} className="btn-primary justify-center">Fermer</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">PrÃ©nom *</label>
                  <input required type="text" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} placeholder="Jean" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Nom</label>
                  <input type="text" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} placeholder="KouamÃ©" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">TÃ©lÃ©phone *</label>
                  <input required type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="07 XX XX XX XX" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="jean@email.com" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Date de dÃ©but *</label>
                  <input required type="date" value={form.dateDebut} onChange={e => setForm(f => ({ ...f, dateDebut: e.target.value }))} min={new Date().toISOString().split("T")[0]} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Date de fin</label>
                  <input type="date" value={form.dateFin} onChange={e => setForm(f => ({ ...f, dateFin: e.target.value }))} min={form.dateDebut || new Date().toISOString().split("T")[0]} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Adresse de livraison</label>
                <input type="text" value={form.adresse} onChange={e => setForm(f => ({ ...f, adresse: e.target.value }))} placeholder="HÃ´tel, adresse ou lieu de prise en charge" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
              </div>
              {err && <p className="text-red-500 text-xs bg-red-50 px-3 py-2 rounded-lg">{err}</p>}
              <div className="flex gap-3 pt-1">
                <button type="submit" disabled={sending} className="flex-1 btn-primary justify-center py-3 disabled:opacity-60">
                  {sending ? <><Loader2 size={15} className="animate-spin" /> Envoi...</> : <>Confirmer la rÃ©servation <ArrowRight size={14} /></>}
                </button>
                <a href="tel:+2250747722931" className="flex items-center gap-2 border border-[#0c4a6e]/20 text-[#0c4a6e] text-sm font-semibold px-4 rounded-xl hover:bg-[#0c4a6e]/5 transition-colors">
                  <Phone size={14} />
                </a>
              </div>
              <p className="text-xs text-gray-400 text-center">RÃ©ponse sous 24h Â· Sans engagement</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VehiculesPage() {
  const [selected, setSelected] = useState<Vehicule | null>(null);

  return (
    <div className="min-h-screen">
      <section className="relative text-white py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1600&q=80" alt="Location VÃ©hicules" className="w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest">Location de vÃ©hicules</span>
            <h1 className="text-2xl sm:text-2xl sm:text-4xl md:text-5xl font-bold mt-2 mb-4">Location VÃ©hicules</h1>
            <p className="text-gray-100 text-lg leading-relaxed">
              Voitures, 4x4, motos, bus et vÃ©hicules avec chauffeur pour tous vos dÃ©placements sur le littoral ivoirien.
            </p>
            <div className="flex gap-3 mt-8">
              <a href="#catalogue" className="btn-primary inline-flex items-center gap-2">Voir les vÃ©hicules <ArrowRight size={18} /></a>
              <a href="tel:+2250747722931" className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-bold px-5 py-3 rounded-xl hover:bg-white/20 transition-colors">
                <Phone size={18} /> RÃ©server
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 bg-[#f0f9ff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {avantages.map(a => {
              const Icon = a.icon;
              return (
                <div key={a.label} className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-100">
                  <div className="w-12 h-12 bg-[#0c4a6e]/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Icon size={22} className="text-[#0c4a6e]" />
                  </div>
                  <p className="font-bold text-[#0c4a6e] text-sm mb-1">{a.label}</p>
                  <p className="text-gray-400 text-xs">{a.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="catalogue" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest">Notre flotte</span>
            <h2 className="section-title mt-2">Choisissez votre vÃ©hicule</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicules.map(v => (
              <div key={v.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 card-hover">
                <div className="relative h-44">
                  <img src={v.image} alt={v.nom} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 bg-[#c9a84c] text-white text-xs font-bold px-2.5 py-1 rounded-full">{v.categorie}</span>
                  <span className="absolute top-3 right-3 bg-white/90 text-[#0c4a6e] text-xs font-bold px-2.5 py-1 rounded-full">{v.places} places</span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-[#0c4a6e] mb-1">{v.nom}</h3>
                  <p className="text-xs text-gray-500 mb-2">{v.description}</p>
                  <div className="flex justify-between text-xs mb-4">
                    <span className="font-bold text-[#c9a84c]">{v.prix}</span>
                    <span className="text-gray-400">Caution: {v.caution}</span>
                  </div>
                  <button onClick={() => setSelected(v)} className="btn-primary w-full justify-center text-sm py-2">
                    RÃ©server <ArrowRight size={14} />
                  </button>
                  <Link href={"/services/vehicules/" + v.id} className="mt-2 w-full flex items-center justify-center gap-1 text-sm font-semibold text-[#0c4a6e] border border-[#0c4a6e]/20 rounded-xl py-2 hover:bg-[#0c4a6e]/5 transition-colors">
                    Voir dÃ©tail <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0c4a6e] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Besoin d&apos;un vÃ©hicule sur mesure ?</h2>
          <p className="text-gray-300 mb-8">Contactez-nous pour un devis personnalisÃ© ou une location longue durÃ©e.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="btn-primary inline-flex items-center gap-2">Nous contacter <ArrowRight size={18} /></Link>
            <a href="tel:+2250747722931" className="flex items-center gap-2 bg-white/10 border border-white/30 text-white font-bold px-5 py-3 rounded-xl hover:bg-white/20 transition-colors">
              <Phone size={18} /> 07 47 72 29 31
            </a>
          </div>
        </div>
      </section>

      {selected && <ReservationVehiculeModal vehicule={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}



