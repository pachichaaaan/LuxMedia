/**
 * `npm run build`. Uses Turbopack, Next's default, wherever it can run.
 *
 * Next 16's native compiler for Linux needs glibc 2.30 or newer. Some hosts
 * (CloudLinux 8, RHEL 8, Ubuntu 18.04, Amazon Linux 2) are older, and there the
 * native binary won't load. Turbopack can't run without it, so on those
 * machines this builds with webpack, which Next runs on its WebAssembly
 * compiler (@next/swc-wasm-nodejs) instead. Slower, but it works anywhere.
 *
 * Set NEXT_BUILD_WEBPACK=1 to force the webpack build.
 */
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { dirname } from "node:path";

const MIN_GLIBC = [2, 30];

function glibcVersion() {
  if (process.platform !== "linux") return null;
  const header = process.report?.getReport?.().header;
  return header?.glibcVersionRuntime ?? null; // null on musl (Alpine), which has its own binary
}

function olderThan(version, [major, minor]) {
  const [a = 0, b = 0] = version.split(".").map(Number);
  return a < major || (a === major && b < minor);
}

const glibc = glibcVersion();
const useWebpack =
  process.env.NEXT_BUILD_WEBPACK === "1" || (glibc !== null && olderThan(glibc, MIN_GLIBC));

if (useWebpack) {
  console.log(
    glibc && olderThan(glibc, MIN_GLIBC)
      ? `glibc ${glibc} is older than ${MIN_GLIBC.join(".")}, which Next's native compiler needs. Building with webpack and the WebAssembly compiler.`
      : "NEXT_BUILD_WEBPACK=1: building with webpack.",
  );
}

const require = createRequire(import.meta.url);
const env = { ...process.env };

// Point Next at the WebAssembly compiler installed in node_modules. Left to
// itself, Next 16.3 misses the installed copy and downloads it during the build.
if (useWebpack && !env.NEXT_TEST_WASM_DIR) {
  try {
    env.NEXT_TEST_WASM_DIR = dirname(require.resolve("@next/swc-wasm-nodejs/wasm.js"));
  } catch {
    // Not installed: Next falls back to downloading it.
  }
}

const next = require.resolve("next/dist/bin/next");
const args = ["build", ...(useWebpack ? ["--webpack"] : []), ...process.argv.slice(2)];
const result = spawnSync(process.execPath, [next, ...args], { stdio: "inherit", env });
process.exit(result.status ?? 1);
