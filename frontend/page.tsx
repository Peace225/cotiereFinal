import { Suspense } from "react";
import { prisma } from "@/lib/prisma";

// =======================================================================
// 1. IMPORTS DES SECTIONS COMPOSABLES
// =======================================================================
import HeroSection from "../app/(frontend)/home/HeroSection";
import ResultatsRecherche from "../app/(frontend)/home/ResultatsRecherche";
import ServicesGridPremium from "../app/(frontend)/home/ServicesGrid"; 
import SectionGrid from "../app/(frontend)/home/SectionGrid"; 
import DestinationsGrid from "../app/(frontend)/home/DestinationsGrid";
import RestaurantCard from "../app/(frontend)/home/RestaurantCard";
import StudioCard from "../app/(frontend)/home/StudioCard";
import ActivitiesSection from "../app/(frontend)/home/ActivitiesSection";

export default async function Home() {
  let enVogue: any[] = [];
  let mieuxNotes: any[] = [];
  let weekEnd: any[] = [];
  let adoreParClients: any[] = [];
  let restaurantsPopulaires: any[] = [];
  let servicesStudio: any[] = [];

  try {
    // ✅ CORRECTION : Utilisation de rooms au pluriel
    [enVogue, mieuxNotes, weekEnd, adoreParClients, restaurantsPopulaires, servicesStudio] = await Promise.all([
      prisma.rooms.findMany({ where: { isFeatured: true }, take: 4 }),
      prisma.rooms.findMany({ orderBy: { rating: 'desc' }, take: 4 }),
      prisma.rooms.findMany({ where: { isWeekend: true }, take: 4 }),
      prisma.rooms.findMany({ where: { isPopular: true }, take: 4 }),
      prisma.villeContenu.findMany({ where: { categorie: "restaurant" }, take: 4 }),
      prisma.villeContenu.findMany({ where: { categorie: "studio" }, take: 4 }), 
    ]);
  } catch (error) {
    console.error("Erreur Prisma:", error);
  }

  // =====================================================================
  // 🚀 INJECTION DE DONNÉES DE TEST POUR FORCER L'AFFICHAGE DU STUDIO
  // (À supprimer quand tu auras mis de vrais services dans ta BDD)
  // =====================================================================
  if (servicesStudio.length === 0) {
    servicesStudio = [
      { id: "test-1", label: "Shooting Photo", description: "Séance photo premium en studio ou extérieur.", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80" },
      { id: "test-2", label: "Réalisation Vidéo", description: "Captation 4K et montage dynamique.", image: "https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?w=800&q=80" },
      { id: "test-3", label: "Prises Aériennes Drone", description: "Vues spectaculaires pour vos événements.", image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&q=80" },
      { id: "test-4", label: "Couverture Événementielle", description: "Immortalisez vos meilleurs moments.", image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80" }
    ];
  }

  return (
    <main className="min-h-screen relative bg-gray-50 flex flex-col overflow-hidden">
      
      {/* --- HERO & RECHERCHE --- */}
      <HeroSection />

      <Suspense fallback={
        <div id="resultats-section" className="flex flex-col items-center justify-center min-h-[40vh] py-20">
          <div className="w-12 h-12 border-4 border-[#003b95]/20 border-t-[#003b95] rounded-full animate-spin" />
        </div>
      }>
        <ResultatsRecherche />
      </Suspense>

      {/* --- GRILLE PREMIUM DES SERVICES STATIQUES --- */}
      <ServicesGridPremium />

      {/* --- SECTIONS DYNAMIQUES (Prisma) --- */}
      <div className="max-w-7xl mx-auto px-4 py-16 space-y-20 w-full">
            
        <DestinationsGrid />
        {/* 2. Ajoute la section ici */}
        <ActivitiesSection />
        
        <SectionGrid title="Les mieux notés" data={mieuxNotes} />
          
        <SectionGrid title="Offres week-end" data={weekEnd} />
        
        <SectionGrid title="Les hébergements que les clients adorent" data={adoreParClients} />

        {/* SECTION DES RESTAURANTS */}
        {restaurantsPopulaires.length > 0 && (
          <section className="w-full">
            <div className="mb-6 flex items-baseline justify-between">
              <h2 className="!text-[18px] md:!text-[20px] font-black text-slate-900 tracking-tight">
                Les meilleurs restaurants Côtièriennes
              </h2>
              <a href="/restaurants" className="text-sm font-bold text-[#c9a84c] hover:underline transition-colors">
                Voir tout
              </a>
            </div>

            <div className="flex overflow-x-auto gap-4 md:gap-5 pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {restaurantsPopulaires.map((resto) => (
                <RestaurantCard key={resto.id} restaurant={resto} />
              ))}
            </div>
          </section>
        )}
        

        {/* SECTION HBL STUDIO+ */}
        {servicesStudio.length > 0 && (
          <section className="w-full">
            <div className="mb-6 flex items-baseline justify-between">
              <h2 className="!text-[18px] md:!text-[20px] font-black text-slate-900 tracking-tight">
                HBL Studio+ : Expertise Audiovisuelle
              </h2>
              <a href="/studio" className="text-sm font-bold text-[#003b95] hover:underline transition-colors">
                Nos prestations
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {servicesStudio.map((service) => (
                <StudioCard key={service.id} service={service} />
              ))}
            </div>
          </section>
        )}

      </div>
    </main>
  );
}