
"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Car,
  UtensilsCrossed,
  Waves,
  Check,
  Loader2,
  X,
  Image as ImageIcon,
  Shield,
  Zap,
  Coffee,
  Building,
  Hotel,
  House,
  Building2,
  LayoutGrid,
  MapPin,
} from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const SERVICES_LIST = [
  { id: "restaurant", label: "Restaurant", icon: UtensilsCrossed },
  { id: "bar", label: "Bar", icon: Coffee },
  { id: "piscine", label: "Piscine", icon: Waves },
  { id: "salle_conference", label: "Salle de conférence", icon: Building },
  { id: "salle_fete", label: "Salle de fête", icon: Building },
  { id: "parking", label: "Parking", icon: Car },
  { id: "blanchisserie", label: "Service de blanchisserie", icon: Check },
  { id: "navette", label: "Navette", icon: Car },
  { id: "petit_dejeuner", label: "Petit déjeuner", icon: Coffee },
  { id: "service_chambre", label: "Service en chambre", icon: Check },
  { id: "securite", label: "Sécurité 24h/24", icon: Shield },
  { id: "groupe_electrogene", label: "Groupe électrogène", icon: Zap },
];

const ROOM_TYPES = [
  { id: "standard", label: "Standard" },
  { id: "vip", label: "VIP" },
  { id: "suite", label: "Suite" },
  { id: "familiale", label: "Familiale" },
];

type HotelData = {
  id: string;
  type: "hotel" | "residence" | "villa";
  nom: string;
  adresse: string;
  quartier: string;
  ville: string;
  telephone: string;
  whatsapp: string;
  email: string;
  site_internet: string;
  localisation_maps: string;
  nb_chambres: number | string;
  type_chambre: string[];
  prix_nuit: number | string;
  clim: boolean;
  wifi: boolean;
  television: boolean;
  eau_chaude: boolean;
  refrigirateur: boolean;
  services: string[];
  images: string[];
  image: string;
};

const emptyForm: HotelData = {
  id: "",
  type: "hotel",
  nom: "",
  adresse: "",
  quartier: "",
  ville: "",
  telephone: "",
  whatsapp: "",
  email: "",
  site_internet: "",
  localisation_maps: "",
  nb_chambres: "",
  type_chambre: [],
  prix_nuit: "",
  clim: false,
  wifi: false,
  television: false,
  eau_chaude: false,
  refrigirateur: false,
  services: [],
  images: ["", "", "", ""],
  image: "",
};

function UploadBox({
  value,
  onChange,
  index,
}: {
  value: string;
  onChange: (url: string) => void;
  index: number;
}) {
  const [loading, setLoading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    try {
      const ext = file.name.split(".").pop();
      const fileName = `hotel_${Date.now()}_${index}_${Math.random()
        .toString(36)
        .slice(2)}.${ext}`;

      const { error } = await supabase.storage
        .from("categories")
        .upload(fileName, file);

      if (error) throw error;

      const { data } = supabase.storage
        .from("categories")
        .getPublicUrl(fileName);

      onChange(data.publicUrl);
    } catch (err: unknown) {
      alert(
        "Erreur upload : " +
          (err instanceof Error ? err.message : "Erreur inconnue")
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="group relative flex h-32 flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition-all hover:border-[#0c4a6e]/50">
      {value ? (
        <>
          <img
            src={value}
            className="h-full w-full object-cover"
            alt={`Photo ${index + 1}`}
          />
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label={`Supprimer la photo ${index + 1}`}
            className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white transition-all hover:bg-rose-500"
          >
            <X size={14} />
          </button>
        </>
      ) : (
        <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 text-slate-400 hover:text-[#0c4a6e]">
          {loading ? (
            <Loader2 size={24} className="animate-spin text-[#c9a84c]" />
          ) : (
            <ImageIcon size={20} />
          )}
          <span className="text-xs font-semibold">Photo {index + 1}</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            disabled={loading}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
}

export default function AdminHotelsPage() {
  const [hotels, setHotels] = useState<HotelData[]>([]);
  const [typeFilter, setTypeFilter] = useState<"all" | HotelData["type"]>("all");
  const [showModal, setShowModal] = useState(false);
  const [loadingHotels, setLoadingHotels] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<HotelData>(emptyForm);

  useEffect(() => {
    let mounted = true;

    async function loadHotels() {
      try {
        const response = await fetch("/api/categories");

        if (!response.ok) {
          throw new Error("Impossible de charger les établissements.");
        }

        const result = await response.json();

        if (mounted) {
          setHotels(Array.isArray(result.data) ? result.data : Array.isArray(result.data?.categories) ? result.data.categories : []);
        }
      } catch (error) {
        if (mounted) {
          setFetchError(
            error instanceof Error ? error.message : "Erreur de chargement."
          );
        }
      } finally {
        if (mounted) setLoadingHotels(false);
      }
    }

    void loadHotels();

    return () => {
      mounted = false;
    };
  }, []);

  function openCreate() {
    setEditId(null);
    setForm({
      ...emptyForm,
      images: ["", "", "", ""],
      services: [],
      type_chambre: [],
      type: typeFilter === "all" ? "hotel" : typeFilter,
    });
    setShowModal(true);
  }

  function openEdit(hotel: HotelData) {
    setEditId(hotel.id);
    setForm({
      ...emptyForm,
      ...hotel,
      type: hotel.type || "hotel",
      services: hotel.services || [],
      type_chambre: hotel.type_chambre || [],
      images: hotel.images?.length
        ? [...hotel.images, "", "", ""].slice(0, 4)
        : [hotel.image || "", "", "", ""],
    });
    setShowModal(true);
  }

  function toggleService(id: string) {
    setForm((prev) => ({
      ...prev,
      services: prev.services.includes(id)
        ? prev.services.filter((s) => s !== id)
        : [...prev.services, id],
    }));
  }

  function toggleRoomType(id: string) {
    setForm((prev) => ({
      ...prev,
      type_chambre: prev.type_chambre.includes(id)
        ? prev.type_chambre.filter((t) => t !== id)
        : [...prev.type_chambre, id],
    }));
  }

  async function save() {
    if (!form.nom.trim() || !form.ville.trim()) {
      alert("Le nom de l’établissement et la ville sont requis.");
      return;
    }

    if (!form.images[0]) {
      alert("Au moins la première photo est requise.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        ...form,
        image: form.images[0],
        title: form.nom,
        type: form.type,
      };

      const response = await fetch(
        editId ? `/api/categories/${editId}` : "/api/categories",
        {
          method: editId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la sauvegarde.");
      }

      const { data } = await response.json();

      setHotels((previous) =>
        editId
          ? previous.map((hotel) => (hotel.id === editId ? data : hotel))
          : [...previous, data]
      );

      setShowModal(false);
      setEditId(null);
      setForm(emptyForm);
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Erreur de sauvegarde."
      );
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet établissement ?")) {
      return;
    }

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Impossible de supprimer cet établissement.");
      }

      setHotels((previous) => previous.filter((hotel) => hotel.id !== id));
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Erreur de suppression."
      );
    }
  }

  const filteredHotels = hotels.filter((hotel) => typeFilter === "all" || (hotel.type || "hotel") === typeFilter);
  const counts = { hotel: hotels.filter((h) => !h.type || h.type === "hotel").length, residence: hotels.filter((h) => h.type === "residence").length, villa: hotels.filter((h) => h.type === "villa").length };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <AdminNavbar />

      {/* CONTENU PRINCIPAL : DECALAGE DE 288 PX */}
      <main className="min-w-0 lg:ml-72">
        <div className="mx-auto w-full min-w-0 max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {/* EN-TETE */}
          <div className="mb-7 flex flex-col gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#b2923e]">
                Administration / Hébergements
              </p>

              <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-[#0c4a6e] sm:text-3xl">
                Tous les hébergements
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-slate-500">
                Gérez les établissements hôteliers, leurs équipements, leurs
                tarifs et leurs photos.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreate}
              className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-[#0c4a6e] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#083a57] sm:w-auto"
            >
              <Plus size={18} strokeWidth={2.5} />
              Nouvel établissement
            </button>
          </div>

          {/* FILTRES PAR TYPE D’HEBERGEMENT */}
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {([
              { id: "all", label: "Tous", count: hotels.length, icon: LayoutGrid },
              { id: "hotel", label: "Hôtels", count: counts.hotel, icon: Hotel },
              { id: "residence", label: "Résidences", count: counts.residence, icon: Building2 },
              { id: "villa", label: "Villas", count: counts.villa, icon: House },
            ] as const).map((item) => {
              const Icon = item.icon;
              return (
                <button key={item.id} type="button" onClick={() => setTypeFilter(item.id)}
                  className={`flex min-w-0 items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${typeFilter === item.id ? "border-[#c9a84c] bg-[#0c4a6e] text-white" : "border-slate-200 bg-white text-[#0c4a6e] hover:border-[#c9a84c]"}`}>
                  <Icon size={19} className="shrink-0" />
                  <span className="min-w-0 flex-1 truncate text-sm font-semibold">{item.label}</span>
                  <span className="text-sm font-bold">{item.count}</span>
                </button>
              );
            })}
          </div>

          {/* TITRE DE LA LISTE */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0c4a6e]/10 text-[#0c4a6e]">
                <Hotel size={18} />
              </span>

              <div>
                <p className="text-sm font-bold text-slate-800">
                  Établissements
                </p>
                <p className="text-xs text-slate-500">
                  {loadingHotels
                    ? "Chargement…"
                    : `${filteredHotels.length} établissement${
                        filteredHotels.length > 1 ? "s" : ""
                      }`}
                </p>
              </div>
            </div>
          </div>

          {/* CHARGEMENT */}
          {loadingHotels ? (
            <div className="flex min-h-64 items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white text-sm text-slate-500">
              <Loader2
                size={20}
                className="animate-spin text-[#c9a84c]"
              />
              Chargement des établissements…
            </div>
          ) : fetchError ? (
            <div
              role="alert"
              className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-6 text-sm text-rose-700"
            >
              {fetchError}
            </div>
          ) : filteredHotels.length === 0 ? (
            /* ETAT VIDE */
            <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm">
              <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0c4a6e]/10 text-[#0c4a6e]">
                <Hotel size={30} />
              </span>

              <h2 className="text-lg font-bold text-[#0c4a6e]">
                Aucun établissement pour le moment
              </h2>

              <p className="mt-2 max-w-md text-sm text-slate-500">
                Ajoutez votre premier hôtel ou résidence pour commencer à
                gérer ses chambres, services et photos.
              </p>

              <button
                type="button"
                onClick={openCreate}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#c9a84c] px-5 py-3 text-sm font-bold text-[#0c4a6e] hover:bg-[#e8c97a]"
              >
                <Plus size={18} />
                Ajouter un établissement
              </button>
            </div>
          ) : (
            /* GRILLE DES ETABLISSEMENTS */
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {filteredHotels.map((hotel) => (
                <article
                  key={hotel.id}
                  className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-lg"
                >
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    {hotel.images?.[0] || hotel.image ? (
                      <img
                        src={hotel.images?.[0] || hotel.image}
                        alt={hotel.nom || "Établissement"}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-300">
                        <Hotel size={44} />
                      </div>
                    )}

                    <div className="absolute right-3 top-3 flex gap-2">
                      <button
                        type="button"
                        aria-label={`Modifier ${hotel.nom}`}
                        title="Modifier"
                        onClick={() => openEdit(hotel)}
                        className="rounded-full bg-white/95 p-2.5 text-[#0c4a6e] shadow-sm transition-colors hover:bg-[#e8c97a]"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        aria-label={`Supprimer ${hotel.nom}`}
                        title="Supprimer"
                        onClick={() => remove(hotel.id)}
                        className="rounded-full bg-white/95 p-2.5 text-rose-600 shadow-sm transition-colors hover:bg-rose-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <span className="absolute left-3 top-3 rounded-lg bg-[#0c4a6e]/90 px-3 py-1 text-xs font-bold text-white">
                      {hotel.type === "villa" ? "Villa" : hotel.type === "residence" ? "Résidence" : "Hôtel"}
                    </span>
                    {hotel.ville && (
                      <span className="absolute bottom-3 left-3 rounded-lg bg-white/95 px-3 py-1 text-xs font-bold text-[#0c4a6e] shadow-sm">
                        {hotel.ville}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <h3
                      className="truncate text-base font-bold text-slate-800"
                      title={hotel.nom}
                    >
                      {hotel.nom}
                    </h3>

                    <p className="flex min-w-0 items-center gap-1.5 truncate text-xs text-slate-500">
                      <MapPin
                        size={14}
                        className="shrink-0 text-[#c9a84c]"
                      />
                      {hotel.quartier ||
                        hotel.adresse ||
                        hotel.ville ||
                        "Adresse non renseignée"}
                    </p>

                    <div className="mt-auto border-t border-slate-100 pt-3">
                      <p className="text-sm font-extrabold text-[#0c4a6e]">
                        {hotel.prix_nuit
                          ? `${Number(hotel.prix_nuit).toLocaleString(
                              "fr-FR"
                            )} FCFA / nuit`
                          : "Tarif non renseigné"}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* MODAL CREATION / MODIFICATION */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm sm:p-6">
          <div
            role="dialog"
            aria-modal="true"
            aria-label={
              editId ? "Modifier l'établissement" : "Nouvel établissement"
            }
            className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-2xl"
          >
            {/* ENTETE MODAL */}
            <div className="flex shrink-0 items-center justify-between rounded-t-2xl border-b border-slate-100 bg-white px-6 py-4">
              <h2 className="text-xl font-black text-[#0c4a6e]">
                {editId
                  ? "Modifier l'établissement"
                  : "Nouvel établissement"}
              </h2>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                aria-label="Fermer"
                className="rounded-full p-2 text-slate-400 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* CONTENU SCROLLABLE */}
            <div className="min-h-0 flex-1 space-y-8 overflow-y-auto px-6 py-6">
              {/* 1. PRESENTATION */}
              <section className="space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-800">
                  <span className="h-px w-6 bg-slate-200" />
                  1. Présentation
                </h3>

                <div>
                  <label className="ml-1 text-xs font-semibold text-slate-500">
                    Nom de l’établissement *
                  </label>
                  <input
                    value={form.nom}
                    onChange={(e) =>
                      setForm({ ...form, nom: e.target.value })
                    }
                    placeholder="Ex : Résidence Akwaba"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c4a6e]/20"
                  />
                </div>
              </section>

              {/* TYPE D’ETABLISSEMENT */}
              <section className="space-y-3">
                <label className="block text-xs font-semibold text-slate-500">Type d’hébergement *</label>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { id: "hotel", label: "Hôtel", icon: Hotel },
                    { id: "residence", label: "Résidence", icon: Building2 },
                    { id: "villa", label: "Villa", icon: House },
                  ] as const).map((item) => {
                    const Icon = item.icon;
                    return (
                      <button key={item.id} type="button" onClick={() => setForm((f) => ({ ...f, type: item.id }))}
                        className={`flex flex-col items-center justify-center gap-2 rounded-xl border px-2 py-4 text-xs font-bold sm:flex-row ${form.type === item.id ? "border-[#0c4a6e] bg-[#0c4a6e] text-white" : "border-slate-200 bg-slate-50 text-slate-600"}`}>
                        <Icon size={18} />{item.label}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* 2. COORDONNEES */}
              <section className="space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-800">
                  <span className="h-px w-6 bg-slate-200" />
                  2. Coordonnées
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="ml-1 text-xs font-semibold text-slate-500">
                      Adresse complète
                    </label>
                    <input
                      value={form.adresse}
                      onChange={(e) =>
                        setForm({ ...form, adresse: e.target.value })
                      }
                      placeholder="Ex : Rue du commerce"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm"
                    />
                  </div>

                  <div>
                    <label className="ml-1 text-xs font-semibold text-slate-500">
                      Quartier ou village
                    </label>
                    <input
                      value={form.quartier}
                      onChange={(e) =>
                        setForm({ ...form, quartier: e.target.value })
                      }
                      placeholder="Ex : Marcory Zone 4"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm"
                    />
                  </div>

                  <div>
                    <label className="ml-1 text-xs font-semibold text-slate-500">
                      Ville *
                    </label>
                    <input
                      value={form.ville}
                      onChange={(e) =>
                        setForm({ ...form, ville: e.target.value })
                      }
                      placeholder="Ex : Abidjan"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm"
                    />
                  </div>

                  <div>
                    <label className="ml-1 text-xs font-semibold text-slate-500">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={form.telephone}
                      onChange={(e) =>
                        setForm({ ...form, telephone: e.target.value })
                      }
                      placeholder="+225 0700000000"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm"
                    />
                  </div>

                  <div>
                    <label className="ml-1 text-xs font-semibold text-slate-500">
                      WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={form.whatsapp}
                      onChange={(e) =>
                        setForm({ ...form, whatsapp: e.target.value })
                      }
                      placeholder="+225 0700000000"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm"
                    />
                  </div>

                  <div>
                    <label className="ml-1 text-xs font-semibold text-slate-500">
                      Email
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      placeholder="contact@hotel.com"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="ml-1 text-xs font-semibold text-slate-500">
                      Site internet
                    </label>
                    <input
                      type="url"
                      value={form.site_internet}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          site_internet: e.target.value,
                        })
                      }
                      placeholder="https://www.hotel.com"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm"
                    />
                  </div>
                </div>
              </section>

              {/* 3. LOCALISATION */}
              <section className="space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-800">
                  <span className="h-px w-6 bg-slate-200" />
                  3. Localisation
                </h3>

                <div>
                  <label className="ml-1 text-xs font-semibold text-slate-500">
                    Lien Google Maps / Itinéraire
                  </label>
                  <input
                    type="url"
                    value={form.localisation_maps}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        localisation_maps: e.target.value,
                      })
                    }
                    placeholder="https://maps.google.com/..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm"
                  />
                </div>
              </section>

              {/* 4. HEBERGEMENT */}
              <section className="space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-800">
                  <span className="h-px w-6 bg-slate-200" />
                  4. Hébergement
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="ml-1 text-xs font-semibold text-slate-500">
                      Nombre de chambres
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={form.nb_chambres}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          nb_chambres: e.target.value,
                        })
                      }
                      placeholder="Ex : 25"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm"
                    />
                  </div>

                  <div>
                    <label className="ml-1 text-xs font-semibold text-slate-500">
                      Prix par nuit (FCFA)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={form.prix_nuit}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          prix_nuit: e.target.value,
                        })
                      }
                      placeholder="Ex : 35000"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 ml-1 block text-xs font-semibold text-slate-500">
                    Types de chambres
                  </label>

                  <div className="flex flex-wrap gap-2">
                    {ROOM_TYPES.map((room) => {
                      const active = form.type_chambre.includes(room.id);

                      return (
                        <button
                          key={room.id}
                          type="button"
                          onClick={() => toggleRoomType(room.id)}
                          className={
                            active
                              ? "rounded-xl border border-[#0c4a6e] bg-[#0c4a6e] px-4 py-2 text-xs font-bold text-white"
                              : "rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600"
                          }
                        >
                          {room.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-3">
                  {(
                    [
                      { id: "clim", label: "Climatisation" },
                      { id: "wifi", label: "WiFi" },
                      { id: "television", label: "Télévision" },
                      { id: "eau_chaude", label: "Eau chaude" },
                      { id: "refrigirateur", label: "Réfrigérateur" },
                    ] as const
                  ).map((item) => (
                    <label
                      key={item.id}
                      className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 p-3"
                    >
                      <input
                        type="checkbox"
                        checked={form[item.id]}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            [item.id]: e.target.checked,
                          })
                        }
                        className="rounded text-[#0c4a6e]"
                      />
                      <span className="text-xs font-semibold text-slate-700">
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>
              </section>

              {/* 5. SERVICES */}
              <section className="space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-800">
                  <span className="h-px w-6 bg-slate-200" />
                  5. Services &amp; Équipements
                </h3>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {SERVICES_LIST.map((service) => {
                    const Icon = service.icon;
                    const active = form.services.includes(service.id);

                    return (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => toggleService(service.id)}
                        className={
                          active
                            ? "flex items-center gap-2 rounded-xl border border-[#0c4a6e] bg-[#0c4a6e]/10 p-3 text-left text-xs font-semibold text-[#0c4a6e]"
                            : "flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-3 text-left text-xs font-semibold text-slate-600"
                        }
                      >
                        <Icon size={16} className="shrink-0" />
                        <span>{service.label}</span>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* 6. PHOTOS */}
              <section className="space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-800">
                  <span className="h-px w-6 bg-slate-200" />
                  6. Photos de l'établissement
                </h3>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {form.images.map((img, index) => (
                    <UploadBox
                      key={index}
                      index={index}
                      value={img}
                      onChange={(url) => {
                        setForm((previous) => {
                          const images = [...previous.images];
                          images[index] = url;

                          return {
                            ...previous,
                            images,
                          };
                        });
                      }}
                    />
                  ))}
                </div>
              </section>
            </div>

            {/* PIED MODAL */}
            <div className="flex shrink-0 justify-end gap-3 rounded-b-2xl border-t border-slate-100 bg-slate-50 px-6 py-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                disabled={saving}
                className="rounded-xl px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200/50"
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={save}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-[#c9a84c] px-8 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#b89943] disabled:opacity-60"
              >
                {saving && <Loader2 size={16} className="animate-spin" />}
                {editId ? "Mettre à jour" : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
