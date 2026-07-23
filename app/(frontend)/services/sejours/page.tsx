"use client";
import Link from "next/link";
import { MapPin, Star, Search, SlidersHorizontal } from "lucide-react";
import { useState, useEffect } from "react";

// Données de secours (fallback) si l'API Supabase est vide ou injoignable
const HOTELS_LITTORAL_FALLBACK = [
  {
    id: "1",
    title: "La Baie des Sirènes",
    type: "Hôtel",
    city: "Grand-Béréby",
    price: 85000,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"
  },
  {
    id: "2",
    title: "Villa Assinie Paradise",
    type: "Villa",
    city: "Assinie-Mafia",
    price: 150000,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80"
  },
  {
    id: "3",
    title: "Hôtel Étoile du Sud",
    type: "Hôtel",
    city: "Grand-Bassam",
    price: 45000,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80"
  },
  {
    id: "4",
    title: "Résidence Les Cocotiers",
    type: "Résidence",
    city: "San Pedro",
    price: 60000,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"
  }
];

const categories = ["Tout", "Hôtels", "Résidences", "Villas", "Maisons d'hôtes"];

export default function SejoursPage() {
  const [activeCategory, setActiveCategory] = useState("Tout");
  const [search, setSearch] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/recherche`);
        if (res.ok) {
          const json = await res.json();
          const results = json.data || json || [];
          if (results.length > 0) {
            setData(results);
          } else {
            setData(HOTELS_LITTORAL_FALLBACK);
          }
        } else {
          setData(HOTELS_LITTORAL_FALLBACK);
        }
      } catch (err) {
        console.warn("Erreur API, utilisation des données locales de secours.");
        setData(HOTELS_LITTORAL_FALLBACK);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filtrage par catégorie + recherche ville ou titre
  const filtered = data.filter(item => {
    const type = (item.type || "").toLowerCase();
    const city = (item.city || item.destination || "").toLowerCase();
    const title = (item.title || item.titre || "").toLowerCase();

    let matchCat = true;
    if (activeCategory === "Hôtels") matchCat = type.includes("hotel");
    if (activeCategory === "Résidences") matchCat = type.includes("residence");
    if (activeCategory === "Villas") matchCat = type.includes("villa");
    if (activeCategory === "Maisons d'hôtes") matchCat = type.includes("maison") || type.includes("hote");

    const matchSearch = city.includes(search.toLowerCase()) || title.includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="bg-[#003b95] text-white py-16 md:py-20 px-4 mb-12">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">Trouvez votre hébergement idéal</h1>
          <p className="text-blue-100 text-sm md:text-lg mb-10 max-w-2xl mx-auto">Hôtels, résidences, villas en bord de mer.</p>
          <div className="max-w-3xl mx-auto bg-white p-2 rounded-2xl md:rounded-full shadow-xl flex flex-col md:flex-row gap-2">
            <div className="flex-1 flex items-center bg-slate-50 rounded-xl md:rounded-full px-4 py-3">
              <MapPin className="text-slate-400 mr-2" size={20} />
              <input value={search} onChange={(e)=>setSearch(e.target.value)} type="text" placeholder="Où allez-vous? (Assinie, Bassam...)" className="bg-transparent w-full outline-none text-slate-800" />
            </div>
            <button className="bg-[#c9a84c] text-white font-bold py-3 px-8 rounded-xl md:rounded-full flex items-center justify-center gap-2"><Search size={20} /> Rechercher</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex overflow-x-auto w-full md:w-auto gap-2 pb-2 [&::-webkit-scrollbar]:hidden">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`whitespace-nowrap px-6 py-2.5 rounded-full font-bold text-sm transition-all ${activeCategory === cat? "bg-[#003b95] text-white shadow-md" : "bg-white text-slate-600 border"}`}>{cat}</button>
            ))}
          </div>
        </div>

        {loading ? <p className="text-center py-20 text-slate-500 font-medium">Chargement des hébergements...</p> :
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.length === 0 ? <p className="col-span-4 text-center text-slate-500 py-12">Aucun hébergement trouvé pour "{activeCategory}"</p> :
          filtered.map((item) => {
            const itemTypeNormalized = (item.type || "hotel").toLowerCase();
            const itemImg = Array.isArray(item.images) ? item.images[0] : (item.image?.url || item.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80");
            const itemPriceFormatted = typeof item.price === 'number' ? item.price.toLocaleString('fr-FR') : (item.prix || "Sur devis");

            return (
              <Link href={`/services/${itemTypeNormalized}/${item.id}`} key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border hover:shadow-xl transition-all flex flex-col group">
                <div className="relative h-56 overflow-hidden">
                  <img src={itemImg} alt={item.title || item.titre} className="w-full h-full object-cover group-hover:scale-110 duration-700" />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-black text-[#003b95]">{item.type}</div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-black text-lg text-slate-900 line-clamp-1">{item.title || item.titre}</h3>
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-md"><Star size={14} className="text-amber-500 fill-amber-500" /><span className="text-xs font-bold text-amber-700">{item.rating || "8,0"}</span></div>
                  </div>
                  <p className="text-slate-500 text-sm flex gap-1.5 mb-4"><MapPin size={14} /> {item.city || item.destination || item.location}</p>
                  <div className="mt-auto pt-4 border-t flex justify-between items-end">
                    <div><span className="text-xs text-slate-500">À partir de</span><div className="font-black text-lg text-[#003b95]">{itemPriceFormatted} <span className="text-sm font-bold text-slate-400">XOF</span></div></div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        }
      </div>
    </div>
  );
}