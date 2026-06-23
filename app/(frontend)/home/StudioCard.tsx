import Link from "next/link";
import { PlayCircle, Video, Camera } from "lucide-react";

export default function StudioCard({ service }: { service: any }) {
  // Sécurité anti-crash
  if (!service) return null;

  // Fallbacks sécurisés
  const imageSrc = service.image || "/Images/hbl.png";
  const title = service.label || "Service Studio";
  const desc = service.description || "Découvrez notre expertise audiovisuelle.";
  const link = service.id ? `/services/studio/${service.id}` : "/services/studio";

  // Sélection dynamique de l'icône selon le nom du service (ex: "Shooting Photo" affichera Camera)
  const labelLower = title.toLowerCase();
  const Icon = labelLower.includes("photo") || labelLower.includes("shoot") ? Camera 
             : labelLower.includes("vidéo") || labelLower.includes("stream") ? Video 
             : PlayCircle;

  return (
    <Link 
      href={link} 
      className="group relative block h-72 w-full overflow-hidden rounded-2xl bg-slate-900 shadow-md hover:shadow-2xl hover:shadow-blue-900/20 transition-all duration-500 border border-slate-800"
    >
      {/* --- IMAGE DE FOND --- */}
      <img 
        src={imageSrc} 
        alt={title} 
        className="absolute inset-0 h-full w-full object-cover opacity-60 transition-transform duration-700 ease-out group-hover:scale-110 group-hover:opacity-80" 
      />
      
      {/* --- DÉGRADÉ DE LISIBILITÉ --- */}
      {/* Ce gradient garantit que le texte blanc sera 100% lisible, même sur une image très lumineuse */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* --- CONTENU ANIMÉ --- */}
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        
        {/* Badge animé */}
        <div className="mb-3 flex items-center gap-2 text-blue-400 group-hover:text-blue-300 transition-colors transform translate-y-1 group-hover:translate-y-0 duration-500">
          <Icon size={20} className="drop-shadow-md" />
          <span className="text-[10px] font-black uppercase tracking-widest drop-shadow-md">
            HBL Studio+
          </span>
        </div>
        
        {/* Titre */}
        <h3 className="text-2xl font-black text-white leading-tight drop-shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 delay-75">
          {title}
        </h3>
        
        {/* Description : Cachée par défaut, elle apparaît en glissant vers le haut au survol */}
        <p className="mt-2 text-sm text-slate-300 line-clamp-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
          {desc}
        </p>

      </div>
    </Link>
  );
}