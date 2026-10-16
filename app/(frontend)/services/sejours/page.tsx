"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight, ArrowUpRight, Building2, ChevronDown, Heart, MapPin, RefreshCw,
  Search, SlidersHorizontal, Sparkles, Star, Users, Wifi, Wind, Coffee, Car, Waves, Check, X,
} from "lucide-react";

type Accommodation = {
  id: string; slug: string; title: string; type: string; city: string; quartier: string | null;
  description: string | null; price: number | null; rating: number | null; ratingMax: number;
  image: string; images: string[]; href: string; capacity: number; amenities: string[];
  isFeatured: boolean; isPopular: boolean; isWeekend: boolean;
};
type ApiItem = Record<string, unknown>;
type SortOption = "recommended" | "price-asc" | "price-desc" | "rating";
type Pagination = { page?: number; limit?: number; total?: number; totalPages?: number; };
type ApiResponse = { data?: unknown; results?: unknown; items?: unknown; pagination?: Pagination; success?: boolean; error?: string; };

const API_URL = "/api/categories";
const categories = [
  { label: "Tous les séjours", value: "tout" },
  { label: "Hôtels", value: "hotel" },
  { label: "Résidences", value: "residence" },
  { label: "Villas", value: "villa" },
  { label: "Maisons d'hôtes", value: "maison" },
];

function normalize(value: unknown): string {
  return String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ");
}
function asString(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  return "";
}
function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value.replace(/\s/g, "").replace(",", "."));
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}
function asBoolean(value: unknown): boolean { return value === true || value === "true"; }
function asImage(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const image = value as ApiItem;
    return asString((image as any).url) || asString((image as any).src) || asString((image as any).path);
  }
  return "";
}
function getImages(item: ApiItem): string[] {
  const rawImages = Array.isArray(item.images) ? item.images : [];
  const images = rawImages.map(asImage).filter(Boolean);
  const mainImage = asImage(item.image) || asImage((item as any).imageUrl) || asImage((item as any).image_url) || asImage((item as any).photo) || asImage((item as any).cover) || asImage((item as any).thumbnail);
  if (mainImage) images.unshift(mainImage);
  return [...new Set(images)];
}
function getCity(item: ApiItem): string { return asString(item.city) || asString(item.ville) || asString((item as any).destination) || "Côte d'Ivoire"; }
function getType(item: ApiItem): string { return asString(item.type) || asString((item as any).category) || "Hébergement"; }
function getAmenities(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((i): i is string => typeof i === "string").map(i => i.trim()).filter(Boolean);
}

function normalizeAccommodation(item: ApiItem): Accommodation | null {
  const id = asString(item.id) || asString((item as any)._id) || asString(item.slug);
  const title = asString(item.title) || asString((item as any).titre) || asString((item as any).name) || asString((item as any).nom);
  if (!id || !title) return null;
  const images = getImages(item);
  if (images.length === 0 || !images[0]) return null;
  let details: ApiItem = {};
  if (typeof item.description === "string" && item.description.trim().startsWith("{")) {
    try { const p = JSON.parse(item.description); if (p && typeof p === "object") details = p; } catch {}
  }
  const source: ApiItem = {...details, ...item };
  const amenities = getAmenities((source as any).amenities ?? (source as any).equipements ?? (source as any).services);
  const readableDescription = typeof item.description === "string" && item.description.trim().startsWith("{") ? asString((details as any).description) : asString(item.description);
  const rawRating = asNumber(item.rating) ?? asNumber((item as any).note);
  const rating = rawRating !== null && rawRating > 0 ? rawRating : null;
  return {
    id, slug: asString(item.slug), title, type: getType(item), city: getCity(source), quartier: asString((source as any).quartier) || null,
    description: readableDescription || null,
    price: asNumber(item.price) ?? asNumber((item as any).prix) ?? asNumber((item as any).pricePerNight) ?? asNumber((source as any).prix_nuit),
    rating, ratingMax: 5, image: images[0], images: images.slice(0, 4), capacity: asNumber(item.capacity) ?? asNumber((source as any).capacite) ?? 0,
    amenities, isFeatured: asBoolean((item as any).isFeatured), isPopular: asBoolean((item as any).isPopular), isWeekend: asBoolean((item as any).isWeekend),
    href: `/services/sejours/${encodeURIComponent(id)}`,
  };
}

function extractItems(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];
  const object = payload as ApiItem;
  for (const key of ["data", "results", "items", "hebergements", "accommodations"]) {
    const value = object[key];
    if (Array.isArray(value)) return value;
    if (value && typeof value === "object") { const nested = extractItems(value); if (nested.length > 0) return nested; }
  }
  return [];
}
function formatPrice(price: number | null): string { return price === null ? "Sur devis" : new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(price); }
function matchesSearch(item: Accommodation, search: string): boolean {
  if (!search.trim()) return true;
  const q = normalize(search); const text = normalize([item.title, item.city, item.quartier, item.type, item.description, ...item.amenities].join(" "));
  return q.split(" ").every(w => text.includes(w));
}
function matchesCategory(item: Accommodation, category: string): boolean {
  if (category === "tout") return true;
  const t = normalize(item.type);
  if (category === "hotel") return t.includes("hotel");
  if (category === "residence") return t.includes("residence");
  if (category === "villa") return t.includes("villa");
  if (category === "maison") return t.includes("maison") || t.includes("hote");
  return true;
}
function AmenityIcon({ name }: { name: string }) {
  const a = normalize(name);
  if (a.includes("wifi")) return <Wifi size={12} />;
  if (a.includes("clim")) return <Wind size={12} />;
  if (a.includes("piscine") || a.includes("pool")) return <Waves size={12} />;
  if (a.includes("parking")) return <Car size={12} />;
  if (a.includes("petit") || a.includes("cafe") || a.includes("restaurant")) return <Coffee size={12} />;
  return <Check size={12} />;
}

// CARTE SANS AUCUN ARRONDI (rounded-none) ET ÉQUIPEMENTS/SERVICES VISIBLES
function StayCard({ item, index }: { item: Accommodation; index: number }) {
  const [fav, setFav] = useState(false);
  const [current, setCurrent] = useState(0);
  const images = item.images.length > 0 ? item.images.slice(0, 3) : [item.image];
  const loc = [item.quartier, item.city].filter(Boolean).join(" • ");

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => setCurrent(c => (c + 1) % images.length), 4000);
    return () => clearInterval(id);
  }, [images.length]);

  const next = (e?: React.MouseEvent) => { e?.stopPropagation(); setCurrent(c => (c + 1) % images.length); };
  const prev = (e?: React.MouseEvent) => { e?.stopPropagation(); setCurrent(c => (c - 1 + images.length) % images.length); };
  
  // Récupération complète des équipements et services disponibles
  const amenities = item.amenities.filter(a => typeof a === "string" && a.trim());

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-none bg-white shadow-md ring-1 ring-black/[0.04] transition-all duration-300 hover:shadow-xl">
      <div className="relative h-60 overflow-hidden bg-slate-100 rounded-none">
        {images.map((img, i) => (
          <img key={`${img}-${i}`} src={img} alt={`${item.title} ${i+1}`} loading={index < 4 ? "eager" : "lazy"} className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${i === current ? "opacity-100 scale-100" : "opacity-0 scale-105"}`} />
        ))}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span className="rounded-none bg-white px-3.5 py-1.5 text-xs font-bold tracking-wide text-[#0f2d52] shadow-lg">{item.type.toUpperCase()}</span>
          {item.rating !== null && <span className="flex items-center gap-1 rounded-none bg-black/40 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md ring-1 ring-white/20"><Star size={11} className="fill-white" />{item.rating.toFixed(1)}</span>}
        </div>
        <button onClick={() => setFav(!fav)} className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-none bg-white/90 backdrop-blur shadow-lg transition hover:scale-110">
          <Heart size={16} className={fav ? "fill-[#ff3b5c] text-[#ff3b5c]" : "text-slate-600"} />
        </button>
        {images.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-3 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-none bg-black/40 text-white backdrop-blur transition group-hover:flex hover:bg-black/60"><ChevronDown className="rotate-90" size={16} /></button>
            <button onClick={next} className="absolute right-3 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-none bg-black/40 text-white backdrop-blur transition group-hover:flex hover:bg-black/60"><ChevronDown className="-rotate-90" size={16} /></button>
            <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
              {images.map((_, i) => <span key={i} className={`h-1.5 transition-all ${i === current ? "w-5 bg-white" : "w-1.5 bg-white/60"}`} />)}
            </div>
          </>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="line-clamp-1 text-base! font-extrabold leading-tight text-white drop-shadow">{item.title}</h3>
          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-white/90"><MapPin size={13} className="shrink-0" /><span className="truncate">{loc}</span></div>
        </div>
      </div>
      
      <div className="flex flex-1 flex-col p-5">
        <p className="line-clamp-2 min-h-[40px] text-xs leading-[1.5] text-slate-500">{item.description || "Séjour d'exception sur le littoral ivoirien."}</p>
        
        {/* AFFICHAGE DES ÉQUIPEMENTS ET SERVICES DISPONIBLES */}
        <div className="mt-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#0c4a6e] mb-2">Équipements & Services :</p>
          {amenities.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {item.capacity > 0 && <span className="inline-flex items-center gap-1 rounded-none bg-[#f6f7f9] px-2.5 py-1 text-[11px] font-medium text-slate-700 border border-slate-200"><Users size={12} />{item.capacity} pers.</span>}
              {amenities.map((a, i) => (
                <span key={i} className="inline-flex items-center gap-1 rounded-none bg-[#f6f7f9] px-2.5 py-1 text-[11px] font-medium text-slate-700 border border-slate-200">
                  <AmenityIcon name={a} />{a}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs italic text-slate-400">Aucun équipement spécifié</p>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 mt-4">
          <div><div className="text-[10px] uppercase tracking-widest text-slate-400">à partir de</div><div className="text-sm font-black text-[#003b95]">{formatPrice(item.price)} <span className="text-xs font-bold text-slate-400">FCFA</span></div></div>
          <Link href={item.href} className="flex h-11 w-11 items-center justify-center rounded-none bg-[#0f2d52] text-white transition-all group-hover:bg-[#003b95] group-hover:rotate-45"><ArrowUpRight size={18} /></Link>
        </div>
      </div>
    </article>
  );
}

function StaySkeleton() {
  return <div className="animate-pulse overflow-hidden rounded-none bg-white ring-1 ring-black/5"><div className="h-60 bg-slate-200" /><div className="space-y-3 p-5"><div className="h-4 w-3/4 bg-slate-100" /><div className="h-3 w-full bg-slate-100" /></div></div>;
}

export default function SejoursPage() {
  const [data, setData] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("tout");
  const [sort, setSort] = useState<SortOption>("recommended");

  useEffect(() => {
    const c = new AbortController();
    async function load() {
      try {
        setLoading(true); setError(null);
        const res = await fetch(API_URL, { signal: c.signal, cache: "no-store" });
        if (!res.ok) throw new Error(`Erreur API ${res.status}`);
        const json: ApiResponse = await res.json();
        const allItems = extractItems(json).filter((e) => {
          if (!e || typeof e !== "object" || Array.isArray(e)) return false;
          const r = e as ApiItem; return ["hotel", "residence", "villa", "maison"].includes(normalize((r as any).type).replace(/ /g, ""));
        });
        const accommodations = allItems.filter((i): i is ApiItem => !!i && typeof i === "object" && !Array.isArray(i)).map(normalizeAccommodation).filter((i): i is Accommodation => i !== null);
        const unique = Array.from(new Map(accommodations.map(i => [i.id, i])).values());
        if (!c.signal.aborted) setData(unique);
      } catch (err) {
        if (!c.signal.aborted) { setError(err instanceof Error ? err.message : "Impossible de charger"); setData([]); }
      } finally { if (!c.signal.aborted) setLoading(false); }
    }
    load(); return () => c.abort();
  }, [reloadKey]);

  const filtered = useMemo(() => {
    let r = data.filter(i => matchesCategory(i, activeCategory) && matchesSearch(i, search));
    if (sort === "price-asc") r.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    if (sort === "price-desc") r.sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
    if (sort === "rating") r.sort((a, b) => (b.rating ?? -1) - (a.rating ?? -1));
    return r;
  }, [data, activeCategory, search, sort]);

  function resetFilters() { setSearch(""); setActiveCategory("tout"); setSort("recommended"); }

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mb-9 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div><div className="mb-3 flex items-center gap-2"><span className="h-px w-7 bg-[#c9a84c]" /><span className="text-xs font-bold uppercase tracking-[0.23em] text-[#b18a3e]">Votre prochaine escapade</span></div>
              <h1 className="text-2xl! font-extrabold tracking-tight text-[#122c4b] sm:text-3xl">Découvrez nos hébergements</h1>
              <p className="mt-3 text-sm! leading-6 text-slate-500">Explorez notre sélection d&apos;hôtels, de villas et de résidences sur le littoral ivoirien.</p></div>
            <div className="flex items-center gap-2 text-xs text-slate-500"><Building2 size={16} className="text-[#c9a84c]" />{loading ? "Chargement..." : `${filtered.length} hébergement${filtered.length !== 1 ? "s" : ""}`}</div>
          </div>

          <div className="mb-9 space-y-6 border-b border-[#e8e5dc] pb-6">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              {categories.map(cat => {
                const active = activeCategory === cat.value;
                return <button key={cat.value} onClick={() => setActiveCategory(cat.value)} className={`relative pb-2 text-xs font-semibold transition ${active ? "text-[#003b95]" : "text-slate-500 hover:text-[#003b95]"}`}>{cat.label}<span className={`absolute bottom-0 left-0 h-0.5 bg-[#c9a84c] transition-all ${active ? "w-full" : "w-0"}`} /></button>;
              })}
            </div>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="w-full max-w-xl">
                <div className="flex items-center gap-3 rounded-none border border-[#e4e7ed] bg-white px-4 py-3 shadow-sm focus-within:border-[#c9a84c] focus-within:ring-2 focus-within:ring-[#c9a84c]/10"><Search size={19} className="text-[#b18a3e]" /><input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un hôtel, une villa..." className="min-w-0 flex-1 bg-transparent text-sm text-[#173454] outline-none placeholder:text-slate-400" />{search && <button onClick={() => setSearch("")} className="flex h-7 w-7 items-center justify-center rounded-none text-slate-400 hover:bg-slate-100"><X size={16} /></button>}</div>
              </div>
              <div className="flex items-center gap-2"><SlidersHorizontal size={16} className="text-[#b18a3e]" /><div className="relative"><select value={sort} onChange={e => setSort(e.target.value as SortOption)} className="cursor-pointer appearance-none bg-transparent py-2 pl-1 pr-7 text-xs font-semibold text-[#193754] outline-none"><option value="recommended">Recommandés</option><option value="price-asc">Prix croissant</option><option value="price-desc">Prix décroissant</option><option value="rating">Mieux notés</option></select><ChevronDown size={14} className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-slate-500" /></div></div>
            </div>
          </div>

          {error && <div className="mb-8 flex items-center justify-between rounded-none border border-red-200 bg-red-50 px-5 py-4"><p className="text-sm text-red-700">{error}</p><button onClick={() => setReloadKey(k => k + 1)} className="inline-flex items-center gap-2 rounded-none bg-white px-4 py-2 text-xs font-bold text-red-700"><RefreshCw size={14} />Réessayer</button></div>}

          {loading ? <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3"><StaySkeleton /><StaySkeleton /><StaySkeleton /></div>
          : filtered.length === 0 ? <div className="flex flex-col items-center justify-center rounded-none border border-[#e8e5dc] bg-white px-5 py-20 text-center"><div className="mb-5 flex h-16 w-16 items-center justify-center rounded-none bg-[#f1f5fa] text-[#003b95]"><Search size={27} /></div><h3 className="text-lg font-bold text-[#173454]">Aucun hébergement trouvé</h3><p className="mt-3 max-w-md text-sm text-slate-500">Aucun établissement ne correspond à votre recherche.</p>{(search || activeCategory !== "tout") && <button onClick={resetFilters} className="mt-6 inline-flex items-center gap-2 rounded-none bg-[#003b95] px-6 py-3 text-xs font-bold text-white"><ArrowRight size={15} />Réinitialiser</button>}</div>
          : <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((item, i) => <StayCard key={item.id} item={item} index={i} />)}</div>}
        </div>
      </section>

      <section className="border-t border-[#eae5d8] bg-white py-14">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-5 text-center sm:px-8 md:flex-row md:text-left lg:px-10">
          <div className="flex items-start gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-none bg-[#f7f0df] text-[#b38b3e]"><Sparkles size={22} /></div><div><h3 className="text-lg font-bold text-[#173454]">Vous proposez un hébergement?</h3><p className="mt-1 text-sm leading-6 text-slate-500">Faites découvrir votre établissement aux voyageurs de Côtière Media Group.</p></div></div>
          <Link href="/submit" className="inline-flex shrink-0 items-center gap-2 rounded-none bg-[#003b95] px-6 py-3.5 text-xs font-bold text-white transition-all duration-300 hover:bg-[#0b55ac] hover:shadow-lg">Devenir partenaire<ArrowUpRight size={17} /></Link>
        </div>
      </section>
    </div>
  );
}