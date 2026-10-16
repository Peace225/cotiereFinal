"use client";

import { use, useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft, Calendar, Car, Check, Clock, Coffee, Flame, ImageOff,
  Loader2, MapPin, Phone, Shield, Tv, Users, Waves, Wifi, Wind, ChevronLeft, ChevronRight
} from "lucide-react";

type Raw = Record<string, unknown>;
type Stay = {
  id: string; name: string; type: string; city: string; quartier: string; address: string;
  description: string; price: number | null; capacity: number | null;
  images: string[]; amenities: string[]; phone: string; whatsapp: string;
};

// 📱 Numéro WhatsApp officiel de l'administrateur prioritaire
const ADMIN_WHATSAPP = "2250747722931";

function stringValue(v: unknown) { return typeof v === "string" ? v.trim() : ""; }
function numberValue(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = typeof v === "number" ? v : Number(String(v).replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(n) && n >= 0 ? n : null;
}
function objectValue(v: unknown): Raw {
  if (v && typeof v === "object" && !Array.isArray(v)) return v as Raw;
  if (typeof v === "string") { try { const p = JSON.parse(v); if (p && typeof p === "object" && !Array.isArray(p)) return p as Raw; } catch {} }
  return {};
}
function stringArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.filter((x): x is string => typeof x === "string" && x.trim() !== "").map(x => x.trim()).filter(Boolean);
  if (typeof v === "string") { 
    try { 
      const p = JSON.parse(v); 
      if (Array.isArray(p)) return stringArray(p); 
    } catch {} 
    return v.trim() ? [v.trim()] : []; 
  }
  return [];
}

function normalize(item: Raw): Stay | null {
  const id = stringValue(item.id);
  const typeRaw = stringValue(item.type).toLowerCase();
  if (!id) return null;
  const details = objectValue(item.description);
  const source: Raw = { ...details, ...item };
  for (const [k, val] of Object.entries(details)) {
    if (source[k] === null || source[k] === undefined || source[k] === "") source[k] = val;
  }
  const name = stringValue(source.nom) || stringValue((item as any).title) || stringValue(source.name);
  if (!name) return null;
  const imageList = [
    ...stringArray(source.images),
    ...stringArray(details.images),
    stringValue(source.image),
    stringValue((item as any).image),
  ].filter((url) => /^https?:\/\//i.test(url) || url.startsWith("/"));
  const images = [...new Set(imageList)].slice(0, 4);
  const amenities = [
    ...stringArray(source.amenities),
    ...stringArray(source.services),
    ...(source.wifi === true ? ["Wi-Fi"] : []),
    ...(source.clim === true ? ["Climatisation"] : []),
    ...(source.television === true ? ["Télévision"] : []),
    ...(source.eau_chaude === true ? ["Eau chaude"] : []),
    ...(source.refrigirateur === true ? ["Réfrigérateur"] : []),
  ];
  const desc = typeof item.description === "string" && !Object.keys(details).length
    ? item.description as string
    : stringValue(details.description) || stringValue(source.presentation) || "";
  return {
    id, name,
    type: typeRaw === "hotel" ? "Hôtel" : typeRaw === "residence" ? "Résidence" : typeRaw === "villa" ? "Villa" : "Hébergement",
    city: stringValue(source.ville) || stringValue(source.city),
    quartier: stringValue(source.quartier),
    address: stringValue(source.adresse),
    description: desc || "Aucune description disponible.",
    price: numberValue(source.prix_nuit) ?? numberValue(source.price) ?? numberValue((source as any).prix),
    capacity: numberValue(source.capacite) ?? numberValue(source.capacity),
    images,
    amenities: [...new Set(amenities)],
    phone: stringValue(source.telephone),
    whatsapp: stringValue(source.whatsapp),
  };
}

function iconForAmenity(t: string) {
  const v = t.toLowerCase();
  if (v.includes("wifi")) return <Wifi size={16} className="text-[#c9a84c]" />;
  if (v.includes("clim")) return <Wind size={16} className="text-[#c9a84c]" />;
  if (v.includes("piscine")) return <Waves size={16} className="text-[#c9a84c]" />;
  if (v.includes("déjeuner") || v.includes("cafe")) return <Coffee size={16} className="text-[#c9a84c]" />;
  if (v.includes("parking")) return <Car size={16} className="text-[#c9a84c]" />;
  if (v.includes("télé") || v.includes("tv")) return <Tv size={16} className="text-[#c9a84c]" />;
  if (v.includes("barbecue")) return <Flame size={16} className="text-[#c9a84c]" />;
  return <Check size={16} className="text-[#c9a84c]" />;
}
function todayLocal() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; }
function nightsBetween(a: string, b: string) {
  if (!a || !b) return 0;
  const f = Date.parse(`${a}T00:00:00Z`); const l = Date.parse(`${b}T00:00:00Z`);
  return Number.isFinite(f) && Number.isFinite(l) ? Math.round((l - f) / 86400000) : 0;
}

export default function SejourDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const id = slug;

  const [stay, setStay] = useState<Stay | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [selected, setSelected] = useState(0);
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", checkIn: "", checkOut: "", arrivalTime: "", guests: 1 });

  useEffect(() => {
    const c = new AbortController();
    (async () => {
      try {
        setLoading(true); setError("");
        const res = await fetch(`/api/categories/${id}`, { cache: "no-store", signal: c.signal });
        if (!res.ok) throw new Error("Hébergement introuvable ou non publié.");
        const json = await res.json();
        const normalized = normalize(json.data);
        if (!normalized) throw new Error("Données incomplètes.");
        setStay(normalized);
      } catch (e: any) {
        if (!c.signal.aborted) setError(e.message);
      } finally { if (!c.signal.aborted) setLoading(false); }
    })();
    return () => c.abort();
  }, [id]);

  const nights = useMemo(() => nightsBetween(form.checkIn, form.checkOut), [form.checkIn, form.checkOut]);
  const total = stay?.price != null && nights > 0 ? stay.price * nights : null;

  async function book(e: FormEvent) {
    e.preventDefault(); 
    setFormError(""); 
    if (!stay) return;

    if (form.checkIn < todayLocal() || nights < 1) {
      setFormError("Veuillez sélectionner des dates de séjour valides.");
      return;
    }
    if (stay.capacity && form.guests > stay.capacity) {
      setFormError(`Capacité maximale : ${stay.capacity} voyageur(s).`);
      return;
    }

    // 1. Enregistrement en base de données pour le tableau de bord admin
    try {
      const payload = {
        eventType: `Hébergement : ${stay.name} (${stay.type})`,
        eventDate: new Date(form.checkIn).toISOString(),
        guestCount: form.guests,
        budget: total ? `${total} FCFA` : "Sur devis",
        location: [stay.quartier, stay.city].filter(Boolean).join(", "),
        description: `Réservation du ${form.checkIn} au ${form.checkOut} (${nights} nuit(s)). Heure d'arrivée : ${form.arrivalTime}.`,
        clientFirstName: form.firstName.trim(),
        clientLastName: form.lastName.trim(),
        clientEmail: "client@cotiere.ci",
        clientPhone: form.phone.trim(),
        attachments: [],
      };

      await fetch("/api/events/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error("Erreur d'enregistrement admin :", err);
    }

    // 2. Envoi direct sur le WhatsApp de l'administrateur en priorité absolue (0747722931)
    const adminPhone = ADMIN_WHATSAPP || stay.whatsapp;
    const recipient = adminPhone.replace(/\D/g, "");
    
    if (!recipient) {
      setFormError("Numéro WhatsApp administrateur non configuré.");
      return;
    }

    const msg = [
      "✨ *NOUVELLE DEMANDE DE RÉSERVATION — CÔTIÈRE*",
      `\n🏨 *Établissement :* ${stay.name} (${stay.type})`,
      `👤 *Client :* ${form.firstName} ${form.lastName}`,
      `📞 *Téléphone :* ${form.phone}`,
      `\n📅 *Arrivée :* ${form.checkIn} à ${form.arrivalTime}`,
      `📅 *Départ :* ${form.checkOut} (${nights} nuit${nights > 1 ? "s" : ""})`,
      `👥 *Voyageurs :* ${form.guests}`,
      `\n💰 *Tarif estimé :* ${total ? `${total.toLocaleString("fr-FR")} FCFA` : "Sur devis"}`,
    ].join("\n");

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${recipient}&text=${encodeURIComponent(msg)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  if (loading) return <main className="min-h-screen bg-[#faf9f6] pt-32 flex justify-center gap-3 text-slate-500 font-light"><Loader2 className="animate-spin text-[#c9a84c]" /> Chargement de l'expérience...</main>;
  if (error || !stay) return (
    <main className="min-h-screen bg-[#faf9f6] pt-32 px-4 text-center">
      <h1 className="text-2xl font-light text-[#0c4a6e] tracking-wide">Séjour indisponible</h1>
      <p className="my-4 text-sm text-slate-500 font-light">{error}</p>
      <Link href="/services/sejours" className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-[#c9a84c] hover:text-[#0c4a6e] transition"><ArrowLeft size={16} /> Retour à la sélection</Link>
    </main>
  );

  const mainImage = stay.images[selected] || stay.images[0];
  const location = [stay.quartier, stay.city, stay.address].filter(Boolean).join(" — ");
  const inputClass = "w-full rounded-none border border-slate-300 bg-white px-3.5 py-3 text-xs tracking-wide text-slate-800 outline-none transition focus:border-[#0c4a6e]";
  const labelClass = "mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500";

  return (
    <main className="min-h-screen bg-[#faf9f6] pb-24 pt-20 sm:pt-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-10">
        
        <Link href="/services/sejours" className="mb-6 sm:mb-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400 hover:text-[#0c4a6e] transition">
          <ArrowLeft size={15} className="text-[#c9a84c]" /> Retour aux séjours
        </Link>

        <header className="mb-8 sm:mb-10 border-b border-[#e8e5dc] pb-6 sm:pb-8">
          <div className="flex items-center gap-3">
            <span className="h-px w-6 bg-[#c9a84c]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#b18a3e]">{stay.type}</span>
          </div>
          <h1 className="mt-3 text-2xl! sm:text-3xl lg:text-4xl font-light tracking-tight text-[#0c4a6e]">{stay.name}</h1>
          <p className="mt-2 flex items-center gap-2 text-xs! font-light text-slate-500 tracking-wider">
            <MapPin size={15} className="text-[#c9a84c] shrink-0" /> <span className="truncate">{location || "Côte d'Ivoire"}</span>
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-start lg:gap-12">
          
          <div className="space-y-8 sm:space-y-12 lg:col-span-2">
            
            <div className="space-y-3">
              <div className="relative h-64 sm:h-[400px] lg:h-[460px] w-full overflow-hidden rounded-none bg-slate-100 shadow-sm">
                {mainImage ? <img src={mainImage} alt={stay.name} className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" /> : <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-300 font-light text-xs"><ImageOff size={36} /> Visuel indisponible</div>}
                
                {stay.images.length > 1 && (
                  <>
                    <button onClick={() => setSelected(s => (s - 1 + stay.images.length) % stay.images.length)} className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60"><ChevronLeft size={20} /></button>
                    <button onClick={() => setSelected(s => (s + 1) % stay.images.length)} className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60"><ChevronRight size={20} /></button>
                    <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-black/50 px-2.5 py-1 text-[10px] tracking-widest text-white backdrop-blur-sm">{selected + 1} / {stay.images.length}</div>
                  </>
                )}
              </div>
              
              {stay.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                  {stay.images.map((img, i) => (
                    <button key={img} onClick={() => setSelected(i)} className={`relative h-16 sm:h-20 lg:h-24 overflow-hidden rounded-none border transition-all ${selected === i ? "border-[#c9a84c] opacity-100 ring-1 ring-[#c9a84c]" : "border-transparent opacity-60 hover:opacity-100"}`}>
                      <img src={img} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <section className="border-t border-[#e8e5dc] pt-8 sm:pt-10">
              <div className="flex items-center gap-3 mb-6">
                <span className="h-px w-6 bg-[#c9a84c]" />
                <h2 className="text-lg! font-bold uppercase tracking-[0.25em] text-[#0c4a6e]">L'expérience</h2>
              </div>
              
              <div className="relative bg-[#fcfbfa] border border-[#f0ece1] p-6 sm:p-10 shadow-sm">
                <div className="absolute top-0 left-0 h-1 w-12 bg-[#c9a84c]" />
                <p className="whitespace-pre-line text-sm! sm:text-base font-light leading-relaxed text-slate-700 italic">
                  "{stay.description}"
                </p>
              </div>
            </section>

            <section className="border-t border-[#e8e5dc] pt-8 sm:pt-10">
              <div className="flex items-center gap-3 mb-6">
                <span className="h-px w-6 bg-[#c9a84c]" />
                <h2 className="text-lg! font-bold uppercase tracking-[0.25em] text-[#0c4a6e]">Prestations & Commodités</h2>
              </div>

              {stay.amenities.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {stay.amenities.map(a => (
                    <div 
                      key={a} 
                      className="group flex items-center gap-3 sm:gap-4 bg-white border border-[#e8e5dc] p-3.5 sm:p-4 transition-all duration-300 hover:border-[#c9a84c] hover:shadow-md"
                    >
                      <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center bg-[#fbf9f4] transition-colors group-hover:bg-[#c9a84c] group-hover:text-white">
                        {iconForAmenity(a)}
                      </div>
                      <span className="text-xs font-medium tracking-wide text-slate-800 truncate">{a}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs! italic text-slate-400 font-light">Aucune commodité spécifiée pour cet établissement.</p>
              )}
            </section>
          </div>

          <aside className="lg:sticky lg:top-28">
            <div className="border border-[#e8e5dc] bg-white p-6 sm:p-8 shadow-sm">
              <div className="mb-6 border-b border-[#e8e5dc] pb-6">
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Tarif de référence</span>
                <div className="mt-1 flex items-baseline gap-2 flex-wrap">
                  <span className="text-2xl sm:text-3xl font-light tracking-tight text-[#0c4a6e]">{stay.price === null ? "Sur devis" : stay.price.toLocaleString("fr-FR")}</span>
                  {stay.price !== null && <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">FCFA / nuit</span>}
                </div>
              </div>

              <form onSubmit={book} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Nom</label>
                    <input required className={inputClass} placeholder="Votre nom" value={form.lastName} onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))} />
                  </div>
                  <div>
                    <label className={labelClass}>Prénom</label>
                    <input required className={inputClass} placeholder="Votre prénom" value={form.firstName} onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))} />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Téléphone / WhatsApp</label>
                  <input type="tel" required className={inputClass} placeholder="+225..." value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Arrivée</label>
                    <input type="date" required min={todayLocal()} className={inputClass} value={form.checkIn} onChange={e => setForm(p => ({ ...p, checkIn: e.target.value }))} />
                  </div>
                  <div>
                    <label className={labelClass}>Départ</label>
                    <input type="date" required min={form.checkIn || todayLocal()} className={inputClass} value={form.checkOut} onChange={e => setForm(p => ({ ...p, checkOut: e.target.value }))} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Heure d'arrivée</label>
                    <input type="time" required className={inputClass} value={form.arrivalTime} onChange={e => setForm(p => ({ ...p, arrivalTime: e.target.value }))} />
                  </div>
                  <div>
                    <label className={labelClass}>Voyageurs</label>
                    <input type="number" min={1} max={stay.capacity || undefined} required className={inputClass} value={form.guests} onChange={e => setForm(p => ({ ...p, guests: Number(e.target.value) }))} />
                  </div>
                </div>

                {total !== null && (
                  <div className="border border-[#c9a84c]/30 bg-[#fbf9f4] p-4 text-xs font-light text-[#0c4a6e] flex justify-between items-center gap-2">
                    <span>Total indicatif ({nights} nuit{nights > 1 ? "s" : ""})</span>
                    <span className="font-bold tracking-wide shrink-0">{total.toLocaleString("fr-FR")} FCFA</span>
                  </div>
                )}

                {formError && <p className="border border-red-200 bg-red-50 p-3 text-xs font-light text-red-700">{formError}</p>}

                <button type="submit" className="w-full bg-[#0c4a6e] py-4 text-xs font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-[#08334c] shadow-md">
                  Initier la réservation
                </button>
              </form>

              <div className="mt-6 flex items-center gap-3 border-t border-[#e8e5dc] pt-5 text-[11px] font-light text-slate-400">
                <Shield size={16} className="text-[#c9a84c] shrink-0" />
                <span>Transmission sécurisée et directe via protocole WhatsApp.</span>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </main>
  );
}