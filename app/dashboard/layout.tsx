// app/dashboard/layout.tsx
import Link from "next/link";
import { 
  LayoutDashboard, 
  PlusCircle, 
  List, 
  Settings, 
  LogOut,
  Building2,
  Utensils,
  Camera,
  MapPin,
  Music
} from "lucide-react";

// ✅ LA LIGNE MAGIQUE : Force le rendu dynamique côté serveur pour éviter l'erreur de build
export const dynamic = "force-dynamic";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Liste des liens pour une navigation propre
  const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Ajouter Service", href: "/dashboard/add-service", icon: <PlusCircle size={20} /> },
    { name: "Mes Services", href: "/dashboard/mes-services", icon: <List size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* SIDEBAR LATERALE FIXE */}
      <aside className="w-64 bg-slate-900 text-white p-6 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="mb-10 px-2">
          {/* ✅ CORRIGÉ : Encodage de "COTIÈRE" */}
          <h1 className="text-lg font-black tracking-tighter text-blue-400">COTIÈRE PARTENAIRE</h1>
        </div>

        <nav className="flex-1 space-y-2">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition-colors font-medium text-slate-300 hover:text-white"
            >
              {link.icon} {link.name}
            </Link>
          ))}
        </nav>

        <div className="border-t border-slate-800 pt-6">
          {/* ✅ CORRIGÉ : Encodage de "Déconnexion" */}
          <button className="flex items-center gap-3 p-3 text-red-400 hover:text-red-300 transition w-full font-medium">
            <LogOut size={20} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* CONTENU PRINCIPAL */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="bg-white border-b border-slate-200 p-6 flex justify-between items-center shadow-sm sticky top-0 z-10">
          <h2 className="text-lg font-bold text-slate-800">Espace Gestion Vendeur</h2>
          <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center font-bold text-white shadow-lg">
            K
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}