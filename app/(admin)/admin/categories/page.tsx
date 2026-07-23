"use client";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Wifi, Bath, Wind, Car, UtensilsCrossed, Tv, Waves, BedDouble, Check, Loader2, X, Image as ImageIcon, MapPin, Phone, Mail, Globe, Shield, Zap, Coffee, Droplets, Refrigerator, Building } from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const SERVICES_LIST = [
  { id: "restaurant", label: "Restaurant", icon: UtensilsCrossed },
  { id: "bar", label: "Bar", icon: Coffee },
  { id: "piscine", label: "Piscine", icon: Waves },
  { id: "salle_conference", label: "Salle de conférence", icon: Building },
  { id: "salle_fete", label: "Salle de fête", icon: Building },
  { id: "parking", label: "Parking", icon: Car },
  { id: "blanchisserie", label: "Service de blanchisserie", icon: Check },
  { id: "navette", label: "Navette", icon: Car },
  { id: "petit_dejeuner", label: "Petit déjeuner", icon: Coffee },
  { id: "service_chambre", label: "Service en chambre", icon: Check },
  { id: "securite", label: "Sécurité 24h/24", icon: Shield },
  { id: "groupe_electrogene", label: "Groupe électrogène", icon: Zap },
];

const ROOM_TYPES = [
  { id: "standard", label: "Standard" },
  { id: "vip", label: "VIP" },
  { id: "suite", label: "Suite" },
  { id: "familiale", label: "Familiale" },
];

type HotelData = {
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
  nb_chambres: number | string;
  type_chambre: string[];
  prix_nuit: number | string;
  clim: boolean;
  wifi: boolean;
  television: boolean;
  eau_chaude: boolean;
  refrigirateur: boolean;
  services: string[];
  images: string[];
  image: string;
};

const emptyForm: HotelData = {
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
  nb_chambres: "",
  type_chambre: [],
  prix_nuit: "",
  clim: false,
  wifi: false,
  television: false,
  eau_chaude: false,
  refrigirateur: false,
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
      const fileName = `hotel_${Date.now()}_${index}_${Math.random().toString(36).slice(2)}.${ext}`;
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

export default function AdminHotelsPage() {
  const [hotels, setHotels] = useState<HotelData[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<HotelData>(emptyForm);

  useEffect(() => { 
    fetch('/api/categories').then(r => r.json()).then(d => setHotels(d.data || [])); 
  }, []);

  function toggleService(id: string) {
    setForm(prev => ({
      ...prev,
      services: prev.services.includes(id) ? prev.services.filter(s => s !== id) : [...prev.services, id]
    }));
  }

  function toggleRoomType(id: string) {
    setForm(prev => ({
      ...prev,
      type_chambre: prev.type_chambre.includes(id) ? prev.type_chambre.filter(t => t !== id) : [...prev.type_chambre, id]
    }));
  }

  async function save() {
    if (!form.nom || !form.ville) return alert("Le nom de l'hôtel et la ville sont requis.");
    if (!form.images[0]) return alert("Au moins la première photo est requise.");
    
    const payload = { ...form, image: form.images[0], title: form.nom, type: "hotel" };
    const res = await fetch(editId ? `/api/categories/${editId}` : "/api/categories", { 
      method: editId ? "PATCH" : "POST", 
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify(payload) 
    });
    
    if (res.ok) {
      const { data } = await res.json();
      setHotels(p => editId ? p.map(c => c.id === editId ? data : c) : [...p, data]);
      setShowModal(false); 
      setEditId(null);
      setForm(emptyForm);
    } else { 
      alert("Erreur lors de la sauvegarde."); 
    }
  }

  async function remove(id: string) { 
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) return; 
    const r = await fetch(`/api/categories/${id}`, { method: "DELETE" }); 
    if (r.ok) setHotels(p => p.filter(c => c.id !== id)); 
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <AdminNavbar />
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-[#0c4a6e] tracking-tight">Hôtels & Résidences</h1>
            <p className="text-sm text-slate-500 mt-1">Gérez les établissements hôteliers et leurs caractéristiques.</p>
          </div>
          <button 
            onClick={() => { setEditId(null); setForm(emptyForm); setShowModal(true); }} 
            className="bg-[#0c4a6e] hover:bg-[#0c4a6e]/90 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus size={18} strokeWidth={2.5} /> Nouvel Hôtel / Résidence
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {hotels.map(h => (
            <div key={h.id} className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
              <div className="h-48 bg-slate-100 relative overflow-hidden">
                <img src={h.images?.[0] || h.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={h.nom} />
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditId(h.id); setForm({ ...emptyForm, ...h, images: h.images?.length ? [...h.images, "", "", ""].slice(0, 4) : [h.image || "", "", "", ""] }); setShowModal(true); }} className="p-2 bg-white/90 text-[#0c4a6e] rounded-full shadow-sm">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => remove(h.id)} className="p-2 bg-white/90 text-rose-600 rounded-full shadow-sm">
                    <Trash2 size={15} />
                  </button>
                </div>
                <div className="absolute bottom-3 left-3">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur text-[#0c4a6e] text-xs font-bold rounded-lg shadow-sm">
                    {h.ville}
                  </span>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-slate-800 text-lg truncate mb-1">{h.nom}</h3>
                <p className="text-xs text-slate-400 mb-2">{h.quartier || h.adresse}</p>
                {h.prix_nuit && <p className="text-xs text-[#c9a84c] font-bold mb-3">{h.prix_nuit} FCFA / nuit</p>}
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
                {editId ? "Modifier l'établissement" : "Nouvel établissement"}
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
                  <label className="text-xs font-semibold text-slate-500 ml-1">Nom de l'hôtel ou de la résidence *</label>
                  <input value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} placeholder="Ex: Résidence Akwaba" className="w-full bg-slate-50 p-3.5 rounded-xl text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0c4a6e]/20" />
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
                    <input value={form.adresse} onChange={e => setForm({ ...form, adresse: e.target.value })} placeholder="Ex: Rue du commerce" className="w-full bg-slate-50 p-3.5 rounded-xl text-sm border border-slate-200" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 ml-1">Quartier ou village</label>
                    <input value={form.quartier} onChange={e => setForm({ ...form, quartier: e.target.value })} placeholder="Ex: Marcory Zone 4" className="w-full bg-slate-50 p-3.5 rounded-xl text-sm border border-slate-200" />
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
                    <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="contact@hotel.com" className="w-full bg-slate-50 p-3.5 rounded-xl text-sm border border-slate-200" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-500 ml-1">Site internet (si disponible)</label>
                    <input value={form.site_internet} onChange={e => setForm({ ...form, site_internet: e.target.value })} placeholder="https://www.hotel.com" className="w-full bg-slate-50 p-3.5 rounded-xl text-sm border border-slate-200" />
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

              {/* HEBERGEMENT */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-6 h-px bg-slate-200"></span> 4. Hébergement
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 ml-1">Nombre de chambres</label>
                    <input type="number" value={form.nb_chambres} onChange={e => setForm({ ...form, nb_chambres: e.target.value })} placeholder="Ex: 25" className="w-full bg-slate-50 p-3.5 rounded-xl text-sm border border-slate-200" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 ml-1">Prix par nuit (FCFA)</label>
                    <input type="number" value={form.prix_nuit} onChange={e => setForm({ ...form, prix_nuit: e.target.value })} placeholder="Ex: 35000" className="w-full bg-slate-50 p-3.5 rounded-xl text-sm border border-slate-200" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500 ml-1 mb-2 block">Types de chambres</label>
                  <div className="flex flex-wrap gap-2">
                    {ROOM_TYPES.map(t => {
                      const active = form.type_chambre.includes(t.id);
                      return (
                        <button key={t.id} type="button" onClick={() => toggleRoomType(t.id)} className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${active ? "bg-[#0c4a6e] text-white border-[#0c4a6e]" : "bg-white text-slate-600 border-slate-200"}`}>
                          {t.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  {[
                    { id: "clim", label: "Climatisation" },
                    { id: "wifi", label: "WiFi" },
                    { id: "television", label: "Télévision" },
                    { id: "eau_chaude", label: "Eau chaude" },
                    { id: "refrigirateur", label: "Réfrigérateur" },
                  ].map(item => (
                    <label key={item.id} className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                      <input type="checkbox" checked={!!(form as any)[item.id]} onChange={e => setForm({ ...form, [item.id]: e.target.checked })} className="rounded text-[#0c4a6e] focus:ring-[#0c4a6e]" />
                      <span className="text-xs font-semibold text-slate-700">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* SERVICES */}
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