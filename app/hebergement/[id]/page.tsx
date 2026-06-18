import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Star, BedDouble, ChevronLeft, Info, Heart, Wifi, Coffee, CheckCircle } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function HebergementDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;

  // 1. CORRECTION CRUCIALE : Recherche par ID ou par SLUG
  const room = await prisma.room.findFirst({
    where: {
      OR: [
        { slug: id },
        { id: id }
      ]
    }
  });

  if (!room) notFound();

  // 2. Fallbacks et sécurités
  const imageSrc = room.images && room.images.length > 0 
    ? room.images[0] 
    : "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80";
    
  const note = room.rating || 8.5;
  const prix = room.pricePerNight || 0;
  
  // Requête Google Maps formatée
  const mapQuery = encodeURIComponent(`${room.name} ${room.city}`);

  return (
    <div className="bg-[#f0f2f5] min-h-screen pb-20">
      
      {/* --- EN-TÊTE DE NAVIGATION --- */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-[1200px] mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center text-sm font-medium text-slate-600 hover:text-[#003b95] transition">
            <ChevronLeft className="w-4 h-4 mr-1" /> Retour
          </Link>
          <button className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-red-500 transition">
            <Heart className="w-4 h-4" /> Sauvegarder
          </button>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 mt-8">
        
        {/* --- TITRE ET BADGES --- */}
        <div className="mb-6 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md flex items-center gap-1.5">
                <BedDouble className="w-3.5 h-3.5" /> {room.type || "Hébergement"}
              </span>
              <div className="flex items-center text-white bg-[#003b95] px-2 py-1 rounded-md text-xs font-bold shadow-sm">
                <Star className="w-3 h-3 fill-white mr-1" /> {note}
              </div>
            </div>
            <h1 className="!text-[20px] md:!text-[25px] font-bold text-slate-900 tracking-tight">{room.name}</h1>
            <p className="text-sm text-slate-500 mt-2 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#003b95]" />
              {room.quartier ? `${room.quartier}, ` : ""}{room.city}
            </p>
          </div>
        </div>

        {/* --- IMAGE PRINCIPALE --- */}
        <div className="w-full h-[45vh] md:h-[55vh] rounded-2xl overflow-hidden mb-8 shadow-sm relative group bg-slate-100">
          <img 
            src={imageSrc} 
            alt={room.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
          />
        </div>

        {/* --- LAYOUT CONTENU & ENCART PRIX --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Colonne Principale (Gauche) */}
          <div className="lg:col-span-8 space-y-8">
            
            <section className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm">
              <h2 className="!text-[18px] md:!text-[20px] font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-[#003b95]" /> A propos de cet hébergement
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm">
                {room.description || `Profitez d'un séjour exceptionnel au cœur de ${room.city}. Cet établissement offre tout le confort nécessaire pour un séjour inoubliable, alliant élégance et équipements modernes pour répondre à toutes vos attentes.`}
              </p>
            </section>

            {/* Carte Google Maps */}
            <section className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm">
              <h2 className="!text-[18px] md:!text-[20px] font-bold text-slate-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#003b95]" /> Emplacement
              </h2>
              <div className="w-full h-[300px] bg-slate-100 rounded-xl overflow-hidden border border-slate-200 relative">
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ border: 0 }}
                  src={`https://maps.google.com/maps?q=${mapQuery}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                  allowFullScreen
                  title="Carte de l'hébergement"
                ></iframe>
              </div>
            </section>
          </div>

          {/* Colonne Latérale : Réservation (Droite) */}
          <div className="lg:col-span-4">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg sticky top-24">
              
              <div className="pb-5 border-b border-gray-100 mb-5">
                <p className="text-sm text-slate-500 font-medium mb-1">Prix par nuit</p>
                <div className="flex items-end gap-1.5">
                  <div className="text-3xl font-black text-slate-900 leading-none">
                    {prix.toLocaleString('fr-FR')}
                  </div>
                  <span className="text-sm font-bold text-slate-600 mb-0.5">XOF</span>
                </div>
              </div>

              <ul className="space-y-3.5 mb-6 text-[13px] text-slate-600 font-medium">
                <li className="flex items-center gap-3 text-[#008009]">
                  <CheckCircle className="w-4 h-4" /> Annulation gratuite
                </li>
                <li className="flex items-center gap-3">
                  <Wifi className="w-4 h-4 text-slate-400" /> Wi-Fi haut débit inclus
                </li>
                <li className="flex items-center gap-3">
                  <Coffee className="w-4 h-4 text-slate-400" /> Petit-déjeuner disponible
                </li>
              </ul>

              <button className="w-full bg-[#006ce4] hover:bg-[#0057b8] text-white font-bold py-3.5 rounded-xl transition-colors duration-200 mb-3 shadow-md">
                Vérifier les disponibilités
              </button>
              
              <p className="text-center text-[11px] text-slate-500 font-medium">
                Aucun montant ne vous sera facturé pour le moment.
              </p>
              
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}