/** sessionStorage key: the preloader plays once per session. */
export const INTRO_FLAG = "lux-intro";

/** Fired on window when the preloader hands the screen to the hero. */
export const INTRO_DONE = "lux:intro-done";

/**
 * Fired on window when the hero headline should rise into place: by the
 * preloader as its red layer wipes away, and by page transitions into home.
 * `detail.delay` is in seconds.
 */
export const REVEAL_HERO = "lux:reveal-hero";
export type RevealHeroDetail = { delay: number };

/**
 * Runs in <head> before first paint. Marks <html> with `data-js` (so CSS can
 * lay out scripted sections before hydration) and with `data-preload` only on
 * the home page, once per session, and never under reduced motion. Without
 * this attribute the overlay is `display: none`, so no-JS visitors never see it.
 */
export const preloadScript = `(function(){try{var d=document.documentElement;d.setAttribute("data-js","");if(location.pathname==="/"&&!sessionStorage.getItem("${INTRO_FLAG}")&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches){d.setAttribute("data-preload","")}}catch(e){}})()`;
