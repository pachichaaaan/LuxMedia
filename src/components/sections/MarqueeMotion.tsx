"use client";

import { home } from "@/content/site";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { REDUCED_MOTION } from "@/lib/motion";

// Loaded in its own chunk after hydration (see motion-loaders.tsx).
gsap.registerPlugin(useGSAP);

/** One loop every 40 seconds at rest. */
const LOOP_SECONDS = 40;
const MAX_BOOST = 4;

/**
 * Linear drift, the only linear motion on the site. Scroll velocity adds
 * speed (up to 4×) and scroll direction sets which way it runs.
 */
export default function MarqueeMotion() {
  useGSAP(() => {
    const section = document.getElementById("clients");
    const strip = section?.querySelector<HTMLElement>("[data-marquee]");
    const first = section?.querySelector<HTMLElement>("[data-marquee-track]");
    const toggle = section?.querySelector<HTMLButtonElement>("[data-marquee-toggle]");
    if (!section || !strip || !first || !toggle) return;
    if (window.matchMedia(REDUCED_MOTION).matches) return;

    const setX = gsap.quickSetter(strip, "x", "px");
    let width = first.offsetWidth;
    let x = 0;
    let direction = -1;
    let boost = 0;
    let lastScroll = window.scrollY;
    let hovering = false;
    let userPaused = false;
    let onScreen = false;

    const tick = (_time: number, deltaMs: number) => {
      const scrolled = window.scrollY - lastScroll;
      lastScroll = window.scrollY;
      if (Math.abs(scrolled) > 0.5) {
        direction = scrolled > 0 ? -1 : 1;
        boost = Math.min(MAX_BOOST - 1, boost + Math.abs(scrolled) * 0.02);
      }
      boost *= 0.92;
      if (!width) return;
      const speed = (width / LOOP_SECONDS) * (1 + boost);
      x += direction * speed * (deltaMs / 1000);
      // Wrap within one track width so the clone always fills the gap.
      x = ((x % width) - width) % width;
      setX(x);
    };
    // Only tick while it can be seen and isn't paused; otherwise it costs nothing.
    let running = false;
    const sync = () => {
      const shouldRun = onScreen && !hovering && !userPaused;
      if (shouldRun === running) return;
      running = shouldRun;
      if (running) {
        lastScroll = window.scrollY;
        gsap.ticker.add(tick);
      } else {
        gsap.ticker.remove(tick);
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      onScreen = Boolean(entry?.isIntersecting);
      sync();
    });
    observer.observe(section);
    const resize = new ResizeObserver(() => {
      width = first.offsetWidth;
    });
    resize.observe(first);

    const onEnter = () => {
      hovering = true;
      sync();
    };
    const onLeave = () => {
      hovering = false;
      sync();
    };
    const onToggle = () => {
      userPaused = !userPaused;
      sync();
      toggle.textContent = userPaused ? home.clients.play : home.clients.pause;
      toggle.setAttribute(
        "aria-label",
        userPaused ? home.clients.playLabel : home.clients.pauseLabel,
      );
    };
    strip.addEventListener("pointerenter", onEnter);
    strip.addEventListener("pointerleave", onLeave);
    toggle.addEventListener("click", onToggle);

    return () => {
      gsap.ticker.remove(tick);
      observer.disconnect();
      resize.disconnect();
      strip.removeEventListener("pointerenter", onEnter);
      strip.removeEventListener("pointerleave", onLeave);
      toggle.removeEventListener("click", onToggle);
      gsap.set(strip, { clearProps: "transform" });
    };
  }, []);

  return null;
}
