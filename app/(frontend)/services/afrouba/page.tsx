"use client";

import { useState, useEffect } from "react";
import { ArrowRight, CheckCircle, Loader2 } from "lucide-react";

// Force le rendu dynamique pour Ã©viter les erreurs de gÃ©nÃ©ration statique au build
export const dynamic = 'force-dynamic';

type DbSupport = {
  id: string; nom: string; categorie: string; prix: string; description: string; image: string;
};

const packs = [
  { label: "Pack Starter", price: "75 000 FCFA", desc: "IdÃ©al pour les petits commerces et artisans", included: ["1 spot radio (30s) Ã— 10 passages", "1 post sponsorisÃ© Facebook/Instagram", "Conception du visuel incluse"], featured: false },
  { label: "Pack VisibilitÃ©", price: "200 000 FCFA", desc: "Pour les PME et commerÃ§ants du littoral", included: ["1 spot TV (30s) Ã— 5 passages", "1 spot radio Ã— 20 passages", "Campagne rÃ©seaux sociaux 7 jours", "SMS marketing 500 contacts", "Conception complÃ¨te incluse"], featured: true },
  { label: "Pack Premium", price: "Sur devis", desc: "Pour les grandes entreprises et institutions", included: ["Campagne multi-supports illimitÃ©e", "Spot TV + Radio + Web", "Affichage physique", "Reporting mensuel", "Accompagnement stratÃ©gique"], featured: false },
];

const etapes = [
  { num: "01", title: "Contactez-nous", desc: "DÃ©crivez votre activitÃ© et vos objectifs de visibilitÃ©." },
  { num: "02", title: "Devis personnalisÃ©", desc: "Nous vous proposons un plan de communication adaptÃ© Ã  votre budget." },
  { num: "03", title: "CrÃ©ation des supports", desc: "Notre Ã©quipe crÃ©e vos visuels, spots et contenus publicitaires." },
  { num: "04", title: "Diffusion & suivi", desc: "Vos publicitÃ©s sont diffusÃ©es et nous vous envoyons un rapport." },
];

export default function AfroubaPage() {
  const [supports, setSupports] = useState<DbSupport[]>([]);
  const [supportsLoaded, setSupportsLoaded] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", email: "", support: "", budget: "", description: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  const [packSent, setPackSent] = useState(false);
  const [packLoading, setPackLoading] = useState(false);
  const [packForm, setPackForm] = useState({ firstName: "", lastName: "", phone: "", email: "", description: "" });

  useEffect(() => {
    fetch("/api/afrouba/supports")
      .then(r => r.json())
      .then(d => { if (d.data?.length > 0) setSupports(d.data); setSupportsLoaded(true); })
      .catch(() => setSupportsLoaded(true));
  }, []);

  async function handlePackSubmit(e: React.FormEvent) {
    e.preventDefault(); setPackLoading(true);
    try {
      await fetch("/api/afrouba", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientFirstName: packForm.firstName, clientLastName: packForm.lastName, clientPhone: packForm.phone, clientEmail: packForm.email, documentType: selectedPack, description: packForm.description }),
      });
      const msg = encodeURIComponent(`COMMANDE PACK: ${selectedPack}\nClient: ${packForm.firstName} ${packForm.lastName}\nTel: ${packForm.phone}`);
      if (typeof window !== "undefined") window.open(`https://wa.me/2250747722931?text=${msg}`, "_blank");
      setPackSent(true);
    } catch {}
    setPackLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true);
    try {
      await fetch("/api/afrouba", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientFirstName: form.firstName, clientLastName: form.lastName, clientPhone: form.phone, clientEmail: form.email, documentType: form.support, description: `Budget: ${form.budget || "Non prÃ©cisÃ©"} | ${form.description}` }),
      });
      const msg = encodeURIComponent(`DEMANDE PUBLICITÃ‰ â€” ${form.support}\nClient: ${form.firstName} ${form.lastName}\nTel: ${form.phone}`);
      if (typeof window !== "undefined") window.open(`https://wa.me/2250747722931?text=${msg}`, "_blank");
      setSent(true);
    } catch {}
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-[#0c4a6e] text-white py-20 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Tout Le Monde A Droit Ã€ La Pub</h1>
        <p className="max-w-2xl mx-auto text-lg opacity-90">TV, Radio, Web, SMS et Affichage pour booster votre visibilitÃ© sur le littoral.</p>
      </section>

      <div className="max-w-7xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Nos solutions publicitaires</h2>
        {!supportsLoaded ? <div className="text-center"><Loader2 className="animate-spin mx-auto" /></div> :
        <div className="grid md:grid-cols-3 gap-6">
          {supports.map(s => (
            <div key={s.id} className="bg-white p-6 rounded-2xl shadow-sm border">
              <h3 className="font-bold text-xl mb-2">{s.nom}</h3>
              <p className="text-sm text-gray-600 mb-4">{s.description}</p>
              <button onClick={() => setForm({...form, support: s.nom})} className="text-[#c9a84c] font-bold flex items-center gap-2">Demander un devis <ArrowRight size={16} /></button>
            </div>
          ))}
        </div>}
      </div>

      <section className="py-16 bg-[#f0f9ff]">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-12">Packs publicitaires</h2>
            <div className="grid md:grid-cols-3 gap-6">
                {packs.map(p => (
                    <div key={p.label} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h4 className="font-bold text-lg">{p.label}</h4>
                        <p className="text-2xl font-black text-[#c9a84c]">{p.price}</p>
                        <button onClick={() => setSelectedPack(p.label)} className="w-full mt-4 bg-[#c9a84c] text-white py-2 rounded-lg font-bold">Commander</button>
                    </div>
                ))}
            </div>
        </div>
      </section>
    </div>
  );
}

