// app/dashboard-partner/entrepreneur/page.jsx
"use client";

import React from 'react';
import { Lightbulb, Rocket, Users, Target, FileText } from 'lucide-react';

export default function EntrepreneurPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Profil entrepreneur enregistré");
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-3xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <Lightbulb className="text-yellow-500" /> Profil Jeune Entrepreneur
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Identité */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            type="text" 
            placeholder="Nom de la start-up" 
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all" 
            required 
          />
          <input 
            type="text" 
            placeholder="Secteur d'activité" 
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all" 
            required 
          />
        </div>

        {/* Vision et Projet */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Rocket className="text-yellow-600" />
            <label className="font-semibold text-gray-700">Pitch de votre projet</label>
          </div>
          <textarea 
            placeholder="En quoi votre projet est-il innovant ? Quel problème résolvez-vous ?" 
            className="w-full p-3 border rounded-lg h-32 outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all resize-none" 
            required 
          />
        </div>

        {/* Cible et Équipe */}
        <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-100">
          <h4 className="font-semibold text-yellow-900 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5" /> Cible et Équipe
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              type="text" 
              placeholder="Cible principale (ex: Jeunes, PME...)" 
              className="w-full p-3 border border-white rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 transition-all" 
            />
            <input 
              type="number" 
              placeholder="Taille de l'équipe" 
              className="w-full p-3 border border-white rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 transition-all" 
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full bg-yellow-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-yellow-600 transition shadow-lg shadow-yellow-200"
        >
          Soumettre mon profil
        </button>
      </form>
    </div>
  );
}