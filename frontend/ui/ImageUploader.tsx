"use client";

import { Upload, X } from "lucide-react";
import { useState, useRef } from "react";

interface ImageUploaderProps {
  onUpload: (url: string) => void;
}

export default function ImageUploader({ onUpload }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    // Lecture du fichier pour le transformer en URL (Base64)
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreview(result);
      onUpload(result); // Envoie l'URL au composant parent
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview(null);
    onUpload(""); // Efface l'URL dans le composant parent
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full mt-2">
      {!preview ? (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-2 text-gray-400" />
            <p className="mb-1 text-sm text-gray-500 font-semibold">
              {isUploading ? "Chargement..." : "Cliquez pour uploader"}
            </p>
            <p className="text-xs text-gray-400">PNG, JPG, GIF jusqu'à 5MB</p>
          </div>
          <input 
            ref={fileInputRef}
            type="file" 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange} 
            disabled={isUploading}
          />
        </label>
      ) : (
        <div className="relative w-full h-32 rounded-xl border border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={preview} 
            alt="Aperçu" 
            className="max-h-full max-w-full object-contain" 
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-sm"
            title="Supprimer l'image"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}