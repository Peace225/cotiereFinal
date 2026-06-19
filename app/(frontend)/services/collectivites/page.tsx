"use client";

import { useState, useEffect } from "react";
import { ArrowRight, CheckCircle, Loader2, X, ChevronLeft, Building2, MapPin, Mail, Globe, Clock, Phone, Search } from "lucide-react";

export const dynamic = 'force-dynamic';

// --- Constantes ---
const COLLECTIVITES = [
  { nom: "Mairie d'Abidjan (Plateau)", type: "mairie", ville: "Abidjan", region: "Lagunes", telephone: "+22527213000", adresse: "Avenue Terrasson", horaires: "Lunâ€“Ven 7h30â€“16h30" },
  { nom: "Mairie de Grand-Bassam", type: "mairie", ville: "Grand-Bassam", region: "Sud-ComoÃ©", telephone: "+22527301000", adresse: "Quartier France", horaires: "Lunâ€“Ven 7h30â€“16h30" },
  { nom: "Conseil RÃ©gional du Sud-ComoÃ©", type: "conseil", ville: "Aboisso", region: "Sud-ComoÃ©", telephone: "+22527200100", adresse: "Aboisso", horaires: "Lunâ€“Ven 8hâ€“17h" },
  { nom: "Port Autonome de San-PÃ©dro", type: "service", ville: "San-PÃ©dro", region: "Bas-Sassandra", telephone: "+22534710000", email: "info@psp.ci", siteWeb: "https://www.psp.ci", horaires: "24h/24" }
];

const TYPE_LABELS = { mairie: "Mairie", conseil: "Conseil RÃ©gional", service: "Service Public" };
const TYPE_COLORS = {
  mairie: "bg-blue-100 text-blue-700 border-blue-200",
  conseil: "bg-purple-100 text-purple-700 border-purple-200",
  service: "bg-green-100 text-green-700 border-green-200",
};
const TYPE_ICONS = { mairie: "ðŸ›ï¸", conseil: "ðŸ¢", service: "âš™ï¸" };

type DbService = { id: string; nom: string; categorie: string; description: string; image: string; };

export default function CollectivitesPage() {
  const [dbServices, setDbServices] = useState<DbService[]>([]);
  const [servicesLoaded, setServicesLoaded] = useState(false);
  const [annuaire, setAnnuaire] = useState(COLLECTIVITES);
  const [searchQuery, setSearchQuery] = useState("");
  const [villeFilter, setVilleFilter] = useState("Toutes");
  const [typeFilter, setTypeFilter] = useState("Tous");
  const [active, setActive] = useState<DbService | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // ... (Logique fetch et handlers inchangÃ©s)

  const filteredAnnuaire = annuaire.filter(c => {
    const matchVille = villeFilter === "Toutes" || c.ville === villeFilter;
    const matchType = typeFilter === "Tous" || c.type === typeFilter;
    const matchSearch = !searchQuery || c.nom.toLowerCase().includes(searchQuery.toLowerCase());
    return matchVille && matchType && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative text-white py-20 bg-[#0c4a6e] px-4">
        <h1 className="text-4xl font-bold text-center">CollectivitÃ©s & Services</h1>
      </section>

      {/* Services */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        {!servicesLoaded ? <div className="text-center"><Loader2 className="animate-spin mx-auto" /></div> :
        <div className="grid md:grid-cols-3 gap-6">
          {dbServices.map(s => (
            <div key={s.id} className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="font-bold text-lg">{s.nom}</h3>
              <p className="text-sm text-gray-500 mb-4">{s.description}</p>
              <button onClick={() => setActive(s)} className="text-[#c9a84c] font-bold">En savoir plus â†’</button>
            </div>
          ))}
        </div>}
      </section>

      {/* Annuaire */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAnnuaire.map((c, i) => (
              <div key={i} className="border p-4 rounded-xl">
                <h3 className="font-bold">{c.nom}</h3>
                <p className="text-sm text-gray-500">{c.ville}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

