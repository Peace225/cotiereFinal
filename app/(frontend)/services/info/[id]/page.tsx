import { ArrowRight, ChevronLeft, Calendar } from "lucide-react";
import Link from "next/link";

const actualites: Record<string, {
  titre: string; date: string; image: string; categorie: string; contenu: string;
}> = {
  "grand-bassam-patrimoine": { titre: "Grand-Bassam : le patrimoine UNESCO à l'honneur", date: "Avril 2026", image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80", categorie: "Patrimoine", contenu: "Grand-Bassam, première capitale de la Côte d'Ivoire, continue de rayonner sur la scène internationale grâce à son classement au patrimoine mondial de l'UNESCO. La ville historique attire chaque année des milliers de visiteurs venus découvrir son architecture coloniale unique, ses musées et ses plages. Les autorités locales et le gouvernement ivoirien ont lancé un vaste programme de restauration des bâtiments historiques du Quartier France, afin de préserver ce joyau culturel pour les générations futures. CÔTIÈRE INFO+ vous invite à découvrir cette destination exceptionnelle à travers nos excursions guidées." },
  "tourisme-saison-record": { titre: "Tourisme littoral : une saison record attendue", date: "Mars 2026", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80", categorie: "Tourisme", contenu: "Les professionnels du tourisme sur le littoral ivoirien s'attendent à une saison 2026 exceptionnelle. Après plusieurs années de reprise post-pandémie, les réservations dans les hôtels et résidences de Grand-Bassam, Assinie et Jacqueville affichent une hausse de 35% par rapport à 2025. Cette tendance positive est portée par le développement des infrastructures touristiques, la promotion internationale de la destination Côte d'Ivoire et l'essor du tourisme intérieur. CÔTIÈRE accompagne cette dynamique en proposant des excursions et séjours sur mesure pour découvrir les plus belles destinations du littoral." },
  "pecheurs-littoral": { titre: "Les pêcheurs du littoral à l'honneur", date: "Mars 2026", image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80", categorie: "Culture", contenu: "Une cérémonie de reconnaissance a été organisée à Grand-Lahou pour honorer les pêcheurs artisanaux du littoral ivoirien. Ces gardiens de la mer, dont le savoir-faire ancestral se transmet de génération en génération, jouent un rôle crucial dans l'économie locale et la préservation des traditions maritimes. L'événement a réuni plus de 500 pêcheurs venus de toutes les villes côtières, de Tabou à Aboisso. CÔTIÈRE INFO+ a assuré la couverture complète de cet événement culturel majeur." },
  "developpement-economique": { titre: "Développement économique de la Côtière ivoirienne", date: "Février 2026", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80", categorie: "Économie", contenu: "Le littoral ivoirien connaît une dynamique économique sans précédent. De nouveaux investissements dans les infrastructures portuaires, hôtelières et touristiques transforment le visage des villes côtières. San-Pédro, deuxième port de Côte d'Ivoire, voit ses capacités doubler avec la construction d'un nouveau terminal. Grand-Bassam accueille de nouveaux hôtels et résidences de luxe. Cette croissance crée des milliers d'emplois et améliore le niveau de vie des populations locales. CÔTIÈRE accompagne ce développement en connectant les acteurs économiques du littoral." },
  "festival-musique-2026": { titre: "Festival de musique du littoral 2026", date: "Février 2026", image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80", categorie: "Culture", contenu: "Le Festival de Musique du Littoral 2026 s'annonce comme l'événement musical de l'année en Côte d'Ivoire. Prévu du 14 au 16 mai sur la plage de Grand-Bassam, il réunira plus de 30 artistes locaux et internationaux sur 3 jours de concerts. La programmation mêle afrobeat, coupé-décalé, reggae et musiques du monde. Plus de 15 000 festivaliers sont attendus chaque soir. CÔTIÈRE EVENT est partenaire officiel de l'événement et propose des packages tout inclus (transport, hébergement, billets)." },
  "nouvelles-infrastructures": { titre: "Nouvelles infrastructures pour la Côtière", date: "Janvier 2026", image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80", categorie: "Infrastructure", contenu: "Le gouvernement ivoirien a annoncé un plan d'investissement massif de 500 milliards FCFA pour moderniser les infrastructures du littoral ivoirien sur la période 2026-2030. Ce plan comprend la réhabilitation des routes côtières, la construction de nouveaux ports de plaisance, l'extension du réseau électrique et l'amélioration de l'accès à l'eau potable dans les villages côtiers. Ces investissements visent à renforcer l'attractivité touristique et économique du littoral tout en améliorant les conditions de vie des populations locales." },
};

export default async function ActualiteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = actualites[id];

  if (!article) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-gray-500 text-lg">Article introuvable.</p>
      <Link href="/services/info" className="btn-primary">Retour aux actualités</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-[#0c4a6e]">Accueil</Link>
          <span>/</span>
          <Link href="/services/info" className="hover:text-[#0c4a6e]">CÔTIÈRE INFO+</Link>
          <span>/</span>
          <span className="text-[#0c4a6e] font-medium truncate">{article.titre}</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <Link href="/services/info" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#0c4a6e] mb-6 transition-colors">
          <ChevronLeft size={16} /> Retour aux actualités
        </Link>

        <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="relative h-64 sm:h-80">
            <img src={article.image} alt={article.titre} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <span className="absolute top-4 left-4 bg-[#c9a84c] text-white text-xs font-bold px-3 py-1.5 rounded-full">{article.categorie}</span>
          </div>

          <div className="p-8">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
              <Calendar size={14} className="text-[#c9a84c]" />
              <span>{article.date}</span>
              <span>·</span>
              <span>CÔTIÈRE INFO+</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-[#0c4a6e] mb-6 leading-tight">{article.titre}</h1>

            <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed">
              <p className="text-base leading-relaxed">{article.contenu}</p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-4">Publié par <strong className="text-[#0c4a6e]">CÔTIÈRE INFO+</strong> — La voix officielle du littoral ivoirien</p>
              <Link href="/services/info" className="btn-primary inline-flex">
                Voir toutes les actualités <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
