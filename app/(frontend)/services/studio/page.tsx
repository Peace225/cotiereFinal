"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Play, ArrowRight, Image as ImageIcon, MessageCircle } from "lucide-react";

// Remplace par le numéro WhatsApp de réservation
const STUDIO_WHATSAPP = "2250700000000";

// --- Type correspondant à votre base de données ---
type DBService = { 
  id: string; 
  label: string; 
  description: string; 
  image: string; 
  is_active: boolean 
};

export default function SejoursPage() {
  // 1. Déclaration de l'état pour stocker les services de la base de données
  const [services, setServices] = useState<DBService[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Récupération des données au chargement de la page
  useEffect(() => {
    fetch("/api/studio/services")
      .then(res => res.json())
      .then(data => {
        // On ne garde que les services qui sont actifs (is_active !== false)
        const activeServices = (data.data || []).filter((s: DBService) => s.is_active !== false);
        setServices(activeServices);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Erreur lors du chargement des services:", err);
        setIsLoading(false);
      });
  }, []);

  const handleBooking = () => {
    const message = `*NOUVELLE DEMANDE - SÉJOURS* 🎥\n\nBonjour, je souhaite avoir plus d'informations sur vos services et réserver.`;
    window.open(`https://wa.me/${STUDIO_WHATSAPP}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      
      {/* HEADER / HERO SECTION */}
      <div className="max-w-7xl mx-auto px-4 mb-12 md:mb-16">
        <div className="relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] bg-slate-900 text-white shadow-2xl h-[420px] md:h-[500px] flex items-center px-6 md:px-12 lg:px-16">
          
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?w=1200&q=80" 
              alt="Studio de production" 
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
          </div>

          <div className="relative z-10 max-w-3xl w-full">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-4 md:mb-6">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <span className="text-[10px] font-bold tracking-widest uppercase">HBL Studio+</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black mb-4 md:mb-6 leading-tight">
              L'art de capturer <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-[#003b95]">l'instant parfait.</span>
            </h1>
            
            <p className="text-sm md:text-lg text-slate-300 mb-6 md:mb-8 max-w-xl leading-relaxed line-clamp-4 md:line-clamp-none">
              Photographie, réalisation vidéo, drone et création de contenu digital. Donnez vie à votre vision avec notre équipe d'experts et notre matériel ultra-premium.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button 
                onClick={handleBooking}
                className="w-full sm:w-auto bg-[#003b95] hover:bg-blue-700 text-white px-6 py-3.5 md:px-8 md:py-4 rounded-xl font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30 text-sm md:text-base"
              >
                Réserver une session <ArrowRight size={18} />
              </button>
              <button className="w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-6 py-3.5 md:px-8 md:py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm md:text-base border border-white/10">
                <Play size={18} /> Voir notre Reel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION SERVICES DYNAMIQUES */}
      <div className="max-w-7xl mx-auto px-4 mb-16 md:mb-20">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mb-3 md:mb-4">Nos Expertises</h2>
          <p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto px-2 leading-relaxed">
            Un accompagnement complet sur mesure pour les particuliers, les entreprises et les créateurs de contenu.
          </p>
        </div>

        {/* 3. Affichage conditionnel pendant le chargement */}
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#003b95]"></div>
          </div>
        ) : services.length === 0 ? (
          <p className="text-center text-slate-500">Aucune prestation disponible pour le moment.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 4. Boucle sur les données de la Base de Données */}
            {services.map((service) => (
              <div key={service.id} className="bg-white p-4 md:p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between">
                <div>
                  {/* Utilisation de l'image ajoutée par l'admin */}
                  <div className="w-full h-40 md:h-48 bg-slate-100 rounded-2xl overflow-hidden mb-5 relative shrink-0">
                    <img 
                      src={service.image} 
                      alt={service.label}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                  </div>
                  
                  {/* Titre et description dynamiques */}
                  <h3 className="text-lg font-black text-slate-900 mb-2">{service.label}</h3>
                  <p className="text-slate-500 text-sm mb-6 leading-relaxed line-clamp-3">
                    {service.description}
                  </p>
                </div>
                
                {/* Le prix a été remplacé par un bouton d'action puisqu'il n'y a pas de prix en base */}
                <div className="pt-4 border-t border-slate-50 mt-auto">
                  <button onClick={handleBooking} className="text-[12px] font-black text-[#003b95] uppercase tracking-wider flex items-center gap-1 group-hover:gap-2 transition-all block w-full text-left">
                    Demander un devis <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION PORTFOLIO / GALERIE PREVIEW (Conservée telle quelle) */}
      <div className="max-w-7xl mx-auto px-4 mb-16 md:mb-20">
        <div className="flex justify-between items-end mb-6 md:mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1 md:mb-2">Dernières Réalisations</h2>
            <p className="text-slate-500 text-xs md:text-base">Un aperçu de notre savoir-faire.</p>
          </div>
          <button className="hidden md:flex text-[#003b95] font-bold items-center gap-1 hover:underline text-sm shrink-0">
            Voir la galerie <ArrowRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="h-48 sm:h-56 md:h-64 rounded-2xl md:rounded-3xl overflow-hidden group relative">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Portfolio 1" />
            <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors"></div>
          </div>
          <div className="h-48 sm:h-56 md:h-64 rounded-2xl md:rounded-3xl overflow-hidden group relative md:mt-8">
            <img src="https://images.unsplash.com/photo-1551882547-ff40c0d13966?w=500&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Portfolio 2" />
            <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors"></div>
          </div>
          <div className="h-48 sm:h-56 md:h-64 rounded-2xl md:rounded-3xl overflow-hidden group relative">
            <img src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=500&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Portfolio 3" />
            <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors"></div>
          </div>
          <div className="h-48 sm:h-56 md:h-64 rounded-2xl md:rounded-3xl overflow-hidden group relative md:mt-8">
            <img src="https://images.unsplash.com/photo-1601662528567-526cd06f6582?w=500&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Portfolio 4" />
            <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors"></div>
          </div>
        </div>
        <button className="flex md:hidden w-full text-[#003b95] font-black items-center justify-center gap-1 bg-white border border-blue-100 py-3.5 rounded-xl mt-6 text-xs shadow-sm">
          Voir la galerie <ArrowRight size={14} />
        </button>
      </div>

      {/* BANNIÈRE CALL TO ACTION */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-[#003b95] rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-16 text-center text-white relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 opacity-10 hidden sm:block">
            <ImageIcon size={400} className="transform translate-x-32 -translate-y-32" />
          </div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black mb-4 md:mb-6 leading-tight">Prêt à sublimer votre image ?</h2>
            <p className="text-white/80 mb-6 md:mb-8 text-sm md:text-lg leading-relaxed px-2">
              Contactez-nous dès aujourd'hui pour discuter de votre projet et obtenir un devis personnalisé.
            </p>
            <button 
              onClick={handleBooking}
              className="w-full sm:w-auto bg-white text-[#003b95] px-8 py-3.5 md:px-10 md:py-4 rounded-xl font-black text-sm md:text-lg hover:bg-slate-50 transition-colors shadow-xl flex items-center justify-center gap-2 mx-auto"
            >
              <MessageCircle size={20} /> Contacter le Studio
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}