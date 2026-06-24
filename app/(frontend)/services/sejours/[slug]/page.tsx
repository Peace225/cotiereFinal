"use client";

// app/services/sejours/[slug]/page.tsx
import { useState, use, useMemo } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  Star, MapPin, ArrowLeft, Check, Shield, Calendar, Users, User, Phone, Clock, 
  Wifi, Wind, Waves, Zap, Palmtree, Coffee, Utensils, Car, Tv, Flame 
} from "lucide-react";

// Remplacer par le numéro WhatsApp de l'administrateur
const ADMIN_WHATSAPP = "2250700000000";

// Fonction pour attribuer dynamiquement une icône aux équipements
const getAmenityIcon = (amenity: string) => {
  const text = amenity.toLowerCase();
  if (text.includes("wifi")) return <Wifi size={16} strokeWidth={2.5} />;
  if (text.includes("climatisation")) return <Wind size={16} strokeWidth={2.5} />;
  if (text.includes("piscine") || text.includes("mer")) return <Waves size={16} strokeWidth={2.5} />;
  if (text.includes("électrogène")) return <Zap size={16} strokeWidth={2.5} />;
  if (text.includes("plage")) return <Palmtree size={16} strokeWidth={2.5} />;
  if (text.includes("déjeuner")) return <Coffee size={16} strokeWidth={2.5} />;
  if (text.includes("restaurant")) return <Utensils size={16} strokeWidth={2.5} />;
  if (text.includes("parking")) return <Car size={16} strokeWidth={2.5} />;
  if (text.includes("tv") || text.includes("télévision")) return <Tv size={16} strokeWidth={2.5} />;
  if (text.includes("barbecue")) return <Flame size={16} strokeWidth={2.5} />;
  return <Check size={16} strokeWidth={2.5} />; // Icône par défaut
};

// Les données fictives avec 4 images par hébergement
const initialRooms = [
  {
    id: "rm_1",
    name: "Villa Emeraude - Bord de Lagune",
    slug: "villa-emeraude-assinie",
    type: "Villa",
    capacity: 6,
    pricePerNight: 250000,
    images: [
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80",
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&q=80",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80"
    ],
    amenities: ["Piscine privée", "Wifi", "Climatisation", "Groupe électrogène"],
    quartier: "Assinie Mafia",
    rating: 4.9,
    reviews: 124,
    description: "Une villa d'exception avec accès direct à la lagune, piscine à débordement et service de maison inclus. Profitez d'un cadre idyllique pour vous ressourcer en toute intimité avec vos proches."
  },
  {
    id: "rm_2",
    name: "Hôtel Le Grand Large - Suite Prestige",
    slug: "suite-prestige-grand-bassam",
    type: "Hôtel",
    capacity: 2,
    pricePerNight: 85000,
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80"
    ],
    amenities: ["Vue sur mer", "Wifi", "Petit-déjeuner inclus", "Climatisation"],
    quartier: "Grand-Bassam",
    rating: 4.7,
    reviews: 89,
    description: "Situé au cœur du quartier France historique, profitez du confort d'une suite avec terrasse face à l'océan."
  },
  {
    id: "rm_3",
    name: "Résidence Onyx - Penthouse Premium",
    slug: "residence-onyx-san-pedro",
    type: "Résidence",
    capacity: 4,
    pricePerNight: 120000,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1de2422030?w=800&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"
    ],
    amenities: ["Wifi", "Parking sécurisé", "Climatisation", "Smart TV"],
    quartier: "San-Pédro",
    rating: 4.8,
    reviews: 210,
    description: "Appartement de standing entièrement équipé avec une vue panoramique sur le port et la plage de Monogaga."
  },
  {
    id: "rm_4",
    name: "Lodge Baie des Sirènes - Éco-Luxe",
    slug: "baie-sirenes-grand-bereby",
    type: "Hôtel",
    capacity: 2,
    pricePerNight: 180000,
    images: [
      "https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?w=800&q=80",
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=80",
      "https://images.unsplash.com/photo-1537726235470-1698299dc20a?w=800&q=80",
      "https://images.unsplash.com/photo-1551882547-ff40c0d13966?w=800&q=80"
    ],
    amenities: ["Plage privée", "Piscine", "Restaurant"],
    quartier: "Grand-Béréby",
    rating: 4.9,
    reviews: 94,
    description: "Un havre de paix niché dans l'une des plus belles baies d'Afrique de l'Ouest."
  },
  {
    id: "rm_5",
    name: "Bungalow Les Cocotiers",
    slug: "bungalow-cocotiers-jacqueville",
    type: "Villa",
    capacity: 3,
    pricePerNight: 65000,
    images: [
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80",
      "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
      "https://images.unsplash.com/photo-1501183638710-841dd1904471?w=800&q=80"
    ],
    amenities: ["Accès plage", "Climatisation", "Barbecue"],
    quartier: "Jacqueville",
    rating: 4.5,
    reviews: 56,
    description: "Idéal pour un week-end d'évasion en famille ou entre amis, à seulement quelques pas du sable fin."
  }
];

export default function RoomDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  // Déballage des paramètres pour Next.js 15+
  const resolvedParams = use(params);
  const room = useMemo(() => initialRooms.find((r) => r.slug === resolvedParams.slug), [resolvedParams.slug]);

  // État du formulaire
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    arrivalTime: "",
    guests: 1,
  });

  if (!room) {
    notFound();
  }

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();

    // Construction du message pour WhatsApp incluant l'heure
    const message = `*NOUVELLE DEMANDE DE RÉSERVATION* 🏖️\n\n` +
      `*Hébergement :* ${room.name} (${room.quartier})\n` +
      `*Client :* ${form.lastName} ${form.firstName}\n` +
      `*Téléphone :* ${form.phone}\n` +
      `*Dates :* Du ${form.checkIn} au ${form.checkOut}\n` +
      `*Heure d'arrivée prévue :* ${form.arrivalTime}\n` +
      `*Voyageurs :* ${form.guests}\n\n` +
      `*Prix indicatif par nuit :* ${room.pricePerNight.toLocaleString()} XOF\n\n` +
      `Merci de me confirmer la disponibilité et la marche à suivre pour le paiement.`;

    const whatsappUrl = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Navigation retour */}
        <Link 
          href="/services/sejours" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-[#003b95] font-bold mb-6 transition-colors"
        >
          <ArrowLeft size={20} /> Retour aux séjours
        </Link>

        {/* Titre et Localisation */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="bg-[#003b95]/10 text-[#003b95] text-xs font-black px-3 py-1 rounded-lg uppercase tracking-wider">
              {room.type}
            </span>
            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg text-yellow-700 text-xs font-bold">
              <Star size={14} className="fill-yellow-400 text-yellow-400" />
              {room.rating} ({room.reviews} avis)
            </div>
          </div>
          <h1 className="!text-[20px] md:!text-[25px]font-black text-slate-900 mb-2">{room.name}</h1>
          <p className="text-sm text-slate-500 flex items-center gap-1 font-medium">
            <MapPin size={18} className="text-[#003b95]" /> {room.quartier}, Côte d'Ivoire
          </p>
        </div>

        {/* Grille principale : Images + Contenu */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Section Gauche : Images et Détails */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Grille Mosaïque de 4 Images */}
            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-3 h-[300px] md:h-[450px] rounded-[2rem] overflow-hidden shadow-sm">
              <div className="md:col-span-2 md:row-span-2 h-full w-full overflow-hidden">
                <img 
                  src={room.images[0]} 
                  alt={`${room.name} vue principale`} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer" 
                />
              </div>
              <div className="hidden md:block md:col-span-1 md:row-span-1 h-full w-full overflow-hidden">
                <img 
                  src={room.images[1]} 
                  alt={`${room.name} vue 2`} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer" 
                />
              </div>
              <div className="hidden md:block md:col-span-1 md:row-span-1 h-full w-full overflow-hidden">
                <img 
                  src={room.images[2]} 
                  alt={`${room.name} vue 3`} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer" 
                />
              </div>
              <div className="hidden md:block md:col-span-2 md:row-span-1 h-full w-full overflow-hidden">
                <img 
                  src={room.images[3]} 
                  alt={`${room.name} vue 4`} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer" 
                />
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
              <h2 className="!text-[18px] md:!text-[20px] font-black text-slate-900 mb-4">A propos de cet hébergement</h2>
              <p className="text-slate-600 leading-relaxed text-sm">
                {room.description}
              </p>
            </div>

            {/* Équipements AVEC ICÔNES DYNAMIQUES */}
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
              <h2 className="!text-[18px] md:!text-[20px] font-black text-slate-900 mb-6">Équipements inclus</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {room.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-3 text-slate-700 font-bold text-sm">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#003b95] shadow-sm border border-slate-100">
                      {getAmenityIcon(amenity)}
                    </div>
                    {amenity}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section Droite : Carte de Réservation flottante */}
          <div className="relative">
            <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 sticky top-28">
              <div className="mb-6 pb-6 border-b border-slate-100">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-wider block mb-1">Tarif indicatif par nuit</span>
                <div className="text-3xl font-black text-slate-900">
                  {room.pricePerNight.toLocaleString()} <span className="text-base font-bold text-slate-500">XOF</span>
                </div>
              </div>

              {/* FORMULAIRE DE RÉSERVATION */}
              <form onSubmit={handleBooking} className="space-y-4">
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <User size={14} className="text-[#003b95]" /> Nom
                    </label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Nom"
                      value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                      className="w-full p-3 border border-slate-200 bg-slate-50 rounded-xl text-sm outline-none focus:border-[#003b95] focus:bg-white transition-colors" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Prénom(s)
                    </label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Prénom"
                      value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                      className="w-full p-3 border border-slate-200 bg-slate-50 rounded-xl text-sm outline-none focus:border-[#003b95] focus:bg-white transition-colors" 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Phone size={14} className="text-[#003b95]" /> Téléphone / WhatsApp
                  </label>
                  <input 
                    type="tel" 
                    required 
                    placeholder="+225 07 XX XX XX XX"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full p-3 border border-slate-200 bg-slate-50 rounded-xl text-sm outline-none focus:border-[#003b95] focus:bg-white transition-colors" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Calendar size={14} className="text-[#003b95]" /> Dates (Arrivée - Départ)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="date" 
                      required 
                      value={form.checkIn}
                      onChange={(e) => setForm({ ...form, checkIn: e.target.value })}
                      className="w-full p-3 border border-slate-200 bg-slate-50 rounded-xl text-sm outline-none focus:border-[#003b95] focus:bg-white transition-colors" 
                    />
                    <input 
                      type="date" 
                      required 
                      value={form.checkOut}
                      onChange={(e) => setForm({ ...form, checkOut: e.target.value })}
                      className="w-full p-3 border border-slate-200 bg-slate-50 rounded-xl text-sm outline-none focus:border-[#003b95] focus:bg-white transition-colors" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <Clock size={14} className="text-[#003b95]" /> Heure d'arrivée
                    </label>
                    <input 
                      type="time" 
                      required 
                      value={form.arrivalTime}
                      onChange={(e) => setForm({ ...form, arrivalTime: e.target.value })}
                      className="w-full p-3 border border-slate-200 bg-slate-50 rounded-xl text-sm outline-none focus:border-[#003b95] focus:bg-white transition-colors" 
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <Users size={14} className="text-[#003b95]" /> Voyageurs
                    </label>
                    <select 
                      value={form.guests}
                      onChange={(e) => setForm({ ...form, guests: Number(e.target.value) })}
                      className="w-full p-3 border border-slate-200 bg-slate-50 rounded-xl text-sm outline-none focus:border-[#003b95] focus:bg-white appearance-none transition-colors"
                    >
                      {[...Array(room.capacity)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1} Voyageur{i > 0 ? "s" : ""}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#003b95] text-white py-4 rounded-xl font-black text-lg shadow-lg shadow-blue-900/20 hover:bg-blue-800 transition mt-6 flex items-center justify-center gap-2"
                >
                  Confirmer la réservation 
                </button>
              </form>

              <div className="mt-6 flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <Shield className="text-[#003b95] shrink-0" size={20} />
                <p className="text-xs text-slate-500 font-medium">
                  Vos informations sont protégées. La réservation sera confirmée directement avec notre conseiller sur WhatsApp.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}