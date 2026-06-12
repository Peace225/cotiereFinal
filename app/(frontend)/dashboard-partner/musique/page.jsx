// app/dashboard-partner/musique/page.jsx
"use client";

import React from 'react';
import { Music, Disc, Link2, User, Mic2, FileText } from 'lucide-react';

export default function MusiquePage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Données de promotion musicale enregistrées");
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-3xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <Music className="text-pink-600" /> Promotion Œuvre Musicale
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations de l'Artiste */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2 border rounded-lg p-3 focus-within:ring-2 focus-within:ring-pink-500 focus-within:border-transparent transition-all">
            <User className="text-gray-400 shrink-0" />
            <input 
              type="text" 
              placeholder="Nom de l'artiste ou groupe" 
              className="w-full outline-none text-gray-800" 
              required 
            />
          </div>
          <div className="flex items-center gap-2 border rounded-lg p-3 focus-within:ring-2 focus-within:ring-pink-500 focus-within:border-transparent transition-all">
            <Mic2 className="text-gray-400 shrink-0" />
            <input 
              type="text" 
              placeholder="Titre de l'œuvre" 
              className="w-full outline-none text-gray-800" 
              required 
            />
          </div>
        </div>

        {/* Détails de l'œuvre */}
        <div className="flex items-start gap-2 border rounded-lg p-3 focus-within:ring-2 focus-within:ring-pink-500 focus-within:border-transparent transition-all">
          <FileText className="text-gray-400 mt-1 shrink-0" />
          <textarea 
            placeholder="Description, style musical ou message de l'œuvre..." 
            className="w-full outline-none h-24 resize-none text-gray-800" 
            required 
          />
        </div>

        {/* Liens de Diffusion */}
        <div className="bg-pink-50 p-6 rounded-xl border border-pink-100">
          <h4 className="font-semibold text-pink-900 mb-4 flex items-center gap-2">
            <Link2 className="w-5 h-5" /> Liens de streaming et médias
          </h4>
          <div className="grid grid-cols-1 gap-4">
            <input 
              type="url" 
              placeholder="Lien YouTube / Vidéo officielle" 
              className="w-full p-3 border border-white rounded-lg outline-none focus:ring-2 focus:ring-pink-500 transition-all text-gray-800" 
            />
            <input 
              type="url" 
              placeholder="Lien plateforme de streaming (Spotify, Deezer, etc.)" 
              className="w-full p-3 border border-white rounded-lg outline-none focus:ring-2 focus:ring-pink-500 transition-all text-gray-800" 
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full bg-pink-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-pink-700 transition shadow-lg shadow-pink-200"
        >
          Soumettre pour Promotion
        </button>
      </form>
    </div>
  );
}