"use client";

import Link from "next/link";
import { Calendar, MapPin, Users, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

export default function PartenairesEvenementielsPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      {/* BANNIÃˆRE HERO */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[#003b95] text-white p-10 md:p-16 shadow-xl">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">
              <Sparkles size={14} /> Espace Ã‰vÃ©nementiel
            </span>
            <h1 className="text-3xl md:text-5xl font-black leading-tight mb-4">
              Partenaires Ã‰vÃ©nementiels
            </h1>
            <p className="text-white/80 text-sm md:text-base max-w-xl">
              Vous organisez des Ã©vÃ©nements, gÃ©rez des espaces de billetterie ou des stands ? Rejoignez notre rÃ©seau de partenaires et maximisez votre visibilitÃ©.
            </p>
          </div>
          <div className="absolute top-0 right-0 w-full md:w-1/2 h-full opacity-30 bg-[url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&q=80')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#003b95] via-[#003b95]/80 to-transparent"></div>
        </div>
      </div>

      {/* CONTENU / AVANTAGES */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <h2 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
              <ShieldCheck className="text-green-600" /> Pourquoi devenir partenaire ?
            </h2>
            <ul className="space-y-4 text-slate-600 text-sm leading-relaxed">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-50 text-[#003b95] font-bold flex items-center justify-center shrink-0 mt-0.5">âœ“</div>
                <span><strong>VisibilitÃ© accrue :</strong> Mettez en avant vos soirÃ©es, concerts, sÃ©minaires ou espaces rÃ©servÃ©s auprÃ¨s d'un large public ciblÃ©.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-50 text-[#003b95] font-bold flex items-center justify-center shrink-0 mt-0.5">âœ“</div>
                <span><strong>Gestion simplifiÃ©e :</strong> Profitez d'outils digitaux intÃ©grÃ©s (billetterie, rÃ©servation de stands, votes) pour gÃ©rer vos Ã©vÃ©nements en toute sÃ©rÃ©nitÃ©.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-50 text-[#003b95] font-bold flex items-center justify-center shrink-0 mt-0.5">âœ“</div>
                <span><strong>Support dÃ©diÃ© :</strong> BÃ©nÃ©ficiez d'un accompagnement sur mesure par l'Ã©quipe de CÃ´tiÃ¨re MÃ©dia Group pour la promotion de vos activitÃ©s.</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#0c4a6e] p-8 rounded-[2rem] text-white flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h3 className="text-lg font-black mb-1">Vous souhaitez franchir le cap ?</h3>
              <p className="text-white/80 text-xs max-w-md">Inscrivez-vous dÃ¨s maintenant et commencez Ã  configurer votre espace partenaire en quelques clics.</p>
            </div>
            <Link href="/inscription" className="bg-[#c9a84c] hover:bg-[#b8973b] text-white font-black px-6 py-3.5 rounded-xl text-sm transition-all shadow-lg flex items-center gap-2 shrink-0">
              S'inscrire comme partenaire <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* CARTE RÃ‰CAPITULATIVE */}
        <div>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm sticky top-28 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h4 className="font-black text-slate-900 text-base mb-2">AccÃ¨s rapide</h4>
              <p className="text-slate-500 text-xs leading-normal">GÃ©rez vos rÃ©servations d'Ã©vÃ©nements, stands et billetteries depuis votre tableau de bord sÃ©curisÃ©.</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-xl text-slate-700 font-bold text-xs">
                <Calendar size={16} className="text-[#003b95]" /> Calendrier d'Ã©vÃ©nements
              </div>
              <div className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-xl text-slate-700 font-bold text-xs">
                <Users size={16} className="text-[#003b95]" /> Gestion des rÃ©servations
              </div>
              <div className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-xl text-slate-700 font-bold text-xs">
                <MapPin size={16} className="text-[#003b95]" /> ContrÃ´le d'accÃ¨s
              </div>
            </div>

            <Link href="/connexion" className="w-full block text-center bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3.5 rounded-xl text-sm transition-colors mt-2">
              Connexion au Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

