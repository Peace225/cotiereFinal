// app/inscription/page.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, User, Mail, Phone, Lock, CheckCircle2, MessageCircle, ShieldCheck, Briefcase } from "lucide-react";

// Remplace par le VRAI numéro WhatsApp de l'administrateur (sans le + et avec l'indicatif)
const ADMIN_WHATSAPP = "2250704281719"; 

export default function InscriptionPartenairePage() {
  const [form, setForm] = useState({ 
    firstName: "", 
    lastName: "", 
    email: "", 
    password: "", 
    phone: "",
    activity: "" // Nouveau champ pour le secteur d'activité
  });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Liste des secteurs d'activité
  const activites = [
    "Hôtel & Hébergement",
    "Restaurant & Gastronomie",
    "Résidence Meublée",
    "Événementiel",
    "Musique & Management",
    "Market & Distribution",
    "Tourisme & Voyage",
    "Autre"
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Validation du secteur d'activité
    if (!form.activity) {
      setError("Veuillez sélectionner un secteur d'activité.");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      // 1. (Optionnel) Sauvegarde en base de données via ton API
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, isPartnerRequest: true }), 
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || "Une erreur est survenue lors de l'inscription.");
        setLoading(false);
        return;
      }

      // 2. Génération du message WhatsApp pour l'admin
      const message = `*NOUVELLE DEMANDE PARTENAIRE - CÔTIÈRE MEDIA* 🚀\n\n` +
        `*Nom :* ${form.lastName} ${form.firstName}\n` +
        `*Email :* ${form.email}\n` +
        `*WhatsApp :* ${form.phone}\n` +
        `*Secteur d'activité :* ${form.activity}\n\n` +
        `Je viens de soumettre mon formulaire d'inscription et je souhaite recevoir mon *Code Marchand* pour activer mon Dashboard.`;

      const whatsappUrl = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(message)}`;
      
      // Ouvre WhatsApp dans un nouvel onglet
      window.open(whatsappUrl, "_blank");

      // 3. Affiche l'écran de succès
      setIsSubmitted(true);
      
    } catch (err) {
      setError("Impossible de contacter le serveur. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }

  // --- VUE SUCCÈS (APRÈS SOUMISSION) ---
  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f9ff] px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-blue-100 p-8 text-center animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="!text-[18px] md:!text-[20px]font-black text-slate-900 mb-2">Demande envoyée !</h2>
          <p className="text-slate-600 mb-6">
            Si WhatsApp ne s'est pas ouvert automatiquement, cliquez sur le bouton ci-dessous pour envoyer vos informations à l'administrateur.
          </p>
          <div className="bg-blue-50 p-4 rounded-xl text-left mb-8 border border-blue-100">
            <p className="text-sm font-bold text-blue-900 flex items-center gap-2 mb-2">
              <MessageCircle size={18} /> Prochaine étape :
            </p>
            <p className="text-sm text-blue-800">
              L'administrateur va vérifier votre demande et vous transmettra votre <strong>Code Marchand</strong> directement dans la discussion WhatsApp.
            </p>
          </div>
          <Link href="/" className="inline-block bg-[#0c4a6e] text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-900 transition">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  // --- VUE FORMULAIRE D'INSCRIPTION ---
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f9ff] px-4 py-12">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-start">
        
        {/* COLONNE GAUCHE : EXPLICATION DE LA PROCÉDURE */}
        <div className="md:sticky md:top-12">
          <div className="mb-8">
            <Link href="/" className="inline-block">
              <span className="text-[#c9a84c] font-black text-2xl">CÔTIÈRE</span>
              <span className="text-[#0c4a6e] font-light text-lg ml-1">MEDIA GROUP</span>
            </Link>
            <h1 className="!text-[20px] md:!text-[25px] font-black text-[#0c4a6e] mt-6 leading-tight">
              Devenez Partenaire et boostez votre visibilité
            </h1>
            <p className="text-sm-600 mt-4 text-lg">
              Une procédure sécurisée et rapide pour accéder à votre espace de gestion dédié.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <h3 className="!text-[11px] md:!text-[12px] font-black text-slate-900 mb-6 flex items-center gap-2">
              <ShieldCheck className="text-blue-600" /> Procédure d'activation
            </h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-black flex items-center justify-center shrink-0">1</div>
                <div>
                  <h4 className="!text-[10px] md:!text-[11px] font-bold text-slate-900">Soumission</h4>
                  <p className="text-sm text-slate-500 mt-1">Remplissez le formulaire. Vous serez redirigé vers WhatsApp pour finaliser.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-black flex items-center justify-center shrink-0">2</div>
                <div>
                  <h4 className="!text-[10px] md:!text-[11px] font-bold text-slate-900">Code Marchand</h4>
                  <p className="text-sm text-slate-500 mt-1">L'administrateur vous transmet votre code de paiement sécurisé via WhatsApp.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#c9a84c] text-white font-black flex items-center justify-center shrink-0">3</div>
                <div>
                  <h4 className="!text-[10px] md:!text-[11px] font-bold text-slate-900">Activation</h4>
                  <p className="text-sm text-slate-500 mt-1">Une fois le paiement validé, vos accès au Dashboard sont débloqués instantanément.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COLONNE DROITE : FORMULAIRE */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <h2 className="!text-[20px] md:!text-[22px] font-bold text-slate-900 mb-6">Formulaire de demande</h2>
          
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-6 border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Prénom</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" required placeholder="Jean"
                    value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })}
                    className="w-full pl-10 pr-3 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Nom</label>
                <input type="text" required placeholder="Kouamé"
                  value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Email professionnel</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" required placeholder="contact@entreprise.com"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Numéro WhatsApp</label>
              <div className="relative">
                <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="tel" required placeholder="+225 07 XX XX XX XX"
                  value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors" />
              </div>
            </div>

            {/* NOUVEAU CHAMP : SECTEUR D'ACTIVITÉ */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Secteur d'activité</label>
              <div className="relative">
                <Briefcase size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <select 
                  required
                  value={form.activity} 
                  onChange={e => setForm({ ...form, activity: e.target.value })}
                  className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors appearance-none"
                >
                  <option value="" disabled>Sélectionnez votre domaine</option>
                  {activites.map((act, index) => (
                    <option key={index} value={act}>{act}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Mot de passe du Dashboard</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type={showPwd ? "text" : "password"} required placeholder="Min. 8 caractères"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-10 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors" />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors">
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-2">Ce mot de passe restera confidentiel (non envoyé sur WhatsApp).</p>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-[#0c4a6e] hover:bg-blue-900 disabled:opacity-70 text-white font-black text-lg py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 mt-4 shadow-lg shadow-blue-900/20">
              {loading ? "Génération en cours..." : <><span>Soumettre</span><ArrowRight size={20} /></>}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-8">
            Vous avez déjà été validé ?{" "}
            <Link href="/connexion" className="text-[#c9a84c] font-black hover:underline">
              Accéder au Dashboard
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}