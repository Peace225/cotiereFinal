"use client";
import { useEffect, useState } from "react";
import { MapPin, Plus, Trash2, Pencil, X, RefreshCw, Hotel, Home, Waves, UtensilsCrossed, Landmark, Bus } from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import ImageUploader from "@/components/admin/ImageUploader";

const VILLES = [
  { slug: "aboisso", nom: "Aboisso" }, { slug: "adiake", nom: "Adiaké" },
  { slug: "assinie-mafia", nom: "Assinie-Mafia" }, { slug: "grand-bassam", nom: "Grand-Bassam" },
  { slug: "abidjan", nom: "Abidjan" }, { slug: "jacqueville", nom: "Jacqueville" },
  { slug: "dabou", nom: "Dabou" }, { slug: "grand-lahou", nom: "Grand-Lahou" },
  { slug: "fresco", nom: "Fresco" }, { slug: "sassandra", nom: "Sassandra" },
  { slug: "san-pedro", nom: "San-Pédro" }, { slug: "grand-bereby", nom: "Grand-Béréby" },
  { slug: "tabou", nom: "Tabou" },
];

const CATEGORIES = [
  { id: "hotels", label: "Hôtels", icon: Hotel },
  { id: "residences", label: "Résidences", icon: Home },
  { id: "plages", label: "Plages", icon: Waves },
  { id: "restaurants", label: "Restaurants", icon: UtensilsCrossed },
  { id: "sites", label: "Sites touristiques", icon: Landmark },
  { id: "transport", label: "Transport", icon: Bus },
];

type Contenu = {
  id: string; nom: string; description?: string; adresse?: string;
  telephone?: string; whatsapp?: string; siteWeb?: string;
  image?: string; prix?: string; note?: number; isActive: boolean;
};

const emptyForm = { nom: "", description: "", adresse: "", telephone: "", whatsapp: "", siteWeb: "", image: "", prix: "", note: "" };

export default function AdminVillesPage() {
  const [selectedVille, setSelectedVille] = useState(VILLES[0].slug);
  const [selectedCat, setSelectedCat] = useState("hotels");
  const [contenus, setContenus] = useState<Contenu[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`/api/villes/${selectedVille}/${selectedCat}`);
      const data = await res.json();
      setContenus(data.data ?? []);
    } catch {}
    setLoading(false);
  }

  useEffect(() => { load(); }, [selectedVille, selectedCat]);

  async function save() {
    if (!form.nom) return;
    setSaving(true);
    try {
      const body = { ...form, note: form.note ? parseFloat(form.note) : undefined };
      if (editId) {
        const res = await fetch(`/api/villes/${selectedVille}/${selectedCat}/${editId}`, {
          method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
        });
        const data = await res.json();
        if (res.ok) setContenus(prev => prev.map(c => c.id === editId ? data.data : c));
      } else {
        const res = await fetch(`/api/villes/${selectedVille}/${selectedCat}`, {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
        });
        const data = await res.json();
        if (res.ok) setContenus(prev => [...prev, data.data]);
      }
      setShowModal(false); setForm(emptyForm); setEditId(null);
    } catch {}
    setSaving(false);
  }

  async function remove(id: string) {
    if (!confirm("Supprimer cet élément ?")) return;
    await fetch(`/api/villes/${selectedVille}/${selectedCat}/${id}`, { method: "DELETE" });
    setContenus(prev => prev.filter(c => c.id !== id));
  }

  function openEdit(c: Contenu) {
    setForm({ nom: c.nom, description: c.description ?? "", adresse: c.adresse ?? "", telephone: c.telephone ?? "", whatsapp: c.whatsapp ?? "", siteWeb: c.siteWeb ?? "", image: c.image ?? "", prix: c.prix ?? "", note: c.note?.toString() ?? "" });
    setEditId(c.id); setShowModal(true);
  }

  const villeNom = VILLES.find(v => v.slug === selectedVille)?.nom ?? selectedVille;
  const catLabel = CATEGORIES.find(c => c.id === selectedCat)?.label ?? selectedCat;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0c4a6e] rounded-xl flex items-center justify-center">
              <MapPin size={20} className="text-[#c9a84c]" />
            </div>
            <h1 className="text-2xl font-black text-[#0c4a6e]">Contenus par Ville</h1>
          </div>
          <button onClick={() => { setEditId(null); setForm(emptyForm); setShowModal(true); }}
            className="flex items-center gap-2 bg-[#c9a84c] hover:bg-[#b8973b] text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors shadow-md">
            <Plus size={15} /> Ajouter
          </button>
        </div>

        {/* Sélecteurs */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ville</label>
            <select value={selectedVille} onChange={e => setSelectedVille(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#c9a84c]">
              {VILLES.map(v => <option key={v.slug} value={v.slug}>{v.nom}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Catégorie</label>
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map(c => {
                const Icon = c.icon;
                return (
                  <button key={c.id} onClick={() => setSelectedCat(c.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${selectedCat === c.id ? "bg-[#0c4a6e] text-white" : "bg-white text-gray-500 border border-gray-200 hover:border-[#0c4a6e]/30"}`}>
                    <Icon size={13} /> {c.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Titre section */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-[#0c4a6e]">{catLabel} à {villeNom} <span className="text-gray-400 font-normal text-sm">({contenus.length})</span></h2>
          <button onClick={load} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#0c4a6e] transition-colors">
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Actualiser
          </button>
        </div>

        {/* Grille */}
        {loading ? (
          <div className="py-16 text-center text-gray-400"><RefreshCw size={28} className="animate-spin mx-auto mb-2" /> Chargement...</div>
        ) : contenus.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-400 mb-3">Aucun contenu pour {catLabel} à {villeNom}</p>
            <button onClick={() => { setEditId(null); setForm(emptyForm); setShowModal(true); }}
              className="inline-flex items-center gap-2 bg-[#c9a84c] text-white font-semibold px-4 py-2 rounded-xl text-sm">
              <Plus size={14} /> Ajouter le premier
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {contenus.map(c => (
              <div key={c.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <div className="relative h-36 bg-gray-100">
                  {c.image ? (
                    <img src={c.image} alt={c.nom} className="w-full h-full object-cover"
                      onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <MapPin size={32} />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-[#0c4a6e] mb-1">{c.nom}</h3>
                  {c.adresse && <p className="text-xs text-gray-400 mb-1">{c.adresse}</p>}
                  {c.prix && <p className="text-xs text-[#c9a84c] font-semibold mb-2">{c.prix}</p>}
                  {c.description && <p className="text-xs text-gray-500 line-clamp-2 mb-3">{c.description}</p>}
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(c)}
                      className="flex-1 flex items-center justify-center gap-1 text-xs font-bold py-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors">
                      <Pencil size={12} /> Modifier
                    </button>
                    <button onClick={() => remove(c.id)}
                      className="flex-1 flex items-center justify-center gap-1 text-xs font-bold py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors">
                      <Trash2 size={12} /> Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
              <h3 className="font-bold text-[#0c4a6e] text-lg">{editId ? "Modifier" : "Ajouter"} — {catLabel} à {villeNom}</h3>
              <button onClick={() => { setShowModal(false); setEditId(null); setForm(emptyForm); }} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-3 overflow-y-auto">
              {[
                { key: "nom", label: "Nom *", placeholder: "Ex: Hôtel Ivoire" },
                { key: "adresse", label: "Adresse", placeholder: "Ex: Cocody, Abidjan" },
                { key: "telephone", label: "Téléphone", placeholder: "+225 07 XX XX XX XX" },
                { key: "whatsapp", label: "WhatsApp", placeholder: "+2250747722931" },
                { key: "siteWeb", label: "Site web", placeholder: "https://..." },
                { key: "prix", label: "Prix / Tarif", placeholder: "Ex: À partir de 25 000 FCFA" },
                { key: "note", label: "Note (0-5)", placeholder: "Ex: 4.5" },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
                  <input type={key === "note" ? "number" : "text"} placeholder={placeholder}
                    value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    step={key === "note" ? "0.1" : undefined} min={key === "note" ? "0" : undefined} max={key === "note" ? "5" : undefined}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                <textarea rows={2} placeholder="Description courte..." value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8] resize-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Image</label>
                <ImageUploader value={form.image} onChange={val => setForm(f => ({ ...f, image: val }))} maxFiles={1} />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3 shrink-0">
              <button onClick={() => { setShowModal(false); setEditId(null); setForm(emptyForm); }}
                className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50">Annuler</button>
              <button onClick={save} disabled={!form.nom || saving}
                className="flex-1 bg-[#c9a84c] hover:bg-[#b8973b] text-white font-bold py-2.5 rounded-xl disabled:opacity-60">
                {saving ? "Enregistrement..." : editId ? "Modifier" : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
