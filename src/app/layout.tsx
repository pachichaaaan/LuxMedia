import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { SkipLink } from "@/components/layout/SkipLink";
import { Cursor } from "@/components/motion/Cursor";
import { InlineScript } from "@/components/motion/InlineScript";
import { TransitionProvider } from "@/components/motion/PageTransition";
import { Preloader } from "@/components/motion/Preloader";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { brand } from "@/content/brand";
import { home } from "@/content/site";
import { poppins } from "@/lib/fonts";
import { preloadScript } from "@/lib/preload";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: home.meta.title, template: `%s | ${brand.name}` },
  description: home.meta.description,
  applicationName: brand.name,
  openGraph: { type: "website", siteName: brand.name, locale: "en_US" },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#1b1638",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // The head script may add data-preload before hydration.
    <html lang="en" className={poppins.variable} suppressHydrationWarning>
      <head>
        <InlineScript html={preloadScript} />
      </head>
      <body>
        <TransitionProvider>
          <SkipLink />
          <Nav />
          <main id="content" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
        </TransitionProvider>
        <SmoothScroll />
        <Cursor />
        <Preloader />
      </body>
    </html>
  );
}
