import { useEffect, useState } from "react";

let gate: Promise<void> | null = null;

/** True while the preloader owns the screen: motion must be ready right away. */
const preloading = () => document.documentElement.hasAttribute("data-preload");

/**
 * Resolves once the page has loaded and the browser has had a moment to
 * breathe. Motion code waits behind this so it never competes with the first
 * paint. While the preloader is showing, it resolves immediately.
 */
export function afterFirstIdle(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (preloading()) return Promise.resolve();
  gate ??= new Promise<void>((resolve) => {
    const whenIdle = () => {
      if (typeof window.requestIdleCallback === "function") {
        window.requestIdleCallback(() => resolve(), { timeout: 1200 });
      } else {
        setTimeout(resolve, 200);
      }
    };
    if (document.readyState === "complete") whenIdle();
    else window.addEventListener("load", whenIdle, { once: true });
  });
  return gate;
}

/** `true` after the first idle period, so a component can defer loading a lazy child. */
export function useAfterFirstIdle() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let cancelled = false;
    afterFirstIdle().then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  return ready;
}
