"use client";
import { useRef, useState } from "react";
import { Upload, Library, X, ImageIcon } from "lucide-react";

type Props = {
  value: string; // URLs séparées par virgule
  onChange: (val: string) => void;
  maxFiles?: number;
};

export default function ImageUploader({ value, onChange, maxFiles = 10 }: Props) {
  const [tab, setTab] = useState<"upload" | "library">("upload");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const images = value ? value.split(",").map(s => s.trim()).filter(Boolean) : [];

  async function uploadFiles(files: FileList | File[]) {
    const arr = Array.from(files).filter(f => f.type.startsWith("image/"));
    if (arr.length === 0) return;
    if (images.length + arr.length > maxFiles) {
      alert(`Maximum ${maxFiles} images autorisées`);
      return;
    }
    setUploading(true);
    const fd = new FormData();
    arr.forEach(f => fd.append("files", f));
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.data?.urls?.length > 0) {
        onChange([...images, ...data.data.urls].join(", "));
      } else {
        alert("Erreur lors de l'upload de l'image");
      }
    } catch {
      alert("Erreur lors de l'upload de l'image");
    }
    setUploading(false);
  }

  function removeImage(i: number) {
    onChange(images.filter((_, idx) => idx !== i).join(", "));
  }

  function handleUrlPaste(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      const val = (e.target as HTMLInputElement).value.trim();
      if (val && images.length < maxFiles) {
        onChange([...images, val].join(", "));
        (e.target as HTMLInputElement).value = "";
      }
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl w-fit">
        <button type="button" onClick={() => setTab("upload")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "upload" ? "bg-[#0c4a6e] text-white shadow" : "text-gray-500 hover:text-gray-700"}`}>
          <Upload size={14} /> Uploader
        </button>
        <button type="button" onClick={() => setTab("library")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "library" ? "bg-[#0c4a6e] text-white shadow" : "text-gray-500 hover:text-gray-700"}`}>
          <Library size={14} /> Bibliothèque
        </button>
      </div>

      {tab === "upload" && (
        <div>
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif"
            multiple className="hidden" onChange={e => uploadFiles(e.target.files!)} />

          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); uploadFiles(e.dataTransfer.files); }}
            className={`border-2 border-dashed rounded-xl p-4 transition-colors ${dragOver ? "border-[#38bdf8] bg-[#f0f9ff]" : "border-gray-200 bg-gray-50"}`}>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 bg-[#0c4a6e] hover:bg-[#0a3d5c] text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors disabled:opacity-60 shrink-0">
                <Upload size={14} />
                {uploading ? "Envoi..." : "Sélect. fichiers"}
              </button>
              <span className="text-sm text-gray-500">
                {images.length > 0 ? `${images.length} fichier${images.length > 1 ? "s" : ""}` : "Aucun fichier"}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-2">JPG, PNG, WEBP · Max 5MB · Sélection multiple possible (jusqu'à {maxFiles} images)</p>
            <p className="text-xs text-gray-400">Ou glissez-déposez vos images ici</p>
          </div>

          <input type="text" placeholder="Ou coller une URL et appuyer sur Entrée..."
            className="mt-2 w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#38bdf8] text-gray-500"
            onKeyDown={handleUrlPaste} />
        </div>
      )}

      {tab === "library" && (
        <div className="border border-gray-200 rounded-xl p-4 min-h-[100px]">
          {images.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-20 text-gray-400 gap-2">
              <ImageIcon size={24} />
              <p className="text-xs">Aucune image. Uploadez d'abord des images.</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {images.map((url, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden border-2 border-[#c9a84c]">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#c9a84c] rounded-full flex items-center justify-center">
                    <svg viewBox="0 0 12 12" fill="white" className="w-2.5 h-2.5"><path d="M10 3L5 8.5 2 5.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Aperçu avec suppression */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {images.map((url, i) => (
            <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 group shrink-0">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button type="button" onClick={() => removeImage(i)}
                className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
