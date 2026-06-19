"use client";

import { useState, useTransition } from "react";
import { createServiceAction } from "@/app/actions/serviceActions";
import ImageUploader from "../../../admin/ImageUploader";

export default function AddServicePage() {
  const [imageUrl, setImageUrl] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // âœ… CORRECTION : Enveloppement de l'action dans startTransition
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      try {
        const result = await createServiceAction(formData);
        // Vous pouvez ajouter une redirection ou un toast de succÃ¨s ici si nÃ©cessaire
      } catch (err: any) {
        setError(err.message || "Une erreur est survenue lors de la publication.");
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="!text-[20px] md:!text-[25px] font-black text-slate-900">Ajouter un nouveau service</h1>
        <p className="text-slate-500">
          Publiez une nouvelle prestation pour votre structure.
        </p>
      </div>
      
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        {/* âœ… Utilisation d'un gestionnaire onSubmit au lieu de action={createServiceAction} */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* URL de l'image gÃ©rÃ©e par le composant */}
          <input type="hidden" name="image" value={imageUrl} />
          
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 font-medium text-sm">
              {error}
            </div>
          )}
          
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
              <label className="text-sm font-bold text-slate-700">CatÃ©gorie</label>
              <select name="categorie" className="w-full p-4 border rounded-xl bg-white outline-none">
                <option value="hotel">HÃ©bergement & Restauration</option>
                <option value="restaurant">Restaurant</option>
                <option value="studio">HBL Studio+</option>
                <option value="tourisme">Tourisme & Voyage</option>
                <option value="musique">Music & Management</option>
                <option value="evenementiel">Guichet Ã‰vÃ©nementiel</option>
                <option value="medias">MÃ‰DIAS</option>
                <option value="market">Market & Distribution</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Description dÃ©taillÃ©e</label>
            <textarea 
              name="description" 
              rows={4} 
              placeholder="DÃ©crivez votre offre..." 
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
                name="prix"
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
            disabled={isPending}
            className="w-full bg-[#003b95] text-white font-bold py-4 rounded-xl hover:bg-blue-800 transition-all text-lg shadow-lg shadow-blue-900/20 disabled:opacity-70"
          >
            {isPending ? "Publication en cours..." : "Publier le service"}
          </button>
        </form>
      </div>
    </div>
  );
}

