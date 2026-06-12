"use client";

import { useParams } from "next/navigation";
import { 
  ArrowRight, ArrowLeft, ChevronRight, Users, Wifi, Share2, Check,
  Wind, Tv, Waves, UtensilsCrossed, Sofa, Car, Dumbbell, Coffee,
  Bath, Star, MapPin, Clock, ShieldCheck, Phone, CalendarDays,
  Sparkles, Info, CheckCircle2, RefreshCw,
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import ReservationModal from "@/components/frontend/ReservationModal";
import ImageZoom from "@/components/frontend/ImageZoom";

// Force le rendu dynamique pour éviter les erreurs de génération statique au build
export const dynamic = 'force-dynamic';

type Room = {
  id: string; name: string; type: string; capacity: number;
  pricePerNight: number; images: string[]; amenities: string[];
  isActive: boolean; description?: string;
};

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  "Wifi": <Wifi size={14} className="text-[#38bdf8]" />,
  "Climatisation": <Wind size={14} className="text-[#38bdf8]" />,
  "TV": <Tv size={14} className="text-[#38bdf8]" />,
  "Vue mer": <Waves size={14} className="text-[#38bdf8]" />,
  "Cuisine": <UtensilsCrossed size={14} className="text-[#38bdf8]" />,
  "Salon": <Sofa size={14} className="text-[#38bdf8]" />,
  "Parking": <Car size={14} className="text-[#38bdf8]" />,
  "Piscine": <Waves size={14} className="text-[#38bdf8]" />,
  "Gym": <Dumbbell size={14} className="text-[#38bdf8]" />,
  "Petit-déjeuner": <Coffee size={14} className="text-[#38bdf8]" />,
};

const POLICIES = [
  { icon: <CalendarDays size={16} className="text-[#c9a84c]" />, title: "Check-in / Check-out", desc: "Arrivée dès 14h00 · Départ avant 12h00" },
  { icon: <ShieldCheck size={16} className="text-[#c9a84c]" />, title: "Annulation", desc: "Gratuite jusqu'à 48h avant" },
];

const INCLUSIONS = [
  "Petit-déjeuner inclus", "Wifi haut débit", "Climatisation 24h/24", 
  "Ménage quotidien", "Parking sécurisé", "Coffre-fort"
];

export default function RoomDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [copied, setCopied] = useState(false);
  const [allRooms, setAllRooms] = useState<Room[]>([]);

  useEffect(() => {
    if (!id) return;
    
    fetch(`/api/rooms/${id}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => d.data ? setRoom(d.data) : setNotFound(true))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));

    fetch("/api/rooms")
      .then(r => r.json())
      .then(d => setAllRooms(d.data ?? []))
      .catch(() => {});
  }, [id]);

  function handleShare() {
    if (typeof window !== "undefined") {
      const url = window.location.href;
      if (navigator.share) { navigator.share({ title: room?.name ?? "", url }); }
      else { 
        navigator.clipboard.writeText(url).then(() => { 
          setCopied(true); 
          setTimeout(() => setCopied(false), 2000); 
        }); 
      }
    }
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

  const images = room.images?.length > 0 ? room.images : ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80"];

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Breadcrumb & Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/services/hebergement" className="text-sm text-gray-500 hover:text-[#0c4a6e] transition-colors">Retour</Link>
          <button onClick={handleShare} className="flex items-center gap-2 text-sm font-semibold text-[#0c4a6e]">{copied ? "Lien copié !" : "Partager"}</button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-black text-[#0c4a6e] mb-2">{room.name}</h1>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl overflow-hidden shadow-md bg-white">
              <ImageZoom images={images} alt={room.name} activeImg={activeImg} setActiveImg={setActiveImg} />
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-bold text-lg mb-3">Description</h2>
                <p className="text-gray-600 text-sm">{room.description}</p>
            </div>
          </div>

          {/* Sidebar Réservation */}
          <div className="bg-white rounded-2xl p-6 shadow-md border sticky top-24 h-fit">
            <p className="text-3xl font-black text-[#c9a84c] mb-4">{room.pricePerNight.toLocaleString()} FCFA</p>
            <button onClick={() => setModalOpen(true)} className="btn-primary w-full py-3">Réserver maintenant</button>
            <a href="tel:+2250747722931" className="mt-4 block text-center text-sm font-semibold text-[#0c4a6e]">Appeler pour réserver</a>
          </div>
        </div>
      </div>

      <ReservationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={room.name}
        details={`${room.type} · ${room.pricePerNight.toLocaleString()} FCFA/nuit`}
      />
    </div>
  );
}