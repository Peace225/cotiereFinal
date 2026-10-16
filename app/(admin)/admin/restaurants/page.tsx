
"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  UtensilsCrossed,
  Coffee,
  Building,
  Car,
  Check,
  Loader2,
  X,
  Image as ImageIcon,
  CreditCard,
  Banknote,
  Smartphone,
  ArrowLeftRight,
  MapPin,
  Search,
} from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const SERVICES_LIST = [
  { id: "terrasse", label: "Terrasse", icon: UtensilsCrossed },
  { id: "climatisation", label: "Climatisation", icon: Check },
  { id: "wifi", label: "WiFi gratuit", icon: Check },
  { id: "parking", label: "Parking sécurisé", icon: Car },
  { id: "musique_live", label: "Musique live", icon: Check },
  { id: "livraison", label: "Livraison", icon: Check },
  { id: "bar", label: "Bar / Lounge", icon: Coffee },
  { id: "reservation_table", label: "Réservation de table", icon: Check },
  { id: "salle_privee", label: "Salle privée / VIP", icon: Building },
];

const PAYMENT_LIST = [
  { id: "paiement_especes", label: "Espèces", icon: Banknote },
  { id: "paiement_mobile_money", label: "Mobile Money", icon: Smartphone },
  { id: "paiement_carte", label: "Carte bancaire", icon: CreditCard },
  { id: "paiement_virement", label: "Virement", icon: ArrowLeftRight },
];

const CUISINE_TYPES = [
  { id: "locale", label: "Cuisine locale ivoirienne" },
  { id: "africaine", label: "Cuisine africaine variée" },
  { id: "europeenne", label: "Cuisine européenne" },
  { id: "gastronomique", label: "Gastronomie" },
  { id: "fast_food", label: "Fast-food / Grillades" },
  { id: "bar_lounge", label: "Bar & Tapas" },
];

type RestaurantData = {
  id: string;
  nom: string;
  adresse: string;
  quartier: string;
  ville: string;
  telephone: string;
  whatsapp: string;
  email: string;
  site_internet: string;
  localisation_maps: string;
  type_cuisine: string[];
  prix_moyen: number | string;
  services: string[];
  images: string[];
  image: string;
};

const emptyForm: RestaurantData = {
  id: "",
  nom: "",
  adresse: "",
  quartier: "",
  ville: "",
  telephone: "",
  whatsapp: "",
  email: "",
  site_internet: "",
  localisation_maps: "",
  type_cuisine: [],
  prix_moyen: "",
  services: [],
  images: ["", "", "", ""],
  image: "",
};

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition focus:border-[#0c4a6e] focus:ring-2 focus:ring-[#0c4a6e]/10";

const labelClass = "block text-xs font-semibold text-slate-600";

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

  async function handleFile(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);

    try {
      const ext = file.name.split(".").pop();
      const fileName = `restaurant_${Date.now()}_${index}_${Math.random()
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
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Erreur lors du téléchargement."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="group relative flex h-32 items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50 transition hover:border-[#c9a84c]">
      {value ? (
        <>
          <img
            src={value}
            alt={`Photo ${index + 1}`}
            className="h-full w-full object-cover"
          />

          <button
            type="button"
            aria-label={`Supprimer la photo ${index + 1}`}
            onClick={() => onChange("")}
            className="absolute right-2 top-2 rounded-lg bg-white/95 p-1.5 text-rose-600 shadow-sm hover:bg-rose-50"
          >
            <X size={15} />
          </button>
        </>
      ) : (
        <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 text-slate-400 hover:text-[#0c4a6e]">
          {loading ? (
            <Loader2 size={22} className="animate-spin" />
          ) : (
            <ImageIcon size={22} />
          )}

          <span className="text-xs font-medium">
            Photo {index + 1}
          </span>

          <input
            type="file"
            accept="image/*"
            disabled={loading}
            onChange={handleFile}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
}

export default function AdminRestaurantsPage() {
  const [restaurants, setRestaurants] = useState<RestaurantData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<RestaurantData>(emptyForm);

  useEffect(() => {
    let active = true;

    async function loadRestaurants() {
      try {
        const response = await fetch("/api/categories");

        if (!response.ok) {
          throw new Error("Impossible de charger les restaurants.");
        }

        const result = await response.json();
        const all = Array.isArray(result.data) ? result.data : [];

        if (active) {
          setRestaurants(
            all.filter(
              (item: RestaurantData & { type?: string }) =>
                item.type === "restaurant"
            )
          );
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error ? err.message : "Erreur de chargement."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadRestaurants();

    return () => {
      active = false;
    };
  }, []);

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const query = search.trim().toLowerCase();

    return (
      restaurant.nom?.toLowerCase().includes(query) ||
      restaurant.ville?.toLowerCase().includes(query) ||
      restaurant.quartier?.toLowerCase().includes(query)
    );
  });

  function openCreate() {
    setEditId(null);
    setForm({
      ...emptyForm,
      type_cuisine: [],
      services: [],
      images: ["", "", "", ""],
    });
    setShowModal(true);
  }

  function openEdit(restaurant: RestaurantData) {
    setEditId(restaurant.id);

    setForm({
      ...emptyForm,
      ...restaurant,
      type_cuisine: restaurant.type_cuisine || [],
      services: restaurant.services || [],
      images: restaurant.images?.length
        ? [...restaurant.images, "", "", ""].slice(0, 4)
        : [restaurant.image || "", "", "", ""],
    });

    setShowModal(true);
  }

  function toggleService(id: string) {
    setForm((previous) => ({
      ...previous,
      services: previous.services.includes(id)
        ? previous.services.filter((service) => service !== id)
        : [...previous.services, id],
    }));
  }

  function toggleCuisine(id: string) {
    setForm((previous) => ({
      ...previous,
      type_cuisine: previous.type_cuisine.includes(id)
        ? previous.type_cuisine.filter((cuisine) => cuisine !== id)
        : [...previous.type_cuisine, id],
    }));
  }

  async function save() {
    if (!form.nom.trim() || !form.ville.trim()) {
      alert("Le nom du restaurant et la ville sont requis.");
      return;
    }

    if (!form.images[0]) {
      alert("La première photo est obligatoire.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        ...form,
        image: form.images[0],
        title: form.nom,
        type: "restaurant",
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
        throw new Error("Erreur lors de l'enregistrement.");
      }

      const result = await response.json();
      const data = result.data;

      if (!data) {
        throw new Error("Réponse API incomplète.");
      }

      setRestaurants((previous) =>
        editId
          ? previous.map((restaurant) =>
              restaurant.id === editId ? data : restaurant
            )
          : [...previous, data]
      );

      setShowModal(false);
      setEditId(null);
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "Erreur d'enregistrement."
      );
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Supprimer définitivement ce restaurant ?")) {
      return;
    }

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("La suppression a échoué.");
      }

      setRestaurants((previous) =>
        previous.filter((restaurant) => restaurant.id !== id)
      );
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "Erreur de suppression."
      );
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <AdminNavbar />

      {/* CONTENU PRINCIPAL DECALE DE 288 PX */}
      <main className="min-w-0 lg:ml-72">
        <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {/* EN-TETE */}
          <header className="mb-8 flex flex-col gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#b2923e]">
                Administration / Restauration
              </p>

              <h1 className="text-2xl font-extrabold tracking-tight text-[#0c4a6e] sm:text-3xl">
                Restaurants &amp; Gastronomie
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Gérez vos restaurants, bars et espaces gourmands.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreate}
              className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-[#0c4a6e] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#083a57] sm:w-auto"
            >
              <Plus size={18} />
              Nouveau restaurant
            </button>
          </header>

          {/* BARRE DE RECHERCHE */}
          <section className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-800">
                Établissements
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                {restaurants.length} restaurant
                {restaurants.length > 1 ? "s" : ""} enregistré
                {restaurants.length > 1 ? "s" : ""}
              </p>
            </div>

            <div className="relative w-full sm:max-w-xs">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Rechercher un restaurant..."
                aria-label="Rechercher un restaurant"
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#0c4a6e]"
              />
            </div>
          </section>

          {/* CHARGEMENT */}
          {loading ? (
            <div className="flex min-h-64 items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white text-sm text-slate-500">
              <Loader2 size={20} className="animate-spin" />
              Chargement des restaurants...
            </div>
          ) : error ? (
            <div
              role="alert"
              className="rounded-xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700"
            >
              {error}
            </div>
          ) : filteredRestaurants.length === 0 ? (
            /* ETAT VIDE */
            <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0c4a6e]/10 text-[#0c4a6e]">
                <UtensilsCrossed size={26} />
              </div>

              <h3 className="text-lg font-bold text-slate-800">
                {search
                  ? "Aucun résultat"
                  : "Aucun restaurant enregistré"}
              </h3>

              <p className="mt-2 max-w-sm text-sm text-slate-500">
                {search
                  ? "Essayez un autre nom, quartier ou ville."
                  : "Ajoutez votre premier restaurant pour commencer à gérer vos établissements."}
              </p>

              {!search && (
                <button
                  type="button"
                  onClick={openCreate}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0c4a6e] px-5 py-3 text-sm font-semibold text-white"
                >
                  <Plus size={17} />
                  Ajouter un restaurant
                </button>
              )}
            </div>
          ) : (
            /* GRILLE RESPONSIVE */
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {filteredRestaurants.map((restaurant) => (
                <article
                  key={restaurant.id}
                  className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    {restaurant.images?.[0] || restaurant.image ? (
                      <img
                        src={
                          restaurant.images?.[0] ||
                          restaurant.image
                        }
                        alt={restaurant.nom}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-300">
                        <UtensilsCrossed size={40} />
                      </div>
                    )}

                    <div className="absolute right-3 top-3 flex gap-2">
                      <button
                        type="button"
                        title="Modifier"
                        aria-label={`Modifier ${restaurant.nom}`}
                        onClick={() => openEdit(restaurant)}
                        className="rounded-lg bg-white/95 p-2 text-[#0c4a6e] shadow-sm hover:bg-[#e8c97a]"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        title="Supprimer"
                        aria-label={`Supprimer ${restaurant.nom}`}
                        onClick={() => remove(restaurant.id)}
                        className="rounded-lg bg-white/95 p-2 text-rose-600 shadow-sm hover:bg-rose-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {restaurant.ville && (
                      <span className="absolute bottom-3 left-3 rounded-lg bg-white/95 px-3 py-1 text-xs font-semibold text-[#0c4a6e]">
                        {restaurant.ville}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="truncate text-base font-bold text-slate-800">
                      {restaurant.nom}
                    </h3>

                    <p className="mt-2 flex items-center gap-1.5 truncate text-xs text-slate-500">
                      <MapPin
                        size={14}
                        className="shrink-0 text-[#c9a84c]"
                      />
                      {restaurant.quartier ||
                        restaurant.adresse ||
                        restaurant.ville ||
                        "Adresse non renseignée"}
                    </p>

                    <div className="mt-4 border-t border-slate-100 pt-3">
                      <p className="text-sm font-bold text-[#0c4a6e]">
                        {restaurant.prix_moyen
                          ? `${Number(
                              restaurant.prix_moyen
                            ).toLocaleString("fr-FR")} FCFA / personne`
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-3 backdrop-blur-sm sm:p-6">
          <div
            role="dialog"
            aria-modal="true"
            aria-label={
              editId ? "Modifier le restaurant" : "Nouveau restaurant"
            }
            className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            {/* EN-TETE MODAL */}
            <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-7">
              <div>
                <h2 className="text-lg font-bold text-[#0c4a6e]">
                  {editId
                    ? "Modifier le restaurant"
                    : "Nouveau restaurant"}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Informations et caractéristiques de l'établissement
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                aria-label="Fermer"
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* FORMULAIRE */}
            <div className="min-h-0 flex-1 space-y-8 overflow-y-auto px-5 py-6 sm:px-7">
              {/* PRESENTATION */}
              <section className="space-y-4">
                <h3 className="border-b border-slate-100 pb-3 text-sm font-bold text-[#0c4a6e]">
                  01 — Présentation
                </h3>

                <div>
                  <label className={labelClass}>
                    Nom du restaurant / bar *
                  </label>

                  <input
                    value={form.nom}
                    onChange={(event) =>
                      setForm({ ...form, nom: event.target.value })
                    }
                    placeholder="Ex : Le Jardin Gourmand"
                    className={inputClass}
                  />
                </div>
              </section>

              {/* COORDONNEES */}
              <section className="space-y-4">
                <h3 className="border-b border-slate-100 pb-3 text-sm font-bold text-[#0c4a6e]">
                  02 — Coordonnées
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {(
                    [
                      ["adresse", "Adresse complète", "Boulevard Lagunaire"],
                      ["quartier", "Quartier ou zone", "Plateau"],
                      ["ville", "Ville *", "Abidjan"],
                      ["telephone", "Téléphone", "+225 0747722931"],
                      ["whatsapp", "WhatsApp", "+225 0747722931"],
                      ["email", "Email", "contact@restaurant.com"],
                      ["site_internet", "Site internet / Menu en ligne", "https://www.restaurant.com"],
                    ] as const
                  ).map(([field, label, placeholder]) => (
                    <div
                      key={field}
                      className={
                        field === "site_internet"
                          ? "sm:col-span-2"
                          : ""
                      }
                    >
                      <label className={labelClass}>{label}</label>

                      <input
                        type={
                          field === "email"
                            ? "email"
                            : field === "site_internet"
                              ? "url"
                              : "text"
                        }
                        value={form[field]}
                        onChange={(event) =>
                          setForm({
                            ...form,
                            [field]: event.target.value,
                          })
                        }
                        placeholder={placeholder}
                        className={inputClass}
                      />
                    </div>
                  ))}
                </div>
              </section>

              {/* LOCALISATION */}
              <section className="space-y-4">
                <h3 className="border-b border-slate-100 pb-3 text-sm font-bold text-[#0c4a6e]">
                  03 — Localisation
                </h3>

                <div>
                  <label className={labelClass}>
                    Lien Google Maps / Itinéraire
                  </label>

                  <input
                    type="url"
                    value={form.localisation_maps}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        localisation_maps: event.target.value,
                      })
                    }
                    placeholder="https://maps.google.com/..."
                    className={inputClass}
                  />
                </div>
              </section>

              {/* GASTRONOMIE */}
              <section className="space-y-4">
                <h3 className="border-b border-slate-100 pb-3 text-sm font-bold text-[#0c4a6e]">
                  04 — Gastronomie &amp; Tarifs
                </h3>

                <div>
                  <label className={labelClass}>
                    Prix moyen par personne (FCFA)
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={form.prix_moyen}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        prix_moyen: event.target.value,
                      })
                    }
                    placeholder="Ex : 10000"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Types de cuisine
                  </label>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {CUISINE_TYPES.map((cuisine) => {
                      const active = form.type_cuisine.includes(
                        cuisine.id
                      );

                      return (
                        <button
                          key={cuisine.id}
                          type="button"
                          onClick={() => toggleCuisine(cuisine.id)}
                          className={
                            active
                              ? "rounded-lg border border-[#0c4a6e] bg-[#0c4a6e] px-3 py-2 text-xs font-semibold text-white"
                              : "rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:border-slate-300"
                          }
                        >
                          {cuisine.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* SERVICES */}
              <section className="space-y-4">
                <h3 className="border-b border-slate-100 pb-3 text-sm font-bold text-[#0c4a6e]">
                  05 — Services &amp; Équipements
                </h3>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
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
                            ? "flex items-center gap-3 rounded-xl border border-[#0c4a6e] bg-[#0c4a6e]/5 p-3 text-left text-xs font-semibold text-[#0c4a6e]"
                            : "flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left text-xs font-semibold text-slate-600"
                        }
                      >
                        <Icon size={16} className="shrink-0" />
                        <span className="flex-1">{service.label}</span>
                        {active && <Check size={15} />}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* PAIEMENTS */}
              <section className="space-y-4">
                <h3 className="border-b border-slate-100 pb-3 text-sm font-bold text-[#0c4a6e]">
                  06 — Moyens de paiement
                </h3>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {PAYMENT_LIST.map((payment) => {
                    const Icon = payment.icon;
                    const active = form.services.includes(payment.id);

                    return (
                      <button
                        key={payment.id}
                        type="button"
                        onClick={() => toggleService(payment.id)}
                        className={
                          active
                            ? "flex items-center gap-3 rounded-xl border border-[#0c4a6e] bg-[#0c4a6e]/5 p-3 text-left text-xs font-semibold text-[#0c4a6e]"
                            : "flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left text-xs font-semibold text-slate-600"
                        }
                      >
                        <Icon size={16} className="shrink-0" />
                        <span className="flex-1">{payment.label}</span>
                        {active && <Check size={15} />}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* PHOTOS */}
              <section className="space-y-4">
                <h3 className="border-b border-slate-100 pb-3 text-sm font-bold text-[#0c4a6e]">
                  07 — Photos de l'établissement
                </h3>

                <p className="text-xs text-slate-500">
                  Ajoutez jusqu'à quatre photos. La première sera
                  utilisée comme image principale.
                </p>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {form.images.map((image, index) => (
                    <UploadBox
                      key={index}
                      index={index}
                      value={image}
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

            {/* ACTIONS */}
            <div className="flex shrink-0 items-center justify-end gap-3 border-t border-slate-100 bg-slate-50 px-5 py-4 sm:px-7">
              <button
                type="button"
                disabled={saving}
                onClick={() => setShowModal(false)}
                className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200/60"
              >
                Annuler
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={save}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0c4a6e] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#083a57] disabled:opacity-60"
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
