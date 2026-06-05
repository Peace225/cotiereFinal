"use client";
import { useState, useRef } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

type Props = {
  images: string[];
  alt: string;
  activeImg: number;
  setActiveImg: (i: number) => void;
};

export default function ImageZoom({ images, alt, activeImg, setActiveImg }: Props) {
  const [zoomed, setZoomed] = useState(false);
  const thumbsRef = useRef<HTMLDivElement>(null);

  const prev = () => {
    const idx = (activeImg - 1 + images.length) % images.length;
    setActiveImg(idx);
    scrollThumbIntoView(idx);
  };

  const next = () => {
    const idx = (activeImg + 1) % images.length;
    setActiveImg(idx);
    scrollThumbIntoView(idx);
  };

  function scrollThumbIntoView(idx: number) {
    if (!thumbsRef.current) return;
    const thumb = thumbsRef.current.children[idx] as HTMLElement;
    if (thumb) thumb.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }

  function handleThumbClick(i: number) {
    setActiveImg(i);
    scrollThumbIntoView(i);
  }

  return (
    <>
      {/* Image principale */}
      <div
        className="relative h-64 sm:h-80 cursor-zoom-in group select-none"
        onClick={() => setZoomed(true)}
      >
        <img
          src={images[activeImg]}
          alt={alt}
          className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-90"
          draggable={false}
        />

        {/* Overlay zoom hint */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-black/40 rounded-full p-3">
            <ZoomIn size={24} className="text-white" />
          </div>
        </div>

        {/* Compteur */}
        {images.length > 1 && (
          <div className="absolute top-3 left-3 bg-black/50 text-white text-xs font-semibold px-2.5 py-1 rounded-full pointer-events-none">
            {activeImg + 1} / {images.length}
          </div>
        )}

        {/* Flèches navigation */}
        {images.length > 1 && (
          <>
            <button
              onClick={e => { e.stopPropagation(); prev(); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow transition-all opacity-80 hover:opacity-100"
              aria-label="Image précédente"
            >
              <ChevronLeft size={18} className="text-[#0c4a6e]" />
            </button>
            <button
              onClick={e => { e.stopPropagation(); next(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow transition-all opacity-80 hover:opacity-100"
              aria-label="Image suivante"
            >
              <ChevronRight size={18} className="text-[#0c4a6e]" />
            </button>

            {/* Indicateurs dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 pointer-events-none">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={"h-1.5 rounded-full transition-all " + (i === activeImg ? "bg-white w-4" : "bg-white/50 w-1.5")}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Miniatures scrollables */}
      {images.length > 1 && (
        <div
          ref={thumbsRef}
          className="flex gap-2 p-3 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent"
          style={{ scrollbarWidth: "thin" }}
        >
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => handleThumbClick(i)}
              className={
                "shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all " +
                (i === activeImg
                  ? "border-[#c9a84c] opacity-100 scale-105"
                  : "border-transparent opacity-60 hover:opacity-90 hover:border-gray-300")
              }
              aria-label={`Image ${i + 1}`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" draggable={false} />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox / Zoom plein écran */}
      {zoomed && (
        <div
          className="fixed inset-0 bg-black/95 z-[200] flex flex-col items-center justify-center"
          onClick={() => setZoomed(false)}
        >
          {/* Bouton fermer */}
          <button
            onClick={() => setZoomed(false)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
            aria-label="Fermer"
          >
            <X size={22} />
          </button>

          {/* Compteur lightbox */}
          {images.length > 1 && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-sm font-semibold px-3 py-1 rounded-full z-10">
              {activeImg + 1} / {images.length}
            </div>
          )}

          {/* Flèches lightbox */}
          {images.length > 1 && (
            <>
              <button
                onClick={e => { e.stopPropagation(); prev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/15 hover:bg-white/30 rounded-full flex items-center justify-center transition-all z-10"
                aria-label="Image précédente"
              >
                <ChevronLeft size={26} className="text-white" />
              </button>
              <button
                onClick={e => { e.stopPropagation(); next(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/15 hover:bg-white/30 rounded-full flex items-center justify-center transition-all z-10"
                aria-label="Image suivante"
              >
                <ChevronRight size={26} className="text-white" />
              </button>
            </>
          )}

          {/* Image zoomée */}
          <img
            src={images[activeImg]}
            alt={alt}
            className="max-w-[92vw] max-h-[80vh] object-contain rounded-xl shadow-2xl"
            onClick={e => e.stopPropagation()}
            draggable={false}
          />

          {/* Miniatures lightbox scrollables */}
          {images.length > 1 && (
            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 px-4 overflow-x-auto max-w-[90vw]"
              style={{ scrollbarWidth: "none" }}
              onClick={e => e.stopPropagation()}
            >
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={e => { e.stopPropagation(); handleThumbClick(i); }}
                  className={
                    "shrink-0 w-14 h-10 rounded-lg overflow-hidden border-2 transition-all " +
                    (i === activeImg
                      ? "border-[#c9a84c] opacity-100"
                      : "border-white/20 opacity-50 hover:opacity-80")
                  }
                >
                  <img src={img} alt="" className="w-full h-full object-cover" draggable={false} />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
