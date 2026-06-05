import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: "#020617",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto",
        }}
      >
        {/* Background image littoral */}
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80"
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.35,
          }}
        />

        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(105deg, rgba(2,6,23,0.95) 0%, rgba(12,74,110,0.85) 50%, rgba(2,6,23,0.9) 100%)",
          }}
        />

        {/* Gold radial glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 600,
            height: 600,
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle, rgba(201,168,76,0.25) 0%, transparent 60%)",
            filter: "blur(40px)",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "80px",
            width: "100%",
            height: "100%",
          }}
        >
          {/* Top badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 32,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: "linear-gradient(135deg, #c9a84c, #e0c070)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                fontWeight: 900,
                color: "#020617",
              }}
            >
              C
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span
                style={{
                  color: "#c9a84c",
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                }}
              >
                CÔTIÈRE MEDIA GROUP
              </span>
              <span
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontSize: 12,
                  marginTop: 2,
                }}
              >
                1er site officiel du littoral ivoirien
              </span>
            </div>
          </div>

          {/* Main title */}
          <h1
            style={{
              fontSize: 84,
              fontWeight: 900,
              lineHeight: 0.9,
              letterSpacing: "-0.02em",
              color: "white",
              margin: 0,
              marginBottom: 16,
              textShadow: "0 4px 24px rgba(0,0,0,0.5)",
            }}
          >
            Tourisme
            <br />
            <span
              style={{
                background: "linear-gradient(90deg, #c9a84c 0%, #e0c070 50%, #c9a84c 100%)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              & Voyage
            </span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 24,
              color: "rgba(255,255,255,0.75)",
              margin: 0,
              marginBottom: 40,
              maxWidth: 600,
              lineHeight: 1.4,
            }}
          >
            Découvrez Grand-Bassam, Assinie, Jacqueville et 10 autres destinations avec nos guides certifiés
          </p>

          {/* Bottom pills */}
          <div style={{ display: "flex", gap: 12 }}>
            {["Excursions", "Hébergement", "Guides 6 langues"].map((tag) => (
              <div
                key={tag}
                style={{
                  padding: "8px 16px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  backdropFilter: "blur(8px)",
                  color: "rgba(255,255,255,0.9)",
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom right URL */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            right: 80,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: "#22c55e",
            }}
          />
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 16, fontWeight: 500 }}>
            cotiere.ci
          </span>
        </div>

        {/* Gold top line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "linear-gradient(90deg, transparent, #c9a84c, transparent)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}