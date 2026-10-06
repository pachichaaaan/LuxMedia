/** sessionStorage key: the preloader plays once per session. */
export const INTRO_FLAG = "lux-intro";

/** Fired on window when the preloader hands the screen to the hero. */
export const INTRO_DONE = "lux:intro-done";

/**
 * Runs in <head> before first paint. Marks <html> with `data-preload` only on
 * the home page, once per session, and never under reduced motion. Without
 * this attribute the overlay is `display: none`, so no-JS visitors never see it.
 */
export const preloadScript = `(function(){try{var d=document.documentElement;if(location.pathname==="/"&&!sessionStorage.getItem("${INTRO_FLAG}")&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches){d.setAttribute("data-preload","")}}catch(e){}})()`;
