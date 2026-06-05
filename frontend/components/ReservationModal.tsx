"use client";
import { useState } from "react";
import { X, ArrowRight } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  details: string;
  adminPhone?: string;
  pageUrl?: string;
};

export default function ReservationModal({ isOpen, onClose, title, details, adminPhone = "2250747722931", pageUrl }: Props) {
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", email: "", date: "", message: "" });
  const [countryCode, setCountryCode] = useState("225");
  const [sent, setSent] = useState(false);
  const [clientUrl, setClientUrl] = useState("");

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Sauvegarder en base pour l'admin
    try {
      await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientFirstName: form.firstName,
          clientLastName: form.lastName,
          clientPhone: form.phone,
          clientEmail: form.email,
          eventDate: form.date ? new Date(form.date).toISOString() : undefined,
          message: form.message,
          serviceTitle: title,
          serviceDetails: details,
          pageUrl: typeof window !== "undefined" ? window.location.href : undefined,
        }),
      });
    } catch {}

    const msg = encodeURIComponent(
      `*NOUVELLE RESERVATION - ${title}*\n\n` +
      `*Client :* ${form.firstName} ${form.lastName}\n` +
      `*Tel :* ${form.phone}\n` +
      `*Email :* ${form.email}\n` +
      `*Date souhaitee :* ${form.date || "Non precisee"}\n\n` +
      `*Service :* ${details}\n` +
      `*Message :* ${form.message || "Aucun"}\n\n` +
      `*Voir sur le site :* ${typeof window !== "undefined" ? window.location.href : ""}\n\n` +
      `-- CÔTIÈRE MEDIA GROUP\n1er site officiel des villes et villages du littoral ivoirien\nTel: 07 47 72 29 31`
    );
    // Ouvrir WhatsApp admin
    window.open(`https://wa.me/${adminPhone}?text=${msg}`, "_blank");

    // Stocker le message client pour affichage
    const clientMsg = encodeURIComponent(
      `*Confirmation de reservation CÔTIÈRE*\n\n` +
      `Bonjour ${form.firstName} ${form.lastName},\n\n` +
      `Votre demande de reservation pour *${title}* a bien ete envoyee !\n\n` +
      `Date souhaitee : ${form.date || "Non precisee"}\n` +
      `Service : ${details}\n\n` +
      (pageUrl ? `Voir sur le site : ${pageUrl}\n\n` : "") +
      `Notre equipe vous contactera sous 24h.\n` +
      `-- CÔTIÈRE MEDIA GROUP\n1er site officiel des villes et villages du littoral ivoirien\nTel: 07 47 72 29 31`
    );
    // Numéro international : on nettoie puis on assemble avec l'indicatif
    // Gère : 0708241826 / +2250708241826 / 00225...
    let rawPhone = form.phone.replace(/[\s\-().+]/g, "");
    if (rawPhone.startsWith("00")) rawPhone = rawPhone.slice(2);
    // Si le numéro contient déjà l'indicatif pays, on le garde tel quel
    const clientPhone = rawPhone.startsWith(countryCode)
      ? rawPhone
      : countryCode + rawPhone;
    setClientUrl(`https://wa.me/${clientPhone}?text=${clientMsg}`);

    setSent(true);
  }

  function handleClose() {
    setSent(false);
    setClientUrl("");
    setCountryCode("225");
    setForm({ firstName: "", lastName: "", phone: "", email: "", date: "", message: "" });
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center sm:p-4">
      <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h3 className="font-bold text-[#0c4a6e] text-lg">Réserver</h3>
            <p className="text-gray-500 text-sm">{title}</p>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        {sent ? (
          <div className="p-6 sm:p-8 text-center overflow-y-auto">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8 text-green-500">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h4 className="font-bold text-[#0c4a6e] text-lg mb-2">Demande envoyée !</h4>
            <p className="text-gray-500 text-sm mb-6">L'admin a été notifié. Cliquez ci-dessous pour recevoir votre confirmation.</p>
            <div className="flex flex-col gap-3">
              <a href={clientUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold py-3 rounded-xl transition-colors">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Recevoir ma confirmation WhatsApp
              </a>
              <button onClick={handleClose} className="border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors">Fermer</button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-5 py-4 space-y-3 overflow-y-auto">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Prénom *</label>
                <input required type="text" placeholder="Jean" value={form.firstName}
                  onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Nom *</label>
                <input required type="text" placeholder="Kouamé" value={form.lastName}
                  onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Téléphone / WhatsApp *</label>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={e => setCountryCode(e.target.value)}
                  className="border border-gray-200 rounded-xl px-2 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8] bg-white shrink-0"
                >
                  <option value="225">CI +225</option>
                  <option value="221">SN +221</option>
                  <option value="223">ML +223</option>
                  <option value="226">BF +226</option>
                  <option value="228">TG +228</option>
                  <option value="229">BJ +229</option>
                  <option value="237">CM +237</option>
                  <option value="33">FR +33</option>
                  <option value="1">US +1</option>
                </select>
                <input required type="tel" placeholder="07 08 24 18 26" value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" />
              </div>
              <p className="text-xs text-gray-400 mt-1">Saisissez votre numéro local (ex: 07 08 24 18 26)</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
              <input type="email" placeholder="jean@email.com" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Date souhaitée</label>
              <input type="date" value={form.date} min={new Date().toISOString().split("T")[0]}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Message (optionnel)</label>
              <textarea rows={2} placeholder="Précisions, demandes particulières..." value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8] resize-none" />
            </div>
            <button type="submit" className="btn-primary w-full justify-center">
              Envoyer ma réservation <ArrowRight size={16} />
            </button>
            <p className="text-xs text-gray-400 text-center">Réponse sous 24h · Gratuit et sans engagement</p>
          </form>
        )}
      </div>
    </div>
  );
}

