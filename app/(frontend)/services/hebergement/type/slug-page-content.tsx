"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Star, Check, Phone, ShieldCheck, ChevronRight, MapPin, Clock, Wifi, Globe } from "lucide-react";

type Hotel = {
  id: string; name: string; location: string; stars: number;
  priceFrom: number; priceTo: number; image: string;
  phone?: string; website?: string; description: string;
  amenities: string[]; roomTypes: string[];
  checkIn: string; checkOut: string; rating?: number;
};

const HOTELS_BY_TYPE: Record<string, Hotel[]> = {
  "hotels-luxe": [
    { id: "h1", name: "Enotel Beach Resort", location: "San-Pédro", stars: 5, priceFrom: 85000, priceTo: 150000, image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80", phone: "+225 27 34 71 00 00", website: "enotelbeach.com", description: "Resort 5 étoiles en bord de mer à San-Pédro. Piscine à débordement, restaurant gastronomique, spa et accès direct à la plage privée.", amenities: ["Piscine à débordement", "Spa & bien-être", "Restaurant gastronomique", "Bar lounge", "Wifi haut débit", "Climatisation", "Parking sécurisé", "Salle de conférence", "Transfert aéroport"], roomTypes: ["Chambre Deluxe vue mer", "Suite Junior", "Suite Présidentielle", "Bungalow plage"], checkIn: "14h00", checkOut: "12h00", rating: 4.7 },
    { id: "h2", name: "Les Jardins d'Ivoire", location: "San-Pédro", stars: 4, priceFrom: 65000, priceTo: 120000, image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80", phone: "+225 27 34 70 00 00", description: "Hôtel 4 étoiles au cœur de San-Pédro, cadre verdoyant et piscine. Idéal pour les voyageurs d'affaires et les touristes exigeants.", amenities: ["Piscine", "Restaurant", "Bar", "Wifi gratuit", "Climatisation", "Salle de réunion", "Parking", "Room service 24h/24"], roomTypes: ["Chambre Standard", "Chambre Supérieure", "Suite Familiale"], checkIn: "14h00", checkOut: "11h00", rating: 4.4 },
    { id: "h3", name: "Ocean & Lagune Resort", location: "Grand-Bassam", stars: 4, priceFrom: 70000, priceTo: 130000, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80", phone: "+225 27 21 30 00 00", description: "Resort face à l'océan et la lagune à Grand-Bassam. Architecture coloniale rénovée, piscine, restaurant de fruits de mer frais.", amenities: ["Vue océan & lagune", "Piscine", "Restaurant fruits de mer", "Bar", "Wifi", "Climatisation", "Plage privée", "Sports nautiques"], roomTypes: ["Chambre Vue Lagune", "Chambre Vue Océan", "Suite Coloniale"], checkIn: "15h00", checkOut: "12h00", rating: 4.5 },
    { id: "h4", name: "Coucoue Lodge", location: "Assinie", stars: 4, priceFrom: 80000, priceTo: 140000, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80", phone: "+225 07 07 07 07 07", description: "Lodge de luxe à Assinie avec plage privée, piscine et restaurant. Cadre naturel exceptionnel entre océan et lagune d'Aby.", amenities: ["Plage privée", "Piscine", "Restaurant", "Bar", "Wifi", "Climatisation", "Sports nautiques", "Excursions pirogue"], roomTypes: ["Bungalow Standard", "Bungalow Deluxe", "Villa Privée"], checkIn: "14h00", checkOut: "11h00", rating: 4.6 },
  ],
  "hotels-standards": [
    { id: "s1", name: "Hôtel International", location: "Grand-Bassam", stars: 3, priceFrom: 30000, priceTo: 55000, image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80", phone: "+225 27 21 30 10 00", description: "Hôtel 3 étoiles bien situé à Grand-Bassam, piscine extérieure, restaurant et petit-déjeuner continental inclus. Idéal pour les familles.", amenities: ["Piscine", "Restaurant", "Petit-déjeuner inclus", "Wifi gratuit", "Climatisation", "TV", "Parking gratuit"], roomTypes: ["Chambre Simple", "Chambre Double", "Chambre Familiale"], checkIn: "14h00", checkOut: "11h00", rating: 3.8 },
    { id: "s2", name: "Hôtel Bassam Plage", location: "Grand-Bassam", stars: 3, priceFrom: 25000, priceTo: 45000, image: "https://images.unsplash.com/photo-1631049421450-348ccd7f8949?w=600&q=80", phone: "+225 27 21 30 20 00", description: "Hôtel en bord de plage à Grand-Bassam. Accès direct à la plage, restaurant de poissons frais, ambiance décontractée et familiale.", amenities: ["Accès plage", "Restaurant", "Bar", "Wifi", "Climatisation", "TV", "Parking"], roomTypes: ["Chambre Standard", "Chambre Vue Mer", "Chambre Familiale"], checkIn: "14h00", checkOut: "11h00", rating: 3.6 },
    { id: "s3", name: "Hôtel Sophia", location: "San-Pédro", stars: 3, priceFrom: 28000, priceTo: 50000, image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&q=80", phone: "+225 27 34 72 00 00", description: "Hôtel confortable au centre de San-Pédro. Piscine, restaurant, idéal pour les voyageurs d'affaires et les touristes de passage.", amenities: ["Piscine", "Restaurant", "Wifi gratuit", "Climatisation", "TV", "Parking", "Salle de réunion"], roomTypes: ["Chambre Standard", "Chambre Supérieure", "Suite"], checkIn: "14h00", checkOut: "11h00", rating: 3.9 },
    { id: "s4", name: "Boblin la Mer", location: "Grand-Bassam", stars: 2, priceFrom: 20000, priceTo: 35000, image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80", phone: "+225 07 47 72 29 31", description: "Hôtel-restaurant-plage à Grand-Bassam, à quelques pas de la plage Drogba. Jardin, terrasse, parking gratuit, ambiance locale.", amenities: ["Accès plage", "Restaurant", "Terrasse", "Jardin", "Wifi", "Climatisation", "Parking gratuit"], roomTypes: ["Chambre Standard", "Chambre Double"], checkIn: "13h00", checkOut: "11h00", rating: 3.5 },
    { id: "s5", name: "Le Canelle", location: "San-Pédro", stars: 3, priceFrom: 25000, priceTo: 45000, image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80", phone: "+225 27 34 73 00 00", description: "Hôtel 3 étoiles avec restaurant gastronomique à San-Pédro. Cuisine française et ivoirienne, cadre agréable et service attentionné.", amenities: ["Restaurant gastronomique", "Bar", "Wifi", "Climatisation", "TV", "Parking"], roomTypes: ["Chambre Standard", "Chambre Supérieure"], checkIn: "14h00", checkOut: "11h00", rating: 3.7 },
    { id: "s6", name: "Hôtel de la Côte", location: "Jacqueville", stars: 2, priceFrom: 18000, priceTo: 32000, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80", phone: "+225 27 21 40 00 00", description: "Hôtel simple et propre à Jacqueville, à 5 min de la plage. Accueil chaleureux, cuisine locale, idéal pour les week-ends.", amenities: ["Accès plage proche", "Restaurant", "Wifi", "Climatisation", "Parking"], roomTypes: ["Chambre Simple", "Chambre Double"], checkIn: "13h00", checkOut: "11h00", rating: 3.3 },
  ],
  "residences": [
    { id: "r1", name: "Résidence Les Cocotiers", location: "Assinie-Mafia", stars: 0, priceFrom: 45000, priceTo: 90000, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80", phone: "+225 07 10 00 00 01", description: "Résidence meublée en bord de mer à Assinie-Mafia. Appartements 2 à 4 pièces avec terrasse vue océan, cuisine entièrement équipée.", amenities: ["Vue océan", "Cuisine équipée", "Terrasse privée", "Wifi", "Climatisation", "Parking", "Ménage hebdomadaire", "Linge fourni"], roomTypes: ["Studio", "Appartement 2 pièces", "Appartement 3 pièces", "Villa 4 pièces"], checkIn: "15h00", checkOut: "11h00", rating: 4.2 },
    { id: "r2", name: "Queen Lodge Résidence", location: "Assinie", stars: 0, priceFrom: 55000, priceTo: 100000, image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80", phone: "+225 07 10 00 00 02", description: "Lodge-résidence avec plage privée à Assinie. Bar, restaurant, sports nautiques. Idéal pour séjours famille ou groupe d'amis.", amenities: ["Plage privée", "Restaurant", "Bar", "Sports nautiques", "Wifi", "Climatisation", "Cuisine équipée", "Parking"], roomTypes: ["Appartement 2 pièces", "Appartement 3 pièces", "Bungalow"], checkIn: "15h00", checkOut: "11h00", rating: 4.3 },
    { id: "r3", name: "Résidence Bord de Lagune", location: "Jacqueville", stars: 0, priceFrom: 35000, priceTo: 70000, image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80", phone: "+225 07 10 00 00 03", description: "Résidence calme en bord de lagune à Jacqueville. Appartements meublés avec vue sur la lagune Ébrié, accès plage à 5 min à pied.", amenities: ["Vue lagune", "Cuisine équipée", "Wifi", "Climatisation", "Parking", "Jardin", "Linge fourni"], roomTypes: ["Studio", "Appartement 2 pièces", "Appartement 3 pièces"], checkIn: "15h00", checkOut: "11h00", rating: 4.0 },
    { id: "r4", name: "Villa Sassandra", location: "Sassandra", stars: 0, priceFrom: 60000, priceTo: 110000, image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80", phone: "+225 07 10 00 00 04", description: "Villa meublée avec vue sur la rivière Sassandra. 3 chambres, grande terrasse, jardin tropical, idéale pour les familles.", amenities: ["Vue rivière", "Jardin tropical", "Cuisine équipée", "Terrasse", "Wifi", "Climatisation", "Parking privé"], roomTypes: ["Villa 3 chambres", "Villa 4 chambres"], checkIn: "15h00", checkOut: "11h00", rating: 4.4 },
  ],
  "auberges": [
    { id: "a1", name: "Assinie Lodge", location: "Assinie", stars: 0, priceFrom: 15000, priceTo: 30000, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80", phone: "+225 07 20 00 00 01", description: "Lodge authentique à Assinie, tenu par une famille locale passionnée. Cuisine ivoirienne maison, ambiance conviviale, accès plage direct.", amenities: ["Cuisine locale maison", "Petit-déjeuner inclus", "Accès plage", "Wifi", "Ventilateur", "Eau chaude", "Excursions disponibles"], roomTypes: ["Chambre Simple", "Chambre Double", "Dortoir 4 lits"], checkIn: "Flexible", checkOut: "11h00", rating: 4.1 },
    { id: "a2", name: "Gîte de la Côtière", location: "Grand-Lahou", stars: 0, priceFrom: 10000, priceTo: 20000, image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80", phone: "+225 07 20 00 00 02", description: "Gîte familial à Grand-Lahou, au bord de la lagune Tadio. Cuisine locale, pêche artisanale, excursions en pirogue sur la lagune.", amenities: ["Cuisine locale", "Excursions pirogue", "Pêche", "Petit-déjeuner", "Ventilateur", "Eau chaude", "Jardin"], roomTypes: ["Chambre Simple", "Chambre Double"], checkIn: "Flexible", checkOut: "10h00", rating: 4.0 },
    { id: "a3", name: "Auberge du Littoral", location: "Sassandra", stars: 0, priceFrom: 12000, priceTo: 25000, image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80", phone: "+225 07 20 00 00 03", description: "Auberge conviviale à Sassandra, ville historique du littoral. Vue sur la rivière Sassandra, cuisine locale excellente, guides disponibles.", amenities: ["Vue rivière", "Cuisine locale", "Petit-déjeuner", "Wifi", "Climatisation", "Parking", "Guides locaux"], roomTypes: ["Chambre Simple", "Chambre Double", "Chambre Familiale"], checkIn: "13h00", checkOut: "11h00", rating: 3.9 },
    { id: "a4", name: "Gîte Plage de Fresco", location: "Fresco", stars: 0, priceFrom: 8000, priceTo: 18000, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80", phone: "+225 07 20 00 00 04", description: "Petit gîte familial à Fresco, l'une des plus belles plages de Côte d'Ivoire. Cadre naturel préservé, cuisine de pêcheurs, ambiance authentique.", amenities: ["Accès plage", "Cuisine de pêcheurs", "Petit-déjeuner", "Ventilateur", "Eau courante"], roomTypes: ["Chambre Simple", "Chambre Double"], checkIn: "Flexible", checkOut: "10h00", rating: 3.8 },
  ],
  "campings": [
    { id: "c1", name: "Camping Plage d'Assinie", location: "Assinie", stars: 0, priceFrom: 5000, priceTo: 15000, image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80", phone: "+225 07 30 00 00 01", description: "Camping aménagé directement sur la plage d'Assinie. Tentes équipées ou emplacements pour votre tente, sanitaires propres, feux de camp le soir.", amenities: ["Accès plage direct", "Tentes équipées disponibles", "Sanitaires & douches", "Eau courante", "Éclairage", "Espace barbecue", "Feux de camp"], roomTypes: ["Emplacement tente", "Tente équipée 2 pers.", "Tente équipée 4 pers."], checkIn: "12h00", checkOut: "11h00", rating: 4.0 },
    { id: "c2", name: "Camping Naturel de Fresco", location: "Fresco", stars: 0, priceFrom: 3000, priceTo: 10000, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80", phone: "+225 07 30 00 00 02", description: "Camping en pleine nature à Fresco, l'une des plages les plus sauvages de Côte d'Ivoire. Idéal pour les amoureux de nature et d'aventure.", amenities: ["Plage sauvage", "Sanitaires", "Eau courante", "Espace cuisine", "Feux de camp", "Pêche possible"], roomTypes: ["Emplacement tente", "Tente équipée 2 pers."], checkIn: "12h00", checkOut: "11h00", rating: 3.9 },
    { id: "c3", name: "Eco-Camp Grand-Lahou", location: "Grand-Lahou", stars: 0, priceFrom: 4000, priceTo: 12000, image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80", phone: "+225 07 30 00 00 03", description: "Éco-camping au bord de la lagune de Grand-Lahou. Tentes sur pilotis, excursions en pirogue, observation des oiseaux, cuisine locale.", amenities: ["Tentes sur pilotis", "Vue lagune", "Excursions pirogue", "Observation oiseaux", "Cuisine locale", "Sanitaires"], roomTypes: ["Tente sur pilotis 2 pers.", "Tente sur pilotis 4 pers."], checkIn: "13h00", checkOut: "11h00", rating: 4.2 },
  ],
  "locations-courte-duree": [
    { id: "l1", name: "Appartement Vue Mer Assinie", location: "Assinie-Mafia", stars: 0, priceFrom: 35000, priceTo: 70000, image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80", phone: "+225 07 40 00 00 01", description: "Appartement moderne avec vue mer directe à Assinie-Mafia. 2 chambres, salon, cuisine équipée, terrasse. Idéal pour week-end ou vacances.", amenities: ["Vue mer", "Cuisine équipée", "Terrasse", "Wifi", "Climatisation", "Linge fourni", "Parking"], roomTypes: ["Appartement 2 chambres"], checkIn: "15h00", checkOut: "11h00", rating: 4.5 },
    { id: "l2", name: "Studio Bord de Plage Bassam", location: "Grand-Bassam", stars: 0, priceFrom: 20000, priceTo: 40000, image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80", phone: "+225 07 40 00 00 02", description: "Studio cosy à 2 min de la plage de Grand-Bassam. Tout équipé, entrée indépendante, idéal pour un séjour romantique ou solo.", amenities: ["Proche plage", "Cuisine équipée", "Wifi", "Climatisation", "TV", "Linge fourni"], roomTypes: ["Studio 1 chambre"], checkIn: "Flexible (code)", checkOut: "11h00", rating: 4.3 },
    { id: "l3", name: "Villa Familiale Jacqueville", location: "Jacqueville", stars: 0, priceFrom: 50000, priceTo: 90000, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80", phone: "+225 07 40 00 00 03", description: "Grande villa pour familles ou groupes à Jacqueville. 4 chambres, piscine privée, jardin, barbecue. À 10 min de la plage.", amenities: ["Piscine privée", "Jardin", "Barbecue", "Cuisine équipée", "Wifi", "Climatisation", "Parking", "4 chambres"], roomTypes: ["Villa 4 chambres"], checkIn: "15h00", checkOut: "11h00", rating: 4.6 },
    { id: "l4", name: "Appartement San-Pédro Centre", location: "San-Pédro", stars: 0, priceFrom: 25000, priceTo: 50000, image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80", phone: "+225 07 40 00 00 04", description: "Appartement moderne au centre de San-Pédro. 2 chambres, salon, cuisine équipée. Proche commerces, restaurants et plage.", amenities: ["Centre-ville", "Cuisine équipée", "Wifi", "Climatisation", "TV", "Parking", "Linge fourni"], roomTypes: ["Appartement 2 chambres"], checkIn: "Flexible (code)", checkOut: "11h00", rating: 4.1 },
  ],
};

const TYPE_META: Record<string, { title: string; subtitle: string; stars?: number; heroImage: string; description: string; priceRange: string }> = {
  "hotels-luxe":            { title: "Hôtels de Luxe",              subtitle: "4 à 5 étoiles", stars: 5, heroImage: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1600&q=80", description: "L'excellence hôtelière sur le littoral ivoirien", priceRange: "65 000 — 150 000 FCFA / nuit" },
  "hotels-standards":       { title: "Hôtels Standards",            subtitle: "2 à 3 étoiles", stars: 3, heroImage: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1600&q=80", description: "Confort et rapport qualité-prix sur la côte",    priceRange: "18 000 — 55 000 FCFA / nuit" },
  "residences":             { title: "Résidences Meublées",         subtitle: "Bord de mer",         heroImage: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1600&q=80", description: "L'intimité d'un chez-soi face à l'océan",       priceRange: "35 000 — 110 000 FCFA / nuit" },
  "auberges":               { title: "Auberges & Gîtes",            subtitle: "Authenticité locale",  heroImage: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1600&q=80", description: "L'hébergement authentique au cœur de la nature", priceRange: "8 000 — 30 000 FCFA / nuit" },
  "campings":               { title: "Campings Aménagés",           subtitle: "Nature & aventure",    heroImage: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1600&q=80", description: "Dormir sous les étoiles face à l'océan",        priceRange: "3 000 — 15 000 FCFA / nuit" },
  "locations-courte-duree": { title: "Locations Courte Durée",      subtitle: "Style Airbnb",         heroImage: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1600&q=80", description: "Votre logement privé pour quelques nuits",      priceRange: "20 000 — 90 000 FCFA / nuit" },
};

function HotelCard({ hotel }: { hotel: Hotel }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="relative h-48">
        <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        {hotel.stars > 0 && (
          <div className="absolute top-3 left-3 flex gap-0.5">
            {Array.from({ length: hotel.stars }).map((_, i) => (
              <Star key={i} size={12} className="text-[#c9a84c] fill-[#c9a84c]" />
            ))}
          </div>
        )}
        <div className="absolute top-3 right-3 bg-[#c9a84c] text-white text-xs font-bold px-2.5 py-1 rounded-full">
          À partir de {hotel.priceFrom.toLocaleString()} FCFA
        </div>
        {hotel.rating && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
            <Star size={11} className="text-[#c9a84c] fill-[#c9a84c]" />
            <span className="text-xs font-bold text-gray-800">{hotel.rating}</span>
          </div>
        )}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
          <MapPin size={11} className="text-[#0c4a6e]" />
          <span className="text-xs font-semibold text-gray-700">{hotel.location}</span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-[#0c4a6e] text-base mb-1">{hotel.name}</h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-3 line-clamp-2">{hotel.description}</p>

        {/* Équipements */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {hotel.amenities.slice(0, 4).map(a => (
            <span key={a} className="text-xs bg-[#f0f9ff] text-[#38bdf8] px-2 py-0.5 rounded-full border border-[#bae6fd]">{a}</span>
          ))}
          {hotel.amenities.length > 4 && (
            <span className="text-xs bg-gray-50 text-gray-400 px-2 py-0.5 rounded-full border border-gray-100">+{hotel.amenities.length - 4}</span>
          )}
        </div>

        {/* Types de chambres */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Types de chambres</p>
          <div className="flex flex-wrap gap-1.5">
            {hotel.roomTypes.map(r => (
              <span key={r} className="text-xs bg-[#faf8f4] text-[#c9a84c] px-2 py-0.5 rounded-full border border-[#c9a84c]/20 font-medium">{r}</span>
            ))}
          </div>
        </div>

        {/* Infos pratiques */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-gray-500">
          <div className="flex items-center gap-1.5"><Clock size={11} className="text-[#c9a84c]" /> Check-in : {hotel.checkIn}</div>
          <div className="flex items-center gap-1.5"><Clock size={11} className="text-[#c9a84c]" /> Check-out : {hotel.checkOut}</div>
          <div className="flex items-center gap-1.5 col-span-2">
            <span className="font-semibold text-[#0c4a6e]">{hotel.priceFrom.toLocaleString()} — {hotel.priceTo.toLocaleString()} FCFA</span>
            <span className="text-gray-400">/ nuit</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link href="/services/hebergement#chambres" className="flex-1 btn-primary justify-center text-xs py-2">
            Réserver <ArrowRight size={13} />
          </Link>
          {hotel.phone && (
            <a href={`tel:${hotel.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-1.5 border border-[#0c4a6e]/20 text-[#0c4a6e] text-xs font-semibold px-3 py-2 rounded-xl hover:bg-[#0c4a6e]/5 transition-colors">
              <Phone size={13} /> Appeler
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HebergementTypePage() {
  const { slug } = useParams<{ slug: string }>();
  const meta = TYPE_META[slug];
  const hotels = HOTELS_BY_TYPE[slug] ?? [];

  if (!meta) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-gray-500">Type d hébergement introuvable.</p>
      <Link href="/services/hebergement" className="btn-primary">Retour</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc]">

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-[#0c4a6e] transition-colors">Accueil</Link>
          <ChevronRight size={14} />
          <Link href="/services/hebergement" className="hover:text-[#0c4a6e] transition-colors">Hébergement</Link>
          <ChevronRight size={14} />
          <span className="text-[#0c4a6e] font-semibold">{meta.title}</span>
        </div>
      </div>

      {/* Hero */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img src={meta.heroImage} alt={meta.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-6xl mx-auto">
          <Link href="/services/hebergement" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-3 transition-colors">
            <ArrowLeft size={15} /> Retour aux hébergements
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-[#c9a84c] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">{meta.subtitle}</span>
            {meta.stars && (
              <div className="flex gap-0.5">
                {Array.from({ length: meta.stars }).map((_, i) => (
                  <Star key={i} size={14} className="text-[#c9a84c] fill-[#c9a84c]" />
                ))}
              </div>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white">{meta.title}</h1>
          <p className="text-white/80 mt-1">{meta.description} · <span className="text-[#c9a84c] font-semibold">{meta.priceRange}</span></p>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-6xl mx-auto px-4 py-10 sm:px-6 lg:px-8">

        {/* Compteur */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">
            <span className="font-bold text-[#0c4a6e] text-lg">{hotels.length}</span> établissement{hotels.length > 1 ? "s" : ""} disponible{hotels.length > 1 ? "s" : ""}
          </p>
          <Link href="/services/hebergement" className="text-sm text-[#38bdf8] hover:underline font-medium flex items-center gap-1">
            <ArrowLeft size={13} /> Voir tous les types
          </Link>
        </div>

        {/* Grille des hôtels */}
        {hotels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {hotels.map(h => <HotelCard key={h.id} hotel={h} />)}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-400">Aucun établissement disponible pour le moment.</p>
          </div>
        )}

        {/* Autres types */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-[#0c4a6e] mb-4">Autres types d hébergement</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {Object.entries(TYPE_META).filter(([s]) => s !== slug).map(([s, t]) => (
              <Link key={s} href={`/services/hebergement/type/${s}`}
                className="group relative rounded-xl overflow-hidden h-24 shadow-sm hover:shadow-md transition-shadow">
                <img src={t.heroImage} alt={t.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-white text-xs font-semibold leading-tight">{t.title}</p>
                  {t.stars && (
                    <div className="flex gap-0.5 mt-0.5">
                      {Array.from({ length: t.stars }).map((_, i) => <Star key={i} size={8} className="text-[#c9a84c] fill-[#c9a84c]" />)}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA contact */}
        <div className="mt-6 bg-gradient-to-r from-[#0c4a6e] to-[#0e5a82] rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg">Vous ne trouvez pas ce qu il vous faut ?</h3>
            <p className="text-white/70 text-sm mt-1">Contactez-nous, nous trouvons l hébergement idéal pour vous sur toute la côtière.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <a href="tel:+2250747722931" className="flex items-center gap-2 bg-white text-[#0c4a6e] font-bold text-sm px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
              <Phone size={15} /> Appeler
            </a>
            <Link href="/contact" className="flex items-center gap-2 bg-[#c9a84c] text-white font-bold text-sm px-4 py-2.5 rounded-xl hover:bg-[#b8973b] transition-colors">
              Nous écrire <ArrowRight size={15} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

