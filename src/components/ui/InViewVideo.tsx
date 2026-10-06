"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/motion";

type Props = {
  src: string;
  poster: string;
  label: string;
  className?: string;
};

/**
 * Muted, looping, inline video that only plays while it is on screen.
 * Under reduced motion it never autoplays and shows native controls instead.
 */
export function InViewVideo({ src, poster, label, className }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const video = ref.current;
    if (!video || reduced) return;
    video.muted = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          video.play().catch(() => {
            // Autoplay can be refused (data saver, power saving). The poster stays.
          });
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(video);
    return () => {
      observer.disconnect();
      video.pause();
    };
  }, [reduced]);

  return (
    <video
      ref={ref}
      className={className}
      src={src}
      poster={poster}
      aria-label={label}
      muted
      playsInline
      loop
      preload="none"
      controls={reduced}
    />
  );
}
