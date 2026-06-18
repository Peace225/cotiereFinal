import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Star, Utensils, ChevronLeft, Info, Phone, Heart } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function RestaurantDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;

  const restaurant = await prisma.villeContenu.findUnique({
    where: { id: id }
  });

  if (!restaurant) notFound();

  const imageSrc = restaurant.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80";
  const note = restaurant.note || 4.5;
  const categorie = restaurant.categorie || "Gastronomie";
  
  // Récupération du numéro de téléphone (ajoute une valeur par défaut si vide en BDD)
  // Assure-toi que le champ 'telephone' existe dans ton schema Prisma, ou adapte le nom
  const numeroTelephone = (restaurant as any).telephone || "+22500000000"; 
  
  // Création de la requête pour Google Maps (Nom du restaurant + Ville)
  const mapQuery = encodeURIComponent(`${restaurant.nom} ${restaurant.ville}`);

  return (
    <div className="bg-[#f5f5f5] min-h-screen pb-20">
      
      {/* --- EN-TÊTE --- */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        {/* ... (Identique à avant) ... */}
        <div className="max-w-[1100px] mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center text-sm font-medium text-slate-600 hover:text-blue-600 transition">
            <ChevronLeft className="w-4 h-4 mr-1" /> Retour à l'accueil
          </Link>
          <button className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-red-500 transition">
            <Heart className="w-4 h-4" /> Sauvegarder
          </button>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-4 mt-6">
        
        {/* --- TITRE --- */}
        {/* ... (Identique à avant) ... */}
        <div className="mb-6 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[#c9a84c]/10 text-[#c9a84c] text-xs font-black uppercase tracking-wide px-2 py-1 rounded flex items-center gap-1">
                <Utensils className="w-3 h-3" /> {categorie}
              </span>
              <div className="flex items-center text-amber-500 bg-amber-50 px-2 py-1 rounded text-xs font-bold">
                <Star className="w-3 h-3 fill-current mr-1" /> {note}
              </div>
            </div>
            <h1 className="!text-[20px] md:!text-[25px] font-bold text-slate-900">{restaurant.nom}</h1>
            <p className="text-slate-500 mt-2 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#003b95]" />
              {restaurant.adresse || "Adresse non communiquée"}, {restaurant.ville}
            </p>
          </div>
        </div>

        {/* --- IMAGE --- */}
        <div className="w-full h-[40vh] md:h-[50vh] rounded-2xl overflow-hidden mb-8 shadow-sm relative group">
          <img src={imageSrc} alt={restaurant.nom} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-8">
            <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h2 className="!text-[18px] md:!text-[20px] font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-[#c9a84c]" /> A propos de ce restaurant
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                {restaurant.description || `Découvrez une expérience culinaire unique au cœur de ${restaurant.ville}. Ce restaurant vous propose des plats raffinés dans un cadre exceptionnel, parfait pour un dîner en amoureux, un repas d'affaires ou une sortie entre amis.`}
              </p>
            </section>

            {/* --- CARTE GOOGLE MAPS INTÉGRÉE --- */}
            <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h2 className="!text-[15px] md:!text-[18px] font-bold text-slate-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#c9a84c]" /> Emplacement
              </h2>
              <div className="w-full h-64 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 relative">
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ border: 0 }}
                  src={`https://maps.google.com/maps?q=${mapQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  allowFullScreen
                  title="Carte du restaurant"
                ></iframe>
              </div>
              <p className="mt-4 text-sm text-slate-600 font-medium">
                📍 {restaurant.adresse}, {restaurant.ville}
              </p>
            </section>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg sticky top-24">
              <div className="pb-4 border-b border-gray-100 mb-4">
                <p className="text-sm text-slate-500 uppercase tracking-wide font-medium mb-1">Fourchette de prix</p>
                <div className="text-2xl font-black text-slate-900">
                  {restaurant.prix || "Sur devis"}
                </div>
              </div>

              <ul className="space-y-3 mb-6 text-sm text-slate-600">
                <li className="flex items-center gap-2"><CheckIcon /> Réservation recommandée</li>
                <li className="flex items-center gap-2"><CheckIcon /> Service sur place</li>
                <li className="flex items-center gap-2"><CheckIcon /> Adapté aux groupes</li>
              </ul>

              {/* --- BOUTON DE RÉSERVATION (Lien d'appel) --- */}
              <a 
                href={`tel:${numeroTelephone}`}
                className="w-full bg-[#003b95] hover:bg-[#002b6b] text-white font-bold py-3 rounded-xl transition duration-200 flex items-center justify-center gap-2 mb-3"
              >
                <Phone className="w-4 h-4" /> Appeler pour réserver
              </a>
              
              {/* Optionnel : Bouton WhatsApp */}
              <a 
                href={`https://wa.me/${numeroTelephone.replace(/\D/g,'')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#1ebd5b] text-white font-bold py-3 rounded-xl transition duration-200 flex items-center justify-center gap-2 mb-3"
              >
                Discuter sur WhatsApp
              </a>

              <p className="text-center text-sm text-slate-400">
                Vous serez mis en relation directe avec l'établissement.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-[#008009]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
  );
}