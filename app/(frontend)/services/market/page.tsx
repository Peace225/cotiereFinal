"use client";
import { useState, useEffect } from "react";
import { ArrowRight, Phone, ShoppingCart, Plus, Minus, X, RefreshCw } from "lucide-react";
import ReservationModal from "@/components/frontend/ReservationModal";
import { useCart } from "@/components/frontend/CartContext";

type Produit = {
  id: string; label: string; desc: string; prix: number;
  unite: string; images: string[]; categorie: string;
};

export default function MarketPage() {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [showCart, setShowCart] = useState(false);
  const [selectedProduit, setSelectedProduit] = useState<Produit | null>(null);

  const { cart, cartCount, cartTotal, addToCart, updateQty } = useCart();

  useEffect(() => {
    fetch("/api/market")
      .then(r => r.json())
      .then(d => setProduits(d.data?.produits ?? []))
      .catch(() => setProduits([]))
      .finally(() => setLoading(false));
  }, []);

  const categories = ["Tous", ...Array.from(new Set(produits.map(p => p.categorie)))];
  const filtered = activeCategory === "Tous" ? produits : produits.filter(p => p.categorie === activeCategory);

  return (
    <div className="min-h-screen">
      <section className="relative text-white py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1534482421-64566f976cfa?w=1600&q=80" alt="Marché" className="w-full h-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-2xl sm:text-2xl sm:text-4xl md:text-5xl font-bold mt-2 mb-4">CÔTIÈRE Market & Distribution</h1>
            <p className="text-gray-100 text-lg">Attiéké, poissons, fruits de mer et produits locaux du littoral ivoirien.</p>
            <div className="flex gap-3 mt-8">
              <a href="#catalogue" className="btn-primary inline-flex items-center gap-2">Voir le catalogue <ArrowRight size={18} /></a>
              <a href="tel:+2250747722931" className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-bold px-5 py-3 rounded-xl hover:bg-white/20 transition-colors">
                <Phone size={18} /> Commander
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="catalogue" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <h2 className="section-title">Nos produits</h2>
            {cartCount > 0 && (
              <button onClick={() => setShowCart(true)} className="flex items-center gap-2 bg-[#c9a84c] hover:bg-[#b8973b] text-white font-bold px-5 py-2.5 rounded-xl transition-colors shadow-md">
                <ShoppingCart size={18} /> Panier ({cartCount}) — {cartTotal.toLocaleString()} FCFA
              </button>
            )}
          </div>
          <div className="flex gap-2 flex-wrap mb-6">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={"px-4 py-2 rounded-lg text-sm font-semibold transition-all " + (activeCategory === cat ? "bg-[#0c4a6e] text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300")}>
                {cat}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {loading ? (
              <div className="col-span-4 py-16 text-center text-gray-400">
                <RefreshCw size={32} className="animate-spin mx-auto mb-3" /> Chargement des produits...
              </div>
            ) : filtered.map(p => {
              // 🔥 CORRIGÉ : On sécurise l'URL de l'image pour éviter les chaînes vides ("") et les erreurs 404
              const img = p.images?.[0] || "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=400&q=80";
              const cartItem = cart.find(i => i.produit.id === p.id);
              return (
                <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 card-hover">
                  <div className="relative h-40">
                    <img 
                      src={img} 
                      alt={p.label} 
                      className="w-full h-full object-cover" 
                      onError={e => { (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=400&q=80"; }} 
                    />
                    <span className="absolute top-3 left-3 bg-white/90 text-[#0c4a6e] text-xs font-bold px-2 py-1 rounded-full">{p.categorie}</span>
                    <span className="absolute top-3 right-3 bg-[#c9a84c] text-white text-xs font-bold px-2 py-1 rounded-full">{p.prix.toLocaleString()} FCFA</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-[#0c4a6e] mb-1 text-sm">{p.label}</h3>
                    <p className="text-xs text-gray-500 mb-3">{p.desc}</p>
                    <div className="space-y-2">
                      {cartItem ? (
                        <div className="flex items-center justify-between">
                          <button onClick={() => updateQty(p.id, -1)} className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200"><Minus size={14} /></button>
                          <span className="font-bold text-[#0c4a6e]">{cartItem.qty}</span>
                          <button onClick={() => updateQty(p.id, 1)} className="w-8 h-8 bg-[#0c4a6e] text-white rounded-lg flex items-center justify-center"><Plus size={14} /></button>
                        </div>
                      ) : (
                        <button onClick={() => addToCart(p)} className="w-full flex items-center justify-center gap-1 bg-[#0c4a6e] hover:bg-[#0a3d5c] text-white text-xs font-bold py-2 rounded-lg transition-colors">
                          <Plus size={13} /> Ajouter au panier
                        </button>
                      )}
                      <button onClick={() => setSelectedProduit(p)} className="btn-primary w-full justify-center text-sm py-2">
                        Commander <ArrowRight size={14} />
                      </button>
                      <a
                        href={`https://wa.me/2250747722931?text=${encodeURIComponent(`Bonjour, je souhaite commander : ${p.label} (${p.prix.toLocaleString()} FCFA / ${p.unite}). Merci.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white text-xs font-bold py-2 rounded-lg transition-colors"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        Commander via WhatsApp
                      </a>
                      <a href={"/services/market/" + p.id} className="mt-1 w-full flex items-center justify-center gap-1 text-sm font-semibold text-[#0c4a6e] border border-[#0c4a6e]/20 rounded-xl py-2 hover:bg-[#0c4a6e]/5 transition-colors">
                        Voir détail <ArrowRight size={13} />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {showCart && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
              <h3 className="font-bold text-[#0c4a6e] text-lg">Mon panier</h3>
              <button onClick={() => setShowCart(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="overflow-y-auto px-5 py-4 space-y-3 flex-1">
              {cart.map(i => (
                <div key={i.produit.id} className="flex items-center gap-3">
                  <img 
                    src={i.produit.images?.[0] || "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=400&q=80"} 
                    alt={i.produit.label} 
                    className="w-12 h-12 rounded-lg object-cover shrink-0" 
                    onError={e => { (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=400&q=80"; }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-[#0c4a6e] truncate">{i.produit.label}</p>
                    <p className="text-xs text-gray-500">{i.produit.prix.toLocaleString()} FCFA x {i.qty}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => updateQty(i.produit.id, -1)} className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center"><Minus size={12} /></button>
                    <span className="font-bold text-sm w-4 text-center">{i.qty}</span>
                    <button onClick={() => updateQty(i.produit.id, 1)} className="w-7 h-7 bg-[#0c4a6e] text-white rounded-lg flex items-center justify-center"><Plus size={12} /></button>
                  </div>
                  <span className="text-sm font-bold text-[#0c4a6e] shrink-0">{(i.produit.prix * i.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="px-5 py-4 border-t border-gray-100 shrink-0 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-[#0c4a6e]">Total</span>
                <span className="text-xl font-black text-[#0c4a6e]">{cartTotal.toLocaleString()} FCFA</span>
              </div>
              <button onClick={() => { setShowCart(false); setSelectedProduit({ id: "cart", label: "Commande Market", desc: cart.map(i => i.produit.label + " x" + i.qty).join(", "), prix: cartTotal, unite: "", images: [], categorie: "" }); }} className="btn-primary w-full justify-center">
                Commander <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedProduit && (
        <ReservationModal
          isOpen={!!selectedProduit}
          onClose={() => setSelectedProduit(null)}
          title={selectedProduit.id === "cart" ? "Commande Market (" + cartCount + " articles)" : "Commander : " + selectedProduit.label}
          details={selectedProduit.id === "cart" ? selectedProduit.desc + " | Total: " + cartTotal.toLocaleString() + " FCFA" : selectedProduit.label + " - " + selectedProduit.prix.toLocaleString() + " FCFA / " + selectedProduit.unite}
        />
      )}
    </div>
  );
}