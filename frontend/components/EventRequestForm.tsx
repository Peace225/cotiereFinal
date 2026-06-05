"use client";
import { useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const EVENT_TYPES = ["Mariage", "Anniversaire", "Conférence", "Gala", "Séminaire", "Concert", "Baptême", "Autre"];
const SERVICES_LIST = [
  { value: "decoration", label: "Décoration & scénographie" },
  { value: "traiteur", label: "Traiteur & restauration" },
  { value: "sono", label: "Sonorisation & éclairage" },
  { value: "securite", label: "Sécurité événementielle" },
  { value: "hotesses", label: "Hôtesses & accueil" },
  { value: "animation", label: "Animation & spectacles" },
];

const WA_ICON = <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>;

type FormData = {
  clientFirstName: string; clientLastName: string;
  clientEmail: string; clientPhone: string;
  eventType: string; eventDate: string; eventLocation: string;
  guestCount: string; budget: string; services: string[]; description: string;
};

const initial: FormData = {
  clientFirstName: "", clientLastName: "", clientEmail: "", clientPhone: "",
  eventType: "", eventDate: "", eventLocation: "", guestCount: "", budget: "",
  services: [], description: "",
};

export default function EventRequestForm() {
  const [form, setForm] = useState<FormData>(initial);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [urls, setUrls] = useState<{ admin: string; client: string } | null>(null);

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
      const res = await fetch("/api/events/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          eventDate: new Date(form.eventDate).toISOString(),
          guestCount: parseInt(form.guestCount),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de la soumission");

      const servicesLabels = form.services.map(v => SERVICES_LIST.find(s => s.value === v)?.label ?? v).join(", ");
      const recap =
        `📅 *Type :* ${form.eventType}\n` +
        `📆 *Date :* ${new Date(form.eventDate).toLocaleDateString("fr-FR")}\n` +
        `📍 *Lieu :* ${form.eventLocation}\n` +
        `👥 *Invités :* ${form.guestCount}\n` +
        `💰 *Budget :* ${form.budget || "Non précisé"}\n` +
        `🎯 *Services :* ${servicesLabels}\n` +
        `📝 *Description :* ${form.description || "Aucune"}`;

      const adminMsg = encodeURIComponent(
        `🎉 *NOUVELLE DEMANDE ÉVÉNEMENT*\n\n` +
        `👤 *Client :* ${form.clientFirstName} ${form.clientLastName}\n` +
        `📞 *Tél :* ${form.clientPhone}\n` +
        `📧 *Email :* ${form.clientEmail}\n\n` +
        recap + `\n\nRéf: ${data.data?.reference ?? "—"}`
      );

      const clientMsg = encodeURIComponent(
        `🎉 *CÔTIÈRE EVENT — Récapitulatif de votre demande*\n\n` +
        `Bonjour ${form.clientFirstName} ${form.clientLastName},\n\n` +
        `Votre demande a bien été enregistrée !\n\n` +
        recap + `\n\nNotre équipe vous contactera sous 24h.\n📞 CÔTIÈRE MEDIA GROUP — 07 47 72 29 31`
      );

      const adminUrl = `https://wa.me/2250747722931?text=${adminMsg}`;
      const clientUrl = `https://wa.me/${form.clientPhone.replace(/\s/g, "")}?text=${clientMsg}`;

      setUrls({ admin: adminUrl, client: clientUrl });
      setSuccess(true);
      // Ouvrir admin automatiquement
      window.open(adminUrl, "_blank");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  if (success && urls) {
    return (
      <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
        <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-[#0a1628] mb-2">Demande envoyée !</h3>
        <p className="text-gray-500 mb-6">Notre équipe vous contactera sous 24h avec un devis personnalisé.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href={urls.admin} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold px-5 py-3 rounded-xl transition-colors">
            {WA_ICON} Notifier l'admin
          </a>
          <a href={urls.client} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#0284c7] hover:bg-[#0369a1] text-white font-semibold px-5 py-3 rounded-xl transition-colors">
            {WA_ICON} Recevoir mon récapitulatif
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
      <div>
        <h3 className="font-semibold text-[#0a1628] mb-4 pb-2 border-b">Vos informations</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { field: "clientFirstName" as const, label: "Prénom *", placeholder: "Jean" },
            { field: "clientLastName" as const, label: "Nom *", placeholder: "Kouamé" },
            { field: "clientEmail" as const, label: "Email *", placeholder: "jean@email.com", type: "email" },
            { field: "clientPhone" as const, label: "Téléphone *", placeholder: "07 XX XX XX XX" },
          ].map(({ field, label, placeholder, type }) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input type={type ?? "text"} value={form[field]} onChange={(e) => set(field, e.target.value)}
                placeholder={placeholder} required={label.includes("*")}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
            </div>
          ))}
        </div>
      </div>

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
            <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
            <input type="date" value={form.eventDate} onChange={(e) => set("eventDate", e.target.value)} required
              min={new Date().toISOString().split("T")[0]}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Lieu *</label>
            <input type="text" value={form.eventLocation} onChange={(e) => set("eventLocation", e.target.value)}
              placeholder="Adresse ou nom du lieu" required
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre d'invités *</label>
            <input type="number" value={form.guestCount} onChange={(e) => set("guestCount", e.target.value)}
              placeholder="Ex: 200" min="1" required
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Budget approximatif</label>
            <input type="text" value={form.budget} onChange={(e) => set("budget", e.target.value)}
              placeholder="Ex: 500 000 — 1 000 000 FCFA"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-[#0a1628] mb-4 pb-2 border-b">Services souhaités *</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SERVICES_LIST.map((s) => (
            <label key={s.value} className={cn(
              "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
              form.services.includes(s.value) ? "border-[#c9a84c] bg-[#c9a84c]/5" : "border-gray-200 hover:border-gray-300"
            )}>
              <input type="checkbox" checked={form.services.includes(s.value)}
                onChange={() => toggleService(s.value)} className="accent-[#c9a84c]" />
              <span className="text-sm text-gray-700">{s.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description complémentaire</label>
        <textarea value={form.description} onChange={(e) => set("description", e.target.value)}
          rows={3} placeholder="Décrivez votre vision, vos attentes particulières..."
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c] resize-none" />
      </div>

      {error && <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-lg">{error}</p>}

      <button type="submit" disabled={loading}
        className="btn-primary w-full justify-center text-base py-3.5 disabled:opacity-60">
        {loading ? <><Loader2 size={18} className="animate-spin" /> Envoi en cours...</> : "Envoyer ma demande de devis"}
      </button>
      <p className="text-xs text-gray-400 text-center">Devis gratuit · Réponse sous 24h</p>
    </form>
  );
}

