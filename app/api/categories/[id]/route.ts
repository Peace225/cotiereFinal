import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

export const dynamic = 'force-dynamic';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url ||!key) throw new Error("Config Supabase admin manquante");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

function getSupabasePublic() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

function stringValue(v: unknown) {
  return typeof v === "string"? v.trim() : "";
}

function stringArray(v: unknown, limit = 10) {
  if (typeof v === "string") return v.trim()? [v.trim()] : [];
  if (!Array.isArray(v)) return [];
  return v
   .filter((x): x is string => typeof x === "string" && x.trim()!== "")
   .map(x => x.trim())
   .slice(0, limit);
}

function parseDescription(value: unknown) {
  if (typeof value!== "string") return { description: "", extra: {} as any };
  try {
    const p: any = JSON.parse(value);
    if (p && typeof p === "object" && p._format === "cotiere-hebergement-v1") {
      const { _format, description,...extra } = p;
      return { description: stringValue(description), extra };
    }
  } catch {}
  return { description: value as string, extra: {} as any };
}

// ================= GET PUBLIC : /api/categories/[id] =================
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = getSupabasePublic();
    const { data, error } = await supabase.from("homepage_categories").select("*").eq("id", id).eq("is_active", true).single();
    if (error ||!data) return NextResponse.json({ error: "Hébergement introuvable" }, { status: 404 });

    const parsed = parseDescription(data.description);
    const merged = {...data,...parsed.extra, description: parsed.description };
    return NextResponse.json({ data: merged }, { status: 200 });
  } catch (e: any) {
    console.error("GET [id] error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// ================= PATCH ADMIN : modifie avec 4 images =================
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await req.json();
    const supabase = getSupabaseAdmin();

    const imagesArray = (body.images || (body.image? [body.image] : []))
     .filter((u: unknown): u is string => typeof u === "string" && u.trim()!== "")
     .slice(0, 4);

    if (imagesArray.length === 0) {
      return NextResponse.json({ error: "Au moins une image requise" }, { status: 400 });
    }

    const existing = await supabase.from("homepage_categories").select("description").eq("id", id).single();
    const oldParsed = parseDescription(existing.data?.description);

    const details = {
      _format: "cotiere-hebergement-v1",
     ...oldParsed.extra,
      description: stringValue(body.description) || oldParsed.extra.description || "",
      nom: stringValue(body.title) || oldParsed.extra.nom || "",
      ville: stringValue(body.ville) || oldParsed.extra.ville || "",
      quartier: stringValue(body.quartier) || oldParsed.extra.quartier || "",
      prix_nuit: body.prix_nuit?? oldParsed.extra.prix_nuit,
    };

    const payload: any = {
      title: stringValue(body.title),
      description: JSON.stringify(details),
      type: stringValue(body.type),
      image: imagesArray[0] || null,
      images: imagesArray,
      amenities: stringArray(body.amenities),
      count_text: body.count_text || null,
      href: body.href || (body.type? `/recherche?type=${body.type}` : undefined),
      order_index: Number.isFinite(Number(body.order_index))? Number(body.order_index) : 0,
      updated_at: new Date().toISOString(),
    };

    Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k]);

    const { data, error } = await supabase.from("homepage_categories").update(payload).eq("id", id).select().single();
    if (error) throw error;

    return NextResponse.json({ data }, { status: 200 });
  } catch (e: any) {
    console.error("PATCH [id] error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// ================= DELETE ADMIN =================
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("homepage_categories").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true, id }, { status: 200 });
  } catch (e: any) {
    console.error("DELETE [id] error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}