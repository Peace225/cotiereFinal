"use client";

// Force le rendu dynamique pour Ã©viter les erreurs de prÃ©-gÃ©nÃ©ration (Prerender error)
export const dynamic = 'force-dynamic';

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User, Calendar, CreditCard, LogOut, ChevronRight,
  Clock, CheckCircle, XCircle, RefreshCw,
  Camera, Compass, Music, Package, PartyPopper, Edit3, Phone, Mail, Save, X
} from "lucide-react";

// â”€â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const STATUS_CONFIG: Record<BookingStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  PENDING:   { label: "En attente",  color: "text-amber-700",  bg: "bg-amber-50 border-amber-200",  icon: Clock },
  CONFIRMED: { label: "ConfirmÃ©e",   color: "text-green-700",  bg: "bg-green-50 border-green-200",  icon: CheckCircle },
  CANCELLED: { label: "AnnulÃ©e",     color: "text-gray-600",   bg: "bg-gray-50 border-gray-200",    icon: XCircle },
  REFUSED:   { label: "RefusÃ©e",     color: "text-red-700",    bg: "bg-red-50 border-red-200",      icon: XCircle },
  COMPLETED: { label: "TerminÃ©e",    color: "text-blue-700",   bg: "bg-blue-50 border-blue-200",    icon: CheckCircle },
};

const PAYMENT_CONFIG: Record<PaymentStatus, { label: string; color: string }> = {
  UNPAID:   { label: "Non payÃ©",    color: "text-red-600" },
  PARTIAL:  { label: "Acompte versÃ©", color: "text-amber-600" },
  PAID:     { label: "PayÃ©",        color: "text-green-600" },
  REFUNDED: { label: "RemboursÃ©",   color: "text-blue-600" },
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
  if (!d) return "â€”";
  return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

function getBookingDate(b: Booking): string {
  return formatDate(b.eventDate ?? b.sessionDate ?? b.bookingDate ?? b.checkIn ?? b.createdAt);
}

// â”€â”€â”€ Composant carte rÃ©servation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function BookingCard({ booking }: { booking: Booking }) {
  const status = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.PENDING;
  const payment = booking.paymentStatus ? PAYMENT_CONFIG[booking.paymentStatus] : null;
  const StatusIcon = status.icon;
  const TypeIcon = TYPE_ICONS[booking.type] ?? Calendar;
  const amount = booking.totalAmount ?? booking.estimatedPriceMin;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex">
        <div className="relative w-24 h-24 shrink-0">
          <img src={booking.image} alt={booking.label} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute bottom-1 left-1 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center">
            <TypeIcon size={12} className="text-[#0c4a6e]" />
          </div>
        </div>
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
            <Link href={booking.pageUrl} className="text-xs text-[#38bdf8] hover:underline flex items-center gap-0.5 font-medium">
              Voir <ChevronRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// â”€â”€â”€ Page principale â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function MonEspacePage() {
  const sessionData = useSession();
  const session = sessionData?.data;
  const status = sessionData?.status;
  
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [activeTab, setActiveTab] = useState<"reservations" | "profil">("reservations");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({});
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/connexion?callbackUrl=/mon-espace");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    setLoadingBookings(true);
    fetch("/api/client/reservations")
      .then(r => r.json())
      .then(d => {
        if (d.data) {
          const all: Booking[] = [
            ...(d.data.studio || []),
            ...(d.data.excursions || []),
            ...(d.data.events || []),
            ...(d.data.music || []),
            ...(d.data.equipment || []),
            ...(d.data.hotel || []),
          ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setBookings(all);
        }
      })
      .finally(() => setLoadingBookings(false));
  }, [status]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/client/profile")
      .then(r => r.json())
      .then(d => {
        if (d.data) {
          setProfile(d.data);
          setEditForm(d.data);
        }
      });
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
        setProfileMsg("Profil mis Ã  jour !");
        setTimeout(() => setProfileMsg(""), 3000);
      } else {
        setProfileMsg(d.error ?? "Erreur lors de la sauvegarde");
      }
    } catch {
      setProfileMsg("Erreur de connexion");
    }
    setSavingProfile(false);
  }

  // Loading global ou non connectÃ©
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f9ff]">
        <RefreshCw size={24} className="animate-spin text-[#38bdf8]" />
      </div>
    );
  }

  if (!session) return null;

  const user = session.user as { name?: string; email?: string; image?: string };
  const filtered = filterStatus === "all" ? bookings : bookings.filter(b => b.status === filterStatus);
  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === "CONFIRMED").length,
    pending: bookings.filter(b => b.status === "PENDING").length,
    completed: bookings.filter(b => b.status === "COMPLETED").length,
  };

  return (
    <div className="min-h-screen bg-[#f0f9ff]">
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
            <button onClick={() => signOut({ callbackUrl: "/" })} className="ml-auto flex items-center gap-2 text-sm text-blue-200 hover:text-white transition-colors">
              <LogOut size={16} /> DÃ©connexion
            </button>
          </div>
          <div className="grid grid-cols-4 gap-3 mt-6">
            {[
              { label: "Total", value: stats.total, color: "text-white" },
              { label: "En attente", value: stats.pending, color: "text-amber-300" },
              { label: "ConfirmÃ©es", value: stats.confirmed, color: "text-green-300" },
              { label: "TerminÃ©es", value: stats.completed, color: "text-blue-300" },
            ].map(s => (
              <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-blue-200 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* ... Suite du rendu tabs et contenu ... */}
      {/* (Reste du code identique Ã  votre version) */}
    </div>
  );
}

