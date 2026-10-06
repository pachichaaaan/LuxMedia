"use client";

import { home } from "@/content/site";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { provideScrollTrigger } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { REDUCED_MOTION } from "@/lib/motion";
import { INTRO_DONE, REVEAL_HERO, type RevealHeroDetail } from "@/lib/preload";

// Loaded in its own chunk after hydration (see motion-loaders.tsx).
gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);
provideScrollTrigger(ScrollTrigger);

const HOLD = 2.8;
const MOVE = 0.9;
/** How far each headline line drifts while the hero scrolls away, in yPercent. */
const DRIFT = [0, -6, -12, -18, -24];

/**
 * Everything that moves in the hero, in one place so the headline is split
 * exactly once: the line reveal (asked for by the preloader or a page
 * transition), the scroll drift, the frame easing back, and the feed.
 */
export default function HeroMotion() {
  useGSAP(() => {
    const section = document.getElementById("hero");
    const title = section?.querySelector<HTMLElement>("[data-hero-title]");
    const frame = section?.querySelector<HTMLElement>("[data-hero-frame]");
    const feed = section?.querySelector<HTMLElement>("[data-feed]");
    const track = section?.querySelector<HTMLElement>("[data-feed-track]");
    const toggle = section?.querySelector<HTMLButtonElement>("[data-feed-toggle]");
    if (!section || !title || !frame || !feed || !track || !toggle) return;
    if (window.matchMedia(REDUCED_MOTION).matches) return;

    const ctx = gsap.context(() => {});
    const cleanups: Array<() => void> = [];

    // Headline: masked lines. Masks drift on scroll; lines rise inside them on reveal.
    let lines: Element[] = [];
    let pendingReveal: number | null = null;
    let revealed = false;
    const reveal = (delay: number) => {
      if (revealed) return;
      if (!lines.length) {
        pendingReveal = delay;
        return;
      }
      revealed = true;
      ctx.add(() => {
        gsap.fromTo(
          lines,
          { yPercent: 135 },
          {
            yPercent: 0,
            duration: 0.9,
            stagger: 0.08,
            ease: "expo.out",
            delay,
            overwrite: true,
          },
        );
      });
    };

    ctx.add(() => {
      const desktop = window.matchMedia("(min-width: 768px)").matches;
      SplitText.create(title, {
        type: "lines",
        mask: "lines",
        // Line splits keep words intact, so the text reads normally as-is.
        aria: "none",
        autoSplit: true,
        onSplit(self) {
          gsap.set(self.masks, { paddingBlock: "0.14em", marginBlock: "-0.14em" });
          lines = self.lines;
          if (pendingReveal !== null) {
            const delay = pendingReveal;
            pendingReveal = null;
            reveal(delay);
          }
          if (!desktop) return;
          // Returned so SplitText rebuilds it on every re-split.
          return gsap.to(self.masks, {
            yPercent: (index: number) => DRIFT[index] ?? DRIFT[DRIFT.length - 1],
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom top",
              scrub: 0.6,
            },
          });
        },
      });

      if (desktop) {
        gsap.to(frame, {
          scale: 0.92,
          transformOrigin: "50% 0%",
          ease: "none",
          scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: 0.6 },
        });
      }
    });

    const onReveal = (event: Event) =>
      reveal((event as CustomEvent<RevealHeroDetail>).detail.delay);
    window.addEventListener(REVEAL_HERO, onReveal);
    // This chunk can arrive after a transition into home has already asked.
    if (document.documentElement.hasAttribute("data-transitioning")) reveal(0.12);
    cleanups.push(() => window.removeEventListener(REVEAL_HERO, onReveal));

    // Feed: hold, flick up one post, repeat. The last slot is a copy of the first.
    const slots = track.children.length;
    let index = 0;
    let userPaused = false;
    let hovering = false;
    let onScreen = true;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const advance = () => {
      index += 1;
      ctx.add(() => {
        gsap.to(track, {
          yPercent: -100 * index,
          duration: MOVE,
          ease: "power3.inOut",
          onComplete: () => {
            if (index === slots - 1) {
              index = 0;
              gsap.set(track, { yPercent: 0 });
            }
            schedule();
          },
        });
      });
    };
    const schedule = () => {
      clearTimeout(timer);
      if (userPaused || hovering || !onScreen) return;
      // A plain timeout, so GSAP's ticker can sleep through the hold.
      timer = setTimeout(advance, HOLD * 1000);
    };
    const pauseFor = (state: () => void) => {
      state();
      if (userPaused || hovering || !onScreen) clearTimeout(timer);
      else schedule();
    };

    const onEnter = () => pauseFor(() => (hovering = true));
    const onLeave = () => pauseFor(() => (hovering = false));
    feed.addEventListener("pointerenter", onEnter);
    feed.addEventListener("pointerleave", onLeave);
    const onToggle = () => {
      pauseFor(() => (userPaused = !userPaused));
      toggle.textContent = userPaused ? home.hero.play : home.hero.pause;
    };
    toggle.addEventListener("click", onToggle);
    const observer = new IntersectionObserver(([entry]) =>
      pauseFor(() => (onScreen = Boolean(entry?.isIntersecting))),
    );
    observer.observe(feed);
    cleanups.push(() => {
      feed.removeEventListener("pointerenter", onEnter);
      feed.removeEventListener("pointerleave", onLeave);
      toggle.removeEventListener("click", onToggle);
      observer.disconnect();
      clearTimeout(timer);
    });

    // Don't start posting until the preloader has handed over the screen.
    if (document.documentElement.hasAttribute("data-preload")) {
      const onIntro = () => schedule();
      window.addEventListener(INTRO_DONE, onIntro, { once: true });
      cleanups.push(() => window.removeEventListener(INTRO_DONE, onIntro));
    } else {
      schedule();
    }

    // Fonts can change line breaks after the first split.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      ctx.revert();
    };
  }, []);

  return null;
}
