"use client";

import { useCallback, useEffect, useState, type FormEvent, type ChangeEvent } from "react";
import { Building2, MapPin, Plus, Loader2, RefreshCw, X, Phone, Wifi, ImagePlus, Trash2, BedDouble, Search, Edit3, Ban, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import { createClient } from "@/lib/supabase/client";

type ResidenceData = {
  id: string; 
  nom?: string; 
  title?: string; 
  ville?: string; 
  quartier?: string; 
  adresse?: string;
  telephone?: string; 
  whatsapp?: string; 
  email?: string;
  site_internet?: string;
  localisation_maps?: string;
  description?: string;
  prix_nuit?: number | string | null; 
  nb_chambres?: number | null;
  type_chambre?: string[];
  image?: string | null; 
  images?: string[]; 
  type?: string; 
  wifi?: boolean;
  clim?: boolean;
  television?: boolean;
  eau_chaude?: boolean;
  refrigirateur?: boolean;
  services?: string[];
  isActive?: boolean;
};

type ResidenceForm = {
  nom: string; ville: string; adresse: string; quartier: string; telephone: string; whatsapp: string;
  email: string; site_internet: string; localisation_maps: string; description: string;
  prix_nuit: string; nb_chambres: string; type_chambre: string; services: string[];
  clim: boolean; wifi: boolean; television: boolean; eau_chaude: boolean; refrigirateur: boolean;
};

const INITIAL_FORM: ResidenceForm = {
  nom: "", ville: "", adresse: "", quartier: "", telephone: "", whatsapp: "", email: "", site_internet: "",
  localisation_maps: "", description: "", prix_nuit: "", nb_chambres: "", type_chambre: "", services: [],
  clim: false, wifi: false, television: false, eau_chaude: false, refrigirateur: false,
};

const SERVICES = ["Restaurant","Piscine","Parking","Ménage","Salle de sport","Spa","Navette aéroport","Conciergerie","Service de logement","Blanchisserie"];
function formatPrice(v: unknown) { if (v===null||v===undefined||v==="") return "Prix non renseigné"; const n=Number(v); return Number.isFinite(n)? `${n.toLocaleString("fr-FR")} FCFA / nuit` : "Prix non renseigné"; }

// Composant de carte avec carrousel d'images intégré et design 100% rectangulaire sans arrondis
function AdminResidenceCard({ r, onEdit, onToggleBlock, onDelete }: { r: ResidenceData; onEdit: (res: ResidenceData) => void; onToggleBlock: (res: ResidenceData) => void; onDelete: (id: string, name?: string) => void }) {
  const [currentImg, setCurrentImg] = useState(0);
  const images = r.images && r.images.length > 0 ? r.images.filter(Boolean) : (r.image ? [r.image] : []);
  const isBlocked = r.isActive === false;

  const nextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (images.length > 1) setCurrentImg((prev) => (prev + 1) % images.length);
  };

  const prevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (images.length > 1) setCurrentImg((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <article className={`group relative overflow-hidden rounded-none border bg-white shadow-sm transition ${isBlocked ? "opacity-60 bg-slate-50 border-red-200" : "border-slate-200"}`}>
      <div className="relative h-48 bg-slate-100 rounded-none">
        {images.length > 0 ? (
          <img src={images[currentImg]} alt={r.nom || r.title || "Résidence"} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center"><Building2 size={42} className="text-slate-300" /></div>
        )}

        {isBlocked && <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-none uppercase tracking-wider z-10">Bloqué</span>}

        {/* Contrôles du carrousel sur la carte si plusieurs images */}
        {images.length > 1 && (
          <>
            <button type="button" onClick={prevImg} className="absolute left-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center bg-black/50 text-white hover:bg-black/80 transition z-10"><ChevronLeft size={16} /></button>
            <button type="button" onClick={nextImg} className="absolute right-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center bg-black/50 text-white hover:bg-black/80 transition z-10"><ChevronRight size={16} /></button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
              {images.map((_, i) => (
                <span key={i} className={`h-1 transition-all ${i === currentImg ? "w-4 bg-white" : "w-1.5 bg-white/60"}`} />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="space-y-3 p-5">
        <h3 className="text-lg font-bold text-[#0c4a6e]">{r.nom || r.title || "Sans nom"}</h3>
        <p className="flex items-center gap-2 text-sm text-slate-500"><MapPin size={15} />{[r.quartier, r.ville].filter(Boolean).join(", ") || "Non renseigné"}</p>
        {r.telephone && <p className="flex items-center gap-2 text-sm text-slate-500"><Phone size={15} />{r.telephone}</p>}
        {r.wifi && <p className="flex items-center gap-2 text-xs text-slate-500"><Wifi size={15} />Wi-Fi</p>}
        <div className="border-t pt-3">
          <p className="text-sm font-bold text-[#0c4a6e]">{formatPrice(r.prix_nuit)}</p>
          {r.nb_chambres != null && <p className="mt-1 flex items-center gap-2 text-xs text-slate-500"><BedDouble size={14} />{r.nb_chambres} logement(s)</p>}
        </div>

        {/* BOUTONS D'ADMINISTRATION : MODIFIER, BLOQUER/DÉBLOQUER, SUPPRIMER */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          <button type="button" onClick={() => onEdit(r)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0c4a6e] hover:underline">
            <Edit3 size={15} /> Modifier
          </button>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => onToggleBlock(r)} className={`inline-flex items-center gap-1 text-xs font-semibold ${isBlocked ? "text-green-600 hover:underline" : "text-amber-600 hover:underline"}`} title={isBlocked ? "Débloquer" : "Bloquer"}>
              {isBlocked ? <CheckCircle size={15} /> : <Ban size={15} />}
              {isBlocked ? "Débloquer" : "Bloquer"}
            </button>
            <button type="button" onClick={() => onDelete(r.id, r.nom || r.title)} className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:underline">
              <Trash2 size={15} /> Supprimer
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function ResidencesPage() {
  const [residences, setResidences] = useState<ResidenceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<ResidenceForm>(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedImages, setSelectedImages] = useState<{ file: File; preview: string }[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const loadResidences = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/categories?type=residence", { cache: "no-store", credentials: "include" });
      const result = await res.json();
      if (!res.ok) throw new Error(result.details || result.error || `HTTP ${res.status}`);
      const items: ResidenceData[] = Array.isArray(result.data)? result.data : [];
      setResidences(items.filter((i) => i.type === "residence"));
    } catch (err) { setError(err instanceof Error? err.message : "Impossible de charger."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void loadResidences(); }, [loadResidences]);
  useEffect(() => {
    if (!showModal) return;
    const onEsc = (e: KeyboardEvent) => { if (e.key==="Escape"&&!saving) setShowModal(false); };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [showModal, saving]);

  function openModal(residenceToEdit?: ResidenceData) {
    setSaveError(""); setSuccess(""); setUploadProgress("");
    if (residenceToEdit) {
      setEditingId(residenceToEdit.id);
      setForm({
        nom: residenceToEdit.nom || residenceToEdit.title || "",
        ville: residenceToEdit.ville || "",
        adresse: residenceToEdit.adresse || "",
        quartier: residenceToEdit.quartier || "",
        telephone: residenceToEdit.telephone || "",
        whatsapp: residenceToEdit.whatsapp || "",
        email: (residenceToEdit as any).email || "",
        site_internet: (residenceToEdit as any).site_internet || "",
        localisation_maps: (residenceToEdit as any).localisation_maps || "",
        description: residenceToEdit.description || "",
        prix_nuit: residenceToEdit.prix_nuit != null ? String(residenceToEdit.prix_nuit) : "",
        nb_chambres: residenceToEdit.nb_chambres != null ? String(residenceToEdit.nb_chambres) : "",
        type_chambre: Array.isArray(residenceToEdit.type_chambre) ? residenceToEdit.type_chambre.join(", ") : "",
        services: Array.isArray(residenceToEdit.services) ? residenceToEdit.services : [],
        clim: !!residenceToEdit.clim,
        wifi: !!residenceToEdit.wifi,
        television: !!residenceToEdit.television,
        eau_chaude: !!residenceToEdit.eau_chaude,
        refrigirateur: !!residenceToEdit.refrigirateur,
      });
      const imgs = residenceToEdit.images || (residenceToEdit.image ? [residenceToEdit.image] : []);
      setExistingImages(imgs);
      setSelectedImages([]);
    } else {
      setEditingId(null);
      setForm(INITIAL_FORM);
      setExistingImages([]);
      setSelectedImages((prev) => { prev.forEach((i) => URL.revokeObjectURL(i.preview)); return []; });
    }
    setShowModal(true);
  }

  function closeModal() {
    if (saving) return;
    setShowModal(false);
    setSelectedImages((prev) => { prev.forEach((i) => URL.revokeObjectURL(i.preview)); return []; });
    setSaveError("");
  }

  function updateField<K extends keyof ResidenceForm>(k: K, v: ResidenceForm[K]) { setForm((p)=>({...p,[k]:v})); }
  function toggleService(s: string) { setForm((p)=>({...p, services: p.services.includes(s)? p.services.filter((i)=>i!==s) : [...p.services,s]})); }
  
  function selectImages(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files??[]); e.target.value=""; if (!files.length) return;
    const accepted=["image/jpeg","image/png","image/webp","image/avif"]; const max=5*1024*1024;
    if (files.some((f)=>!accepted.includes(f.type)||f.size>max||!f.size)) { setSaveError("JPG, PNG, WebP ou AVIF 5 Mo max."); return; }
    if (existingImages.length + selectedImages.length + files.length > 4) { setSaveError("4 photos max au total."); return; }
    setSaveError(""); setSelectedImages((p)=>[...p,...files.map((file)=>({file, preview: URL.createObjectURL(file)}))]);
  }
  
  function removeSelectedImage(i: number) { setSelectedImages((p)=>{ const t=p[i]; if(t) URL.revokeObjectURL(t.preview); return p.filter((_,idx)=>idx!==i); }); }
  function removeExistingImage(index: number) { setExistingImages((prev) => prev.filter((_, i) => i !== index)); }

  async function uploadImage(file: File): Promise<string> {
    const body=new FormData(); body.append("file",file);
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const headers: Record<string, string> = {};
    if (session?.access_token) { headers["Authorization"] = `Bearer ${session.access_token}`; }

    const res=await fetch("/api/admin/residences/upload",{ method:"POST", credentials:"include", headers, body });
    const result=await res.json().catch(()=>({}));
    if(res.status===401) throw new Error("Authentification requise. Reconnecte-toi sur /connexion.");
    if(!res.ok||typeof result.url!=="string") throw new Error(result.error||`Upload ${res.status}`);
    return result.url;
  }

  async function handleSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); if(saving) return; setSaving(true); setSaveError(""); setSuccess("");
    try {
      const newImages: string[]=[]; 
      for(const [idx,sel] of selectedImages.entries()){ 
        setUploadProgress(`Envoi ${idx+1}/${selectedImages.length}...`); 
        newImages.push(await uploadImage(sel.file)); 
      }
      setUploadProgress("Enregistrement...");

      const allImages = [...existingImages, ...newImages];
      
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (session?.access_token) { headers["Authorization"] = `Bearer ${session.access_token}`; }

      const payload={
        ...form,
        id: editingId || crypto.randomUUID(),
        updatedAt: new Date(),
        nom:form.nom.trim(),
        title:form.nom.trim(),
        ville:form.ville.trim(),
        type:"residence",
        prix_nuit:form.prix_nuit===""?null:Number(form.prix_nuit),
        nb_chambres:form.nb_chambres===""?null:Number(form.nb_chambres),
        type_chambre:form.type_chambre?[form.type_chambre]:[],
        images: allImages,
        image: allImages[0]??null,
        isActive: true,
      };

      const endpoint = editingId ? `/api/categories/${editingId}` : "/api/categories";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        credentials: "include",
        headers,
        body: JSON.stringify(payload)
      });
      const result = await res.json().catch(()=>({})); 
      if(res.status===401) throw new Error("Session expirée. Va sur /connexion."); 
      if(!res.ok) throw new Error(result.details||result.error||"Impossible d'enregistrer.");

      setShowModal(false); 
      selectedImages.forEach((i)=>URL.revokeObjectURL(i.preview)); 
      setSelectedImages([]); 
      setSuccess(editingId ? "Résidence modifiée avec succès." : "Résidence enregistrée avec succès."); 
      await loadResidences();
    } catch(err){ 
      setSaveError(err instanceof Error? err.message : "Erreur."); 
    } finally { 
      setSaving(false); 
      setUploadProgress(""); 
    }
  }

  async function handleDelete(id: string, name?: string) {
    if (!confirm(`Voulez-vous vraiment supprimer "${name || 'cette résidence'}" ?`)) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Suppression impossible.");
      setSuccess("Résidence supprimée avec succès.");
      await loadResidences();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la suppression.");
    }
  }

  async function handleToggleBlock(residence: ResidenceData) {
    const nextState = residence.isActive === false ? true : false;
    try {
      const res = await fetch(`/api/categories/${residence.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...residence, isActive: nextState }),
      });
      if (!res.ok) throw new Error("Mise à jour du statut impossible.");
      setSuccess(nextState ? "Résidence débloquée (activée)." : "Résidence bloquée (masquée).");
      await loadResidences();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du changement de statut.");
    }
  }

  const filtered = residences.filter((r)=>[r.nom,r.title,r.ville,r.quartier,r.adresse].filter(Boolean).join(" ").toLowerCase().includes(search.toLowerCase().trim()));
  const inputClass = "w-full rounded-none border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-[#0c4a6e]";
  const labelClass = "mb-1.5 block text-sm font-semibold text-slate-700";

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNavbar />
      <main className="min-w-0 lg:ml-72">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#c9a84c]">Administration / Hébergements</p>
              <h1 className="mt-2 text-2xl font-extrabold text-[#0c4a6e] sm:text-3xl">Gestion des résidences</h1>
              <p className="mt-2 text-sm text-slate-500">Gérez, modifiez, bloquez ou supprimez les résidences de CÔTIÈRE.</p>
            </div>
            <button type="button" onClick={() => openModal()} className="inline-flex items-center gap-2 rounded-none bg-[#0c4a6e] px-5 py-3 text-sm font-semibold text-white hover:bg-[#08334c]"><Plus size={18} />Ajouter une résidence</button>
          </div>

          {success && <div role="status" className="mb-6 rounded-none border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-700">{success}</div>}
          
          <div className="mb-6 flex items-center justify-between rounded-none border bg-white p-5">
            <div className="flex items-center gap-3">
              <Building2 className="text-[#0c4a6e]" size={25} />
              <div><p className="text-sm font-bold">Résidences enregistrées</p><p className="text-xs text-slate-500">{residences.length} résidence(s)</p></div>
            </div>
            <button type="button" onClick={()=>void loadResidences()} disabled={loading} className="rounded-none p-2 text-[#0c4a6e] hover:bg-slate-100 disabled:opacity-50"><RefreshCw size={19} className={loading?"animate-spin":""} /></button>
          </div>

          <div className="relative mb-6">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="search" value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Rechercher une résidence, une ville, un quartier..." className={`${inputClass} pl-11 rounded-none`} />
          </div>

          {loading ? (
            <div className="flex min-h-64 items-center justify-center gap-3 rounded-none bg-white"><Loader2 className="animate-spin text-[#0c4a6e]" />Chargement des résidences...</div>
          ) : error ? (
            <div role="alert" className="rounded-none border border-red-200 bg-red-50 p-6 text-red-700">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="rounded-none border border-dashed bg-white px-6 py-16 text-center">
              <Building2 size={42} className="mx-auto mb-4 text-slate-400" />
              <h2 className="text-lg font-bold text-[#0c4a6e]">{search ? "Aucun résultat" : "Aucune résidence enregistrée"}</h2>
              <p className="mt-2 text-sm text-slate-500">{search ? "Essayez une autre recherche." : "Ajoutez votre première résidence."}</p>
              {!search && <button type="button" onClick={() => openModal()} className="mt-5 inline-flex items-center gap-2 rounded-none bg-[#c9a84c] px-5 py-3 text-sm font-bold text-[#0c4a6e]"><Plus size={18} />Ajouter</button>}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((r) => (
                <AdminResidenceCard key={r.id} r={r} onEdit={openModal} onToggleBlock={handleToggleBlock} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-3 sm:p-5" onMouseDown={(e)=>{if(e.target===e.currentTarget) closeModal();}}>
          <div role="dialog" aria-modal="true" className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-none bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-5 py-4 sm:px-7">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#c9a84c]">CÔTIÈRE Administration</p>
                <h2 className="mt-1 text-xl font-extrabold text-[#0c4a6e]">{editingId ? "Modifier la résidence" : "Ajouter une résidence"}</h2>
              </div>
              <button type="button" onClick={closeModal} disabled={saving} className="rounded-none p-2 text-slate-500 hover:bg-slate-100"><X size={22} /></button>
            </div>
            
            <form onSubmit={handleSave} className="flex min-h-0 flex-1 flex-col">
              <div className="flex-1 space-y-7 overflow-y-auto px-5 py-6 sm:px-7">

                <section><h3 className="mb-4 font-bold text-[#0c4a6e]">Informations générales</h3><div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><div className="sm:col-span-2"><label className={labelClass}>Nom de la résidence *</label><input required value={form.nom} onChange={(e)=>updateField("nom",e.target.value)} className={inputClass} placeholder="Ex. Résidence Les Palmiers" /></div><div><label className={labelClass}>Ville *</label><input required value={form.ville} onChange={(e)=>updateField("ville",e.target.value)} className={inputClass} placeholder="Abidjan" /></div><div><label className={labelClass}>Quartier</label><input value={form.quartier} onChange={(e)=>updateField("quartier",e.target.value)} className={inputClass} placeholder="Cocody" /></div><div className="sm:col-span-2"><label className={labelClass}>Adresse</label><input value={form.adresse} onChange={(e)=>updateField("adresse",e.target.value)} className={inputClass} placeholder="Adresse complète" /></div><div className="sm:col-span-2"><label className={labelClass}>Description</label><textarea rows={3} value={form.description} onChange={(e)=>updateField("description",e.target.value)} className={inputClass} placeholder="Présentez la résidence..." /></div></div></section>

                <section><h3 className="mb-4 font-bold text-[#0c4a6e]">Tarifs et logements</h3><div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><div><label className={labelClass}>Prix par nuit (FCFA)</label><input type="number" min="0" value={form.prix_nuit} onChange={(e)=>updateField("prix_nuit",e.target.value)} className={inputClass} placeholder="35000" /></div><div><label className={labelClass}>Nombre de logements</label><input type="number" min="0" step="1" value={form.nb_chambres} onChange={(e)=>updateField("nb_chambres",e.target.value)} className={inputClass} placeholder="25" /></div><div className="sm:col-span-2"><label className={labelClass}>Type de logement</label><input value={form.type_chambre} onChange={(e)=>updateField("type_chambre",e.target.value)} className={inputClass} placeholder="Standard, Suite, Deluxe..." /></div></div></section>

                <section><h3 className="mb-4 font-bold text-[#0c4a6e]">Contacts et localisation</h3><div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{([["telephone","Téléphone"],["whatsapp","WhatsApp"],["email","Email"],["site_internet","Site internet"],["localisation_maps","Lien Google Maps"]] as const).map(([key,label])=>(<div key={key} className={key==="localisation_maps"?"sm:col-span-2":""}><label className={labelClass}>{label}</label><input type={key==="email"?"email":key==="site_internet"||key==="localisation_maps"?"url":"text"} value={form[key]} onChange={(e)=>updateField(key,e.target.value)} className={inputClass} /></div>))}</div></section>

                <section><h3 className="mb-4 font-bold text-[#0c4a6e]">Équipements</h3><div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{([["wifi","Wi-Fi"],["clim","Climatisation"],["television","Télévision"],["eau_chaude","Eau chaude"],["refrigirateur","Réfrigérateur"]] as const).map(([key,label])=>(<label key={key} className="flex cursor-pointer items-center gap-2 rounded-none border border-slate-200 p-3 text-sm text-slate-700"><input type="checkbox" checked={form[key]} onChange={(e)=>updateField(key,e.target.checked)} className="accent-[#0c4a6e]" />{label}</label>))}</div></section>

                <section><h3 className="mb-4 font-bold text-[#0c4a6e]">Services disponibles</h3><div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{SERVICES.map((s)=>(<label key={s} className="flex cursor-pointer items-center gap-2 rounded-none border border-slate-200 p-3 text-sm text-slate-700"><input type="checkbox" checked={form.services.includes(s)} onChange={()=>toggleService(s)} className="accent-[#0c4a6e]" />{s}</label>))}</div></section>

                <section>
                  <div className="mb-4 flex items-center justify-between"><h3 className="font-bold text-[#0c4a6e]">Photos de la résidence</h3><span className="text-xs text-slate-500">{existingImages.length + selectedImages.length}/4</span></div>
                  <p className="mb-4 text-xs text-slate-500">Choisissez jusqu'à 4 photos au total (JPG, PNG, WebP, 5 Mo max).</p>
                  
                  <label className={`flex cursor-pointer flex-col items-center justify-center rounded-none border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center hover:border-[#0c4a6e] ${existingImages.length + selectedImages.length>=4||saving?"pointer-events-none opacity-50":""}`}><ImagePlus size={32} className="mb-2 text-[#0c4a6e]" /><span className="text-sm font-semibold text-[#0c4a6e]">Ajouter des photos</span><input type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple onChange={selectImages} disabled={saving||existingImages.length + selectedImages.length>=4} className="sr-only" /></label>
                  
                  {existingImages.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-semibold text-slate-600 mb-2">Photos actuelles :</p>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {existingImages.map((url, idx) => (
                          <div key={url} className="relative overflow-hidden rounded-none border bg-slate-100">
                            <img src={url} alt={`Actuelle ${idx + 1}`} className="h-28 w-full object-cover" />
                            <button type="button" onClick={() => removeExistingImage(idx)} disabled={saving} className="absolute right-1 top-1 rounded-none bg-white p-1.5 text-red-600 shadow"><Trash2 size={15} /></button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedImages.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-semibold text-slate-600 mb-2">Nouvelles photos :</p>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {selectedImages.map((item, idx) => (
                          <div key={item.preview} className="relative overflow-hidden rounded-none border bg-slate-100">
                            <img src={item.preview} alt={`Nouvelle ${idx + 1}`} className="h-28 w-full object-cover" />
                            <button type="button" onClick={() => removeSelectedImage(idx)} disabled={saving} className="absolute right-1 top-1 rounded-none bg-white p-1.5 text-red-600 shadow"><Trash2 size={15} /></button>
                            <p className="truncate px-2 py-1 text-xs text-slate-500">{item.file.name}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {saving && uploadProgress && <p className="mt-3 flex items-center gap-2 text-sm text-[#0c4a6e]"><Loader2 size={15} className="animate-spin" />{uploadProgress}</p>}
                </section>

                {saveError&&<div className="rounded-none border border-red-200 bg-red-50 p-4 text-sm text-red-700">{saveError}</div>}
              </div>
              <div className="flex justify-end gap-3 border-t bg-white px-5 py-4 sm:px-7">
                <button type="button" onClick={closeModal} disabled={saving} className="rounded-none border px-5 py-3 text-sm font-semibold text-slate-700">Annuler</button>
                <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-none bg-[#0c4a6e] px-6 py-3 text-sm font-semibold text-white disabled:opacity-50">{saving?<Loader2 size={17} className="animate-spin" />:<Plus size={17} />}{saving?"Enregistrement...":(editingId ? "Mettre à jour" : "Enregistrer la résidence")}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}