"use client";

import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
  type ChangeEvent,
} from "react";
import {
  Hotel,
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
  Edit3,
  Ban,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import { createClient } from "@/lib/supabase/client";

type HotelData = {
  id: string;
  nom?: string;
  title?: string;
  ville?: string;
  quartier?: string;
  adresse?: string;
  telephone?: string;
  whatsapp?: string;
  email?: string;
  site_internet?: string;
  localisation_maps?: string;
  description?: string;
  prix_nuit?: number | string | null;
  nb_chambres?: number | null;
  type_chambre?: string[];
  image?: string | null;
  images?: string[];
  type?: string;
  wifi?: boolean;
  clim?: boolean;
  television?: boolean;
  eau_chaude?: boolean;
  refrigirateur?: boolean;
  services?: string[];
  isActive?: boolean;
};

type HotelForm = {
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

const INITIAL_FORM: HotelForm = {
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
  "Piscine",
  "Parking",
  "Petit-déjeuner",
  "Salle de sport",
  "Spa",
  "Navette aéroport",
  "Réception 24h/24",
  "Service de chambre",
  "Blanchisserie",
];

function formatPrice(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return "Prix non renseigné";
  }
  const number = Number(value);
  return Number.isFinite(number)
    ? `${number.toLocaleString("fr-FR")} FCFA / nuit`
    : "Prix non renseigné";
}

// Composant de carte d'hôtel avec carrousel d'images intégré et design 100% rectangulaire sans arrondis
function AdminHotelCard({
  hotel,
  onEdit,
  onToggleBlock,
  onDelete,
}: {
  hotel: HotelData;
  onEdit: (h: HotelData) => void;
  onToggleBlock: (h: HotelData) => void;
  onDelete: (id: string, name?: string) => void;
}) {
  const [currentImg, setCurrentImg] = useState(0);
  const images =
    hotel.images && hotel.images.length > 0
      ? hotel.images.filter(Boolean)
      : hotel.image
        ? [hotel.image]
        : [];
  const isBlocked = hotel.isActive === false;

  const nextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (images.length > 1) setCurrentImg((prev) => (prev + 1) % images.length);
  };

  const prevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (images.length > 1)
      setCurrentImg((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <article
      className={`group relative overflow-hidden rounded-none border bg-white shadow-sm transition ${
        isBlocked ? "opacity-60 bg-slate-50 border-red-200" : "border-slate-200"
      }`}
    >
      <div className="relative h-48 bg-slate-100 rounded-none">
        {images.length > 0 ? (
          <img
            src={images[currentImg]}
            alt={hotel.nom || hotel.title || "Hôtel"}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Hotel size={42} className="text-slate-300" />
          </div>
        )}

        {isBlocked && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-none uppercase tracking-wider z-10">
            Bloqué
          </span>
        )}

        {/* Contrôles du carrousel */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevImg}
              className="absolute left-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center bg-black/50 text-white hover:bg-black/80 transition z-10"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={nextImg}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center bg-black/50 text-white hover:bg-black/80 transition z-10"
            >
              <ChevronRight size={16} />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`h-1 transition-all ${
                    i === currentImg ? "w-4 bg-white" : "w-1.5 bg-white/60"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="space-y-3 p-5">
        <h3 className="text-lg font-bold text-[#0c4a6e]">
          {hotel.nom || hotel.title || "Sans nom"}
        </h3>

        <p className="flex items-center gap-2 text-sm text-slate-500">
          <MapPin size={15} />
          {[hotel.quartier, hotel.ville].filter(Boolean).join(", ") ||
            "Localisation non renseignée"}
        </p>

        {hotel.telephone && (
          <p className="flex items-center gap-2 text-sm text-slate-500">
            <Phone size={15} />
            {hotel.telephone}
          </p>
        )}

        {hotel.wifi && (
          <p className="flex items-center gap-2 text-xs text-slate-500">
            <Wifi size={15} />
            Wi-Fi disponible
          </p>
        )}

        <div className="border-t border-slate-100 pt-3">
          <p className="text-sm font-bold text-[#0c4a6e]">
            {formatPrice(hotel.prix_nuit)}
          </p>

          {hotel.nb_chambres != null && (
            <p className="mt-1 flex items-center gap-2 text-xs text-slate-500">
              <BedDouble size={14} />
              {hotel.nb_chambres} chambre(s)
            </p>
          )}
        </div>

        {/* BOUTONS D'ADMINISTRATION : MODIFIER, BLOQUER/DÉBLOQUER, SUPPRIMER */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          <button
            type="button"
            onClick={() => onEdit(hotel)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0c4a6e] hover:underline"
          >
            <Edit3 size={15} /> Modifier
          </button>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onToggleBlock(hotel)}
              className={`inline-flex items-center gap-1 text-xs font-semibold ${
                isBlocked
                  ? "text-green-600 hover:underline"
                  : "text-amber-600 hover:underline"
              }`}
              title={isBlocked ? "Débloquer" : "Bloquer"}
            >
              {isBlocked ? <CheckCircle size={15} /> : <Ban size={15} />}
              {isBlocked ? "Débloquer" : "Bloquer"}
            </button>
            <button
              type="button"
              onClick={() => onDelete(hotel.id, hotel.nom || hotel.title)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:underline"
            >
              <Trash2 size={15} /> Supprimer
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function HotelsPage() {
  const [hotels, setHotels] = useState<HotelData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<HotelForm>(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedImages, setSelectedImages] = useState<
    { file: File; preview: string }[]
  >([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const loadHotels = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/categories?type=hotel", {
        cache: "no-store",
        credentials: "same-origin",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.details || result.error || `Erreur HTTP ${response.status}`
        );
      }

      const items: HotelData[] = Array.isArray(result.data) ? result.data : [];
      setHotels(items.filter((item) => item.type === "hotel"));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Impossible de charger les hôtels."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadHotels();
  }, [loadHotels]);

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

  function openModal(hotelToEdit?: HotelData) {
    setSaveError("");
    setSuccess("");
    setUploadProgress("");

    if (hotelToEdit) {
      setEditingId(hotelToEdit.id);
      setForm({
        nom: hotelToEdit.nom || hotelToEdit.title || "",
        ville: hotelToEdit.ville || "",
        adresse: hotelToEdit.adresse || "",
        quartier: hotelToEdit.quartier || "",
        telephone: hotelToEdit.telephone || "",
        whatsapp: hotelToEdit.whatsapp || "",
        email: hotelToEdit.email || "",
        site_internet: hotelToEdit.site_internet || "",
        localisation_maps: hotelToEdit.localisation_maps || "",
        description: hotelToEdit.description || "",
        prix_nuit:
          hotelToEdit.prix_nuit != null ? String(hotelToEdit.prix_nuit) : "",
        nb_chambres:
          hotelToEdit.nb_chambres != null ? String(hotelToEdit.nb_chambres) : "",
        type_chambre: Array.isArray(hotelToEdit.type_chambre)
          ? hotelToEdit.type_chambre.join(", ")
          : "",
        services: Array.isArray(hotelToEdit.services)
          ? hotelToEdit.services
          : [],
        clim: !!hotelToEdit.clim,
        wifi: !!hotelToEdit.wifi,
        television: !!hotelToEdit.television,
        eau_chaude: !!hotelToEdit.eau_chaude,
        refrigirateur: !!hotelToEdit.refrigirateur,
      });
      const imgs =
        hotelToEdit.images ||
        (hotelToEdit.image ? [hotelToEdit.image] : []);
      setExistingImages(imgs);
      setSelectedImages([]);
    } else {
      setEditingId(null);
      setForm(INITIAL_FORM);
      setExistingImages([]);
      setSelectedImages((previous) => {
        previous.forEach((item) => URL.revokeObjectURL(item.preview));
        return [];
      });
    }
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

  function updateField<K extends keyof HotelForm>(key: K, value: HotelForm[K]) {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  function toggleService(service: string) {
    setForm((previous) => ({
      ...previous,
      services: previous.services.includes(service)
        ? previous.services.filter((item) => item !== service)
        : [...previous.services, service],
    }));
  }

  function selectImages(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (!files.length) return;

    const accepted = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    const maxBytes = 5 * 1024 * 1024;
    if (
      files.some(
        (file) =>
          !accepted.includes(file.type) || file.size > maxBytes || !file.size
      )
    ) {
      setSaveError(
        "Choisissez des images JPG, PNG, WebP ou AVIF de 5 Mo maximum chacune."
      );
      return;
    }
    if (existingImages.length + selectedImages.length + files.length > 4) {
      setSaveError("Vous pouvez sélectionner 4 photos maximum au total.");
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

  function removeExistingImage(index: number) {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function uploadImage(file: File): Promise<string> {
    const body = new FormData();
    body.append("file", file);
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const headers: Record<string, string> = {};
    if (session?.access_token) {
      headers["Authorization"] = `Bearer ${session.access_token}`;
    }

    const response = await fetch("/api/admin/hotels/upload", {
      method: "POST",
      credentials: "same-origin",
      headers,
      body,
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || typeof result.url !== "string") {
      throw new Error(result.error || `Upload impossible (${response.status}).`);
    }
    return result.url;
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;

    setSaving(true);
    setSaveError("");
    setSuccess("");

    try {
      const newImages: string[] = [];
      for (const [index, selected] of selectedImages.entries()) {
        setUploadProgress(
          `Envoi de la photo ${index + 1}/${selectedImages.length}...`
        );
        newImages.push(await uploadImage(selected.file));
      }
      setUploadProgress("Enregistrement de l'hôtel...");

      const allImages = [...existingImages, ...newImages];

      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }

      const payload = {
        ...form,
        id: editingId || crypto.randomUUID(),
        updatedAt: new Date(),
        nom: form.nom.trim(),
        title: form.nom.trim(),
        ville: form.ville.trim(),
        type: "hotel",
        prix_nuit: form.prix_nuit === "" ? null : Number(form.prix_nuit),
        nb_chambres: form.nb_chambres === "" ? null : Number(form.nb_chambres),
        type_chambre: form.type_chambre ? [form.type_chambre] : [],
        images: allImages,
        image: allImages[0] ?? null,
        isActive: true,
      };

      const endpoint = editingId ? `/api/categories/${editingId}` : "/api/categories";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        credentials: "same-origin",
        headers,
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.details || result.error || "Impossible d'enregistrer l'hôtel."
        );
      }

      setShowModal(false);
      selectedImages.forEach((item) => URL.revokeObjectURL(item.preview));
      setSelectedImages([]);
      setSuccess(
        editingId
          ? "Hôtel modifié avec succès."
          : "Hôtel enregistré avec succès."
      );

      await loadHotels();
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Erreur lors de l'enregistrement."
      );
    } finally {
      setSaving(false);
      setUploadProgress("");
    }
  }

  async function handleDelete(id: string, name?: string) {
    if (!confirm(`Voulez-vous vraiment supprimer "${name || "cet hôtel"}" ?`))
      return;
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
        credentials: "same-origin",
      });
      if (!response.ok) throw new Error("Suppression impossible.");
      setSuccess("Hôtel supprimé avec succès.");
      await loadHotels();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la suppression."
      );
    }
  }

  async function handleToggleBlock(hotel: HotelData) {
    const nextState = hotel.isActive === false ? true : false;
    try {
      const response = await fetch(`/api/categories/${hotel.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ ...hotel, isActive: nextState }),
      });
      if (!response.ok) throw new Error("Mise à jour du statut impossible.");
      setSuccess(
        nextState ? "Hôtel débloqué (activé)." : "Hôtel bloqué (masqué)."
      );
      await loadHotels();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors du changement de statut."
      );
    }
  }

  const filteredHotels = hotels.filter((hotel) => {
    const text = [
      hotel.nom,
      hotel.title,
      hotel.ville,
      hotel.quartier,
      hotel.adresse,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return text.includes(search.toLowerCase().trim());
  });

  const inputClass =
    "w-full rounded-none border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#0c4a6e]";

  const labelClass = "mb-1.5 block text-sm font-semibold text-slate-700";

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
                Gestion des hôtels
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Gérez, modifiez, bloquez ou supprimez les établissements hôteliers de CÔTIÈRE.
              </p>
            </div>

            <button
              type="button"
              onClick={() => openModal()}
              className="inline-flex items-center gap-2 rounded-none bg-[#0c4a6e] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#08334c]"
            >
              <Plus size={18} />
              Ajouter un hôtel
            </button>
          </div>

          {/* CONFIRMATION */}
          {success && (
            <div
              role="status"
              className="mb-6 rounded-none border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-700"
            >
              {success}
            </div>
          )}

          {/* STATISTIQUES */}
          <div className="mb-6 flex items-center justify-between rounded-none border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <Hotel className="text-[#0c4a6e]" size={25} />

              <div>
                <p className="text-sm font-bold text-slate-800">
                  Hôtels enregistrés
                </p>

                <p className="text-xs text-slate-500">
                  {hotels.length} hôtel(s)
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => void loadHotels()}
              disabled={loading}
              aria-label="Actualiser les hôtels"
              className="rounded-none p-2 text-[#0c4a6e] hover:bg-slate-100 disabled:opacity-50"
            >
              <RefreshCw size={19} className={loading ? "animate-spin" : ""} />
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
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher un hôtel, une ville, un quartier..."
              className={`${inputClass} pl-11 rounded-none`}
            />
          </div>

          {/* LISTE */}
          {loading ? (
            <div className="flex min-h-64 items-center justify-center gap-3 rounded-none bg-white">
              <Loader2 className="animate-spin text-[#0c4a6e]" />
              Chargement des hôtels...
            </div>
          ) : error ? (
            <div
              role="alert"
              className="rounded-none border border-red-200 bg-red-50 p-6 text-red-700"
            >
              {error}
            </div>
          ) : filteredHotels.length === 0 ? (
            <div className="rounded-none border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <Hotel size={42} className="mx-auto mb-4 text-slate-400" />

              <h2 className="text-lg font-bold text-[#0c4a6e]">
                {search ? "Aucun résultat" : "Aucun hôtel enregistré"}
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                {search
                  ? "Essayez une autre recherche."
                  : "Ajoutez votre premier hôtel."}
              </p>

              {!search && (
                <button
                  type="button"
                  onClick={() => openModal()}
                  className="mt-5 inline-flex items-center gap-2 rounded-none bg-[#c9a84c] px-5 py-3 text-sm font-bold text-[#0c4a6e]"
                >
                  <Plus size={18} />
                  Ajouter un hôtel
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredHotels.map((hotel) => (
                <AdminHotelCard
                  key={hotel.id}
                  hotel={hotel}
                  onEdit={openModal}
                  onToggleBlock={handleToggleBlock}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* MODALE AJOUT / MODIFICATION HÔTEL */}
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
            aria-labelledby="hotel-modal-title"
            className="flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-none bg-white shadow-2xl"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-7">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#c9a84c]">
                  CÔTIÈRE Administration
                </p>

                <h2
                  id="hotel-modal-title"
                  className="mt-1 text-xl font-extrabold text-[#0c4a6e]"
                >
                  {editingId ? "Modifier l'hôtel" : "Ajouter un hôtel"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                aria-label="Fermer"
                className="rounded-none p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex min-h-0 flex-1 flex-col">
              <div className="flex-1 space-y-7 overflow-y-auto px-5 py-6 sm:px-7">
                {/* IDENTITÉ */}
                <section>
                  <h3 className="mb-4 font-bold text-[#0c4a6e]">
                    Informations générales
                  </h3>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label htmlFor="hotel-nom" className={labelClass}>
                        Nom de l'hôtel *
                      </label>

                      <input
                        id="hotel-nom"
                        required
                        value={form.nom}
                        onChange={(event) =>
                          updateField("nom", event.target.value)
                        }
                        className={inputClass}
                        placeholder="Ex. Hôtel Les Palmiers"
                      />
                    </div>

                    <div>
                      <label htmlFor="hotel-ville" className={labelClass}>
                        Ville *
                      </label>

                      <input
                        id="hotel-ville"
                        required
                        value={form.ville}
                        onChange={(event) =>
                          updateField("ville", event.target.value)
                        }
                        className={inputClass}
                        placeholder="Abidjan"
                      />
                    </div>

                    <div>
                      <label htmlFor="hotel-quartier" className={labelClass}>
                        Quartier
                      </label>

                      <input
                        id="hotel-quartier"
                        value={form.quartier}
                        onChange={(event) =>
                          updateField("quartier", event.target.value)
                        }
                        className={inputClass}
                        placeholder="Cocody"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="hotel-adresse" className={labelClass}>
                        Adresse
                      </label>

                      <input
                        id="hotel-adresse"
                        value={form.adresse}
                        onChange={(event) =>
                          updateField("adresse", event.target.value)
                        }
                        className={inputClass}
                        placeholder="Adresse complète"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="hotel-description" className={labelClass}>
                        Description
                      </label>

                      <textarea
                        id="hotel-description"
                        rows={3}
                        value={form.description}
                        onChange={(event) =>
                          updateField("description", event.target.value)
                        }
                        className={inputClass}
                        placeholder="Présentez l'hôtel..."
                      />
                    </div>
                  </div>
                </section>

                {/* TARIFS ET CHAMBRES */}
                <section>
                  <h3 className="mb-4 font-bold text-[#0c4a6e]">
                    Tarifs et chambres
                  </h3>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="hotel-prix" className={labelClass}>
                        Prix par nuit (FCFA)
                      </label>

                      <input
                        id="hotel-prix"
                        type="number"
                        min="0"
                        value={form.prix_nuit}
                        onChange={(event) =>
                          updateField("prix_nuit", event.target.value)
                        }
                        className={inputClass}
                        placeholder="35000"
                      />
                    </div>

                    <div>
                      <label htmlFor="hotel-chambres" className={labelClass}>
                        Nombre de chambres
                      </label>

                      <input
                        id="hotel-chambres"
                        type="number"
                        min="0"
                        step="1"
                        value={form.nb_chambres}
                        onChange={(event) =>
                          updateField("nb_chambres", event.target.value)
                        }
                        className={inputClass}
                        placeholder="25"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="hotel-type-chambre" className={labelClass}>
                        Type de chambre
                      </label>

                      <input
                        id="hotel-type-chambre"
                        value={form.type_chambre}
                        onChange={(event) =>
                          updateField("type_chambre", event.target.value)
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
                        ["localisation_maps", "Lien Google Maps"],
                      ] as const
                    ).map(([key, label]) => (
                      <div
                        key={key}
                        className={
                          key === "localisation_maps" ? "sm:col-span-2" : ""
                        }
                      >
                        <label
                          htmlFor={`hotel-${key}`}
                          className={labelClass}
                        >
                          {label}
                        </label>

                        <input
                          id={`hotel-${key}`}
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
                            updateField(key, event.target.value)
                          }
                          className={inputClass}
                        />
                      </div>
                    ))}
                  </div>
                </section>

                {/* ÉQUIPEMENTS */}
                <section>
                  <h3 className="mb-4 font-bold text-[#0c4a6e]">Équipements</h3>

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
                        className="flex cursor-pointer items-center gap-2 rounded-none border border-slate-200 p-3 text-sm text-slate-700"
                      >
                        <input
                          type="checkbox"
                          checked={form[key]}
                          onChange={(event) =>
                            updateField(key, event.target.checked)
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
                        className="flex cursor-pointer items-center gap-2 rounded-none border border-slate-200 p-3 text-sm text-slate-700"
                      >
                        <input
                          type="checkbox"
                          checked={form.services.includes(service)}
                          onChange={() => toggleService(service)}
                          className="accent-[#0c4a6e]"
                        />
                        {service}
                      </label>
                    ))}
                  </div>
                </section>

                {/* PHOTOS */}
                <section>
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h3 className="font-bold text-[#0c4a6e]">
                      Photos de l'hôtel
                    </h3>
                    <span className="text-xs text-slate-500">
                      {existingImages.length + selectedImages.length}/4 photos
                    </span>
                  </div>
                  <p className="mb-4 text-xs text-slate-500">
                    Choisissez jusqu'à 4 photos au total (JPG, PNG, WebP ou
                    AVIF, 5 Mo max).
                  </p>
                  <label
                    className={`flex cursor-pointer flex-col items-center justify-center rounded-none border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center transition hover:border-[#0c4a6e] ${
                      existingImages.length + selectedImages.length >= 4 ||
                      saving
                        ? "pointer-events-none opacity-50"
                        : ""
                    }`}
                  >
                    <ImagePlus size={32} className="mb-2 text-[#0c4a6e]" />
                    <span className="text-sm font-semibold text-[#0c4a6e]">
                      Ajouter des photos
                    </span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      multiple
                      onChange={selectImages}
                      disabled={
                        saving ||
                        existingImages.length + selectedImages.length >= 4
                      }
                      className="sr-only"
                    />
                  </label>

                  {existingImages.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-semibold text-slate-600 mb-2">
                        Photos actuelles :
                      </p>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {existingImages.map((url, idx) => (
                          <div
                            key={url}
                            className="relative overflow-hidden rounded-none border border-slate-200 bg-slate-100"
                          >
                            <img
                              src={url}
                              alt={`Actuelle ${idx + 1}`}
                              className="h-28 w-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeExistingImage(idx)}
                              disabled={saving}
                              className="absolute right-1 top-1 rounded-none bg-white p-1.5 text-red-600 shadow disabled:opacity-50"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedImages.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-semibold text-slate-600 mb-2">
                        Nouvelles photos :
                      </p>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {selectedImages.map((item, index) => (
                          <div
                            key={item.preview}
                            className="relative overflow-hidden rounded-none border border-slate-200 bg-slate-100"
                          >
                            <img
                              src={item.preview}
                              alt={`Nouvelle ${index + 1}`}
                              className="h-28 w-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeSelectedImage(index)}
                              disabled={saving}
                              aria-label={`Retirer la photo ${index + 1}`}
                              className="absolute right-1 top-1 rounded-none bg-white p-1.5 text-red-600 shadow disabled:opacity-50"
                            >
                              <Trash2 size={15} />
                            </button>
                            <p
                              className="truncate px-2 py-1 text-[10px] text-slate-500"
                              title={item.file.name}
                            >
                              {item.file.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {saving && uploadProgress && (
                    <p
                      role="status"
                      className="mt-3 flex items-center gap-2 text-sm text-[#0c4a6e]"
                    >
                      <Loader2 size={15} className="animate-spin" />{" "}
                      {uploadProgress}
                    </p>
                  )}
                </section>

                {saveError && (
                  <div
                    role="alert"
                    className="rounded-none border border-red-200 bg-red-50 p-4 text-sm text-red-700"
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
                  className="rounded-none border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-none bg-[#0c4a6e] px-6 py-3 text-sm font-semibold text-white hover:bg-[#08334c] disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 size={17} className="animate-spin" />
                  ) : (
                    <Plus size={17} />
                  )}

                  {saving
                    ? "Enregistrement..."
                    : editingId
                      ? "Mettre à jour"
                      : "Enregistrer l'hôtel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}