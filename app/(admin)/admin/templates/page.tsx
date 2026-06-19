"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Mail, Save, RotateCcw, CheckCircle } from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";

type Template = { key: string; label: string; subject: string; content: string; isCustom: boolean };

const VARIABLES = ["{{clientName}}", "{{service}}", "{{date}}", "{{montant}}", "{{reference}}"];


export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selected, setSelected] = useState<Template | null>(null);
  const [form, setForm] = useState({ subject: "", content: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/email-templates")
      .then(r => r.json())
      .then(d => {
        setTemplates(d.data ?? []);
        if (d.data?.length > 0) {
          setSelected(d.data[0]);
          setForm({ subject: d.data[0].subject, content: d.data[0].content });
        }
      });
  }, []);

  function selectTemplate(t: Template) {
    setSelected(t);
    setForm({ subject: t.subject, content: t.content });
    setSaved(false);
  }

  async function saveTemplate() {
    if (!selected) return;
    setSaving(true);
    await fetch("/api/admin/email-templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: selected.key, subject: form.subject, content: form.content }),
    });
    setTemplates(prev => prev.map(t => t.key === selected.key ? { ...t, ...form, isCustom: true } : t));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function insertVariable(v: string) {
    setForm(f => ({ ...f, content: f.content + v }));
  }

  function previewWhatsApp() {
    const msg = encodeURIComponent(form.content
      .replace("{{clientName}}", "Jean Kouame")
      .replace("{{service}}", "Studio+")
      .replace("{{date}}", "20/04/2026")
      .replace("{{montant}}", "150 000")
      .replace("{{reference}}", "STU-001")
    );
    window.open(`https://wa.me/2250747722931?text=${msg}`, "_blank");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <Mail size={20} className="text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#0c4a6e]">Templates de messages</h1>
            <p className="text-gray-500 text-sm">Personnalisez les messages WhatsApp envoyÃ©s aux clients</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Liste des templates */}
          <div className="space-y-2">
            {templates.map(t => (
              <button key={t.key} onClick={() => selectTemplate(t)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${selected?.key === t.key ? "border-[#0c4a6e] bg-[#f0f9ff]" : "border-gray-200 bg-white hover:border-gray-300"}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm text-[#0c4a6e]">{t.label}</span>
                  {t.isCustom && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">ModifiÃ©</span>}
                </div>
                <p className="text-xs text-gray-500 truncate">{t.subject}</p>
              </button>
            ))}
          </div>

          {/* Ã‰diteur */}
          {selected && (
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-[#0c4a6e]">{selected.label}</h2>
                <div className="flex gap-2">
                  <button onClick={previewWhatsApp}
                    className="flex items-center gap-1.5 text-xs font-semibold text-green-600 border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-50 transition-colors">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    Tester WhatsApp
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Sujet (email)</label>
                <input type="text" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-gray-700">Contenu du message</label>
                  <div className="flex gap-1 flex-wrap">
                    {VARIABLES.map(v => (
                      <button key={v} type="button" onClick={() => insertVariable(v)}
                        className="text-[10px] bg-[#f0f9ff] text-[#0c4a6e] border border-[#bae6fd] px-2 py-0.5 rounded font-mono hover:bg-[#e0f2fe] transition-colors">
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
                <textarea rows={10} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8] resize-none font-mono" />
                <p className="text-xs text-gray-400 mt-1">Cliquez sur une variable pour l'insÃ©rer dans le message</p>
              </div>

              {/* AperÃ§u */}
              <div className="bg-[#dcf8c6] rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-600 mb-2">AperÃ§u WhatsApp</p>
                <p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">
                  {form.content
                    .replace("{{clientName}}", "Jean Kouame")
                    .replace("{{service}}", "Studio+")
                    .replace("{{date}}", "20/04/2026")
                    .replace("{{montant}}", "150 000")
                    .replace("{{reference}}", "STU-001")}
                </p>
              </div>

              <div className="flex gap-3">
                <button onClick={saveTemplate} disabled={saving}
                  className="flex items-center gap-2 bg-[#c9a84c] hover:bg-[#b8973b] text-white font-bold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-60 text-sm">
                  {saved ? <CheckCircle size={15} /> : saving ? <Save size={15} className="animate-pulse" /> : <Save size={15} />}
                  {saved ? "SauvegardÃ© !" : saving ? "Sauvegarde..." : "Sauvegarder"}
                </button>
                <button onClick={() => setForm({ subject: selected.subject, content: selected.content })}
                  className="flex items-center gap-2 border border-gray-200 text-gray-600 font-semibold px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm">
                  <RotateCcw size={14} /> RÃ©initialiser
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



