import type { GsapKit } from "./gsap";

/**
 * Splits a heading into masked lines and parks them below their masks, ready
 * to rise. Masks get a little vertical padding so tight line-heights don't
 * clip ascenders and descenders mid-animation.
 */
export function splitForReveal({ gsap, SplitText }: GsapKit, element: HTMLElement) {
  const split = SplitText.create(element, {
    type: "lines",
    mask: "lines",
    // Line splits keep words intact, so the text reads normally as-is.
    aria: "none",
    linesClass: "split-line",
  });
  gsap.set(split.masks, { paddingBlock: "0.14em", marginBlock: "-0.14em" });
  gsap.set(split.lines, { yPercent: 135 });
  return split;
}

type RevealOptions = { delay?: number; duration?: number; stagger?: number };

/** Lines rise into place, then the split is reverted to plain text. */
export function revealLines(
  kit: GsapKit,
  element: HTMLElement,
  { delay = 0, duration = 0.9, stagger = 0.08 }: RevealOptions = {},
) {
  const split = splitForReveal(kit, element);
  return kit.gsap.to(split.lines, {
    yPercent: 0,
    duration,
    stagger,
    delay,
    ease: "expo.out",
    onComplete: () => split.revert(),
  });
}
