"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, CheckCircle, Pencil, Trash2, X, ShoppingBag, Clock } from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import ImageUploader from "@/components/admin/ImageUploader";
import ExportButton from "@/components/admin/ExportButton";

type Produit = {
  id: string; label: string; desc: string; prix: number; unite: string;
  categorie: string; images: string[]; isActive: boolean;
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700", CONFIRMED: "bg-green-100 text-green-700",
  REFUSED: "bg-red-100 text-red-700", CANCELLED: "bg-gray-100 text-gray-600", COMPLETED: "bg-blue-100 text-blue-700",
};
const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente", CONFIRMED: "Confirme", REFUSED: "Refuse", CANCELLED: "Annule", COMPLETED: "Termine",
};

const DEFAULT_PRODUITS: Produit[] = [
  { id: "1", label: "Attieke frais (1kg)", desc: "Semoule de manioc traditionnelle fraiche", prix: 1500, unite: "kg", categorie: "Feculents", images: ["https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80"], isActive: true },
  { id: "2", label: "Attieke frais (5kg)", desc: "Semoule de manioc en gros", prix: 6500, unite: "5kg", categorie: "Feculents", images: ["https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80"], isActive: true },
  { id: "3", label: "Poisson braise", desc: "Poisson frais du jour braise", prix: 3000, unite: "piece", categorie: "Poissons", images: ["https://images.unsplash.com/photo-1534482421-64566f976cfa?w=400&q=80"], isActive: true },
  { id: "4", label: "Crevettes fraiches (500g)", desc: "Crevettes peche locale", prix: 5000, unite: "500g", categorie: "Fruits de mer", images: ["https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&q=80"], isActive: true },
  { id: "5", label: "Homard", desc: "Homard vivant du littoral", prix: 15000, unite: "piece", categorie: "Fruits de mer", images: ["https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&q=80"], isActive: true },
  { id: "6", label: "Ananas frais", desc: "Ananas sucre de la region", prix: 1000, unite: "piece", categorie: "Fruits", images: ["https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=400&q=80"], isActive: true },
  { id: "7", label: "Mangues (1kg)", desc: "Mangues mures de saison", prix: 1500, unite: "kg", categorie: "Fruits", images: ["https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=400&q=80"], isActive: true },
  { id: "8", label: "Panier mixte fruits de mer", desc: "Assortiment crevettes, crabes, poissons", prix: 25000, unite: "panier", categorie: "Paniers", images: ["https://images.unsplash.com/photo-1534482421-64566f976cfa?w=400&q=80"], isActive: true },
  // Légumes
  { id: "9", label: "Tomates fraiches (1kg)", desc: "Tomates locales bien mures", prix: 800, unite: "kg", categorie: "Legumes", images: ["https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&q=80"], isActive: true },
  { id: "10", label: "Oignons (1kg)", desc: "Oignons frais du marche local", prix: 600, unite: "kg", categorie: "Legumes", images: ["https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=400&q=80"], isActive: true },
  { id: "11", label: "Gombo frais (500g)", desc: "Gombo tendre pour sauces et plats", prix: 700, unite: "500g", categorie: "Legumes", images: ["https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400&q=80"], isActive: true },
  { id: "12", label: "Aubergines (1kg)", desc: "Aubergines africaines fraiches", prix: 900, unite: "kg", categorie: "Legumes", images: ["https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=400&q=80"], isActive: true },
  { id: "13", label: "Piments frais (250g)", desc: "Piments locaux forts et parfumes", prix: 500, unite: "250g", categorie: "Legumes", images: ["https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=400&q=80"], isActive: true },
  { id: "14", label: "Igname (1kg)", desc: "Igname fraiche du littoral", prix: 1200, unite: "kg", categorie: "Feculents", images: ["https://images.unsplash.com/photo-1590165482129-1b8b27698780?w=400&q=80"], isActive: true },
  { id: "15", label: "Plantain mur (regime)", desc: "Banane plantain bien murie", prix: 2000, unite: "regime", categorie: "Feculents", images: ["https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&q=80"], isActive: true },
  // Viandes
  { id: "16", label: "Poulet entier", desc: "Poulet fermier local frais", prix: 5000, unite: "piece", categorie: "Viandes", images: ["https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400&q=80"], isActive: true },
  { id: "17", label: "Viande de boeuf (1kg)", desc: "Boeuf frais decoupes en morceaux", prix: 4500, unite: "kg", categorie: "Viandes", images: ["https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&q=80"], isActive: true },
  { id: "18", label: "Viande de mouton (1kg)", desc: "Mouton frais du marche local", prix: 5500, unite: "kg", categorie: "Viandes", images: ["https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&q=80"], isActive: true },
  { id: "19", label: "Escargots (500g)", desc: "Escargots frais du littoral", prix: 3500, unite: "500g", categorie: "Viandes", images: ["https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&q=80"], isActive: true },
  // Épices
  { id: "20", label: "Gingembre frais (250g)", desc: "Gingembre local tres parfume", prix: 600, unite: "250g", categorie: "Epices", images: ["https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&q=80"], isActive: true },
  { id: "21", label: "Ail frais (250g)", desc: "Ail local fort et aromatique", prix: 700, unite: "250g", categorie: "Epices", images: ["https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=400&q=80"], isActive: true },
  { id: "22", label: "Cube Maggi (boite 100)", desc: "Assaisonnement cuisine africaine", prix: 2000, unite: "boite", categorie: "Epices", images: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80"], isActive: true },
  // Boissons
  { id: "23", label: "Jus de gingembre (1L)", desc: "Boisson naturelle au gingembre frais", prix: 1500, unite: "litre", categorie: "Boissons", images: ["https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&q=80"], isActive: true },
  { id: "24", label: "Bissap (1L)", desc: "Jus d'hibiscus naturel et rafraichissant", prix: 1200, unite: "litre", categorie: "Boissons", images: ["https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80"], isActive: true },
  { id: "25", label: "Vin de palme (1L)", desc: "Vin de palme traditionnel du littoral", prix: 1000, unite: "litre", categorie: "Boissons", images: ["https://images.unsplash.com/photo-1474722883778-792e7990302f?w=400&q=80"], isActive: true },
];


const emptyForm = { label: "", desc: "", prix: "", unite: "", categorie: "", images: "" };

export default function AdminMarketPage() {
  const [produits, setProduits] = useState<Produit[]>(DEFAULT_PRODUITS);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [tab, setTab] = useState<"produits" | "commandes">("produits");
  const [commandes, setCommandes] = useState<any[]>([]);
  const [loadingCommandes, setLoadingCommandes] = useState(false);

  async function loadCommandes() {
    setLoadingCommandes(true);
    try {
      const res = await fetch("/api/events/requests?limit=500");
      const data = await res.json();
      const all = data.data?.requests ?? data.data ?? [];
      const market = all.filter((b: any) => b.eventType === "Commande Market");
      setCommandes(market);
    } catch {}
    setLoadingCommandes(false);
  }

  useEffect(() => {
    if (tab === "commandes") loadCommandes();
  }, [tab]);

  async function changeStatus(id: string, status: string, booking: any) {
    await fetch(`/api/events/requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setCommandes(prev => prev.map(b => b.id === id ? { ...b, status } : b));

    if (status === "CONFIRMED" || status === "REFUSED") {
      let phone = (booking.clientPhone ?? "").replace(/[\s\-().+]/g, "");
      if (phone.startsWith("00")) phone = phone.slice(2);
      if (phone.startsWith("0") && phone.length <= 10) phone = "225" + phone;
      if (!phone || phone.length < 8) return;

      const clientName = (booking.clientFirstName + " " + booking.clientLastName).toUpperCase();
      const ref = (booking.reference ?? booking.id).slice(-6).toUpperCase();

      let marketAdresse = "";
      let articlesFormatted = "";
      if (booking.description) {
        const lines = booking.description.split("\n");
        const serviceLine = lines.find((l: string) => l.startsWith("Service :"));
        const msgLine = lines.find((l: string) => l.startsWith("Message :"));
        if (msgLine) marketAdresse = msgLine.replace("Message : ", "");
        if (serviceLine) {
          const details = serviceLine.replace("Service : ", "");
          const parts = details.split(" | Total:");
          const articlesPart = parts[0] ?? details;
          const totalPart = parts[1] ? parts[1].trim() : "";
          articlesFormatted = articlesPart.split(", ").map((a: string) => "- " + a.replace(/\((\d[\d\s]*FCFA)\)/, "= $1")).join("\n");
          if (totalPart) articlesFormatted += "\n\nTOTAL: " + totalPart;
        }
      }

      const msgConfirmed =
        "COMMANDE COTIERE MARKET [" + ref + "]\n\n" +
        "Bonjour " + clientName + ",\n\n" +
        "Votre commande a ete CONFIRMEE !\n\n" +
        (marketAdresse ? marketAdresse + "\n\n" : "") +
        (articlesFormatted ? "ARTICLES:\n" + articlesFormatted + "\n\n" : "") +
        "Notre livreur vous contactera.\n\nMerci de votre confiance.\n-- COTIERE MEDIA GROUP\n1er site officiel des villes et villages du littoral ivoirien\nTel: 07 47 72 29 31";

      const msgRefused =
        "COMMANDE COTIERE MARKET [" + ref + "] - NON DISPONIBLE\n\n" +
        "Bonjour " + clientName + ",\n\n" +
        "Nous sommes desoles, votre commande n'a pas pu etre traitee.\n\n" +
        "Contactez-nous pour plus d'informations.\n\n-- COTIERE MEDIA GROUP\n1er site officiel des villes et villages du littoral ivoirien\nTel: 07 47 72 29 31";

      const msg = encodeURIComponent(status === "CONFIRMED" ? msgConfirmed : msgRefused);
      window.open("https://wa.me/" + phone + "?text=" + msg, "_blank");
    }
  }

  function openEdit(p: Produit) {
    setForm({ label: p.label, desc: p.desc, prix: String(p.prix), unite: p.unite, categorie: p.categorie, images: p.images.join(", ") });
    setEditId(p.id); setShowModal(true);
  }

  function saveProduit() {
    setSaving(true);
    const body: Produit = {
      id: editId ?? String(Date.now()),
      label: form.label,
      desc: form.desc,
      prix: parseInt(form.prix) || 0,
      unite: form.unite,
      categorie: form.categorie,
      images: form.images ? form.images.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
      isActive: true,
    };
    if (editId) setProduits(prev => prev.map(p => p.id === editId ? body : p));
    else setProduits(prev => [...prev, body]);
    setShowModal(false); setForm(emptyForm); setEditId(null); setSaving(false);
  }

  function deleteProduit(id: string) {
    if (!confirm("Supprimer ce produit ?")) return;
    setProduits(prev => prev.filter(p => p.id !== id));
  }

  function toggleActive(p: Produit) {
    setProduits(prev => prev.map(prod => prod.id === p.id ? { ...prod, isActive: !prod.isActive } : prod));
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h1 className="text-2xl font-black text-[#0c4a6e]">Market</h1>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => { setShowModal(true); setEditId(null); setForm(emptyForm); }}
              className="flex items-center gap-2 bg-[#c9a84c] hover:bg-[#b8973b] text-white font-bold px-4 py-2 rounded-xl transition-colors shadow-md text-sm">
              <Plus size={15} /> Ajouter un produit
            </button>
            <button onClick={() => setTab("produits")}
              className={"px-4 py-2 rounded-lg text-sm font-semibold transition-all " + (tab === "produits" ? "bg-[#0c4a6e] text-white" : "bg-white text-gray-500 border border-gray-200")}>
              Produits ({produits.length})
            </button>
            <button onClick={() => setTab("commandes")}
              className={"px-4 py-2 rounded-lg text-sm font-semibold transition-all " + (tab === "commandes" ? "bg-[#0c4a6e] text-white" : "bg-white text-gray-500 border border-gray-200")}>
              Commandes
            </button>
          </div>
        </div>

        {tab === "produits" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {produits.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <div className="relative h-40 bg-gray-100">
                  {p.images[0] ? (
                    <img src={p.images[0]} alt={p.label} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300"><ShoppingBag size={40} /></div>
                  )}
                  <span className={"absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full font-bold " + (p.isActive ? "bg-green-500 text-white" : "bg-red-500 text-white")}>
                    {p.isActive ? "DISPONIBLE" : "INDISPONIBLE"}
                  </span>
                  <span className="absolute top-3 right-3 bg-[#c9a84c] text-white text-xs font-bold px-2 py-1 rounded-full">
                    {p.prix.toLocaleString()} FCFA
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-[#0c4a6e] mb-1">{p.label}</h3>
                  <p className="text-xs text-gray-500 mb-1">{p.categorie} · {p.unite}</p>
                  <p className="text-xs text-gray-400 mb-3 line-clamp-2">{p.desc}</p>
                  <div className="flex gap-2">
                    <button onClick={() => toggleActive(p)}
                      className={"flex-1 flex items-center justify-center gap-1 text-xs font-bold py-2 rounded-lg transition-colors " + (p.isActive ? "bg-orange-100 text-orange-600 hover:bg-orange-200" : "bg-green-100 text-green-600 hover:bg-green-200")}>
                      <CheckCircle size={13} /> {p.isActive ? "Desactiver" : "Activer"}
                    </button>
                    <button onClick={() => openEdit(p)}
                      className="flex-1 flex items-center justify-center gap-1 text-xs font-bold py-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors">
                      <Pencil size={13} /> Modifier
                    </button>
                    <button onClick={() => deleteProduit(p.id)}
                      className="flex-1 flex items-center justify-center gap-1 text-xs font-bold py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors">
                      <Trash2 size={13} /> Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "commandes" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-[#c9a84c] rounded-full" />
                <h2 className="font-bold text-[#0c4a6e]">Commandes Market</h2>
                <span className="text-xs text-gray-400 ml-2">{commandes.length} commande(s)</span>
              </div>
              <div className="flex items-center gap-2">
                <ExportButton
                  data={commandes.map((b: any) => {
                    const details = b.description?.split("\n").find((l: string) => l.startsWith("Service :"))?.replace("Service : ", "") ?? "—";
                    const adresse = b.description?.split("\n").find((l: string) => l.startsWith("Message :"))?.replace("Message : ", "") ?? "—";
                    return {
                      reference: (b.reference ?? b.id).slice(-6),
                      client: b.clientFirstName + " " + b.clientLastName,
                      telephone: b.clientPhone,
                      articles: details,
                      adresse: adresse,
                      date_commande: b.createdAt ? new Date(b.createdAt).toLocaleString("fr-FR") : b.eventDate ? new Date(b.eventDate).toLocaleDateString("fr-FR") : "—",
                      statut: b.status,
                    };
                  })}
                  columns={[
                    { key: "reference", label: "Ref" },
                    { key: "client", label: "Client" },
                    { key: "telephone", label: "Telephone" },
                    { key: "articles", label: "Articles" },
                    { key: "adresse", label: "Adresse" },
                    { key: "date_commande", label: "Date commande" },
                    { key: "statut", label: "Statut" },
                  ]}
                  filename={"market-commandes-" + new Date().toISOString().split("T")[0]}
                  label="Commandes"
                />
                <button onClick={loadCommandes} className="text-xs text-[#0c4a6e] hover:underline">Actualiser</button>
              </div>
            </div>
            {loadingCommandes ? (
              <div className="py-12 text-center text-gray-400 text-sm">Chargement...</div>
            ) : commandes.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                <ShoppingBag size={32} className="mx-auto mb-3 opacity-30" />
                <p className="font-medium mb-1">Aucune commande</p>
                <p className="text-sm">Les commandes Market apparaitront ici.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {["Ref", "Client", "WhatsApp", "Articles", "Date commande", "Statut", "Action"].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {commandes.map((b) => {
                      const details = b.description?.split("\n").find((l: string) => l.startsWith("Service :"))?.replace("Service : ", "") ?? "—";
                      // Extraire le nom du premier produit pour l'image
                      const firstItem = details.split(",")[0]?.trim() ?? "";
                      const produitName = firstItem.replace(/\s+x\d+.*$/, "").trim();
                      const MARKET_IMAGES: Record<string, string> = {
                        "Attieke frais (1kg)": "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=60&q=80",
                        "Attieke frais (5kg)": "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=60&q=80",
                        "Poisson braise": "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=60&q=80",
                        "Crevettes fraiches (500g)": "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=60&q=80",
                        "Homard": "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=60&q=80",
                        "Ananas frais": "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=60&q=80",
                        "Mangues (1kg)": "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=60&q=80",
                        "Panier mixte fruits de mer": "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=60&q=80",
                      };
                      const MARKET_IDS: Record<string, string> = {
                        "Attieke frais (1kg)": "1", "Attieke frais (5kg)": "2", "Poisson braise": "3",
                        "Crevettes fraiches (500g)": "4", "Homard": "5", "Ananas frais": "6",
                        "Mangues (1kg)": "7", "Panier mixte fruits de mer": "8",
                      };
                      const imgSrc = MARKET_IMAGES[produitName] ?? "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=60&q=80";
                      const produitId = MARKET_IDS[produitName];
                      return (
                        <tr key={b.id} className="hover:bg-gray-50">
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-2">
                              <img src={imgSrc} alt={produitName} className="w-9 h-9 rounded-lg object-cover shrink-0 border border-gray-100" />
                              <span className="font-mono text-xs text-gray-400">{(b.reference ?? b.id).slice(-6)}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-semibold text-[#0c4a6e] text-sm">{b.clientFirstName} {b.clientLastName}</td>
                          <td className="px-4 py-3">
                            <a href={"https://wa.me/" + b.clientPhone?.replace(/\s/g, "")} target="_blank" rel="noopener noreferrer"
                              className="text-green-600 text-xs font-medium">{b.clientPhone}</a>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-600 max-w-[200px] truncate">
                            {produitId ? (
                              <a href={"/services/market/" + produitId} target="_blank" rel="noopener noreferrer"
                                className="hover:underline text-[#0c4a6e] font-medium">
                                {details} ↗
                              </a>
                            ) : (
                              <a href="/services/market" target="_blank" rel="noopener noreferrer"
                                className="hover:underline text-[#0c4a6e] font-medium">
                                {details} ↗
                              </a>
                            )}
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-600">
                            {b.createdAt ? (
                              <div>
                                <div>{new Date(b.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}</div>
                                <div className="text-gray-400 flex items-center gap-1 mt-0.5">
                                  <Clock size={10} />
                                  {new Date(b.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                                </div>
                              </div>
                            ) : b.eventDate ? new Date(b.eventDate).toLocaleDateString("fr-FR") : "—"}
                          </td>
                          <td className="px-4 py-3">
                            <span className={"text-xs px-2.5 py-1 rounded-full font-semibold " + (STATUS_COLORS[b.status] ?? "bg-gray-100 text-gray-600")}>
                              {STATUS_LABELS[b.status] ?? b.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <select value="" onChange={e => { if (e.target.value) changeStatus(b.id, e.target.value, b); }}
                              className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#38bdf8]">
                              <option value="">Changer statut</option>
                              <option value="PENDING">En attente</option>
                              <option value="CONFIRMED">Confirmer</option>
                              <option value="COMPLETED">Terminer</option>
                              <option value="REFUSED">Refuser</option>
                              <option value="CANCELLED">Annuler</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="font-bold text-[#0c4a6e] text-lg">{editId ? "Modifier" : "Ajouter"} un produit</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {[
                { key: "label", label: "Nom du produit *", placeholder: "Attieke frais (1kg)" },
                { key: "desc", label: "Description", placeholder: "Semoule de manioc traditionnelle..." },
                { key: "prix", label: "Prix (FCFA) *", placeholder: "1500", type: "number" },
                { key: "unite", label: "Unite *", placeholder: "kg / piece / 500g / panier" },
                { key: "categorie", label: "Categorie *", placeholder: "Feculents / Poissons / Fruits de mer / Fruits / Paniers" },
              ].map(({ key, label, placeholder, type }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input type={type ?? "text"} placeholder={placeholder}
                    value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
                <ImageUploader value={form.images} onChange={val => setForm(f => ({ ...f, images: val }))} />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50">Annuler</button>
              <button onClick={saveProduit} disabled={saving || !form.label || !form.prix}
                className="flex-1 bg-[#c9a84c] hover:bg-[#b8973b] text-white font-bold py-2.5 rounded-xl disabled:opacity-60">
                {saving ? "Enregistrement..." : editId ? "Modifier" : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
