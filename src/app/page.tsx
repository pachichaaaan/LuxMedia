import type { Metadata } from "next";
import { Comments } from "@/components/sections/Comments";
import { Cta } from "@/components/sections/Cta";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Process } from "@/components/sections/Process";
import { Services } from "@/components/sections/Services";
import { Story } from "@/components/sections/Story";
import { WorkRail } from "@/components/sections/WorkRail";
import { home } from "@/content/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Story />
      <Services />
      <WorkRail />
      <Comments />
      <Marquee />
      <Process heading={home.process.heading} />
      <Cta />
    </>
  );
}
