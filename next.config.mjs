// Plain JavaScript on purpose: a .ts config has to be compiled by Next's native
// SWC binary before the build can even start, and some Linux hosts are too old
// to run it (see scripts/build.mjs).

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    // Tailwind's CSS is small (about 9 KB gzipped); inlining it removes the
    // render-blocking stylesheet request for first-time visitors.
    inlineCss: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85],
  },
};

export default nextConfig;
