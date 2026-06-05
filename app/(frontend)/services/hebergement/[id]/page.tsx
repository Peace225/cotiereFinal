"use client";
import { useParams } from "next/navigation";
import {
  ArrowRight, ArrowLeft, ChevronRight, Users, Wifi, Share2, Check,
  Wind, Tv, Waves, UtensilsCrossed, Sofa, Car, Dumbbell, Coffee,
  Bath, Star, MapPin, Clock, ShieldCheck, Phone, CalendarDays,
  BedDouble, Sparkles, ChevronLeft, Info, CheckCircle2, RefreshCw,
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import ReservationModal from "@/components/frontend/ReservationModal";
import ImageZoom from "@/components/frontend/ImageZoom";

type Room = {
  id: string; name: string; type: string; capacity: number;
  pricePerNight: number; images: string[]; amenities: string[];
  isActive: boolean; description?: string;
};

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  "Wifi":           <Wifi size={14} className="text-[#38bdf8]" />,
  "Climatisation":  <Wind size={14} className="text-[#38bdf8]" />,
  "TV Satellite":   <Tv size={14} className="text-[#38bdf8]" />,
  "TV":             <Tv size={14} className="text-[#38bdf8]" />,
  "Vue mer":        <Waves size={14} className="text-[#38bdf8]" />,
  "Cuisine":        <UtensilsCrossed size={14} className="text-[#38bdf8]" />,
  "Cuisine équipée":<UtensilsCrossed size={14} className="text-[#38bdf8]" />,
  "Salon":          <Sofa size={14} className="text-[#38bdf8]" />,
  "Parking":        <Car size={14} className="text-[#38bdf8]" />,
  "Parking gratuit":<Car size={14} className="text-[#38bdf8]" />,
  "Piscine":        <Waves size={14} className="text-[#38bdf8]" />,
  "Gym":            <Dumbbell size={14} className="text-[#38bdf8]" />,
  "Petit-déjeuner": <Coffee size={14} className="text-[#38bdf8]" />,
  "Baignoire":      <Bath size={14} className="text-[#38bdf8]" />,
  "Jacuzzi":        <Bath size={14} className="text-[#38bdf8]" />,
  "Minibar":        <Coffee size={14} className="text-[#38bdf8]" />,
  "Coffre-fort":    <Star size={14} className="text-[#38bdf8]" />,
  "Balcon privé":   <Waves size={14} className="text-[#38bdf8]" />,
  "Terrasse privée":<Waves size={14} className="text-[#38bdf8]" />,
  "Acces plage":    <Waves size={14} className="text-[#38bdf8]" />,
  "Barbecue":       <Star size={14} className="text-[#38bdf8]" />,
  "Hamac":          <Star size={14} className="text-[#38bdf8]" />,
};

const POLICIES = [
  { icon: <CalendarDays size={16} className="text-[#c9a84c]" />, title: "Check-in / Check-out", desc: "Arrivée à partir de 14h00 · Départ avant 12h00" },
  { icon: <ShieldCheck size={16} className="text-[#c9a84c]" />, title: "Annulation", desc: "Annulation gratuite jusqu'à 48h avant l'arrivée" },
  { icon: <Users size={16} className="text-[#c9a84c]" />, title: "Enfants", desc: "Enfants de moins de 5 ans gratuits" },
  { icon: <Info size={16} className="text-[#c9a84c]" />, title: "Paiement", desc: "Acompte de 30% à la réservation · Solde à l'arrivée" },
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

export default function RoomDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [copied, setCopied] = useState(false);
  const [allRooms, setAllRooms] = useState<Room[]>([]);

  useEffect(() => {
    if (!id) return;
    // Charger la chambre depuis l'API
    fetch(`/api/rooms/${id}`)
      .then(r => { if (!r.ok) throw new Error("not found"); return r.json(); })
      .then(d => {
        if (d.data) setRoom(d.data);
        else setNotFound(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));

    // Charger toutes les chambres pour la sidebar
    fetch("/api/rooms")
      .then(r => r.json())
      .then(d => setAllRooms(d.data ?? []))
      .catch(() => {});
  }, [id]);

  function handleShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) { navigator.share({ title: room?.name ?? "", url }); return; }
    } catch {}
    navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }).catch(() => {});
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <RefreshCw size={32} className="animate-spin text-[#c9a84c]" />
    </div>
  );

  if (notFound || !room) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-gray-500">Chambre introuvable.</p>
      <Link href="/services/hebergement" className="btn-primary">Retour aux chambres</Link>
    </div>
  );

  const images = room.images?.length > 0
    ? room.images
    : ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80"];

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

        {/* Titre */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="bg-[#0c4a6e]/10 text-[#0c4a6e] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">{room.type}</span>
            </div>
            <h1 className="text-3xl font-black text-[#0c4a6e]">{room.name}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1.5"><MapPin size={14} className="text-[#c9a84c]" /> Littoral ivoirien</span>
              <span className="flex items-center gap-1.5"><Users size={14} className="text-[#c9a84c]" /> {room.capacity} personnes max.</span>
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
              <ImageZoom images={images} alt={room.name} activeImg={activeImg} setActiveImg={setActiveImg} />
              {images.length > 1 && (
                <div className="flex gap-2 p-3 bg-white">
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setActiveImg(i)}
                      className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${i === activeImg ? "border-[#c9a84c]" : "border-transparent opacity-60 hover:opacity-100"}`}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            {room.description && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-[#0c4a6e] mb-3 flex items-center gap-2">
                  <Info size={18} className="text-[#c9a84c]" /> Description
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">{room.description}</p>
              </div>
            )}

            {/* Équipements */}
            {room.amenities?.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-[#0c4a6e] mb-4 flex items-center gap-2">
                  <Sparkles size={18} className="text-[#c9a84c]" /> Équipements
                </h2>
                <div className="flex flex-wrap gap-3">
                  {room.amenities.map(a => (
                    <span key={a} className="flex items-center gap-2 bg-[#f0f9ff] text-gray-700 text-sm font-medium px-4 py-2 rounded-xl border border-[#bae6fd]">
                      {AMENITY_ICONS[a] ?? <Star size={14} className="text-[#38bdf8]" />} {a}
                    </span>
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
                    <Check size={14} className="text-green-500 shrink-0" /> {item}
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

          </div>

          {/* Sidebar réservation */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 sticky top-24">
              <div className="text-center pb-4 border-b border-gray-100 mb-4">
                <p className="text-3xl font-black text-[#c9a84c]">{room.pricePerNight.toLocaleString()}</p>
                <p className="text-sm text-gray-500 font-medium">FCFA / nuit · petit-déjeuner inclus</p>
              </div>

              <div className="space-y-2 mb-5">
                {[
                  { label: "Type", value: room.type },
                  { label: "Capacité", value: `${room.capacity} personnes` },
                  { label: "Check-in", value: "À partir de 14h00" },
                  { label: "Check-out", value: "Avant 12h00" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm py-1.5 border-b border-gray-50 last:border-0">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-semibold text-[#0c4a6e]">{value}</span>
                  </div>
                ))}
              </div>

              <button onClick={() => setModalOpen(true)} disabled={!room.isActive}
                className="btn-primary w-full justify-center text-base py-3.5 disabled:opacity-50 disabled:cursor-not-allowed">
                Réserver maintenant <ArrowRight size={16} />
              </button>

              <a href="tel:+2250747722931" className="mt-2 w-full flex items-center justify-center gap-2 text-sm font-semibold text-[#0c4a6e] border border-[#0c4a6e]/20 py-2.5 rounded-xl hover:bg-[#0c4a6e]/5 transition-colors">
                <Phone size={15} /> Appeler pour réserver
              </a>

              <div className="mt-4 flex items-start gap-2 bg-green-50 border border-green-100 rounded-xl p-3">
                <ShieldCheck size={16} className="text-green-500 shrink-0 mt-0.5" />
                <p className="text-xs text-green-700 leading-relaxed">
                  <strong>Annulation gratuite</strong> jusqu'à 48h avant l'arrivée.
                </p>
              </div>
            </div>

            {/* Autres chambres */}
            {allRooms.filter(r => r.id !== id).length > 0 && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-bold text-[#0c4a6e] text-sm mb-3">Autres hébergements</h3>
                <div className="space-y-2">
                  {allRooms.filter(r => r.id !== id && r.isActive).slice(0, 4).map(r => (
                    <Link key={r.id} href={`/services/hebergement/${r.id}`}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#f0f9ff] transition-colors group">
                      <img src={r.images?.[0] ?? "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=100&q=80"} alt={r.name} className="w-14 h-10 object-cover rounded-lg shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#0c4a6e] truncate group-hover:text-[#c9a84c] transition-colors">{r.name}</p>
                        <p className="text-xs text-gray-400">{r.pricePerNight.toLocaleString()} FCFA/nuit</p>
                      </div>
                      <ArrowRight size={12} className="text-gray-300 group-hover:text-[#c9a84c] shrink-0 transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      <ReservationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={room.name}
        details={`${room.type} · ${room.capacity} personnes · ${room.pricePerNight.toLocaleString()} FCFA/nuit`}
      />
    </div>
  );
}
