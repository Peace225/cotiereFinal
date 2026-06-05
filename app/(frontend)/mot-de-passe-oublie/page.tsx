"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Mail, CheckCircle } from "lucide-react";

export default function MotDePasseOubliePage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Une erreur est survenue.");
      } else {
        setSent(true);
      }
    } catch {
      setError("Erreur de connexion. Veuillez réessayer.");
    }

    setLoading(false);
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f9ff] px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <span className="text-[#c9a84c] font-black text-2xl">CÔTIÈRE</span>
              <span className="text-[#0c4a6e] font-light text-sm ml-1">MEDIA GROUP</span>
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-[#0c4a6e] mb-2">Email envoyé !</h1>
            <p className="text-gray-600 text-sm mb-6">
              Si un compte existe avec l'adresse <strong>{email}</strong>, vous recevrez un email avec les instructions pour réinitialiser votre mot de passe.
            </p>
            <Link
              href="/connexion"
              className="inline-flex items-center gap-2 bg-[#c9a84c] hover:bg-[#b8973b] text-white font-bold py-3 px-6 rounded-xl transition-colors"
            >
              Retour à la connexion
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f9ff] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-[#c9a84c] font-black text-2xl">CÔTIÈRE</span>
            <span className="text-[#0c4a6e] font-light text-sm ml-1">MEDIA GROUP</span>
          </Link>
          <h1 className="text-2xl font-bold text-[#0c4a6e] mt-4">Mot de passe oublié</h1>
          <p className="text-gray-500 text-sm mt-1">
            Entrez votre email pour recevoir un lien de réinitialisation
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-6 border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Adresse email
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  required
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#c9a84c] hover:bg-[#b8973b] disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                "Envoi en cours..."
              ) : (
                <>
                  <span>Envoyer le lien</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/connexion"
              className="text-sm text-[#38bdf8] hover:underline font-medium"
            >
              ← Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
