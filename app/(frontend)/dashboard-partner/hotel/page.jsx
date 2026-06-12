// app/dashboard-partner/hotel/page.jsx
"use client";

import React from 'react';
import { BedDouble, Bath, Snowflake, DoorOpen, Wifi, Tv, Building2 } from 'lucide-react';

export default function HotelPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique de soumission vers Supabase
    console.log("Données de l'hôtel enregistrées");
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-3xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <Building2 className="text-blue-600" /> Gestion de votre Hôtel / Résidence
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations Générales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            type="text" 
            placeholder="Nom de l'établissement" 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-gray-800" 
            required 
          />
          <input 
            type="text" 
            placeholder="Localisation (Quartier/Commune)" 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-gray-800" 
            required 
          />
        </div>

        <textarea 
          placeholder="Description détaillée de votre établissement..." 
          className="w-full p-3 border rounded-lg h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none text-gray-800" 
          required 
        />

        {/* Détails Techniques */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
          <h4 className="font-semibold text-gray-700 mb-4">Équipements et Caractéristiques</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            
            <div className="flex items-center gap-2 bg-white border rounded-lg p-2.5 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
              <DoorOpen className="text-gray-400 shrink-0" />
              <input type="number" placeholder="Pièces" className="w-full outline-none text-gray-800 bg-transparent" />
            </div>
            
            <div className="flex items-center gap-2 bg-white border rounded-lg p-2.5 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
              <BedDouble className="text-gray-400 shrink-0" />
              <input type="number" placeholder="Lits" className="w-full outline-none text-gray-800 bg-transparent" />
            </div>
            
            <div className="flex items-center gap-2 bg-white border rounded-lg p-2.5 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
              <Bath className="text-gray-400 shrink-0" />
              <input type="number" placeholder="Salles de bain" className="w-full outline-none text-gray-800 bg-transparent" />
            </div>
            
            {/* Champs de sélection pour options */}
            <div className="flex items-center gap-2 bg-white border rounded-lg p-2.5 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
              <Snowflake className="text-gray-400 shrink-0" />
              <select className="w-full outline-none text-gray-800 bg-transparent cursor-pointer appearance-none">
                <option value="">Climatisation</option>
                <option value="oui">Oui</option>
                <option value="non">Non</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2 bg-white border rounded-lg p-2.5 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
              <Wifi className="text-gray-400 shrink-0" />
              <select className="w-full outline-none text-gray-800 bg-transparent cursor-pointer appearance-none">
                <option value="">Wi-Fi</option>
                <option value="oui">Oui</option>
                <option value="non">Non</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2 bg-white border rounded-lg p-2.5 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
              <Tv className="text-gray-400 shrink-0" />
              <select className="w-full outline-none text-gray-800 bg-transparent cursor-pointer appearance-none">
                <option value="">Écran / TV</option>
                <option value="oui">Oui</option>
                <option value="non">Non</option>
              </select>
            </div>
            
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
        >
          Enregistrer mes informations
        </button>
      </form>
    </div>
  );
}