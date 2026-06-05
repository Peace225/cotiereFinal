import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    <div style={{ background: "linear-gradient(135deg, #0c4a6e, #38bdf8)", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
      <div style={{ color: "#c9a84c", fontSize: 24, fontWeight: 700, letterSpacing: 4 }}>CÔTIÈRE MEDIA GROUP</div>
      <div style={{ color: "white", fontSize: 48, fontWeight: 900 }}>Tourisme & Voyage</div>
      <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 20 }}>Découvrez le littoral ivoirien</div>
    </div>
  );
}
