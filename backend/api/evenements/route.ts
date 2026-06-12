import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth"; // VOTRE fonction d'auth Supabase
import { forbidden } from "@/lib/api-response"; // Ou NextResponse selon votre préférence

// ... (le reste de vos imports)

export async function POST(req: NextRequest) {
  // Remplacement de la vérification NextAuth par votre système Supabase
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const body = await req.json();
    // ... reste du code de POST