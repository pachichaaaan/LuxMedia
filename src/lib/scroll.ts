import type Lenis from "lenis";
import { useSyncExternalStore } from "react";
import { prefersReducedMotion } from "./motion";

/**
 * The single Lenis instance, shared through a tiny external store so any
 * component can scroll programmatically without prop drilling.
 */
let instance: Lenis | null = null;
const listeners = new Set<() => void>();

export function setLenis(next: Lenis | null) {
  instance = next;
  listeners.forEach((listener) => listener());
}

export const getLenis = () => instance;

export function useLenis() {
  return useSyncExternalStore(
    (onChange) => {
      listeners.add(onChange);
      return () => {
        listeners.delete(onChange);
      };
    },
    getLenis,
    () => null,
  );
}

type ScrollOptions = { immediate?: boolean; duration?: number; offset?: number };

/** Scrolls to a y position or element, through Lenis when it's running. */
export function scrollToTarget(target: number | HTMLElement, options: ScrollOptions = {}) {
  const immediate = options.immediate || prefersReducedMotion();
  if (instance) {
    instance.scrollTo(target, {
      immediate,
      duration: options.duration,
      offset: options.offset,
      force: true,
    });
    return;
  }
  const top =
    typeof target === "number"
      ? target
      : target.getBoundingClientRect().top + window.scrollY + (options.offset ?? 0);
  window.scrollTo({ top, behavior: immediate ? "auto" : "smooth" });
}

export function lockScroll() {
  instance?.stop();
  document.documentElement.style.overflow = "hidden";
}

export function unlockScroll() {
  document.documentElement.style.overflow = "";
  instance?.start();
}
