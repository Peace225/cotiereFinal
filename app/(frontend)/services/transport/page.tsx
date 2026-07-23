"use client";
import { useState } from "react";
import { Bus, Calendar, MapPin, Clock, Shield, ArrowRight, Ticket, Sparkles } from "lucide-react";

export default function CotiereTransportPage() {
  const [depart, setDepart] = useState("");
  const [arrivee, setArrivee] = useState("");
  const [date, setDate] = useState("");
  const [searchResult, setSearchResult] = useState<any[] | null>(null);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!depart || !arrivee) {
      alert("Veuillez renseigner la ville de départ et d'arrivée.");
      return;
    }
    setSearchResult([
      { id: 1, compagnie: "Côtière Express Clim", depart, arrivee, heure: "06:30", tarif: "5500", places: 12 },
      { id: 2, compagnie: "Côtière VIP Confort", depart, arrivee, heure: "10:00", tarif: "8000", places: 5 },
      { id: 3, compagnie: "Côtière Ligne Directe", depart, arrivee, heure: "15:30", tarif: "5500", places: 20 },
    ]);
  }

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
      {/* HERO SECTION EPARÉ */}
      <section className="bg-slate-900 text-white py-14 px-6 border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold tracking-wide border border-amber-500/20">
            <Sparkles size={13} /> Côtière Transport
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">Voyagez en toute simplicité</h1>
          <p className="text-sm text-slate-400 max-w-lg mx-auto">
            Recherchez et réservez vos billets d'autocar en quelques secondes à travers la Côte d'Ivoire.
          </p>
        </div>
      </section>

      {/* SEARCH ENGINE BAR ÉPURÉE */}
      <section className="max-w-4xl mx-auto px-4 -mt-6 relative z-10 w-full">
        <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-lg p-4 border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Départ</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-3 text-slate-400" />
              <input 
                type="text" 
                value={depart} 
                onChange={e => setDepart(e.target.value)} 
                placeholder="Abidjan" 
                className="w-full bg-slate-50 pl-9 pr-3 py-2.5 rounded-lg text-xs font-medium border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Destination</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-3 text-slate-400" />
              <input 
                type="text" 
                value={arrivee} 
                onChange={e => setArrivee(e.target.value)} 
                placeholder="San-Pédro" 
                className="w-full bg-slate-50 pl-9 pr-3 py-2.5 rounded-lg text-xs font-medium border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Date</label>
            <div className="relative">
              <Calendar size={16} className="absolute left-3 top-3 text-slate-400" />
              <input 
                type="date" 
                value={date} 
                onChange={e => setDate(e.target.value)} 
                className="w-full bg-slate-50 pl-9 pr-3 py-2.5 rounded-lg text-xs font-medium border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 px-4 rounded-lg font-semibold text-xs transition-all shadow-sm flex items-center justify-center gap-2">
            Rechercher <ArrowRight size={14} />
          </button>
        </form>
      </section>

      {/* RESULTS OR CONTENT */}
      <main className="max-w-4xl mx-auto px-4 py-10 flex-1 w-full">
        {searchResult ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Résultats ({searchResult.length})</h2>
              <button onClick={() => setSearchResult(null)} className="text-xs text-slate-500 hover:text-slate-800 underline">Nouvelle recherche</button>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {searchResult.map(res => (
                <div key={res.id} className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                      <Bus size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 text-sm">{res.compagnie}</h3>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span>{res.depart}</span> <ArrowRight size={10} /> <span>{res.arrivee}</span>
                        <span className="text-emerald-600 font-medium bg-emerald-50 px-1.5 py-0.5 rounded ml-2">{res.places} places</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-5 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-slate-400 block">Départ</span>
                      <span className="font-semibold text-slate-700 text-xs flex items-center gap-1">
                        <Clock size={12} className="text-slate-400" /> {res.heure}
                      </span>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-slate-400 block">Tarif</span>
                      <span className="font-bold text-slate-900 text-sm">{res.tarif} FCFA</span>
                    </div>
                    <button onClick={() => alert("Réservation confirmée !")} className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all">
                      Réserver
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            {/* VALEURS MINIMALISTES */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
                <Shield size={18} className="text-slate-700" />
                <h3 className="font-semibold text-slate-800 text-sm">Sécurité</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Flotte vérifiée et conducteurs qualifiés pour chaque trajet.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
                <Clock size={18} className="text-slate-700" />
                <h3 className="font-semibold text-slate-800 text-sm">Ponctualité</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Respect strict des horaires de départ et d'arrivée.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
                <Ticket size={18} className="text-slate-700" />
                <h3 className="font-semibold text-slate-800 text-sm">Paiement Simple</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Réglez vos billets par Mobile Money en toute sécurité.
                </p>
              </div>
            </div>

            {/* LIGNES POPULAIRES */}
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lignes populaires</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { ville: "Abidjan - San-Pédro", prix: "5 500 FCFA" },
                  { ville: "Abidjan - Yamoussoukro", prix: "4 000 FCFA" },
                  { ville: "Abidjan - Bouaké", prix: "6 000 FCFA" }
                ].map((l, i) => (
                  <div key={i} className="p-4 rounded-xl border border-slate-200 bg-white flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-slate-800 text-xs">{l.ville}</h3>
                      <span className="text-[11px] text-slate-400">Quotidien</span>
                    </div>
                    <span className="text-xs font-bold text-slate-900">{l.prix}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}