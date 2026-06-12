// app/dashboard-partner/agro/page.jsx
"use client";

import React from 'react';
import { ShoppingBasket, Truck, Package, MapPin, Scale, Info } from 'lucide-react';

export default function AgroPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Données agro-alimentaires enregistrées");
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-3xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <ShoppingBasket className="text-green-600" /> Gestion Grossiste (Agro-alimentaire)
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Identité de l'entreprise */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2 border rounded-lg p-3 focus-within:ring-2 focus-within:ring-green-600 focus-within:border-transparent transition-all">
            <Package className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Nom de l'entreprise ou coopérative" 
              className="w-full outline-none" 
              required 
            />
          </div>
          <div className="flex items-center gap-2 border rounded-lg p-3 focus-within:ring-2 focus-within:ring-green-600 focus-within:border-transparent transition-all">
            <MapPin className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Zone de production / Stockage" 
              className="w-full outline-none" 
              required 
            />
          </div>
        </div>

        {/* Sélection des produits */}
        <div className="space-y-4">
          <label className="font-semibold text-gray-700">Produits disponibles</label>
          <select className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all" required>
            <option value="">Sélectionnez le type de produit</option>
            <option value="attieke">Attiéké</option>
            <option value="poisson">Poissons frais</option>
            <option value="crustaces">Crustacés et fruits de mer</option>
          </select>
        </div>

        {/* Capacité et Logistique */}
        <div className="bg-green-50 p-6 rounded-xl border border-green-100">
          <h4 className="font-semibold text-green-900 mb-4 flex items-center gap-2">
            <Scale className="w-5 h-5" /> Stock et Logistique
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              type="text" 
              placeholder="Capacité de stock (ex: 5 tonnes)" 
              className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all" 
              required 
            />
            <div className="flex items-center gap-2 border bg-white rounded-lg p-3 focus-within:ring-2 focus-within:ring-green-600 focus-within:border-transparent transition-all">
              <Truck className="text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Zone de livraison" 
                className="w-full outline-none" 
              />
            </div>
          </div>
        </div>

        <textarea 
          placeholder="Détails supplémentaires ou conditions de vente..." 
          className="w-full p-3 border rounded-lg h-24 outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all resize-none" 
        />

        <button 
          type="submit" 
          className="w-full bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition shadow-lg shadow-green-200"
        >
          Mettre à jour mes disponibilités
        </button>
      </form>
    </div>
  );
}