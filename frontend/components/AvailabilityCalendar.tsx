"use client";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  apiUrl: string; // ex: "/api/studio/calendar" ou "/api/excursions/{id}/availability"
  onDateSelect?: (date: string) => void;
  selectedDate?: string;
  label?: string;
};

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const MONTHS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

export default function AvailabilityCalendar({ apiUrl, onDateSelect, selectedDate, label = "Disponibilités" }: Props) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-indexed
  const [bookedDates, setBookedDates] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`;

  useEffect(() => {
    setLoading(true);
    fetch(`${apiUrl}?month=${monthKey}`)
      .then(r => r.json())
      .then(d => {
        setBookedDates(d.data?.bookedDates ?? {});
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [apiUrl, monthKey]);

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  }

  // Générer les jours du mois
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDow = (firstDay.getDay() + 6) % 7; // Lundi = 0
  const daysInMonth = lastDay.getDate();

  const cells: (number | null)[] = [
    ...Array(startDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  function getDateKey(day: number) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  function isToday(day: number) {
    return year === today.getFullYear() && month === today.getMonth() && day === today.getDate();
  }

  function isPast(day: number) {
    const d = new Date(year, month, day);
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return d < todayStart;
  }

  function isBooked(day: number) {
    const key = getDateKey(day);
    const slots = bookedDates[key] ?? [];
    // Considéré "complet" si tous les créneaux sont pris (4 créneaux max)
    return slots.length >= 4;
  }

  function isPartial(day: number) {
    const key = getDateKey(day);
    const slots = bookedDates[key] ?? [];
    return slots.length > 0 && slots.length < 4;
  }

  function isSelected(day: number) {
    return selectedDate === getDateKey(day);
  }

  function handleClick(day: number) {
    if (isPast(day) || isBooked(day)) return;
    onDateSelect?.(getDateKey(day));
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0c4a6e] text-white">
        <button onClick={prevMonth} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
          <ChevronLeft size={18} />
        </button>
        <div className="text-center">
          <p className="font-bold text-sm">{MONTHS[month]} {year}</p>
          {label && <p className="text-white/60 text-xs">{label}</p>}
        </div>
        <button onClick={nextMonth} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Jours de la semaine */}
      <div className="grid grid-cols-7 border-b border-gray-100">
        {DAYS.map(d => (
          <div key={d} className="text-center text-xs font-semibold text-gray-400 py-2">{d}</div>
        ))}
      </div>

      {/* Grille des jours */}
      {loading ? (
        <div className="py-8 text-center text-gray-400 text-sm">Chargement...</div>
      ) : (
        <div className="grid grid-cols-7 p-2 gap-1">
          {cells.map((day, i) => {
            if (!day) return <div key={i} />;
            const past = isPast(day);
            const booked = isBooked(day);
            const partial = isPartial(day);
            const selected = isSelected(day);
            const today_ = isToday(day);

            return (
              <button
                key={i}
                onClick={() => handleClick(day)}
                disabled={past || booked}
                className={`
                  relative aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all
                  ${past ? "text-gray-200 cursor-not-allowed" : ""}
                  ${booked && !past ? "bg-red-50 text-red-300 cursor-not-allowed" : ""}
                  ${partial && !past && !selected ? "bg-orange-50 text-orange-600 hover:bg-orange-100" : ""}
                  ${!past && !booked && !partial && !selected ? "text-gray-700 hover:bg-[#f0f9ff] hover:text-[#0c4a6e]" : ""}
                  ${selected ? "bg-[#c9a84c] text-white shadow-md" : ""}
                  ${today_ && !selected ? "ring-2 ring-[#c9a84c] ring-offset-1" : ""}
                `}
              >
                {day}
                {partial && !selected && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-orange-400 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Légende */}
      <div className="flex items-center gap-4 px-4 py-3 border-t border-gray-50 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-[#c9a84c]" /> Sélectionné
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-orange-50 border border-orange-200" /> Partiel
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-red-50 border border-red-200" /> Complet
        </span>
      </div>
    </div>
  );
}
