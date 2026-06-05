"use client";
import { useState, useRef } from "react";
import { CheckCircle, Loader2, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import AvailabilityCalendar from "@/components/frontend/AvailabilityCalendar";

const PRICE_MAP: Record<string, [number, number]> = {
  tournage:  [150000, 300000],
  photo:     [100000, 200000],
  streaming: [80000,  150000],
  drone:     [100000, 200000],
  regie:     [200000, 400000],
  montage:   [50000,  150000],
  livraison: [10000,  20000],
};

const EVENT_TYPES = ["Mariage", "Bapteme", "Conference", "Concert", "Anniversaire", "Entreprise", "Autre"];
const TIME_SLOTS = [
  { value: "matin", label: "Matin (8h - 12h)" },
  { value: "apres-midi", label: "Après-midi (14h - 18h)" },
  { value: "soiree", label: "Soirée (19h - 23h)" },
  { value: "journee", label: "Journée complète" },
];
const DURATIONS = ["2h", "4h", "6h", "8h", "journee"];
const SERVICES_LIST = [
  { value: "tournage", label: "Tournage vidéo professionnel" },
  { value: "photo", label: "Photographie professionnelle" },
  { value: "streaming", label: "Streaming en direct (live)" },
  { value: "drone", label: "Prises de vue aériennes par drone" },
  { value: "regie", label: "Régie mobile pour rendu TV" },
  { value: "montage", label: "Montage vidéo post-production" },
  { value: "livraison", label: "Livraison clé USB / lien téléchargement" },
];

type FormData = {
  clientFirstName: string; clientLastName: string;
  clientEmail: string; clientPhone: string; clientWhatsapp: string;
  eventType: string; eventDate: string; eventTimeSlot: string;
  eventLocation: string; eventDuration: string; guestCount: string;
  description: string; services: string[];
};

const initial: FormData = {
  clientFirstName: "", clientLastName: "", clientEmail: "", clientPhone: "", clientWhatsapp: "",
  eventType: "", eventDate: "", eventTimeSlot: "", eventLocation: "", eventDuration: "",
  guestCount: "", description: "", services: [],
};

export default function StudioBookingForm() {
  const [form, setForm] = useState<FormData>(initial);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Calcul tarif indicatif en temps réel
  const priceMin = form.services.reduce((s, v) => s + (PRICE_MAP[v]?.[0] ?? 0), 0);
  const priceMax = form.services.reduce((s, v) => s + (PRICE_MAP[v]?.[1] ?? 0), 0);

  async function handleFileUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    const fd = new FormData();
    Array.from(files).forEach(f => fd.append("files", f));
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.data?.urls) setAttachments(prev => [...prev, ...data.data.urls]);
    } catch {}
    setUploading(false);
  }

  function set(field: keyof FormData, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function toggleService(val: string) {
    setForm((f) => ({
      ...f,
      services: f.services.includes(val)
        ? f.services.filter((s) => s !== val)
        : [...f.services, val],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.services.length === 0) { setError("Sélectionnez au moins un service."); return; }
    setLoading(true); setError("");

    try {
      const res = await fetch("/api/studio/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          eventDate: new Date(form.eventDate).toISOString(),
          guestCount: form.guestCount ? parseInt(form.guestCount) : undefined,
          attachments,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de la soumission");

      const servicesLabels = form.services.map(v => SERVICES_LIST.find(s => s.value === v)?.label ?? v).join(", ");
      const timeSlotLabel = TIME_SLOTS.find(t => t.value === form.eventTimeSlot)?.label ?? form.eventTimeSlot;

      const adminMsg = encodeURIComponent(
        `🎬 *NOUVELLE RÉSERVATION STUDIO+*\n\n` +
        `👤 *Client :* ${form.clientFirstName} ${form.clientLastName}\n` +
        `📞 *Tél :* ${form.clientPhone}\n` +
        `📧 *Email :* ${form.clientEmail}\n\n` +
        `🎭 *Type :* ${form.eventType}\n` +
        `📆 *Date :* ${new Date(form.eventDate).toLocaleDateString("fr-FR")}\n` +
        `⏰ *Créneau :* ${timeSlotLabel}\n` +
        `⏱ *Durée :* ${form.eventDuration}\n` +
        `📍 *Lieu :* ${form.eventLocation}\n` +
        `👥 *Personnes :* ${form.guestCount || "Non précisé"}\n` +
        `🎯 *Services :* ${servicesLabels}\n` +
        `📝 *Description :* ${form.description || "Aucune"}\n\n` +
        `Réf: ${data.data?.reference ?? "—"}`
      );
      window.open(`https://wa.me/2250747722931?text=${adminMsg}`, "_blank");

      const clientMsg = encodeURIComponent(
        `🎬 *HBL Studio+ — Récapitulatif de votre réservation*\n\n` +
        `Bonjour ${form.clientFirstName} ${form.clientLastName},\n\n` +
        `Votre demande de réservation a bien été enregistrée !\n\n` +
        `🎭 *Type :* ${form.eventType}\n` +
        `📆 *Date :* ${new Date(form.eventDate).toLocaleDateString("fr-FR")}\n` +
        `⏰ *Créneau :* ${timeSlotLabel}\n` +
        `⏱ *Durée :* ${form.eventDuration}\n` +
        `📍 *Lieu :* ${form.eventLocation}\n` +
        `👥 *Personnes :* ${form.guestCount || "Non précisé"}\n` +
        `🎯 *Services :* ${servicesLabels}\n` +
        `📝 *Description :* ${form.description || "Aucune"}\n\n` +
        `Notre équipe vous contactera sous 24-48h avec un devis détaillé.\n\n` +
        `📞 CÔTIÈRE MEDIA GROUP\n` +
        `07 47 72 29 31`
      );
      const phone = (form.clientWhatsapp || form.clientPhone).replace(/\s/g, "");
      // Ouvrir WhatsApp client après 2 secondes
      setTimeout(() => {
        window.open(`https://wa.me/${phone}?text=${clientMsg}`, "_blank");
      }, 2000);
      (window as any)._clientWhatsApp = `https://wa.me/${phone}?text=${clientMsg}`;

      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
        <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-[#0a1628] mb-2">Demande envoyée !</h3>
        <p className="text-gray-500 mb-6">Nous avons bien reçu votre demande. Notre équipe vous contactera sous 24-48h avec un devis détaillé.</p>
        <a href={(window as any)._clientWhatsApp} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold px-6 py-3 rounded-xl transition-colors">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Envoyer ma confirmation WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 md:p-8 shadow-sm space-y-6">

      {/* Infos client */}
      <div>
        <h3 className="font-semibold text-[#0a1628] mb-4 pb-2 border-b">Vos informations</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { field: "clientFirstName" as const, label: "Prénom *", placeholder: "Jean" },
            { field: "clientLastName" as const, label: "Nom *", placeholder: "Kouamé" },
            { field: "clientEmail" as const, label: "Email *", placeholder: "jean@email.com", type: "email" },
            { field: "clientPhone" as const, label: "Téléphone *", placeholder: "07 XX XX XX XX" },
            { field: "clientWhatsapp" as const, label: "WhatsApp", placeholder: "07 XX XX XX XX" },
          ].map(({ field, label, placeholder, type }) => (
            <div key={field} className={field === "clientEmail" ? "sm:col-span-2" : ""}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input type={type ?? "text"} value={form[field]} onChange={(e) => set(field, e.target.value)}
                placeholder={placeholder} required={label.includes("*")}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent" />
            </div>
          ))}
        </div>
      </div>

      {/* Détails événement */}
      <div>
        <h3 className="font-semibold text-[#0a1628] mb-4 pb-2 border-b">Détails de l'événement</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type d'événement *</label>
            <select value={form.eventType} onChange={(e) => set("eventType", e.target.value)} required
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]">
              <option value="">Sélectionner...</option>
              {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date de l'événement *</label>
            <input type="date" value={form.eventDate} onChange={(e) => set("eventDate", e.target.value)} required
              min={new Date().toISOString().split("T")[0]}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
            {/* Calendrier de disponibilité */}
            <div className="mt-3">
              <AvailabilityCalendar
                apiUrl="/api/studio/calendar"
                selectedDate={form.eventDate}
                onDateSelect={(date) => set("eventDate", date)}
                label="Disponibilités Studio+"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Créneau horaire *</label>
            <select value={form.eventTimeSlot} onChange={(e) => set("eventTimeSlot", e.target.value)} required
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]">
              <option value="">Sélectionner...</option>
              {TIME_SLOTS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Durée *</label>
            <select value={form.eventDuration} onChange={(e) => set("eventDuration", e.target.value)} required
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]">
              <option value="">Sélectionner...</option>
              {DURATIONS.map((d) => <option key={d} value={d}>{d === "journee" ? "Journée complète" : d}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Lieu de l'événement *</label>
            <input type="text" value={form.eventLocation} onChange={(e) => set("eventLocation", e.target.value)}
              placeholder="Adresse ou nom du lieu" required
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de personnes</label>
            <input type="number" value={form.guestCount} onChange={(e) => set("guestCount", e.target.value)}
              placeholder="Ex: 150" min="1"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
          </div>
        </div>
      </div>

      {/* Services */}
      <div>
        <h3 className="font-semibold text-[#0a1628] mb-4 pb-2 border-b">Services souhaités *</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SERVICES_LIST.map((s) => (
            <label key={s.value} className={cn(
              "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
              form.services.includes(s.value)
                ? "border-[#c9a84c] bg-[#c9a84c]/5"
                : "border-gray-200 hover:border-gray-300"
            )}>
              <input type="checkbox" checked={form.services.includes(s.value)}
                onChange={() => toggleService(s.value)} className="accent-[#c9a84c]" />
              <span className="text-sm text-gray-700">{s.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Tarif indicatif en temps réel */}
      {form.services.length > 0 && (
        <div className="bg-[#f0f9ff] border border-[#bae6fd] rounded-xl p-4">
          <p className="text-sm font-semibold text-[#0c4a6e] mb-1">Estimation tarifaire indicative</p>
          <p className="text-2xl font-black text-[#0c4a6e]">
            {priceMin.toLocaleString("fr-FR")} — {priceMax.toLocaleString("fr-FR")} FCFA
          </p>
          <p className="text-xs text-gray-500 mt-1">* Tarif indicatif — devis définitif après étude de votre demande sous 24-48h</p>
        </div>
      )}

      {/* Upload documents */}
      <div>
        <h3 className="font-semibold text-[#0a1628] mb-4 pb-2 border-b">Documents joints (optionnel)</h3>
        <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" multiple className="hidden"
          onChange={e => handleFileUpload(e.target.files)} />
        <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
          className="flex items-center gap-2 border-2 border-dashed border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-500 hover:border-[#c9a84c] hover:text-[#c9a84c] transition-colors w-full justify-center disabled:opacity-60">
          <Upload size={16} />
          {uploading ? "Envoi en cours..." : "Joindre un cahier des charges, plan, références (PDF, DOC, images — max 10MB)"}
        </button>
        {attachments.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {attachments.map((url, i) => (
              <div key={i} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs">
                <span className="text-gray-600 truncate max-w-[150px]">{url.split("/").pop()}</span>
                <button type="button" onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))}
                  className="text-red-400 hover:text-red-600"><X size={12} /></button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description complémentaire</label>
        <textarea value={form.description} onChange={(e) => set("description", e.target.value)}
          rows={3} maxLength={500} placeholder="Précisez vos attentes, le style souhaité..."
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c] resize-none" />
        <p className="text-xs text-gray-400 mt-1">{form.description.length}/500</p>
      </div>

      {error && <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-lg">{error}</p>}

      <button type="submit" disabled={loading}
        className="btn-primary w-full justify-center text-base py-3.5 disabled:opacity-60">
        {loading ? <><Loader2 size={18} className="animate-spin" /> Envoi en cours...</> : "Envoyer ma demande de réservation"}
      </button>

      <p className="text-xs text-gray-400 text-center">
        Réponse sous 24-48h · Devis gratuit et sans engagement
      </p>
    </form>
  );
}

