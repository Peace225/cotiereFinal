"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Building2, MapPin, Phone, Globe, ChevronRight, Landmark, Briefcase, FileText, CheckCircle2 } from "lucide-react";

// Données des collectivités côtières (mairies et conseils régionaux)
const collectivitesList = [
  {
    id: "1",
    nom: "Mairie de San-Pédro",
    type: "Commune",
    region: "Région de San-Pédro",
    contact: "+225 27 34 71 12 34",
    email: "contact@mairiesanpedro.ci",
    site: "#",
    adresse: "Boulevard de la République, San-Pédro",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800",
    services: [
      { id: "s1", nom: "État civil", description: "Établissement des actes de naissance, mariage et décès." },
      { id: "s2", nom: "Légalisation et légalisation de pièces", description: "Certification conforme de documents administratifs." },
      { id: "s3", nom: "Délivrance de permis de construire", description: "Instruction des dossiers d'urbanisme et d'aménagement." }
    ]
  },
  {
    id: "2",
    nom: "Conseil Régional de San-Pédro",
    type: "Conseil Régional",
    region: "Région de San-Pédro",
    contact: "+225 27 34 71 50 00",
    email: "contact@region-sanpedro.ci",
    site: "#",
    adresse: "San-Pédro, Quartier Résidentiel",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
    services: [
      { id: "s4", nom: "Développement économique régional", description: "Soutien aux initiatives locales et entrepreneuriat." },
      { id: "s5", nom: "Infrastructures et voirie régionale", description: "Aménagement et entretien des axes de transport secondaires." }
    ]
  },
  {
    id: "3",
    nom: "Mairie de Sassandra",
    type: "Commune",
    region: "Région du Gbôklè",
    contact: "+225 27 34 72 01 50",
    email: "contact@mairiesassandra.ci",
    site: "#",
    adresse: "Sassandra, Centre-ville",
    image: "https://images.unsplash.com/photo-1541888946425-d0fbb18fcd7e?auto=format&fit=crop&q=80&w=800",
    services: [
      { id: "s6", nom: "État civil", description: "Gestion des registres de la population et actes officiels." },
      { id: "s7", nom: "Gestion des marchés municipaux", description: "Attribution des stands et perception des taxes communales." }
    ]
  },
  {
    id: "4",
    nom: "Conseil Régional du Gbôklè",
    type: "Conseil Régional",
    region: "Région du Gbôklè (Sassandra)",
    contact: "+225 27 34 72 00 00",
    email: "contact@gbokle.ci",
    site: "#",
    adresse: "Sassandra, Centre-ville",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800",
    services: [
      { id: "s8", nom: "Éducation et formation", description: "Construction et équipement des collèges et lycées de la région." },
      { id: "s9", nom: "Santé rurale", description: "Appui aux centres de santé communautaires." }
    ]
  },
  {
    id: "5",
    nom: "Mairie de Grand-Bassam",
    type: "Commune",
    region: "Région du Sud-Comoé",
    contact: "+225 27 21 30 15 20",
    email: "contact@mairiegrandbassam.ci",
    site: "#",
    adresse: "Quartier France, Grand-Bassam",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
    services: [
      { id: "s10", nom: "État civil", description: "Délivrance rapide d'extraits d'actes de naissance et de mariage." },
      { id: "s11", nom: "Tourisme et patrimoine culturel", description: "Valorisation du site historique et gestion des infrastructures balnéaires." }
    ]
  },
  {
    id: "6",
    nom: "Conseil Régional du Sud-Comoé",
    type: "Conseil Régional",
    region: "Région du Sud-Comoé (Aboisso)",
    contact: "+225 27 21 30 00 40",
    email: "contact@sudcomoe.ci",
    site: "#",
    adresse: "Aboisso",
    image: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&q=80&w=800",
    services: [
      { id: "s12", nom: "Promotion agricole", description: "Accompagnement des coopératives de production agricole et rurale." },
      { id: "s13", nom: "Aménagement du territoire", description: "Planification des projets de développement socio-économique." }
    ]
  },
  {
    id: "7",
    nom: "Mairie de Jacqueville",
    type: "Commune",
    region: "Région des Grands-Ponts",
    contact: "+225 27 23 57 60 10",
    email: "contact@mairiejacqueville.ci",
    site: "#",
    adresse: "Jacqueville, Centre-ville",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800",
    services: [
      { id: "s14", nom: "État civil", description: "Service des naissances, mariages et certificats de résidence." },
      { id: "s15", nom: "Affaires domaniales", description: "Gestion des attributions de parcelles et foncier urbain." }
    ]
  },
  {
    id: "8",
    nom: "Mairie de Grand-Lahou",
    type: "Commune",
    region: "Région des Grands-Ponts",
    contact: "+225 27 23 57 60 43",
    email: "contact@mairiegrandlahou.ci",
    site: "#",
    adresse: "Grand-Lahou, Bord de mer",
    image: "https://images.unsplash.com/photo-1519074069444-1ba4ea16d66c?auto=format&fit=crop&q=80&w=800",
    services: [
      { id: "s16", nom: "État civil", description: "Enregistrement des faits d'état civil et pièces d'identité." },
      { id: "s17", nom: "Assainissement et salubrité", description: "Gestion des ordures ménagères et protection côtière locale." }
    ]
  },
  {
    id: "9",
    nom: "Conseil Régional des Grands-Ponts",
    type: "Conseil Régional",
    region: "Région des Grands-Ponts (Dabou)",
    contact: "+225 27 23 57 00 50",
    email: "contact@grands-ponts.ci",
    site: "#",
    adresse: "Dabou",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
    services: [
      { id: "s18", nom: "Développement socio-culturel", description: "Soutien aux activités culturelles, sportives et de jeunesse." },
      { id: "s19", nom: "Électrification rurale", description: "Suivi des programmes d'extension des réseaux électriques." }
    ]
  },
  {
    id: "10",
    nom: "Mairie de Tabou",
    type: "Commune",
    region: "Région de San-Pédro",
    contact: "+225 27 34 71 80 10",
    email: "contact@mairietabou.ci",
    site: "#",
    adresse: "Tabou, Frontière / Littoral",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800",
    services: [
      { id: "s20", nom: "État civil", description: "Traitement des actes d'état civil et des formalités frontalières." },
      { id: "s21", nom: "Police administrative", description: "Régulation des marchés et des activités commerciales locales." }
    ]
  }
];

export default function CollectivitesDirectoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("Tous");

  // Filtrage dynamique des collectivités et de leurs services associés
  const filteredCollectivites = useMemo(() => {
    return collectivitesList.filter((item) => {
      const matchesSearch = 
        item.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.adresse.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.services.some(s => s.nom.toLowerCase().includes(searchTerm.toLowerCase()) || s.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = selectedType === "Tous" || item.type === selectedType;

      return matchesSearch && matchesType;
    });
  }, [searchTerm, selectedType]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16">
      
      {/* ================= HEADER / HERO ================= */}
      <div className="relative bg-[#003b95] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl text-xs font-bold text-white/90">
            <Landmark size={16} className="text-[#c9a84c]" />
            <span>Portail Institutionnel - Zone Littorale</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
            Annuaire des Collectivités et Services
          </h1>
          <p className="text-sm sm:text-base text-white/80 max-w-2xl font-medium">
            Consultez les coordonnées, les services administratifs et les informations des mairies et conseils régionaux de la zone côtière et lagunaire.
          </p>
        </div>
      </div>

      {/* ================= CONTENU PRINCIPAL & FILTRES ================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10 space-y-6">
        
        {/* Barre de recherche et filtres */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Recherche textuelle */}
          <div className="relative w-full md:w-96">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Rechercher une ville, une région, un service..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:border-[#003b95] transition-all"
            />
          </div>

          {/* Filtres par type */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            {["Tous", "Commune", "Conseil Régional"].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedType === type
                    ? "bg-[#003b95] text-white shadow-md"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Grille des collectivités */}
        {filteredCollectivites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredCollectivites.map((item) => (
              <div 
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Image de couverture */}
                  <div className="relative h-48 sm:h-56 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.nom} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#c9a84c] text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm">
                      {item.type}
                    </div>
                  </div>

                  {/* Informations principales */}
                  <div className="p-6 space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-xl font-black text-slate-900 group-hover:text-[#003b95] transition-colors">
                        {item.nom}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <MapPin size={14} className="text-[#c9a84c]" />
                        <span>{item.region}</span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-[#003b95]" />
                        <span className="font-bold">{item.contact}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building2 size={14} className="text-[#003b95]" />
                        <span className="truncate">{item.adresse}</span>
                      </div>
                    </div>

                    {/* Section des services intégrés */}
                    <div className="space-y-2 pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                        <Briefcase size={14} className="text-[#c9a84c]" />
                        <span>Services proposés :</span>
                      </div>
                      <div className="space-y-1.5">
                        {item.services.map((service) => (
                          <div key={service.id} className="bg-slate-50 p-2 rounded-xl border border-slate-100 space-y-0.5">
                            <div className="text-xs font-bold text-[#003b95] flex items-center gap-1">
                              <CheckCircle2 size={12} className="text-emerald-600" />
                              <span>{service.nom}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                              {service.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bouton d'action */}
                <div className="p-6 pt-0">
                  <Link 
                    href={`/services/collectivites/${item.id}`}
                    className="w-full bg-slate-50 hover:bg-[#003b95] text-slate-700 hover:text-white border border-slate-200 hover:border-[#003b95] text-xs font-black py-3 rounded-xl transition-all flex items-center justify-center gap-2 group/btn"
                  >
                    <span>Consulter la fiche détaillée</span>
                    <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3">
            <Building2 size={40} className="mx-auto text-slate-300" />
            <h3 className="text-base font-bold text-slate-700">Aucune collectivité trouvée</h3>
            <p className="text-xs text-slate-500">Essayez de modifier vos critères de recherche.</p>
          </div>
        )}

      </main>

    </div>
  );
}