"use client";
import { useEffect, useState } from "react";
import { ArrowRight, Plus, Minus, ShoppingCart, CheckCircle, X } from "lucide-react";

type Equipment = {
  id: string; name: string; description?: string; category: string;
  totalStock: number; pricePerDay: number; depositValue: number; images: string[];
};

type CartItem = { equipment: Equipment; quantity: number };

const CATEGORIES = ["Tentes", "Tables", "Chaises", "Sono/Audio", "Eclairage", "Electricite", "Divers"];

const DEFAULT_EQUIPMENT: Equipment[] = [
  { id: "t1", name: "Tente 2 places", category: "Tentes", totalStock: 20, pricePerDay: 5000, depositValue: 15000, images: ["https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&q=80"] },
  { id: "t2", name: "Tente 4 places", category: "Tentes", totalStock: 15, pricePerDay: 8000, depositValue: 25000, images: ["https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=400&q=80"] },
  { id: "c1", name: "Chaises pliantes", category: "Chaises", totalStock: 200, pricePerDay: 500, depositValue: 1000, images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80"] },
  { id: "c2", name: "Tables pliantes", category: "Tables", totalStock: 50, pricePerDay: 2000, depositValue: 5000, images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80"] },
  { id: "s1", name: "Enceinte sono 500W", category: "Sono/Audio", totalStock: 10, pricePerDay: 15000, depositValue: 50000, images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80"] },
  { id: "l1", name: "Projecteur LED 200W", category: "Eclairage", totalStock: 12, pricePerDay: 8000, depositValue: 30000, images: ["https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&q=80"] },
  { id: "l2", name: "Guirlandes lumineuses (10m)", category: "Eclairage", totalStock: 30, pricePerDay: 3000, depositValue: 8000, images: ["https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&q=80"] },
  { id: "l3", name: "Jeux de lumières DJ", category: "Eclairage", totalStock: 6, pricePerDay: 12000, depositValue: 40000, images: ["https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80"] },
  { id: "e1", name: "Groupe électrogène 2kW", category: "Electricite", totalStock: 8, pricePerDay: 20000, depositValue: 80000, images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80"] },
  { id: "d1", name: "Parasols", category: "Divers", totalStock: 30, pricePerDay: 3000, depositValue: 8000, images: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80"] },
];

export default function LocationPage() {
  const [equipment, setEquipment] = useState<Equipment[]>(DEFAULT_EQUIPMENT);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [showForm, setShowForm] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", email: "", startDate: "", endDate: "", deliveryAddress: "", withDelivery: false, withInstall: false, withInsurance: false });

  useEffect(() => {
    fetch("/api/equipment").then(r => r.json()).then(d => { if (d.data?.length > 0) setEquipment(d.data); }).catch(() => {});
  }, []);

  function addToCart(eq: Equipment) {
    setCart(prev => {
      const existing = prev.find(i => i.equipment.id === eq.id);
      if (existing) return prev.map(i => i.equipment.id === eq.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { equipment: eq, quantity: 1 }];
    });
  }

  function updateQty(id: string, delta: number) {
    setCart(prev => prev.map(i => i.equipment.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i).filter(i => i.quantity > 0));
  }

  const days = form.startDate && form.endDate
    ? Math.max(1, Math.ceil((new Date(form.endDate).getTime() - new Date(form.startDate).getTime()) / (1000 * 60 * 60 * 24)))
    : 1;

  const equipmentTotal = cart.reduce((s, i) => s + i.quantity * i.equipment.pricePerDay * days, 0);
  const optionsTotal = (form.withDelivery ? 15000 : 0) + (form.withInstall ? 20000 : 0);
  const insuranceAmount = form.withInsurance ? Math.ceil(equipmentTotal * 0.05) : 0;
  const depositTotal = cart.reduce((s, i) => s + i.quantity * i.equipment.depositValue, 0);
  const grandTotal = equipmentTotal + optionsTotal + insuranceAmount;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (cart.length === 0) return;
    setLoading(true);
    try {
      const itemsList = cart.map(i => `${i.equipment.name} x${i.quantity}`).join(", ");

      // Vérifier si les équipements sont en BDD (IDs réels) ou par défaut (t1, c1, etc.)
      const hasDefaultIds = cart.some(i => /^[a-z]\d+$/.test(i.equipment.id));

      if (hasDefaultIds) {
        // Fallback : réservation générique via EventRequest
        await fetch("/api/reservations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientFirstName: form.firstName,
            clientLastName: form.lastName,
            clientPhone: form.phone,
            clientEmail: form.email,
            eventDate: form.startDate ? new Date(form.startDate).toISOString() : undefined,
            serviceTitle: `Location : ${itemsList}`,
            serviceDetails: `Materiel: ${itemsList} | Du: ${form.startDate} Au: ${form.endDate} | Total: ${grandTotal.toLocaleString()} FCFA | Caution: ${depositTotal.toLocaleString()} FCFA`,
            message: form.deliveryAddress ? `Adresse: ${form.deliveryAddress}` : undefined,
            pageUrl: typeof window !== "undefined" ? window.location.href : undefined,
          }),
        });
      } else {
        await fetch("/api/equipment/rentals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientFirstName: form.firstName,
            clientLastName: form.lastName,
            clientPhone: form.phone,
            clientEmail: form.email,
            startDate: form.startDate,
            endDate: form.endDate,
            deliveryAddress: form.deliveryAddress,
            withDelivery: form.withDelivery,
            withInstall: form.withInstall,
            withInsurance: form.withInsurance,
            items: cart.map(i => ({ equipmentId: i.equipment.id, quantity: i.quantity })),
          }),
        });
      }
      const msg = encodeURIComponent(
        `DEMANDE GUICHET UNIQUE - INDUSTRIE EVENEMENTIELLE\n\nClient: ${form.firstName} ${form.lastName}\nTel: ${form.phone}\nDu: ${form.startDate} Au: ${form.endDate}\nMateriel: ${itemsList}\nTotal: ${grandTotal.toLocaleString()} FCFA\nCaution: ${depositTotal.toLocaleString()} FCFA\n\n-- CÔTIÈRE MEDIA GROUP\n1er site officiel des villes et villages du littoral ivoirien\nTel: 07 47 72 29 31`
      );
      window.open(`https://wa.me/2250747722931?text=${msg}`, "_blank");
      setSent(true);
    } catch {}
    setLoading(false);
  }

  const filtered = activeCategory === "Tous" ? equipment : equipment.filter(e => e.category === activeCategory);

  return (
    <div className="min-h-screen">
      <section className="relative text-white py-16 overflow-hidden min-h-[280px]">
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold mt-2 mb-3 leading-tight">Guichet Unique de l'Industrie Événementielle & Audiovisuelle</h1>
              <p className="text-gray-200 text-sm md:text-base">Tentes, tables, chaises, sono, groupes électrogènes et plus encore pour vos événements.</p>
              <a href="#catalogue" className="btn-primary mt-6 inline-flex">Voir le catalogue <ArrowRight size={18} /></a>
            </div>
            <div className="shrink-0 w-64 md:w-80 lg:w-96">
              <img src="/Images/guichet-unique.png" alt="Guichet Unique" className="w-full h-auto object-contain mix-blend-multiply" />
            </div>
          </div>
        </div>
      </section>

      <section id="catalogue" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <h2 className="section-title">Catalogue de matériel</h2>
            {cart.length > 0 && (
              <button onClick={() => setShowForm(true)}
                className="flex items-center gap-2 bg-[#c9a84c] hover:bg-[#b8973b] text-white font-bold px-5 py-2.5 rounded-xl transition-colors shadow-md">
                <ShoppingCart size={18} /> Panier ({cart.reduce((s, i) => s + i.quantity, 0)}) — {grandTotal.toLocaleString()} FCFA
              </button>
            )}
          </div>

          {/* Filtres catégories */}
          <div className="flex gap-2 flex-wrap mb-6">
            {["Tous", ...CATEGORIES].map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeCategory === cat ? "bg-[#0c4a6e] text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"}`}>
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(eq => {
              const cartItem = cart.find(i => i.equipment.id === eq.id);
              return (
                <div key={eq.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 card-hover">
                  <div className="relative h-40">
                    <img src={eq.images[0] ?? "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80"} alt={eq.name} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 bg-white/90 text-[#0c4a6e] text-xs font-bold px-2 py-1 rounded-full">{eq.category}</span>
                    <span className="absolute top-3 right-3 bg-[#c9a84c] text-white text-xs font-bold px-2 py-1 rounded-full">{eq.pricePerDay.toLocaleString()} FCFA/j</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-[#0c4a6e] mb-1">{eq.name}</h3>
                    <p className="text-xs text-gray-500 mb-1">Stock: {eq.totalStock} disponibles</p>
                    <p className="text-xs text-gray-400 mb-3">Caution: {eq.depositValue.toLocaleString()} FCFA</p>
                    {cartItem ? (
                      <div className="flex items-center justify-between">
                        <button onClick={() => updateQty(eq.id, -1)} className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200"><Minus size={14} /></button>
                        <span className="font-bold text-[#0c4a6e]">{cartItem.quantity}</span>
                        <button onClick={() => updateQty(eq.id, 1)} className="w-8 h-8 bg-[#0c4a6e] text-white rounded-lg flex items-center justify-center hover:bg-[#0a3d5c]"><Plus size={14} /></button>
                      </div>
                    ) : (
                      <button onClick={() => addToCart(eq)} className="btn-primary w-full justify-center text-sm py-2">
                        Ajouter <Plus size={14} />
                      </button>
                    )}
                    <a href={"/services/location/" + eq.id}
                      className="mt-2 w-full flex items-center justify-center gap-1 text-sm font-semibold text-[#0c4a6e] border border-[#0c4a6e]/20 rounded-xl py-2 hover:bg-[#0c4a6e]/5 transition-colors">
                      Voir détail <ArrowRight size={13} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section Prestations Événementielles */}
      <section className="py-16 bg-[#f0f9ff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest">Industrie événementielle</span>
            <h2 className="section-title mt-2">Nos prestations événementielles</h2>
            <p className="text-gray-500 mt-2">Organisation complète de vos événements : mariages, galas, conférences, anniversaires.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
            {[
              { slug: "decoration",   image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=80", label: "Décoration & scénographie" },
              { slug: "traiteur",     image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=400&q=80", label: "Traiteur & restauration" },
              { slug: "sonorisation", image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&q=80", label: "Sonorisation & éclairage" },
              { slug: "securite",     image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&q=80", label: "Sécurité événementielle" },
              { slug: "hotesses",     image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&q=80", label: "Hôtesses & accueil" },
              { slug: "animation",    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80", label: "Animation & spectacles" },
            ].map((s) => (
              <a key={s.label} href={`/services/evenements/${s.slug}`}
                className="group relative rounded-xl overflow-hidden shadow-sm card-hover cursor-pointer">
                <div className="relative h-36">
                  <img src={s.image} alt={s.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute inset-0 bg-[#c9a84c]/0 group-hover:bg-[#c9a84c]/15 transition-all duration-300" />
                  <p className="absolute bottom-3 left-3 right-3 text-white text-xs font-semibold leading-tight group-hover:text-[#c9a84c] transition-colors">{s.label}</p>
                  <div className="absolute top-2 right-2 w-6 h-6 bg-white/0 group-hover:bg-white/90 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100">
                    <ArrowRight size={11} className="text-[#0c4a6e]" />
                  </div>
                </div>
              </a>
            ))}
          </div>
          <div className="text-center">
            <a href="/services/evenements#demande" className="btn-primary inline-flex items-center gap-2">
              Demander un devis événement <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* Modal panier + formulaire */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[95vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
              <h3 className="font-bold text-[#0c4a6e] text-lg">Votre commande</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            {sent ? (
              <div className="p-8 text-center">
                <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                <h4 className="font-bold text-[#0c4a6e] text-lg mb-2">Demande envoyée !</h4>
                <p className="text-gray-500 text-sm">Notre équipe vous contactera sous 24h pour confirmer la disponibilité.</p>
                <button onClick={() => { setShowForm(false); setSent(false); setCart([]); }} className="mt-4 btn-primary">Fermer</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="overflow-y-auto px-5 py-4 space-y-4">
                {/* Récap panier */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  {cart.map(i => (
                    <div key={i.equipment.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{i.equipment.name} × {i.quantity}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-[#0c4a6e] font-semibold">{(i.quantity * i.equipment.pricePerDay * days).toLocaleString()} FCFA</span>
                        <button type="button" onClick={() => updateQty(i.equipment.id, -i.quantity)} className="text-red-400 hover:text-red-600"><X size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Date de début *</label>
                    <input required type="date" value={form.startDate} min={new Date().toISOString().split("T")[0]}
                      onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Date de fin *</label>
                    <input required type="date" value={form.endDate} min={form.startDate || new Date().toISOString().split("T")[0]}
                      onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" />
                  </div>
                </div>
                {form.startDate && form.endDate && <p className="text-xs text-[#0c4a6e] font-semibold">Durée : {days} jour(s)</p>}

                {/* Infos client */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Prénom *</label>
                    <input required type="text" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Nom *</label>
                    <input required type="text" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Téléphone *</label>
                    <input required type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" />
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-2">
                  {[
                    { key: "withDelivery", label: "Livraison/retour (+15 000 FCFA)" },
                    { key: "withInstall", label: "Installation sur place (+20 000 FCFA)" },
                    { key: "withInsurance", label: "Assurance matériel (+5% du total)" },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))} className="accent-[#c9a84c]" />
                      <span className="text-sm text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>

                {form.withDelivery && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Adresse de livraison *</label>
                    <input required type="text" value={form.deliveryAddress} onChange={e => setForm(f => ({ ...f, deliveryAddress: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" />
                  </div>
                )}

                {/* Récap total */}
                <div className="bg-[#f0f9ff] rounded-xl p-4 space-y-1 text-sm">
                  <div className="flex justify-between"><span className="text-gray-600">Matériel ({days}j)</span><span className="font-semibold">{equipmentTotal.toLocaleString()} FCFA</span></div>
                  {optionsTotal > 0 && <div className="flex justify-between"><span className="text-gray-600">Options</span><span className="font-semibold">{optionsTotal.toLocaleString()} FCFA</span></div>}
                  {insuranceAmount > 0 && <div className="flex justify-between"><span className="text-gray-600">Assurance</span><span className="font-semibold">{insuranceAmount.toLocaleString()} FCFA</span></div>}
                  <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                    <span className="font-bold text-[#0c4a6e]">TOTAL</span>
                    <span className="font-black text-[#0c4a6e] text-lg">{grandTotal.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Caution requise</span><span>{depositTotal.toLocaleString()} FCFA</span>
                  </div>
                </div>

                <button type="submit" disabled={loading || cart.length === 0} className="btn-primary w-full justify-center disabled:opacity-60">
                  {loading ? "Envoi..." : "Confirmer la demande"} <ArrowRight size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

