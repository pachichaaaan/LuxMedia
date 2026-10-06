import { scrollToTarget } from "./scroll";

const hasIdle = () => typeof window.requestIdleCallback === "function";

/**
 * Runs `setup` once `element` comes within a viewport of the screen, in idle
 * time, so below-the-fold choreography never competes with first load.
 * Returns a cleanup that cancels a pending setup or tears down a finished one.
 *
 * If the page was reloaded below the element, setting up a pin adds height
 * above the reader; the scroll position is moved by the same amount so the
 * content they were looking at stays put.
 */
export function whenNear(element: Element, setup: () => void | (() => void)) {
  let teardown: void | (() => void);
  let idleHandle: number | undefined;
  let timeoutHandle: ReturnType<typeof setTimeout> | undefined;
  let done = false;

  const run = () => {
    if (done) return;
    done = true;
    const above = element.getBoundingClientRect().bottom <= 0;
    const before = document.documentElement.scrollHeight;
    teardown = setup();
    if (above) {
      requestAnimationFrame(() => {
        const added = document.documentElement.scrollHeight - before;
        if (added > 0) scrollToTarget(window.scrollY + added, { immediate: true });
      });
    }
  };

  const observer = new IntersectionObserver(
    ([entry]) => {
      // Near the screen, or already scrolled past it (a reload mid-page).
      if (!entry?.isIntersecting && entry?.boundingClientRect.top > 0) return;
      observer.disconnect();
      // Safari has no requestIdleCallback; a macrotask is close enough there.
      if (hasIdle()) idleHandle = window.requestIdleCallback(run, { timeout: 500 });
      else timeoutHandle = setTimeout(run, 0);
    },
    { rootMargin: "100% 0px 100% 0px" },
  );
  observer.observe(element);

  return () => {
    observer.disconnect();
    if (idleHandle !== undefined) window.cancelIdleCallback(idleHandle);
    if (timeoutHandle !== undefined) clearTimeout(timeoutHandle);
    teardown?.();
  };
}
