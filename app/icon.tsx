import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Dynamic favicon: deep blue square with a white "R"
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#111827",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 800,
          fontSize: 22,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        R
      </div>
    ),
    { ...size }
  );
}
