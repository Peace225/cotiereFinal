"use client";

import { useEffect, useState, useMemo } from "react";
import { Star, MessageSquare, ThumbsUp, RefreshCw, Send } from "lucide-react";
import { supabase } from "../../lib/supabase"; // 👈 Ajuste le chemin relatif pointant vers ton fichier supabaseClient
import Link from "next/link";

interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  user: { firstName: string; lastName: string };
}

interface ReviewsSectionProps {
  serviceType: string;
  excursionId?: string;
  title?: string;
}

function StarRating({ value, onChange, readonly = false }: {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
}) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(i)}
          onMouseEnter={() => !readonly && setHover(i)}
          onMouseLeave={() => !readonly && setHover(0)}
          className={readonly ? "cursor-default" : "cursor-pointer"}
        >
          <Star
            size={readonly ? 14 : 20}
            className={`transition-colors ${
              i <= (hover || value)
                ? "text-[#c9a84c] fill-[#c9a84c]"
                : "text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const initials = `${review.user.firstName.charAt(0)}${review.user.lastName.charAt(0)}`.toUpperCase();
  const date = new Date(review.createdAt).toLocaleDateString("fr-FR", {
    day: "2-digit", month: "short", year: "numeric",
  });

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 bg-[#0c4a6e] text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold text-[#0a1628] text-sm">
              {review.user.firstName} {review.user.lastName.charAt(0)}.
            </p>
            <span className="text-xs text-gray-400 shrink-0">{date}</span>
          </div>
          <StarRating value={review.rating} readonly />
          {review.comment && (
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">{review.comment}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ReviewsSection({ serviceType, excursionId, title = "Avis clients" }: ReviewsSectionProps) {
  // Remplacement de Next-Auth par la session Supabase Auth
  const [user, setUser] = useState<any>(null);
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Gestion de la session utilisateur avec Supabase
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  function loadReviews() {
    setLoading(true);
    const params = new URLSearchParams({ serviceType });
    if (excursionId) params.set("excursionId", excursionId);
    fetch(`/api/reviews?${params}`)
      .then(r => r.json())
      .then(d => setReviews(d.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadReviews(); }, [serviceType, excursionId]);

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceType, excursionId, rating, comment }),
      });
      const d = await res.json();
      if (res.ok) {
        setSubmitted(true);
        setShowForm(false);
        setComment("");
        setRating(5);
      } else {
        setError(d.error ?? "Erreur lors de l'envoi");
      }
    } catch {
      setError("Erreur de connexion");
    }
    setSubmitting(false);
  }

  // Calcul note moyenne
  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map(n => ({
    n,
    count: reviews.filter(r => r.rating === n).length,
    pct: reviews.length > 0 ? (reviews.filter(r => r.rating === n).length / reviews.length) * 100 : 0,
  }));

  return (
    <section className="py-12 bg-[#f8fafc]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-[#0c4a6e] flex items-center gap-2">
              <MessageSquare size={20} className="text-[#c9a84c]" />
              {title}
            </h2>
            {reviews.length > 0 && (
              <p className="text-sm text-gray-500 mt-1">{reviews.length} avis vérifié{reviews.length > 1 ? "s" : ""}</p>
            )}
          </div>
          {user ? (
            !submitted ? (
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 text-sm font-medium bg-[#c9a84c] text-white px-4 py-2 rounded-xl hover:bg-[#b8973b] transition-colors"
              >
                <Star size={14} />
                Laisser un avis
              </button>
            ) : (
              <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                <ThumbsUp size={14} /> Avis envoyé, merci !
              </span>
            )
          ) : (
            <Link href="/connexion" className="text-sm text-[#38bdf8] hover:underline font-medium">
              Connectez-vous pour laisser un avis
            </Link>
          )}
        </div>

        {/* Résumé des notes */}
        {reviews.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6 flex flex-col sm:flex-row gap-6 items-center">
            <div className="text-center shrink-0">
              <p className="text-5xl font-black text-[#0c4a6e]">{avgRating.toFixed(1)}</p>
              <StarRating value={Math.round(avgRating)} readonly />
              <p className="text-xs text-gray-400 mt-1">{reviews.length} avis</p>
            </div>
            <div className="flex-1 w-full space-y-1.5">
              {ratingCounts.map(({ n, count, pct }) => (
                <div key={n} className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-4 text-right">{n}</span>
                  <Star size={10} className="text-[#c9a84c] fill-[#c9a84c] shrink-0" />
                  <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full bg-[#c9a84c] rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 w-4">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Formulaire d'avis */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-[#c9a84c]/30 p-5 mb-6 shadow-sm">
            <h3 className="font-semibold text-[#0c4a6e] mb-4">Votre avis</h3>
            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg mb-4">{error}</div>
            )}
            <form onSubmit={submitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Note *</label>
                <StarRating value={rating} onChange={setRating} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Commentaire (optionnel)</label>
                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  rows={3}
                  maxLength={500}
                  placeholder="Partagez votre expérience..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c] resize-none"
                />
                <p className="text-xs text-gray-400 text-right mt-1">{comment.length}/500</p>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 bg-[#c9a84c] text-white font-bold px-5 py-2 rounded-xl text-sm hover:bg-[#b8973b] disabled:opacity-60 transition-colors"
                >
                  {submitting ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
                  {submitting ? "Envoi..." : "Publier"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  Annuler
                </button>
              </div>
              <p className="text-xs text-gray-400">Votre avis sera visible après modération par notre équipe.</p>
            </form>
          </div>
        )}

        {/* Liste des avis */}
        {loading ? (
          <div className="flex justify-center py-8">
            <RefreshCw size={20} className="animate-spin text-[#38bdf8]" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-gray-100">
            <Star size={32} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Aucun avis pour le moment.</p>
            <p className="text-gray-400 text-xs mt-1">Soyez le premier à partager votre expérience !</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map(r => <ReviewCard key={r.id} review={r} />)}
          </div>
        )}
      </div>
    </section>
  );
}