import Link from "next/link";
import { ArrowRight, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f0f9ff] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-black text-[#c9a84c] mb-4">404</div>
        <h1 className="text-2xl font-bold text-[#0c4a6e] mb-3">Page introuvable</h1>
        <p className="text-gray-500 mb-8">
          La page que vous cherchez n'existe pas ou a Ã©tÃ© dÃ©placÃ©e.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary justify-center">
            <Home size={16} /> Retour Ã  l'accueil
          </Link>
          <Link href="/contact" className="flex items-center justify-center gap-2 border border-[#0c4a6e]/20 text-[#0c4a6e] font-semibold px-5 py-2.5 rounded-xl hover:bg-[#0c4a6e]/5 transition-colors">
            Nous contacter <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}


