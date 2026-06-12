// app/dashboard-partner/opportunite/page.jsx
"use client";

import React from 'react';
import { Briefcase, TrendingUp, Target, Building, FileText, Globe } from 'lucide-react';

export default function OpportunitePage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Opportunité enregistrée");
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-3xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <Briefcase className="text-green-700" /> Nouvelle Opportunité d'Affaire
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Titre et Secteur */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            type="text" 
            placeholder="Titre de l'opportunité" 
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-gray-800" 
            required 
          />
          <input 
            type="text" 
            placeholder="Secteur d'activité" 
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-gray-800" 
            required 
          />
        </div>

        {/* Type d'opportunité */}
        <div className="space-y-2">
          <label className="font-semibold text-gray-700 flex items-center gap-2">
            <Target className="w-5 h-5 text-green-700" /> Type d'opportunité
          </label>
          <select className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-gray-800 cursor-pointer appearance-none bg-white">
            <option value="">Sélectionnez le type</option>
            <option value="investissement">Investissement</option>
            <option value="franchise">Franchise / Partenariat</option>
            <option value="recrutement">Recrutement / Talents</option>
            <option value="autre">Autre</option>
          </select>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="font-semibold text-gray-700 flex items-center gap-2">
            <FileText className="w-5 h-5 text-green-700" /> Détails de l'offre
          </label>
          <textarea 
            placeholder="Décrivez les objectifs, le retour sur investissement ou les attentes..." 
            className="w-full p-3 border rounded-lg h-32 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none text-gray-800" 
            required 
          />
        </div>

        {/* Localisation */}
        <div className="flex items-center gap-2 border rounded-lg p-3 focus-within:ring-2 focus-within:ring-green-500 focus-within:border-transparent transition-all bg-white">
          <Globe className="text-gray-400 shrink-0" />
          <input 
            type="text" 
            placeholder="Zone géographique concernée" 
            className="w-full outline-none text-gray-800 bg-transparent" 
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-green-700 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-800 transition shadow-lg shadow-green-200"
        >
          Publier l'Opportunité
        </button>
      </form>
    </div>
  );
}