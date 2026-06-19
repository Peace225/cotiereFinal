"use client";
import { useEffect, useState } from "react";
import { RefreshCw, CalendarDays, CheckCircle, Pencil, Plus, X, Trash2, MapPin, Clock, Users, Ticket, Calendar } from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import ImageUploader from "@/components/admin/ImageUploader";
import ExportButton from "@/components/admin/ExportButton";

type Inscription = {
  id: string; reference: string; clientName: string; clientPhone: string;
  clientEmail?: string; evenementSlug: string; evenementTitre: string;
  evenementDate: string; evenementLieu: string; participants: number;
  message?: string; status: string; adminNotes?: string; createdAt: string;
};

type Evenement = {
  id: string; titre: string; categorie: string; date: string; heure: string;
  lieu: string; ville: string; prix: string; capacite: string;
  organisateur: string; description: string; image: string;
  badge: string; badgeColor: string; isActive: boolean;
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
  CONFIRMED: "bg-green-100 text-green-700 border-green-200",
  REFUSED: "bg-red-100 text-red-700 border-red-200",
  CANCELLED: "bg-gray-100 text-gray-600 border-gray-200",
  COMPLETED: "bg-blue-100 text-blue-700 border-blue-200",
};
const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente", CONFIRMED: "Confirme", REFUSED: "Refuse",
  CANCELLED: "Annule", COMPLETED: "Termine",
};

const BADGE_COLORS = ["bg-blue-500","bg-amber-500","bg-green-500","bg-teal-500","bg-purple-500","bg-orange-500","bg-red-500","bg-pink-500"];
const CATEGORIES = ["Festival","Gala","Conference","Fete culturelle","Salon","Sport","Concert","Exposition","Formation","Autre"];

const DEFAULT_EVENEMENTS: Evenement[] = [
  { id: "festival-musique-littoral", titre: "Festival de Musique du Littoral 2026", categorie: "Festival", date: "14 - 16 Mai 2026", heure: "16h00 - 02h00", lieu: "Plage de Grand-Bassam", ville: "Grand-Bassam", prix: "5 000 - 25 000 FCFA", capacite: "5 000 personnes / soir", organisateur: "COTIERE EVENT", description: "3 jours de musique live sur la plage avec les meilleurs artistes du littoral ivoirien.", image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&q=80", badge: "A venir", badgeColor: "bg-blue-500", isActive: true },
  { id: "gala-entrepreneurs-cotiere", titre: "Gala des Entrepreneurs du Littoral", categorie: "Gala", date: "7 Juin 2026", heure: "19h00 - 00h00", lieu: "Hotel Palm Club", ville: "Abidjan - Cocody", prix: "50 000 - 150 000 FCFA", capacite: "300 invites", organisateur: "COTIERE Opportunites", description: "Soiree de prestige reunissant les entrepreneurs, investisseurs et decideurs economiques du littoral ivoirien.", image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&q=80", badge: "Places limitees", badgeColor: "bg-amber-500", isActive: true },
  { id: "forum-tourisme-cotier", titre: "Forum du Tourisme Cotier Ivoirien", categorie: "Conference", date: "21 - 22 Juin 2026", heure: "08h30 - 18h00", lieu: "Centre de Conferences de Grand-Bassam", ville: "Grand-Bassam", prix: "Gratuit - 30 000 FCFA", capacite: "500 participants", organisateur: "COTIERE & Ministere du Tourisme", description: "2 jours de conferences, ateliers et echanges autour du developpement touristique du littoral ivoirien.", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80", badge: "Inscription ouverte", badgeColor: "bg-green-500", isActive: true },
  { id: "fete-mer-jacqueville", titre: "Fete de la Mer - Jacqueville 2026", categorie: "Fete culturelle", date: "4 Juillet 2026", heure: "10h00 - 22h00", lieu: "Front de mer de Jacqueville", ville: "Jacqueville", prix: "Entree libre", capacite: "Tout public", organisateur: "Mairie de Jacqueville & COTIERE", description: "Grande fete populaire celebrant la mer, les pecheurs et la culture maritime de Jacqueville.", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80", badge: "Entree libre", badgeColor: "bg-teal-500", isActive: true },
  { id: "salon-artisanat-assinie", titre: "Salon de l Artisanat d Assinie", categorie: "Salon", date: "18 - 20 Juillet 2026", heure: "09h00 - 20h00", lieu: "Village Artisanal d Assinie", ville: "Assinie", prix: "2 000 FCFA / jour", capacite: "2 000 visiteurs / jour", organisateur: "Chambre des Metiers & COTIERE", description: "3 jours de decouverte de l artisanat ivoirien : tissage, sculpture, bijouterie, poterie et gastronomie locale.", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", badge: "Exposants bienvenus", badgeColor: "bg-purple-500", isActive: true },
  { id: "tournoi-foot-plage", titre: "Tournoi de Football de Plage - Cotiere Cup", categorie: "Sport", date: "9 - 10 Aout 2026", heure: "08h00 - 20h00", lieu: "Plage de Bassam", ville: "Grand-Bassam", prix: "Spectateurs : Gratuit - Equipes : 50 000 FCFA", capacite: "16 equipes / 3 000 spectateurs", organisateur: "COTIERE Sport & FIF", description: "Tournoi officiel de beach soccer reunissant 16 equipes du littoral ivoirien pour 2 jours de competition intense.", image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&q=80", badge: "Inscriptions ouvertes", badgeColor: "bg-orange-500", isActive: true },
  { id: "festival-jazz-bassam", titre: "Festival Jazz et Blues de Bassam", categorie: "Festival", date: "2 - 3 Aout 2026", heure: "18h00 - 01h00", lieu: "Hotel Residence Bassam", ville: "Grand-Bassam", prix: "10 000 - 30 000 FCFA", capacite: "800 places/soir", organisateur: "COTIERE EVENT et Jazz Club Abidjan", description: "Une nuit de jazz et blues en bord de mer avec des musiciens de renommee internationale.", image: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400&q=80", badge: "Nouveaute", badgeColor: "bg-indigo-500", isActive: true },
  { id: "festival-afrobeat-abidjan", titre: "Afrobeat Summer Festival", categorie: "Festival", date: "22 - 23 Aout 2026", heure: "17h00 - 03h00", lieu: "Stade Felix Houphouet-Boigny", ville: "Abidjan", prix: "15 000 - 50 000 FCFA", capacite: "20 000/soir", organisateur: "COTIERE EVENT et Live Nation Africa", description: "Le plus grand festival afrobeat de Cote d Ivoire avec 20 artistes sur 2 scenes.", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80", badge: "Bientot", badgeColor: "bg-pink-500", isActive: true },
  { id: "gala-culture-cotiere", titre: "Gala de la Culture Cotiere", categorie: "Gala", date: "28 Juin 2026", heure: "19h30 - 23h30", lieu: "Sofitel Abidjan Hotel Ivoire", ville: "Abidjan", prix: "75 000 - 200 000 FCFA", capacite: "400 invites", organisateur: "Ministere de la Culture et COTIERE", description: "Soiree de gala celebrant les artistes, createurs et acteurs culturels du littoral ivoirien.", image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&q=80", badge: "Prestige", badgeColor: "bg-rose-500", isActive: true },
  { id: "gala-sport-cotiere", titre: "Gala du Sport Cotier 2026", categorie: "Gala", date: "15 Novembre 2026", heure: "19h00 - 23h00", lieu: "Palais de la Culture", ville: "Abidjan - Treichville", prix: "30 000 - 80 000 FCFA", capacite: "500 invites", organisateur: "COTIERE Sport et Ministere des Sports", description: "Remise des trophees aux meilleurs sportifs et clubs du littoral ivoirien pour la saison 2026.", image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&q=80", badge: "A venir", badgeColor: "bg-blue-500", isActive: true },
  { id: "sommet-economie-bleue", titre: "Sommet de l Economie Bleue", categorie: "Conference", date: "10 - 11 Septembre 2026", heure: "09h00 - 17h30", lieu: "CICG Abidjan", ville: "Abidjan - Plateau", prix: "Gratuit - 50 000 FCFA", capacite: "800 participants", organisateur: "COTIERE et Union Africaine", description: "Sommet international dedie a l economie maritime, la peche durable et les ressources cotieres.", image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&q=80", badge: "Inscription ouverte", badgeColor: "bg-green-500", isActive: true },
  { id: "conference-numerique-cotiere", titre: "Conference Numerique et Innovation Cotiere", categorie: "Conference", date: "5 Octobre 2026", heure: "09h00 - 18h00", lieu: "Universite Felix Houphouet-Boigny", ville: "Abidjan - Cocody", prix: "Gratuit", capacite: "600 participants", organisateur: "COTIERE et Ministere du Numerique", description: "Journee de conferences sur la transformation numerique des entreprises du littoral ivoirien.", image: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=400&q=80", badge: "Bientot", badgeColor: "bg-cyan-500", isActive: true },
  { id: "fete-igname-grand-lahou", titre: "Fete de l Igname - Grand-Lahou", categorie: "Fete culturelle", date: "19 Juillet 2026", heure: "09h00 - 20h00", lieu: "Place du Marche de Grand-Lahou", ville: "Grand-Lahou", prix: "Entree libre", capacite: "Tout public", organisateur: "Chefferie de Grand-Lahou et COTIERE", description: "Celebration traditionnelle des premieres recoltes d igname avec danses, chants et gastronomie locale.", image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80", badge: "Entree libre", badgeColor: "bg-teal-500", isActive: true },
  { id: "carnaval-bassam-2026", titre: "Carnaval de Grand-Bassam 2026", categorie: "Fete culturelle", date: "12 Septembre 2026", heure: "14h00 - 22h00", lieu: "Quartier France - Grand-Bassam", ville: "Grand-Bassam", prix: "Entree libre", capacite: "Tout public", organisateur: "Mairie de Grand-Bassam et COTIERE", description: "Defile de chars, costumes traditionnels et musiques du monde dans les rues historiques de Bassam.", image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&q=80", badge: "Populaire", badgeColor: "bg-orange-500", isActive: true },
  { id: "salon-gastronomie-cotiere", titre: "Salon de la Gastronomie Cotiere", categorie: "Salon", date: "8 - 9 Aout 2026", heure: "10h00 - 21h00", lieu: "Esplanade du Port de Peche", ville: "Abidjan - Treichville", prix: "3 000 FCFA / jour", capacite: "3 000 visiteurs/jour", organisateur: "COTIERE Market et Chambre de Commerce", description: "Decouverte des saveurs du littoral : poissons, fruits de mer, attieke et specialites cotieres.", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80", badge: "Nouveau", badgeColor: "bg-emerald-500", isActive: true },
  { id: "salon-immobilier-cotier", titre: "Salon de l Immobilier Cotier", categorie: "Salon", date: "17 - 18 Octobre 2026", heure: "09h00 - 18h00", lieu: "Palais des Congres d Abidjan", ville: "Abidjan - Plateau", prix: "Gratuit - 10 000 FCFA", capacite: "1 500 visiteurs/jour", organisateur: "COTIERE et Federation Immobiliere CI", description: "Rencontre des promoteurs, investisseurs et acheteurs autour de l immobilier cotier ivoirien.", image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80", badge: "Professionnel", badgeColor: "bg-slate-500", isActive: true },
  { id: "marathon-cotier-2026", titre: "Marathon Cotier de Cote d Ivoire", categorie: "Sport", date: "27 Septembre 2026", heure: "06h00 - 14h00", lieu: "Depart : Plage de Vridi", ville: "Abidjan - Vridi", prix: "15 000 - 25 000 FCFA", capacite: "2 000 coureurs", organisateur: "COTIERE Sport et Federation Athletisme CI", description: "42 km le long du littoral ivoirien, de Vridi a Grand-Bassam. Ouvert aux coureurs amateurs et professionnels.", image: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=400&q=80", badge: "Inscriptions ouvertes", badgeColor: "bg-orange-500", isActive: true },
  { id: "tournoi-volleyball-plage", titre: "Tournoi de Volleyball de Plage", categorie: "Sport", date: "25 - 26 Octobre 2026", heure: "09h00 - 19h00", lieu: "Plage de Gonzagueville", ville: "Port-Bouet", prix: "Gratuit", capacite: "32 equipes / 2 000 spectateurs", organisateur: "COTIERE Sport et Federation Volleyball CI", description: "Tournoi de beach-volley ouvert a tous les niveaux avec 32 equipes mixtes sur les plages de Port-Bouet.", image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&q=80", badge: "Bientot", badgeColor: "bg-blue-500", isActive: true },
  { id: "formation-entrepreneuriat-cotier", titre: "Formation Entrepreneuriat Cotier", categorie: "Formation", date: "13 - 14 Juin 2026", heure: "08h30 - 17h00", lieu: "Centre de Formation COTIERE", ville: "Grand-Bassam", prix: "25 000 - 50 000 FCFA", capacite: "30 participants", organisateur: "COTIERE & Chambre de Commerce", description: "2 jours de formation intensive pour lancer et developper son activite sur le littoral ivoirien. Business plan, financement, marketing local.", image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&q=80", badge: "Inscription ouverte", badgeColor: "bg-green-500", isActive: true },
  { id: "formation-metiers-tourisme", titre: "Formation aux Metiers du Tourisme Cotier", categorie: "Formation", date: "20 - 22 Juillet 2026", heure: "09h00 - 17h00", lieu: "Ecole Hoteliere d Abidjan", ville: "Abidjan - Cocody", prix: "30 000 - 75 000 FCFA", capacite: "25 participants", organisateur: "COTIERE & Ecole Hoteliere d Abidjan", description: "3 jours de formation professionnelle certifiante : accueil touristique, guide de voyage, gestion hoteliere et restauration cotiere.", image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80", badge: "Places limitees", badgeColor: "bg-amber-500", isActive: true },
  { id: "formation-numerique-pme", titre: "Formation Numerique pour PME du Littoral", categorie: "Formation", date: "3 - 4 Octobre 2026", heure: "09h00 - 17h00", lieu: "Espace Numerique COTIERE", ville: "Abidjan - Plateau", prix: "20 000 FCFA", capacite: "20 participants", organisateur: "COTIERE & Ministere du Numerique", description: "2 jours de formation pratique : reseaux sociaux, e-commerce, site web et outils numeriques pour les PME du littoral ivoirien.", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80", badge: "Nouveau", badgeColor: "bg-cyan-500", isActive: true },
  { id: "formation-react-native-elite-upwork", titre: "Formation React Native — Developpement Mobile", categorie: "Formation", date: "16 Mai 2026", heure: "Lundi - Vendredi", lieu: "Elite Upwork — Centre de Formation", ville: "Abidjan", prix: "400 000 FCFA (inscription : 5 000 FCFA)", capacite: "Ouvert a tous", organisateur: "Elite Upwork", description: "Formation intensive de 6 mois en developpement mobile React Native avec certificat et stage inclus. Contacts : 27 24 39 47 01 / 07 18 11 86 37", image: "/Images/formation.jpeg", badge: "Nouvelle rentree", badgeColor: "bg-red-500", isActive: true },
];

const emptyForm = { titre: "", categorie: "Festival", date: "", heure: "", lieu: "", ville: "", prix: "", capacite: "", organisateur: "", description: "", image: "", badge: "A venir", badgeColor: "bg-blue-500" };

export default function AdminRdvPage() {
  const [evenements, setEvenements] = useState<Evenement[]>([]);
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("ALL");
  const [eventFilter, setEventFilter] = useState("ALL");
  const [tab, setTab] = useState<"evenements" | "inscriptions">("evenements");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [noteModal, setNoteModal] = useState<Inscription | null>(null);
  const [noteText, setNoteText] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const [evRes, insRes] = await Promise.all([
        fetch("/api/evenements?all=true"),
        fetch("/api/rdv/inscriptions"),
      ]);
      const evData = await evRes.json();
      const insData = await insRes.json();
      setEvenements(evData.data?.evenements ?? []);
      setInscriptions(insData.data?.inscriptions ?? []);
    } catch {}
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function changeStatus(id: string, status: string) {
    await fetch(`/api/rdv/inscriptions/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setInscriptions(prev => prev.map(i => i.id === id ? { ...i, status } : i));
  }

  async function deleteInscription(id: string) {
    if (!confirm("Supprimer cette inscription ?")) return;
    await fetch(`/api/rdv/inscriptions/${id}`, { method: "DELETE" });
    setInscriptions(prev => prev.filter(i => i.id !== id));
  }

  async function saveNote() {
    if (!noteModal) return;
    setSavingNote(true);
    await fetch(`/api/rdv/inscriptions/${noteModal.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminNotes: noteText }),
    });
    setInscriptions(prev => prev.map(i => i.id === noteModal.id ? { ...i, adminNotes: noteText } : i));
    setSavingNote(false); setNoteModal(null);
  }

  function saveEvenement() {
    const slug = editId
      ? evenements.find(e => e.id === editId)?.id ?? ""
      : form.titre.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const payload = {
      slug,
      titre: form.titre, categorie: form.categorie, date: form.date, heure: form.heure,
      lieu: form.lieu, ville: form.ville, prix: form.prix, capacite: form.capacite,
      organisateur: form.organisateur, description: form.description,
      image: form.image || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&q=80",
      badge: form.badge, badgeColor: form.badgeColor,
    };

    setSaving(true);
    const url = editId ? `/api/evenements/${slug}` : "/api/evenements";
    const method = editId ? "PATCH" : "POST";

    fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      .then(r => r.json())
      .then(d => {
        const saved = d.data?.evenement;
        if (saved) {
          if (editId) setEvenements(prev => prev.map(e => e.id === editId ? saved : e));
          else setEvenements(prev => [...prev, saved]);
        }
        setShowModal(false); setForm(emptyForm); setEditId(null);
      })
      .catch(() => alert("Erreur lors de la sauvegarde"))
      .finally(() => setSaving(false));
  }

  async function toggleActive(ev: Evenement) {
    await fetch(`/api/evenements/${ev.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !ev.isActive }),
    });
    setEvenements(prev => prev.map(e => e.id === ev.id ? { ...e, isActive: !e.isActive } : e));
  }

  async function deleteEvenement(ev: Evenement) {
    if (!confirm("Supprimer cet evenement ?")) return;
    await fetch(`/api/evenements/${ev.id}`, { method: "DELETE" });
    setEvenements(prev => prev.filter(e => e.id !== ev.id));
  }

  function openEdit(ev: Evenement) {
    setForm({ titre: ev.titre, categorie: ev.categorie, date: ev.date, heure: ev.heure, lieu: ev.lieu, ville: ev.ville, prix: ev.prix, capacite: ev.capacite, organisateur: ev.organisateur, description: ev.description, image: ev.image, badge: ev.badge, badgeColor: ev.badgeColor });
    setEditId(ev.id); setShowModal(true);
  }

  const uniqueEvents = Array.from(new Set(inscriptions.map(i => i.evenementSlug)));
  const filteredInscriptions = inscriptions
    .filter(i => filter === "ALL" || i.status === filter)
    .filter(i => eventFilter === "ALL" || i.evenementSlug === eventFilter);

  const totalParticipants = inscriptions.filter(i => i.status !== "REFUSED" && i.status !== "CANCELLED").reduce((s, i) => s + i.participants, 0);


  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <CalendarDays size={20} className="text-purple-600" />
            </div>
            <h1 className="text-2xl font-black text-[#0c4a6e]">Le RDV Des Evenements A Venir</h1>
          </div>
          <div className="flex gap-2 flex-wrap">
            {tab === "evenements" && (
              <button onClick={() => { setShowModal(true); setEditId(null); setForm(emptyForm); }}
                className="flex items-center gap-2 bg-[#c9a84c] hover:bg-[#b8973b] text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors shadow-md">
                <Plus size={15} /> Ajouter un evenement
              </button>
            )}
            <button onClick={() => setTab("evenements")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "evenements" ? "bg-[#0c4a6e] text-white" : "bg-white text-gray-500 border border-gray-200"}`}>
              Evenements ({evenements.length})
            </button>
            <button onClick={() => setTab("inscriptions")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "inscriptions" ? "bg-[#0c4a6e] text-white" : "bg-white text-gray-500 border border-gray-200"}`}>
              Inscriptions ({inscriptions.length})
            </button>
          </div>
        </div>

        {/* ── ONGLET EVENEMENTS ── */}
        {tab === "evenements" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {evenements.map(ev => (
              <div key={ev.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <div className="relative h-40 bg-gray-100">
                  <img src={ev.image} alt={ev.titre} className="w-full h-full object-cover" />
                  <span className={`absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full font-bold ${ev.isActive ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                    {ev.isActive ? "ACTIF" : "INACTIF"}
                  </span>
                  <span className={`absolute top-3 right-3 ${ev.badgeColor} text-white text-xs font-bold px-2 py-1 rounded-full`}>
                    {ev.categorie}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-[#0c4a6e] mb-1 line-clamp-2">{ev.titre}</h3>
                  <div className="space-y-1 mb-3">
                    <p className="text-xs text-[#c9a84c] font-semibold flex items-center gap-1"><Calendar size={11} /> {ev.date}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1"><MapPin size={11} /> {ev.lieu}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1"><Ticket size={11} /> {ev.prix}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1"><Users size={11} /> {ev.capacite}</p>
                  </div>
                  <p className="text-xs text-gray-400 mb-3 line-clamp-2">{ev.description}</p>
                  <div className="flex gap-2">
                    <button onClick={() => toggleActive(ev)}
                      className={`flex-1 flex items-center justify-center gap-1 text-xs font-bold py-2 rounded-lg transition-colors ${ev.isActive ? "bg-orange-100 text-orange-600 hover:bg-orange-200" : "bg-green-100 text-green-600 hover:bg-green-200"}`}>
                      <CheckCircle size={13} /> {ev.isActive ? "Desactiver" : "Activer"}
                    </button>
                    <button onClick={() => openEdit(ev)}
                      className="flex-1 flex items-center justify-center gap-1 text-xs font-bold py-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors">
                      <Pencil size={13} /> Modifier
                    </button>
                    <button onClick={() => deleteEvenement(ev)}
                      className="flex-1 flex items-center justify-center gap-1 text-xs font-bold py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors">
                      <Trash2 size={13} /> Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}


        {/* ── ONGLET INSCRIPTIONS ── */}
        {tab === "inscriptions" && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Total inscriptions", value: inscriptions.length, color: "text-blue-500", bg: "bg-blue-50", filterVal: "ALL" },
                { label: "En attente", value: inscriptions.filter(i => i.status === "PENDING").length, color: "text-yellow-500", bg: "bg-yellow-50", filterVal: "PENDING" },
                { label: "Confirmes", value: inscriptions.filter(i => i.status === "CONFIRMED").length, color: "text-green-500", bg: "bg-green-50", filterVal: "CONFIRMED" },
                { label: "Participants attendus", value: totalParticipants, color: "text-[#c9a84c]", bg: "bg-amber-50", filterVal: null },
              ].map(s => {
                const isActive = s.filterVal && filter === s.filterVal;
                return (
                  <button key={s.label} onClick={() => s.filterVal && setFilter(s.filterVal)}
                    className={"bg-white rounded-2xl p-5 shadow-sm border flex items-center justify-between w-full text-left transition-all " +
                      (isActive ? "border-[#c9a84c] ring-2 ring-[#c9a84c]/30 shadow-md" : "border-gray-100 hover:border-[#c9a84c]/40 hover:shadow-md") +
                      (s.filterVal ? " cursor-pointer" : " cursor-default")}>
                    <div>
                      <p className={"text-xs mb-1 " + (isActive ? "text-[#c9a84c] font-semibold" : "text-gray-400")}>{s.label}</p>
                      <p className="text-3xl font-black text-[#0c4a6e]">{s.value}</p>
                    </div>
                    <div className={`w-12 h-12 ${s.bg} rounded-xl flex items-center justify-center`}>
                      <Users size={22} className={s.color} />
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <select value={filter} onChange={e => setFilter(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8] bg-white">
                <option value="ALL">Tous les statuts</option>
                <option value="PENDING">En attente</option>
                <option value="CONFIRMED">Confirmes</option>
                <option value="COMPLETED">Termines</option>
                <option value="REFUSED">Refuses</option>
              </select>
              <select value={eventFilter} onChange={e => setEventFilter(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8] bg-white">
                <option value="ALL">Tous les evenements</option>
                {uniqueEvents.map(slug => {
                  const ev = inscriptions.find(i => i.evenementSlug === slug);
                  return <option key={slug} value={slug}>{ev?.evenementTitre ?? slug}</option>;
                })}
              </select>
              <button onClick={load} className="flex items-center gap-2 bg-[#c9a84c] hover:bg-[#b8973b] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Actualiser
              </button>
              <div className="ml-auto">
                <ExportButton
                  data={filteredInscriptions.map(i => ({
                    reference: i.reference, client: i.clientName, telephone: i.clientPhone,
                    email: i.clientEmail ?? "-", evenement: i.evenementTitre,
                    date_evenement: i.evenementDate, lieu: i.evenementLieu,
                    participants: i.participants, message: i.message ?? "-",
                    statut: STATUS_LABELS[i.status] ?? i.status,
                    date_inscription: new Date(i.createdAt).toLocaleString("fr-FR"),
                  }))}
                  columns={[
                    { key: "reference", label: "Reference" }, { key: "client", label: "Client" },
                    { key: "telephone", label: "Telephone" }, { key: "email", label: "Email" },
                    { key: "evenement", label: "Evenement" }, { key: "date_evenement", label: "Date evenement" },
                    { key: "lieu", label: "Lieu" }, { key: "participants", label: "Participants" },
                    { key: "statut", label: "Statut" }, { key: "date_inscription", label: "Date inscription" },
                  ]}
                  filename={"rdv-inscriptions-" + new Date().toISOString().split("T")[0]}
                  label="Inscriptions"
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <div className="w-1 h-5 bg-[#c9a84c] rounded-full" />
                <h2 className="font-bold text-[#0c4a6e]">Inscriptions aux evenements</h2>
                <span className="ml-auto text-xs text-gray-400">{filteredInscriptions.length} inscription(s)</span>
              </div>
              {loading ? (
                <div className="py-16 text-center text-gray-400">
                  <RefreshCw size={32} className="animate-spin mx-auto mb-3" /> Chargement...
                </div>
              ) : filteredInscriptions.length === 0 ? (
                <div className="py-16 text-center text-gray-400">
                  <CalendarDays size={40} className="mx-auto mb-3 opacity-30" />
                  Aucune inscription pour le moment.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        {["Ref", "Client", "WhatsApp", "Evenement", "Date / Lieu", "Participants", "Inscription le", "Statut", "Actions"].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredInscriptions.map(i => {
                        const evImg = evenements.find(e => e.id === i.evenementSlug)?.image
                          ?? "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=60&q=80";
                        return (
                          <tr key={i.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-3 py-3">
                              <div className="flex items-center gap-2">
                                <img src={evImg} alt={i.evenementTitre} className="w-9 h-9 rounded-lg object-cover shrink-0 border border-gray-100" />
                                <span className="font-mono text-xs text-gray-400">{i.reference?.slice(-8)}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <p className="font-semibold text-[#0c4a6e]">{i.clientName}</p>
                              {i.clientEmail && <p className="text-xs text-gray-400">{i.clientEmail}</p>}
                            </td>
                            <td className="px-4 py-3">
                              <a href={`https://wa.me/${i.clientPhone?.replace(/\s/g, "")}`} target="_blank" rel="noopener noreferrer"
                                className="text-green-600 hover:text-green-700 text-xs font-medium flex items-center gap-1">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 shrink-0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                                {i.clientPhone}
                              </a>
                            </td>
                            <td className="px-4 py-3">
                              <a href="/services/rdv" target="_blank" rel="noopener noreferrer" className="text-[#0c4a6e] font-medium text-xs hover:underline line-clamp-2">
                                {i.evenementTitre} ↗
                              </a>
                              {i.message && <p className="text-xs text-gray-400 mt-0.5 line-clamp-1 italic">"{i.message}"</p>}
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-600">
                              <div className="flex items-center gap-1 mb-0.5"><Calendar size={11} className="text-[#c9a84c]" /> {i.evenementDate}</div>
                              <div className="flex items-center gap-1"><MapPin size={11} className="text-[#c9a84c]" /> {i.evenementLieu}</div>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="inline-flex items-center gap-1 bg-[#0c4a6e]/10 text-[#0c4a6e] text-xs font-bold px-2.5 py-1 rounded-full">
                                <Users size={11} /> {i.participants}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-500">
                              <div>{new Date(i.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}</div>
                              <div className="text-gray-400 flex items-center gap-1 mt-0.5">
                                <Clock size={10} /> {new Date(i.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${STATUS_COLORS[i.status] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}>
                                {STATUS_LABELS[i.status] ?? i.status}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1">
                                <select value="" onChange={e => { if (e.target.value) changeStatus(i.id, e.target.value); }}
                                  className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#38bdf8] bg-white cursor-pointer">
                                  <option value="">Changer statut</option>
                                  <option value="PENDING">En attente</option>
                                  <option value="CONFIRMED">Confirmer</option>
                                  <option value="COMPLETED">Terminer</option>
                                  <option value="REFUSED">Refuser</option>
                                </select>
                                <button onClick={() => { setNoteModal(i); setNoteText(i.adminNotes ?? ""); }}
                                  className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-xs font-bold transition-colors" title="Note">
                                  Note
                                </button>
                                <button onClick={() => deleteInscription(i.id)}
                                  className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>


      {/* Modal Ajouter/Modifier evenement */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
              <h3 className="font-bold text-[#0c4a6e] text-lg">{editId ? "Modifier" : "Ajouter"} un evenement</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
                <input type="text" placeholder="Festival de Musique..." value={form.titre}
                  onChange={e => setForm(f => ({ ...f, titre: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categorie</label>
                  <select value={form.categorie} onChange={e => setForm(f => ({ ...f, categorie: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8] bg-white">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Badge</label>
                  <input type="text" placeholder="A venir" value={form.badge}
                    onChange={e => setForm(f => ({ ...f, badge: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input type="text" placeholder="14 - 16 Mai 2026" value={form.date}
                    onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Horaires</label>
                  <input type="text" placeholder="16h00 - 02h00" value={form.heure}
                    onChange={e => setForm(f => ({ ...f, heure: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lieu *</label>
                  <input type="text" placeholder="Plage de Grand-Bassam" value={form.lieu}
                    onChange={e => setForm(f => ({ ...f, lieu: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                  <input type="text" placeholder="Grand-Bassam" value={form.ville}
                    onChange={e => setForm(f => ({ ...f, ville: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix</label>
                  <input type="text" placeholder="5 000 - 25 000 FCFA" value={form.prix}
                    onChange={e => setForm(f => ({ ...f, prix: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacite</label>
                  <input type="text" placeholder="5 000 personnes" value={form.capacite}
                    onChange={e => setForm(f => ({ ...f, capacite: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organisateur</label>
                <input type="text" placeholder="COTIERE EVENT" value={form.organisateur}
                  onChange={e => setForm(f => ({ ...f, organisateur: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea rows={3} placeholder="Description de l evenement..." value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8] resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Couleur du badge</label>
                <div className="flex gap-2 flex-wrap">
                  {BADGE_COLORS.map(c => (
                    <button key={c} onClick={() => setForm(f => ({ ...f, badgeColor: c }))}
                      className={`w-7 h-7 rounded-full ${c} border-2 transition-all ${form.badgeColor === c ? "border-[#0c4a6e] scale-125" : "border-transparent"}`} />
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                <ImageUploader value={form.image} onChange={val => setForm(f => ({ ...f, image: val }))} />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3 shrink-0">
              <button onClick={() => setShowModal(false)} className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50">Annuler</button>
              <button onClick={saveEvenement} disabled={!form.titre || !form.date || !form.lieu || saving}
                className="flex-1 bg-[#c9a84c] hover:bg-[#b8973b] text-white font-bold py-2.5 rounded-xl disabled:opacity-60">
                {saving ? "Sauvegarde..." : editId ? "Modifier" : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal note admin */}
      {noteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="font-bold text-[#0c4a6e]">Note admin — {noteModal.clientName}</h3>
              <button onClick={() => setNoteModal(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6">
              <textarea rows={4} value={noteText} onChange={e => setNoteText(e.target.value)}
                placeholder="Ajouter une note interne..."
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c] resize-none" />
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button onClick={() => setNoteModal(null)} className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50">Annuler</button>
              <button onClick={saveNote} disabled={savingNote}
                className="flex-1 bg-[#c9a84c] hover:bg-[#b8973b] text-white font-bold py-2.5 rounded-xl disabled:opacity-60">
                {savingNote ? "Sauvegarde..." : "Sauvegarder"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



