import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function BlogOpengraphImage() {
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
            "linear-gradient(145deg, rgb(2, 6, 23), rgb(30, 58, 138), rgb(67, 56, 202))",
          color: "white",
          padding: "64px",
        }}
      >
        <div style={{ fontSize: 30, opacity: 0.82 }}>Dr. Portfolio</div>
        <div style={{ fontSize: 74, fontWeight: 700, marginTop: 16 }}>Medical Blog</div>
        <div style={{ fontSize: 34, marginTop: 18, opacity: 0.92 }}>
          Expert health tips, clinical insights, and practical wellness advice
        </div>
      </div>
    ),
    size,
  );
}
