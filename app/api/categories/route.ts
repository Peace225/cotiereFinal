import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

type HebergementType = "hotel" | "residence" | "villa";
const VALID_TYPES: HebergementType[] = ["hotel", "residence", "villa"];
const IS_DEV = process.env.NODE_ENV === "development";

function getSupabaseClient(admin = false) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = admin? process.env.SUPABASE_SERVICE_ROLE_KEY : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url ||!key) throw new Error("Config Supabase manquante");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
function errorMessage(e: unknown) { return e instanceof Error? e.message : "Erreur inconnue"; }
function stringValue(v: unknown) { return typeof v === "string"? v.trim() : ""; }
function stringArray(v: unknown, limit = 30) {
  if (typeof v === "string") return v.trim()? [v.trim()] : [];
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is string => typeof x === "string" && x.trim().length > 0).map(x => x.trim()).slice(0, limit);
}
function numericValue(v: unknown) {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v); return Number.isFinite(n) && n >= 0? n : null;
}
function booleanValue(v: unknown) { return v === true || v === "true"; }
function apiError(msg: string, status: number, details?: string) {
  return NextResponse.json({ error: msg,...(IS_DEV && details? { details } : {}) }, { status });
}
function parseDescription(v: unknown) {
  if (typeof v!== "string") return { description: "", extra: {} as Record<string, unknown> };
  try {
    const p: any = JSON.parse(v);
    if (p && typeof p === "object" &&!Array.isArray(p) && p._format === "cotiere-hebergement-v1") {
      const { _format, description,...extra } = p;
      return { description: stringValue(description), extra };
    }
  } catch {}
  return { description: v, extra: {} as Record<string, unknown> };
}
function normalizeCategory(item: Record<string, unknown>) {
  const parsed = parseDescription(item.description);
  return {
   ...item,
   ...parsed.extra,
    description: parsed.description,
    nom: stringValue((parsed.extra as any).nom) || stringValue(item.title),
    isActive: (item.is_active as boolean)?? (item as any).isactive?? true,
    createdAt: item.created_at?? (item as any).createdat,
    updatedAt: item.updated_at?? (item as any).updatedat,
  };
}

// ================= GET : UNE SEULE SOURCE, PAS DE DOUBLON =================
export async function GET(req: NextRequest) {
  try {
    const type = req.nextUrl.searchParams.get("type");
    const active = req.nextUrl.searchParams.get("active");
    if (type &&!VALID_TYPES.includes(type as HebergementType)) return apiError("Type invalide", 400);
    if (active === "false") return apiError("Inactifs non publics", 403);

    const supabase = getSupabaseClient();
    let q = supabase.from("homepage_categories").select("*").eq("is_active", true);
    if (type) q = q.eq("type", type);
    const { data, error } = await q.order("order_index", { ascending: true });
    if (error) return apiError("Impossible de charger", 500, `${error.code}: ${error.message}`);

    // FILTRE 1 : supprime les cartes sans image côté API
    // FILTRE 2 : déduplique par titre (pour supprimer ton Hôtel amaelle en double)
    const seen = new Set<string>();
    const filtered = (data?? []).filter((i: any) => {
      const hasImage = i.image || (Array.isArray(i.images) && i.images.length > 0 && i.images[0]);
      if (!hasImage) return false;
      const key = String(i.title || "").toLowerCase().trim();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return NextResponse.json({ data: filtered.map(i => normalizeCategory(i as any)), count: filtered.length }, { status: 200 });
  } catch (e) {
    console.error("GET /api/categories:", e);
    return apiError("Erreur serveur", 500, errorMessage(e));
  }
}

// ================= POST : 1 INSERT = 1 CARTE EN PUBLIC =================
export async function POST(req: NextRequest) {
  try { await requireAdmin(); } catch { return apiError("Admin requis", 401); }
  try {
    const input = (await req.json()) as Record<string, unknown>;
    const nom = stringValue(input.nom) || stringValue(input.title);
    const type = stringValue(input.type).toLowerCase() as HebergementType;
    const ville = stringValue(input.ville);
    if (!nom) return apiError("Nom obligatoire", 400);
    if (!VALID_TYPES.includes(type)) return apiError("Type invalide", 400);
    if (!ville) return apiError("Ville obligatoire", 400);

    const images = stringArray(input.images, 4);
    const fb = stringValue(input.image); if (!images.length && fb) images.push(fb);
    if (images.length === 0) return apiError("Au moins une image est obligatoire", 400);

    const details = {
      _format: "cotiere-hebergement-v1", description: stringValue(input.description), nom, ville,
      adresse: stringValue(input.adresse), quartier: stringValue(input.quartier),
      telephone: stringValue(input.telephone), whatsapp: stringValue(input.whatsapp), email: stringValue(input.email),
      site_internet: stringValue(input.site_internet), localisation_maps: stringValue(input.localisation_maps),
      nb_chambres: numericValue(input.nb_chambres), prix_nuit: numericValue(input.prix_nuit),
      type_chambre: stringArray(input.type_chambre), clim: booleanValue(input.clim), wifi: booleanValue(input.wifi),
      television: booleanValue(input.television), eau_chaude: booleanValue(input.eau_chaude), refrigirateur: booleanValue(input.refrigirateur),
      services: stringArray(input.services),
    };
    const now = new Date().toISOString();
    const payload = {
      id: crypto.randomUUID(), title: nom, description: JSON.stringify(details), type,
      image: images[0]?? null, images, amenities: stringArray((input as any).amenities?? input.services),
      count_text: stringValue(input.count_text) || null, href: stringValue(input.href) || `/recherche?type=${type}`,
      order_index: numericValue(input.order_index)?? 0, is_active: true, created_at: now, updated_at: now,
    };

    const supabase = getSupabaseClient(true);
    const { data, error } = await supabase.from("homepage_categories").insert(payload).select("*").single();
    if (error) return apiError("Impossible d'enregistrer", 500, `${error.code}: ${error.message}`);

    return NextResponse.json({ message: "Établissement créé", data: normalizeCategory(data as any) }, { status: 201 });
  } catch (e) {
    console.error("POST /api/categories:", e);
    return apiError("Erreur serveur", 500, errorMessage(e));
  }
}