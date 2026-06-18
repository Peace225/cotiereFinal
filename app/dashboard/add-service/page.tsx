"use client";

import { useState } from "react";
import { createServiceAction } from "@/app/actions/serviceActions";
import ImageUploader from "@/frontend/components/admin/ImageUploader";

export default function AddServicePage() {
  const [imageUrl, setImageUrl] = useState("");

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="!text-[20px] md:!text-[25px] font-black text-slate-900">Ajouter un nouveau service</h1>
        <p className="text-slate-500">
          Publiez une nouvelle prestation pour votre structure.
        </p>
      </div>
      
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <form action={createServiceAction} className="space-y-6">
          {/* URL de l'image gérée par le composant */}
          <input type="hidden" name="image" value={imageUrl} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Nom du service</label>
              <input 
                name="nom" 
                placeholder="Ex: Shooting Photo Premium" 
                className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-[#003b95] outline-none" 
                required 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Catégorie</label>
              <select name="categorie" className="w-full p-4 border rounded-xl bg-white outline-none">
                <option value="hotel">Hébergement & Restauration</option>
                <option value="restaurant">Restaurant</option>
                <option value="studio">HBL Studio+</option>
                <option value="tourisme">Tourisme & Voyage</option>
                <option value="musique">Music & Management</option>
                <option value="evenementiel">Guichet Événementiel</option>
                <option value="medias">MÉDIAS</option>
                <option value="market">Market & Distribution</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Description détaillée</label>
            <textarea 
              name="description" 
              rows={4} 
              placeholder="Décrivez votre offre..." 
              className="w-full p-4 border rounded-xl outline-none" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Image du service</label>
            <ImageUploader value={imageUrl} onChange={setImageUrl} maxFiles={1} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Prix (XOF)</label>
              <input 
                type="number" 
                name="price" 
                placeholder="Ex: 50000" 
                className="w-full p-4 border rounded-xl outline-none" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Ville</label>
              <input 
                name="ville" 
                placeholder="Ex: Abidjan" 
                className="w-full p-4 border rounded-xl outline-none" 
                required 
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#003b95] text-white font-bold py-4 rounded-xl hover:bg-blue-800 transition-all text-lg shadow-lg shadow-blue-900/20"
          >
            Publier le service
          </button>
        </form>
      </div>
    </div>
  );
}