"use client";
import { useState } from "react";
import { X, ArrowRight, CheckCircle, Smartphone } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  serviceLabel: string;
  clientName?: string;
  clientPhone?: string;
  bookingId?: string;
  bookingType?: "studio" | "excursion" | "event" | "hotel" | "music";
};

const METHODS = [
  { id: "ORANGE_MONEY", label: "Orange Money", color: "bg-orange-500" },
  { id: "MTN_MONEY",    label: "MTN MoMo",     color: "bg-yellow-400" },
  { id: "WAVE",         label: "Wave",          color: "bg-blue-500" },
  { id: "MOOV_MONEY",   label: "Moov Money",    color: "bg-green-500" },
  { id: "CASH",         label: "Espèces",       color: "bg-gray-500" },
];

export default function PaymentModal({ isOpen, onClose, amount, serviceLabel, clientName, clientPhone, bookingId, bookingType }: Props) {
  const [method, setMethod] = useState("");
  const [phone, setPhone] = useState(clientPhone ?? "");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [adminUrl, setAdminUrl] = useState("");

  if (!isOpen) return null;

  async function handlePay() {
    if (!method) return;
    setLoading(true);
    try {
      const body: any = {
        amount,
        method,
        phoneNumber: phone,
        clientName,
        clientPhone: phone,
        serviceLabel,
      };
      if (bookingId && bookingType) {
        const key = { studio: "studioBookingId", excursion: "excursionBookingId", event: "eventRequestId", hotel: "hotelBookingId", music: "musicBookingId" }[bookingType];
        body[key] = bookingId;
      }

      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        setAdminUrl(data.data?.adminWhatsAppUrl ?? "");
        // Ouvrir WhatsApp admin automatiquement
        if (data.data?.adminWhatsAppUrl) {
          window.open(data.data.adminWhatsAppUrl, "_blank");
        }
        setDone(true);
      }
    } catch {}
    setLoading(false);
  }

  function handleClose() {
    setDone(false);
    setMethod("");
    setPhone(clientPhone ?? "");
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center sm:p-4">
      <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h3 className="font-bold text-[#0c4a6e] text-lg">Paiement</h3>
            <p className="text-gray-500 text-sm">{serviceLabel}</p>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        {done ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-500" />
            </div>
            <h4 className="font-bold text-[#0c4a6e] text-lg mb-2">Demande enregistree !</h4>
            <p className="text-gray-500 text-sm mb-6">
              Votre demande de paiement a ete transmise. L admin CÔTIÈRE va confirmer la reception sous peu.
            </p>
            <div className="flex flex-col gap-3">
              {adminUrl && (
                <a href={adminUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold py-3 rounded-xl transition-colors">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Notifier l admin WhatsApp
                </a>
              )}
              <button onClick={handleClose} className="border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors">Fermer</button>
            </div>
          </div>
        ) : (
          <div className="px-5 py-4 space-y-4 overflow-y-auto">
            <div className="bg-[#f0f9ff] rounded-xl p-4 flex items-center justify-between">
              <span className="text-gray-600 text-sm">Montant a payer</span>
              <span className="text-2xl font-black text-[#0c4a6e]">{amount.toLocaleString("fr-FR")} FCFA</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Choisir le mode de paiement *</label>
              <div className="grid grid-cols-2 gap-2">
                {METHODS.map(m => (
                  <button key={m.id} type="button" onClick={() => setMethod(m.id)}
                    className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-sm font-semibold ${method === m.id ? "border-[#0c4a6e] bg-[#f0f9ff] text-[#0c4a6e]" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                    <span className={`w-3 h-3 rounded-full shrink-0 ${m.color}`} /> {m.label}
                  </button>
                ))}
              </div>
            </div>

            {method && method !== "CASH" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Smartphone size={14} className="inline mr-1" />
                  Numero {METHODS.find(m => m.id === method)?.label} *
                </label>
                <input type="tel" placeholder="07 XX XX XX XX" value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" />
                <p className="text-xs text-gray-400 mt-1">Le numero depuis lequel vous allez effectuer le paiement</p>
              </div>
            )}

            {method === "CASH" && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-700">
                Paiement en especes a effectuer directement a nos bureaux ou lors de la prestation.
              </div>
            )}

            <button onClick={handlePay} disabled={!method || loading || (!phone && method !== "CASH")}
              className="btn-primary w-full justify-center disabled:opacity-50">
              {loading ? "Traitement..." : "Confirmer le paiement"} <ArrowRight size={16} />
            </button>
            <p className="text-xs text-gray-400 text-center">Paiement securise - L admin confirmera la reception</p>
          </div>
        )}
      </div>
    </div>
  );
}
