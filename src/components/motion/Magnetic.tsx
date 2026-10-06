"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { FINE_POINTER, REDUCED_MOTION } from "@/lib/motion";
import { cn } from "@/lib/utils";

type MagneticProps = {
  children: ReactNode;
  /** Share of the pointer offset the element follows. */
  strength?: number;
  className?: string;
};

/**
 * Pulls its child toward the pointer while hovered. Reserved for primary CTAs
 * and nav links. Off on touch and under reduced motion.
 */
export function Magnetic({ children, strength = 0.3, className }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const element = ref.current;
      if (!element) return;
      if (!window.matchMedia(FINE_POINTER).matches) return;
      if (window.matchMedia(REDUCED_MOTION).matches) return;

      const xTo = gsap.quickTo(element, "x", { duration: 0.6, ease: "expo.out" });
      const yTo = gsap.quickTo(element, "y", { duration: 0.6, ease: "expo.out" });
      let center = { x: 0, y: 0 };

      const onEnter = () => {
        // Measure once, untransformed, so the pull doesn't feed back into itself.
        const rect = element.getBoundingClientRect();
        const x = Number(gsap.getProperty(element, "x"));
        const y = Number(gsap.getProperty(element, "y"));
        center = { x: rect.left - x + rect.width / 2, y: rect.top - y + rect.height / 2 };
      };
      const onMove = (event: PointerEvent) => {
        xTo((event.clientX - center.x) * strength);
        yTo((event.clientY - center.y) * strength);
      };
      const onLeave = () => {
        xTo(0);
        yTo(0);
      };

      element.addEventListener("pointerenter", onEnter);
      element.addEventListener("pointermove", onMove);
      element.addEventListener("pointerleave", onLeave);
      return () => {
        element.removeEventListener("pointerenter", onEnter);
        element.removeEventListener("pointermove", onMove);
        element.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className={cn("inline-block", className)}>
      {children}
    </span>
  );
}
