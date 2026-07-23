"use client";
import { useState } from "react";
import { Bus, Plus, Clock, Trash2, Search, X } from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar"; // Ajustez le chemin selon votre structure

export default function AdminTransportPage() {
  const [compagnies, setCompagnies] = useState<any[]>([
    { id: 1, nom: "Côtière Express Clim", trajet: "Abidjan - San-Pédro", heure: "06:30", tarif: "5500", places: 12, statut: "Actif" },
    { id: 2, nom: "Côtière VIP Confort", trajet: "Abidjan - Yamoussoukro", heure: "10:00", tarif: "4000", places: 5, statut: "Actif" },
    { id: 3, nom: "Côtière Ligne Directe", trajet: "Abidjan - Bouaké", heure: "15:30", tarif: "6000", places: 20, statut: "Actif" },
  ]);

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [nom, setNom] = useState("");
  const [trajet, setTrajet] = useState("");
  const [heure, setHeure] = useState("");
  const [tarif, setTarif] = useState("");
  const [places, setPlaces] = useState("");
  const [search, setSearch] = useState("");

  function handleAddCompagnie(e: React.FormEvent) {
    e.preventDefault();
    if (!nom || !trajet || !tarif) {
      alert("Veuillez remplir les champs obligatoires.");
      return;
    }

    const nouvelleLigne = {
      id: Date.now(),
      nom,
      trajet,
      heure: heure || "08:00",
      tarif,
      places: places ? parseInt(places) : 15,
      statut: "Actif"
    };

    setCompagnies([nouvelleLigne, ...compagnies]);
    setNom("");
    setTrajet("");
    setHeure("");
    setTarif("");
    setPlaces("");
    setIsOpenModal(false);
  }

  function handleDelete(id: number) {
    if (confirm("Voulez-vous vraiment supprimer cette ligne de transport ?")) {
      setCompagnies(compagnies.filter(c => c.id !== id));
    }
  }

  const filteredCompagnies = compagnies.filter(c => 
    c.nom.toLowerCase().includes(search.toLowerCase()) || 
    c.trajet.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* NAVBAR / SIDEBAR INTÉGRÉE */}
      <AdminNavbar />

      {/* CONTENU PRINCIPAL */}
      <main className="flex-1 lg:ml-72 p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Gestion Flotte & Lignes
            </span>
            <h1 className="text-2xl font-black text-slate-900 mt-2">Côtière Transport</h1>
            <p className="text-xs sm:text-sm text-slate-500">Administrez les trajets, horaires et tarifs des autocars.</p>
          </div>
          <button 
            onClick={() => setIsOpenModal(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md transition-all"
          >
            <Plus size={16} /> Ajouter une ligne
          </button>
        </div>

        {/* SEARCH BAR */}
        <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
          <Search size={18} className="text-slate-400 ml-2" />
          <input 
            type="text" 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            placeholder="Rechercher par compagnie ou trajet (ex: San-Pédro)..." 
            className="w-full text-xs sm:text-sm bg-transparent focus:outline-none text-slate-700"
          />
        </div>

        {/* TABLE LIST */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Compagnie / Service</th>
                  <th className="py-3.5 px-6">Trajet</th>
                  <th className="py-3.5 px-6">Heure</th>
                  <th className="py-3.5 px-6">Tarif</th>
                  <th className="py-3.5 px-6">Disponibilité</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {filteredCompagnies.length > 0 ? (
                  filteredCompagnies.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 font-semibold text-slate-800 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                          <Bus size={16} />
                        </div>
                        {c.nom}
                      </td>
                      <td className="py-4 px-6 text-slate-600 font-medium">{c.trajet}</td>
                      <td className="py-4 px-6 text-slate-600 flex items-center gap-1.5 pt-5">
                        <Clock size={14} className="text-amber-500" /> {c.heure}
                      </td>
                      <td className="py-4 px-6 font-bold text-slate-900">{c.tarif} FCFA</td>
                      <td className="py-4 px-6">
                        <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full text-[11px] font-semibold border border-emerald-200">
                          {c.places} places dispo
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button 
                          onClick={() => handleDelete(c.id)}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                      Aucune compagnie ou trajet trouvé.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* MODAL AJOUT */}
      {isOpenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-base">Ajouter une ligne de transport</h3>
              <button onClick={() => setIsOpenModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddCompagnie} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Nom de la compagnie / service</label>
                <input 
                  type="text" 
                  value={nom} 
                  onChange={e => setNom(e.target.value)} 
                  placeholder="Ex: Côtière Express Clim" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-slate-900"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Trajet (Départ - Arrivée)</label>
                <input 
                  type="text" 
                  value={trajet} 
                  onChange={e => setTrajet(e.target.value)} 
                  placeholder="Ex: Abidjan - San-Pédro" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Heure de départ</label>
                  <input 
                    type="time" 
                    value={heure} 
                    onChange={e => setHeure(e.target.value)} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Tarif (FCFA)</label>
                  <input 
                    type="text" 
                    value={tarif} 
                    onChange={e => setTarif(e.target.value)} 
                    placeholder="Ex: 5500" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-slate-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Nombre de places</label>
                <input 
                  type="number" 
                  value={places} 
                  onChange={e => setPlaces(e.target.value)} 
                  placeholder="Ex: 15" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsOpenModal(false)}
                  className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-xs font-semibold transition-all"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="w-1/2 bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl text-xs font-semibold transition-all shadow-md"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}