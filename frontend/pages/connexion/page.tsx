"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ConnexionPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();

      // 1. Auth Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: form.email.trim(),
        password: form.password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Utilisateur non trouvé");

      // 2. Récupère le rôle - CORRIGÉ pour ton schema
      // Tu as supabaseUserId dans Prisma, pas id
      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("role, supabaseUserId, id")
        .or(`supabaseUserId.eq.${authData.user.id},id.eq.${authData.user.id}`)
        .maybeSingle();

      if (profileError) {
        console.error("Erreur lecture profil:", profileError);
      }

      const role = (profile?.role as string)?.toUpperCase() || "CLIENT";
      console.log(">>> Rôle détecté:", role);

      // 3. Cible
      const params = new URLSearchParams(window.location.search);
      const callbackUrl = params.get("callbackUrl");
      const isAdmin = role.includes("ADMIN") || role === "SUPER_ADMIN";
      
      const target = callbackUrl
        ? decodeURIComponent(callbackUrl)
        : isAdmin
        ? "/admin/residences" // redirige direct sur ta page
        : "/";

      console.log(">>> Redirection vers:", target);

      // 4. IMPORTANT: refresh AVANT push pour que proxy.ts synchronise les cookies
      router.refresh();
      // Petit délai pour laisser le temps au proxy de setter les cookies
      await new Promise((r) => setTimeout(r, 300));
      router.push(target);
      
    } catch (err: any) {
      console.error("LOGIN ERROR", err);
      const msg = err.message === "Invalid login credentials" 
        ? "Email ou mot de passe incorrect." 
        : err.message || "Erreur de connexion";
      setError(msg);
      setLoading(false);
    }
  }

  async function handleOAuthSignIn(provider: "google" | "facebook") {
    try {
      const supabase = createClient();
      await supabase.auth.signInWithOAuth({
        provider,
        options: { 
          redirectTo: `${window.location.origin}/auth/callback?next=/admin/residences` 
        },
      });
    } catch {
      setError(`Impossible de se connecter avec ${provider}.`);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f9ff] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-[#c9a84c] font-black text-2xl">CÔTIÈRE</span>
            <span className="text-[#0c4a6e] font-light text-sm ml-1">MEDIA GROUP</span>
          </Link>
          <h1 className="text-2xl font-bold text-[#0c4a6e] mt-4">Connexion</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-6 border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email professionnel</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="admin@cotiere.ci"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#38bdf8] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mot de passe</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPwd ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#38bdf8] outline-none"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#c9a84c] hover:bg-[#b8973b] disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 h-12"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}