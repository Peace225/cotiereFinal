"use client";

import React, { useState } from 'react';
import { MailCheck, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function SubmitPage() {
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({ 
    category: '', 
    companyName: '', 
    whatsappNumber: '', 
    email: '' 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await supabase.from('partner_applications').insert([{ ...formData, status: 'pending' }]);
      const message = `Nouvelle demande de partenariat : ${formData.companyName} (${formData.category}). Email: ${formData.email}. WhatsApp: ${formData.whatsappNumber}.`;
      window.open(`https://wa.me/2250704281719?text=${encodeURIComponent(message)}`, '_blank');
      setIsSubmitted(true);
    } catch (error) { 
      console.error(error); 
    } finally { 
      setLoading(false); 
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#faf8f4] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-[2rem] p-10 text-center shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] border border-slate-100">
          <div className="w-20 h-20 bg-[#c9a84c]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-[#c9a84c]" />
          </div>
          <h2 className="text-2xl font-black mb-4">Demande transmise</h2>
          <p className="text-sm text-slate-500 mb-8">Votre dossier est en cours d'analyse. Un administrateur vous contactera via WhatsApp pour le <strong>code marchand</strong>.</p>
          <Link href="/" className="block w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all">Retour accueil</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f4] py-12 px-6">
      <div className="max-w-5xl mx-auto mt-20"> {/* mt-20 pour descendre le contenu */}
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Devenez Partenaire</h1>
          <p className="text-slate-500 text-sm max-w-lg mx-auto">Rejoignez l'écosystème COTIÈRE. Procédure simple, rapide et premium.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Procédure */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
              <h3 className="text-sm font-bold mb-6 flex items-center gap-2"><ShieldCheck className="text-[#0c4a6e] w-5 h-5" /> Procédure</h3>
              <div className="space-y-6">
                {[
                  { n: "1", title: "Soumission", desc: "Remplissez ce formulaire sécurisé." },
                  { n: "2", title: "Code Marchand", desc: "Réception du code de paiement via WhatsApp." },
                  { n: "3", title: "Activation", desc: "Paiement validé, mise en ligne immédiate." }
                ].map((s, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#0c4a6e]/5 flex items-center justify-center text-[#0c4a6e] font-bold text-xs">{s.n}</div>
                    <div>
                      <p className="font-bold text-xs">{s.title}</p>
                      <p className="text-[11px] text-slate-400">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <div className="lg:col-span-8 bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-slate-100">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <select name="category" onChange={handleChange} className="md:col-span-2 p-4 bg-slate-50 border-0 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#c9a84c]" required>
                <option value="">Secteur d'activité</option>
                <option value="hotel">Hôtel / Résidence</option>
                <option value="evenement">Événementiel</option>
                <option value="musique">Musique</option>
              </select>
              <input name="companyName" onChange={handleChange} placeholder="Nom de la structure" className="p-4 bg-slate-50 border-0 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#c9a84c]" required />
              <input name="whatsappNumber" onChange={handleChange} placeholder="Numéro WhatsApp" className="p-4 bg-slate-50 border-0 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#c9a84c]" required />
              <input name="email" onChange={handleChange} placeholder="Email professionnel" className="md:col-span-2 p-4 bg-slate-50 border-0 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#c9a84c]" required />
              
              <button type="submit" className="md:col-span-2 bg-[#0c4a6e] text-white py-4 rounded-2xl font-bold text-sm hover:bg-[#093954] transition-all flex items-center justify-center gap-2">
                {loading ? "Traitement..." : <>Valider la demande <ArrowRight size={16} /></>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}