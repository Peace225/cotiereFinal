"use client";

import { useEffect, useState } from "react";
import { RefreshCw, CalendarDays, Plus, X, Trash2, MapPin, Calendar, Video, Image as ImageIcon, Upload, Loader2 } from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import ImageUploader from "@/components/admin/ImageUploader";

type Evenement = { 
  id: string; titre: string; categorie: string; date: string; heure: string; 
  lieu: string; ville: string; prix: string; capacite: string; organisateur: string; 
  description: string; image: string; videoUrl?: string; badge: string; badgeColor: string; isActive: boolean; 
};

const CATEGORIES = ["Festival","Gala","Conference","Fete culturelle","Salon","Sport","Concert","Exposition","Formation","Autre"];
const MOIS_LIST = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

const emptyForm = { 
  titre: "", categorie: "Festival", 
  jour: "14", mois: "Mai", annee: "2026",
  date: "14 Mai 2026", 
  heure: "", lieu: "", ville: "", prix: "", capacite: "", organisateur: "", description: "", image: "", videoUrl: "", badge: "A venir", badgeColor: "bg-blue-500" 
};

function VideoUploader({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const json = await res.json();
      
      // Lecture compatible avec le format { data: { url } } renvoyé par ok()
      const uploadedUrl = json.data?.url || json.url || json.data?.urls?.[0] || json.urls?.[0];

      if (res.ok && uploadedUrl) {
        onChange(uploadedUrl);
      } else {
        alert(json.error || json.message || "Erreur lors de l'upload de la vidéo");
      }
    } catch {
      alert("Erreur réseau lors de l'upload.");
    }
    setUploading(false);
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <input type="url" placeholder="https://... ou uploadez un fichier" value={value} onChange={e => onChange(e.target.value)} className="flex-1 border border-gray-200 rounded-xl px-3.5 py-2 text-sm outline-none focus:border-[#0c4a6e]" />
        <label className="cursor-pointer bg-[#0c4a6e] hover:bg-[#0c4a6e]/90 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0">
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          <span>{uploading ? "Envoi..." : "Uploader"}</span>
          <input type="file" accept="video/mp4,video/webm,video/quicktime" onChange={handleFileChange} className="hidden" />
        </label>
      </div>
      {value && (
        <div className="relative rounded-xl overflow-hidden bg-black h-32 flex items-center justify-center border">
          <video src={value} controls className="w-full h-full object-contain" />
          <button type="button" onClick={() => onChange("")} className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full"><X size={12} /></button>
        </div>
      )}
    </div>
  );
}

export default function AdminRdvPage() {
  const [evenements, setEvenements] = useState<Evenement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/evenements?all=true", { cache: "no-store" });
      const json = await res.json();
      setEvenements(json.data?.evenements || json.data || []);
    } catch {}
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function handleDateChange(field: "jour" | "mois" | "annee", value: string) {
    setForm(prev => {
      const updated = { ...prev, [field]: value };
      updated.date = `${updated.jour} ${updated.mois} ${updated.annee}`;
      return updated;
    });
  }

  function handleOpenEdit(ev: Evenement) {
    let j = "1", m = "Janvier", a = "2026";
    if (ev.date) {
      const parts = ev.date.split(" ");
      if (parts.length >= 3) { j = parts[0]; m = parts[parts.length - 2]; a = parts[parts.length - 1]; }
    }
    setForm({
      titre: ev.titre || "", categorie: ev.categorie || "Festival",
      jour: j, mois: MOIS_LIST.includes(m) ? m : "Mai", annee: a.length === 4 ? a : "2026",
      date: ev.date || "", heure: ev.heure || "", lieu: ev.lieu || "", ville: ev.ville || "",
      prix: ev.prix || "", capacite: ev.capacite || "", organisateur: ev.organisateur || "",
      description: ev.description || "", image: ev.image || "", videoUrl: ev.videoUrl || "",
      badge: ev.badge || "A venir", badgeColor: ev.badgeColor || "bg-blue-500",
    });
    setEditId(ev.id);
    setShowModal(true);
  }

  async function saveEvenement() {
    if (!form.titre || !form.date || !form.lieu) return alert("Titre, date et lieu obligatoires");
    setSaving(true);
    const newSlug = form.titre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const payload: any = { ...form, image: form.image || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&q=80", isActive: true };
    if (!editId) payload.slug = newSlug;
    else delete payload.slug;

    const res = await fetch(editId ? `/api/evenements/${editId}` : "/api/evenements", { 
      method: editId ? "PATCH" : "POST", 
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify(payload) 
    });
    const d = await res.json();
    if (!res.ok) { alert(d.error || "Erreur"); setSaving(false); return; }
    await load();
    setShowModal(false); setForm(emptyForm); setEditId(null); setSaving(false);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <main className="w-full lg:ml-72 lg:w-[calc(100%-18rem)] px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-xl sm:text-2xl font-black text-[#0c4a6e]">Vrais Évènements - Admin</h1>
          <button onClick={() => { setForm(emptyForm); setEditId(null); setShowModal(true); }} className="bg-[#c9a84c] text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 text-sm">
            <Plus size={16}/> Ajouter un vrai évènement
          </button>
        </div>

        {loading ? (
          <p className="text-center py-20 text-gray-400"><RefreshCw className="animate-spin mx-auto mb-2"/>Chargement...</p>
        ) : evenements.length === 0 ? (
          <div className="bg-white border border-dashed rounded-2xl py-20 px-4 text-center">
            <CalendarDays size={48} className="mx-auto text-gray-300 mb-3"/>
            <p className="font-bold text-[#0c4a6e]">Aucun évènement</p>
            <p className="text-sm text-gray-400 mt-1">Ajoutez votre premier vrai évènement avec images et vidéos.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
            {evenements.map(ev => (
              <div key={ev.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm flex flex-col">
                <div className="relative h-40 bg-gray-100">
                  <img src={ev.image} className="w-full h-full object-cover" alt="" />
                  {ev.videoUrl && <span className="absolute top-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1"><Video size={10} /> Vidéo</span>}
                </div>
                <div className="p-4 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="font-bold text-[#0c4a6e] text-base mb-1">{ev.titre}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1.5"><Calendar size={12} className="text-[#c9a84c]"/>{ev.date}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5"><MapPin size={12} className="text-[#c9a84c]"/>{ev.lieu}</p>
                  </div>
                  <div className="flex gap-2 mt-4 pt-3 border-t border-gray-50">
                    <button onClick={async () => { if(!confirm("Supprimer ?")) return; await fetch(`/api/evenements/${ev.id}`, {method:"DELETE"}); load(); }} className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg text-xs font-bold flex justify-center items-center gap-1"><Trash2 size={12}/>Supprimer</button>
                    <button onClick={() => handleOpenEdit(ev)} className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg text-xs font-bold">Modifier</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl my-auto">
              <div className="p-4 sm:p-6 border-b flex justify-between items-center font-bold text-lg text-[#0c4a6e]">
                <span>{editId ? "Modifier" : "Ajouter un vrai évènement"}</span>
                <button onClick={() => setShowModal(false)} className="p-1 rounded-lg text-gray-400 hover:bg-gray-100"><X size={20}/></button>
              </div>
              <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
                <input placeholder="Titre *" value={form.titre} onChange={e => setForm(f=>({...f,titre:e.target.value}))} className="w-full border rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#0c4a6e]"/>
                <div className="grid grid-cols-2 gap-3">
                  <select value={form.categorie} onChange={e=>setForm(f=>({...f,categorie:e.target.value}))} className="border rounded-xl px-3.5 py-2.5 text-sm bg-white outline-none">
                    {CATEGORIES.map(c=><option key={c}>{c}</option>)}
                  </select>
                  <input placeholder="Lieu *" value={form.lieu} onChange={e=>setForm(f=>({...f,lieu:e.target.value}))} className="border rounded-xl px-3.5 py-2.5 text-sm outline-none"/>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border space-y-2">
                  <label className="block text-xs font-semibold uppercase text-gray-500">Date</label>
                  <div className="grid grid-cols-3 gap-2">
                    <select value={form.jour} onChange={e => handleDateChange("jour", e.target.value)} className="border rounded-lg px-2 py-2 text-sm bg-white">
                      {Array.from({length:31},(_,i)=>i+1).map(j=><option key={j} value={String(j)}>{j}</option>)}
                    </select>
                    <select value={form.mois} onChange={e => handleDateChange("mois", e.target.value)} className="border rounded-lg px-2 py-2 text-sm bg-white">
                      {MOIS_LIST.map(m=><option key={m} value={m}>{m}</option>)}
                    </select>
                    <input type="text" value={form.annee} onChange={e => handleDateChange("annee", e.target.value)} className="border rounded-lg px-2 py-2 text-sm bg-white"/>
                  </div>
                  <p className="text-xs text-[#c9a84c] font-medium">Aperçu : {form.date}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input placeholder="Ville" value={form.ville} onChange={e=>setForm(f=>({...f,ville:e.target.value}))} className="border rounded-xl px-3.5 py-2.5 text-sm outline-none"/>
                  <input placeholder="Prix" value={form.prix} onChange={e=>setForm(f=>({...f,prix:e.target.value}))} className="border rounded-xl px-3.5 py-2.5 text-sm outline-none"/>
                </div>
                <textarea placeholder="Description..." value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} rows={3} className="w-full border rounded-xl px-3.5 py-2.5 text-sm resize-none outline-none"/>
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-500 mb-1.5 flex items-center gap-1"><ImageIcon size={14} className="text-[#c9a84c]" /> Image principale</label>
                  <ImageUploader value={form.image} onChange={val => setForm(f=>({...f,image:val}))} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-500 mb-1.5 flex items-center gap-1"><Video size={14} className="text-[#c9a84c]" /> Vidéo (Optionnel)</label>
                  <VideoUploader value={form.videoUrl || ""} onChange={url => setForm(f=>({...f, videoUrl: url}))} />
                </div>
              </div>
              <div className="p-4 sm:p-6 border-t flex gap-3 bg-white">
                <button onClick={()=>setShowModal(false)} className="flex-1 border text-gray-600 font-semibold py-2.5 rounded-xl text-sm">Annuler</button>
                <button onClick={saveEvenement} disabled={!form.titre || !form.date || !form.lieu || saving} className="flex-1 bg-[#c9a84c] text-white rounded-xl py-2.5 font-bold text-sm disabled:opacity-60">{saving ? "Publication..." : "Publier"}</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}