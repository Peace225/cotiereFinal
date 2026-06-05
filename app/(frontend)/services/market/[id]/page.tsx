"use client";
import { useState, useEffect } from "react";
import { ArrowRight, Phone, ShoppingCart, ChevronLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import ReservationModal from "@/components/frontend/ReservationModal";
import ImageZoom from "@/components/frontend/ImageZoom";
import { useCart } from "@/components/frontend/CartContext";
import { useParams } from "next/navigation";

type Produit = {
  id: string; label: string; desc: string; prix: number;
  unite: string; images: string[]; categorie: string;
};

export default function MarketDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [produit, setProduit] = useState<Produit | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const { addToCart, cart, cartCount } = useCart();

  useEffect(() => {
    if (!id) return;
    fetch(`/api/market/${id}`)
      .then(r => r.json())
      .then(d => {
        if (d.data?.produit) setProduit(d.data.produit);
        else setNotFound(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const cartItem = produit ? cart.find(i => i.produit.id === produit.id) : null;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <RefreshCw size={32} className="animate-spin text-[#0c4a6e]" />
    </div>
  );

  if (notFound || !produit) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-gray-500 text-lg">Produit introuvable</p>
      <Link href="/services/market" className="btn-primary">Retour au catalogue</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-[#0c4a6e]">Accueil</Link>
          <span>/</span>
          <Link href="/services/market" className="hover:text-[#0c4a6e]">Market</Link>
          <span>/</span>
          <span className="text-[#0c4a6e] font-medium truncate">{produit.label}</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <Link href="/services/market" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#0c4a6e] mb-6 transition-colors">
          <ChevronLeft size={16} /> Retour au catalogue
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Galerie images */}
            <div className="relative md:h-full min-h-[300px] bg-gray-100 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none overflow-hidden">
              <span className="absolute top-4 left-4 bg-white/90 text-[#0c4a6e] text-xs font-bold px-3 py-1.5 rounded-full z-10">
                {produit.categorie}
              </span>
              <ImageZoom
                images={produit.images?.length > 0 ? produit.images : ["https://images.unsplash.com/photo-1534482421-64566f976cfa?w=800&q=80"]}
                alt={produit.label}
                activeImg={activeImg}
                setActiveImg={setActiveImg}
              />
            </div>

            {/* Infos */}
            <div className="p-8 flex flex-col justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[#0c4a6e] mb-2">{produit.label}</h1>
                <p className="text-gray-600 mb-6 leading-relaxed">{produit.desc}</p>

                <div className="bg-[#faf8f4] rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">Prix unitaire</span>
                    <span className="text-2xl font-black text-[#c9a84c]">
                      {produit.prix.toLocaleString()} FCFA
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-gray-500 text-sm">Unité</span>
                    <span className="text-sm font-semibold text-[#0c4a6e]">/ {produit.unite}</span>
                  </div>
                  {cartItem && (
                    <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between">
                      <span className="text-sm text-green-600 font-semibold">✓ Dans votre panier</span>
                      <span className="text-sm font-bold text-[#0c4a6e]">{cartItem.qty} {produit.unite}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => addToCart(produit)}
                  className="w-full flex items-center justify-center gap-2 bg-[#0c4a6e] hover:bg-[#0a3d5c] text-white font-bold py-3 rounded-xl transition-colors"
                >
                  <ShoppingCart size={18} />
                  {cartItem ? `Ajouter encore (${cartItem.qty} dans le panier)` : "Ajouter au panier"}
                </button>

                <button
                  onClick={() => setShowModal(true)}
                  className="btn-primary w-full justify-center py-3"
                >
                  Commander maintenant <ArrowRight size={16} />
                </button>

                <a
                  href={`https://wa.me/2250747722931?text=${encodeURIComponent(`Bonjour, je souhaite commander : ${produit.label} (${produit.prix.toLocaleString()} FCFA / ${produit.unite}). Merci.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold py-3 rounded-xl transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Commander via WhatsApp
                </a>

                <a href="tel:+2250747722931"
                  className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <Phone size={16} /> Appeler pour commander
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Retour catalogue */}
        <div className="mt-8 text-center">
          <Link href="/services/market" className="inline-flex items-center gap-2 text-[#0c4a6e] font-semibold hover:underline">
            <ChevronLeft size={16} /> Voir tous les produits
          </Link>
        </div>
      </div>

      {showModal && (
        <ReservationModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={`Commander : ${produit.label}`}
          details={`${produit.label} — ${produit.prix.toLocaleString()} FCFA / ${produit.unite}`}
        />
      )}
    </div>
  );
}
