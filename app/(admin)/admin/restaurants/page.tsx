"use client";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, UtensilsCrossed, Coffee, Building, Car, Check, Loader2, X, Image as ImageIcon, CreditCard, Banknote, Smartphone, ArrowLeftRight } from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const SERVICES_LIST = [
  { id: "terrasse", label: "Terrasse", icon: UtensilsCrossed },
  { id: "climatisation", label: "Climatisation", icon: Check },
  { id: "wifi", label: "WiFi Gratuit", icon: Check },
  { id: "parking", label: "Parking sécurisé", icon: Car },
  { id: "musique_live", label: "Musique live", icon: Check },
  { id: "livraison", label: "Service de livraison", icon: Check },
  { id: "bar", label: "Bar / Lounge", icon: Coffee },
  { id: "reservation_table", label: "Réservation de table", icon: Check },
  { id: "salle_privee", label: "Salle privée / VIP", icon: Building },
  // Moyens de paiement
  { id: "paiement_especes", label: "Espèces", icon: Banknote },
  { id: "paiement_mobile_money", label: "Mobile Money", icon: Smartphone },
  { id: "paiement_carte", label: "Carte bancaire", icon: CreditCard },
  { id: "paiement_virement", label: "Virement", icon: ArrowLeftRight },
];

const CUISINE_TYPES = [
  { id: "locale", label: "Cuisine Locale Ivoirienne" },
  { id: "africaine", label: "Cuisine Africaine Variée" },
  { id: "europeenne", label: "Cuisine Européenne" },
  { id: "gastronomique", label: "Gastronomie" },
  { id: "fast_food", label: "Fast-Food / Grillades" },
  { id: "bar_lounge", label: "Bar & Tapas" },
];

type RestaurantData = {
  id: string;
  nom: string;
  adresse: string;
  quartier: string;
  ville: string;
  telephone: string;
  whatsapp: string;
  email: string;
  site_internet: string;
  localisation_maps: string;
  type_cuisine: string[];
  prix_moyen: number | string;
  services: string[];
  images: string[];
  image: string;
};

const emptyForm: RestaurantData = {
  id: "",
  nom: "",
  adresse: "",
  quartier: "",
  ville: "",
  telephone: "",
  whatsapp: "",
  email: "",
  site_internet: "",
  localisation_maps: "",
  type_cuisine: [],
  prix_moyen: "",
  services: [],
  images: ["", "", "", ""],
  image: ""
};

function UploadBox({ value, onChange, index }: { value: string, onChange: (url: string) => void, index: number }) {
  const [loading, setLoading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const ext = file.name.split('.').pop();
      const fileName = `restaurant_${Date.now()}_${index}_${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from('categories').upload(fileName, file);
      if (error) throw error;
      const { data } = supabase.storage.from('categories').getPublicUrl(fileName);
      onChange(data.publicUrl);
    } catch (err: any) {
      alert("Erreur upload: " + err.message);
    } finally { setLoading(false); }
  }

  return (
    <div className="relative group border-2 border-dashed border-slate-200 hover:border-[#0c4a6e]/50 rounded-2xl bg-slate-50 h-32 flex flex-col items-center justify-center overflow-hidden transition-all">
      {value ? (
        <>
          <img src={value} className="w-full h-full object-cover" alt={`Upload ${index + 1}`} />
          <button onClick={() => onChange("")} className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-rose-500 text-white rounded-full transition-all opacity-0 group-hover:opacity-100">
            <X size={14} />
          </button>
        </>
      ) : (
        <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-[#0c4a6e]">
          {loading ? <Loader2 size={24} className="animate-spin text-[#c9a84c]" /> : <ImageIcon size={20} />}
          <span className="text-xs font-semibold">Photo {index + 1}</span>
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </label>
      )}
    </div>
  );
}

export default function AdminRestaurantsPage() {
  const [restaurants, setRestaurants] = useState<RestaurantData[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<RestaurantData>(emptyForm);

  useEffect(() => { 
    fetch('/api/categories').then(r => r.json()).then(d => {
      const all = d.data || [];
      setRestaurants(all.filter((item: any) => item.type === "restaurant"));
    }); 
  }, []);

  function toggleService(id: string) {
    setForm(prev => ({
      ...prev,
      services: prev.services.includes(id) ? prev.services.filter(s => s !== id) : [...prev.services, id]
    }));
  }

  function toggleCuisine(id: string) {
    setForm(prev => ({
      ...prev,
      type_cuisine: prev.type_cuisine.includes(id) ? prev.type_cuisine.filter(c => c !== id) : [...prev.type_cuisine, id]
    }));
  }

  async function save() {
    if (!form.nom || !form.ville) return alert("Le nom du restaurant et la ville sont requis.");
    if (!form.images[0]) return alert("Au moins la première photo est requise.");
    
    const payload = { ...form, image: form.images[0], title: form.nom, type: "restaurant" };
    const res = await fetch(editId ? `/api/categories/${editId}` : "/api/categories", { 
      method: editId ? "PATCH" : "POST", 
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify(payload) 
    });
    
    if (res.ok) {
      const { data } = await res.json();
      setRestaurants(p => editId ? p.map(c => c.id === editId ? data : c) : [...p, data]);
      setShowModal(false); 
      setEditId(null);
      setForm(emptyForm);
    } else { 
      alert("Erreur lors de la sauvegarde."); 
    }
  }

  async function remove(id: string) { 
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet établissement ?")) return; 
    const r = await fetch(`/api/categories/${id}`, { method: "DELETE" }); 
    if (r.ok) setRestaurants(p => p.filter(c => c.id !== id)); 
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <AdminNavbar />
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-[#0c4a6e] tracking-tight">Restaurants & Gastronomie</h1>
            <p className="text-sm text-slate-500 mt-1">Gérez les restaurants, bars et espaces gourmands.</p>
          </div>
          <button 
            onClick={() => { setEditId(null); setForm(emptyForm); setShowModal(true); }} 
            className="bg-[#0c4a6e] hover:bg-[#0c4a6e]/90 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus size={18} strokeWidth={2.5} /> Nouveau Restaurant
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {restaurants.map(r => (
            <div key={r.id} className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
              <div className="h-48 bg-slate-100 relative overflow-hidden">
                <img src={r.images?.[0] || r.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={r.nom} />
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditId(r.id); setForm({ ...emptyForm, ...r, images: r.images?.length ? [...r.images, "", "", ""].slice(0, 4) : [r.image || "", "", "", ""] }); setShowModal(true); }} className="p-2 bg-white/90 text-[#0c4a6e] rounded-full shadow-sm">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => remove(r.id)} className="p-2 bg-white/90 text-rose-600 rounded-full shadow-sm">
                    <Trash2 size={15} />
                  </button>
                </div>
                <div className="absolute bottom-3 left-3">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur text-[#0c4a6e] text-xs font-bold rounded-lg shadow-sm">
                    {r.ville}
                  </span>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-slate-800 text-lg truncate mb-1">{r.nom}</h3>
                <p className="text-xs text-slate-400 mb-2">{r.quartier || r.adresse}</p>
                {r.prix_moyen && <p className="text-xs text-[#c9a84c] font-bold mb-3">Prix moyen : {r.prix_moyen} FCFA</p>}
              </div>
            </div>
          ))}
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="bg-white rounded-2xl w-full max-w-3xl flex flex-col shadow-2xl max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
              <h2 className="font-black text-[#0c4a6e] text-xl">
                {editId ? "Modifier le restaurant" : "Nouveau restaurant"}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 text-slate-400 hover:text-slate-700 rounded-full"><X size={20} /></button>
            </div>

            <div className="px-6 py-6 overflow-y-auto space-y-8">
              {/* PRESENTATION */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-6 h-px bg-slate-200"></span> 1. Présentation
                </h3>
                <div>
                  <label className="text-xs font-semibold text-slate-500 ml-1">Nom du restaurant / bar *</label>
                  <input value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} placeholder="Ex: Le Jardin Gourmand" className="w-full bg-slate-50 p-3.5 rounded-xl text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0c4a6e]/20" />
                </div>
              </div>

              {/* COORDONNEES */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-6 h-px bg-slate-200"></span> 2. Coordonnées
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 ml-1">Adresse complète</label>
                    <input value={form.adresse} onChange={e => setForm({ ...form, adresse: e.target.value })} placeholder="Ex: Boulevard Lagunaire" className="w-full bg-slate-50 p-3.5 rounded-xl text-sm border border-slate-200" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 ml-1">Quartier ou zone</label>
                    <input value={form.quartier} onChange={e => setForm({ ...form, quartier: e.target.value })} placeholder="Ex: Plateau" className="w-full bg-slate-50 p-3.5 rounded-xl text-sm border border-slate-200" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 ml-1">Ville *</label>
                    <input value={form.ville} onChange={e => setForm({ ...form, ville: e.target.value })} placeholder="Ex: Abidjan" className="w-full bg-slate-50 p-3.5 rounded-xl text-sm border border-slate-200" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 ml-1">Téléphone</label>
                    <input value={form.telephone} onChange={e => setForm({ ...form, telephone: e.target.value })} placeholder="+225 0700000000" className="w-full bg-slate-50 p-3.5 rounded-xl text-sm border border-slate-200" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 ml-1">WhatsApp</label>
                    <input value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: e.target.value })} placeholder="+225 0700000000" className="w-full bg-slate-50 p-3.5 rounded-xl text-sm border border-slate-200" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 ml-1">Email</label>
                    <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="contact@restaurant.com" className="w-full bg-slate-50 p-3.5 rounded-xl text-sm border border-slate-200" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-500 ml-1">Site internet / Menu en ligne</label>
                    <input value={form.site_internet} onChange={e => setForm({ ...form, site_internet: e.target.value })} placeholder="https://www.restaurant.com" className="w-full bg-slate-50 p-3.5 rounded-xl text-sm border border-slate-200" />
                  </div>
                </div>
              </div>

              {/* LOCALISATION */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-6 h-px bg-slate-200"></span> 3. Localisation
                </h3>
                <div>
                  <label className="text-xs font-semibold text-slate-500 ml-1">Lien Google Maps / Itinéraire</label>
                  <input value={form.localisation_maps} onChange={e => setForm({ ...form, localisation_maps: e.target.value })} placeholder="https://maps.google.com/..." className="w-full bg-slate-50 p-3.5 rounded-xl text-sm border border-slate-200" />
                </div>
              </div>

              {/* GASTRONOMIE */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-6 h-px bg-slate-200"></span> 4. Gastronomie & Tarifs
                </h3>
                <div>
                  <label className="text-xs font-semibold text-slate-500 ml-1">Prix moyen par personne (FCFA)</label>
                  <input type="number" value={form.prix_moyen} onChange={e => setForm({ ...form, prix_moyen: e.target.value })} placeholder="Ex: 10000" className="w-full bg-slate-50 p-3.5 rounded-xl text-sm border border-slate-200" />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500 ml-1 mb-2 block">Types de cuisine</label>
                  <div className="flex flex-wrap gap-2">
                    {CUISINE_TYPES.map(c => {
                      const active = form.type_cuisine.includes(c.id);
                      return (
                        <button key={c.id} type="button" onClick={() => toggleCuisine(c.id)} className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${active ? "bg-[#0c4a6e] text-white border-[#0c4a6e]" : "bg-white text-slate-600 border-slate-200"}`}>
                          {c.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* SERVICES & MOYENS DE PAIEMENT */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-6 h-px bg-slate-200"></span> 5. Services & Équipements
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {SERVICES_LIST.map(s => {
                    const active = form.services.includes(s.id);
                    return (
                      <button key={s.id} type="button" onClick={() => toggleService(s.id)} className={`flex items-center gap-2 p-3 rounded-xl border text-left text-xs font-semibold transition-all ${active ? "bg-[#0c4a6e]/10 border-[#0c4a6e] text-[#0c4a6e]" : "bg-white border-slate-200 text-slate-600"}`}>
                        <Check size={14} className={active ? "opacity-100" : "opacity-0"} />
                        <span>{s.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* PHOTOS */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-6 h-px bg-slate-200"></span> Photos de l'établissement
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {form.images.map((img, i) => (
                    <UploadBox key={i} index={i} value={img} onChange={(url) => { const n = [...form.images]; n[i] = url; setForm({ ...form, images: n }); }} />
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end gap-3 sticky bottom-0">
              <button onClick={() => setShowModal(false)} className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200/50 rounded-xl">Annuler</button>
              <button onClick={save} className="px-8 py-2.5 bg-[#c9a84c] hover:bg-[#b89943] text-white text-sm font-bold rounded-xl shadow-sm">
                {editId ? "Mettre à jour" : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}