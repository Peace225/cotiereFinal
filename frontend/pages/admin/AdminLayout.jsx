
"use client";

import React from "react";
import AdminSidebar from "@/components/admin/AdminNavbar";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f6f8fb]">

      {/* SIDEBAR ADMINISTRATEUR
          Largeur desktop : 288px (w-72)
          Navigation mobile gérée par AdminNavbar.tsx
      */}
      <AdminSidebar />

      {/* CONTENU PRINCIPAL
          lg:pl-72 réserve 288px au sidebar fixe
      */}
      <div className="min-h-screen min-w-0 lg:pl-72">

        <div className="flex min-h-screen min-w-0 flex-col">

          {/* HEADER DESKTOP */}
          <header
            className="
              sticky top-0 z-30
              hidden h-16 shrink-0
              items-center justify-between
              border-b border-slate-200
              bg-white px-6 shadow-sm
              lg:flex lg:px-8
            "
          >
            <div className="min-w-0">
              <h2 className="truncate text-lg font-bold text-[#0c4a6e]">
                Espace Superviseur
              </h2>

              <p className="text-xs text-slate-400">
                Côtière Media Group
              </p>
            </div>

            {/* PROFIL ADMINISTRATEUR */}
            <div className="flex shrink-0 items-center gap-3">

              <div className="text-right">
                <p className="text-sm font-bold text-slate-900">
                  Direction
                </p>

                <p className="text-xs text-slate-500">
                  Administrateur
                </p>
              </div>

              <div
                className="
                  flex h-10 w-10
                  items-center justify-center
                  rounded-full bg-[#0c4a6e]
                  font-bold text-white
                "
              >
                D
              </div>
            </div>
          </header>

          {/* ZONE PRINCIPALE */}
          <main
            id="admin-main-content"
            className="
              min-w-0 flex-1
              px-4 py-6
              sm:px-6
              lg:px-8 lg:py-8
            "
          >
            <div className="mx-auto w-full min-w-0 max-w-[1600px]">
              {children}
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}
