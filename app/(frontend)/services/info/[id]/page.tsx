import { ArrowRight, ChevronLeft, Calendar, MapPin, Ticket, Users, Clock } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function ActualiteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Recherche de l'événement dans la base de données par ID ou par Slug
  let article: any = null;
  try {
    article = await prisma.evenement.findFirst({
      where: {
        OR: [
          { id: id },
          { slug: id }
        ]
      }
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'événement :", error);
  }

  if (!article) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50 px-4 text-center">
      <p className="text-gray-500 text-lg">Événement ou actualité introuvable.</p>
      <Link href="/services/info" className="btn-primary">Retour aux actualités</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-gray-500 overflow-x-auto whitespace-nowrap">
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
          <div className="relative h-64 sm:h-80 bg-gray-100">
            <img 
              src={article.image || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80"} 
              alt={article.titre} 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <span className={`absolute top-4 left-4 ${article.badgeColor || 'bg-[#c9a84c]'} text-white text-xs font-bold px-3 py-1.5 rounded-full shadow`}>
              {article.categorie || "Événement"}
            </span>
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-500 mb-4">
              <span className="flex items-center gap-1.5 font-semibold text-[#c9a84c]">
                <Calendar size={14} /> {article.date}
              </span>
              {article.heure && (
                <span className="flex items-center gap-1.5">
                  <Clock size={14} /> {article.heure}
                </span>
              )}
              {article.lieu && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} /> {article.lieu} {article.ville ? `(${article.ville})` : ""}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-[#0c4a6e] mb-6 leading-tight">{article.titre}</h1>

            {/* Détails supplémentaires de l'événement */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl mb-6 border border-gray-100 text-sm">
              {article.prix && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Ticket size={16} className="text-[#c9a84c] shrink-0" />
                  <span><strong>Tarif :</strong> {article.prix}</span>
                </div>
              )}
              {article.capacite && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Users size={16} className="text-[#c9a84c] shrink-0" />
                  <span><strong>Capacité :</strong> {article.capacite}</span>
                </div>
              )}
              {article.organisateur && (
                <div className="flex items-center gap-2 text-gray-700 sm:col-span-2">
                  <span className="font-semibold text-[#0c4a6e]">Organisateur :</span> {article.organisateur}
                </div>
              )}
            </div>

            <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed">
              <p className="text-base leading-relaxed whitespace-pre-line">{article.description || "Aucune description détaillée fournie pour le moment."}</p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-xs text-gray-400">Publié par <strong className="text-[#0c4a6e]">CÔTIÈRE INFO+</strong></p>
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