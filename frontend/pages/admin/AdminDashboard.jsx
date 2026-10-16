
"use client";

import React from "react";
import {
  Users,
  FileClock,
  Building2,
  TrendingUp,
  CheckCircle,
  XCircle,
  Eye,
  ShieldAlert,
} from "lucide-react";

export default function AdminDashboard() {
  // Données de démonstration
  const pendingApplications = [
    {
      id: 1,
      name: "Hôtel Ivoire",
      category: "Hôtel / Résidence",
      date: "09 Juin 2026",
      status: "PENDING",
      type: "Partenaire",
    },
    {
      id: 2,
      name: "Transport Express",
      category: "Transport",
      date: "08 Juin 2026",
      status: "PENDING",
      type: "Partenaire",
    },
    {
      id: 3,
      name: "Festival National de l'Attiéké",
      category: "Événements",
      date: "08 Juin 2026",
      status: "PENDING",
      type: "Organisateur",
    },
  ];

  const stats = [
    {
      label: "Dossiers en attente",
      value: "12",
      icon: FileClock,
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
    {
      label: "Partenaires Actifs",
      value: "148",
      icon: Building2,
      color: "text-[#0c4a6e]",
      bg: "bg-[#0c4a6e]/10",
    },
    {
      label: "Organisateurs Validés",
      value: "34",
      icon: Users,
      color: "text-[#c9a84c]",
      bg: "bg-[#c9a84c]/10",
    },
    {
      label: "Revenus Mensuels",
      value: "2.4M FCFA",
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
  ];

  return (
    <section
      className="
        w-full min-w-0 max-w-full
        space-y-6
        pb-8
        sm:space-y-8
      "
    >
      {/* EN-TÊTE */}
      <div
        className="
          flex flex-col gap-4
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >
        <div className="min-w-0 flex-1">
          <h1
            className="
              text-xl font-extrabold
              leading-tight tracking-tight
              text-slate-900
              sm:text-2xl
              xl:text-3xl
            "
          >
            Tableau de bord de Direction
          </h1>

          <p
            className="
              mt-2 max-w-3xl
              text-sm leading-6
              text-slate-500
            "
          >
            Supervisez l'activité de la plateforme,
            des partenaires et des organisateurs
            d'événements.
          </p>
        </div>

        <div
          className="
            inline-flex shrink-0
            items-center gap-2
            self-start rounded-xl
            border border-[#0c4a6e]/10
            bg-[#0c4a6e]/10
            px-4 py-2.5
            text-xs font-bold
            text-[#0c4a6e]
            sm:text-sm
          "
        >
          <ShieldAlert size={17} />
          Accès Superviseur
        </div>
      </div>

      {/* CARTES STATISTIQUES */}
      <div
        className="
          grid min-w-0
          grid-cols-1 gap-4
          sm:grid-cols-2
          xl:grid-cols-4
          xl:gap-5
        "
      >
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="
                flex min-w-0
                items-center gap-4
                rounded-2xl
                border border-slate-200/70
                bg-white p-5
                shadow-sm
                transition-shadow
                hover:shadow-md
              "
            >
              <div
                className={`
                  flex h-12 w-12
                  shrink-0 items-center
                  justify-center rounded-xl
                  ${stat.bg}
                `}
              >
                <Icon
                  size={23}
                  className={stat.color}
                />
              </div>

              <div className="min-w-0 flex-1">
                <p
                  className="
                    text-xs font-semibold
                    leading-5 text-slate-500
                    sm:text-sm
                  "
                >
                  {stat.label}
                </p>

                <p
                  className="
                    mt-1 break-words
                    text-xl font-extrabold
                    leading-tight text-slate-900
                    2xl:text-2xl
                  "
                >
                  {stat.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* TABLEAU DES DEMANDES */}
      <div
        className="
          w-full min-w-0
          overflow-hidden
          rounded-2xl
          border border-slate-200/70
          bg-white shadow-sm
        "
      >
        {/* EN-TÊTE TABLEAU */}
        <div
          className="
            flex flex-col gap-3
            border-b border-slate-100
            bg-slate-50/60
            px-4 py-5
            sm:flex-row
            sm:items-center
            sm:justify-between
            sm:px-6
          "
        >
          <div className="min-w-0">
            <h2
              className="
                text-base font-bold
                leading-6 text-slate-900
                sm:text-lg
              "
            >
              Nouvelles demandes
            </h2>

            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Partenaires et organisateurs
            </p>
          </div>

          <span
            className="
              inline-flex shrink-0
              self-start rounded-full
              bg-[#0c4a6e]/10
              px-3 py-1.5
              text-xs font-bold
              text-[#0c4a6e]
            "
          >
            {pendingApplications.length} dossiers
          </span>
        </div>

        {/* SCROLL HORIZONTAL LIMITÉ AU TABLEAU */}
        <div className="w-full max-w-full overflow-x-auto">
          <table
            className="
              w-full min-w-[780px]
              border-collapse
              text-left text-sm
            "
          >
            <thead>
              <tr className="border-b border-slate-100 bg-white">
                <th className="whitespace-nowrap px-5 py-4 font-semibold text-slate-500">
                  Structure / Projet
                </th>

                <th className="whitespace-nowrap px-5 py-4 font-semibold text-slate-500">
                  Type de profil
                </th>

                <th className="whitespace-nowrap px-5 py-4 font-semibold text-slate-500">
                  Catégorie
                </th>

                <th className="whitespace-nowrap px-5 py-4 font-semibold text-slate-500">
                  Date de soumission
                </th>

                <th className="whitespace-nowrap px-5 py-4 text-right font-semibold text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {pendingApplications.map((app) => (
                <tr
                  key={app.id}
                  className="transition-colors hover:bg-slate-50"
                >
                  <td className="px-5 py-4">
                    <span className="font-bold text-slate-900">
                      {app.name}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`
                        inline-flex whitespace-nowrap
                        rounded-full px-3 py-1.5
                        text-xs font-bold
                        ${
                          app.type === "Organisateur"
                            ? "bg-[#c9a84c]/10 text-[#9a772b]"
                            : "bg-[#0c4a6e]/10 text-[#0c4a6e]"
                        }
                      `}
                    >
                      {app.type}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {app.category}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                    {app.date}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1.5">
                      <button
                        type="button"
                        title="Examiner le dossier"
                        aria-label={`Examiner ${app.name}`}
                        className="
                          rounded-lg p-2
                          text-slate-400
                          transition-colors
                          hover:bg-blue-50
                          hover:text-blue-600
                        "
                      >
                        <Eye size={18} />
                      </button>

                      <button
                        type="button"
                        title="Valider"
                        aria-label={`Valider ${app.name}`}
                        className="
                          rounded-lg p-2
                          text-slate-400
                          transition-colors
                          hover:bg-emerald-50
                          hover:text-emerald-600
                        "
                      >
                        <CheckCircle size={18} />
                      </button>

                      <button
                        type="button"
                        title="Rejeter"
                        aria-label={`Rejeter ${app.name}`}
                        className="
                          rounded-lg p-2
                          text-slate-400
                          transition-colors
                          hover:bg-red-50
                          hover:text-red-600
                        "
                      >
                        <XCircle size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PIED DU TABLEAU */}
        <div
          className="
            flex flex-wrap items-center
            justify-between gap-2
            border-t border-slate-100
            bg-slate-50/40
            px-4 py-3
            text-xs text-slate-500
            sm:px-6
          "
        >
          <span>
            {pendingApplications.length} demandes affichées
          </span>

          <span>
            Données de démonstration
          </span>
        </div>
      </div>
    </section>
  );
}
