import { gsap, SplitText } from "./gsap";

/**
 * Splits a heading into masked lines and parks them below their masks, ready
 * to rise. Masks get a little vertical padding so tight line-heights don't
 * clip ascenders and descenders mid-animation.
 */
export function splitForReveal(element: HTMLElement) {
  const split = SplitText.create(element, {
    type: "lines",
    mask: "lines",
    linesClass: "split-line",
  });
  gsap.set(split.masks, { paddingBlock: "0.14em", marginBlock: "-0.14em" });
  gsap.set(split.lines, { yPercent: 135 });
  return split;
}

type RevealOptions = { delay?: number; duration?: number; stagger?: number };

/** Lines rise into place, then the split is reverted to plain text. */
export function revealLines(
  element: HTMLElement,
  { delay = 0, duration = 0.9, stagger = 0.08 }: RevealOptions = {},
) {
  const split = splitForReveal(element);
  return gsap.to(split.lines, {
    yPercent: 0,
    duration,
    stagger,
    delay,
    ease: "expo.out",
    onComplete: () => split.revert(),
  });
}
