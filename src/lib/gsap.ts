import type { gsap as GsapCore } from "gsap";
import type { ScrollTrigger as ScrollTriggerClass } from "gsap/ScrollTrigger";
import type { SplitText as SplitTextClass } from "gsap/SplitText";
import { afterFirstIdle } from "./idle";

export type Gsap = typeof GsapCore;
export type ScrollTriggerStatic = typeof ScrollTriggerClass;
export type SplitTextStatic = typeof SplitTextClass;
export type SplitTextInstance = InstanceType<typeof SplitTextClass>;

export type GsapKit = {
  gsap: Gsap;
  SplitText: SplitTextStatic;
};

let kit: GsapKit | null = null;
let pending: Promise<GsapKit> | null = null;

let fetching: Promise<GsapKit> | null = null;

const fetchKit = () =>
  (fetching ??= Promise.all([import("gsap"), import("gsap/SplitText")]).then(([core, split]) => {
    core.gsap.registerPlugin(split.SplitText);
    core.gsap.defaults({ ease: "expo.out", duration: 0.9 });
    kit = { gsap: core.gsap, SplitText: split.SplitText };
    return kit;
  }));

/**
 * GSAP and SplitText, loaded once and on demand. Nothing on
 * the site needs them to paint, so by default they wait until after the first
 * idle period. `urgent` skips the wait, for a click that needs them now.
 */
export function loadGsap({ urgent = false }: { urgent?: boolean } = {}): Promise<GsapKit> {
  if (kit) return Promise.resolve(kit);
  if (urgent) return fetchKit();
  pending ??= afterFirstIdle().then(fetchKit);
  return pending;
}

let scrollTriggerRef: ScrollTriggerStatic | null = null;

/**
 * ScrollTrigger is only loaded by the home page's choreography chunks, which
 * hand it over here. Inner pages never pay for it, or for the animation-frame
 * loop it keeps running while enabled.
 */
export const provideScrollTrigger = (instance: ScrollTriggerStatic) => {
  scrollTriggerRef = instance;
};

/** ScrollTrigger if a section has loaded it, for Lenis sync and refreshes. */
export const scrollTrigger = () => scrollTriggerRef;

/** The kit if it has already loaded, for code that must run synchronously. */
export const gsapKit = () => kit;

/**
 * Runs `setup` with the kit once it's loaded, unless the caller has been
 * torn down first. Returns the teardown to use as an effect cleanup.
 */
export function withGsap(setup: (kit: GsapKit) => void | (() => void)) {
  let cancelled = false;
  let teardown: void | (() => void);
  loadGsap().then((loaded) => {
    if (!cancelled) teardown = setup(loaded);
  });
  return () => {
    cancelled = true;
    teardown?.();
  };
}
