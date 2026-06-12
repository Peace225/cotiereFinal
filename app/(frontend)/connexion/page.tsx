"use client";

import React, { useState, useMemo } from "react";
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

export default function ConnexionPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Initialisation mémorisée pour éviter de recréer le client à chaque rendu
  const supabase = useMemo(() => 
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    ), 
    []
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Authentification
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: form.email.trim(),
        password: form.password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Erreur inattendue lors de la connexion.");

      // 2. Récupération du rôle
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('role')
        .eq('id', authData.user.id)
        .maybeSingle(); 

      if (profileError) throw new Error("Impossible de vérifier vos accès.");

      const role = profile?.role || 'CLIENT';
      
      // 3. Redirection sécurisée
      const target = (role === 'ADMIN' || role === 'SUPER_ADMIN') 
        ? '/admin/dashboard' 
        : '/';
      
      router.push(target);
      router.refresh();

    } catch (err: any) {
      setError(err.message === "Invalid login credentials" ? "Email ou mot de passe incorrect." : err.message);
      setLoading(false);
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
                  type="email" required placeholder="admin@cotiere.ci"
                  value={form.email} 
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#38bdf8] outline-none" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mot de passe</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type={showPwd ? "text" : "password"} required placeholder="••••••••"
                  value={form.password} 
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#38bdf8] outline-none" 
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-[#c9a84c] hover:bg-[#b8973b] text-white font-bold py-3 rounded-xl transition-all h-12">
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}