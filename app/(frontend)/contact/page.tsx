"use client";

import React, { useState, useEffect } from "react";
import { Phone, Mail, MapPin, Clock, MessageCircle, CheckCircle, ArrowRight } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    
    const msg = encodeURIComponent(
      `MESSAGE DEPUIS LE SITE\n\n` +
      `*Nom:* ${form.firstName} ${form.lastName}\n` +
      `*Email:* ${form.email || "Non fourni"}\n` +
      `*Sujet:* ${form.subject}\n\n` +
      `*Message:*\n${form.message}\n\n` +
      `ðŸŒŠ CÃ”TIÃˆRE MÃ‰DIA GROUP`
    );
    
    window.open(`https://wa.me/2250747722931?text=${msg}`, "_blank");
    setSent(true);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#f0f9ff]">
      {/* ... Hero Section reste inchangÃ©e ... */}
      
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Infos contact ... (votre code existant) ... */}
            
            {/* Formulaire contact ... (votre code existant) ... */}
          </div>

          {/* Carte Google Maps corrigÃ©e */}
          {isMounted && (
            <div className="mt-10 bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <MapPin size={18} className="text-[#c9a84c]" />
                <h2 className="font-bold text-[#0a1628]">Nous trouver</h2>
              </div>
              <div className="relative w-full h-72">
                {/* Remplacez l'URL src par votre vrai lien d'intÃ©gration Google Maps */}
                <iframe
                  title="Localisation CÃ”TIÃˆRE MEDIA GROUP"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126848.435555... (votre code d'embed ici)"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  className="absolute inset-0"
                />
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

