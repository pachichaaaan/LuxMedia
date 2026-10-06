"use client";

import { useEffect, useRef } from "react";
import { gsap, type SplitText } from "@/lib/gsap";
import { INTRO_DONE, INTRO_FLAG } from "@/lib/preload";
import { splitForReveal } from "@/lib/reveal";
import { getLenis } from "@/lib/scroll";

/** Matches `.preloader-red` in globals.css. */
const BADGE_RADIUS = 48;

/** The overlay must be gone this many seconds after navigation start. */
const HARD_CAP = 2.4;

/** Survives React's dev double-mount: cleanup defers, the remount cancels it. */
let pendingFinish: ReturnType<typeof setTimeout> | undefined;

const waitUntil = (timestamp: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, Math.max(0, timestamp - performance.now())));

function heroMediaReady() {
  const image = document.querySelector<HTMLImageElement>("[data-hero-media] img");
  if (!image) return Promise.resolve();
  return image.decode().catch(() => undefined);
}

/**
 * The one page-load moment. A notification badge counts to 99+, tied to
 * fonts and hero media being ready, grows to fill the screen, then wipes out
 * the top as the hero headline rises. Once per session, home page only,
 * never under reduced motion, and never longer than the hard cap.
 */
export function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const redRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    clearTimeout(pendingFinish);
    const html = document.documentElement;
    const root = rootRef.current;
    const red = redRef.current;
    const count = countRef.current;
    if (!html.hasAttribute("data-preload") || !root || !red || !count) return;

    try {
      sessionStorage.setItem(INTRO_FLAG, "1");
    } catch {
      // Private mode: it may play again next load. Harmless.
    }

    let cancelled = false;
    const tweens: gsap.core.Animation[] = [];
    const track = <T extends gsap.core.Animation>(animation: T) => {
      tweens.push(animation);
      return animation;
    };

    let split: SplitText | null = null;
    const finish = () => {
      html.removeAttribute("data-preload");
      getLenis()?.start();
      window.dispatchEvent(new Event(INTRO_DONE));
    };
    /** Past the cap (a background tab, a stalled device): drop everything and show the page. */
    const abort = () => {
      cancelled = true;
      tweens.forEach((tween) => tween.kill());
      split?.revert();
      split = null;
      finish();
    };
    const late = () => performance.now() / 1000 > HARD_CAP + 0.3;
    const onVisibility = () => {
      if (document.visibilityState === "hidden" && html.hasAttribute("data-preload")) abort();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const run = async () => {
      // Hydration may land late on slow devices; fit the sequence into what's left.
      const budget = HARD_CAP - performance.now() / 1000;
      if (budget < 0.5 || document.visibilityState === "hidden") return finish();
      const outro = Math.min(0.9, budget * 0.45);
      const phase = outro / 2;
      const countTime = Math.max(0, Math.min(1.4, budget - outro - 0.15));
      const deadline = performance.now() + (budget - outro) * 1000;

      const counter = { value: 1 };
      await track(
        gsap.to(counter, {
          value: 98,
          duration: countTime,
          ease: "power2.out",
          onUpdate: () => {
            count.textContent = String(Math.round(counter.value));
          },
        }),
      );
      await Promise.race([
        Promise.all([document.fonts?.ready, heroMediaReady()]),
        waitUntil(deadline),
      ]);
      if (cancelled) return;
      if (late()) return abort();

      count.textContent = "99+";
      const radius = Math.hypot(window.innerWidth, window.innerHeight) / 2 + 24;
      track(gsap.to(count, { opacity: 0, duration: phase * 0.6, delay: phase * 0.3 }));
      await track(
        gsap.fromTo(
          red,
          { clipPath: `circle(${BADGE_RADIUS}px at 50% 50%)` },
          { clipPath: `circle(${radius}px at 50% 50%)`, duration: phase, ease: "power3.inOut" },
        ),
      );
      if (cancelled) return;
      if (late()) return abort();

      // Fully red: swap shapes invisibly, park the headline, then wipe.
      root.style.backgroundColor = "transparent";
      gsap.set(red, { clipPath: "inset(0% 0% 0% 0%)" });
      const title = document.querySelector<HTMLElement>("[data-hero-title]");
      if (title) {
        const lines = splitForReveal(title);
        split = lines;
        track(
          gsap.to(lines.lines, {
            yPercent: 0,
            duration: 0.9,
            stagger: 0.08,
            ease: "expo.out",
            delay: phase * 0.35,
            onComplete: () => {
              lines.revert();
              split = null;
            },
          }),
        );
      }
      await track(
        gsap.to(red, { clipPath: "inset(0% 0% 100% 0%)", duration: phase, ease: "power3.inOut" }),
      );
      finish();
    };

    run();

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisibility);
      tweens.forEach((tween) => tween.kill());
      split?.revert();
      if (html.hasAttribute("data-preload")) pendingFinish = setTimeout(finish, 50);
    };
  }, []);

  return (
    <div ref={rootRef} aria-hidden className="preloader">
      <div ref={redRef} className="preloader-red" />
      <span ref={countRef} className="preloader-count text-h3 tabular-nums">
        1
      </span>
    </div>
  );
}
