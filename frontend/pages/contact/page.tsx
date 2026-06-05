"use client";
import { useState } from "react";
import { Phone, Mail, MapPin, Clock, MessageCircle, CheckCircle, ArrowRight } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const msg = encodeURIComponent(
        `MESSAGE DEPUIS LE SITE\n\n` +
        `*Nom:* ${form.firstName} ${form.lastName}\n` +
        `*Email:* ${form.email || "Non fourni"}\n` +
        `*Sujet:* ${form.subject}\n\n` +
        `*Message:*\n${form.message}\n\n` +
        `🌊 CÔTIERE MÉDIA GROUP\n1er site officiel des villes et villages du littoral ivoirien`
      );
      window.open(`https://wa.me/2250747722931?text=${msg}`, "_blank");
      setSent(true);
    } catch {}
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#f0f9ff]">
      <section className="relative text-white py-16 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1596524430615-b46475ddff6e?w=1600&q=80" alt="Contact" className="w-full h-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-3">Contactez-nous</h1>
          <p className="text-gray-100">Notre équipe est disponible pour répondre à toutes vos questions.</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Infos contact */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-bold text-[#0a1628] text-lg mb-5">Nos coordonnées</h2>
                <div className="space-y-4">
                  {[
                    { icon: Phone, label: "07 47 72 29 31", sub: "M. HONORABLE BONIFACE LOBA", href: "tel:+2250747722931" },
                    { icon: MapPin, label: "Côte d'Ivoire — Littoral", sub: "Zone côtière ivoirienne", href: null },
                    { icon: Clock, label: "Lun — Sam : 8h — 18h", sub: "Réponse sous 24h", href: null },
                    { icon: Mail, label: "contact@cotiere.ci", sub: "Email professionnel", href: "mailto:contact@cotiere.ci" },
                  ].map(({ icon: Icon, label, sub, href }) => (
                    <div key={sub} className="flex items-start gap-3">
                      <div className="w-9 h-9 bg-[#c9a84c]/10 text-[#c9a84c] rounded-lg flex items-center justify-center shrink-0">
                        <Icon size={16} />
                      </div>
                      <div>
                        {href ? (
                          <a href={href} className="text-sm font-medium text-[#0a1628] hover:text-[#c9a84c] transition-colors">{label}</a>
                        ) : (
                          <p className="text-sm font-medium text-[#0a1628]">{label}</p>
                        )}
                        <p className="text-xs text-gray-500">{sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <a href="https://wa.me/2250747722931" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 bg-[#25D366] text-white rounded-2xl p-5 shadow-sm hover:bg-[#1ebe5d] transition-colors">
                <MessageCircle size={28} fill="white" />
                <div>
                  <p className="font-semibold">Écrire sur WhatsApp</p>
                  <p className="text-sm text-green-100">Réponse rapide garantie</p>
                </div>
              </a>
            </div>

            {/* Formulaire contact */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-bold text-[#0a1628] text-lg mb-5">Envoyer un message</h2>

              {sent ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-green-500" />
                  </div>
                  <h3 className="font-bold text-[#0c4a6e] text-lg mb-2">Message envoyé !</h3>
                  <p className="text-gray-500 text-sm mb-4">Votre message a été transmis via WhatsApp. Notre équipe vous répondra sous 24h.</p>
                  <button onClick={() => { setSent(false); setForm({ firstName: "", lastName: "", email: "", subject: "", message: "" }); }}
                    className="text-[#38bdf8] text-sm font-semibold hover:underline">
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
                      <input required type="text" placeholder="Jean" value={form.firstName}
                        onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                      <input required type="text" placeholder="Kouamé" value={form.lastName}
                        onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" placeholder="jean@email.com" value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sujet *</label>
                    <input required type="text" placeholder="Demande d'information" value={form.subject}
                      onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                    <textarea required rows={4} placeholder="Votre message..." value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c] resize-none" />
                  </div>
                  <button type="submit" disabled={loading}
                    className="btn-primary w-full justify-center disabled:opacity-60">
                    {loading ? "Envoi..." : <><span>Envoyer le message</span><ArrowRight size={16} /></>}
                  </button>
                  <p className="text-xs text-gray-400 text-center">Le message sera transmis via WhatsApp</p>
                </form>
              )}
            </div>
          </div>

          {/* Carte Google Maps */}
          <div className="mt-10 bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <MapPin size={18} className="text-[#c9a84c]" />
              <h2 className="font-bold text-[#0a1628]">Nous trouver</h2>
              <span className="text-sm text-gray-400 ml-1">— Côte d'Ivoire, Littoral</span>
            </div>
            <div className="relative w-full h-72">
              <iframe
                title="CÔTIÈRE MEDIA GROUP — Localisation"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d254508.39280650617!2d-4.1!3d5.35!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfc1ea5311959121%3A0x3fe70ddce19221a6!2sAbidjan%2C%20C%C3%B4te%20d'Ivoire!5e0!3m2!1sfr!2sfr!4v1700000000000!5m2!1sfr!2sfr"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              />
            </div>
            <div className="px-6 py-3 bg-gray-50 flex items-center justify-between">
              <p className="text-xs text-gray-500">Zone côtière ivoirienne — Grand-Lahou, Jacqueville, Assinie</p>
              <a
                href="https://maps.google.com/?q=Cote+d+Ivoire+Littoral+Grand-Lahou"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#38bdf8] hover:underline font-medium flex items-center gap-1"
              >
                Ouvrir dans Maps <ArrowRight size={12} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

