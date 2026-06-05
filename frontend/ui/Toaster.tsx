"use client";
import { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";

type Toast = { id: string; message: string; type: "success" | "error" | "info" };

let addToastFn: ((toast: Omit<Toast, "id">) => void) | null = null;

export function toast(message: string, type: Toast["type"] = "info") {
  addToastFn?.({ message, type });
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    addToastFn = (t) => {
      const id = Math.random().toString(36).slice(2);
      setToasts(prev => [...prev, { ...t, id }]);
      setTimeout(() => setToasts(prev => prev.filter(x => x.id !== id)), 4000);
    };
    return () => { addToastFn = null; };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map(t => (
        <div key={t.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium min-w-[260px] max-w-sm animate-in slide-in-from-right-5 ${
          t.type === "success" ? "bg-green-500 text-white" :
          t.type === "error" ? "bg-red-500 text-white" :
          "bg-[#0c4a6e] text-white"
        }`}>
          {t.type === "success" && <CheckCircle size={16} className="shrink-0" />}
          {t.type === "error" && <XCircle size={16} className="shrink-0" />}
          {t.type === "info" && <AlertCircle size={16} className="shrink-0" />}
          <span className="flex-1">{t.message}</span>
          <button onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))} className="opacity-70 hover:opacity-100">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
