// app/admin/AdminLayout.jsx
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, FileCheck, Settings, LogOut, ShieldCheck, CalendarDays } from 'lucide-react';

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  // Définition de la navigation incluant les liens spécifiques aux différents profils (Partenaires et Organisateurs)
  const navItems = [
    { id: '/admin', label: 'Vue d\'ensemble', icon: LayoutDashboard },
    { id: '/admin/demandes', label: 'Dossiers en attente', icon: FileCheck },
    { id: '/admin/partenaires', label: 'Partenaires Actifs', icon: Users },
    { id: '/admin/organisateurs', label: 'Espace Organisateurs', icon: CalendarDays },
    { id: '/admin/parametres', label: 'Paramètres', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar Admin */}
      <div className="w-64 bg-[#0c4a6e] text-white flex flex-col shadow-xl z-20">
        <div className="p-6 flex items-center gap-3 border-b border-white/10">
          <ShieldCheck className="w-8 h-8 text-[#c9a84c]" />
          <div>
            <h1 className="font-bold text-lg leading-tight">Administration</h1>
            <p className="text-[10px] text-[#c9a84c] uppercase tracking-wider">Côtière Media</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.id;
            return (
              <Link
                key={item.id}
                href={item.id}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-[#c9a84c] text-white shadow-lg shadow-[#c9a84c]/20' 
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl text-sm font-medium text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-colors">
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </div>

      {/* Contenu Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header supérieur */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10">
          <h2 className="text-xl font-semibold text-slate-800">Espace Superviseur</h2>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-bold text-slate-900">Direction</p>
              <p className="text-xs text-slate-500">Administrateur</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#0c4a6e] text-white flex items-center justify-center font-bold">
              D
            </div>
          </div>
        </header>

        {/* Zone de rendu des pages */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}