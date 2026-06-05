"use client";
import { useParams } from "next/navigation";
import {
  ArrowRight, ArrowLeft, ChevronRight, Users, Wifi, Share2, Check,
  Wind, Tv, Waves, UtensilsCrossed, Sofa, Car, Dumbbell, Coffee,
  Bath, Star, MapPin, Clock, ShieldCheck, Phone, CalendarDays,
  BedDouble, Sparkles, ChevronLeft, Info, CheckCircle2,
  ShowerHead, Droplets, Thermometer, Shirt, FlameKindling,
  Package, Utensils, Refrigerator, Microwave, WashingMachine,
  Lamp, Lock, Briefcase, Flower2,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import ReservationModal from "@/components/frontend/ReservationModal";
import ImageZoom from "@/components/frontend/ImageZoom";

type BathroomItem = { icon: React.ReactNode; label: string };
type RoomExtra = { category: string; icon: React.ReactNode; items: string[] };

type Room = {
  id: string; name: string; type: string; capacity: number;
  pricePerNight: number; images: string[]; amenities: string[];
  isActive: boolean; description?: string; surface?: number;
  floor?: string; bedType?: string; view?: string;
  bathroom?: BathroomItem[];
  extras?: RoomExtra[];
};

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  "Wifi":           <Wifi size={14} className="text-[#38bdf8]" />,
  "Climatisation":  <Wind size={14} className="text-[#38bdf8]" />,
  "TV":             <Tv size={14} className="text-[#38bdf8]" />,
  "Vue mer":        <Waves size={14} className="text-[#38bdf8]" />,
  "Cuisine":        <UtensilsCrossed size={14} className="text-[#38bdf8]" />,
  "Salon":          <Sofa size={14} className="text-[#38bdf8]" />,
  "Parking":        <Car size={14} className="text-[#38bdf8]" />,
  "Piscine":        <Waves size={14} className="text-[#38bdf8]" />,
  "Gym":            <Dumbbell size={14} className="text-[#38bdf8]" />,
  "Petit-déjeuner": <Coffee size={14} className="text-[#38bdf8]" />,
  "Baignoire":      <Bath size={14} className="text-[#38bdf8]" />,
};

function AmenityIcon({ name }: { name: string }) {
  return <>{AMENITY_ICONS[name] ?? <Star size={14} className="text-[#38bdf8]" />}</>;
}

const ROOMS: Room[] = [
  {
    id: "1",
    name: "Chambre Standard",
    type: "Chambre",
    capacity: 2,
    pricePerNight: 25000,
    surface: 22,
    floor: "1er ou 2ème étage",
    bedType: "Lit double (160×200)",
    view: "Vue jardin ou cour intérieure",
    description: "Notre Chambre Standard offre tout le confort nécessaire pour un séjour agréable sur le littoral ivoirien. Décorée avec soin dans un style contemporain africain, elle dispose d'un lit double confortable, d'une salle de bain privative avec douche, et de toutes les commodités modernes. Idéale pour les voyageurs d'affaires ou les couples en escapade.",
    images: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
      "https://images.unsplash.com/photo-1631049421450-348ccd7f8949?w=800&q=80",
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80",
    ],
    amenities: ["Wifi", "Climatisation", "TV"],
    isActive: true,
    bathroom: [
      { icon: <ShowerHead size={15} className="text-[#38bdf8]" />, label: "Douche à l'italienne" },
      { icon: <Droplets size={15} className="text-[#38bdf8]" />, label: "Eau chaude 24h/24" },
      { icon: <Flower2 size={15} className="text-[#38bdf8]" />, label: "Savon & shampoing fournis" },
      { icon: <Shirt size={15} className="text-[#38bdf8]" />, label: "Serviettes de bain (2 jeux)" },
      { icon: <Thermometer size={15} className="text-[#38bdf8]" />, label: "Sèche-cheveux" },
      { icon: <Package size={15} className="text-[#38bdf8]" />, label: "Kit hygiène (brosse, rasoir)" },
    ],
    extras: [
      {
        category: "Chambre",
        icon: <BedDouble size={15} className="text-[#c9a84c]" />,
        items: ["Literie premium (draps 100% coton)", "Oreillers mémoire de forme", "Couverture légère & plaid", "Coffre-fort numérique", "Bureau de travail", "Lampe de chevet"],
      },
      {
        category: "Divertissement",
        icon: <Tv size={15} className="text-[#c9a84c]" />,
        items: ["TV écran plat 40\"", "Chaînes nationales & internationales", "Wifi haut débit (50 Mbps)", "Prises USB & multiprises"],
      },
      {
        category: "Confort",
        icon: <Wind size={15} className="text-[#c9a84c]" />,
        items: ["Climatisation réglable", "Ventilateur de plafond", "Rideaux occultants", "Miroir pleine longueur"],
      },
    ],
  },
  {
    id: "2",
    name: "Chambre Supérieure",
    type: "Chambre",
    capacity: 2,
    pricePerNight: 40000,
    surface: 32,
    floor: "3ème ou 4ème étage",
    bedType: "Grand lit (180×200)",
    view: "Vue mer panoramique",
    description: "La Chambre Supérieure est notre formule premium pour les voyageurs exigeants. Spacieuse et lumineuse, elle offre une vue imprenable sur la mer depuis son balcon privé. Décoration soignée mêlant modernité et touches africaines, literie haut de gamme, salle de bain avec baignoire et douche séparées. Un séjour d'exception au cœur du littoral ivoirien.",
    images: [
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
    ],
    amenities: ["Wifi", "Climatisation", "TV", "Vue mer"],
    isActive: true,
    bathroom: [
      { icon: <Bath size={15} className="text-[#38bdf8]" />, label: "Baignoire balnéo" },
      { icon: <ShowerHead size={15} className="text-[#38bdf8]" />, label: "Douche à l'italienne séparée" },
      { icon: <Droplets size={15} className="text-[#38bdf8]" />, label: "Eau chaude 24h/24" },
      { icon: <Flower2 size={15} className="text-[#38bdf8]" />, label: "Produits de bain premium" },
      { icon: <Shirt size={15} className="text-[#38bdf8]" />, label: "Peignoirs & chaussons" },
      { icon: <Thermometer size={15} className="text-[#38bdf8]" />, label: "Sèche-cheveux professionnel" },
      { icon: <Package size={15} className="text-[#38bdf8]" />, label: "Kit hygiène complet" },
      { icon: <Lamp size={15} className="text-[#38bdf8]" />, label: "Miroir éclairé anti-buée" },
    ],
    extras: [
      {
        category: "Chambre",
        icon: <BedDouble size={15} className="text-[#c9a84c]" />,
        items: ["Literie grand luxe (draps 400 fils)", "Oreillers mémoire de forme (4)", "Couette duvet + plaid", "Coffre-fort numérique", "Bureau & fauteuil ergonomique", "Lampes de chevet dimmables", "Balcon privé avec vue mer"],
      },
      {
        category: "Divertissement",
        icon: <Tv size={15} className="text-[#c9a84c]" />,
        items: ["TV écran plat 50\" 4K", "Chaînes premium & streaming", "Wifi haut débit (100 Mbps)", "Enceinte Bluetooth", "Prises USB & multiprises"],
      },
      {
        category: "Confort",
        icon: <Wind size={15} className="text-[#c9a84c]" />,
        items: ["Climatisation silencieuse réglable", "Ventilateur de plafond", "Rideaux occultants motorisés", "Miroir pleine longueur", "Mini-bar garni"],
      },
    ],
  },
  {
    id: "3",
    name: "Suite Familiale",
    type: "Suite",
    capacity: 4,
    pricePerNight: 65000,
    surface: 55,
    floor: "Dernier étage (vue dégagée)",
    bedType: "1 lit king + 2 lits simples",
    view: "Vue panoramique mer & lagune",
    description: "La Suite Familiale est notre hébergement le plus spacieux, conçu pour accueillir les familles ou les groupes jusqu'à 4 personnes. Elle comprend une chambre principale avec lit king size, une chambre enfants avec deux lits simples, un salon séparé, une cuisine équipée et deux salles de bain. La terrasse privée offre une vue panoramique exceptionnelle sur la mer et la lagune. Idéale pour des vacances en famille inoubliables.",
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
    ],
    amenities: ["Wifi", "Climatisation", "Cuisine", "Salon"],
    isActive: true,
    bathroom: [
      { icon: <Bath size={15} className="text-[#38bdf8]" />, label: "2 salles de bain privatives" },
      { icon: <ShowerHead size={15} className="text-[#38bdf8]" />, label: "2 douches à l'italienne" },
      { icon: <Bath size={15} className="text-[#38bdf8]" />, label: "Baignoire (salle principale)" },
      { icon: <Droplets size={15} className="text-[#38bdf8]" />, label: "Eau chaude 24h/24" },
      { icon: <Flower2 size={15} className="text-[#38bdf8]" />, label: "Produits de bain premium (x4)" },
      { icon: <Shirt size={15} className="text-[#38bdf8]" />, label: "Peignoirs & serviettes (4 jeux)" },
      { icon: <Thermometer size={15} className="text-[#38bdf8]" />, label: "2 sèche-cheveux" },
      { icon: <Package size={15} className="text-[#38bdf8]" />, label: "Kits hygiène individuels" },
      { icon: <Lamp size={15} className="text-[#38bdf8]" />, label: "Miroirs éclairés anti-buée" },
    ],
    extras: [
      {
        category: "Chambres",
        icon: <BedDouble size={15} className="text-[#c9a84c]" />,
        items: ["Lit king size (200×200) chambre principale", "2 lits simples chambre enfants", "Literie grand luxe tous lits", "Coffres-forts numériques (x2)", "Bureaux & fauteuils", "Terrasse privée panoramique"],
      },
      {
        category: "Cuisine équipée",
        icon: <Utensils size={15} className="text-[#c9a84c]" />,
        items: ["Réfrigérateur grand format", "Micro-ondes & four", "Plaques de cuisson", "Vaisselle & ustensiles complets", "Machine à café Nespresso", "Lave-vaisselle"],
      },
      {
        category: "Salon & Divertissement",
        icon: <Sofa size={15} className="text-[#c9a84c]" />,
        items: ["Canapé convertible", "TV 55\" 4K (salon)", "TV 43\" (chambre principale)", "Wifi haut débit (200 Mbps)", "Enceinte Bluetooth", "Jeux de société pour enfants"],
      },
      {
        category: "Confort",
        icon: <Wind size={15} className="text-[#c9a84c]" />,
        items: ["Climatisation multi-zones", "Ventilateurs de plafond", "Rideaux occultants", "Machine à laver", "Fer & table à repasser"],
      },
    ],
  },
];

const INCLUSIONS = [
  "Petit-déjeuner continental inclus",
  "Accès Wifi haut débit gratuit",
  "Climatisation 24h/24",
  "Linge de maison et serviettes",
  "Coffre-fort en chambre",
  "Service de ménage quotidien",
  "Accueil 24h/24 à la réception",
  "Parking sécurisé gratuit",
];

const POLICIES = [
  { icon: <CalendarDays size={16} className="text-[#c9a84c]" />, title: "Check-in / Check-out", desc: "Arrivée à partir de 14h00 · Départ avant 12h00" },
  { icon: <ShieldCheck size={16} className="text-[#c9a84c]" />, title: "Annulation", desc: "Annulation gratuite jusqu'à 48h avant l'arrivée" },
  { icon: <Users size={16} className="text-[#c9a84c]" />, title: "Enfants", desc: "Enfants de moins de 5 ans gratuits" },
  { icon: <Info size={16} className="text-[#c9a84c]" />, title: "Paiement", desc: "Acompte de 30% à la réservation · Solde à l'arrivée" },
];

export default function RoomDetailPage() {
  const { id } = useParams<{ id: string }>();
  const room = ROOMS.find(r => r.id === id);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [copied, setCopied] = useState(false);

  function handleShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) { navigator.share({ title: room?.name ?? "", url }); return; }
    } catch {}
    try {
      navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
    } catch {
      const el = document.createElement("input"); el.value = url;
      document.body.appendChild(el); el.select(); document.execCommand("copy"); document.body.removeChild(el);
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    }
  }

  if (!room) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-gray-500">Chambre introuvable.</p>
      <Link href="/services/hebergement" className="btn-primary">Retour aux chambres</Link>
    </div>
  );

  const pageUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="min-h-screen bg-[#f8fafc]">

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#0c4a6e] transition-colors">Accueil</Link>
            <ChevronRight size={14} />
            <Link href="/services/hebergement" className="hover:text-[#0c4a6e] transition-colors">Hébergement</Link>
            <ChevronRight size={14} />
            <span className="text-[#0c4a6e] font-semibold">{room.name}</span>
          </div>
          <button onClick={handleShare} className="flex items-center gap-2 text-sm font-semibold text-[#0c4a6e] border border-[#0c4a6e]/20 px-3 py-1.5 rounded-lg hover:bg-[#0c4a6e]/5 transition-colors">
            {copied ? <Check size={15} className="text-green-500" /> : <Share2 size={15} />}
            {copied ? "Lien copié !" : "Partager"}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">

        <Link href="/services/hebergement" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#0c4a6e] mb-6 transition-colors">
          <ArrowLeft size={16} /> Retour aux chambres
        </Link>

        {/* Titre + badge */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="bg-[#0c4a6e]/10 text-[#0c4a6e] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">{room.type}</span>
              {!room.isActive && <span className="bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full">Indisponible</span>}
            </div>
            <h1 className="text-3xl font-black text-[#0c4a6e]">{room.name}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1.5"><MapPin size={14} className="text-[#c9a84c]" /> Littoral ivoirien, Côte d'Ivoire</span>
              <span className="flex items-center gap-1.5"><Users size={14} className="text-[#c9a84c]" /> {room.capacity} personnes max.</span>
              {room.surface && <span className="flex items-center gap-1.5"><BedDouble size={14} className="text-[#c9a84c]" /> {room.surface} m²</span>}
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black text-[#c9a84c]">{room.pricePerNight.toLocaleString()} <span className="text-base font-semibold text-gray-500">FCFA</span></p>
            <p className="text-xs text-gray-400">par nuit · petit-déjeuner inclus</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">

            {/* Galerie */}
            <div className="rounded-2xl overflow-hidden shadow-md bg-white relative">
              <span className="absolute top-4 right-4 bg-[#c9a84c] text-white text-sm font-bold px-4 py-1.5 rounded-full z-10 shadow">
                {room.pricePerNight.toLocaleString()} FCFA / nuit
              </span>
              <ImageZoom images={room.images} alt={room.name} activeImg={activeImg} setActiveImg={setActiveImg} />
              {/* Miniatures */}
              <div className="flex gap-2 p-3 bg-white">
                {room.images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${i === activeImg ? "border-[#c9a84c]" : "border-transparent opacity-60 hover:opacity-100"}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Caractéristiques rapides */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: <BedDouble size={20} className="text-[#c9a84c]" />, label: "Lit", value: room.bedType ?? "Lit double" },
                { icon: <Sparkles size={20} className="text-[#c9a84c]" />, label: "Surface", value: room.surface ? `${room.surface} m²` : "—" },
                { icon: <ChevronLeft size={20} className="text-[#c9a84c]" />, label: "Étage", value: room.floor ?? "Variable" },
                { icon: <Waves size={20} className="text-[#c9a84c]" />, label: "Vue", value: room.view ?? "Jardin" },
              ].map(({ icon, label, value }) => (
                <div key={label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
                  <div className="flex justify-center mb-2">{icon}</div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">{label}</p>
                  <p className="text-xs font-bold text-[#0c4a6e] mt-0.5 leading-tight">{value}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-[#0c4a6e] mb-3 flex items-center gap-2">
                <Info size={18} className="text-[#c9a84c]" /> Description
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">{room.description}</p>
            </div>

            {/* Équipements */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-[#0c4a6e] mb-4 flex items-center gap-2">
                <Sparkles size={18} className="text-[#c9a84c]" /> Équipements de la chambre
              </h2>
              <div className="flex flex-wrap gap-3">
                {room.amenities.map(a => (
                  <span key={a} className="flex items-center gap-2 bg-[#f0f9ff] text-gray-700 text-sm font-medium px-4 py-2 rounded-xl border border-[#bae6fd]">
                    <AmenityIcon name={a} /> {a}
                  </span>
                ))}
              </div>
            </div>

            {/* Salle de bain */}
            {room.bathroom && room.bathroom.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-[#0c4a6e] mb-4 flex items-center gap-2">
                  <ShowerHead size={18} className="text-[#38bdf8]" /> Salle de bain & sanitaires
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {room.bathroom.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-[#f0f9ff] rounded-xl border border-[#bae6fd]">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm shrink-0">
                        {item.icon}
                      </div>
                      <span className="text-sm text-gray-700 font-medium">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Détail complet par catégorie */}
            {room.extras && room.extras.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-[#0c4a6e] mb-5 flex items-center gap-2">
                  <Package size={18} className="text-[#c9a84c]" /> Tout ce qui est dans la chambre
                </h2>
                <div className="space-y-5">
                  {room.extras.map((cat) => (
                    <div key={cat.category}>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-7 h-7 bg-[#c9a84c]/10 rounded-lg flex items-center justify-center">
                          {cat.icon}
                        </div>
                        <h3 className="text-sm font-bold text-[#0c4a6e] uppercase tracking-wide">{cat.category}</h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-2">
                        {cat.items.map(item => (
                          <div key={item} className="flex items-center gap-2 text-sm text-gray-600">
                            <Check size={13} className="text-[#c9a84c] shrink-0" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ce qui est inclus */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-[#0c4a6e] mb-4 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-green-500" /> Ce qui est inclus
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {INCLUSIONS.map(item => (
                  <div key={item} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check size={14} className="text-green-500 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Politiques */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-[#0c4a6e] mb-4 flex items-center gap-2">
                <ShieldCheck size={18} className="text-[#c9a84c]" /> Politiques & informations
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {POLICIES.map(p => (
                  <div key={p.title} className="flex items-start gap-3 p-3 bg-[#f8fafc] rounded-xl border border-gray-100">
                    <div className="mt-0.5 shrink-0">{p.icon}</div>
                    <div>
                      <p className="text-sm font-semibold text-[#0c4a6e]">{p.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Localisation */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-[#0c4a6e] mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-[#c9a84c]" /> Localisation
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                {[
                  { label: "Plage", value: "À 5 min à pied" },
                  { label: "Centre-ville", value: "À 15 min en voiture" },
                  { label: "Aéroport", value: "À 45 min (Abidjan)" },
                  { label: "Restaurant", value: "Sur place" },
                  { label: "Supermarché", value: "À 10 min" },
                  { label: "Activités", value: "Excursions disponibles" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center p-3 bg-[#f8fafc] rounded-xl border border-gray-100">
                    <span className="text-gray-500 font-medium">{label}</span>
                    <span className="text-[#0c4a6e] font-semibold text-xs">{value}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar réservation */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 sticky top-24">

              {/* Prix */}
              <div className="text-center pb-4 border-b border-gray-100 mb-4">
                <p className="text-3xl font-black text-[#c9a84c]">{room.pricePerNight.toLocaleString()}</p>
                <p className="text-sm text-gray-500 font-medium">FCFA / nuit · petit-déjeuner inclus</p>
              </div>

              {/* Récap */}
              <div className="space-y-2 mb-5">
                {[
                  { label: "Type", value: room.type },
                  { label: "Capacité", value: `${room.capacity} personnes` },
                  { label: "Surface", value: room.surface ? `${room.surface} m²` : "—" },
                  { label: "Lit", value: room.bedType ?? "Lit double" },
                  { label: "Vue", value: room.view ?? "Jardin" },
                  { label: "Check-in", value: "À partir de 14h00" },
                  { label: "Check-out", value: "Avant 12h00" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm py-1.5 border-b border-gray-50 last:border-0">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-semibold text-[#0c4a6e] text-right max-w-[55%]">{value}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <button
                onClick={() => setModalOpen(true)}
                disabled={!room.isActive}
                className="btn-primary w-full justify-center text-base py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Réserver maintenant <ArrowRight size={16} />
              </button>

              <button onClick={handleShare} className="mt-2 w-full flex items-center justify-center gap-2 text-sm font-semibold text-gray-600 border border-gray-200 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                {copied ? <Check size={15} className="text-green-500" /> : <Share2 size={15} />}
                {copied ? "Lien copié !" : "Partager cette chambre"}
              </button>

              {/* Contact direct */}
              <a href="tel:+2250747722931" className="mt-2 w-full flex items-center justify-center gap-2 text-sm font-semibold text-[#0c4a6e] border border-[#0c4a6e]/20 py-2.5 rounded-xl hover:bg-[#0c4a6e]/5 transition-colors">
                <Phone size={15} /> Appeler pour réserver
              </a>

              <div className="mt-4 flex items-start gap-2 bg-green-50 border border-green-100 rounded-xl p-3">
                <ShieldCheck size={16} className="text-green-500 shrink-0 mt-0.5" />
                <p className="text-xs text-green-700 leading-relaxed">
                  <strong>Annulation gratuite</strong> jusqu'à 48h avant l'arrivée. Acompte de 30% seulement.
                </p>
              </div>

              <p className="text-xs text-gray-400 text-center mt-3 flex items-center justify-center gap-1">
                <Clock size={11} /> Réponse sous 24h · Sans engagement
              </p>
            </div>

            {/* Autres chambres */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-bold text-[#0c4a6e] text-sm mb-3">Autres hébergements</h3>
              <div className="space-y-2">
                {ROOMS.filter(r => r.id !== room.id).map(r => (
                  <Link key={r.id} href={`/services/hebergement/${r.id}`}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#f0f9ff] transition-colors group">
                    <img src={r.images[0]} alt={r.name} className="w-14 h-10 object-cover rounded-lg shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#0c4a6e] truncate group-hover:text-[#c9a84c] transition-colors">{r.name}</p>
                      <p className="text-xs text-gray-400">{r.pricePerNight.toLocaleString()} FCFA/nuit</p>
                    </div>
                    <ArrowRight size={12} className="text-gray-300 group-hover:text-[#c9a84c] shrink-0 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      <ReservationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={room.name}
        details={`${room.type} · ${room.capacity} personnes · ${room.pricePerNight.toLocaleString()} FCFA/nuit`}
        pageUrl={pageUrl}
      />
    </div>
  );
}
