// app/dashboard/page.tsx
import { getPartnerServices } from "@/app/actions/serviceActions";
import { BarChart3, Users, DollarSign, ListChecks, PlusCircle } from "lucide-react";
import Link from "next/link";

// ✅ LA LIGNE MAGIQUE : Force le rendu dynamique pour éviter l'erreur de build
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // Récupération dynamique des services depuis la BDD
  const services = await getPartnerServices();

  const stats = [
    { title: "Services Actifs", value: services.length.toString(), icon: <ListChecks className="text-blue-600" /> },
    { title: "Total Ventes", value: "845", icon: <DollarSign className="text-emerald-600" /> },
    { title: "Clients Totaux", value: "1,204", icon: <Users className="text-purple-600" /> },
    { title: "Performance", value: "89%", icon: <BarChart3 className="text-amber-600" /> },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header & Call to Action */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="!text-[20px] md:!text-[25px] font-black text-slate-900">Tableau de bord</h1>
          {/* ✅ CORRIGÉ : Encodage des accents */}
          <p className="text-slate-500">Gérez vos activités et vos services en un coup d'œil.</p>
        </div>
        <Link 
          href="/dashboard/add-service" 
          className="flex items-center gap-2 bg-[#003b95] text-white px-5 py-3 rounded-xl font-bold hover:bg-blue-800 transition shadow-lg"
        >
          <PlusCircle size={20} /> Nouveau Service
        </Link>
      </div>

      {/* Cartes de statistiques (sans dépendre de card.tsx) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white shadow-sm border border-slate-100 rounded-2xl p-6 flex flex-col justify-between">
            <div className="flex flex-row items-center justify-between pb-2">
              <span className="text-sm font-bold text-slate-500">{stat.title}</span>
              {stat.icon}
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Liste des services publiés */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        {/* ✅ CORRIGÉ : Encodage des accents */}
        <h3 className="font-bold text-lg mb-6">Mes services publiés</h3>
        
        {services.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100">
                  <th className="pb-4 font-bold text-sm">Nom du service</th>
                  {/* ✅ CORRIGÉ : Encodage des accents */}
                  <th className="pb-4 font-bold text-sm">Catégorie</th>
                  <th className="pb-4 font-bold text-sm">Prix</th>
                  <th className="pb-4 font-bold text-sm text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {services.map((service) => (
                  <tr key={service.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 font-bold text-slate-900">{service.nom}</td>
                    <td className="py-4 text-slate-500 capitalize">{service.categorie}</td>
                    <td className="py-4 text-slate-700 font-medium">XOF {service.prix || "0"}</td>
                    <td className="py-4 text-right">
                      <button className="text-blue-600 font-bold hover:underline text-sm">Modifier</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400">
            {/* ✅ CORRIGÉ : Encodage des accents */}
            <p>Aucun service publié pour le moment.</p>
            <Link href="/dashboard/add-service" className="text-blue-600 font-bold hover:underline">
              Publier votre premier service
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}