import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export const alt = "Recurse — The Technical Club of KMIT";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          color: "#ffffff",
          background: "#080a09",
          fontFamily: "Arial, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "470px",
            height: "470px",
            right: "-90px",
            top: "80px",
            border: "2px solid rgba(168,255,53,.32)",
            borderRadius: "999px",
            boxShadow: "inset 0 0 0 85px rgba(168,255,53,.025)",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: "22px" }}>
          <div
            style={{
              width: "72px",
              height: "72px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#080a09",
              background: "#a8ff35",
              fontSize: "25px",
              fontWeight: 800,
            }}
          >
            R/
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "1px" }}>RECURSE</span>
            <span style={{ color: "#a8ff35", fontSize: "15px", letterSpacing: "3px" }}>KMIT TECHNICAL CLUB</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", position: "relative" }}>
          <span style={{ color: "#a8ff35", fontSize: "18px", letterSpacing: "3px", marginBottom: "20px" }}>
            CODE / BUILD / BREAK / REPEAT
          </span>
          <span style={{ fontSize: "84px", fontWeight: 800, letterSpacing: "-6px", lineHeight: 0.9 }}>
            TOO CURIOUS
          </span>
          <span style={{ color: "#a8ff35", fontSize: "84px", fontWeight: 800, letterSpacing: "-6px", lineHeight: 0.95 }}>
            TO STOP.
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(255,255,255,.55)", fontSize: "16px", letterSpacing: "1px" }}>
          <span>THE TECHNICAL CLUB OF KESHAV MEMORIAL INSTITUTE OF TECHNOLOGY</span>
          <span style={{ color: "#a8ff35" }}>HYDERABAD / INDIA</span>
        </div>
      </div>
    ),
    size,
  );
}
