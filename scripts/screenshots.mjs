/**
 * Full-page screenshots of every route at 375, 768, and 1440 wide.
 *
 *   npm run build && npm start            # in one terminal
 *   npm run screenshots                   # in another
 *
 * Options (env):
 *   BASE_URL=http://localhost:3000   server to shoot
 *   BROWSER_CHANNEL=msedge|chrome    use an installed browser (no download needed)
 *   OUT=.screenshots                 output folder (gitignored)
 *   REDUCED=1                        also shoot with prefers-reduced-motion
 *   ROUTES=/,/work                   only these routes
 *   WIDTHS=375,1440                  only these widths
 *
 * Pinned sections are scrolled through once before capture so lazy media and
 * scroll-driven states settle; the preloader is skipped via its session flag.
 */
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright-core";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const OUT = process.env.OUT ?? ".screenshots";
const CHANNEL = process.env.BROWSER_CHANNEL ?? "chrome";
const ALL_WIDTHS = [
  { name: "375", width: 375, height: 812, mobile: true },
  { name: "768", width: 768, height: 1024, mobile: true },
  { name: "1440", width: 1440, height: 900, mobile: false },
];
const WIDTHS = process.env.WIDTHS
  ? ALL_WIDTHS.filter((w) => process.env.WIDTHS.split(",").includes(w.name))
  : ALL_WIDTHS;
const ROUTES = process.env.ROUTES?.split(",") ?? [
  "/",
  "/about",
  "/services",
  "/work",
  "/work/tidewater-swim",
  "/contact",
  "/privacy",
  "/this-post-is-gone",
];

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ channel: CHANNEL });
const problems = [];

const motionModes = process.env.REDUCED ? ["no-preference", "reduce"] : ["no-preference"];

for (const reducedMotion of motionModes) {
  for (const viewport of WIDTHS) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      isMobile: viewport.mobile && viewport.width < 768,
      hasTouch: viewport.mobile,
      reducedMotion,
    });
    await context.addInitScript(() => sessionStorage.setItem("lux-intro", "1"));
    const page = await context.newPage();
    page.on("console", (message) => {
      if (message.type() !== "error") return;
      // The 404 route is supposed to answer 404.
      if (page.url().endsWith("/this-post-is-gone") && message.text().includes("404")) return;
      problems.push(`${page.url()} console: ${message.text()}`);
    });
    page.on("pageerror", (error) => problems.push(`${page.url()} pageerror: ${error.message}`));

    for (const route of ROUTES) {
      await page.goto(BASE + route, { waitUntil: "networkidle" });
      // Walk the page so pinned and lazy sections settle, then return to the top.
      await page.evaluate(async () => {
        const step = window.innerHeight * 0.8;
        for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
          window.scrollTo(0, y);
          await new Promise((resolve) => setTimeout(resolve, 60));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(500);
      const slug = route === "/" ? "home" : route.slice(1).replaceAll("/", "-");
      const suffix = reducedMotion === "reduce" ? "-reduced" : "";
      await page.screenshot({
        path: join(OUT, `${slug}-${viewport.name}${suffix}.png`),
        fullPage: true,
      });
      console.log(`shot ${slug} @ ${viewport.name}${suffix}`);
    }
    await context.close();
  }
}

await browser.close();
if (problems.length) {
  console.error(`\n${problems.length} problem(s):\n${problems.join("\n")}`);
  process.exitCode = 1;
}
