"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { setLenis } from "@/lib/scroll";

/**
 * One Lenis instance, driven by the GSAP ticker so smooth scroll and
 * ScrollTrigger share a clock. Skipped entirely under reduced motion.
 */
export function SmoothScroll() {
  useEffect(() => {
    // Fonts change line breaks, which moves every trigger.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      lerp: 0.1,
      autoRaf: false,
      anchors: true,
      stopInertiaOnNavigate: true,
    });
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // The preloader owns the screen until it finishes.
    if (document.documentElement.hasAttribute("data-preload")) lenis.stop();

    setLenis(lenis);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
