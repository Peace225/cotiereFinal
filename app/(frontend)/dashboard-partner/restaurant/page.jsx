// app/dashboard-partner/restaurant/page.jsx
"use client";

import React from 'react';
import { Utensils, ChefHat, Clock, MapPin, ClipboardList, Star, Pizza } from 'lucide-react';

export default function RestaurantPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Données du restaurant enregistrées");
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-3xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <ChefHat className="text-orange-500" /> Gestion de votre Restaurant / Gastronomie
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Identité du Restaurant */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2 border rounded-lg p-3 focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-transparent transition-all">
            <Utensils className="text-gray-400 shrink-0 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Nom du restaurant / Enseigne" 
              className="w-full outline-none text-gray-800" 
              required 
            />
          </div>
          <div className="flex items-center gap-2 border rounded-lg p-3 focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-transparent transition-all">
            <MapPin className="text-gray-400 shrink-0 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Localisation (Quartier/Commune)" 
              className="w-full outline-none text-gray-800" 
              required 
            />
          </div>
        </div>

        {/* Type de Cuisine et Spécialité */}
        <div className="space-y-4">
          <label className="font-semibold text-gray-700">Type de cuisine & Spécialités</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-800 cursor-pointer bg-white">
              <option value="">Type de cuisine</option>
              <option value="ivoirienne">Cuisine Ivoirienne</option>
              <option value="africaine">Cuisine Africaine</option>
              <option value="europeenne">Cuisine Européenne</option>
              <option value="fusion">Fusion / Mixte</option>
              <option value="fastfood">Fast-Food / Snack</option>
            </select>
            <input 
              type="text" 
              placeholder="Plat signature (ex: Garba Royal, Kédjénou...)" 
              className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-800" 
            />
          </div>
        </div>

        {/* Configuration du Service */}
        <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
          <h4 className="font-semibold text-orange-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" /> Horaires et Capacité
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input 
              type="text" 
              placeholder="Heures d'ouverture" 
              className="w-full p-3 border border-white rounded-lg outline-none focus:ring-2 focus:ring-orange-500 transition-all text-gray-800" 
            />
            <input 
              type="number" 
              placeholder="Nombre de tables" 
              className="w-full p-3 border border-white rounded-lg outline-none focus:ring-2 focus:ring-orange-500 transition-all text-gray-800" 
            />
            <div className="flex items-center gap-2 bg-white border border-white rounded-lg p-3">
              <Star className="text-orange-400 w-5 h-5" />
              <select className="w-full outline-none text-gray-800 bg-transparent cursor-pointer">
                <option value="">Réservation</option>
                <option value="obligatoire">Obligatoire</option>
                <option value="conseillee">Conseillée</option>
                <option value="sans">Sans RDV</option>
              </select>
            </div>
          </div>
        </div>

        {/* Description et Carte */}
        <div className="space-y-2">
          <label className="font-semibold text-gray-700 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-orange-500" /> Présentation de votre menu
          </label>
          <textarea 
            placeholder="Décrivez l'ambiance de votre restaurant et les points forts de votre carte..." 
            className="w-full p-3 border rounded-lg h-32 outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none text-gray-800" 
            required 
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-orange-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-700 transition shadow-lg shadow-orange-200"
        >
          Mettre à jour mon établissement
        </button>
      </form>
    </div>
  );
}