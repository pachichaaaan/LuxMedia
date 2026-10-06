import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { brand } from "@/content/brand";

export const OG_SIZE = { width: 1200, height: 630 };

const poppinsBold = () => readFile(join(process.cwd(), "src/assets/fonts/Poppins-Bold.ttf"));

type OgCard = {
  /** Small line above the headline. */
  kicker: string;
  headline: string;
  /** Small line at the bottom. */
  footer: string;
};

/** Social cards: midnight, Poppins Bold, one big statement. Same system as the site. */
export async function renderOgImage({ kicker, headline, footer }: OgCard) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 72px",
        backgroundColor: "#1b1638",
        color: "#f3f4f8",
        fontFamily: "Poppins",
      }}
    >
      <div style={{ display: "flex", fontSize: 30, letterSpacing: "-0.01em" }}>{kicker}</div>
      <div
        style={{
          display: "flex",
          fontSize: headline.length > 48 ? 84 : 104,
          lineHeight: 0.92,
          letterSpacing: "-0.045em",
          maxWidth: 1000,
        }}
      >
        {headline}
      </div>
      <div style={{ display: "flex", fontSize: 26, color: "rgba(243, 244, 248, 0.78)" }}>
        {footer}
      </div>
    </div>,
    {
      ...OG_SIZE,
      fonts: [{ name: "Poppins", data: await poppinsBold(), weight: 700, style: "normal" }],
    },
  );
}

/** Square brand mark for icons: the initial on midnight. */
export async function renderIcon(size: number) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1b1638",
        color: "#f3f4f8",
        fontFamily: "Poppins",
        fontSize: size * 0.72,
        letterSpacing: "-0.04em",
        paddingBottom: size * 0.04,
      }}
    >
      {brand.name.replace(/^The\s+/i, "").charAt(0)}
    </div>,
    {
      width: size,
      height: size,
      fonts: [{ name: "Poppins", data: await poppinsBold(), weight: 700, style: "normal" }],
    },
  );
}
