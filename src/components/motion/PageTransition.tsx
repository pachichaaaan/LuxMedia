"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { REVEAL_HERO, type RevealHeroDetail } from "@/lib/preload";
import { splitForReveal } from "@/lib/reveal";
import { getLenis } from "@/lib/scroll";

type TransitionContextValue = {
  navigate: (href: string) => void;
};

const TransitionContext = createContext<TransitionContextValue | null>(null);

export const useTransitionNavigate = () => useContext(TransitionContext)?.navigate;

const COVERED = "inset(0% 0% 0% 0%)";
const BELOW = "inset(100% 0% 0% 0%)";
const ABOVE = "inset(0% 0% 100% 0%)";
const PHASE = 0.45; // Two phases, 900ms total: the brief's cap.

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

/**
 * Page transitions as "swipe to the next story": a midnight panel wipes up
 * from the bottom, the route changes underneath it, then the panel wipes out
 * the top and the new page headline rises in.
 */
export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const pendingCommit = useRef<(() => void) | null>(null);
  const isFirstRender = useRef(true);

  const finish = useCallback(() => {
    busy.current = false;
    document.documentElement.removeAttribute("data-transitioning");
    if (panelRef.current) gsap.set(panelRef.current, { clipPath: BELOW });

    if (process.env.NODE_ENV !== "production") {
      const leaked = ScrollTrigger.getAll().filter(
        (trigger) => trigger.trigger && !document.documentElement.contains(trigger.trigger),
      );
      if (leaked.length) {
        console.warn(`${leaked.length} ScrollTrigger(s) outlived their page.`, leaked);
      }
    }
  }, []);

  /** Wipes the panel out the top and reveals the new page's headline. */
  const playEnter = useCallback(() => {
    const panel = panelRef.current;
    if (!panel) return finish();
    ScrollTrigger.refresh();

    // The panel releases the page as soon as it's gone; the headline finishes on its own.
    gsap.fromTo(
      panel,
      { clipPath: COVERED },
      { clipPath: ABOVE, duration: PHASE, ease: "power3.inOut", onComplete: finish },
    );
    if (document.querySelector("main [data-hero-title]")) {
      window.dispatchEvent(
        new CustomEvent<RevealHeroDetail>(REVEAL_HERO, { detail: { delay: 0.12 } }),
      );
    }
    const title = document.querySelector<HTMLElement>("main [data-page-title]");
    if (title) {
      const split = splitForReveal(title);
      gsap.to(split.lines, {
        yPercent: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "expo.out",
        delay: 0.12,
        onComplete: () => split.revert(),
      });
    }
  }, [finish]);

  // Runs after the new route commits, before the browser paints it.
  useLayoutEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const resolve = pendingCommit.current;
    if (resolve) {
      pendingCommit.current = null;
      resolve();
      return;
    }
    // A navigation we didn't start (back or forward). Cover before paint, then enter.
    if (busy.current || prefersReducedMotion() || !panelRef.current) {
      ScrollTrigger.refresh();
      return;
    }
    busy.current = true;
    document.documentElement.setAttribute("data-transitioning", "");
    gsap.set(panelRef.current, { clipPath: COVERED });
    requestAnimationFrame(playEnter);
  }, [pathname, playEnter]);

  const navigate = useCallback(
    async (href: string) => {
      if (busy.current) return;
      const panel = panelRef.current;
      if (!panel || prefersReducedMotion()) {
        router.push(href);
        return;
      }

      busy.current = true;
      document.documentElement.setAttribute("data-transitioning", "");

      await gsap.fromTo(
        panel,
        { clipPath: BELOW },
        { clipPath: COVERED, duration: PHASE, ease: "power3.inOut" },
      );

      const committed = new Promise<void>((resolve) => {
        pendingCommit.current = resolve;
      });
      router.push(href, { scroll: false });
      // If the route is slow, don't hold the screen hostage.
      await Promise.race([committed, wait(4000)]);
      pendingCommit.current = null;

      const hash = new URL(href, window.location.href).hash;
      const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
      if (target) {
        target.scrollIntoView();
      } else {
        window.scrollTo(0, 0);
        getLenis()?.scrollTo(0, { immediate: true, force: true });
      }

      await nextFrame();
      playEnter();
    },
    [router, playEnter],
  );

  const value = useMemo(() => ({ navigate }), [navigate]);

  return (
    <TransitionContext.Provider value={value}>
      {children}
      <div
        ref={panelRef}
        aria-hidden
        className="transition-panel pointer-events-none fixed inset-0 z-80 bg-midnight"
        style={{ clipPath: BELOW }}
      />
    </TransitionContext.Provider>
  );
}
