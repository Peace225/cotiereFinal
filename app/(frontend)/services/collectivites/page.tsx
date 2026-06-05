"use client";
import { useState, useEffect } from "react";
import { ArrowRight, Phone, CheckCircle, X, Clock, ChevronLeft, Loader2, Building2, MapPin, Mail, Globe, Search, ChevronDown } from "lucide-react";

type DbService = {
  id: string; nom: string; categorie: string; description: string; image: string;
};

type Collectivite = {
  id?: string; nom: string; type: "mairie" | "conseil" | "service"; ville: string; region: string;
  telephone?: string; email?: string; adresse?: string; siteWeb?: string; horaires?: string;
};

const COLLECTIVITES: Collectivite[] = [
  // MAIRIES
  { nom: "Mairie d'Abidjan (Commune du Plateau)", type: "mairie", ville: "Abidjan", region: "Lagunes", telephone: "+22527213000", email: "mairie.plateau@abidjan.ci", adresse: "Avenue Terrasson de Fougères, Plateau, Abidjan", horaires: "Lun–Ven 7h30–16h30" },
  { nom: "Mairie de Grand-Bassam", type: "mairie", ville: "Grand-Bassam", region: "Sud-Comoé", telephone: "+22527301000", email: "mairie@grandbassam.ci", adresse: "Quartier France, Grand-Bassam", horaires: "Lun–Ven 7h30–16h30" },
  { nom: "Mairie d'Assinie-Mafia", type: "mairie", ville: "Assinie-Mafia", region: "Sud-Comoé", telephone: "+22527401000", adresse: "Assinie-Mafia, Sous-préfecture d'Adiaké", horaires: "Lun–Ven 7h30–16h30" },
  { nom: "Mairie d'Adiaké", type: "mairie", ville: "Adiaké", region: "Sud-Comoé", telephone: "+22527251000", adresse: "Centre-ville, Adiaké", horaires: "Lun–Ven 7h30–16h30" },
  { nom: "Mairie d'Aboisso", type: "mairie", ville: "Aboisso", region: "Sud-Comoé", telephone: "+22527201000", adresse: "Centre-ville, Aboisso", horaires: "Lun–Ven 7h30–16h30" },
  { nom: "Mairie de Jacqueville", type: "mairie", ville: "Jacqueville", region: "Lagunes", telephone: "+22527501000", adresse: "Jacqueville, Île de Jacqueville", horaires: "Lun–Ven 7h30–16h30" },
  { nom: "Mairie de Dabou", type: "mairie", ville: "Dabou", region: "Lagunes", telephone: "+22527601000", adresse: "Centre-ville, Dabou", horaires: "Lun–Ven 7h30–16h30" },
  { nom: "Mairie de Grand-Lahou", type: "mairie", ville: "Grand-Lahou", region: "Grands-Ponts", telephone: "+22527701000", adresse: "Centre-ville, Grand-Lahou", horaires: "Lun–Ven 7h30–16h30" },
  { nom: "Mairie de Fresco", type: "mairie", ville: "Fresco", region: "Grands-Ponts", telephone: "+22527801000", adresse: "Centre-ville, Fresco", horaires: "Lun–Ven 7h30–16h30" },
  { nom: "Mairie de Sassandra", type: "mairie", ville: "Sassandra", region: "Bas-Sassandra", telephone: "+22527901000", adresse: "Centre-ville, Sassandra", horaires: "Lun–Ven 7h30–16h30" },
  { nom: "Mairie de San-Pédro", type: "mairie", ville: "San-Pédro", region: "Bas-Sassandra", telephone: "+22534711000", email: "mairie@sanpedro.ci", adresse: "Centre-ville, San-Pédro", horaires: "Lun–Ven 7h30–16h30" },
  { nom: "Mairie de Grand-Béréby", type: "mairie", ville: "Grand-Béréby", region: "Bas-Sassandra", telephone: "+22507112233", adresse: "Centre-ville, Grand-Béréby", horaires: "Lun–Ven 7h30–16h30" },
  { nom: "Mairie de Tabou", type: "mairie", ville: "Tabou", region: "Bas-Sassandra", telephone: "+22534801000", adresse: "Centre-ville, Tabou", horaires: "Lun–Ven 7h30–16h30" },

  // CONSEILS RÉGIONAUX
  { nom: "Conseil Régional du Sud-Comoé", type: "conseil", ville: "Aboisso", region: "Sud-Comoé", telephone: "+22527200100", email: "cr.sudcomoe@ci.ci", adresse: "Aboisso, Région du Sud-Comoé", horaires: "Lun–Ven 8h–17h" },
  { nom: "Conseil Régional des Lagunes", type: "conseil", ville: "Dabou", region: "Lagunes", telephone: "+22527600100", email: "cr.lagunes@ci.ci", adresse: "Dabou, Région des Lagunes", horaires: "Lun–Ven 8h–17h" },
  { nom: "Conseil Régional des Grands-Ponts", type: "conseil", ville: "Grand-Lahou", region: "Grands-Ponts", telephone: "+22527700100", adresse: "Grand-Lahou, Région des Grands-Ponts", horaires: "Lun–Ven 8h–17h" },
  { nom: "Conseil Régional du Bas-Sassandra", type: "conseil", ville: "San-Pédro", region: "Bas-Sassandra", telephone: "+22534710100", email: "cr.bassassandra@ci.ci", adresse: "San-Pédro, Région du Bas-Sassandra", horaires: "Lun–Ven 8h–17h" },

  // SERVICES PUBLICS
  { nom: "Préfecture d'Aboisso", type: "service", ville: "Aboisso", region: "Sud-Comoé", telephone: "+22527201100", adresse: "Préfecture d'Aboisso", horaires: "Lun–Ven 7h30–16h30" },
  { nom: "Préfecture de Grand-Bassam", type: "service", ville: "Grand-Bassam", region: "Sud-Comoé", telephone: "+22527301100", adresse: "Préfecture de Grand-Bassam", horaires: "Lun–Ven 7h30–16h30" },
  { nom: "Préfecture de Dabou", type: "service", ville: "Dabou", region: "Lagunes", telephone: "+22527601100", adresse: "Préfecture de Dabou", horaires: "Lun–Ven 7h30–16h30" },
  { nom: "Préfecture de San-Pédro", type: "service", ville: "San-Pédro", region: "Bas-Sassandra", telephone: "+22534711100", adresse: "Préfecture de San-Pédro", horaires: "Lun–Ven 7h30–16h30" },
  { nom: "Préfecture de Sassandra", type: "service", ville: "Sassandra", region: "Bas-Sassandra", telephone: "+22527901100", adresse: "Préfecture de Sassandra", horaires: "Lun–Ven 7h30–16h30" },
  { nom: "Sous-Préfecture d'Adiaké", type: "service", ville: "Adiaké", region: "Sud-Comoé", telephone: "+22527251100", adresse: "Sous-Préfecture d'Adiaké", horaires: "Lun–Ven 7h30–16h30" },
  { nom: "Sous-Préfecture de Jacqueville", type: "service", ville: "Jacqueville", region: "Lagunes", telephone: "+22527501100", adresse: "Sous-Préfecture de Jacqueville", horaires: "Lun–Ven 7h30–16h30" },
  { nom: "Sous-Préfecture de Grand-Lahou", type: "service", ville: "Grand-Lahou", region: "Grands-Ponts", telephone: "+22527701100", adresse: "Sous-Préfecture de Grand-Lahou", horaires: "Lun–Ven 7h30–16h30" },
  { nom: "Sous-Préfecture de Fresco", type: "service", ville: "Fresco", region: "Grands-Ponts", telephone: "+22527801100", adresse: "Sous-Préfecture de Fresco", horaires: "Lun–Ven 7h30–16h30" },
  { nom: "Sous-Préfecture de Grand-Béréby", type: "service", ville: "Grand-Béréby", region: "Bas-Sassandra", telephone: "+22507112244", adresse: "Sous-Préfecture de Grand-Béréby", horaires: "Lun–Ven 7h30–16h30" },
  { nom: "Sous-Préfecture de Tabou", type: "service", ville: "Tabou", region: "Bas-Sassandra", telephone: "+22534801100", adresse: "Sous-Préfecture de Tabou", horaires: "Lun–Ven 7h30–16h30" },
  { nom: "Direction Régionale de la Santé - San-Pédro", type: "service", ville: "San-Pédro", region: "Bas-Sassandra", telephone: "+22534711200", adresse: "San-Pédro", horaires: "Lun–Ven 7h30–16h30" },
  { nom: "Direction Régionale de l'Éducation - Aboisso", type: "service", ville: "Aboisso", region: "Sud-Comoé", telephone: "+22527201200", adresse: "Aboisso", horaires: "Lun–Ven 7h30–16h30" },
  { nom: "Port Autonome de San-Pédro", type: "service", ville: "San-Pédro", region: "Bas-Sassandra", telephone: "+22534710000", email: "info@psp.ci", adresse: "Port de San-Pédro", siteWeb: "https://www.psp.ci", horaires: "24h/24 – 7j/7" },
  { nom: "Chambre de Commerce d'Aboisso", type: "service", ville: "Aboisso", region: "Sud-Comoé", telephone: "+22527201300", adresse: "Aboisso", horaires: "Lun–Ven 8h–17h" },
];

const TYPE_LABELS = { mairie: "Mairie", conseil: "Conseil Régional", service: "Service Public" };
const TYPE_COLORS = {
  mairie: "bg-blue-100 text-blue-700 border-blue-200",
  conseil: "bg-purple-100 text-purple-700 border-purple-200",
  service: "bg-green-100 text-green-700 border-green-200",
};
const TYPE_ICONS = { mairie: "🏛️", conseil: "🏢", service: "⚙️" };

const VILLES_LITTORAL = ["Toutes", "Abidjan", "Grand-Bassam", "Assinie-Mafia", "Adiaké", "Aboisso", "Jacqueville", "Dabou", "Grand-Lahou", "Fresco", "Sassandra", "San-Pédro", "Grand-Béréby", "Tabou"];

export default function CollectivitesPage() {
  const [dbServices, setDbServices] = useState<DbService[]>([]);
  const [servicesLoaded, setServicesLoaded] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", email: "", organisation: "", service: "", description: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState<DbService | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [mForm, setMForm] = useState({ name: "", phone: "", email: "", org: "", message: "" });
  const [mSending, setMSending] = useState(false);
  const [mSent, setMSent] = useState(false);

  // Annuaire
  const [annuaire, setAnnuaire] = useState<Collectivite[]>(COLLECTIVITES);
  const [annuaireLoaded, setAnnuaireLoaded] = useState(false);
  const [villeFilter, setVilleFilter] = useState("Toutes");
  const [typeFilter, setTypeFilter] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCollectivites = annuaire.filter(c => {
    const matchVille = villeFilter === "Toutes" || c.ville === villeFilter;
    const matchType = typeFilter === "Tous" || c.type === typeFilter;
    const matchSearch = !searchQuery || c.nom.toLowerCase().includes(searchQuery.toLowerCase()) || c.ville.toLowerCase().includes(searchQuery.toLowerCase());
    return matchVille && matchType && matchSearch;
  });

  // Villes disponibles : statiques + celles ajoutées en DB
  const villesDisponibles = ["Toutes", ...Array.from(new Set([
    ...VILLES_LITTORAL.slice(1),
    ...annuaire.map(c => c.ville),
  ])).sort()];

  useEffect(() => {
    fetch("/api/collectivites/services")
      .then(r => r.json())
      .then(d => { if (d.data?.length > 0) setDbServices(d.data); setServicesLoaded(true); })
      .catch(() => setServicesLoaded(true));
  }, []);

  // Charger l'annuaire depuis la DB (les entrées admin s'ajoutent aux données statiques)
  useEffect(() => {
    fetch("/api/collectivites/annuaire")
      .then(r => r.json())
      .then(d => {
        const dbEntries: Collectivite[] = d.data ?? [];
        if (dbEntries.length > 0) {
          // Fusionner : DB en premier, puis les statiques non présents dans la DB
          const dbNoms = new Set(dbEntries.map((e: Collectivite) => e.nom.toLowerCase()));
          const staticOnly = COLLECTIVITES.filter(c => !dbNoms.has(c.nom.toLowerCase()));
          setAnnuaire([...dbEntries, ...staticOnly]);
        }
        setAnnuaireLoaded(true);
      })
      .catch(() => setAnnuaireLoaded(true));
  }, []);

  function closeModal() {
    setActive(null); setShowForm(false); setMSent(false);
    setMForm({ name: "", phone: "", email: "", org: "", message: "" });
  }

  async function handleModalSubmit(e: React.FormEvent) {
    e.preventDefault(); setMSending(true);
    const msg = encodeURIComponent(`DEMANDE - ${active?.nom}\n\nNom : ${mForm.name}\nTel : ${mForm.phone}\nEmail : ${mForm.email || "-"}\nOrg : ${mForm.org || "-"}\n\n${mForm.message}`);
    setTimeout(() => { window.open(`https://wa.me/2250747722931?text=${msg}`, "_blank"); setMSending(false); setMSent(true); }, 800);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true);
    try {
      await fetch("/api/events/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientFirstName: form.firstName, clientLastName: form.lastName,
          clientPhone: form.phone, clientEmail: form.email || null,
          eventType: "Collectivites - " + form.service,
          eventDate: new Date().toISOString(), eventLocation: form.organisation || "Non précisé",
          guestCount: 1, services: [form.service], description: form.description || "",
        }),
      });
      setSent(true);
    } catch {}
    setLoading(false);
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative text-white py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=1600&q=80" alt="Collectivites" className="w-full h-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/10" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mt-2 mb-4">Collectivités & Services</h1>
            <p className="text-gray-100 text-lg leading-relaxed">Coaching, accompagnement institutionnel et services aux collectivités du littoral ivoirien.</p>
            <a href="#demande" className="btn-primary mt-8 inline-flex">Faire une demande <ArrowRight size={18} /></a>
          </div>
        </div>
      </section>

      {/* Services dynamiques */}
      <section className="py-16 bg-[#f0f9ff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest">Nos services</span>
            <h2 className="section-title mt-2">Accompagnement & développement</h2>
          </div>
          {!servicesLoaded ? (
            <div className="flex justify-center py-12"><Loader2 size={32} className="animate-spin text-[#c9a84c]" /></div>
          ) : dbServices.length === 0 ? (
            <p className="text-center text-gray-400 py-8">Aucun service disponible pour le moment.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dbServices.map((s) => (
                <button key={s.id} onClick={() => { setActive(s); setShowForm(false); setMSent(false); }}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm card-hover border border-gray-100 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#c9a84c]">
                  <div className="relative h-40 overflow-hidden">
                    <img src={s.image} alt={s.nom}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={e => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80"; }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute inset-0 bg-[#c9a84c]/0 group-hover:bg-[#c9a84c]/15 transition-all duration-300" />
                    <span className="absolute top-3 right-3 bg-[#0c4a6e] text-[#c9a84c] text-xs font-bold px-2 py-1 rounded-full">{s.categorie}</span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-[#0a1628] mb-2 group-hover:text-[#c9a84c] transition-colors">{s.nom}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{s.description}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Annuaire des collectivités */}
      <section id="annuaire" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest">Annuaire officiel</span>
            <h2 className="section-title mt-2">Mairies, Conseils Régionaux & Services Publics</h2>
            <p className="text-gray-500 mt-2">Retrouvez les contacts officiels des institutions du littoral ivoirien</p>
          </div>

          {/* Filtres */}
          <div className="flex flex-wrap gap-3 mb-6 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Rechercher une institution..." value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]/30" />
            </div>
            <select value={villeFilter} onChange={e => setVilleFilter(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#c9a84c]/30">
              {villesDisponibles.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            <div className="flex gap-2">
              {["Tous", "mairie", "conseil", "service"].map(t => (
                <button key={t} onClick={() => setTypeFilter(t)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${typeFilter === t ? "bg-[#0c4a6e] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                  {t === "Tous" ? "Tous" : t === "mairie" ? "🏛️ Mairies" : t === "conseil" ? "🏢 Conseils" : "⚙️ Services"}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs text-gray-400 mb-4">{filteredCollectivites.length} institution(s) trouvée(s)</p>

          {/* Grille */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCollectivites.map((c, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border mb-2 ${TYPE_COLORS[c.type]}`}>
                      {TYPE_ICONS[c.type]} {TYPE_LABELS[c.type]}
                    </span>
                    <h3 className="font-bold text-[#0c4a6e] text-sm leading-tight">{c.nom}</h3>
                  </div>
                </div>
                <div className="space-y-1.5 text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={11} className="text-[#c9a84c] shrink-0" />
                    <span>{c.ville} — {c.region}</span>
                  </div>
                  {c.adresse && (
                    <div className="flex items-start gap-1.5">
                      <Building2 size={11} className="text-gray-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{c.adresse}</span>
                    </div>
                  )}
                  {c.horaires && (
                    <div className="flex items-center gap-1.5">
                      <Clock size={11} className="text-gray-400 shrink-0" />
                      <span>{c.horaires}</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 mt-3 flex-wrap">
                  {c.telephone && (
                    <a href={`tel:${c.telephone}`}
                      className="flex items-center gap-1 text-xs bg-[#0c4a6e] text-white px-3 py-1.5 rounded-lg hover:bg-[#083a57] transition-colors">
                      <Phone size={10} /> {c.telephone}
                    </a>
                  )}
                  {c.email && (
                    <a href={`mailto:${c.email}`}
                      className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors">
                      <Mail size={10} /> Email
                    </a>
                  )}
                  {c.siteWeb && (
                    <a href={c.siteWeb} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs bg-[#c9a84c]/10 text-[#c9a84c] px-3 py-1.5 rounded-lg hover:bg-[#c9a84c]/20 transition-colors">
                      <Globe size={10} /> Site web
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulaire */}
      <section id="demande" className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="section-title">Faire une demande</h2>
            <p className="text-gray-500 mt-2">Décrivez votre besoin, nous vous répondons sous 48h.</p>
          </div>
          {sent ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
              <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
              <h3 className="font-bold text-[#0c4a6e] text-lg mb-2">Demande envoyée !</h3>
              <p className="text-gray-500 text-sm">Notre équipe vous contactera sous 48h.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium text-gray-700 mb-1">Prénom *</label>
                  <input required type="text" placeholder="Jean" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" /></div>
                <div><label className="block text-xs font-medium text-gray-700 mb-1">Nom *</label>
                  <input required type="text" placeholder="Kouamé" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium text-gray-700 mb-1">Téléphone *</label>
                  <input required type="tel" placeholder="07 XX XX XX XX" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" /></div>
                <div><label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" placeholder="jean@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" /></div>
              </div>
              <div><label className="block text-xs font-medium text-gray-700 mb-1">Organisation / Collectivité</label>
                <input type="text" placeholder="Mairie de Grand-Bassam, ONG..." value={form.organisation} onChange={e => setForm(f => ({ ...f, organisation: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" /></div>
              <div><label className="block text-xs font-medium text-gray-700 mb-1">Service souhaité *</label>
                <select required value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8] bg-white">
                  <option value="">Sélectionner...</option>
                  {dbServices.map(s => <option key={s.id} value={s.nom}>{s.nom}</option>)}
                </select></div>
              <div><label className="block text-xs font-medium text-gray-700 mb-1">Description du besoin</label>
                <textarea rows={3} placeholder="Décrivez votre projet ou besoin..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8] resize-none" /></div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60">
                {loading ? "Envoi..." : <><span>Envoyer ma demande</span><ArrowRight size={16} /></>}
              </button>
              <p className="text-xs text-gray-400 text-center">Réponse sous 48h · Gratuit et sans engagement</p>
            </form>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#38bdf8] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Vous êtes une collectivité ou une institution ?</h2>
          <p className="text-gray-200 mb-8">Contactez-nous directement pour un accompagnement personnalisé.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#demande" className="btn-primary">Faire une demande <ArrowRight size={18} /></a>
            <a href="tel:+2250747722931" className="flex items-center gap-2 bg-white/10 border border-white/30 text-white font-bold px-5 py-3 rounded-xl hover:bg-white/20 transition-colors">
              <Phone size={18} /> 07 47 72 29 31
            </a>
          </div>
        </div>
      </section>

      {/* Modal */}
      {active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="relative h-44 rounded-t-2xl overflow-hidden shrink-0">
              <img src={active.image} alt={active.nom} className="w-full h-full object-cover"
                onError={e => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80"; }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-5 right-12">
                <span className="bg-[#c9a84c] text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-2 inline-block">CÔTIÈRE</span>
                <h2 className="text-lg font-black text-white leading-tight">{active.nom}</h2>
                <p className="text-white/70 text-xs mt-0.5">{active.categorie}</p>
              </div>
              <button onClick={closeModal} className="absolute top-3 right-3 w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="p-6 space-y-5">
              {showForm ? (
                mSent ? (
                  <div className="text-center py-8">
                    <CheckCircle size={52} className="text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-[#0c4a6e] mb-2">Demande envoyée !</h3>
                    <p className="text-gray-500 text-sm mb-6">Notre équipe vous contactera sous 48h.</p>
                    <button onClick={closeModal} className="btn-primary justify-center">Fermer</button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setShowForm(false)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#0c4a6e] transition-colors">
                        <ChevronLeft size={16} /> Retour
                      </button>
                      <h3 className="font-bold text-[#0c4a6e] text-sm">Demande — <span className="text-[#c9a84c]">{active.nom}</span></h3>
                    </div>
                    <form onSubmit={handleModalSubmit} className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div><label className="block text-xs font-semibold text-gray-600 mb-1">Prénom / Nom *</label>
                          <input type="text" required value={mForm.name} onChange={e => setMForm(f => ({ ...f, name: e.target.value }))} placeholder="Jean Kouamé" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" /></div>
                        <div><label className="block text-xs font-semibold text-gray-600 mb-1">Téléphone *</label>
                          <input type="tel" required value={mForm.phone} onChange={e => setMForm(f => ({ ...f, phone: e.target.value }))} placeholder="07 XX XX XX XX" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" /></div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div><label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                          <input type="email" value={mForm.email} onChange={e => setMForm(f => ({ ...f, email: e.target.value }))} placeholder="jean@email.com" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" /></div>
                        <div><label className="block text-xs font-semibold text-gray-600 mb-1">Organisation</label>
                          <input type="text" value={mForm.org} onChange={e => setMForm(f => ({ ...f, org: e.target.value }))} placeholder="Mairie, ONG..." className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" /></div>
                      </div>
                      <div><label className="block text-xs font-semibold text-gray-600 mb-1">Votre besoin *</label>
                        <textarea required value={mForm.message} onChange={e => setMForm(f => ({ ...f, message: e.target.value }))} rows={4} maxLength={500}
                          placeholder={`Décrivez votre projet pour "${active.nom}"...`}
                          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c] resize-none" />
                        <p className="text-xs text-gray-400 text-right">{mForm.message.length}/500</p></div>
                      <div className="flex gap-3">
                        <button type="submit" disabled={mSending} className="flex-1 btn-primary justify-center py-3 disabled:opacity-60">
                          {mSending ? <><Loader2 size={15} className="animate-spin" /> Envoi...</> : <>Envoyer <ArrowRight size={14} /></>}
                        </button>
                        <a href="tel:+2250747722931" className="flex items-center gap-2 border border-[#0c4a6e]/20 text-[#0c4a6e] text-sm font-semibold px-4 rounded-xl hover:bg-[#0c4a6e]/5 transition-colors"><Phone size={14} /></a>
                      </div>
                      <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-1"><Clock size={10} /> Réponse sous 48h · Gratuit & sans engagement</p>
                    </form>
                  </>
                )
              ) : (
                <>
                  <p className="text-sm text-gray-600 leading-relaxed">{active.description}</p>
                  <div className="flex gap-3 pt-2 border-t border-gray-100">
                    <button onClick={() => setShowForm(true)} className="flex-1 btn-primary justify-center text-sm py-2.5">
                      Faire une demande <ArrowRight size={14} />
                    </button>
                    <a href="tel:+2250747722931" className="flex items-center gap-2 border border-[#0c4a6e]/20 text-[#0c4a6e] text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#0c4a6e]/5 transition-colors">
                      <Phone size={14} /> Appeler
                    </a>
                  </div>
                  <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-1"><Clock size={10} /> Réponse sous 48h · Gratuit & sans engagement</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
