"use client";

import type Lenis from "lenis";
import { useEffect } from "react";
import { loadGsap, scrollTrigger } from "@/lib/gsap";
import { afterFirstIdle } from "@/lib/idle";
import { prefersReducedMotion } from "@/lib/motion";
import { setLenis } from "@/lib/scroll";

/**
 * One Lenis instance, driven by the GSAP ticker so smooth scroll and
 * ScrollTrigger share a clock. Skipped entirely under reduced motion. Both
 * libraries load after first paint; until then the page scrolls natively.
 */
export function SmoothScroll() {
  useEffect(() => {
    let cancelled = false;
    let teardown: (() => void) | undefined;

    const lenisModule = prefersReducedMotion()
      ? null
      : afterFirstIdle().then(() => import("lenis"));
    Promise.all([loadGsap(), lenisModule]).then(([{ gsap }, lenisModule]) => {
      if (cancelled) return;
      // Fonts change line breaks, which moves every trigger.
      document.fonts?.ready.then(() => scrollTrigger()?.refresh());
      if (!lenisModule) return;

      const lenis: Lenis = new lenisModule.default({
        lerp: 0.1,
        autoRaf: false,
        anchors: true,
        stopInertiaOnNavigate: true,
      });
      lenis.on("scroll", () => scrollTrigger()?.update());
      gsap.ticker.lagSmoothing(0);

      // Tick only while a smooth scroll is in flight, so an idle page costs
      // nothing per frame. Input and programmatic scrolls wake it back up.
      let ticking = false;
      const tick = (time: number) => {
        lenis.raf(time * 1000);
        if (!lenis.isScrolling) sleep();
      };
      const wake = () => {
        if (ticking) return;
        ticking = true;
        gsap.ticker.add(tick);
      };
      const sleep = () => {
        if (!ticking) return;
        ticking = false;
        gsap.ticker.remove(tick);
      };
      lenis.on("virtual-scroll", wake);
      const scrollTo = lenis.scrollTo.bind(lenis);
      lenis.scrollTo = (...args: Parameters<Lenis["scrollTo"]>) => {
        wake();
        scrollTo(...args);
      };
      wake();

      // The preloader owns the screen until it finishes.
      if (document.documentElement.hasAttribute("data-preload")) lenis.stop();

      setLenis(lenis);
      teardown = () => {
        sleep();
        lenis.destroy();
        setLenis(null);
      };
    });

    return () => {
      cancelled = true;
      teardown?.();
    };
  }, []);

  return null;
}
