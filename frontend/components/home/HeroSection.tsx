"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, MapPin, Calendar, Users, Search, Target, Camera, Waves, Hotel, PartyPopper } from "lucide-react";

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

export default function HeroSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [service, setService] = useState("");
  const [destination, setDestination] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => setCurrentSlide((p) => (p + 1) % CAROUSEL_IMAGES.length), []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams({
      q: searchQuery,
      service: service,
      dest: destination
    });
    router.push(`/recherche?${params.toString()}`);
  }

  return (
    <section className="relative min-h-[90vh] flex items-center -mt-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="flex h-full transition-transform duration-1000 ease-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {CAROUSEL_IMAGES.map(img => <img key={img.src} src={img.src} alt={img.alt} className="w-full h-full object-cover flex-shrink-0" />)}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90" />
      </div>

      <div className="relative z-20 w-full max-w-6xl mx-auto px-6 pt-40 pb-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-xl px-5 py-2.5 rounded-full mb-8">
          <span className="w-2.5 h-2.5 bg-[#c9a84c] rounded-full animate-pulse" />
          <span className="text-sm tracking-widest uppercase text-white font-medium">Littoral Ivoirien · Depuis 2020</span>
        </div>

        <h1 className="text-white font-black tracking-tighter leading-[0.95] mb-12">
          <span className="block text-5xl lg:text-7xl">Bienvenue chez</span>
          <span className="block text-5xl lg:text-7xl mt-4">
            <span className="bg-gradient-to-r from-[#c9a84c] to-[#e0c070] bg-clip-text text-transparent">CÔTIÈRE</span>
            <span className="text-white/70 font-light ml-4 text-4xl lg:text-6xl">Media Group</span>
          </span>
        </h1>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="w-full max-w-5xl mb-16">
          <div className="bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row items-stretch divide-y md:divide-y-0 md:divide-x divide-gray-100">
            
            {/* Recherche Libre */}
            <div className="flex-1 px-6 py-5 text-left border-r border-gray-100">
              <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Que cherchez-vous ?</p>
              <input 
                type="text"
                placeholder="Hôtels, événements, studio..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm font-semibold outline-none bg-transparent mt-1 text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {/* Service */}
            <div className="flex-1 px-6 py-5 text-left border-r border-gray-100">
              <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Service</p>
              <select value={service} onChange={(e) => setService(e.target.value)} className="w-full text-sm font-semibold outline-none bg-transparent mt-1 text-gray-900 cursor-pointer">
                <option value="">Tous les services</option>
                <option value="Studio">Studio+</option>
                <option value="Hebergement">Hébergement</option>
                <option value="Tourisme">Tourisme</option>
              </select>
            </div>

            {/* Ville */}
            <div className="flex-1 px-6 py-5 text-left border-r border-gray-100">
              <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Destination</p>
              <input 
                type="text" 
                placeholder="Ville..." 
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full text-sm font-semibold outline-none bg-transparent mt-1 text-gray-900"
              />
            </div>

            {/* Submit */}
            <button type="submit" className="bg-[#c9a84c] hover:bg-[#b8973b] text-white font-bold px-10 py-5 md:py-0 transition-all flex items-center justify-center gap-2">
              <Search size={20} /> Rechercher
            </button>
          </div>
        </form>

        {/* Stats */}
        <div className="flex gap-12 mt-12 pt-10 border-t border-white/10">
          {stats.map(s => (
            <div key={s.label} className="text-center">
              <p className="text-4xl font-black text-[#c9a84c]">{s.value}</p>
              <p className="text-sm text-white/60 uppercase tracking-widest mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}