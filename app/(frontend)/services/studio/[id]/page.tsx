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

  let service = null;

  // 1. LOGIQUE DE TEST : Si l'URL COMMENCE par "test-", on génère de fausses données
  if (id.startsWith("test-")) {
    service = {
      id: id,
      nom: `Studio Photo Premium (${id.toUpperCase()})`,
      description: "Ceci est une page de test pour valider l'affichage de l'interface et de la Navbar. Une fois vos vrais studios ajoutés dans la base de données, ils s'afficheront ici automatiquement avec leur propre design.",
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&q=80"
    };
  } else {
    // 2. LOGIQUE DE PRODUCTION : Récupération du vrai service studio par son ID unique dans la base de données
    service = await prisma.villeContenu.findUnique({
      where: {
        id: id
      }
    });
  }

  // Si aucun service n'est trouvé (ni test, ni dans la base), on affiche la page 404
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
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 p-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors bg-slate-100/50 px-4 py-2 rounded-full">
            <ChevronLeft className="w-5 h-5 mr-1" /> Retour aux services
          </Link>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 mt-10">
        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-100">
          {/* Image */}
          <div className="h-80 md:h-96 w-full bg-slate-900 relative group">
            <img 
              src={service.image || "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&q=80"} 
              alt={service.nom || "Service Studio"} 
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" 
            />
            <div className="absolute bottom-0 left-0 p-8 md:p-12 bg-gradient-to-t from-black/90 via-black/40 to-transparent w-full">
              <h1 className="!text-[20px] md:!text-[25px] font-black text-white mb-2">{service.nom}</h1>
              <span className="inline-block bg-blue-600/20 backdrop-blur-md border border-blue-400/30 text-blue-300 font-bold uppercase tracking-widest text-xs px-3 py-1 rounded-full">
                HBL Studio+
              </span>
            </div>
          </div>

          {/* Contenu */}
          <div className="p-8 md:p-12">
            <h2 className="!text-[20px] md:!text-[25px] font-black text-slate-900 mb-4">A propos de ce service</h2>
            <p className="text-slate-600 leading-relaxed text-base md:text-sm mb-10">
              {service.description || "Expertise audiovisuelle de haute qualité pour vos projets les plus ambitieux."}
            </p>

            <div className="flex flex-col md:flex-row items-center gap-6 p-6 md:p-8 bg-slate-50 rounded-2xl border border-slate-100 transition hover:border-blue-100 hover:shadow-md">
              <div className="p-4 bg-white rounded-full shadow-sm text-blue-600 shrink-0">
                <Icon className="w-8 h-8" />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-lg md:text-xl font-black text-slate-900">Besoin d'informations ?</h3>
                <p className="text-slate-500 text-sm mt-1">Contactez-nous directement pour obtenir un devis personnalisé pour ce service.</p>
              </div>
              
              {/* Bouton WhatsApp Dynamique */}
              <a 
                href={whatsappLink}
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full md:w-auto md:ml-auto bg-[#003b95] text-white px-8 py-4 rounded-xl font-black hover:bg-blue-800 transition shadow-lg shadow-blue-900/20 flex justify-center items-center gap-2 whitespace-nowrap"
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