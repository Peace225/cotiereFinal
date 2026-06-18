import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Côtière - Tourisme & Voyage";

export default async function OGImage() {
  const fontUrl = "https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2JL7SUc.woff2";
  
  const fontData = await fetch(fontUrl, { cache: "force-cache" })
    .then(res => res.arrayBuffer())
    .catch(() => null);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0c4a6e 0%, #38bdf8 100%)",
          fontFamily: '"Inter", sans-serif',
        }}
      >
        <div style={{
          color: "#c9a84c",
          fontSize: 24,
          fontWeight: 700,
          letterSpacing: 4,
          textTransform: "uppercase",
        }}>
          CÔTIÈRE MEDIA GROUP
        </div>
        <div style={{
          color: "white",
          fontSize: 64,
          fontWeight: 900,
          marginTop: 16,
        }}>
          Tourisme & Voyage
        </div>
        <div style={{
          color: "rgba(255,255,255,0.8)",
          fontSize: 28,
          marginTop: 12,
        }}>
          Découvrez le littoral ivoirien
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fontData ? [{
        name: "Inter",
        data: fontData,
        weight: 900,
        style: "normal",
      }] : [],
    }
  );
}