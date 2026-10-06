import { brand } from "@/content/brand";
import { OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = `${brand.name}: ${brand.tagline}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpenGraphImage() {
  return renderOgImage({ kicker: brand.name, headline: brand.tagline, footer: brand.descriptor });
}
