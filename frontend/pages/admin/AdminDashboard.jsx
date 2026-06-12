// app/admin/AdminDashboard.jsx
"use client";

import React from 'react';
import { Users, FileClock, Building2, TrendingUp, CheckCircle, XCircle, Eye, ShieldAlert } from 'lucide-react';

export default function AdminDashboard() {
  // Simulation des dossiers reçus depuis le formulaire de soumission
  const pendingApplications = [
    { id: 1, name: "Hôtel Ivoire", category: "Hôtel / Résidence", date: "09 Juin 2026", status: "PENDING", type: "Partenaire" },
    { id: 2, name: "Transport Express", category: "Transport", date: "08 Juin 2026", status: "PENDING", type: "Partenaire" },
    { id: 3, name: "Festival National de l'Attiéké", category: "Événements", date: "08 Juin 2026", status: "PENDING", type: "Organisateur" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Tableau de bord de Direction</h2>
          <p className="text-slate-500 mt-1">Supervisez l'activité de la plateforme, des partenaires et des organisateurs d'événements.</p>
        </div>
        <div className="bg-[#0c4a6e]/10 text-[#0c4a6e] px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2">
          <ShieldAlert size={16} />
          Accès Superviseur
        </div>
      </div>

      {/* Cartes Statistiques (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Dossiers en attente", value: "12", icon: FileClock, color: "text-amber-600", bg: "bg-amber-100" },
          { label: "Partenaires Actifs", value: "148", icon: Building2, color: "text-[#0c4a6e]", bg: "bg-[#0c4a6e]/10" },
          { label: "Organisateurs Validés", value: "34", icon: Users, color: "text-[#c9a84c]", bg: "bg-[#c9a84c]/10" },
          { label: "Revenus Mensuels", value: "2.4M FCFA", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-100" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`p-4 rounded-xl ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tableau des dossiers récents - Vue Organisationnelle */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-900">Nouvelles demandes (Partenaires & Organisateurs)</h3>
          <button className="text-sm text-[#0c4a6e] font-semibold hover:underline">Voir tout l'historique</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-slate-500 text-sm border-b border-slate-100">
                <th className="p-4 font-medium">Structure / Projet</th>
                <th className="p-4 font-medium">Type de Profil</th>
                <th className="p-4 font-medium">Catégorie</th>
                <th className="p-4 font-medium">Date de soumission</th>
                <th className="p-4 font-medium text-right">Actions Superviseur</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pendingApplications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50 transition-colors bg-white">
                  <td className="p-4 font-bold text-slate-900">{app.name}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      app.type === 'Organisateur' ? 'bg-[#c9a84c]/10 text-[#c9a84c]' : 'bg-[#0c4a6e]/10 text-[#0c4a6e]'
                    }`}>
                      {app.type}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600 text-sm">{app.category}</td>
                  <td className="p-4 text-slate-600 text-sm">{app.date}</td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Examiner le dossier complet">
                      <Eye size={18} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition" title="Valider et générer les accès">
                      <CheckCircle size={18} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Rejeter la demande">
                      <XCircle size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}