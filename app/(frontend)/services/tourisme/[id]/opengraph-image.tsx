import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  // Chargement de la police depuis le dossier public
  // Assurez-vous que le chemin est correct par rapport à l'emplacement de ce fichier
  let fontData;
  try {
    fontData = await fetch(
      new URL("../../../public/fonts/Inter-Bold.ttf", import.meta.url)
    ).then((res) => res.arrayBuffer());
  } catch (e) {
    console.error("Police non trouvée, utilisation du fallback par défaut");
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0c4a6e, #38bdf8)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 16,
          fontFamily: fontData ? 'Inter' : 'sans-serif',
        }}
      >
        <div
          style={{
            color: "#c9a84c",
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          CÔTIÈRE MEDIA GROUP
        </div>
        <div
          style={{
            color: "white",
            fontSize: 60,
            fontWeight: 900,
            textAlign: "center",
          }}
        >
          Tourisme & Voyage
        </div>
        <div
          style={{
            color: "rgba(255,255,255,0.7)",
            fontSize: 24,
          }}
        >
          Découvrez le littoral ivoirien
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fontData
        ? [{ name: "Inter", data: fontData, style: "normal", weight: 700 }]
        : [],
    }
  );
}