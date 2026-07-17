import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, rgb(15, 23, 42), rgb(30, 64, 175), rgb(37, 99, 235))",
          color: "white",
          padding: "64px",
        }}
      >
        <div style={{ fontSize: 34, opacity: 0.85 }}>Dr. Portfolio</div>
        <div style={{ fontSize: 72, fontWeight: 700, marginTop: 18, lineHeight: 1.08 }}>
          Compassionate, Patient-First Medical Care
        </div>
        <div style={{ fontSize: 34, marginTop: 22, opacity: 0.92 }}>
          Preventive care, wellness guidance, and trusted treatment in San Francisco
        </div>
      </div>
    ),
    size,
  );
}
