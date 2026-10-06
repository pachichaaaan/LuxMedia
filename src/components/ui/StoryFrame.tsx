import type { ReactNode } from "react";
import type { Tone } from "@/content/types";
import { cn } from "@/lib/utils";

type StoryFrameProps = {
  /** Number of progress segments across the top edge. */
  segments: number;
  tone: Tone;
  /** Handle shown top-left, under the segments. */
  handle?: ReactNode;
  /** Shown top-right: the chapter year. */
  meta?: ReactNode;
  children?: ReactNode;
  className?: string;
};

/**
 * The 9:16 Story frame: 28px radius, segmented progress bars across the top,
 * and chrome in the tone's contrasting ink. Segment fills are scaled by
 * whoever drives the story (`[data-segment-fill]`).
 */
export function StoryFrame({ segments, tone, handle, meta, children, className }: StoryFrameProps) {
  return (
    <div
      className={cn(
        "relative aspect-[9/16] overflow-hidden rounded-frame",
        `media-tone-${tone}`,
        className,
      )}
    >
      {children}
      <div aria-hidden className="absolute inset-x-3 top-3 z-10 flex gap-1">
        {Array.from({ length: segments }, (_, index) => (
          <span key={index} className="story-segment">
            <span data-segment-fill className="story-segment-fill" />
          </span>
        ))}
      </div>
      {(handle || meta) && (
        <div className="absolute inset-x-4 top-7 z-10 flex items-baseline justify-between gap-3 text-small">
          <span className="flex items-center gap-2">{handle}</span>
          <span>{meta}</span>
        </div>
      )}
    </div>
  );
}
