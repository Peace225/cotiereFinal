
"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Bell,
  X,
  CheckCheck,
  Loader2,
  RefreshCw,
  ShieldAlert,
} from "lucide-react";

type Notification = {
  id: string;
  subject: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  type: string;
};

type NotificationsResponse = {
  data?: {
    notifications?: Notification[];
    unreadCount?: number;
  };
  error?: string;
};

export default function NotificationBell() {
  const [open, setOpen] = useState(false);

  const [notifications, setNotifications] = useState<
    Notification[]
  >([]);

  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [error, setError] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef(false);

  const load = useCallback(async () => {
    if (requestRef.current) return;

    requestRef.current = true;
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "/api/admin/notifications",
        {
          method: "GET",
          credentials: "same-origin",
          cache: "no-store",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        setAuthError(true);
        setNotifications([]);
        setUnread(0);
        return;
      }

      if (!response.ok) {
        throw new Error(
          `Erreur HTTP ${response.status}`
        );
      }

      const result =
        (await response.json()) as NotificationsResponse;

      const items = Array.isArray(
        result.data?.notifications
      )
        ? result.data.notifications
        : [];

      setNotifications(items);

      setUnread(
        typeof result.data?.unreadCount === "number"
          ? result.data.unreadCount
          : items.filter((item) => !item.isRead).length
      );

      setAuthError(false);
    } catch (err) {
      console.error(
        "Erreur de chargement des notifications :",
        err
      );

      setError(
        "Impossible de charger les notifications."
      );
    } finally {
      setLoading(false);
      requestRef.current = false;
    }
  }, []);

  const markAllRead = useCallback(async () => {
    if (updating || authError || unread === 0) {
      return;
    }

    setUpdating(true);
    setError("");

    try {
      const response = await fetch(
        "/api/admin/notifications",
        {
          method: "PATCH",
          credentials: "same-origin",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        setAuthError(true);
        setNotifications([]);
        setUnread(0);
        return;
      }

      if (!response.ok) {
        throw new Error(
          `Erreur HTTP ${response.status}`
        );
      }

      setNotifications((previous) =>
        previous.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );

      setUnread(0);
    } catch (err) {
      console.error(
        "Erreur de mise à jour des notifications :",
        err
      );

      setError(
        "Impossible de marquer les notifications comme lues."
      );
    } finally {
      setUpdating(false);
    }
  }, [updating, authError, unread]);

  // Chargement uniquement à l'ouverture.
  // Cela évite une requête inutile sur chaque page admin.
  useEffect(() => {
    if (open && !authError) {
      void load();
    }
  }, [open, authError, load]);

  // Fermeture au clic extérieur.
  useEffect(() => {
    if (!open) return;

    function handleOutsideClick(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );

      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [open]);

  return (
    <div
      ref={containerRef}
      className="relative"
    >
      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        aria-label="Ouvrir les notifications"
        aria-expanded={open}
        aria-haspopup="dialog"
        className="relative rounded-lg p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
      >
        <Bell size={18} />

        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-0.5 text-[10px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Notifications administrateur"
          className="absolute right-0 top-11 z-50 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <h3 className="text-sm font-bold text-[#0c4a6e]">
              Notifications
            </h3>

            <div className="flex items-center gap-2">
              {unread > 0 && !authError && (
                <button
                  type="button"
                  onClick={() => void markAllRead()}
                  disabled={updating}
                  className="flex items-center gap-1 text-xs font-medium text-sky-500 hover:text-[#0c4a6e] disabled:opacity-50"
                >
                  {updating ? (
                    <Loader2
                      size={13}
                      className="animate-spin"
                    />
                  ) : (
                    <CheckCheck size={13} />
                  )}
                  Tout lire
                </button>
              )}

              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fermer les notifications"
                className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {authError ? (
              <div className="px-5 py-8 text-center">
                <ShieldAlert
                  size={30}
                  className="mx-auto mb-3 text-amber-500"
                />

                <p className="text-sm font-semibold text-[#0c4a6e]">
                  Session non autorisée
                </p>

                <p className="mt-2 text-xs leading-relaxed text-gray-500">
                  Votre session administrateur n'est
                  pas reconnue par le service des
                  notifications.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setAuthError(false);
                    setError("");
                    void load();
                  }}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#0c4a6e] px-4 py-2 text-xs font-semibold text-white"
                >
                  <RefreshCw size={13} />
                  Réessayer
                </button>
              </div>
            ) : loading ? (
              <div className="flex items-center justify-center gap-2 py-10 text-sm text-gray-500">
                <Loader2
                  size={17}
                  className="animate-spin"
                />
                Chargement...
              </div>
            ) : error ? (
              <div className="px-5 py-8 text-center">
                <p
                  role="alert"
                  className="text-sm text-red-600"
                >
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() => void load()}
                  className="mt-3 text-xs font-semibold text-[#0c4a6e] underline"
                >
                  Réessayer
                </button>
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <Bell
                  size={28}
                  className="mx-auto mb-3 text-gray-300"
                />

                <p className="text-sm text-gray-400">
                  Aucune notification
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`border-b border-gray-50 px-4 py-3 last:border-0 ${
                    !notification.isRead
                      ? "bg-blue-50/50"
                      : ""
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {!notification.isRead && (
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                    )}

                    <div
                      className={
                        notification.isRead
                          ? "ml-4 min-w-0"
                          : "min-w-0"
                      }
                    >
                      <p className="text-xs font-semibold text-[#0c4a6e]">
                        {notification.subject}
                      </p>

                      <p className="mt-0.5 line-clamp-2 text-xs text-gray-500">
                        {notification.content}
                      </p>

                      <p className="mt-1 text-[10px] text-gray-400">
                        {Number.isNaN(
                          Date.parse(notification.createdAt)
                        )
                          ? ""
                          : new Date(
                              notification.createdAt
                            ).toLocaleString("fr-FR", {
                              day: "2-digit",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {!authError &&
            !loading &&
            notifications.length > 0 && (
              <div className="border-t border-gray-100 px-4 py-2 text-center text-[11px] text-gray-400">
                {notifications.length} notification(s)
              </div>
            )}
        </div>
      )}
    </div>
  );
}
