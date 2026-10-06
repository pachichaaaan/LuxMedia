import type { Metadata } from "next";
import { Cta } from "@/components/sections/Cta";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Process } from "@/components/sections/Process";
import { Services } from "@/components/sections/Services";
import { Story } from "@/components/sections/Story";
import { home } from "@/content/site";
import { organizationJsonLd, toJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(organizationJsonLd) }}
      />
      <Hero />
      <Story />
      <Services />
      <Marquee />
      <Process heading={home.process.heading} />
      <Cta />
    </>
  );
}
