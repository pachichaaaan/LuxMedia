/**
 * Accessibility audit with axe-core (WCAG 2.2 A and AA) on every route,
 * at desktop and phone widths, with and without reduced motion.
 *
 *   npm run build && npm start
 *   npm run a11y
 *
 * Env: BASE_URL (default http://localhost:3000), BROWSER_CHANNEL (default chrome).
 * Exits non-zero if any violation is found.
 */
import AxeBuilder from "@axe-core/playwright";
import { chromium } from "playwright-core";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const CHANNEL = process.env.BROWSER_CHANNEL ?? "chrome";
const ROUTES = [
  "/",
  "/about",
  "/services",
  "/work",
  "/work/tidewater-swim",
  "/contact",
  "/privacy",
  "/this-post-is-gone",
];
const VIEWPORTS = [
  { width: 1440, height: 900 },
  { width: 375, height: 812 },
];
const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"];

const browser = await chromium.launch({ channel: CHANNEL });
let total = 0;

for (const reducedMotion of ["no-preference", "reduce"]) {
  for (const viewport of VIEWPORTS) {
    const context = await browser.newContext({ viewport, reducedMotion });
    await context.addInitScript(() => sessionStorage.setItem("lux-intro", "1"));
    const page = await context.newPage();
    for (const route of ROUTES) {
      await page.goto(BASE + route, { waitUntil: "networkidle" });
      await page.waitForTimeout(400);
      const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
      const label = `${route} @ ${viewport.width}${reducedMotion === "reduce" ? " reduced" : ""}`;
      if (results.violations.length === 0) {
        console.log(`ok   ${label}`);
        continue;
      }
      total += results.violations.length;
      console.log(`FAIL ${label}`);
      for (const violation of results.violations) {
        console.log(`  ${violation.id} (${violation.impact}): ${violation.help}`);
        for (const node of violation.nodes.slice(0, 4)) {
          console.log(`    ${node.target.join(" ")}  ${node.failureSummary?.split("\n")[1] ?? ""}`);
        }
      }
    }
    await context.close();
  }
}

await browser.close();
if (total) {
  console.error(`\n${total} violation group(s).`);
  process.exitCode = 1;
} else {
  console.log("\nNo violations.");
}
