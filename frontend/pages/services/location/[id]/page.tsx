"use client";
import { useParams } from "next/navigation";
import { ArrowRight, ArrowLeft, ChevronRight, Share2, Check, Package } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import ReservationModal from "@/components/frontend/ReservationModal";
import ImageZoom from "@/components/frontend/ImageZoom";

const DEFAULT_EQUIPMENT = [
  { id: "t1", name: "Tente 2 places", description: "Tente légère et imperméable, idéale pour 2 personnes. Montage rapide en 10 minutes.", category: "Tentes", totalStock: 20, pricePerDay: 5000, depositValue: 15000, images: ["https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80", "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80"] },
  { id: "t2", name: "Tente 4 places", description: "Grande tente familiale avec double toit anti-pluie. Parfaite pour les événements en plein air.", category: "Tentes", totalStock: 15, pricePerDay: 8000, depositValue: 25000, images: ["https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80", "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80"] },
  { id: "c1", name: "Chaises pliantes", description: "Chaises pliantes légères et résistantes, disponibles en lot. Idéales pour mariages et événements.", category: "Chaises", totalStock: 200, pricePerDay: 500, depositValue: 1000, images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80"] },
  { id: "c2", name: "Tables pliantes", description: "Tables pliantes robustes en aluminium. Disponibles en différentes tailles.", category: "Tables", totalStock: 50, pricePerDay: 2000, depositValue: 5000, images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80"] },
  { id: "s1", name: "Enceinte sono 500W", description: "Système de sonorisation professionnel 500W avec caisson de basse. Idéal pour soirées et événements.", category: "Sono/Audio", totalStock: 10, pricePerDay: 15000, depositValue: 50000, images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"] },
  { id: "l1", name: "Projecteur LED 200W", description: "Projecteur LED haute puissance 200W, éclairage blanc ou coloré. Parfait pour illuminer vos événements.", category: "Eclairage", totalStock: 12, pricePerDay: 8000, depositValue: 30000, images: ["https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80", "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80"] },
  { id: "l2", name: "Guirlandes lumineuses (10m)", description: "Guirlandes LED 10 mètres, ambiance chaleureuse pour mariages et soirées.", category: "Eclairage", totalStock: 30, pricePerDay: 3000, depositValue: 8000, images: ["https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&q=80"] },
  { id: "l3", name: "Jeux de lumières DJ", description: "Pack jeux de lumières professionnel : laser, stroboscope, boule à facettes. Pour vos soirées dansantes.", category: "Eclairage", totalStock: 6, pricePerDay: 12000, depositValue: 40000, images: ["https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80", "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80"] },
  { id: "e1", name: "Groupe électrogène 2kW", description: "Groupe électrogène silencieux 2kW, autonomie 8h. Indispensable pour les événements sans accès électrique.", category: "Electricite", totalStock: 8, pricePerDay: 20000, depositValue: 80000, images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"] },
  { id: "d1", name: "Parasols", description: "Parasols de plage et d'événement, diamètre 3m. Protection solaire optimale.", category: "Divers", totalStock: 30, pricePerDay: 3000, depositValue: 8000, images: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80"] },
];

export default function EquipmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const eq = DEFAULT_EQUIPMENT.find(e => e.id === id);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [copied, setCopied] = useState(false);

  function handleShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) { navigator.share({ title: eq?.name ?? "", url }).catch(() => {}); return; }
    } catch {}
    navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }).catch(() => {});
  }

  if (!eq) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-gray-500">Équipement introuvable.</p>
      <Link href="/services/location" className="btn-primary">Retour au catalogue</Link>
    </div>
  );

  const pageUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#0c4a6e]">Accueil</Link>
            <ChevronRight size={14} />
            <Link href="/services/location" className="hover:text-[#0c4a6e]">Location</Link>
            <ChevronRight size={14} />
            <span className="text-[#0c4a6e] font-medium">{eq.name}</span>
          </div>
          <button onClick={handleShare} className="flex items-center gap-2 text-sm font-semibold text-[#0c4a6e] border border-[#0c4a6e]/20 px-3 py-1.5 rounded-lg hover:bg-[#0c4a6e]/5 transition-colors">
            {copied ? <Check size={15} className="text-green-500" /> : <Share2 size={15} />}
            {copied ? "Copié !" : "Partager"}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/services/location" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#0c4a6e] mb-6 transition-colors">
          <ArrowLeft size={16} /> Retour au catalogue
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl overflow-hidden shadow-sm bg-white relative">
              <span className="absolute top-4 right-4 bg-[#c9a84c] text-white text-sm font-bold px-4 py-1.5 rounded-full z-10">
                {eq.pricePerDay.toLocaleString()} FCFA / jour
              </span>
              <span className="absolute top-4 left-4 bg-white/90 text-[#0c4a6e] text-xs font-bold px-3 py-1 rounded-full z-10">
                {eq.category}
              </span>
              <ImageZoom images={eq.images} alt={eq.name} activeImg={activeImg} setActiveImg={setActiveImg} />
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h1 className="text-2xl font-bold text-[#0c4a6e] mb-3">{eq.name}</h1>
              <p className="text-gray-600 leading-relaxed">{eq.description}</p>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h3 className="font-bold text-[#0c4a6e] text-lg mb-4">Tarif</h3>
              <div className="space-y-2 mb-6">
                <div className="flex justify-between py-2 border-b border-gray-50 text-sm">
                  <span className="text-gray-600">Prix / jour</span>
                  <span className="font-bold text-[#0c4a6e]">{eq.pricePerDay.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50 text-sm">
                  <span className="text-gray-600">Caution</span>
                  <span className="font-semibold text-gray-700">{eq.depositValue.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50 text-sm">
                  <span className="text-gray-600">Stock</span>
                  <span className="font-semibold text-green-600">{eq.totalStock} disponibles</span>
                </div>
                <div className="flex justify-between py-2 text-sm">
                  <span className="text-gray-600">Catégorie</span>
                  <span className="font-semibold text-gray-700">{eq.category}</span>
                </div>
              </div>
              <button onClick={() => setModalOpen(true)} className="btn-primary w-full justify-center">
                Réserver maintenant <ArrowRight size={16} />
              </button>
              <button onClick={handleShare} className="mt-2 w-full flex items-center justify-center gap-2 text-sm font-semibold text-gray-600 border border-gray-200 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                {copied ? <Check size={15} className="text-green-500" /> : <Share2 size={15} />}
                {copied ? "Lien copié !" : "Partager cet équipement"}
              </button>
              <p className="text-xs text-gray-400 text-center mt-3">Livraison disponible · Réponse sous 24h</p>
            </div>
          </div>
        </div>
      </div>

      <ReservationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={"Location : " + eq.name}
        details={eq.name + " - " + eq.pricePerDay.toLocaleString() + " FCFA/jour - Caution: " + eq.depositValue.toLocaleString() + " FCFA"}
        pageUrl={pageUrl}
      />
    </div>
  );
}
