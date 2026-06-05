"use client";
import { useState, useEffect } from "react";
import { ArrowRight, CheckCircle, Rocket, Tv, Radio, Newspaper, Lightbulb, X, Check, Phone, Clock, ChevronLeft, Loader2, Smartphone, Monitor, Mic2, BookOpen, Video, Calendar, FileText, Newspaper as News } from "lucide-react";
import Link from "next/link";

// ─── CÔTIÈRE INFO+ DATA ───────────────────────────────────────────────────────
type Prestation = {
  slug: string; label: string; image: string; icon: React.ReactNode;
  subtitle: string; description: string; priceRange: string;
  included: string[]; process: { step: string; desc: string }[];
  useCases: string[];
};

const PRESTATIONS: Prestation[] = [
  {
    slug: "reportages",
    label: "Reportages vidéo et photo",
    image: "/Images/cotiere-info.png",
    icon: <Video size={16} />,
    subtitle: "Caméras 4K · Photojournalisme · Montage inclus",
    description: "Des reportages professionnels qui racontent l'histoire du littoral",
    priceRange: "80 000 — 250 000 FCFA",
    included: [
      "Équipe de tournage (caméraman + photographe)",
      "Caméras 4K professionnelles",
      "Prise de son HD",
      "Montage vidéo complet",
      "Retouche photo professionnelle",
      "Livraison en HD (vidéo + photos)",
      "Droits de diffusion inclus",
      "Publication sur CÔTIÈRE INFO+",
    ],
    process: [
      { step: "Brief éditorial", desc: "Définition du sujet, angle et format du reportage" },
      { step: "Repérages", desc: "Visite du lieu et planification du tournage" },
      { step: "Tournage", desc: "Reportage sur le terrain avec l'équipe CÔTIÈRE" },
      { step: "Montage & diffusion", desc: "Post-production et publication sur nos médias" },
    ],
    useCases: ["Événements culturels", "Portraits d'entreprises", "Sujets sociaux", "Tourisme & patrimoine", "Politique locale", "Sport & loisirs"],
  },
  {
    slug: "interviews",
    label: "Interviews et émissions spéciales",
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&q=80",
    icon: <Mic2 size={16} />,
    subtitle: "Studio · Plateau TV · Diffusion multi-canaux",
    description: "Donnez la parole à vos experts et personnalités",
    priceRange: "60 000 — 200 000 FCFA",
    included: [
      "Studio d'interview professionnel",
      "Éclairage plateau TV",
      "Journaliste/animateur expérimenté",
      "Prise de son HD",
      "Montage et habillage graphique",
      "Diffusion sur CÔTIÈRE TV & FM",
      "Publication sur réseaux sociaux",
      "Archive numérique permanente",
    ],
    process: [
      { step: "Préparation", desc: "Élaboration des questions et briefing de l'invité" },
      { step: "Installation plateau", desc: "Mise en place du décor et des équipements" },
      { step: "Enregistrement", desc: "Interview ou émission en studio ou sur le terrain" },
      { step: "Diffusion", desc: "Montage et diffusion sur tous nos canaux" },
    ],
    useCases: ["Personnalités politiques", "Chefs d'entreprise", "Artistes & culturels", "Experts & spécialistes", "Associations", "Institutions publiques"],
  },
  {
    slug: "couverture-evenements",
    label: "Couverture d'événements",
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&q=80",
    icon: <Calendar size={16} />,
    subtitle: "Live · Multi-caméras · Réseaux sociaux en temps réel",
    description: "Votre événement couvert en direct et en différé",
    priceRange: "100 000 — 350 000 FCFA",
    included: [
      "Équipe complète (journaliste + caméraman + photographe)",
      "Couverture live sur réseaux sociaux",
      "Streaming en direct (sur option)",
      "Photos & vidéos de l'événement",
      "Article de presse publié sur CÔTIÈRE INFO+",
      "Diffusion radio CÔTIÈRE FM",
      "Montage du résumé vidéo",
      "Rapport de couverture médiatique",
    ],
    process: [
      { step: "Accréditation", desc: "Demande d'accréditation et planification de la couverture" },
      { step: "Déploiement", desc: "Arrivée de l'équipe avant le début de l'événement" },
      { step: "Couverture live", desc: "Reportage en temps réel sur tous nos canaux" },
      { step: "Publication", desc: "Article + vidéo publiés dans les 24h" },
    ],
    useCases: ["Conférences & sommets", "Festivals & concerts", "Cérémonies officielles", "Inaugurations", "Événements sportifs", "Galas & remises de prix"],
  },
  {
    slug: "contenus-informatifs",
    label: "Publication de contenus informatifs",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80",
    icon: <FileText size={16} />,
    subtitle: "Articles · Communiqués · Réseaux sociaux · Newsletter",
    description: "Diffusez votre message auprès du littoral ivoirien",
    priceRange: "25 000 — 100 000 FCFA",
    included: [
      "Rédaction d'articles de presse",
      "Communiqués de presse officiels",
      "Publication sur CÔTIÈRE INFO+",
      "Diffusion sur nos réseaux sociaux (Facebook, Instagram, TikTok)",
      "Mention dans la newsletter CÔTIÈRE",
      "Référencement Google News",
      "Traduction français/anglais (sur option)",
      "Rapport de portée & statistiques",
    ],
    process: [
      { step: "Brief contenu", desc: "Définition du message, du ton et de la cible" },
      { step: "Rédaction", desc: "Création du contenu par notre équipe éditoriale" },
      { step: "Validation", desc: "Relecture et validation par le client" },
      { step: "Publication & diffusion", desc: "Mise en ligne et partage sur tous nos canaux" },
    ],
    useCases: ["Annonces officielles", "Lancements de produits", "Communiqués d'entreprise", "Appels à projets", "Offres d'emploi", "Événements à venir"],
  },
];

const actualites = [
  { id: "grand-bassam-patrimoine", titre: "Grand-Bassam : le patrimoine UNESCO à l'honneur", date: "Avril 2026", image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80", categorie: "Patrimoine" },
  { id: "tourisme-saison-record", titre: "Tourisme littoral : une saison record attendue", date: "Mars 2026", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80", categorie: "Tourisme" },
  { id: "pecheurs-littoral", titre: "Les pêcheurs du littoral à l'honneur", date: "Mars 2026", image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80", categorie: "Culture" },
  { id: "developpement-economique", titre: "Développement économique de la Côtière ivoirienne", date: "Février 2026", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80", categorie: "Économie" },
  { id: "festival-musique-2026", titre: "Festival de musique du littoral 2026", date: "Février 2026", image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80", categorie: "Culture" },
  { id: "nouvelles-infrastructures", titre: "Nouvelles infrastructures pour la Côtière", date: "Janvier 2026", image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80", categorie: "Infrastructure" },
];

// ─── CÔTIÈRE MÉDIAS (PUBLICITÉ) DATA ─────────────────────────────────────────
type AdSpace = {
  slug: string; label: string; image: string; icon: React.ReactNode;
  subtitle: string; description: string;
  formats: { name: string; price: string; unit: string; desc: string }[];
  included: string[]; useCases: string[];
};

const AD_SPACES: AdSpace[] = [
  {
    slug: "digital",
    label: "Publicité digitale",
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&q=80",
    icon: <Smartphone size={16} />,
    subtitle: "Réseaux sociaux · Site web · Newsletter",
    description: "Touchez votre audience sur tous les canaux digitaux du littoral",
    formats: [
      { name: "Post sponsorisé Facebook/Instagram", price: "50 000", unit: "semaine", desc: "Ciblage géographique littoral ivoirien" },
      { name: "Story sponsorisée", price: "30 000", unit: "semaine", desc: "Format vertical 9:16, 15 secondes" },
      { name: "Bannière site CÔTIÈRE INFO+", price: "80 000", unit: "mois", desc: "728×90 ou 300×250 pixels" },
      { name: "Encart newsletter", price: "40 000", unit: "envoi", desc: "Base de 5 000+ abonnés" },
      { name: "Campagne TikTok", price: "60 000", unit: "semaine", desc: "Vidéo courte, audience jeune" },
      { name: "Forfait digital complet", price: "200 000", unit: "mois", desc: "Tous canaux + reporting mensuel" },
    ],
    included: ["Création des visuels (sur option)", "Ciblage géographique précis", "Rapport de performance hebdomadaire", "Optimisation en cours de campagne", "Accès tableau de bord statistiques"],
    useCases: ["Commerces locaux", "Restaurants & hôtels", "Événements", "Lancements de produits", "Recrutement", "Associations"],
  },
  {
    slug: "radio",
    label: "Spots publicitaires radio",
    image: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=600&q=80",
    icon: <Mic2 size={16} />,
    subtitle: "CÔTIÈRE FM · Littoral ivoirien · Audience locale",
    description: "La radio de proximité du littoral ivoirien à votre service",
    formats: [
      { name: "Spot 15 secondes", price: "50 000", unit: "passage", desc: "Message court et percutant" },
      { name: "Spot 30 secondes", price: "80 000", unit: "passage", desc: "Format standard recommandé" },
      { name: "Spot 60 secondes", price: "120 000", unit: "passage", desc: "Message détaillé" },
      { name: "Jingle personnalisé", price: "200 000", unit: "création", desc: "Musique + voix, droits inclus" },
      { name: "Sponsoring d'émission", price: "150 000", unit: "semaine", desc: "Mention avant/après émission" },
      { name: "Forfait mensuel", price: "600 000", unit: "mois", desc: "Passages illimités sur plages horaires" },
    ],
    included: ["Production du spot (voix off + musique)", "Diffusion aux heures de grande écoute", "Certificat de diffusion", "Rapport d'audience mensuel", "Révisions du script incluses"],
    useCases: ["Commerces & boutiques", "Événements locaux", "Services professionnels", "Campagnes politiques", "ONG & associations", "Promotions & soldes"],
  },
  {
    slug: "tv",
    label: "Spots TV et vidéo",
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&q=80",
    icon: <Monitor size={16} />,
    subtitle: "CÔTIÈRE TV · Production 4K · Diffusion nationale",
    description: "L'impact visuel de la télévision pour votre marque",
    formats: [
      { name: "Spot 15 secondes", price: "150 000", unit: "passage", desc: "Format court, fort impact" },
      { name: "Spot 30 secondes", price: "250 000", unit: "passage", desc: "Format standard TV" },
      { name: "Spot 60 secondes", price: "400 000", unit: "passage", desc: "Message complet" },
      { name: "Sponsoring d'émission", price: "500 000", unit: "semaine", desc: "Logo + mention à l'antenne" },
      { name: "Reportage publicitaire", price: "800 000", unit: "unité", desc: "3-5 minutes, format magazine" },
      { name: "Forfait mensuel", price: "2 000 000", unit: "mois", desc: "Package complet multi-créneaux" },
    ],
    included: ["Production du spot (tournage + montage)", "Étalonnage colorimétrique professionnel", "Diffusion aux créneaux premium", "Rapport d'audience mensuel", "Archivage numérique du spot"],
    useCases: ["Grandes entreprises", "Banques & assurances", "Immobilier", "Automobile", "Tourisme & hôtellerie", "Institutions publiques"],
  },
  {
    slug: "magazine",
    label: "Encarts magazine",
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&q=80",
    icon: <BookOpen size={16} />,
    subtitle: "CÔTIÈRE MAGAZINE · Publication mensuelle · Littoral ivoirien",
    description: "Le magazine de référence du littoral ivoirien",
    formats: [
      { name: "1/4 de page", price: "100 000", unit: "parution", desc: "Format 90×130 mm" },
      { name: "1/2 page", price: "180 000", unit: "parution", desc: "Format 190×130 mm" },
      { name: "Page entière", price: "300 000", unit: "parution", desc: "Format 190×270 mm" },
      { name: "Couverture 4ème", price: "500 000", unit: "parution", desc: "Emplacement premium" },
      { name: "Publi-reportage", price: "400 000", unit: "parution", desc: "Article + photos, 1 page" },
      { name: "Encart inséré", price: "250 000", unit: "parution", desc: "Feuillet A4 inséré" },
    ],
    included: ["Conception graphique de l'annonce (sur option)", "Fichier HD fourni ou créé", "Bon à tirer avant impression", "Distribution sur tout le littoral", "Version numérique incluse"],
    useCases: ["Hôtels & résidences", "Restaurants gastronomiques", "Agences immobilières", "Cabinets professionnels", "Artisans & PME", "Événements culturels"],
  },
];

const medias = [
  { title: "CÔTIÈRE TV", desc: "Production et diffusion d'émissions télévisées, publicité TV, reportages sur le littoral ivoirien.", badge: "Bientôt disponible", image: "/Images/cotiere-tv.png" },
  { title: "CÔTIÈRE FM", desc: "1er réseau de radios de proximité des villes du littoral ivoirien. Publicité radio, émissions locales.", badge: "Bientôt disponible", image: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=600&q=80" },
  { title: "CÔTIÈRE MAGAZINE", desc: "Publication mensuelle dédiée au potentiel économique, culturel et touristique du littoral ivoirien.", badge: "Bientôt disponible", image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&q=80" },
  { title: "CÔTIÈRE INFO+", desc: "Reportages, interviews, couverture d'événements et publication de contenus sur le littoral ivoirien.", badge: "Disponible", image: "/Images/cotiere-info.png" },
];

// ─── COMPOSANT PRINCIPAL ──────────────────────────────────────────────────────
export default function MediasPage() {
  const [tab, setTab] = useState<"medias" | "info">("medias");
  const [dbSupports, setDbSupports] = useState<{ id: string; nom: string; description: string; image: string; badge: string }[]>([]);

  useEffect(() => {
    fetch("/api/medias/supports")
      .then(r => r.json())
      .then(d => { if (d.data?.length > 0) setDbSupports(d.data); })
      .catch(() => {});
  }, []);

  // État publicité
  const [form, setForm] = useState({ clientName: "", clientEmail: "", clientPhone: "", companyName: "", mediaType: "", adType: "", budget: "", description: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeAd, setActiveAd] = useState<AdSpace | null>(null);
  const [showAdForm, setShowAdForm] = useState(false);
  const [adForm, setAdForm] = useState({ name: "", phone: "", email: "", format: "", budget: "", message: "" });
  const [adSending, setAdSending] = useState(false);
  const [adSent, setAdSent] = useState(false);

  // État INFO+
  const [activeInfo, setActiveInfo] = useState<Prestation | null>(null);
  const [showInfoForm, setShowInfoForm] = useState(false);
  const [infoForm, setInfoForm] = useState({ firstName: "", phone: "", email: "", message: "" });
  const [infoSending, setInfoSending] = useState(false);
  const [infoSent, setInfoSent] = useState(false);
  const [infoErr, setInfoErr] = useState("");

  function closeAdModal() { setActiveAd(null); setShowAdForm(false); setAdSent(false); setAdForm({ name: "", phone: "", email: "", format: "", budget: "", message: "" }); }
  function closeInfoModal() { setActiveInfo(null); setShowInfoForm(false); setInfoSent(false); setInfoErr(""); setInfoForm({ firstName: "", phone: "", email: "", message: "" }); }

  async function handleAdSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAdSending(true);
    const msg = encodeURIComponent(
      `DEMANDE PUBLICITE - ${activeAd?.label}\n\nNom : ${adForm.name}\nTel : ${adForm.phone}\nEmail : ${adForm.email || "-"}\nFormat : ${adForm.format || "-"}\nBudget : ${adForm.budget || "-"}\n\nMessage :\n${adForm.message}`
    );
    setTimeout(() => { window.open(`https://wa.me/2250747722931?text=${msg}`, "_blank"); setAdSending(false); setAdSent(true); }, 800);
  }

  async function handleInfoSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!infoForm.firstName || !infoForm.phone || !infoForm.message) { setInfoErr("Veuillez remplir les champs obligatoires."); return; }
    setInfoSending(true); setInfoErr("");
    const msg = encodeURIComponent(
      `DEMANDE COTIERE INFO+ - ${activeInfo?.label}\n\nNom : ${infoForm.firstName}\nTel : ${infoForm.phone}\nEmail : ${infoForm.email || "-"}\n\nMessage :\n${infoForm.message}`
    );
    setTimeout(() => { window.open(`https://wa.me/2250747722931?text=${msg}`, "_blank"); setInfoSending(false); setInfoSent(true); }, 800);
  }

  async function handleDevisSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/medias", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const msg = encodeURIComponent("DEMANDE PUBLICITE MEDIAS\n\nClient: " + form.clientName + "\nTel: " + form.clientPhone + "\nSupport: " + form.mediaType + "\nType: " + form.adType + "\nBudget: " + (form.budget || "Non precise") + "\nDetails: " + (form.description || "Aucun") + "\n\n-- COTIERE MEDIA GROUP\n1er site officiel des villes et villages du littoral ivoirien\nTel: 07 47 72 29 31");
      window.open("https://wa.me/2250747722931?text=" + msg, "_blank");
      setSent(true);
    } catch {}
    setLoading(false);
  }

  return (
    <div className="min-h-screen">
      {/* ── HERO ── */}
      <section className="relative text-white py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/Images/cotiere-tv.png" alt="COTIERE MEDIAS" className="w-full h-full object-contain" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest">Groupe Multimédia</span>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mt-2 mb-4">CÔTIÈRE MÉDIAS</h1>
            <p className="text-[#c9a84c] font-semibold text-lg mb-3">« La voix officielle du littoral Ivoirien »</p>
            <p className="text-gray-100 text-lg leading-relaxed">TV, Radio, Magazine & INFO+ — le groupe multimédia de référence du littoral ivoirien.</p>
            <div className="flex flex-wrap gap-3 mt-8">
              <a href="#supports" className="btn-primary inline-flex">Nos supports <ArrowRight size={18} /></a>
              <a href="tel:+2250747722931" className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-bold px-5 py-3 rounded-xl hover:bg-white/20 transition-colors">
                <Phone size={18} /> Nous contacter
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── ONGLETS ── */}
      <div className="sticky top-16 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 py-2">
            <button onClick={() => setTab("medias")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === "medias" ? "bg-[#0c4a6e] text-white" : "text-gray-500 hover:bg-gray-50"}`}>
              <Tv size={15} /> CÔTIÈRE MÉDIAS
            </button>
            <button onClick={() => setTab("info")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === "info" ? "bg-[#c9a84c] text-white" : "text-gray-500 hover:bg-gray-50"}`}>
              <News size={15} /> CÔTIÈRE INFO+
            </button>
          </div>
        </div>
      </div>
      {/* ── ONGLET MEDIAS ── */}

      {/* ── ONGLET MÉDIAS ── */}
      {tab === "medias" && (
        <>
          {/* 4 supports */}
          <section id="supports" className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest">Nos médias</span>
                <h2 className="section-title mt-2">4 supports, 1 groupe</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {dbSupports.map((m) => (
                  <div key={m.id} className="group bg-white rounded-xl overflow-hidden shadow-sm card-hover border border-gray-100">
                    <div className="relative h-44 overflow-hidden">
                      <img src={m.image} alt={m.nom} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Rocket size={12} /> Disponible
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-[#0a1628] mb-2">{m.nom}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{m.description}</p>
                    </div>
                  </div>
                ))}
                {dbSupports.length === 0 && medias.map((m) => (
                  <div key={m.title} className="group bg-white rounded-xl overflow-hidden shadow-sm card-hover border border-gray-100">
                    <div className="relative h-44 overflow-hidden">
                      <img src={m.image} alt={m.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <span className={`absolute top-3 right-3 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${m.badge === "Disponible" ? "bg-green-500" : "bg-orange-500"}`}>
                        <Rocket size={12} /> {m.badge}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-[#0a1628] mb-2">{m.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{m.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Espaces publicitaires */}
          <section className="py-16 bg-[#f0f9ff]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="section-title text-center mb-10">Espaces publicitaires</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {AD_SPACES.map((s) => (
                  <button key={s.slug} onClick={() => { setActiveAd(s); setShowAdForm(false); setAdSent(false); }}
                    className="group relative rounded-xl overflow-hidden shadow-sm card-hover text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#c9a84c]">
                    <div className="relative h-32">
                      <img src={s.image} alt={s.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute inset-0 bg-[#c9a84c]/0 group-hover:bg-[#c9a84c]/20 transition-all duration-300" />
                      <p className="absolute bottom-3 left-3 right-3 text-white text-xs font-semibold leading-tight">{s.label}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Grille tarifaire */}
          <section id="tarifs" className="py-16 bg-white">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-10">
                <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest">Transparence</span>
                <h2 className="section-title mt-2">Grille tarifaire publicitaire</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                  { media: "CÔTIÈRE TV", Icon: Tv, color: "border-blue-200 bg-blue-50", headerColor: "bg-blue-600", items: [{ label: "Spot 15s", price: "150 000", unit: "passage" }, { label: "Spot 30s", price: "250 000", unit: "passage" }, { label: "Spot 60s", price: "400 000", unit: "passage" }, { label: "Sponsoring émission", price: "500 000", unit: "semaine" }, { label: "Reportage pub.", price: "800 000", unit: "unité" }, { label: "Forfait mensuel", price: "2 000 000", unit: "mois" }] },
                  { media: "CÔTIÈRE FM", Icon: Radio, color: "border-green-200 bg-green-50", headerColor: "bg-green-600", items: [{ label: "Spot 15s", price: "50 000", unit: "passage" }, { label: "Spot 30s", price: "80 000", unit: "passage" }, { label: "Spot 60s", price: "120 000", unit: "passage" }, { label: "Jingle personnalisé", price: "200 000", unit: "création" }, { label: "Sponsoring émission", price: "150 000", unit: "semaine" }, { label: "Forfait mensuel", price: "600 000", unit: "mois" }] },
                  { media: "CÔTIÈRE MAGAZINE", Icon: Newspaper, color: "border-amber-200 bg-amber-50", headerColor: "bg-[#c9a84c]", items: [{ label: "1/4 de page", price: "100 000", unit: "parution" }, { label: "1/2 page", price: "180 000", unit: "parution" }, { label: "Page entière", price: "300 000", unit: "parution" }, { label: "Couverture 4ème", price: "500 000", unit: "parution" }, { label: "Publi-reportage", price: "400 000", unit: "parution" }, { label: "Encart inséré", price: "250 000", unit: "parution" }] },
                ].map((t) => (
                  <div key={t.media} className={`rounded-2xl border overflow-hidden shadow-sm ${t.color}`}>
                    <div className={`${t.headerColor} text-white px-5 py-4 flex items-center gap-3`}>
                      <t.Icon size={24} />
                      <div><h3 className="font-bold text-base">{t.media}</h3><p className="text-white/70 text-xs">Tarifs en FCFA HT</p></div>
                    </div>
                    <div className="p-4 space-y-2">
                      {t.items.map((item) => (
                        <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-white/60 last:border-0">
                          <span className="text-xs text-gray-700">{item.label}</span>
                          <div className="text-right shrink-0 ml-2">
                            <span className="text-xs font-bold text-[#0c4a6e]">{item.price}</span>
                            <span className="text-xs text-gray-400"> / {item.unit}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-[#f0f9ff] rounded-2xl p-5 border border-[#bae6fd] text-center">
                <p className="text-sm text-[#0c4a6e] font-medium flex items-center justify-center gap-2">
                  <Lightbulb size={16} className="text-[#c9a84c]" /> Remises disponibles pour les campagnes multi-supports et contrats longue durée
                </p>
              </div>

              {/* ── Grille tarifaire visibilité site ── */}
              <div className="mt-12">
                <div className="text-center mb-8">
                  <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest">Référencement</span>
                  <h3 className="text-2xl font-black text-[#0c4a6e] mt-2">Nos grilles tarifaires</h3>
                  <p className="text-gray-500 text-sm mt-1">Tarifs de visibilité sur le site CÔTIÈRE — votre visibilité, notre priorité</p>
                </div>
                <div className="bg-[#0c4a6e] rounded-2xl overflow-hidden shadow-lg">
                  <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
                    <div className="w-1 h-6 bg-[#c9a84c] rounded-full" />
                    <h4 className="text-white font-bold text-lg uppercase tracking-wide">NOS GRILLES TARIFAIRES</h4>
                  </div>
                  <div className="divide-y divide-white/10">
                    {[
                      { icon: "🏨", label: "Hôtels", price: "30 000", unit: "mois" },
                      { icon: "🛋️", label: "Résidence meublée", price: "30 000", unit: "mois" },
                      { icon: "🍽️", label: "Restaurant", price: "20 000", unit: "mois" },
                      { icon: "🚌", label: "Compagnie de transport", price: "50 000", unit: "mois" },
                      { icon: "🎵", label: "Promotion d'œuvre musicale", price: "50 000", unit: "mois" },
                      { icon: "🐟", label: "Grossiste d'attiéké, poissons, crustacés et fruits de mer", price: "25 000", unit: "mois" },
                      { icon: "💡", label: "Jeunes entrepreneurs", price: "10 000", unit: "mois" },
                      { icon: "📅", label: "Événements à promouvoir", price: "20 000", unit: "semaine" },
                      { icon: "🤝", label: "Opportunités à saisir", price: "10% sur chaque marché obtenu via le site", unit: "" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-4">
                          <span className="text-2xl w-8 text-center">{item.icon}</span>
                          <span className="text-white font-medium text-sm">{item.label}</span>
                        </div>
                        <div className="shrink-0 ml-4 text-right">
                          {item.unit ? (
                            <span className="bg-[#c9a84c] text-white text-xs font-bold px-4 py-2 rounded-lg whitespace-nowrap">
                              {item.price} <span className="font-normal opacity-80">/ {item.unit}</span>
                            </span>
                          ) : (
                            <span className="bg-[#c9a84c] text-white text-xs font-bold px-4 py-2 rounded-lg text-center leading-tight block max-w-[200px]">
                              {item.price}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 bg-[#f0f9ff] rounded-2xl p-5 border border-[#bae6fd] text-center">
                  <p className="text-sm text-[#0c4a6e] font-medium flex items-center justify-center gap-2">
                    <Lightbulb size={16} className="text-[#c9a84c]" /> Tarifs FCFA HT — Paiement mensuel ou trimestriel avec remise de 10%
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Formulaire devis */}
          <section id="devis" className="py-16 bg-[#f0f9ff]">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8">
                <h2 className="section-title">Demander un devis publicitaire</h2>
                <p className="text-gray-500 mt-2">Décrivez votre projet, nous vous répondons sous 24h.</p>
              </div>
              {sent ? (
                <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
                  <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                  <h3 className="font-bold text-[#0c4a6e] text-lg mb-2">Demande envoyée !</h3>
                  <p className="text-gray-500 text-sm">Notre équipe commerciale vous contactera sous 24h.</p>
                </div>
              ) : (
                <form onSubmit={handleDevisSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="block text-xs font-medium text-gray-700 mb-1">Nom complet *</label>
                      <input required type="text" placeholder="Jean Kouamé" value={form.clientName} onChange={e => setForm(f => ({ ...f, clientName: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" /></div>
                    <div><label className="block text-xs font-medium text-gray-700 mb-1">Entreprise</label>
                      <input type="text" placeholder="Ma Société" value={form.companyName} onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="block text-xs font-medium text-gray-700 mb-1">Téléphone *</label>
                      <input required type="tel" placeholder="07 XX XX XX XX" value={form.clientPhone} onChange={e => setForm(f => ({ ...f, clientPhone: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" /></div>
                    <div><label className="block text-xs font-medium text-gray-700 mb-1">Email *</label>
                      <input required type="email" placeholder="jean@email.com" value={form.clientEmail} onChange={e => setForm(f => ({ ...f, clientEmail: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="block text-xs font-medium text-gray-700 mb-1">Support *</label>
                      <select required value={form.mediaType} onChange={e => setForm(f => ({ ...f, mediaType: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8] bg-white">
                        <option value="">Choisir...</option>
                        <option value="TV">CÔTIÈRE TV</option>
                        <option value="RADIO">CÔTIÈRE FM</option>
                        <option value="MAGAZINE">CÔTIÈRE MAGAZINE</option>
                        <option value="DIGITAL">Digital</option>
                      </select></div>
                    <div><label className="block text-xs font-medium text-gray-700 mb-1">Type de pub *</label>
                      <input required type="text" placeholder="Spot 30s, encart..." value={form.adType} onChange={e => setForm(f => ({ ...f, adType: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" /></div>
                  </div>
                  <div><label className="block text-xs font-medium text-gray-700 mb-1">Budget estimé</label>
                    <input type="text" placeholder="Ex: 500 000 FCFA" value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" /></div>
                  <div><label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                    <textarea rows={3} placeholder="Décrivez votre campagne..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8] resize-none" /></div>
                  <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60">
                    {loading ? "Envoi..." : "Envoyer ma demande"} <ArrowRight size={16} />
                  </button>
                </form>
              )}
            </div>
          </section>
        </>
      )}

      {/* ── ONGLET INFO+ ── */}
      {tab === "info" && (
        <>
          {/* Prestations */}
          <section className="py-16 bg-[#f0f9ff]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-10">
                <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest">Nos prestations</span>
                <h2 className="section-title mt-2">Ce que nous faisons</h2>
                <p className="text-gray-500 mt-2">La voix officielle du littoral Ivoirien</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {PRESTATIONS.map((p) => (
                  <button key={p.slug} onClick={() => { setActiveInfo(p); setShowInfoForm(false); setInfoSent(false); }}
                    className="group relative rounded-xl overflow-hidden shadow-sm card-hover text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#c9a84c]">
                    <div className="relative h-40">
                      <img src={p.image} alt={p.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute inset-0 bg-[#c9a84c]/0 group-hover:bg-[#c9a84c]/20 transition-all duration-300" />
                      <p className="absolute bottom-3 left-3 right-3 text-white text-xs font-semibold leading-tight">{p.label}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Actualités */}
          <section id="actualites" className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest">Actualités</span>
                <h2 className="section-title mt-2">Les dernières nouvelles du littoral</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {actualites.map((a) => (
                  <div key={a.titre} className="group bg-white rounded-xl overflow-hidden shadow-sm card-hover border border-gray-100">
                    <div className="relative h-44 overflow-hidden">
                      <img src={a.image} alt={a.titre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <span className="absolute top-3 left-3 bg-[#c9a84c] text-white text-xs font-bold px-2.5 py-1 rounded-full">{a.categorie}</span>
                    </div>
                    <div className="p-5">
                      <p className="text-xs text-gray-400 mb-2">{a.date}</p>
                      <h3 className="font-bold text-[#0a1628] mb-3 leading-tight">{a.titre}</h3>
                      <Link href={"/services/info/" + a.id} className="text-[#38bdf8] text-sm font-semibold hover:underline flex items-center gap-1">
                        Lire la suite <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA INFO+ */}
          <section className="py-16 bg-[#0c4a6e] text-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl font-bold mb-4">Vous avez un événement à couvrir ?</h2>
              <p className="text-gray-300 mb-8">Contactez CÔTIÈRE INFO+ pour une couverture médiatique professionnelle.</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/contact" className="btn-primary">Nous contacter <ArrowRight size={18} /></Link>
                <a href="tel:+2250747722931" className="flex items-center gap-2 bg-white/10 border border-white/30 text-white font-bold px-5 py-3 rounded-xl hover:bg-white/20 transition-colors">
                  <Phone size={18} /> 07 47 72 29 31
                </a>
              </div>
            </div>
          </section>
        </>
      )}
      {/* ── MODAL PUBLICITÉ ── */}
      {activeAd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={closeAdModal}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="relative h-44 rounded-t-2xl overflow-hidden">
              <img src={activeAd.image} alt={activeAd.label} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-5 right-12">
                <span className="bg-[#c9a84c] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 w-fit mb-2">
                  {activeAd.icon} CÔTIÈRE MÉDIAS
                </span>
                <h2 className="text-lg font-black text-white leading-tight">{activeAd.label}</h2>
                <p className="text-white/70 text-xs mt-0.5">{activeAd.subtitle}</p>
              </div>
              <button onClick={closeAdModal} className="absolute top-3 right-3 w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white">
                <X size={16} />
              </button>
            </div>
            <div className="p-6 space-y-5">
              {showAdForm ? (
                adSent ? (
                  <div className="text-center py-8">
                    <CheckCircle size={52} className="text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-[#0c4a6e] mb-2">Demande envoyée !</h3>
                    <p className="text-gray-500 text-sm mb-6">Notre équipe vous contactera sous 24h.</p>
                    <button onClick={closeAdModal} className="btn-primary justify-center">Fermer</button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setShowAdForm(false)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#0c4a6e]">
                        <ChevronLeft size={16} /> Retour
                      </button>
                      <h3 className="font-bold text-[#0c4a6e] text-sm">Demande — <span className="text-[#c9a84c]">{activeAd.label}</span></h3>
                    </div>
                    <form onSubmit={handleAdSubmit} className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div><label className="block text-xs font-semibold text-gray-600 mb-1">Nom / Entreprise *</label>
                          <input type="text" required value={adForm.name} onChange={e => setAdForm(f => ({ ...f, name: e.target.value }))} placeholder="Jean Kouamé" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" /></div>
                        <div><label className="block text-xs font-semibold text-gray-600 mb-1">Téléphone *</label>
                          <input type="tel" required value={adForm.phone} onChange={e => setAdForm(f => ({ ...f, phone: e.target.value }))} placeholder="07 XX XX XX XX" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" /></div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div><label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                          <input type="email" value={adForm.email} onChange={e => setAdForm(f => ({ ...f, email: e.target.value }))} placeholder="jean@email.com" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" /></div>
                        <div><label className="block text-xs font-semibold text-gray-600 mb-1">Format souhaité</label>
                          <select value={adForm.format} onChange={e => setAdForm(f => ({ ...f, format: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c] bg-white">
                            <option value="">Sélectionner...</option>
                            {activeAd.formats.map(fmt => <option key={fmt.name} value={fmt.name}>{fmt.name}</option>)}
                          </select></div>
                      </div>
                      <div><label className="block text-xs font-semibold text-gray-600 mb-1">Budget estimé</label>
                        <select value={adForm.budget} onChange={e => setAdForm(f => ({ ...f, budget: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c] bg-white">
                          <option value="">Sélectionner...</option>
                          <option>Moins de 100 000 FCFA</option>
                          <option>100 000 — 300 000 FCFA</option>
                          <option>300 000 — 600 000 FCFA</option>
                          <option>Plus de 600 000 FCFA</option>
                          <option>À définir ensemble</option>
                        </select></div>
                      <div><label className="block text-xs font-semibold text-gray-600 mb-1">Votre message</label>
                        <textarea value={adForm.message} onChange={e => setAdForm(f => ({ ...f, message: e.target.value }))} rows={3} maxLength={400} placeholder="Décrivez votre campagne..." className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c] resize-none" /></div>
                      <div className="flex gap-3">
                        <button type="submit" disabled={adSending} className="flex-1 btn-primary justify-center py-3 disabled:opacity-60">
                          {adSending ? <><Loader2 size={15} className="animate-spin" /> Envoi...</> : <>Envoyer <ArrowRight size={14} /></>}
                        </button>
                        <a href="tel:+2250747722931" className="flex items-center gap-2 border border-[#0c4a6e]/20 text-[#0c4a6e] text-sm font-semibold px-4 rounded-xl hover:bg-[#0c4a6e]/5"><Phone size={14} /></a>
                      </div>
                      <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-1"><Clock size={10} /> Réponse sous 24h · Devis gratuit</p>
                    </form>
                  </>
                )
              ) : (
                <>
                  <p className="text-sm text-gray-600">{activeAd.description}</p>
                  <div>
                    <h4 className="text-sm font-bold text-[#0c4a6e] mb-3 flex items-center gap-2"><Check size={14} className="text-green-500" /> Ce qui est inclus</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {activeAd.included.map(item => (
                        <div key={item} className="flex items-start gap-2 text-xs text-gray-600"><Check size={11} className="text-[#c9a84c] shrink-0 mt-0.5" /> {item}</div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0c4a6e] mb-2">Formats & tarifs</h4>
                    <div className="space-y-1.5">
                      {activeAd.formats.map(fmt => (
                        <div key={fmt.name} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                          <div><p className="text-xs font-medium text-gray-700">{fmt.name}</p><p className="text-[10px] text-gray-400">{fmt.desc}</p></div>
                          <div className="text-right shrink-0 ml-3"><span className="text-xs font-bold text-[#0c4a6e]">{fmt.price}</span><span className="text-xs text-gray-400"> / {fmt.unit}</span></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2 border-t border-gray-100">
                    <button onClick={() => setShowAdForm(true)} className="flex-1 btn-primary justify-center text-sm py-2.5">Demander un devis <ArrowRight size={14} /></button>
                    <a href="tel:+2250747722931" className="flex items-center gap-2 border border-[#0c4a6e]/20 text-[#0c4a6e] text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#0c4a6e]/5"><Phone size={14} /> Appeler</a>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL INFO+ ── */}
      {activeInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={closeInfoModal}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="relative h-44 rounded-t-2xl overflow-hidden">
              <img src={activeInfo.image} alt={activeInfo.label} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-5 right-12">
                <span className="bg-[#c9a84c] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 w-fit mb-2">
                  {activeInfo.icon} CÔTIÈRE INFO+
                </span>
                <h2 className="text-lg font-black text-white leading-tight">{activeInfo.label}</h2>
                <p className="text-white/70 text-xs mt-0.5">{activeInfo.subtitle}</p>
              </div>
              <button onClick={closeInfoModal} className="absolute top-3 right-3 w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white">
                <X size={16} />
              </button>
            </div>
            <div className="p-6 space-y-5">
              {showInfoForm ? (
                infoSent ? (
                  <div className="text-center py-8">
                    <CheckCircle size={52} className="text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-[#0c4a6e] mb-2">Demande envoyée !</h3>
                    <p className="text-gray-500 text-sm mb-6">Notre équipe vous contactera sous 24h.</p>
                    <button onClick={closeInfoModal} className="btn-primary justify-center">Fermer</button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setShowInfoForm(false)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#0c4a6e]">
                        <ChevronLeft size={16} /> Retour
                      </button>
                      <h3 className="font-bold text-[#0c4a6e] text-sm">Demande — <span className="text-[#c9a84c]">{activeInfo.label}</span></h3>
                    </div>
                    <form onSubmit={handleInfoSubmit} className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div><label className="block text-xs font-semibold text-gray-600 mb-1">Prénom / Nom *</label>
                          <input type="text" required value={infoForm.firstName} onChange={e => setInfoForm(f => ({ ...f, firstName: e.target.value }))} placeholder="Jean Kouamé" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" /></div>
                        <div><label className="block text-xs font-semibold text-gray-600 mb-1">Téléphone *</label>
                          <input type="tel" required value={infoForm.phone} onChange={e => setInfoForm(f => ({ ...f, phone: e.target.value }))} placeholder="07 XX XX XX XX" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" /></div>
                      </div>
                      <div><label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                        <input type="email" value={infoForm.email} onChange={e => setInfoForm(f => ({ ...f, email: e.target.value }))} placeholder="jean@email.com" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" /></div>
                      <div><label className="block text-xs font-semibold text-gray-600 mb-1">Votre demande *</label>
                        <textarea required value={infoForm.message} onChange={e => setInfoForm(f => ({ ...f, message: e.target.value }))} rows={4} maxLength={500}
                          placeholder={`Décrivez votre besoin pour "${activeInfo.label}"...`}
                          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c] resize-none" />
                        <p className="text-xs text-gray-400 text-right">{infoForm.message.length}/500</p></div>
                      {infoErr && <p className="text-red-500 text-xs bg-red-50 px-3 py-2 rounded-lg">{infoErr}</p>}
                      <div className="flex gap-3">
                        <button type="submit" disabled={infoSending} className="flex-1 btn-primary justify-center py-3 disabled:opacity-60">
                          {infoSending ? <><Loader2 size={15} className="animate-spin" /> Envoi...</> : <>Envoyer <ArrowRight size={14} /></>}
                        </button>
                        <a href="tel:+2250747722931" className="flex items-center gap-2 border border-[#0c4a6e]/20 text-[#0c4a6e] text-sm font-semibold px-4 rounded-xl hover:bg-[#0c4a6e]/5"><Phone size={14} /></a>
                      </div>
                      <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-1"><Clock size={10} /> Réponse sous 24h · Sans engagement</p>
                    </form>
                  </>
                )
              ) : (
                <>
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-bold text-[#0c4a6e]">{activeInfo.description}</h3>
                    <div className="text-right shrink-0">
                      <p className="text-base font-black text-[#c9a84c]">{activeInfo.priceRange}</p>
                      <p className="text-xs text-gray-400">FCFA</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0c4a6e] mb-3 flex items-center gap-2"><Check size={15} className="text-green-500" /> Ce qui est inclus</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {activeInfo.included.map(item => (
                        <div key={item} className="flex items-start gap-2 text-xs text-gray-600"><Check size={11} className="text-[#c9a84c] shrink-0 mt-0.5" /> {item}</div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0c4a6e] mb-3">Notre processus</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {activeInfo.process.map((p, i) => (
                        <div key={p.step} className="bg-[#f8fafc] rounded-xl p-3 text-center border border-gray-100">
                          <div className="w-6 h-6 bg-[#c9a84c] text-white rounded-full flex items-center justify-center text-xs font-black mx-auto mb-2">{i + 1}</div>
                          <p className="text-xs font-bold text-[#0c4a6e] leading-tight">{p.step}</p>
                          <p className="text-[10px] text-gray-400 mt-1 leading-tight">{p.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0c4a6e] mb-2">Pour qui ?</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {activeInfo.useCases.map(u => (
                        <span key={u} className="text-xs bg-[#f0f9ff] text-[#0c4a6e] px-2.5 py-1 rounded-full border border-[#bae6fd] font-medium">{u}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2 border-t border-gray-100">
                    <button onClick={() => setShowInfoForm(true)} className="flex-1 btn-primary justify-center text-sm py-2.5">Faire une demande <ArrowRight size={14} /></button>
                    <a href="tel:+2250747722931" className="flex items-center gap-2 border border-[#0c4a6e]/20 text-[#0c4a6e] text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#0c4a6e]/5"><Phone size={14} /> Appeler</a>
                  </div>
                  <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-1"><Clock size={10} /> Réponse sous 24h · Devis gratuit & sans engagement</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {/* ── MODAL PUBLICITE ── */}
      {activeAd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={closeAdModal}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="relative h-44 rounded-t-2xl overflow-hidden shrink-0">
              <img src={activeAd.image} alt={activeAd.label} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-5 right-12">
                <span className="bg-[#c9a84c] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 w-fit mb-2">
                  {activeAd.icon} COTIERE MEDIAS
                </span>
                <h2 className="text-lg font-black text-white leading-tight">{activeAd.label}</h2>
                <p className="text-white/70 text-xs mt-0.5">{activeAd.subtitle}</p>
              </div>
              <button onClick={closeAdModal} className="absolute top-3 right-3 w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white transition-colors"><X size={16} /></button>
            </div>
            <div className="p-6 space-y-5">
              {showAdForm ? (
                adSent ? (
                  <div className="text-center py-8">
                    <CheckCircle size={52} className="text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-[#0c4a6e] mb-2">Demande envoyee !</h3>
                    <p className="text-gray-500 text-sm mb-6">Notre equipe vous contactera sous 24h.</p>
                    <button onClick={closeAdModal} className="btn-primary justify-center">Fermer</button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setShowAdForm(false)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#0c4a6e]"><ChevronLeft size={16} /> Retour</button>
                      <h3 className="font-bold text-[#0c4a6e] text-sm">Demande - <span className="text-[#c9a84c]">{activeAd.label}</span></h3>
                    </div>
                    <form onSubmit={handleAdSubmit} className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div><label className="block text-xs font-semibold text-gray-600 mb-1">Nom / Entreprise *</label>
                          <input type="text" required value={adForm.name} onChange={e => setAdForm(f => ({ ...f, name: e.target.value }))} placeholder="Jean Kouame" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" /></div>
                        <div><label className="block text-xs font-semibold text-gray-600 mb-1">Telephone *</label>
                          <input type="tel" required value={adForm.phone} onChange={e => setAdForm(f => ({ ...f, phone: e.target.value }))} placeholder="07 XX XX XX XX" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" /></div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div><label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                          <input type="email" value={adForm.email} onChange={e => setAdForm(f => ({ ...f, email: e.target.value }))} placeholder="jean@email.com" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" /></div>
                        <div><label className="block text-xs font-semibold text-gray-600 mb-1">Format souhaite</label>
                          <select value={adForm.format} onChange={e => setAdForm(f => ({ ...f, format: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c] bg-white">
                            <option value="">Selectionner...</option>
                            {activeAd.formats.map(fmt => <option key={fmt.name} value={fmt.name}>{fmt.name}</option>)}
                          </select></div>
                      </div>
                      <div><label className="block text-xs font-semibold text-gray-600 mb-1">Budget estime</label>
                        <select value={adForm.budget} onChange={e => setAdForm(f => ({ ...f, budget: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c] bg-white">
                          <option value="">Selectionner...</option>
                          <option>Moins de 100 000 FCFA</option>
                          <option>100 000 - 300 000 FCFA</option>
                          <option>300 000 - 600 000 FCFA</option>
                          <option>Plus de 600 000 FCFA</option>
                        </select></div>
                      <div><label className="block text-xs font-semibold text-gray-600 mb-1">Votre message</label>
                        <textarea value={adForm.message} onChange={e => setAdForm(f => ({ ...f, message: e.target.value }))} rows={3} maxLength={400} placeholder="Decrivez votre campagne..." className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c] resize-none" /></div>
                      <div className="flex gap-3">
                        <button type="submit" disabled={adSending} className="flex-1 btn-primary justify-center py-3 disabled:opacity-60">
                          {adSending ? <><Loader2 size={15} className="animate-spin" /> Envoi...</> : <>Envoyer <ArrowRight size={14} /></>}
                        </button>
                        <a href="tel:+2250747722931" className="flex items-center gap-2 border border-[#0c4a6e]/20 text-[#0c4a6e] text-sm font-semibold px-4 rounded-xl hover:bg-[#0c4a6e]/5 transition-colors"><Phone size={14} /></a>
                      </div>
                      <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-1"><Clock size={10} /> Reponse sous 24h - Devis gratuit</p>
                    </form>
                  </>
                )
              ) : (
                <>
                  <p className="text-sm text-gray-600 leading-relaxed">{activeAd.description}</p>
                  <div>
                    <h4 className="text-sm font-bold text-[#0c4a6e] mb-3 flex items-center gap-2"><Check size={14} className="text-green-500" /> Ce qui est inclus</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {activeAd.included.map(item => (
                        <div key={item} className="flex items-start gap-2 text-xs text-gray-600"><Check size={11} className="text-[#c9a84c] shrink-0 mt-0.5" /> {item}</div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0c4a6e] mb-3">Formats disponibles</h4>
                    <div className="space-y-2">
                      {activeAd.formats.map(fmt => (
                        <div key={fmt.name} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                          <div><p className="text-xs font-semibold text-gray-800">{fmt.name}</p><p className="text-[10px] text-gray-400">{fmt.desc}</p></div>
                          <div className="text-right shrink-0 ml-3"><p className="text-xs font-bold text-[#0c4a6e]">{fmt.price} FCFA</p><p className="text-[10px] text-gray-400">/ {fmt.unit}</p></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0c4a6e] mb-2">Pour qui ?</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {activeAd.useCases.map(u => (
                        <span key={u} className="text-xs bg-[#f0f9ff] text-[#0c4a6e] px-2.5 py-1 rounded-full border border-[#bae6fd] font-medium">{u}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2 border-t border-gray-100">
                    <button onClick={() => setShowAdForm(true)} className="flex-1 btn-primary justify-center text-sm py-2.5">Demander un devis <ArrowRight size={14} /></button>
                    <a href="tel:+2250747722931" className="flex items-center gap-2 border border-[#0c4a6e]/20 text-[#0c4a6e] text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#0c4a6e]/5 transition-colors"><Phone size={14} /> Appeler</a>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL INFO+ ── */}
      {activeInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={closeInfoModal}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="relative h-44 rounded-t-2xl overflow-hidden shrink-0">
              <img src={activeInfo.image} alt={activeInfo.label} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-5 right-12">
                <span className="bg-[#c9a84c] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 w-fit mb-2">
                  {activeInfo.icon} COTIERE INFO+
                </span>
                <h2 className="text-lg font-black text-white leading-tight">{activeInfo.label}</h2>
                <p className="text-white/70 text-xs mt-0.5">{activeInfo.subtitle}</p>
              </div>
              <button onClick={closeInfoModal} className="absolute top-3 right-3 w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white transition-colors"><X size={16} /></button>
            </div>
            <div className="p-6 space-y-5">
              {showInfoForm ? (
                infoSent ? (
                  <div className="text-center py-8">
                    <CheckCircle size={52} className="text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-[#0c4a6e] mb-2">Demande envoyee !</h3>
                    <p className="text-gray-500 text-sm mb-6">Notre equipe vous contactera sous 24h.</p>
                    <button onClick={closeInfoModal} className="btn-primary justify-center">Fermer</button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setShowInfoForm(false)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#0c4a6e]"><ChevronLeft size={16} /> Retour</button>
                      <h3 className="font-bold text-[#0c4a6e] text-sm">Demande - <span className="text-[#c9a84c]">{activeInfo.label}</span></h3>
                    </div>
                    <form onSubmit={handleInfoSubmit} className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div><label className="block text-xs font-semibold text-gray-600 mb-1">Prenom / Nom *</label>
                          <input type="text" required value={infoForm.firstName} onChange={e => setInfoForm(f => ({ ...f, firstName: e.target.value }))} placeholder="Jean Kouame" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" /></div>
                        <div><label className="block text-xs font-semibold text-gray-600 mb-1">Telephone *</label>
                          <input type="tel" required value={infoForm.phone} onChange={e => setInfoForm(f => ({ ...f, phone: e.target.value }))} placeholder="07 XX XX XX XX" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" /></div>
                      </div>
                      <div><label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                        <input type="email" value={infoForm.email} onChange={e => setInfoForm(f => ({ ...f, email: e.target.value }))} placeholder="jean@email.com" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" /></div>
                      <div><label className="block text-xs font-semibold text-gray-600 mb-1">Votre demande *</label>
                        <textarea required value={infoForm.message} onChange={e => setInfoForm(f => ({ ...f, message: e.target.value }))} rows={4} maxLength={500}
                          placeholder="Decrivez votre besoin : sujet, date, lieu, objectifs..."
                          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c] resize-none" />
                        <p className="text-xs text-gray-400 text-right">{infoForm.message.length}/500</p></div>
                      {infoErr && <p className="text-red-500 text-xs bg-red-50 px-3 py-2 rounded-lg">{infoErr}</p>}
                      <div className="flex gap-3">
                        <button type="submit" disabled={infoSending} className="flex-1 btn-primary justify-center py-3 disabled:opacity-60">
                          {infoSending ? <><Loader2 size={15} className="animate-spin" /> Envoi...</> : <>Envoyer <ArrowRight size={14} /></>}
                        </button>
                        <a href="tel:+2250747722931" className="flex items-center gap-2 border border-[#0c4a6e]/20 text-[#0c4a6e] text-sm font-semibold px-4 rounded-xl hover:bg-[#0c4a6e]/5 transition-colors"><Phone size={14} /></a>
                      </div>
                      <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-1"><Clock size={10} /> Reponse sous 24h - Sans engagement</p>
                    </form>
                  </>
                )
              ) : (
                <>
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-bold text-[#0c4a6e]">{activeInfo.description}</h3>
                    <div className="text-right shrink-0">
                      <p className="text-base font-black text-[#c9a84c]">{activeInfo.priceRange}</p>
                      <p className="text-xs text-gray-400">FCFA</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0c4a6e] mb-3 flex items-center gap-2"><Check size={15} className="text-green-500" /> Ce qui est inclus</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {activeInfo.included.map(item => (
                        <div key={item} className="flex items-start gap-2 text-xs text-gray-600"><Check size={11} className="text-[#c9a84c] shrink-0 mt-0.5" /> {item}</div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0c4a6e] mb-3">Notre processus</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {activeInfo.process.map((p, i) => (
                        <div key={p.step} className="bg-[#f8fafc] rounded-xl p-3 text-center border border-gray-100">
                          <div className="w-6 h-6 bg-[#c9a84c] text-white rounded-full flex items-center justify-center text-xs font-black mx-auto mb-2">{i + 1}</div>
                          <p className="text-xs font-bold text-[#0c4a6e] leading-tight">{p.step}</p>
                          <p className="text-[10px] text-gray-400 mt-1 leading-tight">{p.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0c4a6e] mb-2">Pour qui ?</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {activeInfo.useCases.map(u => (
                        <span key={u} className="text-xs bg-[#f0f9ff] text-[#0c4a6e] px-2.5 py-1 rounded-full border border-[#bae6fd] font-medium">{u}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2 border-t border-gray-100">
                    <button onClick={() => setShowInfoForm(true)} className="flex-1 btn-primary justify-center text-sm py-2.5">Faire une demande <ArrowRight size={14} /></button>
                    <a href="tel:+2250747722931" className="flex items-center gap-2 border border-[#0c4a6e]/20 text-[#0c4a6e] text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#0c4a6e]/5 transition-colors"><Phone size={14} /> Appeler</a>
                  </div>
                  <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-1"><Clock size={10} /> Reponse sous 24h - Devis gratuit</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
