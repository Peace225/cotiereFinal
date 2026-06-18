import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Camera, Video, PlayCircle } from "lucide-react";

export default async function StudioDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;

  // Récupération du service studio par son ID unique
  const service = await prisma.villeContenu.findUnique({
    where: {
      id: id
    }
  });

  // Si aucun service n'est trouvé, on affiche la page 404 proprement
  if (!service) notFound();

  // Détermination dynamique de l'icône selon le nom du service
  const labelLower = (service.nom || "").toLowerCase();
  const Icon = labelLower.includes("photo") || labelLower.includes("shoot") ? Camera 
             : labelLower.includes("vidéo") || labelLower.includes("stream") ? Video 
             : PlayCircle;

  // Préparation du message pour le lien WhatsApp
  const whatsappMessage = `Bonjour, je suis intéressé par votre service : ${service.nom}. Pourriez-vous m'envoyer un devis ?`;
  const whatsappLink = `https://wa.me/2250704281719?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Header Retour */}
      <div className="bg-white border-b border-slate-200 p-4 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="flex items-center text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">
            <ChevronLeft className="w-5 h-5 mr-1" /> Retour à l'accueil
          </Link>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 mt-10">
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-slate-100">
          {/* Image */}
          <div className="h-80 w-full bg-slate-900 relative">
            <img 
              src={service.image || "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&q=80"} 
              alt={service.nom || "Service Studio"} 
              className="w-full h-full object-cover opacity-80" 
            />
            <div className="absolute bottom-0 left-0 p-8 bg-gradient-to-t from-black/80 to-transparent w-full">
              <h1 className="!text-[20px] md:!text-[25px] font-black text-white">{service.nom}</h1>
              <p className="text-blue-300 font-bold uppercase tracking-widest text-sm mt-2">HBL Studio+</p>
            </div>
          </div>

          {/* Contenu */}
          <div className="p-8 md:p-12">
            <h2 className="!text-[18px] md:!text-[20px] font-bold text-slate-900 mb-4">À propos de ce service</h2>
            <p className="text-slate-600 leading-relaxed text-sm mb-8">
              {service.description || "Expertise audiovisuelle de haute qualité pour vos projets les plus ambitieux."}
            </p>

            <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="p-4 bg-white rounded-full shadow-sm text-blue-600">
                <Icon className="w-8 h-8" />
              </div>
              <div>
                <h3 className="!text-[15px] md:!text-[18px] font-bold text-slate-900">Besoin d'informations ?</h3>
                <p className="text-slate-500 text-sm">Contactez-nous pour un devis personnalisé.</p>
              </div>
              
              {/* Bouton WhatsApp Dynamique */}
              <a 
                href={whatsappLink}
                target="_blank" 
                rel="noopener noreferrer"
                className="ml-auto bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-[#25D366] transition shadow-md flex items-center"
              >
                Demander un devis
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}