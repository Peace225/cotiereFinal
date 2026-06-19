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
    { id: "h1", name: "Enotel Beach Resort", location: "San-PÃ©dro", stars: 5, priceFrom: 85000, priceTo: 150000, image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80", phone: "+225 27 34 71 00 00", website: "enotelbeach.com", description: "Resort 5 Ã©toiles en bord de mer Ã  San-PÃ©dro. Piscine Ã  dÃ©bordement, restaurant gastronomique, spa et accÃ¨s direct Ã  la plage privÃ©e.", amenities: ["Piscine Ã  dÃ©bordement", "Spa & bien-Ãªtre", "Restaurant gastronomique", "Bar lounge", "Wifi haut dÃ©bit", "Climatisation", "Parking sÃ©curisÃ©", "Salle de confÃ©rence", "Transfert aÃ©roport"], roomTypes: ["Chambre Deluxe vue mer", "Suite Junior", "Suite PrÃ©sidentielle", "Bungalow plage"], checkIn: "14h00", checkOut: "12h00", rating: 4.7 },
    { id: "h2", name: "Les Jardins d'Ivoire", location: "San-PÃ©dro", stars: 4, priceFrom: 65000, priceTo: 120000, image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80", phone: "+225 27 34 70 00 00", description: "HÃ´tel 4 Ã©toiles au cÅ“ur de San-PÃ©dro, cadre verdoyant et piscine. IdÃ©al pour les voyageurs d'affaires et les touristes exigeants.", amenities: ["Piscine", "Restaurant", "Bar", "Wifi gratuit", "Climatisation", "Salle de rÃ©union", "Parking", "Room service 24h/24"], roomTypes: ["Chambre Standard", "Chambre SupÃ©rieure", "Suite Familiale"], checkIn: "14h00", checkOut: "11h00", rating: 4.4 },
    { id: "h3", name: "Ocean & Lagune Resort", location: "Grand-Bassam", stars: 4, priceFrom: 70000, priceTo: 130000, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80", phone: "+225 27 21 30 00 00", description: "Resort face Ã  l'ocÃ©an et la lagune Ã  Grand-Bassam. Architecture coloniale rÃ©novÃ©e, piscine, restaurant de fruits de mer frais.", amenities: ["Vue ocÃ©an & lagune", "Piscine", "Restaurant fruits de mer", "Bar", "Wifi", "Climatisation", "Plage privÃ©e", "Sports nautiques"], roomTypes: ["Chambre Vue Lagune", "Chambre Vue OcÃ©an", "Suite Coloniale"], checkIn: "15h00", checkOut: "12h00", rating: 4.5 },
    { id: "h4", name: "Coucoue Lodge", location: "Assinie", stars: 4, priceFrom: 80000, priceTo: 140000, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80", phone: "+225 07 07 07 07 07", description: "Lodge de luxe Ã  Assinie avec plage privÃ©e, piscine et restaurant. Cadre naturel exceptionnel entre ocÃ©an et lagune d'Aby.", amenities: ["Plage privÃ©e", "Piscine", "Restaurant", "Bar", "Wifi", "Climatisation", "Sports nautiques", "Excursions pirogue"], roomTypes: ["Bungalow Standard", "Bungalow Deluxe", "Villa PrivÃ©e"], checkIn: "14h00", checkOut: "11h00", rating: 4.6 },
  ],
  "hotels-standards": [
    { id: "s1", name: "HÃ´tel International", location: "Grand-Bassam", stars: 3, priceFrom: 30000, priceTo: 55000, image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80", phone: "+225 27 21 30 10 00", description: "HÃ´tel 3 Ã©toiles bien situÃ© Ã  Grand-Bassam, piscine extÃ©rieure, restaurant et petit-dÃ©jeuner continental inclus. IdÃ©al pour les familles.", amenities: ["Piscine", "Restaurant", "Petit-dÃ©jeuner inclus", "Wifi gratuit", "Climatisation", "TV", "Parking gratuit"], roomTypes: ["Chambre Simple", "Chambre Double", "Chambre Familiale"], checkIn: "14h00", checkOut: "11h00", rating: 3.8 },
    { id: "s2", name: "HÃ´tel Bassam Plage", location: "Grand-Bassam", stars: 3, priceFrom: 25000, priceTo: 45000, image: "https://images.unsplash.com/photo-1631049421450-348ccd7f8949?w=600&q=80", phone: "+225 27 21 30 20 00", description: "HÃ´tel en bord de plage Ã  Grand-Bassam. AccÃ¨s direct Ã  la plage, restaurant de poissons frais, ambiance dÃ©contractÃ©e et familiale.", amenities: ["AccÃ¨s plage", "Restaurant", "Bar", "Wifi", "Climatisation", "TV", "Parking"], roomTypes: ["Chambre Standard", "Chambre Vue Mer", "Chambre Familiale"], checkIn: "14h00", checkOut: "11h00", rating: 3.6 },
    { id: "s3", name: "HÃ´tel Sophia", location: "San-PÃ©dro", stars: 3, priceFrom: 28000, priceTo: 50000, image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&q=80", phone: "+225 27 34 72 00 00", description: "HÃ´tel confortable au centre de San-PÃ©dro. Piscine, restaurant, idÃ©al pour les voyageurs d'affaires et les touristes de passage.", amenities: ["Piscine", "Restaurant", "Wifi gratuit", "Climatisation", "TV", "Parking", "Salle de rÃ©union"], roomTypes: ["Chambre Standard", "Chambre SupÃ©rieure", "Suite"], checkIn: "14h00", checkOut: "11h00", rating: 3.9 },
    { id: "s4", name: "Boblin la Mer", location: "Grand-Bassam", stars: 2, priceFrom: 20000, priceTo: 35000, image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80", phone: "+225 07 47 72 29 31", description: "HÃ´tel-restaurant-plage Ã  Grand-Bassam, Ã  quelques pas de la plage Drogba. Jardin, terrasse, parking gratuit, ambiance locale.", amenities: ["AccÃ¨s plage", "Restaurant", "Terrasse", "Jardin", "Wifi", "Climatisation", "Parking gratuit"], roomTypes: ["Chambre Standard", "Chambre Double"], checkIn: "13h00", checkOut: "11h00", rating: 3.5 },
    { id: "s5", name: "Le Canelle", location: "San-PÃ©dro", stars: 3, priceFrom: 25000, priceTo: 45000, image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80", phone: "+225 27 34 73 00 00", description: "HÃ´tel 3 Ã©toiles avec restaurant gastronomique Ã  San-PÃ©dro. Cuisine franÃ§aise et ivoirienne, cadre agrÃ©able et service attentionnÃ©.", amenities: ["Restaurant gastronomique", "Bar", "Wifi", "Climatisation", "TV", "Parking"], roomTypes: ["Chambre Standard", "Chambre SupÃ©rieure"], checkIn: "14h00", checkOut: "11h00", rating: 3.7 },
    { id: "s6", name: "HÃ´tel de la CÃ´te", location: "Jacqueville", stars: 2, priceFrom: 18000, priceTo: 32000, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80", phone: "+225 27 21 40 00 00", description: "HÃ´tel simple et propre Ã  Jacqueville, Ã  5 min de la plage. Accueil chaleureux, cuisine locale, idÃ©al pour les week-ends.", amenities: ["AccÃ¨s plage proche", "Restaurant", "Wifi", "Climatisation", "Parking"], roomTypes: ["Chambre Simple", "Chambre Double"], checkIn: "13h00", checkOut: "11h00", rating: 3.3 },
  ],
  "residences": [
    { id: "r1", name: "RÃ©sidence Les Cocotiers", location: "Assinie-Mafia", stars: 0, priceFrom: 45000, priceTo: 90000, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80", phone: "+225 07 10 00 00 01", description: "RÃ©sidence meublÃ©e en bord de mer Ã  Assinie-Mafia. Appartements 2 Ã  4 piÃ¨ces avec terrasse vue ocÃ©an, cuisine entiÃ¨rement Ã©quipÃ©e.", amenities: ["Vue ocÃ©an", "Cuisine Ã©quipÃ©e", "Terrasse privÃ©e", "Wifi", "Climatisation", "Parking", "MÃ©nage hebdomadaire", "Linge fourni"], roomTypes: ["Studio", "Appartement 2 piÃ¨ces", "Appartement 3 piÃ¨ces", "Villa 4 piÃ¨ces"], checkIn: "15h00", checkOut: "11h00", rating: 4.2 },
    { id: "r2", name: "Queen Lodge RÃ©sidence", location: "Assinie", stars: 0, priceFrom: 55000, priceTo: 100000, image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80", phone: "+225 07 10 00 00 02", description: "Lodge-rÃ©sidence avec plage privÃ©e Ã  Assinie. Bar, restaurant, sports nautiques. IdÃ©al pour sÃ©jours famille ou groupe d'amis.", amenities: ["Plage privÃ©e", "Restaurant", "Bar", "Sports nautiques", "Wifi", "Climatisation", "Cuisine Ã©quipÃ©e", "Parking"], roomTypes: ["Appartement 2 piÃ¨ces", "Appartement 3 piÃ¨ces", "Bungalow"], checkIn: "15h00", checkOut: "11h00", rating: 4.3 },
    { id: "r3", name: "RÃ©sidence Bord de Lagune", location: "Jacqueville", stars: 0, priceFrom: 35000, priceTo: 70000, image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80", phone: "+225 07 10 00 00 03", description: "RÃ©sidence calme en bord de lagune Ã  Jacqueville. Appartements meublÃ©s avec vue sur la lagune Ã‰briÃ©, accÃ¨s plage Ã  5 min Ã  pied.", amenities: ["Vue lagune", "Cuisine Ã©quipÃ©e", "Wifi", "Climatisation", "Parking", "Jardin", "Linge fourni"], roomTypes: ["Studio", "Appartement 2 piÃ¨ces", "Appartement 3 piÃ¨ces"], checkIn: "15h00", checkOut: "11h00", rating: 4.0 },
    { id: "r4", name: "Villa Sassandra", location: "Sassandra", stars: 0, priceFrom: 60000, priceTo: 110000, image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80", phone: "+225 07 10 00 00 04", description: "Villa meublÃ©e avec vue sur la riviÃ¨re Sassandra. 3 chambres, grande terrasse, jardin tropical, idÃ©ale pour les familles.", amenities: ["Vue riviÃ¨re", "Jardin tropical", "Cuisine Ã©quipÃ©e", "Terrasse", "Wifi", "Climatisation", "Parking privÃ©"], roomTypes: ["Villa 3 chambres", "Villa 4 chambres"], checkIn: "15h00", checkOut: "11h00", rating: 4.4 },
  ],
  "auberges": [
    { id: "a1", name: "Assinie Lodge", location: "Assinie", stars: 0, priceFrom: 15000, priceTo: 30000, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80", phone: "+225 07 20 00 00 01", description: "Lodge authentique Ã  Assinie, tenu par une famille locale passionnÃ©e. Cuisine ivoirienne maison, ambiance conviviale, accÃ¨s plage direct.", amenities: ["Cuisine locale maison", "Petit-dÃ©jeuner inclus", "AccÃ¨s plage", "Wifi", "Ventilateur", "Eau chaude", "Excursions disponibles"], roomTypes: ["Chambre Simple", "Chambre Double", "Dortoir 4 lits"], checkIn: "Flexible", checkOut: "11h00", rating: 4.1 },
    { id: "a2", name: "GÃ®te de la CÃ´tiÃ¨re", location: "Grand-Lahou", stars: 0, priceFrom: 10000, priceTo: 20000, image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80", phone: "+225 07 20 00 00 02", description: "GÃ®te familial Ã  Grand-Lahou, au bord de la lagune Tadio. Cuisine locale, pÃªche artisanale, excursions en pirogue sur la lagune.", amenities: ["Cuisine locale", "Excursions pirogue", "PÃªche", "Petit-dÃ©jeuner", "Ventilateur", "Eau chaude", "Jardin"], roomTypes: ["Chambre Simple", "Chambre Double"], checkIn: "Flexible", checkOut: "10h00", rating: 4.0 },
    { id: "a3", name: "Auberge du Littoral", location: "Sassandra", stars: 0, priceFrom: 12000, priceTo: 25000, image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80", phone: "+225 07 20 00 00 03", description: "Auberge conviviale Ã  Sassandra, ville historique du littoral. Vue sur la riviÃ¨re Sassandra, cuisine locale excellente, guides disponibles.", amenities: ["Vue riviÃ¨re", "Cuisine locale", "Petit-dÃ©jeuner", "Wifi", "Climatisation", "Parking", "Guides locaux"], roomTypes: ["Chambre Simple", "Chambre Double", "Chambre Familiale"], checkIn: "13h00", checkOut: "11h00", rating: 3.9 },
    { id: "a4", name: "GÃ®te Plage de Fresco", location: "Fresco", stars: 0, priceFrom: 8000, priceTo: 18000, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80", phone: "+225 07 20 00 00 04", description: "Petit gÃ®te familial Ã  Fresco, l'une des plus belles plages de CÃ´te d'Ivoire. Cadre naturel prÃ©servÃ©, cuisine de pÃªcheurs, ambiance authentique.", amenities: ["AccÃ¨s plage", "Cuisine de pÃªcheurs", "Petit-dÃ©jeuner", "Ventilateur", "Eau courante"], roomTypes: ["Chambre Simple", "Chambre Double"], checkIn: "Flexible", checkOut: "10h00", rating: 3.8 },
  ],
  "campings": [
    { id: "c1", name: "Camping Plage d'Assinie", location: "Assinie", stars: 0, priceFrom: 5000, priceTo: 15000, image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80", phone: "+225 07 30 00 00 01", description: "Camping amÃ©nagÃ© directement sur la plage d'Assinie. Tentes Ã©quipÃ©es ou emplacements pour votre tente, sanitaires propres, feux de camp le soir.", amenities: ["AccÃ¨s plage direct", "Tentes Ã©quipÃ©es disponibles", "Sanitaires & douches", "Eau courante", "Ã‰clairage", "Espace barbecue", "Feux de camp"], roomTypes: ["Emplacement tente", "Tente Ã©quipÃ©e 2 pers.", "Tente Ã©quipÃ©e 4 pers."], checkIn: "12h00", checkOut: "11h00", rating: 4.0 },
    { id: "c2", name: "Camping Naturel de Fresco", location: "Fresco", stars: 0, priceFrom: 3000, priceTo: 10000, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80", phone: "+225 07 30 00 00 02", description: "Camping en pleine nature Ã  Fresco, l'une des plages les plus sauvages de CÃ´te d'Ivoire. IdÃ©al pour les amoureux de nature et d'aventure.", amenities: ["Plage sauvage", "Sanitaires", "Eau courante", "Espace cuisine", "Feux de camp", "PÃªche possible"], roomTypes: ["Emplacement tente", "Tente Ã©quipÃ©e 2 pers."], checkIn: "12h00", checkOut: "11h00", rating: 3.9 },
    { id: "c3", name: "Eco-Camp Grand-Lahou", location: "Grand-Lahou", stars: 0, priceFrom: 4000, priceTo: 12000, image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80", phone: "+225 07 30 00 00 03", description: "Ã‰co-camping au bord de la lagune de Grand-Lahou. Tentes sur pilotis, excursions en pirogue, observation des oiseaux, cuisine locale.", amenities: ["Tentes sur pilotis", "Vue lagune", "Excursions pirogue", "Observation oiseaux", "Cuisine locale", "Sanitaires"], roomTypes: ["Tente sur pilotis 2 pers.", "Tente sur pilotis 4 pers."], checkIn: "13h00", checkOut: "11h00", rating: 4.2 },
  ],
  "locations-courte-duree": [
    { id: "l1", name: "Appartement Vue Mer Assinie", location: "Assinie-Mafia", stars: 0, priceFrom: 35000, priceTo: 70000, image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80", phone: "+225 07 40 00 00 01", description: "Appartement moderne avec vue mer directe Ã  Assinie-Mafia. 2 chambres, salon, cuisine Ã©quipÃ©e, terrasse. IdÃ©al pour week-end ou vacances.", amenities: ["Vue mer", "Cuisine Ã©quipÃ©e", "Terrasse", "Wifi", "Climatisation", "Linge fourni", "Parking"], roomTypes: ["Appartement 2 chambres"], checkIn: "15h00", checkOut: "11h00", rating: 4.5 },
    { id: "l2", name: "Studio Bord de Plage Bassam", location: "Grand-Bassam", stars: 0, priceFrom: 20000, priceTo: 40000, image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80", phone: "+225 07 40 00 00 02", description: "Studio cosy Ã  2 min de la plage de Grand-Bassam. Tout Ã©quipÃ©, entrÃ©e indÃ©pendante, idÃ©al pour un sÃ©jour romantique ou solo.", amenities: ["Proche plage", "Cuisine Ã©quipÃ©e", "Wifi", "Climatisation", "TV", "Linge fourni"], roomTypes: ["Studio 1 chambre"], checkIn: "Flexible (code)", checkOut: "11h00", rating: 4.3 },
    { id: "l3", name: "Villa Familiale Jacqueville", location: "Jacqueville", stars: 0, priceFrom: 50000, priceTo: 90000, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80", phone: "+225 07 40 00 00 03", description: "Grande villa pour familles ou groupes Ã  Jacqueville. 4 chambres, piscine privÃ©e, jardin, barbecue. Ã€ 10 min de la plage.", amenities: ["Piscine privÃ©e", "Jardin", "Barbecue", "Cuisine Ã©quipÃ©e", "Wifi", "Climatisation", "Parking", "4 chambres"], roomTypes: ["Villa 4 chambres"], checkIn: "15h00", checkOut: "11h00", rating: 4.6 },
    { id: "l4", name: "Appartement San-PÃ©dro Centre", location: "San-PÃ©dro", stars: 0, priceFrom: 25000, priceTo: 50000, image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80", phone: "+225 07 40 00 00 04", description: "Appartement moderne au centre de San-PÃ©dro. 2 chambres, salon, cuisine Ã©quipÃ©e. Proche commerces, restaurants et plage.", amenities: ["Centre-ville", "Cuisine Ã©quipÃ©e", "Wifi", "Climatisation", "TV", "Parking", "Linge fourni"], roomTypes: ["Appartement 2 chambres"], checkIn: "Flexible (code)", checkOut: "11h00", rating: 4.1 },
  ],
};

const TYPE_META: Record<string, { title: string; subtitle: string; stars?: number; heroImage: string; description: string; priceRange: string }> = {
  "hotels-luxe":            { title: "HÃ´tels de Luxe",              subtitle: "4 Ã  5 Ã©toiles", stars: 5, heroImage: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1600&q=80", description: "L'excellence hÃ´teliÃ¨re sur le littoral ivoirien", priceRange: "65 000 â€” 150 000 FCFA / nuit" },
  "hotels-standards":       { title: "HÃ´tels Standards",            subtitle: "2 Ã  3 Ã©toiles", stars: 3, heroImage: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1600&q=80", description: "Confort et rapport qualitÃ©-prix sur la cÃ´te",    priceRange: "18 000 â€” 55 000 FCFA / nuit" },
  "residences":             { title: "RÃ©sidences MeublÃ©es",         subtitle: "Bord de mer",         heroImage: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1600&q=80", description: "L'intimitÃ© d'un chez-soi face Ã  l'ocÃ©an",       priceRange: "35 000 â€” 110 000 FCFA / nuit" },
  "auberges":               { title: "Auberges & GÃ®tes",            subtitle: "AuthenticitÃ© locale",  heroImage: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1600&q=80", description: "L'hÃ©bergement authentique au cÅ“ur de la nature", priceRange: "8 000 â€” 30 000 FCFA / nuit" },
  "campings":               { title: "Campings AmÃ©nagÃ©s",           subtitle: "Nature & aventure",    heroImage: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1600&q=80", description: "Dormir sous les Ã©toiles face Ã  l'ocÃ©an",        priceRange: "3 000 â€” 15 000 FCFA / nuit" },
  "locations-courte-duree": { title: "Locations Courte DurÃ©e",      subtitle: "Style Airbnb",         heroImage: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1600&q=80", description: "Votre logement privÃ© pour quelques nuits",      priceRange: "20 000 â€” 90 000 FCFA / nuit" },
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
          Ã€ partir de {hotel.priceFrom.toLocaleString()} FCFA
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

        {/* Ã‰quipements */}
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
            <span className="font-semibold text-[#0c4a6e]">{hotel.priceFrom.toLocaleString()} â€” {hotel.priceTo.toLocaleString()} FCFA</span>
            <span className="text-gray-400">/ nuit</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link href="/services/hebergement#chambres" className="flex-1 btn-primary justify-center text-xs py-2">
            RÃ©server <ArrowRight size={13} />
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
      <p className="text-gray-500">Type d hÃ©bergement introuvable.</p>
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
          <Link href="/services/hebergement" className="hover:text-[#0c4a6e] transition-colors">HÃ©bergement</Link>
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
            <ArrowLeft size={15} /> Retour aux hÃ©bergements
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
          <p className="text-white/80 mt-1">{meta.description} Â· <span className="text-[#c9a84c] font-semibold">{meta.priceRange}</span></p>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-6xl mx-auto px-4 py-10 sm:px-6 lg:px-8">

        {/* Compteur */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">
            <span className="font-bold text-[#0c4a6e] text-lg">{hotels.length}</span> Ã©tablissement{hotels.length > 1 ? "s" : ""} disponible{hotels.length > 1 ? "s" : ""}
          </p>
          <Link href="/services/hebergement" className="text-sm text-[#38bdf8] hover:underline font-medium flex items-center gap-1">
            <ArrowLeft size={13} /> Voir tous les types
          </Link>
        </div>

        {/* Grille des hÃ´tels */}
        {hotels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {hotels.map(h => <HotelCard key={h.id} hotel={h} />)}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-400">Aucun Ã©tablissement disponible pour le moment.</p>
          </div>
        )}

        {/* Autres types */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-[#0c4a6e] mb-4">Autres types d hÃ©bergement</h2>
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
            <p className="text-white/70 text-sm mt-1">Contactez-nous, nous trouvons l hÃ©bergement idÃ©al pour vous sur toute la cÃ´tiÃ¨re.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <a href="tel:+2250747722931" className="flex items-center gap-2 bg-white text-[#0c4a6e] font-bold text-sm px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
              <Phone size={15} /> Appeler
            </a>
            <Link href="/contact" className="flex items-center gap-2 bg-[#c9a84c] text-white font-bold text-sm px-4 py-2.5 rounded-xl hover:bg-[#b8973b] transition-colors">
              Nous Ã©crire <ArrowRight size={15} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}



