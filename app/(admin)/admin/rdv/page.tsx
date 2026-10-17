"use client";
import { useEffect, useState } from "react";
import { RefreshCw, CalendarDays, Plus, X, Trash2, MapPin, Calendar } from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import ImageUploader from "@/components/admin/ImageUploader";

type Evenement = { id: string; titre: string; categorie: string; date: string; heure: string; lieu: string; ville: string; prix: string; capacite: string; organisateur: string; description: string; image: string; badge: string; badgeColor: string; isActive: boolean; };

const CATEGORIES = ["Festival","Gala","Conference","Fete culturelle","Salon","Sport","Concert","Exposition","Formation","Autre"];
const emptyForm = { titre: "", categorie: "Festival", date: "", heure: "", lieu: "", ville: "", prix: "", capacite: "", organisateur: "", description: "", image: "", badge: "A venir", badgeColor: "bg-blue-500" };

export default function AdminRdvPage() {
  const [evenements, setEvenements] = useState<Evenement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/evenements?all=true", { cache: "no-store" });
    const json = await res.json();
    setEvenements(json.data?.evenements || json.data || []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function saveEvenement() {
    if (!form.titre || !form.date || !form.lieu) return alert("Titre, date, lieu obligatoires");
    setSaving(true);
    const slug = editId || form.titre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const payload = { ...form, slug, image: form.image || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&q=80", isActive: true };
    const res = await fetch(editId ? `/api/evenements/${slug}` : "/api/evenements", { method: editId ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const d = await res.json();
    if (!res.ok) { alert(d.error); setSaving(false); return; }
    await load();
    setShowModal(false); setForm(emptyForm); setEditId(null); setSaving(false);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <main className="w-full lg:ml-72 lg:w-[calc(100%-18rem)] px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-xl sm:text-2xl! font-black text-[#0c4a6e]">Vrais Évènements - Admin</h1>
          <button onClick={() => { setForm(emptyForm); setEditId(null); setShowModal(true); }} className="bg-[#c9a84c] text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 text-sm transition-transform active:scale-95">
            <Plus size={16}/> Ajouter un vrai évènement
          </button>
        </div>

        {loading ? (
          <p className="text-center py-20 text-gray-400"><RefreshCw className="animate-spin mx-auto mb-2"/>Chargement...</p>
        ) : evenements.length === 0 ? (
          <div className="bg-white border border-dashed rounded-2xl py-20 px-4 text-center">
            <CalendarDays size={48} className="mx-auto text-gray-300 mb-3"/>
            <p className="font-bold text-[#0c4a6e]">Aucun évènement</p>
            <p className="text-sm text-gray-400 mt-1">Suppression des faux évènements réussie. Ajoute ton premier vrai évènement.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
            {evenements.map(ev => (
              <div key={ev.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm flex flex-col">
                <img src={ev.image} className="h-40 w-full object-cover" alt="" />
                <div className="p-4 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="font-bold text-[#0c4a6e] text-base mb-1">{ev.titre}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1.5"><Calendar size={12} className="shrink-0 text-[#c9a84c]"/>{ev.date}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5"><MapPin size={12} className="shrink-0 text-[#c9a84c]"/>{ev.lieu}</p>
                  </div>
                  <div className="flex gap-2 mt-4 pt-3 border-t border-gray-50">
                    <button onClick={async () => { if(!confirm("Supprimer ?")) return; await fetch(`/api/evenements/${ev.id}`, {method:"DELETE"}); load(); }} className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg text-xs font-bold flex justify-center items-center gap-1 transition-colors hover:bg-red-100"><Trash2 size={12}/>Supprimer</button>
                    <button onClick={() => { setForm(ev); setEditId(ev.id); setShowModal(true); }} className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg text-xs font-bold transition-colors hover:bg-blue-100">Modifier</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl my-auto">
              <div className="p-4 sm:p-6 border-b border-gray-100 flex justify-between items-center font-bold text-base sm:text-lg text-[#0c4a6e] shrink-0">
                <span>Ajouter un vrai évènement</span>
                <button onClick={() => setShowModal(false)} className="p-1 rounded-lg text-gray-400 hover:bg-gray-100"><X size={20}/></button>
              </div>
              <div className="p-4 sm:p-6 space-y-3.5 overflow-y-auto flex-1">
                <input placeholder="Titre *" value={form.titre} onChange={e => setForm(f=>({...f,titre:e.target.value}))} className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#0c4a6e]"/>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <select value={form.categorie} onChange={e=>setForm(f=>({...f,categorie:e.target.value}))} className="border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-white outline-none focus:border-[#0c4a6e]">{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select>
                  <input placeholder="Date *" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} className="border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#0c4a6e]"/>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input placeholder="Lieu *" value={form.lieu} onChange={e=>setForm(f=>({...f,lieu:e.target.value}))} className="border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#0c4a6e]"/>
                  <input placeholder="Ville" value={form.ville} onChange={e=>setForm(f=>({...f,ville:e.target.value}))} className="border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#0c4a6e]"/>
                </div>
                <textarea placeholder="Description" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} rows={3} className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm resize-none outline-none focus:border-[#0c4a6e]"/>
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-500 mb-1.5">Image de l'événement</label>
                  <ImageUploader value={form.image} onChange={val => setForm(f=>({...f,image:val}))} />
                </div>
              </div>
              <div className="p-4 sm:p-6 border-t border-gray-100 flex gap-3 shrink-0 bg-white">
                <button onClick={()=>setShowModal(false)} className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl text-sm transition-colors hover:bg-gray-50">Annuler</button>
                <button onClick={saveEvenement} disabled={!form.titre || !form.date || !form.lieu || saving} className="flex-1 bg-[#c9a84c] text-white rounded-xl py-2.5 font-bold text-sm transition-colors hover:bg-[#b8973b] disabled:opacity-60">{saving ? "Publication..." : "Publier"}</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}