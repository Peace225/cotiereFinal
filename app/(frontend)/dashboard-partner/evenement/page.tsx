// app/dashboard-partner/evenement/page.tsx
"use client";

import React from 'react';
import { Calendar, MapPin, Ticket, FileText, Clock, Building } from 'lucide-react';

export default function EvenementPage() {
  // 1. ADDED TYPE HERE: e: React.FormEvent<HTMLFormElement>
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Données de l'événement enregistrées");
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-3xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <Calendar className="text-blue-600" /> Nouvel Événement à promouvoir
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations de base */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            type="text" 
            placeholder="Nom de l'événement" 
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
            required 
          />
          <input 
            type="date" 
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-600" 
            required 
          />
        </div>

        {/* Lieu et Billetterie */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2 border rounded-lg p-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
            <MapPin className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Lieu (Hôtel, salle, espace...)" 
              className="w-full outline-none text-gray-800" 
              required 
            />
          </div>
          <div className="flex items-center gap-2 border rounded-lg p-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
            <Ticket className="text-gray-400" />
            <input 
              type="url" 
              placeholder="Lien billetterie (ex: TickoFiesta)" 
              className="w-full outline-none text-gray-800" 
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="font-semibold text-gray-700 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" /> Description de l'événement
          </label>
          <textarea 
            placeholder="Détails, programme, artistes invités..." 
            className="w-full p-3 border rounded-lg h-32 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-gray-800" 
            required 
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
        >
          Soumettre pour validation
        </button>
      </form>
    </div>
  );
}