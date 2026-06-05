"use client";
import { useParams } from "next/navigation";
import { ArrowRight, ArrowLeft, ChevronRight, Share2, Check, Package, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import ReservationModal from "@/components/frontend/ReservationModal";
import ImageZoom from "@/components/frontend/ImageZoom";

type Equipment = {
  id: string; name: string; description?: string; category: string;
  totalStock: number; pricePerDay: number; depositValue: number;
  images: string[]; isActive: boolean;
};

export default function EquipmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [eq, setEq] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [copied, setCopied] = useState(false);
  const [allEquipment, setAllEquipment] = useState<Equipment[]>([]);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/equipment/${id}`)
      .then(r => { if (!r.ok) throw new Error("not found"); return r.json(); })
      .then(d => {
        if (d.data) setEq(d.data);
        else setNotFound(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));

    fetch("/api/equipment")
      .then(r => r.json())
      .then(d => setAllEquipment(d.data ?? []))
      .catch(() => {});
  }, [id]);

  function handleShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) { navigator.share({ title: eq?.name ?? "", url }).catch(() => {}); return; }
    } catch {}
    navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }).catch(() => {});
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <RefreshCw size={32} className="animate-spin text-[#c9a84c]" />
    </div>
  );

  if (notFound || !eq) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-gray-500">Équipement introuvable.</p>
      <Link href="/services/location" className="btn-primary">Retour au catalogue</Link>
    </div>
  );

  const images = eq.images?.length > 0
    ? eq.images
    : ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Breadcrumb */}
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

          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl overflow-hidden shadow-sm bg-white relative">
              <span className="absolute top-4 right-4 bg-[#c9a84c] text-white text-sm font-bold px-4 py-1.5 rounded-full z-10">
                {eq.pricePerDay.toLocaleString()} FCFA / jour
              </span>
              <span className="absolute top-4 left-4 bg-white/90 text-[#0c4a6e] text-xs font-bold px-3 py-1 rounded-full z-10">
                {eq.category}
              </span>
              <ImageZoom images={images} alt={eq.name} activeImg={activeImg} setActiveImg={setActiveImg} />
              {images.length > 1 && (
                <div className="flex gap-2 p-3 bg-white">
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setActiveImg(i)}
                      className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${i === activeImg ? "border-[#c9a84c]" : "border-transparent opacity-60 hover:opacity-100"}`}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h1 className="text-2xl font-bold text-[#0c4a6e] mb-3">{eq.name}</h1>
              {eq.description && <p className="text-gray-600 leading-relaxed">{eq.description}</p>}
            </div>

            {/* Infos supplémentaires */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-[#0c4a6e] mb-4 flex items-center gap-2">
                <Package size={18} className="text-[#c9a84c]" /> Conditions de location
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: "Durée minimale", value: "1 jour" },
                  { label: "Livraison", value: "Disponible (sur devis)" },
                  { label: "Installation", value: "Disponible (sur devis)" },
                  { label: "Assurance", value: "Recommandée" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center p-3 bg-[#f8fafc] rounded-xl border border-gray-100">
                    <span className="text-gray-500 text-sm">{label}</span>
                    <span className="text-[#0c4a6e] font-semibold text-sm">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
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
                  <span className="text-gray-600">Stock disponible</span>
                  <span className="font-semibold text-green-600">{eq.totalStock} unités</span>
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
                {copied ? "Lien copié !" : "Partager"}
              </button>
              <p className="text-xs text-gray-400 text-center mt-3">Livraison disponible · Réponse sous 24h</p>
            </div>

            {/* Autres équipements */}
            {allEquipment.filter(e => e.id !== id).length > 0 && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mt-4">
                <h3 className="font-bold text-[#0c4a6e] text-sm mb-3">Autres équipements</h3>
                <div className="space-y-2">
                  {allEquipment.filter(e => e.id !== id && e.isActive).slice(0, 4).map(e => (
                    <Link key={e.id} href={`/services/location/${e.id}`}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#f0f9ff] transition-colors group">
                      <img src={e.images?.[0] ?? "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&q=80"} alt={e.name} className="w-14 h-10 object-cover rounded-lg shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#0c4a6e] truncate group-hover:text-[#c9a84c] transition-colors">{e.name}</p>
                        <p className="text-xs text-gray-400">{e.pricePerDay.toLocaleString()} FCFA/jour</p>
                      </div>
                      <ArrowRight size={12} className="text-gray-300 group-hover:text-[#c9a84c] shrink-0 transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ReservationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={"Location : " + eq.name}
        details={eq.name + " - " + eq.pricePerDay.toLocaleString() + " FCFA/jour - Caution: " + eq.depositValue.toLocaleString() + " FCFA"}
      />
    </div>
  );
}
