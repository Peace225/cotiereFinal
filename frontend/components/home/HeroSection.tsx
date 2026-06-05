"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, MapPin, Calendar, Users, Search, Target, Camera, Waves, Hotel, PartyPopper, ChevronLeft, ChevronRight } from "lucide-react";

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

const servicesList = [
  "CÔTIÈRE HBL Studio+",
  "CÔTIÈRE Tourisme & Voyage",
  "CÔTIÈRE Hébergement",
  "CÔTIÈRE Music & Management",
  "Guichet Unique de l'Industrie Événementielle & Audiovisuelle",
  "CÔTIÈRE Market & Distribution",
  "Tout Le Monde A Droit À La Pub",
  "Médias (TV, FM, Magazine)",
  "Collectivités & Services",
  "CÔTIÈRE Opportunités",
  "CÔTIÈRE INFO+",
  "Le RDV Des Événements À Venir",
];

const VILLES_LITTORAL = [
  { ville: "Aboisso", region: "Sud-Comoé" },
  { ville: "Adiaké", region: "Sud-Comoé" },
  { ville: "Assinie-Mafia", region: "Sud-Comoé" },
  { ville: "Grand-Bassam", region: "Sud-Comoé" },
  { ville: "Abidjan", region: "Lagunes" },
  { ville: "Jacqueville", region: "Lagunes" },
  { ville: "Dabou", region: "Lagunes" },
  { ville: "Grand-Lahou", region: "Grands-Ponts" },
  { ville: "Fresco", region: "Grands-Ponts" },
  { ville: "Sassandra", region: "Bas-Sassandra" },
  { ville: "San-Pédro", region: "Bas-Sassandra" },
  { ville: "Grand-Béréby", region: "Bas-Sassandra" },
  { ville: "Tabou", region: "Bas-Sassandra" },
];

export default function HeroSection() {
  const router = useRouter();
  const [service, setService] = useState("");
  const [destination, setDestination] = useState("");
  const [dateArrivee, setDateArrivee] = useState("");
  const [dateDepart, setDateDepart] = useState("");
  const [personnes, setPersonnes] = useState("2 adultes");
  const [showPersonnes, setShowPersonnes] = useState(false);
  const [adultes, setAdultes] = useState(2);
  const [enfants, setEnfants] = useState(0);
  const [showServices, setShowServices] = useState(false);
  const [showVilles, setShowVilles] = useState(false);
  const [villeQuery, setVilleQuery] = useState("");
  const serviceRef = useRef<HTMLDivElement>(null);
  const villeRef = useRef<HTMLDivElement>(null);

  const filteredVilles = villeQuery? VILLES_LITTORAL.filter(l => l.ville.toLowerCase().includes(villeQuery.toLowerCase())) : VILLES_LITTORAL;
  const [currentSlide, setCurrentSlide] = useState(0);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = useCallback(() => setCurrentSlide((p) => (p + 1) % CAROUSEL_IMAGES.length), []);
  const prevSlide = useCallback(() => setCurrentSlide((p) => (p - 1 + CAROUSEL_IMAGES.length) % CAROUSEL_IMAGES.length), []);
  const goToSlide = (i: number) => setCurrentSlide(i);

  useEffect(() => {
    autoPlayRef.current = setInterval(nextSlide, 6000);
    return () => { if (autoPlayRef.current) clearInterval(autoPlayRef.current); };
  }, [nextSlide]);

  const pauseAutoPlay = () => autoPlayRef.current && clearInterval(autoPlayRef.current);
  const resumeAutoPlay = () => { autoPlayRef.current = setInterval(nextSlide, 6000); };

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (serviceRef.current &&!serviceRef.current.contains(e.target as Node)) setShowServices(false);
      if (villeRef.current &&!villeRef.current.contains(e.target as Node)) setShowVilles(false);
      if (!(e.target as HTMLElement).closest('.personnes-pop')) setShowPersonnes(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (dateArrivee) params.set("from", dateArrivee);
    if (dateDepart) params.set("to", dateDepart);
    params.set("adultes", String(adultes));
    params.set("enfants", String(enfants));
    if (destination) {
      const slugMap: Record<string, string> = { "Aboisso":"aboisso","Adiaké":"adiake","Assinie-Mafia":"assinie-mafia","Grand-Bassam":"grand-bassam","Abidjan":"abidjan","Jacqueville":"jacqueville","Dabou":"dabou","Grand-Lahou":"grand-lahou","Fresco":"fresco","Sassandra":"sassandra","San-Pédro":"san-pedro","Grand-Béréby":"grand-bereby","Tabou":"tabou" };
      const slug = slugMap[destination];
      if (slug) { router.push(`/villes/${slug}?${params}`); return; }
    }
    const routes: Record<string, string> = { "CÔTIÈRE HBL Studio+":"/services/studio","CÔTIÈRE Tourisme & Voyage":"/services/tourisme","CÔTIÈRE Hébergement":"/services/hebergement","CÔTIÈRE Music & Management":"/services/music","Guichet Unique de l'Industrie Événementielle & Audiovisuelle":"/services/location","CÔTIÈRE Market & Distribution":"/services/market","Tout Le Monde A Droit À La Pub":"/services/afrouba","Médias (TV, FM, Magazine)":"/services/medias","Collectivités & Services":"/services/collectivites","CÔTIÈRE Opportunités":"/services/opportunites","CÔTIÈRE INFO+":"/services/info","Le RDV Des Événements À Venir":"/services/rdv" };
    router.push(`${routes[service] || "/reservation"}?${params}${destination? `&destination=${destination}` : ""}`);
  }

  function updatePersonnes(a: number, e: number) {
    setAdultes(a); setEnfants(e);
    setPersonnes(`${a} adulte${a>1?'s':''}${e>0?` · ${e} enfant${e>1?'s':''}`:''}`);
  }

  return (
    <section className="relative min-h- flex items-center -mt-16 overflow-hidden" onMouseEnter={pauseAutoPlay} onMouseLeave={resumeAutoPlay}>
      {/* Carousel qui glisse */}
      <div className="absolute inset-0">
        <div className="flex h-full transition-transform duration-1000 ease-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {CAROUSEL_IMAGES.map(img => (
            <div key={img.src} className="w-full h-full flex-shrink-0 relative">
              <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.6))]" />
      </div>

      {/* Flèches desktop only */}
      <button onClick={prevSlide} className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-full items-center justify-center text-white transition-all hover:scale-105">
        <ChevronLeft size={20} />
      </button>
      <button onClick={nextSlide} className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-full items-center justify-center text-white transition-all hover:scale-105">
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {CAROUSEL_IMAGES.map((_, i) => (
          <button key={i} onClick={() => goToSlide(i)} className={`h-1.5 rounded-full transition-all ${i === currentSlide? "w-8 bg-[#c9a84c]" : "w-1.5 bg-white/40"}`} />
        ))}
      </div>

      <div className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-16 md:pt-32 md:pb-24 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-xl px-4 py-2 rounded-full mb-6">
          <span className="w-2 h-2 bg-[#c9a84c] rounded-full animate-pulse" />
          <span className="text- sm:text-xs tracking-widest uppercase text-white/80 font-medium">Littoral Ivoirien · Depuis 2020</span>
        </div>

        <h1 className="text-white font-black tracking-tighter leading-[0.95] mb-4">
          <span className="block text-3xl sm:text-5xl lg:text-6xl">Bienvenue chez</span>
          <span className="block text-3xl sm:text-5xl lg:text-6xl mt-1">
            <span className="bg-gradient-to-r from-[#c9a84c] to-[#e0c070] bg-clip-text text-transparent">CÔTIÈRE</span>
            <span className="text-white/70 font-light ml-2 text-2xl sm:text-4xl lg:text-5xl align-baseline">Media Group</span>
          </span>
        </h1>

        <p className="text-white/70 text-sm sm:text-lg max-w-xl mb-8">Tourisme · Production · Événementiel · Hébergement</p>

        {/* SEARCH */}
        <form onSubmit={handleSearch} className="w-full max-w-5xl">
          <div className="bg-white rounded- md:rounded- shadow-2xl overflow-hidden">
            {/* Desktop */}
            <div className="hidden md:flex items-stretch divide-x divide-gray-100">
              <div ref={serviceRef} className="relative flex-1 min-w-">
                <button type="button" onClick={() => setShowServices(!showServices)} className="w-full h-full flex items-center gap-3 px-5 py-4 text-left hover:bg-gray-50">
                  <Target size={18} className="text-[#c9a84c] shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text- uppercase text-gray-400 font-bold">Service</p>
                    <p className="text-sm font-semibold truncate">{service || "Choisir"}</p>
                  </div>
                  <ChevronDown size={16} className={`transition-transform ${showServices? "rotate-180" : ""}`} />
                </button>
                {showServices && (
                  <div className="absolute top-full mt-2 left-0 w-80 max-h- overflow-auto bg-white rounded-2xl shadow-2xl border z-50 p-2">
                    {servicesList.map(s => (
                      <button key={s} type="button" onClick={() => {setService(s); setShowServices(false);}} className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-gray-50 text-sm">{s}</button>
                    ))}
                  </div>
                )}
              </div>

              <div ref={villeRef} className="relative w-">
                <button type="button" onClick={() => setShowVilles(!showVilles)} className="w-full h-full flex items-center gap-3 px-5 py-4 text-left hover:bg-gray-50">
                  <MapPin size={18} className="text-[#c9a84c] shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text- uppercase text-gray-400 font-bold">Ville</p>
                    <p className="text-sm font-semibold truncate">{destination || "Où?"}</p>
                  </div>
                </button>
                {showVilles && (
                  <div className="absolute top-full mt-2 left-0 w-72 bg-white rounded-2xl shadow-2xl border z-50 overflow-hidden">
                    <input value={villeQuery} onChange={e => setVilleQuery(e.target.value)} placeholder="Rechercher..." className="w-full p-3 text-sm outline-none border-b" autoFocus />
                    <div className="max-h-60 overflow-auto p-2">
                      {filteredVilles.map(v => (
                        <button key={v.ville} type="button" onClick={() => {setDestination(v.ville); setShowVilles(false);}} className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-sm flex justify-between">
                          <span>{v.ville}</span><span className="text-xs text-gray-400">{v.region}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 px-4">
                <Calendar size={16} className="text-[#c9a84c]" />
                <input type="date" value={dateArrivee} onChange={e => setDateArrivee(e.target.value)} className="text-sm outline-none" />
                <span className="text-gray-300">→</span>
                <input type="date" value={dateDepart} onChange={e => setDateDepart(e.target.value)} className="text-sm outline-none" />
              </div>

              <div className="relative px-4 flex items-center">
                <button type="button" onClick={() => setShowPersonnes(!showPersonnes)} className="flex items-center gap-2 personnes-pop">
                  <Users size={16} className="text-[#c9a84c]" />
                  <span className="text-sm font-medium whitespace-nowrap">{personnes}</span>
                </button>
                {showPersonnes && (
                  <div className="absolute top-full right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border p-4 z-50 personnes-pop">
                    {[["Adultes", adultes, setAdultes, 1], ["Enfants", enfants, setEnfants, 0]].map(([label, val, set, min]: any) => (
                      <div key={label} className="flex justify-between items-center py-2">
                        <span className="text-sm">{label}</span>
                        <div className="flex items-center gap-3">
                          <button type="button" onClick={() => {const n=Math.max(min, val-1); set(n); updatePersonnes(label==="Adultes"?n:adultes, label==="Enfants"?n:enfants);}} className="w-7 h-7 rounded-full border flex items-center justify-center">-</button>
                          <span className="w-5 text-center">{val}</span>
                          <button type="button" onClick={() => {const n=val+1; set(n); updatePersonnes(label==="Adultes"?n:adultes, label==="Enfants"?n:enfants);}} className="w-7 h-7 rounded-full border flex items-center justify-center">+</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button type="submit" className="bg-[#c9a84c] hover:bg-[#b8973b] text-white font-semibold px-6 m-2 rounded-xl flex items-center gap-2 transition-colors">
                <Search size={16} /> Rechercher
              </button>
            </div>

            {/* Mobile */}
            <div className="md:hidden p-3 space-y-3">
              <button type="button" onClick={() => setShowServices(!showServices)} className="w-full flex justify-between items-center p-4 bg-gray-50 rounded-xl min-h-">
                <span className="text- font-medium truncate pr-2">{service || "Choisir un service"}</span>
                <Target size={18} className="text-[#c9a84c] shrink-0" />
              </button>
              {showServices && (
                <div className="bg-white border rounded-xl max-h-48 overflow-auto">
                  {servicesList.map(s => (
                    <button key={s} type="button" onClick={() => {setService(s); setShowServices(false);}} className="w-full text-left p-3 text- border-b last:border-0 active:bg-gray-50">{s}</button>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 gap-3">
                <div className="relative">
                  <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input list="villes-mob" value={destination} onChange={e => setDestination(e.target.value)} placeholder="Ville de destination" className="w-full pl-10 pr-4 py-4 bg-gray-50 rounded-xl text- outline-none focus:ring-2 focus:ring-[#c9a84c]/30" />
                  <datalist id="villes-mob">{VILLES_LITTORAL.map(v => <option key={v.ville} value={v.ville} />)}</datalist>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input type="date" value={dateArrivee} onChange={e => setDateArrivee(e.target.value)} className="w-full p-4 bg-gray-50 rounded-xl text- outline-none" />
                  <input type="date" value={dateDepart} onChange={e => setDateDepart(e.target.value)} className="w-full p-4 bg-gray-50 rounded-xl text- outline-none" />
                </div>
              </div>

              <button type="submit" className="w-full bg-[#c9a84c] active:bg-[#b8973b] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 text- min-h-">
                <Search size={18} /> Rechercher
              </button>
            </div>
          </div>
        </form>

        {/* Quick links */}
        <div className="flex flex-wrap justify-center gap-2 mt-8 px-4">
          {[{l:"Studio+",h:"/services/studio",I:Camera},{l:"Voyages",h:"/services/tourisme",I:Waves},{l:"Hébergement",h:"/services/hebergement",I:Hotel},{l:"Événements",h:"/services/evenements",I:PartyPopper}].map(({l,h,I}) => (
            <Link key={h} href={h} className="bg-white/10 backdrop-blur-md border border-white/15 text-white px-4 py-2 rounded-full text-xs sm:text-sm hover:bg-white/20 active:scale-95 transition-all">
              <span className="flex items-center gap-1.5"><I size={14} className="text-[#c9a84c]" />{l}</span>
            </Link>
          ))}
        </div>

        {/* Stats */}
        <div className="flex gap-8 sm:gap-12 mt-12 pt-8 border-t border-white/10">
          {stats.map(s => (
            <div key={s.label} className="text-center">
              <p className="text-2xl sm:text-3xl font-black text-[#c9a84c]">{s.value}</p>
              <p className="text- sm:text-xs text-white/60 uppercase tracking-wider mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}