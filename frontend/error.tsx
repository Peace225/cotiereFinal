"use client";
import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, Home } from "lucide-react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#f0f9ff] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-black text-red-400 mb-4">500</div>
        <h1 className="text-2xl font-bold text-[#0c4a6e] mb-3">Une erreur est survenue</h1>
        <p className="text-gray-500 mb-8">
          Quelque chose s'est mal passé. Réessayez ou revenez à l'accueil.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={reset} className="btn-primary justify-center">
            <RefreshCw size={16} /> Réessayer
          </button>
          <Link href="/" className="flex items-center justify-center gap-2 border border-[#0c4a6e]/20 text-[#0c4a6e] font-semibold px-5 py-2.5 rounded-xl hover:bg-[#0c4a6e]/5 transition-colors">
            <Home size={16} /> Accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
