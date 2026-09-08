import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
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
          fontSize: 290,
          fontWeight: 900,
          letterSpacing: -32,
          border: "16px solid #00eefc",
          borderRadius: 110,
        }}
      >
        M
      </div>
    ),
    size
  );
}
