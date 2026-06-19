import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Star, MapPin, Heart, Share2, Wifi, Car, Coffee, Waves, Wind, Tv, Check, MessageCircle } from "lucide-react";

export default async function PageDetails({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}) {
  const { id } = await params;

  // ✅ CORRIGÉ : Appel de prisma.rooms au pluriel
  let hotel = await prisma.rooms.findUnique({ where: { slug: id } });
  if (!hotel) hotel = await prisma.rooms.findUnique({ where: { id } });
  if (!hotel) notFound();

  const pointsForts = hotel.amenities?.length ? hotel.amenities : [
    "Wi-Fi gratuit", "Parking", "Climatisation", "Petit-déjeuner", "Piscine", "Spa"
  ];

  const amenityIcons: Record<string, any> = {
    "Wi-Fi": Wifi, "Parking": Car, "Petit-déjeuner": Coffee,
    "Piscine": Waves, "Climatisation": Wind, "Télévision": Tv
  };

  // Default values for calculation
  const price = (hotel as any).pricePerNight || 0;
  const nights = 11; // Hardcoded for display as in the original, usually dynamic
  const serviceFee = 45000;
  const total = (price * nights) + serviceFee;
  
  // Replace with actual contact number from DB if available: (hotel as any).telephone || "+22500000000"
  const contactNumber = "+22500000000"; 
  const whatsappMessage = encodeURIComponent(`Bonjour, je souhaite réserver le logement "${(hotel as any).name}" à ${(hotel as any).city} pour un total estimé de ${total.toLocaleString()} XOF.`);

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-[1120px] mx-auto px-6 py-4 text-[13px] text-gray-500">
        <Link href="/" className="hover:underline">Accueil</Link>
        <span className="mx-2">›</span>
        <Link href="/recherche" className="hover:underline">Hôtels</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-900 font-medium">{(hotel as any).name}</span>
      </div>

      <div className="max-w-[1120px] mx-auto px-6 pb-24">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
          <div>
            <h1 className="!text-[20px] md:!text-[25px] font-semibold text-gray-900 tracking-tight leading-tight">{(hotel as any).name}</h1>
            <div className="flex items-center gap-3 mt-2 text-[14px] font-medium text-gray-800">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-black text-black" />
                <span>{(hotel as any).rating?.toFixed(1) || "4.8"}</span>
              </div>
              <span className="text-gray-300">·</span>
              <button className="flex items-center gap-1.5 hover:underline decoration-gray-400 underline-offset-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                {(hotel as any).quartier}, {(hotel as any).city}
              </button>
            </div>
          </div>
          <div className="flex gap-3 text-[14px] font-medium">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition">
              <Share2 className="w-4 h-4" /> Partager
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition">
              <Heart className="w-4 h-4" /> Enregistrer
            </button>
          </div>
        </div>

        {/* Galerie Premium */}
        <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[400px] md:h-[480px] rounded-2xl overflow-hidden mb-10">
          <div className="col-span-2 row-span-2 relative group cursor-pointer">
            <img src={(hotel as any).images?.[0] || "/placeholder.jpg"} alt="Vue principale" className="w-full h-full object-cover group-hover:scale-[1.02] transition duration-500" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition duration-300"></div>
          </div>
          <div className="relative group cursor-pointer">
            <img src={(hotel as any).images?.[1] || (hotel as any).images?.[0]} alt="Vue" className="w-full h-full object-cover group-hover:scale-[1.02] transition duration-500" />
          </div>
          <div className="relative group cursor-pointer">
            <img src={(hotel as any).images?.[2] || (hotel as any).images?.[0]} alt="Vue" className="w-full h-full object-cover group-hover:scale-[1.02] transition duration-500" />
          </div>
          <div className="relative group cursor-pointer">
            <img src={(hotel as any).images?.[3] || (hotel as any).images?.[0]} alt="Vue" className="w-full h-full object-cover group-hover:scale-[1.02] transition duration-500" />
          </div>
          <div className="relative group cursor-pointer">
            <img src={(hotel as any).images?.[4] || (hotel as any).images?.[0]} alt="Vue" className="w-full h-full object-cover brightness-[0.85] group-hover:brightness-100 transition duration-500" />
            <div className="absolute inset-0 flex items-center justify-center text-white font-semibold text-lg drop-shadow-md">
              Voir les {(hotel as any).images?.length || 12} photos
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 lg:gap-20">
          
          {/* Colonne Principale */}
          <div className="lg:col-span-2">
            
            {/* Host Section */}
            <div className="flex justify-between items-start pb-8 border-b border-gray-200">
              <div>
                <h2 className="!text-[18px] md:!text-[20px] font-semibold text-gray-900">Logement entier · {(hotel as any).city}</h2>
                <p className="text-gray-600 mt-1 text-base">4 voyageurs · 2 chambres · 2 lits · 1 salle de bain</p>
              </div>
              <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" className="w-14 h-14 rounded-full border border-gray-200" alt="Hôte" />
            </div>

            {/* Points forts */}
            <div className="py-8 border-b border-gray-200 space-y-6">
              {[
                { icon: Star, title: "Coup de cœur voyageurs", desc: "L'un des logements les plus appréciés" },
                { icon: MapPin, title: "Emplacement idéal", desc: "90% des voyageurs ont adoré l'emplacement" },
                { icon: Check, title: "Annulation gratuite", desc: "Remboursement intégral avant le 15 juil." }
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <item.icon className="w-6 h-6 mt-0.5 text-gray-800" />
                  <div>
                    <div className="font-semibold text-gray-900">{item.title}</div>
                    <div className="text-[15px] text-gray-600 mt-0.5">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="py-8 border-b border-gray-200">
              <p className="text-sm leading-[1.6] text-gray-700 whitespace-pre-line">
                {(hotel as any).description || "Un hébergement d'exception offrant tout le confort moderne dans un cadre authentique."}
              </p>
              <button className="mt-4 font-semibold flex items-center gap-1 underline underline-offset-2 text-gray-900">
                En savoir plus
              </button>
            </div>

            {/* Équipements */}
            <div className="py-8 border-b border-gray-200">
              <h3 className="!text-[15px] md:!text-[18px] font-semibold mb-6 text-gray-900">Ce que propose ce logement</h3>
              <div className="grid grid-cols-2 gap-y-5 gap-x-4">
                {pointsForts.slice(0, 8).map((point) => {
                  const Icon = Object.entries(amenityIcons).find(([k]) => point.includes(k))?.[1] || Check;
                  return (
                    <div key={point} className="flex items-center gap-4">
                      <Icon className="w-6 h-6 text-gray-700 stroke-[1.5]" />
                      <span className="text-[16px] text-gray-700">{point}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Carte réservation sticky */}
          <div className="lg:col-span-1 relative">
            <div className="sticky top-28 border border-gray-200 rounded-2xl p-6 shadow-[0_6px_16px_rgba(0,0,0,0.12)] bg-white">
              
              <div className="flex justify-between items-baseline mb-6">
                <div>
                  <span className="text-[22px] font-semibold tracking-tight text-gray-900">
                    {price.toLocaleString()} XOF
                  </span>
                  <span className="text-gray-600 text-[15px]"> / nuit</span>
                </div>
                <div className="flex items-center gap-1 text-[14px]">
                  <Star className="w-3.5 h-3.5 fill-black text-black" />
                  <span className="font-semibold">{(hotel as any).rating?.toFixed(1) || "4.8"}</span>
                </div>
              </div>

              {/* Formulaire Dates / Voyageurs */}
              <div className="border border-gray-400 rounded-xl overflow-hidden mb-4">
                <div className="grid grid-cols-2 divide-x divide-gray-400">
                  <button className="p-3 text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-inset">
                    <div className="text-[10px] font-bold uppercase text-gray-800">Arrivée</div>
                    <div className="text-[14px] text-gray-600 mt-0.5">20/06/2026</div>
                  </button>
                  <button className="p-3 text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-inset">
                    <div className="text-[10px] font-bold uppercase text-gray-800">Départ</div>
                    <div className="text-[14px] text-gray-600 mt-0.5">01/07/2026</div>
                  </button>
                </div>
                <button className="w-full p-3 border-t border-gray-400 text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-inset">
                  <div className="text-[10px] font-bold uppercase text-gray-800">Voyageurs</div>
                  <div className="text-[14px] text-gray-600 mt-0.5">2 adultes</div>
                </button>
              </div>

              {/* Functional Reservation Button via WhatsApp */}
              <a 
                href={`https://wa.me/${contactNumber.replace(/\D/g,'')}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gradient-to-r from-[#E61E4D] to-[#D70466] text-white py-3.5 rounded-lg font-bold text-[16px] hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Réserver
              </a>
              <p className="text-center text-sm text-gray-500 mt-3">Aucun montant débité pour l'instant</p>

              {/* Calculation Summary */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-4 text-[15px] text-gray-700">
                <div className="flex justify-between">
                  <span className="underline decoration-gray-300 underline-offset-2">{price.toLocaleString()} XOF x {nights} nuits</span>
                  <span>{(price * nights).toLocaleString()} XOF</span>
                </div>
                <div className="flex justify-between">
                  <span className="underline decoration-gray-300 underline-offset-2">Frais de service</span>
                  <span>{serviceFee.toLocaleString()} XOF</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 pt-4 border-t border-gray-200 text-[16px]">
                  <span>Total</span>
                  <span>{total.toLocaleString()} XOF</span>
                </div>
              </div>

            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}