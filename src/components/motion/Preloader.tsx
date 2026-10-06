"use client";

import { useEffect, useRef } from "react";
import { INTRO_DONE, INTRO_FLAG, REVEAL_HERO, type RevealHeroDetail } from "@/lib/preload";
import { getLenis } from "@/lib/scroll";

/** Matches `.preloader-red` in globals.css. */
const BADGE_RADIUS = 48;

/** The overlay must be gone this many seconds after navigation start. */
const HARD_CAP = 2.4;

/** power3.inOut, as a CSS easing, for the Web Animations API. */
const POWER3_IN_OUT = "cubic-bezier(0.65, 0, 0.35, 1)";

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
 *
 * It runs on requestAnimationFrame and the Web Animations API rather than
 * GSAP, so it can start the moment the page hydrates.
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
    let frame = 0;
    const animations: Animation[] = [];
    const play = (element: Element, keyframes: Keyframe[], options: KeyframeAnimationOptions) => {
      const animation = element.animate(keyframes, { fill: "forwards", ...options });
      animations.push(animation);
      return animation;
    };

    const finish = () => {
      html.removeAttribute("data-preload");
      getLenis()?.start();
      window.dispatchEvent(new Event(INTRO_DONE));
    };
    /** Past the cap (a background tab, a stalled device): stop and show the page. */
    const abort = () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      animations.forEach((animation) => animation.cancel());
      finish();
    };
    const late = () => performance.now() / 1000 > HARD_CAP + 0.3;
    const onVisibility = () => {
      if (document.visibilityState === "hidden" && html.hasAttribute("data-preload")) abort();
    };
    document.addEventListener("visibilitychange", onVisibility);

    /** Counts 1 to 98 with a power2.out curve. */
    const countUp = (seconds: number) =>
      new Promise<void>((resolve) => {
        const start = performance.now();
        const step = (now: number) => {
          const t = seconds > 0 ? Math.min(1, (now - start) / (seconds * 1000)) : 1;
          const eased = 1 - (1 - t) * (1 - t);
          count.textContent = String(Math.round(1 + 97 * eased));
          if (t < 1) frame = requestAnimationFrame(step);
          else resolve();
        };
        frame = requestAnimationFrame(step);
      });

    const run = async () => {
      // Hydration may land late on slow devices; fit the sequence into what's left.
      const budget = HARD_CAP - performance.now() / 1000;
      if (budget < 0.5 || document.visibilityState === "hidden") return finish();
      const outro = Math.min(0.9, budget * 0.45);
      const phase = (outro / 2) * 1000;
      const countTime = Math.max(0, Math.min(1.4, budget - outro - 0.15));
      const deadline = performance.now() + (budget - outro) * 1000;

      await countUp(countTime);
      await Promise.race([
        Promise.all([document.fonts?.ready, heroMediaReady()]),
        waitUntil(deadline),
      ]);
      if (cancelled) return;
      if (late()) return abort();

      count.textContent = "99+";
      const radius = Math.hypot(window.innerWidth, window.innerHeight) / 2 + 24;
      play(count, [{ opacity: 1 }, { opacity: 0 }], { duration: phase * 0.6, delay: phase * 0.3 });
      const expand = play(
        red,
        [
          { clipPath: `circle(${BADGE_RADIUS}px at 50% 50%)` },
          { clipPath: `circle(${radius}px at 50% 50%)` },
        ],
        { duration: phase, easing: POWER3_IN_OUT },
      );
      await expand.finished;
      if (cancelled) return;
      if (late()) return abort();

      // Fully red: swap shapes invisibly, ask the hero to rise, then wipe.
      root.style.backgroundColor = "transparent";
      window.dispatchEvent(
        new CustomEvent<RevealHeroDetail>(REVEAL_HERO, {
          detail: { delay: (phase * 0.35) / 1000 },
        }),
      );
      const wipe = play(
        red,
        [{ clipPath: "inset(0% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 100% 0%)" }],
        { duration: phase, easing: POWER3_IN_OUT },
      );
      await wipe.finished;
      if (!cancelled) finish();
    };

    run().catch(() => {
      // A cancelled animation rejects its `finished` promise; nothing to do.
    });

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisibility);
      cancelAnimationFrame(frame);
      animations.forEach((animation) => animation.cancel());
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
