/**
 * Shared content types. Everything the site says lives in `src/content/`,
 * typed against these shapes, so rebranding never touches a component.
 */

export type Ratio = "9:16" | "4:5" | "1:1" | "16:9";

/** Placeholder fills. Badge red is excluded on purpose: it is never decorative. */
export type Tone = "midnight" | "dusk" | "lilac" | "haze" | "screenlight";

type VisualBase = {
  /** Stable slot id. Also the suggested file name in `/public/media`. */
  id: string;
  ratio: Ratio;
  /** What the final asset should be. Shown on the placeholder until `src` exists. */
  label: string;
  /** Describes the final asset. Update it when the real media lands. */
  alt: string;
  tone: Tone;
};

export type ImageVisual = VisualBase & {
  kind?: "image";
  src?: string;
};

export type VideoVisual = VisualBase & { kind: "video" } & (
    { src?: undefined; poster?: string } | { src: string; poster: string }
  );

export type Visual = ImageVisual | VideoVisual;

export type Link = {
  href: string;
  label: string;
};

export type Metric = {
  value: string;
  label: string;
};

export type Quote = {
  quote: string;
  name: string;
  role: string;
};
