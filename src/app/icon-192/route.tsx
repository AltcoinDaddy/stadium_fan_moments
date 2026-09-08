import { ImageResponse } from "next/og";

export const runtime = "edge";

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0B0E11",
          color: "#ff5540",
          display: "flex",
          height: "100%",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 108,
          fontWeight: 900,
          letterSpacing: -12,
          border: "6px solid #00eefc",
          borderRadius: 42,
        }}
      >
        M
      </div>
    ),
    { width: 192, height: 192 }
  );
}
