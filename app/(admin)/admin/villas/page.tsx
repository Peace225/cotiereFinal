
"use client";

import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
  type ChangeEvent,
} from "react";
import {
  Building2,
  MapPin,
  Plus,
  Loader2,
  RefreshCw,
  X,
  Phone,
  Wifi,
  ImagePlus,
  Trash2,
  BedDouble,
  Search,
} from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";

type VillaData = {
  id: string;
  nom?: string;
  title?: string;
  ville?: string;
  quartier?: string;
  adresse?: string;
  telephone?: string;
  whatsapp?: string;
  prix_nuit?: number | string | null;
  nb_chambres?: number | null;
  image?: string | null;
  images?: string[];
  type?: string;
  wifi?: boolean;
};

type VillaForm = {
  nom: string;
  ville: string;
  adresse: string;
  quartier: string;
  telephone: string;
  whatsapp: string;
  email: string;
  site_internet: string;
  localisation_maps: string;
  description: string;
  prix_nuit: string;
  nb_chambres: string;
  type_chambre: string;
  services: string[];
  clim: boolean;
  wifi: boolean;
  television: boolean;
  eau_chaude: boolean;
  refrigirateur: boolean;
};

const INITIAL_FORM: VillaForm = {
  nom: "",
  ville: "",
  adresse: "",
  quartier: "",
  telephone: "",
  whatsapp: "",
  email: "",
  site_internet: "",
  localisation_maps: "",
  description: "",
  prix_nuit: "",
  nb_chambres: "",
  type_chambre: "",
  services: [],
  clim: false,
  wifi: false,
  television: false,
  eau_chaude: false,
  refrigirateur: false,
};

const SERVICES = [
  "Restaurant",
  "Piscine privée",
  "Parking",
  "Ménage",
  "Salle de sport",
  "Spa",
  "Navette aéroport",
  "Conciergerie",
  "Jardin",
  "Terrasse",
  "Barbecue",
  "Personnel de maison",
  "Blanchisserie",
];

function formatPrice(value: unknown) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "Prix non renseigné";
  }

  const number = Number(value);

  return Number.isFinite(number)
    ? `${number.toLocaleString("fr-FR")} FCFA / nuit`
    : "Prix non renseigné";
}

export default function VillasPage() {
  const [villas, setVillas] = useState<VillaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<VillaForm>(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedImages, setSelectedImages] = useState<{ file: File; preview: string }[]>([]);
  const [uploadProgress, setUploadProgress] = useState("");

  const loadVillas = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "/api/categories?type=villa",
        {
          cache: "no-store",
          credentials: "same-origin",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.details ||
          result.error ||
          `Erreur HTTP ${response.status}`
        );
      }

      const items: VillaData[] = Array.isArray(result.data)
        ? result.data
        : [];

      setVillas(
        items.filter((item) => item.type === "villa")
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible de charger les villas."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadVillas();
  }, [loadVillas]);

  useEffect(() => {
    if (!showModal) return;

    function onEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && !saving) {
        setShowModal(false);
      }
    }

    document.addEventListener("keydown", onEscape);

    return () => {
      document.removeEventListener("keydown", onEscape);
    };
  }, [showModal, saving]);

  function openModal() {
    setForm({
      ...INITIAL_FORM,
      services: [],
    });
    setSelectedImages((previous) => {
      previous.forEach((item) => URL.revokeObjectURL(item.preview));
      return [];
    });
    setSaveError("");
    setSuccess("");
    setUploadProgress("");
    setShowModal(true);
  }

  function closeModal() {
    if (saving) return;
    setShowModal(false);
    setSelectedImages((previous) => {
      previous.forEach((item) => URL.revokeObjectURL(item.preview));
      return [];
    });
    setSaveError("");
  }

  function updateField<K extends keyof VillaForm>(
    key: K,
    value: VillaForm[K]
  ) {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  function toggleService(service: string) {
    setForm((previous) => ({
      ...previous,
      services: previous.services.includes(service)
        ? previous.services.filter(
            (item) => item !== service
          )
        : [...previous.services, service],
    }));
  }

  function selectImages(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (!files.length) return;

    const accepted = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    const maxBytes = 5 * 1024 * 1024;
    if (files.some((file) => !accepted.includes(file.type) || file.size > maxBytes || !file.size)) {
      setSaveError("Choisissez des images JPG, PNG, WebP ou AVIF de 5 Mo maximum chacune.");
      return;
    }
    if (selectedImages.length + files.length > 4) {
      setSaveError("Vous pouvez sélectionner 4 photos maximum.");
      return;
    }
    setSaveError("");
    setSelectedImages((previous) => [
      ...previous,
      ...files.map((file) => ({ file, preview: URL.createObjectURL(file) })),
    ]);
  }

  function removeSelectedImage(index: number) {
    setSelectedImages((previous) => {
      const target = previous[index];
      if (target) URL.revokeObjectURL(target.preview);
      return previous.filter((_, i) => i !== index);
    });
  }

  async function uploadImage(file: File): Promise<string> {
    const body = new FormData();
    body.append("file", file);
    const response = await fetch("/api/admin/villas/upload", {
      method: "POST",
      credentials: "same-origin",
      body,
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || typeof result.url !== "string") {
      throw new Error(result.error || `Upload impossible (${response.status}).`);
    }
    return result.url;
  }

  async function addVilla(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (saving) return;

    setSaving(true);
    setSaveError("");
    setSuccess("");

    try {
      const images: string[] = [];
      for (const [index, selected] of selectedImages.entries()) {
        setUploadProgress(`Envoi de la photo ${index + 1}/${selectedImages.length}...`);
        images.push(await uploadImage(selected.file));
      }
      setUploadProgress("Enregistrement de la villa...");

      const payload = {
        ...form,
        nom: form.nom.trim(),
        title: form.nom.trim(),
        ville: form.ville.trim(),
        type: "villa",
        prix_nuit:
          form.prix_nuit === ""
            ? null
            : Number(form.prix_nuit),
        nb_chambres:
          form.nb_chambres === ""
            ? null
            : Number(form.nb_chambres),
        type_chambre: form.type_chambre
          ? [form.type_chambre]
          : [],
        images,
        image: images[0] ?? null,
        isActive: true,
      };

      const response = await fetch("/api/categories", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.details ||
          result.error ||
          "Impossible d'enregistrer la villa."
        );
      }

      setShowModal(false);
      selectedImages.forEach((item) => URL.revokeObjectURL(item.preview));
      setSelectedImages([]);
      setSuccess("Villa enregistrée avec succès.");

      await loadVillas();
    } catch (err) {
      setSaveError(
        err instanceof Error
          ? err.message
          : "Erreur lors de l'enregistrement."
      );
    } finally {
      setSaving(false);
      setUploadProgress("");
    }
  }

  const filteredVillas = villas.filter((villa) => {
    const text = [
      villa.nom,
      villa.title,
      villa.ville,
      villa.quartier,
      villa.adresse,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return text.includes(search.toLowerCase().trim());
  });

  const inputClass =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#0c4a6e] focus:ring-2 focus:ring-[#0c4a6e]/10";

  const labelClass =
    "mb-1.5 block text-sm font-semibold text-slate-700";

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNavbar />

      <main className="min-w-0 lg:ml-72">
        <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {/* EN-TÊTE */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#c9a84c]">
                Administration / Hébergements
              </p>

              <h1 className="mt-2 text-2xl font-extrabold text-[#0c4a6e] sm:text-3xl">
                Gestion des villas
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Gérez les villas de CÔTIÈRE.
              </p>
            </div>

            <button
              type="button"
              onClick={openModal}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0c4a6e] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#08334c]"
            >
              <Plus size={18} />
              Ajouter une villa
            </button>
          </div>

          {/* CONFIRMATION */}
          {success && (
            <div
              role="status"
              className="mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-700"
            >
              {success}
            </div>
          )}

          {/* STATISTIQUES */}
          <div className="mb-6 flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <Building2
                className="text-[#0c4a6e]"
                size={25}
              />

              <div>
                <p className="text-sm font-bold text-slate-800">
                  Villas enregistrés
                </p>

                <p className="text-xs text-slate-500">
                  {villas.length} villa(s)
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => void loadVillas()}
              disabled={loading}
              aria-label="Actualiser les villas"
              className="rounded-lg p-2 text-[#0c4a6e] hover:bg-slate-100 disabled:opacity-50"
            >
              <RefreshCw
                size={19}
                className={loading ? "animate-spin" : ""}
              />
            </button>
          </div>

          {/* RECHERCHE */}
          <div className="relative mb-6">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Rechercher une villa, une ville, un quartier..."
              className={`${inputClass} pl-11`}
            />
          </div>

          {/* LISTE */}
          {loading ? (
            <div className="flex min-h-64 items-center justify-center gap-3 rounded-2xl bg-white">
              <Loader2 className="animate-spin text-[#0c4a6e]" />
              Chargement des villas...
            </div>
          ) : error ? (
            <div
              role="alert"
              className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700"
            >
              {error}
            </div>
          ) : filteredVillas.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <Building2
                size={42}
                className="mx-auto mb-4 text-slate-400"
              />

              <h2 className="text-lg font-bold text-[#0c4a6e]">
                {search
                  ? "Aucun résultat"
                  : "Aucune villa enregistrée"}
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                {search
                  ? "Essayez une autre recherche."
                  : "Ajoutez votre première villa."}
              </p>

              {!search && (
                <button
                  type="button"
                  onClick={openModal}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#c9a84c] px-5 py-3 text-sm font-bold text-[#0c4a6e]"
                >
                  <Plus size={18} />
                  Ajouter une villa
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredVillas.map((villa) => {
                const image =
                  villa.images?.find(Boolean) ||
                  villa.image;

                return (
                  <article
                    key={villa.id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                  >
                    <div className="h-48 bg-slate-100">
                      {image ? (
                        <img
                          src={image}
                          alt={
                            villa.nom ||
                            villa.title ||
                            "Villa"
                          }
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Building2
                            size={42}
                            className="text-slate-300"
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 p-5">
                      <h3 className="text-lg font-bold text-[#0c4a6e]">
                        {villa.nom ||
                          villa.title ||
                          "Sans nom"}
                      </h3>

                      <p className="flex items-center gap-2 text-sm text-slate-500">
                        <MapPin size={15} />
                        {[
                          villa.quartier,
                          villa.ville,
                        ]
                          .filter(Boolean)
                          .join(", ") ||
                          "Localisation non renseignée"}
                      </p>

                      {villa.telephone && (
                        <p className="flex items-center gap-2 text-sm text-slate-500">
                          <Phone size={15} />
                          {villa.telephone}
                        </p>
                      )}

                      {villa.wifi && (
                        <p className="flex items-center gap-2 text-xs text-slate-500">
                          <Wifi size={15} />
                          Wi-Fi disponible
                        </p>
                      )}

                      <div className="border-t border-slate-100 pt-3">
                        <p className="text-sm font-bold text-[#0c4a6e]">
                          {formatPrice(villa.prix_nuit)}
                        </p>

                        {villa.nb_chambres != null && (
                          <p className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                            <BedDouble size={14} />
                            {villa.nb_chambres} chambre(s)
                          </p>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* MODALE AJOUT HÔTEL */}
      {showModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-3 sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="villa-modal-title"
            className="flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-7">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#c9a84c]">
                  CÔTIÈRE Administration
                </p>

                <h2
                  id="villa-modal-title"
                  className="mt-1 text-xl font-extrabold text-[#0c4a6e]"
                >
                  Ajouter une villa
                </h2>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                aria-label="Fermer"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={22} />
              </button>
            </div>

            <form
              onSubmit={addVilla}
              className="flex min-h-0 flex-1 flex-col"
            >
              <div className="flex-1 space-y-7 overflow-y-auto px-5 py-6 sm:px-7">
                {/* IDENTITÉ */}
                <section>
                  <h3 className="mb-4 font-bold text-[#0c4a6e]">
                    Informations générales
                  </h3>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="villa-nom"
                        className={labelClass}
                      >
                        Nom de la villa *
                      </label>

                      <input
                        id="villa-nom"
                        required
                        value={form.nom}
                        onChange={(event) =>
                          updateField(
                            "nom",
                            event.target.value
                          )
                        }
                        className={inputClass}
                        placeholder="Ex. Villa Les Palmiers"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="villa-ville"
                        className={labelClass}
                      >
                        Ville *
                      </label>

                      <input
                        id="villa-ville"
                        required
                        value={form.ville}
                        onChange={(event) =>
                          updateField(
                            "ville",
                            event.target.value
                          )
                        }
                        className={inputClass}
                        placeholder="Abidjan"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="villa-quartier"
                        className={labelClass}
                      >
                        Quartier
                      </label>

                      <input
                        id="villa-quartier"
                        value={form.quartier}
                        onChange={(event) =>
                          updateField(
                            "quartier",
                            event.target.value
                          )
                        }
                        className={inputClass}
                        placeholder="Cocody"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="villa-adresse"
                        className={labelClass}
                      >
                        Adresse
                      </label>

                      <input
                        id="villa-adresse"
                        value={form.adresse}
                        onChange={(event) =>
                          updateField(
                            "adresse",
                            event.target.value
                          )
                        }
                        className={inputClass}
                        placeholder="Adresse complète"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="villa-description"
                        className={labelClass}
                      >
                        Description
                      </label>

                      <textarea
                        id="villa-description"
                        rows={3}
                        value={form.description}
                        onChange={(event) =>
                          updateField(
                            "description",
                            event.target.value
                          )
                        }
                        className={inputClass}
                        placeholder="Présentez la villa..."
                      />
                    </div>
                  </div>
                </section>

                {/* TARIFS ET CHAMBRES */}
                <section>
                  <h3 className="mb-4 font-bold text-[#0c4a6e]">
                    Tarifs et logements
                  </h3>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="villa-prix"
                        className={labelClass}
                      >
                        Prix par nuit (FCFA)
                      </label>

                      <input
                        id="villa-prix"
                        type="number"
                        min="0"
                        value={form.prix_nuit}
                        onChange={(event) =>
                          updateField(
                            "prix_nuit",
                            event.target.value
                          )
                        }
                        className={inputClass}
                        placeholder="35000"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="villa-logements"
                        className={labelClass}
                      >
                        Nombre de chambres
                      </label>

                      <input
                        id="villa-logements"
                        type="number"
                        min="0"
                        step="1"
                        value={form.nb_chambres}
                        onChange={(event) =>
                          updateField(
                            "nb_chambres",
                            event.target.value
                          )
                        }
                        className={inputClass}
                        placeholder="25"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="villa-type-logement"
                        className={labelClass}
                      >
                        Type de chambre
                      </label>

                      <input
                        id="villa-type-logement"
                        value={form.type_chambre}
                        onChange={(event) =>
                          updateField(
                            "type_chambre",
                            event.target.value
                          )
                        }
                        className={inputClass}
                        placeholder="Standard, Suite, Deluxe..."
                      />
                    </div>
                  </div>
                </section>

                {/* CONTACTS */}
                <section>
                  <h3 className="mb-4 font-bold text-[#0c4a6e]">
                    Contacts et localisation
                  </h3>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {(
                      [
                        ["telephone", "Téléphone"],
                        ["whatsapp", "WhatsApp"],
                        ["email", "Email"],
                        ["site_internet", "Site internet"],
                        [
                          "localisation_maps",
                          "Lien Google Maps",
                        ],
                      ] as const
                    ).map(([key, label]) => (
                      <div
                        key={key}
                        className={
                          key === "localisation_maps"
                            ? "sm:col-span-2"
                            : ""
                        }
                      >
                        <label
                          htmlFor={`villa-${key}`}
                          className={labelClass}
                        >
                          {label}
                        </label>

                        <input
                          id={`villa-${key}`}
                          type={
                            key === "email"
                              ? "email"
                              : key === "site_internet" ||
                                  key === "localisation_maps"
                                ? "url"
                                : "text"
                          }
                          value={form[key]}
                          onChange={(event) =>
                            updateField(
                              key,
                              event.target.value
                            )
                          }
                          className={inputClass}
                        />
                      </div>
                    ))}
                  </div>
                </section>

                {/* ÉQUIPEMENTS */}
                <section>
                  <h3 className="mb-4 font-bold text-[#0c4a6e]">
                    Équipements
                  </h3>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {(
                      [
                        ["wifi", "Wi-Fi"],
                        ["clim", "Climatisation"],
                        ["television", "Télévision"],
                        ["eau_chaude", "Eau chaude"],
                        ["refrigirateur", "Réfrigérateur"],
                      ] as const
                    ).map(([key, label]) => (
                      <label
                        key={key}
                        className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 p-3 text-sm text-slate-700"
                      >
                        <input
                          type="checkbox"
                          checked={form[key]}
                          onChange={(event) =>
                            updateField(
                              key,
                              event.target.checked
                            )
                          }
                          className="accent-[#0c4a6e]"
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </section>

                {/* SERVICES */}
                <section>
                  <h3 className="mb-4 font-bold text-[#0c4a6e]">
                    Services disponibles
                  </h3>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {SERVICES.map((service) => (
                      <label
                        key={service}
                        className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 p-3 text-sm text-slate-700"
                      >
                        <input
                          type="checkbox"
                          checked={form.services.includes(
                            service
                          )}
                          onChange={() =>
                            toggleService(service)
                          }
                          className="accent-[#0c4a6e]"
                        />
                        {service}
                      </label>
                    ))}
                  </div>
                </section>

                {/* PHOTOS : IMPORT DEPUIS L'APPAREIL */}
                <section>
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h3 className="font-bold text-[#0c4a6e]">Photos de la villa</h3>
                    <span className="text-xs text-slate-500">{selectedImages.length}/4 photos</span>
                  </div>
                  <p className="mb-4 text-xs text-slate-500">
                    Choisissez jusqu'à 4 photos JPG, PNG, WebP ou AVIF (5 Mo par photo).
                    Elles seront envoyées lorsque vous enregistrerez la villa.
                  </p>
                  <label className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center transition hover:border-[#0c4a6e] ${selectedImages.length >= 4 || saving ? "pointer-events-none opacity-50" : ""}`}>
                    <ImagePlus size={32} className="mb-2 text-[#0c4a6e]" />
                    <span className="text-sm font-semibold text-[#0c4a6e]">Choisir des photos depuis mon appareil</span>
                    <span className="mt-1 text-xs text-slate-500">Mac, ordinateur ou téléphone</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      multiple
                      onChange={selectImages}
                      disabled={saving || selectedImages.length >= 4}
                      className="sr-only"
                    />
                  </label>
                  {selectedImages.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {selectedImages.map((item, index) => (
                        <div key={item.preview} className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                          <img src={item.preview} alt={`Photo sélectionnée ${index + 1}`} className="h-28 w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeSelectedImage(index)}
                            disabled={saving}
                            aria-label={`Retirer la photo ${index + 1}`}
                            className="absolute right-1 top-1 rounded-full bg-white p-1.5 text-red-600 shadow disabled:opacity-50"
                          >
                            <Trash2 size={15} />
                          </button>
                          <p className="truncate px-2 py-1 text-[10px] text-slate-500" title={item.file.name}>{item.file.name}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {saving && uploadProgress && (
                    <p role="status" className="mt-3 flex items-center gap-2 text-sm text-[#0c4a6e]">
                      <Loader2 size={15} className="animate-spin" /> {uploadProgress}
                    </p>
                  )}
                </section>

                {saveError && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                  >
                    {saveError}
                  </div>
                )}
              </div>

              {/* ACTIONS */}
              <div className="flex shrink-0 flex-wrap justify-end gap-3 border-t border-slate-200 bg-white px-5 py-4 sm:px-7">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0c4a6e] px-6 py-3 text-sm font-semibold text-white hover:bg-[#08334c] disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                  ) : (
                    <Plus size={17} />
                  )}

                  {saving
                    ? "Enregistrement..."
                    : "Enregistrer la villa"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
