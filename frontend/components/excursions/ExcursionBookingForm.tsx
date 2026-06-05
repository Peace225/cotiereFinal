"use client";
import { useState, useEffect } from "react";
import { X, ArrowRight, CheckCircle, Loader2, Plus, Minus, Users, Globe, Calendar } from "lucide-react";

type Option = { id: string; label: string; pricePerPerson: number };
type TimeSlot = { id: string; startTime: string; endTime: string };

type Excursion = {
  id: string;
  title: string;
  duration: string;
  priceAdult: number;
  priceChild: number;
  maxParticipants: number;
  options: Option[];
  timeSlots: TimeSlot[];
};

type Props = {
  excursion: Excursion;
  isOpen: boolean;
  onClose: () => void;
};

const LANGUAGES = [
  { value: "FR", label: "FR — Français" },
  { value: "EN", label: "EN — English" },
  { value: "ES", label: "ES — Español" },
  { value: "DE", label: "DE — Deutsch" },
  { value: "IT", label: "IT — Italiano" },
  { value: "PT", label: "PT — Português" },
];

export default function ExcursionBookingForm({ excursion, isOpen, onClose }: Props) {
  const [step, setStep] = useState(1); // 1: participants, 2: infos, 3: confirmation
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [guideLanguage, setGuideLanguage] = useState("FR");
  const [selectedOptions, setSelectedOptions] = useState<Record<string, boolean>>({});
  const [specialRequests, setSpecialRequests] = useState("");
  const [conditionsAccepted, setConditionsAccepted] = useState(false);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", nationality: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");

  // Calcul du total en temps réel
  const adultsTotal = adults * excursion.priceAdult;
  const childrenTotal = children * excursion.priceChild;
  const optionsTotal = excursion.options
    .filter(o => selectedOptions[o.id])
    .reduce((sum, o) => sum + o.pricePerPerson * (adults + children), 0);
  const total = adultsTotal + childrenTotal + optionsTotal;
  const deposit = Math.ceil(total * 0.3);

  function toggleOption(id: string) {
    setSelectedOptions(prev => ({ ...prev, [id]: !prev[id] }));
  }

  function handleClose() {
    setStep(1);
    setAdults(1);
    setChildren(0);
    setSelectedDate("");
    setSelectedSlot("");
    setGuideLanguage("FR");
    setSelectedOptions({});
    setSpecialRequests("");
    setConditionsAccepted(false);
    setForm({ firstName: "", lastName: "", email: "", phone: "", nationality: "" });
    setSuccess(false);
    setError("");
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!conditionsAccepted) { setError("Veuillez accepter les conditions d'annulation."); return; }
    if (!selectedDate) { setError("Veuillez sélectionner une date."); return; }

    setLoading(true);
    setError("");

    try {
      const isDefault = excursion.id.startsWith("default-");

      // Pour les destinations par défaut, utiliser l'API générique
      if (isDefault) {
        const body = {
          clientFirstName: form.firstName,
          clientLastName: form.lastName,
          clientPhone: form.phone,
          clientEmail: form.email,
          eventDate: new Date(selectedDate).toISOString(),
          message: `Voyage: ${excursion.title} | Adultes: ${adults} | Enfants: ${children} | Langue: ${guideLanguage}${specialRequests ? " | Notes: " + specialRequests : ""}`,
          serviceTitle: excursion.title,
          serviceDetails: `${excursion.duration} - ${excursion.priceAdult.toLocaleString()} FCFA/adulte`,
          pageUrl: typeof window !== "undefined" ? window.location.href : undefined,
        };
        await fetch("/api/reservations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        setReference("REF-" + Date.now().toString().slice(-6));
      } else {
      const body = {
        excursionId: excursion.id,
        clientFirstName: form.firstName,
        clientLastName: form.lastName,
        clientEmail: form.email,
        clientPhone: form.phone,
        clientNationality: form.nationality || undefined,
        bookingDate: selectedDate,
        timeSlot: selectedSlot || "matin",
        guideLanguage,
        adultsCount: adults,
        childrenCount: children,
        specialRequests: specialRequests || undefined,
        conditionsAccepted: true,
        selectedOptions: excursion.options
          .filter(o => selectedOptions[o.id])
          .map(o => ({
            optionId: o.id,
            label: o.label,
            pricePerPerson: o.pricePerPerson,
            quantity: adults + children,
          })),
      };

      const res = await fetch("/api/excursions/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de la réservation");

      setReference(data.data?.reference ?? "");
      }

      // Notification WhatsApp admin
      const optionsList = excursion.options
        .filter(o => selectedOptions[o.id])
        .map(o => `- ${o.label} (+${o.pricePerPerson.toLocaleString()} FCFA/pers)`)
        .join("\n");

      const ref = excursion.id.startsWith("default-") ? ("REF-" + Date.now().toString().slice(-6)) : (reference || "—");

      const adminMsg = encodeURIComponent(
        `NOUVELLE RESERVATION VOYAGE\n\n` +
        `Client : ${form.firstName} ${form.lastName}\n` +
        `Tel : ${form.phone}\n` +
        `Nationalite : ${form.nationality || "Non precisee"}\n\n` +
        `Voyage : ${excursion.title}\n` +
        `Date : ${new Date(selectedDate).toLocaleDateString("fr-FR")}\n` +
        `Creneau : ${selectedSlot || "Non precise"}\n` +
        `Langue guide : ${guideLanguage}\n` +
        `Adultes : ${adults} x ${excursion.priceAdult.toLocaleString()} = ${adultsTotal.toLocaleString()} FCFA\n` +
        `Enfants : ${children} x ${excursion.priceChild.toLocaleString()} = ${childrenTotal.toLocaleString()} FCFA\n` +
        (optionsList ? `Options :\n${optionsList}\n` : "") +
        `TOTAL : ${total.toLocaleString()} FCFA\n` +
        `Acompte (30%) : ${deposit.toLocaleString()} FCFA\n\n` +
        `Demandes : ${specialRequests || "Aucune"}\n` +
        `Ref : ${ref}\n\n` +
        `-- CÔTIÈRE MEDIA GROUP\n1er site officiel des villes et villages du littoral ivoirien\nTel: 07 47 72 29 31`
      );
      window.open(`https://wa.me/2250747722931?text=${adminMsg}`, "_blank");

      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center sm:p-4">
      <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[90vh] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h3 className="font-bold text-[#0c4a6e] text-lg">Réserver</h3>
            <p className="text-gray-500 text-sm truncate max-w-[280px]">{excursion.title}</p>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        {/* Steps indicator */}
        {!success && (
          <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-50 shrink-0">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step >= s ? "bg-[#c9a84c] text-white" : "bg-gray-100 text-gray-400"
                }`}>{s}</div>
                {s < 3 && <div className={`h-0.5 w-8 transition-all ${step > s ? "bg-[#c9a84c]" : "bg-gray-100"}`} />}
              </div>
            ))}
            <span className="text-xs text-gray-400 ml-2">
              {step === 1 ? "Participants & date" : step === 2 ? "Vos informations" : "Confirmation"}
            </span>
          </div>
        )}

        {/* Contenu */}
        <div className="overflow-y-auto flex-1">
          {success ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-500" />
              </div>
              <h4 className="font-bold text-[#0c4a6e] text-xl mb-2">Réservation confirmée !</h4>
              <p className="text-gray-500 text-sm mb-2">Référence : <span className="font-mono font-bold text-[#0c4a6e]">{reference}</span></p>
              <p className="text-gray-500 text-sm mb-6">Notre équipe vous contactera sous 24h pour finaliser les détails.</p>
              <div className="bg-[#f0f9ff] rounded-xl p-4 text-left mb-6 text-sm space-y-1">
                <p><span className="text-gray-500">Voyage :</span> <span className="font-semibold text-[#0c4a6e]">{excursion.title}</span></p>
                <p><span className="text-gray-500">Date :</span> <span className="font-semibold">{new Date(selectedDate).toLocaleDateString("fr-FR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}</span></p>
                <p><span className="text-gray-500">Participants :</span> <span className="font-semibold">{adults} adulte(s){children > 0 ? `, ${children} enfant(s)` : ""}</span></p>
                <p><span className="text-gray-500">Total :</span> <span className="font-bold text-[#c9a84c]">{total.toLocaleString()} FCFA</span></p>
                <p><span className="text-gray-500">Acompte (30%) :</span> <span className="font-semibold">{deposit.toLocaleString()} FCFA</span></p>
              </div>
              <button onClick={handleClose} className="btn-primary w-full justify-center">Fermer</button>
            </div>
          ) : step === 1 ? (
            <div className="p-5 space-y-5">
              {/* Date */}
              <div>
                <label className="block text-sm font-semibold text-[#0c4a6e] mb-2 flex items-center gap-2">
                  <Calendar size={15} /> Date du voyage *
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
                />
              </div>

              {/* Créneaux */}
              {excursion.timeSlots.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-[#0c4a6e] mb-2">Créneau horaire</label>
                  <div className="flex flex-wrap gap-2">
                    {excursion.timeSlots.map(ts => (
                      <button
                        key={ts.id}
                        type="button"
                        onClick={() => setSelectedSlot(`${ts.startTime}-${ts.endTime}`)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                          selectedSlot === `${ts.startTime}-${ts.endTime}`
                            ? "border-[#c9a84c] bg-[#c9a84c]/10 text-[#c9a84c]"
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        {ts.startTime} — {ts.endTime}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Participants */}
              <div>
                <label className="block text-sm font-semibold text-[#0c4a6e] mb-3 flex items-center gap-2">
                  <Users size={15} /> Participants
                </label>
                <div className="space-y-3">
                  {/* Adultes */}
                  <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                    <div>
                      <p className="font-medium text-sm text-[#0c4a6e]">Adultes</p>
                      <p className="text-xs text-gray-500">{excursion.priceAdult.toLocaleString()} FCFA / pers</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => setAdults(Math.max(1, adults - 1))}
                        className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-[#c9a84c] transition-colors">
                        <Minus size={14} />
                      </button>
                      <span className="font-bold text-[#0c4a6e] w-6 text-center">{adults}</span>
                      <button type="button" onClick={() => setAdults(Math.min(excursion.maxParticipants - children, adults + 1))}
                        className="w-8 h-8 rounded-full bg-[#c9a84c] text-white flex items-center justify-center hover:bg-[#b8973b] transition-colors">
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  {/* Enfants */}
                  <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                    <div>
                      <p className="font-medium text-sm text-[#0c4a6e]">Enfants <span className="text-xs text-gray-400">(- 12 ans)</span></p>
                      <p className="text-xs text-gray-500">{excursion.priceChild.toLocaleString()} FCFA / pers</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => setChildren(Math.max(0, children - 1))}
                        className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-[#c9a84c] transition-colors">
                        <Minus size={14} />
                      </button>
                      <span className="font-bold text-[#0c4a6e] w-6 text-center">{children}</span>
                      <button type="button" onClick={() => setChildren(Math.min(excursion.maxParticipants - adults, children + 1))}
                        className="w-8 h-8 rounded-full bg-[#c9a84c] text-white flex items-center justify-center hover:bg-[#b8973b] transition-colors">
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2">Max {excursion.maxParticipants} participants par voyage</p>
              </div>

              {/* Langue du guide */}
              <div>
                <label className="block text-sm font-semibold text-[#0c4a6e] mb-2 flex items-center gap-2">
                  <Globe size={15} /> Langue du guide
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang.value}
                      type="button"
                      onClick={() => setGuideLanguage(lang.value)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                        guideLanguage === lang.value
                          ? "border-[#c9a84c] bg-[#c9a84c]/10 text-[#c9a84c]"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Options */}
              {excursion.options.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-[#0c4a6e] mb-2">Options supplémentaires</label>
                  <div className="space-y-2">
                    {excursion.options.map(opt => (
                      <label key={opt.id} className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedOptions[opt.id] ? "border-[#c9a84c] bg-[#c9a84c]/5" : "border-gray-200 hover:border-gray-300"
                      }`}>
                        <div className="flex items-center gap-3">
                          <input type="checkbox" checked={!!selectedOptions[opt.id]} onChange={() => toggleOption(opt.id)}
                            className="accent-[#c9a84c]" />
                          <span className="text-sm text-gray-700">{opt.label}</span>
                        </div>
                        <span className="text-xs font-semibold text-[#c9a84c]">+{opt.pricePerPerson.toLocaleString()} FCFA/pers</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Récapitulatif prix */}
              <div className="bg-[#f0f9ff] border border-[#bae6fd] rounded-xl p-4">
                <p className="text-xs font-semibold text-[#0c4a6e] mb-2">Récapitulatif</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Adultes ({adults} × {excursion.priceAdult.toLocaleString()})</span>
                    <span className="font-semibold">{adultsTotal.toLocaleString()} FCFA</span>
                  </div>
                  {children > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Enfants ({children} × {excursion.priceChild.toLocaleString()})</span>
                      <span className="font-semibold">{childrenTotal.toLocaleString()} FCFA</span>
                    </div>
                  )}
                  {optionsTotal > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Options</span>
                      <span className="font-semibold">{optionsTotal.toLocaleString()} FCFA</span>
                    </div>
                  )}
                  <div className="border-t border-[#bae6fd] pt-2 mt-2 flex justify-between">
                    <span className="font-bold text-[#0c4a6e]">TOTAL</span>
                    <span className="font-black text-[#c9a84c] text-lg">{total.toLocaleString()} FCFA</span>
                  </div>
                  <p className="text-xs text-gray-400">Acompte requis (30%) : {deposit.toLocaleString()} FCFA</p>
                </div>
              </div>
            </div>
          ) : step === 2 ? (
            <form id="step2form" onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Prénom *</label>
                  <input required type="text" placeholder="Jean" value={form.firstName}
                    onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Nom *</label>
                  <input required type="text" placeholder="Kouamé" value={form.lastName}
                    onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Email *</label>
                <input required type="email" placeholder="jean@email.com" value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Téléphone / WhatsApp *</label>
                <input required type="tel" placeholder="07 XX XX XX XX" value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Nationalité</label>
                <input type="text" placeholder="Ivoirienne, Française..." value={form.nationality}
                  onChange={e => setForm(f => ({ ...f, nationality: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Demandes particulières</label>
                <textarea rows={2} placeholder="Allergies, mobilité réduite, régime alimentaire..."
                  value={specialRequests} onChange={e => setSpecialRequests(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c] resize-none" />
              </div>

              {/* Conditions */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={conditionsAccepted} onChange={e => setConditionsAccepted(e.target.checked)}
                  className="accent-[#c9a84c] mt-0.5 shrink-0" />
                <span className="text-xs text-gray-600">
                  J'ai lu et j'accepte les <span className="text-[#38bdf8] underline cursor-pointer">conditions d'annulation</span> :
                  remboursement intégral si annulation 48h avant, 50% si annulation 24h avant.
                </span>
              </label>

              {error && <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-lg">{error}</p>}
            </form>
          ) : null}
        </div>

        {/* Footer avec boutons */}
        {!success && (
          <div className="px-5 py-4 border-t border-gray-100 shrink-0 flex gap-3">
            {step > 1 && (
              <button onClick={() => setStep(s => s - 1)}
                className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                Retour
              </button>
            )}
            {step === 1 && (
              <button
                onClick={() => {
                  if (!selectedDate) { setError("Veuillez sélectionner une date."); return; }
                  setError("");
                  setStep(2);
                }}
                className="flex-1 btn-primary justify-center"
              >
                Continuer <ArrowRight size={16} />
              </button>
            )}
            {step === 2 && (
              <button
                type="submit"
                form="step2form"
                disabled={loading}
                className="flex-1 btn-primary justify-center disabled:opacity-60"
              >
                {loading ? <><Loader2 size={16} className="animate-spin" /> Réservation...</> : <>Confirmer la réservation <ArrowRight size={16} /></>}
              </button>
            )}
          </div>
        )}

        {error && step === 1 && (
          <p className="px-5 pb-3 text-red-500 text-xs">{error}</p>
        )}
      </div>
    </div>
  );
}

