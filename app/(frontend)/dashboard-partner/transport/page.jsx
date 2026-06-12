// app/dashboard-partner/transport/page.jsx
"use client";

import React from 'react';
import { Bus, MapPinned, Clock, ShieldCheck, CreditCard, Info } from 'lucide-react';

export default function TransportPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Données de transport enregistrées");
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-3xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <Bus className="text-blue-700" /> Gestion Compagnie de Transport
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations Compagnie */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            type="text" 
            placeholder="Nom de la compagnie" 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-gray-800" 
            required 
          />
          <input 
            type="text" 
            placeholder="Siège Social (Ville/Commune)" 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-gray-800" 
            required 
          />
        </div>

        {/* Détails des Trajets */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MapPinned className="text-blue-700 w-5 h-5 shrink-0" />
            <label className="font-semibold text-gray-700">Trajets et Destinations</label>
          </div>
          <textarea 
            placeholder="Ex: Abidjan - San Pedro, Liaisons quotidiennes vers l'intérieur..." 
            className="w-full p-3 border rounded-lg h-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none text-gray-800" 
            required 
          />
        </div>

        {/* Services et Sécurité */}
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
          <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-green-600" /> Services à bord & Sécurité
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select className="w-full p-3 border border-white rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-800 cursor-pointer appearance-none">
              <option value="">Type de véhicule</option>
              <option value="bus">Car / Bus (Gros porteur)</option>
              <option value="mini">Minicar (Massa)</option>
              <option value="vtc">VTC / Berline</option>
              <option value="tricycle">Tricycle (Messay)</option>
            </select>
            <select className="w-full p-3 border border-white rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-800 cursor-pointer appearance-none">
              <option value="">Climatisation à bord ?</option>
              <option value="oui">Oui (Premium)</option>
              <option value="non">Non (Standard)</option>
            </select>
            <div className="flex items-center gap-2 border border-white bg-white rounded-lg p-3 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
              <Clock className="text-gray-400 w-5 h-5 shrink-0" />
              <input type="text" placeholder="Fréquence (ex: Tous les jours)" className="w-full outline-none text-gray-800 bg-transparent" />
            </div>
            <div className="flex items-center gap-2 border border-white bg-white rounded-lg p-3 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
              <CreditCard className="text-gray-400 w-5 h-5 shrink-0" />
              <input type="text" placeholder="Tarif moyen" className="w-full outline-none text-gray-800 bg-transparent" />
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-700 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-800 transition shadow-lg shadow-blue-200"
        >
          Enregistrer le profil Compagnie
        </button>
      </form>
    </div>
  );
}