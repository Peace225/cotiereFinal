"use client";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User, Calendar, CreditCard, LogOut, ChevronRight,
  Clock, CheckCircle, XCircle, AlertCircle, RefreshCw,
  Camera, Compass, Music, Package, PartyPopper, Edit3, Phone, Mail, Save, X
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────
type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "REFUSED" | "COMPLETED";
type PaymentStatus = "UNPAID" | "PARTIAL" | "PAID" | "REFUNDED";

interface Booking {
  id: string;
  reference: string;
  type: string;
  label: string;
  image: string;
  pageUrl: string;
  status: BookingStatus;
  paymentStatus?: PaymentStatus;
  totalAmount?: number;
  estimatedPriceMin?: number;
  createdAt: string;
  eventDate?: string;
  sessionDate?: string;
  bookingDate?: string;
  checkIn?: string;
}

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  nationality?: string;
}

// ─── Helpers ──────────────────────────────────────────────────
const STATUS_CONFIG: Record<BookingStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  PENDING:   { label: "En attente",  color: "text-amber-700",  bg: "bg-amber-50 border-amber-200",  icon: Clock },
  CONFIRMED: { label: "Confirmée",   color: "text-green-700",  bg: "bg-green-50 border-green-200",  icon: CheckCircle },
  CANCELLED: { label: "Annulée",     color: "text-gray-600",   bg: "bg-gray-50 border-gray-200",    icon: XCircle },
  REFUSED:   { label: "Refusée",     color: "text-red-700",    bg: "bg-red-50 border-red-200",      icon: XCircle },
  COMPLETED: { label: "Terminée",    color: "text-blue-700",   bg: "bg-blue-50 border-blue-200",    icon: CheckCircle },
};

const PAYMENT_CONFIG: Record<PaymentStatus, { label: string; color: string }> = {
  UNPAID:   { label: "Non payé",    color: "text-red-600" },
  PARTIAL:  { label: "Acompte versé", color: "text-amber-600" },
  PAID:     { label: "Payé",        color: "text-green-600" },
  REFUNDED: { label: "Remboursé",   color: "text-blue-600" },
};

const TYPE_ICONS: Record<string, React.ElementType> = {
  studio:    Camera,
  excursion: Compass,
  event:     PartyPopper,
  music:     Music,
  equipment: Package,
  hotel:     Calendar,
};

function formatDate(d?: string): string {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

function getBookingDate(b: Booking): string {
  return formatDate(b.eventDate ?? b.sessionDate ?? b.bookingDate ?? b.checkIn ?? b.createdAt);
}

// ─── Composant carte réservation ──────────────────────────────
function BookingCard({ booking }: { booking: Booking }) {
  const status = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.PENDING;
  const payment = booking.paymentStatus ? PAYMENT_CONFIG[booking.paymentStatus] : null;
  const StatusIcon = status.icon;
  const TypeIcon = TYPE_ICONS[booking.type] ?? Calendar;
  const amount = booking.totalAmount ?? booking.estimatedPriceMin;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex">
        {/* Image */}
        <div className="relative w-24 h-24 shrink-0">
          <img src={booking.image} alt={booking.label} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute bottom-1 left-1 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center">
            <TypeIcon size={12} className="text-[#0c4a6e]" />
          </div>
        </div>

        {/* Contenu */}
        <div className="flex-1 p-3 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs text-gray-400 font-mono">{booking.reference}</p>
              <p className="font-semibold text-[#0a1628] text-sm truncate">{booking.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{getBookingDate(booking)}</p>
            </div>
            <span className={`shrink-0 inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${status.bg} ${status.color}`}>
              <StatusIcon size={10} />
              {status.label}
            </span>
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-3">
              {amount && (
                <span className="text-xs font-bold text-[#0c4a6e]">
                  {amount.toLocaleString("fr-FR")} FCFA
                </span>
              )}
              {payment && (
                <span className={`text-xs font-medium ${payment.color}`}>
                  {payment.label}
                </span>
              )}
            </div>
            <Link href={booking.pageUrl}
              className="text-xs text-[#38bdf8] hover:underline flex items-center gap-0.5 font-medium">
              Voir <ChevronRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page principale ──────────────────────────────────────────
export default function MonEspacePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [activeTab, setActiveTab] = useState<"reservations" | "profil">("reservations");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Profil
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({});
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");

  // Redirect si non connecté
  useEffect(() => {
    if (status === "unauthenticated") router.push("/connexion?callbackUrl=/mon-espace");
  }, [status, router]);

  // Charger les réservations
  useEffect(() => {
    if (status !== "authenticated") return;
    setLoadingBookings(true);
    fetch("/api/client/reservations")
      .then(r => r.json())
      .then(d => {
        if (d.data) {
          const all: Booking[] = [
            ...d.data.studio,
            ...d.data.excursions,
            ...d.data.events,
            ...d.data.music,
            ...d.data.equipment,
            ...d.data.hotel,
          ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setBookings(all);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingBookings(false));
  }, [status]);

  // Charger le profil
  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/client/profile")
      .then(r => r.json())
      .then(d => {
        if (d.data) {
          setProfile(d.data);
          setEditForm(d.data);
        }
      })
      .catch(() => {});
  }, [status]);

  async function saveProfile() {
    setSavingProfile(true);
    setProfileMsg("");
    try {
      const res = await fetch("/api/client/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const d = await res.json();
      if (res.ok) {
        setProfile(d.data);
        setEditMode(false);
        setProfileMsg("Profil mis à jour !");
        setTimeout(() => setProfileMsg(""), 3000);
      } else {
        setProfileMsg(d.error ?? "Erreur lors de la sauvegarde");
      }
    } catch {
      setProfileMsg("Erreur de connexion");
    }
    setSavingProfile(false);
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f9ff]">
        <RefreshCw size={24} className="animate-spin text-[#38bdf8]" />
      </div>
    );
  }

  if (!session) return null;

  const user = session.user as { name?: string; email?: string; image?: string };

  // Filtrer les réservations
  const filtered = filterStatus === "all"
    ? bookings
    : bookings.filter(b => b.status === filterStatus);

  // Stats
  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === "CONFIRMED").length,
    pending: bookings.filter(b => b.status === "PENDING").length,
    completed: bookings.filter(b => b.status === "COMPLETED").length,
  };

  return (
    <div className="min-h-screen bg-[#f0f9ff]">
      {/* Header */}
      <div className="bg-[#0c4a6e] text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#c9a84c] rounded-full flex items-center justify-center text-2xl font-bold text-white shrink-0">
              {user.name?.charAt(0)?.toUpperCase() ?? "C"}
            </div>
            <div>
              <h1 className="text-xl font-bold">{user.name ?? "Mon espace"}</h1>
              <p className="text-blue-200 text-sm">{user.email}</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="ml-auto flex items-center gap-2 text-sm text-blue-200 hover:text-white transition-colors"
            >
              <LogOut size={16} />
              <span className="hidden sm:block">Déconnexion</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 mt-6">
            {[
              { label: "Total", value: stats.total, color: "text-white" },
              { label: "En attente", value: stats.pending, color: "text-amber-300" },
              { label: "Confirmées", value: stats.confirmed, color: "text-green-300" },
              { label: "Terminées", value: stats.completed, color: "text-blue-300" },
            ].map(s => (
              <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-blue-200 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex">
            {[
              { id: "reservations", label: "Mes réservations", icon: Calendar },
              { id: "profil", label: "Mon profil", icon: User },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as "reservations" | "profil")}
                  className={`flex items-center gap-2 px-5 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-[#c9a84c] text-[#0c4a6e]"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* ── Onglet Réservations ── */}
        {activeTab === "reservations" && (
          <div>
            {/* Filtres */}
            <div className="flex gap-2 flex-wrap mb-6">
              {[
                { value: "all", label: "Toutes" },
                { value: "PENDING", label: "En attente" },
                { value: "CONFIRMED", label: "Confirmées" },
                { value: "COMPLETED", label: "Terminées" },
                { value: "CANCELLED", label: "Annulées" },
              ].map(f => (
                <button
                  key={f.value}
                  onClick={() => setFilterStatus(f.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    filterStatus === f.value
                      ? "bg-[#0c4a6e] text-white"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-[#0c4a6e]"
                  }`}
                >
                  {f.label}
                  {f.value !== "all" && (
                    <span className="ml-1 opacity-70">
                      ({bookings.filter(b => b.status === f.value).length})
                    </span>
                  )}
                </button>
              ))}
            </div>

            {loadingBookings ? (
              <div className="flex items-center justify-center py-16">
                <RefreshCw size={24} className="animate-spin text-[#38bdf8]" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                <Calendar size={48} className="text-gray-300 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-600 mb-2">
                  {filterStatus === "all" ? "Aucune réservation" : "Aucune réservation dans cette catégorie"}
                </h3>
                <p className="text-gray-400 text-sm mb-6">
                  {filterStatus === "all" && "Explorez nos services et faites votre première réservation."}
                </p>
                {filterStatus === "all" && (
                  <Link href="/services/tourisme" className="btn-primary text-sm">
                    Découvrir nos services <ChevronRight size={14} />
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map(b => <BookingCard key={b.id} booking={b} />)}
              </div>
            )}
          </div>
        )}

        {/* ── Onglet Profil ── */}
        {activeTab === "profil" && (
          <div className="max-w-lg">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-[#0c4a6e] text-lg">Informations personnelles</h2>
                {!editMode ? (
                  <button
                    onClick={() => { setEditMode(true); setEditForm(profile ?? {}); }}
                    className="flex items-center gap-1.5 text-sm text-[#38bdf8] hover:text-[#0284c7] font-medium"
                  >
                    <Edit3 size={14} /> Modifier
                  </button>
                ) : (
                  <button
                    onClick={() => setEditMode(false)}
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
                  >
                    <X size={14} /> Annuler
                  </button>
                )}
              </div>

              {profileMsg && (
                <div className={`mb-4 px-4 py-2 rounded-lg text-sm ${
                  profileMsg.includes("Erreur") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
                }`}>
                  {profileMsg}
                </div>
              )}

              {!editMode ? (
                <div className="space-y-4">
                  {[
                    { icon: User, label: "Nom complet", value: profile ? `${profile.firstName} ${profile.lastName}` : user.name ?? "—" },
                    { icon: Mail, label: "Email", value: profile?.email ?? user.email ?? "—" },
                    { icon: Phone, label: "Téléphone", value: profile?.phone ?? "Non renseigné" },
                    { icon: Phone, label: "WhatsApp", value: profile?.whatsapp ?? "Non renseigné" },
                    { icon: User, label: "Nationalité", value: profile?.nationality ?? "Non renseignée" },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-[#f0f9ff] rounded-lg flex items-center justify-center shrink-0">
                        <Icon size={14} className="text-[#0c4a6e]" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">{label}</p>
                        <p className="text-sm font-medium text-[#0a1628]">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Prénom</label>
                      <input
                        type="text"
                        value={editForm.firstName ?? ""}
                        onChange={e => setEditForm(f => ({ ...f, firstName: e.target.value }))}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Nom</label>
                      <input
                        type="text"
                        value={editForm.lastName ?? ""}
                        onChange={e => setEditForm(f => ({ ...f, lastName: e.target.value }))}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Téléphone</label>
                    <input
                      type="tel"
                      value={editForm.phone ?? ""}
                      onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder="+225 07 XX XX XX XX"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">WhatsApp</label>
                    <input
                      type="tel"
                      value={editForm.whatsapp ?? ""}
                      onChange={e => setEditForm(f => ({ ...f, whatsapp: e.target.value }))}
                      placeholder="+225 07 XX XX XX XX"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Nationalité</label>
                    <input
                      type="text"
                      value={editForm.nationality ?? ""}
                      onChange={e => setEditForm(f => ({ ...f, nationality: e.target.value }))}
                      placeholder="Ivoirienne"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]"
                    />
                  </div>
                  <button
                    onClick={saveProfile}
                    disabled={savingProfile}
                    className="w-full bg-[#c9a84c] hover:bg-[#b8973b] disabled:opacity-60 text-white font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    {savingProfile ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                    {savingProfile ? "Sauvegarde..." : "Sauvegarder"}
                  </button>
                </div>
              )}
            </div>

            {/* Sécurité */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-4">
              <h3 className="font-bold text-[#0c4a6e] mb-4">Sécurité</h3>
              <Link
                href="/mot-de-passe-oublie"
                className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-[#c9a84c] hover:bg-[#fef9ec] transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#f0f9ff] rounded-lg flex items-center justify-center">
                    <CreditCard size={14} className="text-[#0c4a6e]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#0a1628]">Changer le mot de passe</p>
                    <p className="text-xs text-gray-400">Recevoir un lien par email</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-400 group-hover:text-[#c9a84c]" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
