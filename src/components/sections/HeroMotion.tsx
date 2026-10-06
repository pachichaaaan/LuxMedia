"use client";

import { useEffect } from "react";
import { home } from "@/content/site";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { REDUCED_MOTION } from "@/lib/motion";
import { INTRO_DONE, REVEAL_HERO, type RevealHeroDetail } from "@/lib/preload";

const HOLD = 2.8;
const MOVE = 0.9;
/** How far each headline line drifts while the hero scrolls away, in yPercent. */
const DRIFT = [0, -6, -12, -18, -24];

/**
 * Everything that moves in the hero, in one place so the headline is split
 * exactly once: the line reveal (asked for by the preloader or a page
 * transition), the scroll drift, the frame easing back, and the feed.
 */
export function HeroMotion() {
  useEffect(() => {
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
    const reveal = (delay: number) => {
      if (!lines.length) {
        pendingReveal = delay;
        return;
      }
      ctx.add(() => {
        gsap.fromTo(
          lines,
          { yPercent: 135 },
          { yPercent: 0, duration: 0.9, stagger: 0.08, ease: "expo.out", delay, overwrite: true },
        );
      });
    };

    ctx.add(() => {
      const desktop = window.matchMedia("(min-width: 768px)").matches;
      SplitText.create(title, {
        type: "lines",
        mask: "lines",
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
            scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: 0.6 },
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
    cleanups.push(() => window.removeEventListener(REVEAL_HERO, onReveal));

    // Feed: hold, flick up one post, repeat. The last slot is a copy of the first.
    const slots = track.children.length;
    let index = 0;
    let userPaused = false;
    let hovering = false;
    let onScreen = true;
    let timer: gsap.core.Tween | undefined;

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
      timer?.kill();
      if (userPaused || hovering || !onScreen) return;
      timer = gsap.delayedCall(HOLD, advance);
    };
    const pauseFor = (state: () => void) => {
      state();
      if (userPaused || hovering || !onScreen) timer?.kill();
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
      timer?.kill();
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
