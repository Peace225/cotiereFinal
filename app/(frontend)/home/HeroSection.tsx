"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Bed, CalendarDays, User, ChevronDown, MapPin, ChevronRight } from "lucide-react";

const CAROUSEL_IMAGES = [
  { src: "/Images/1.jpg", alt: "Littoral ivoirien" },
  { src: "/Images/2.jpg", alt: "Côte ivoirienne" },
  { src: "/Images/3.jpg", alt: "Tourisme COTIERE" },
  { src: "/Images/4.jpg", alt: "Services COTIERE" },
];

const stats = [
  { value: "11", label: "Services" },
  { value: "6", label: "Langues" },
  { value: "500+", label: "Clients" },
];

const DESTINATIONS = [
  "Aboisso", "Adiaké", "Assinie Mafia", "Grand-Bassam", "Abidjan", 
  "Jacqueville", "Dabou", "Grand-Lahou", "Fresco", "Sassandra", 
  "San-Pédro", "Grand-Béréby", "Tabou"
];

const weekDays = ["lu", "ma", "me", "je", "ve", "sa", "di"];

export default function HeroSection() {
  const router = useRouter();
  const searchBarRef = useRef<HTMLFormElement>(null);
  
  const [destination, setDestination] = useState("");
  const [isDestOpen, setIsDestOpen] = useState(false);
  const [isDatesOpen, setIsDatesOpen] = useState(false);
  const [isGuestsOpen, setIsGuestsOpen] = useState(false);
  
  const [guests, setGuests] = useState({ adults: 2, children: 0, rooms: 1 });
  const [hasPets, setHasPets] = useState(false);
  
  // États de sélection des dates
  const [dateRange, setDateRange] = useState<{start: Date | null, end: Date | null}>({ start: null, end: null });
  
  // NOUVEAU : État pour savoir quel mois on affiche (par défaut le mois actuel)
  const [viewDate, setViewDate] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1); // 1er jour du mois courant
  });

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => setCurrentSlide((p) => (p + 1) % CAROUSEL_IMAGES.length), []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setIsDestOpen(false);
        setIsDatesOpen(false);
        setIsGuestsOpen(false);
        setFocusedField(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams({
      dest: destination,
      adults: guests.adults.toString(),
      children: guests.children.toString(),
      rooms: guests.rooms.toString(),
      pets: hasPets.toString(),
      start: dateRange.start ? dateRange.start.toISOString() : "",
      end: dateRange.end ? dateRange.end.toISOString() : ""
    });
    router.push(`/recherche?${params.toString()}`);
  }

  const filteredDestinations = DESTINATIONS.filter(d => 
    d.toLowerCase().includes(destination.toLowerCase())
  );

  // --- LOGIQUE DYNAMIQUE DU CALENDRIER ---

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  // Empêcher d'aller avant le mois en cours
  const today = new Date();
  const isPrevDisabled = viewDate.getFullYear() === today.getFullYear() && viewDate.getMonth() === today.getMonth();

  const handleDateClick = (year: number, month: number, day: number) => {
    const clickedDate = new Date(year, month, day);
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    if (clickedDate < todayStart) return;

    if (!dateRange.start || (dateRange.start && dateRange.end)) {
      setDateRange({ start: clickedDate, end: null });
    } else if (clickedDate < dateRange.start) {
      setDateRange({ start: clickedDate, end: null });
    } else {
      setDateRange({ start: dateRange.start, end: clickedDate });
      setTimeout(() => setIsDatesOpen(false), 400); 
    }
  };

  const formatDateText = () => {
    const format = (d: Date) => d.toLocaleDateString("fr-FR", { day: 'numeric', month: 'short' });
    if (dateRange.start && dateRange.end) return `${format(dateRange.start)} — ${format(dateRange.end)}`;
    if (dateRange.start) return `${format(dateRange.start)} — Date de départ`;
    return "Date d'arrivée — Date de départ";
  };

  const getDayStatus = (year: number, month: number, day: number) => {
    const time = new Date(year, month, day).getTime();
    const todayTime = new Date().setHours(0, 0, 0, 0);
    const start = dateRange.start?.getTime();
    const end = dateRange.end?.getTime();

    return {
      isPast: time < todayTime,
      isStart: time === start,
      isEnd: time === end,
      inRange: start && end && time > start && time < end,
    };
  };

  // Fonction pour générer le visuel d'un mois
  const renderMonth = (dateObj: Date) => {
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth();
    
    // Formater le nom du mois avec majuscule
    const monthNameRaw = dateObj.toLocaleDateString("fr-FR", { month: 'long', year: 'numeric' });
    const capitalizedMonth = monthNameRaw.charAt(0).toUpperCase() + monthNameRaw.slice(1);

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay(); // Dimanche = 0
    const emptyDaysCount = firstDayIndex === 0 ? 6 : firstDayIndex - 1; // Adapter pour Lundi = 0

    return (
      <div className="flex-1">
        <h3 className="text-center font-bold text-gray-900 mb-4 text-sm">{capitalizedMonth}</h3>
        <div className="grid grid-cols-7 gap-y-3 mb-2">
          {weekDays.map(d => <div key={d} className="text-center text-xs text-gray-400 font-semibold">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-y-1">
          {Array.from({length: emptyDaysCount}).map((_, i) => (
            <div key={`empty-${i}`} className="text-center py-1"></div>
          ))}
          {Array.from({length: daysInMonth}, (_, i) => i + 1).map(day => {
            const { isPast, isStart, isEnd, inRange } = getDayStatus(year, month, day);
            return (
              <div key={day} className={`flex items-center justify-center py-1 relative
                ${inRange ? 'bg-[#ebf3ff]' : ''}
                ${isStart && dateRange.end ? 'bg-[#ebf3ff] rounded-l-full' : ''}
                ${isEnd ? 'bg-[#ebf3ff] rounded-r-full' : ''}
              `}>
                <span 
                  onClick={() => handleDateClick(year, month, day)}
                  className={`w-9 h-9 flex items-center justify-center text-sm cursor-pointer rounded-full transition-all
                  ${isPast ? 'text-gray-300 cursor-not-allowed' : 'text-gray-800'}
                  ${(isStart || isEnd) ? 'bg-[#0071c2] text-white font-black hover:bg-[#005999]' : ''}
                  ${inRange ? 'text-[#0071c2] font-bold' : ''}
                  ${!isPast && !isStart && !isEnd && !inRange ? 'hover:border hover:border-gray-400' : ''}
                `}>
                  {day}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Calculer la date pour le mois d'à côté (le mois suivant)
  const nextMonthDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);

  return (
    <section className="relative min-h-[65vh] flex items-center -mt-16 z-20">
      <div className="absolute inset-0 overflow-hidden">
        <div className="flex h-full transition-transform duration-1000 ease-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {CAROUSEL_IMAGES.map(img => (
            <img key={img.src} src={img.src} alt={img.alt} className="w-full h-full object-cover flex-shrink-0" />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90" />
      </div>

      <div className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-32 pb-16 flex flex-col items-center text-center">
        
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-xl px-4 py-2 rounded-full mb-6 shadow-xl">
          <span className="w-2 h-2 bg-[#febb02] rounded-full animate-pulse" />
          <span className="text-xs tracking-widest uppercase text-white font-medium">Littoral Ivoirien · Depuis 2020</span>
        </div>

        <div className="mb-10 text-center max-w-4xl mx-auto">
          <h1 className="text-white font-black tracking-tight leading-[1.1]">
            <span className="block text-2xl lg:text-6xl drop-shadow-lg mb-2">L'excellence à chaque</span>
            <span className="block text-4xl lg:text-6xl drop-shadow-lg">
              <span className="bg-gradient-to-r from-[#febb02] to-[#ffda73] bg-clip-text text-transparent">destination.</span>
            </span>
          </h1>
          <p className="mt-5 text-base lg:text-lg text-white/90 font-medium leading-relaxed drop-shadow-md max-w-xl mx-auto">
            Des suites étoilées aux havres de paix indépendants, accédez aux meilleures offres pour des moments inoubliables.
          </p>
        </div>

        <form ref={searchBarRef} onSubmit={handleSearch} className="w-full max-w-5xl mb-8 relative z-50">
          <div className="bg-[#febb02] p-1 rounded-xl shadow-2xl flex flex-col md:flex-row items-stretch gap-1">
            
            {/* 1. SECTION DESTINATION */}
            <div className="relative flex-1">
              <div 
                className={`h-full flex items-center bg-white px-4 py-3.5 md:rounded-l-lg cursor-text ${focusedField === 'dest' ? 'ring-2 ring-inset ring-[#0071c2]' : ''}`}
                onClick={() => { setFocusedField('dest'); setIsDestOpen(true); setIsDatesOpen(false); setIsGuestsOpen(false); }}
              >
                <Bed className={`mr-3 shrink-0 ${focusedField === 'dest' ? 'text-[#0071c2]' : 'text-gray-400'}`} size={24} />
                <input 
                  type="text" placeholder="Où allez-vous ?" value={destination}
                  onChange={(e) => { setDestination(e.target.value); setIsDestOpen(true); }}
                  className="w-full outline-none bg-transparent text-gray-900 placeholder:text-gray-600 text-sm font-bold"
                />
              </div>

              {isDestOpen && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 max-h-64 overflow-y-auto text-left">
                  <p className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-400">Destinations populaires</p>
                  {filteredDestinations.map((dest) => (
                    <button key={dest} type="button" onClick={() => { setDestination(dest); setIsDestOpen(false); setFocusedField(null); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition-colors text-gray-700 group">
                      <MapPin size={18} className="text-gray-400 group-hover:text-[#0071c2]" />
                      <span className="font-bold">{dest}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 2. SECTION DATES & CALENDRIER */}
            <div className="relative flex-1">
              <div 
                className={`h-full flex items-center bg-white px-4 py-3.5 cursor-pointer hover:bg-gray-50 transition-colors ${focusedField === 'dates' ? 'ring-2 ring-inset ring-[#0071c2]' : ''}`}
                onClick={() => { setFocusedField('dates'); setIsDatesOpen(!isDatesOpen); setIsDestOpen(false); setIsGuestsOpen(false); }}
              >
                <CalendarDays className={`mr-3 shrink-0 ${focusedField === 'dates' ? 'text-[#0071c2]' : 'text-gray-400'}`} size={24} />
                <span className={`text-sm w-full text-left truncate ${dateRange.start ? 'text-gray-900 font-bold' : 'text-gray-600 font-medium'}`}>
                  {formatDateText()}
                </span>
              </div>

              {isDatesOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[92vw] md:w-[720px] bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-gray-200 z-50 text-gray-900 cursor-default overflow-hidden" onClick={(e) => e.stopPropagation()}>
                  <div className="flex border-b border-gray-200">
                    <button type="button" className="flex-1 py-4 text-sm font-bold text-[#0071c2] border-b-2 border-[#0071c2] bg-white">Calendrier</button>
                    <button type="button" className="flex-1 py-4 text-sm font-medium text-gray-500 hover:bg-gray-50">Dates flexibles</button>
                  </div>

                  <div className="p-6 relative">
                    {/* Boutons Suivant / Précédent */}
                    <button 
                      type="button" 
                      onClick={handlePrevMonth}
                      disabled={isPrevDisabled}
                      className={`absolute left-6 top-6 p-1.5 rounded-full transition-all ${isPrevDisabled ? 'text-gray-300 bg-gray-50 cursor-not-allowed' : 'text-gray-900 hover:bg-gray-100'}`}
                    >
                      <ChevronRight size={20} className="rotate-180" />
                    </button>

                    <button 
                      type="button" 
                      onClick={handleNextMonth}
                      className="absolute right-6 top-6 p-1.5 rounded-full text-gray-900 hover:bg-gray-100 transition-all"
                    >
                      <ChevronRight size={20} />
                    </button>

                    <div className="flex flex-col md:flex-row gap-8">
                      {/* Affichage des deux mois consécutifs */}
                      {renderMonth(viewDate)}
                      <div className="hidden md:block flex-1">
                        {renderMonth(nextMonthDate)}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 p-5 border-t border-gray-100 bg-white justify-center">
                    <button type="button" onClick={() => setDateRange({start: null, end: null})} className="px-4 py-2 text-xs font-bold text-[#0071c2] border border-[#0071c2] rounded-full bg-white hover:bg-blue-50">Réinitialiser</button>
                    {["± 1 jour", "± 2 jours", "± 3 jours", "± 7 jours"].map(label => (
                      <button key={label} type="button" className="px-4 py-2 text-xs font-medium text-gray-700 border border-gray-300 rounded-full hover:border-gray-500 bg-white">{label}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 3. SECTION VOYAGEURS */}
            <div className="relative flex-1">
              <div 
                className={`h-full flex items-center justify-between bg-white px-4 py-3.5 cursor-pointer hover:bg-gray-50 transition-colors ${isGuestsOpen ? 'ring-2 ring-inset ring-[#0071c2]' : ''}`}
                onClick={() => { setIsGuestsOpen(!isGuestsOpen); setIsDestOpen(false); setIsDatesOpen(false); setFocusedField(isGuestsOpen ? null : 'guests'); }}
              >
                <div className="flex items-center truncate">
                  <User className={`mr-3 shrink-0 ${isGuestsOpen ? 'text-[#0071c2]' : 'text-gray-400'}`} size={24} />
                  <span className="text-gray-900 text-sm font-medium truncate">
                    {guests.adults} ad · {guests.children} enf · {guests.rooms} ch
                  </span>
                </div>
                <ChevronDown className="text-gray-500 ml-2 shrink-0" size={20} />
              </div>

              {isGuestsOpen && (
                <div className="absolute top-full right-0 mt-2 w-[310px] bg-white rounded-xl shadow-2xl border border-gray-200 p-5 z-50 text-left" onClick={(e) => e.stopPropagation()}>
                  <div className="space-y-4">
                    {[{ label: "Adultes", key: "adults", min: 1 }, { label: "Enfants", key: "children", min: 0 }, { label: "Chambres", key: "rooms", min: 1 }].map((item) => (
                      <div key={item.key} className="flex items-center justify-between">
                        <span className="font-bold text-gray-900 text-sm">{item.label}</span>
                        <div className="flex items-center border border-gray-300 rounded bg-white">
                          <button type="button" disabled={guests[item.key as keyof typeof guests] <= item.min} onClick={() => setGuests({...guests, [item.key]: guests[item.key as keyof typeof guests] - 1})} className="w-9 h-9 flex items-center justify-center text-lg text-[#0071c2] disabled:text-gray-300">−</button>
                          <span className="w-9 text-center text-sm font-semibold text-gray-900">{guests[item.key as keyof typeof guests]}</span>
                          <button type="button" onClick={() => setGuests({...guests, [item.key]: guests[item.key as keyof typeof guests] + 1})} className="w-9 h-9 flex items-center justify-center text-lg text-[#0071c2]">+</button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-800">Vous voyagez avec votre animal ?</span>
                      <button type="button" onClick={() => setHasPets(!hasPets)} className={`relative inline-flex h-5 w-10 items-center rounded-full ${hasPets ? 'bg-[#0071c2]' : 'bg-gray-300'}`}>
                        <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${hasPets ? 'translate-x-5' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  </div>

                  <button type="button" onClick={() => setIsGuestsOpen(false)} className="w-full mt-4 py-2 text-sm font-bold text-[#0071c2] border border-[#0071c2] rounded hover:bg-blue-50">
                    Terminer
                  </button>
                </div>
              )}
            </div>

            {/* 4. BOUTON RECHERCHER */}
            <button type="submit" className="bg-[#0071c2] hover:bg-[#005999] text-white text-base font-bold px-10 py-3.5 md:rounded-r-lg transition-colors flex items-center justify-center">
              Rechercher
            </button>
          </div>
        </form>

        {/* Stats */}
        <div className="flex gap-10 pt-6 w-full max-w-2xl justify-center">
          {stats.map(s => (
            <div key={s.label} className="text-center">
              <p className="text-xl font-black text-[#febb02] drop-shadow-md">{s.value}</p>
              <p className="text-xs text-white/80 uppercase tracking-widest mt-1 font-medium">{s.label}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}