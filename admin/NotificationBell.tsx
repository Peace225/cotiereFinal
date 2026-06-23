"use client";
import { useEffect, useState, useRef } from "react";
import { Bell, X, CheckCheck } from "lucide-react";

type Notification = {
  id: string; 
  subject: string; 
  content: string; 
  isRead: boolean; 
  createdAt: string;
  type: string;
};

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  async function load() {
    try {
      const res = await fetch("/api/admin/notifications", {
        method: "GET",
        // Envoi du cookie uniquement sur le même domaine (idéal pour Next.js)
        credentials: "same-origin", 
      });

      if (res.status === 401 || res.status === 403) {
        console.warn("Session invalide, impossible de charger les notifications.");
        return; // Arrêt silencieux sans crasher
      }

      if (!res.ok) throw new Error("Erreur réseau");

      const data = await res.json();
      setNotifications(data.data?.notifications ?? []);
      setUnread(data.data?.unreadCount ?? 0);
    } catch (error) {
      console.error("Erreur lors du chargement des notifications:", error);
    }
  }

  async function markAllRead() {
    try {
      const res = await fetch("/api/admin/notifications", { 
        method: "PATCH",
        credentials: "same-origin", 
      });
      
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnread(0);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour des notifications:", error);
    }
  }

  useEffect(() => {
    load();
    // 🛑 INTERVAL DÉSACTIVÉ TEMPORAIREMENT pour éviter le spam d'erreurs 401
    // const interval = setInterval(load, 30000); 
    // return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)}
        className="relative p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
        <Bell size={18} />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="font-bold text-[#0c4a6e] text-sm">Notifications</h3>
            <div className="flex items-center gap-2">
              {unread > 0 && (
                <button onClick={markAllRead} className="text-xs text-[#38bdf8] hover:text-[#0c4a6e] flex items-center gap-1 font-medium">
                  <CheckCheck size={13} /> Tout lire
                </button>
              )}
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-gray-400 text-sm">Aucune notification</div>
            ) : (
              notifications.map(n => (
                <div key={n.id} className={`px-4 py-3 border-b border-gray-50 last:border-0 ${!n.isRead ? "bg-blue-50/50" : ""}`}>
                  <div className="flex items-start gap-2">
                    {!n.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 shrink-0" />}
                    <div className={!n.isRead ? "" : "ml-4"}>
                      <p className="text-xs font-semibold text-[#0c4a6e]">{n.subject}</p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.content}</p>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {new Date(n.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}