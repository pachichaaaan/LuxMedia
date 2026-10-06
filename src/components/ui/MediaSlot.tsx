import Image from "next/image";
import type { CSSProperties } from "react";
import type { Ratio, Tone, Visual } from "@/content/types";
import { cn, type DistributiveOmit } from "@/lib/utils";
import { InViewVideo } from "./InViewVideo";

const RATIO: Record<Ratio, string> = {
  "9:16": "9 / 16",
  "4:5": "4 / 5",
  "1:1": "1 / 1",
  "16:9": "16 / 9",
};

const TONE_HEX: Record<Tone, string> = {
  midnight: "#1b1638",
  dusk: "#6e6a8a",
  lilac: "#a99cff",
  haze: "#e6e2ff",
  screenlight: "#f3f4f8",
};

/** A 1×1 SVG in the slot's tone, used as the placeholder while a real image loads. */
const tonePlaceholder = (tone: Tone) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"><rect width="1" height="1" fill="${TONE_HEX[tone]}"/></svg>`,
  )}` as const;

export type MediaSlotProps = DistributiveOmit<Visual, "id"> & {
  id?: string;
  /** Required: the rendered width at each breakpoint, so next/image picks the right file. */
  sizes: string;
  /** Load immediately with high priority. Only for the LCP candidate. */
  eager?: boolean;
  /** Fill the positioned parent instead of sizing from the ratio. */
  fill?: boolean;
  /** Optional blur data URL for string sources. */
  blurDataURL?: string;
  /** Hide the placeholder label (when a frame shows its own chrome). */
  hideLabel?: boolean;
  className?: string;
  style?: CSSProperties;
};

/**
 * Every image and video on the site goes through this slot. Without `src`
 * it renders an art-directed placeholder: tone fill, film grain, and a label
 * describing the asset that belongs there.
 */
export function MediaSlot(props: MediaSlotProps) {
  const { ratio, alt, label, tone, sizes, eager, fill, hideLabel, className, style } = props;

  // Only 9:16 frames are rounded; inside a frame (fill) the frame does the clipping.
  const rounded = ratio === "9:16" && !fill;
  const box = cn(
    "overflow-hidden",
    fill ? "absolute inset-0" : "relative w-full",
    rounded && "rounded-frame",
    `media-tone-${tone}`,
    className,
  );
  const boxStyle: CSSProperties = fill ? { ...style } : { aspectRatio: RATIO[ratio], ...style };

  if (!props.src) {
    return (
      <div role="img" aria-label={alt} className={box} style={boxStyle} data-media-slot={props.id}>
        <span aria-hidden className="media-grain absolute inset-0" />
        {!hideLabel && (
          <span aria-hidden className="absolute inset-0 grid place-items-center p-5">
            <span className="max-w-[20ch] text-center text-small text-balance">{label}</span>
          </span>
        )}
      </div>
    );
  }

  if (props.kind === "video") {
    return (
      <div className={box} style={boxStyle} data-media-slot={props.id}>
        <InViewVideo
          src={props.src}
          poster={props.poster}
          label={alt}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className={box} style={boxStyle} data-media-slot={props.id}>
      <Image
        src={props.src}
        alt={alt}
        fill
        sizes={sizes}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : undefined}
        placeholder={props.blurDataURL ? "blur" : tonePlaceholder(tone)}
        blurDataURL={props.blurDataURL}
        className="object-cover"
      />
    </div>
  );
}
