"use client";

import dynamic from "next/dynamic";
import { useAfterFirstIdle } from "@/lib/idle";

/**
 * Section choreography, each in its own chunk, requested only after the page
 * has painted and gone idle. The sections render complete without them;
 * these only add motion.
 */
const HeroMotionChunk = dynamic(() => import("./HeroMotion"), { ssr: false });
const ServicesHoverChunk = dynamic(() => import("./ServicesHover"), { ssr: false });
const MarqueeMotionChunk = dynamic(() => import("./MarqueeMotion"), { ssr: false });

export function HeroMotion() {
  return useAfterFirstIdle() ? <HeroMotionChunk /> : null;
}

export function ServicesHover() {
  return useAfterFirstIdle() ? <ServicesHoverChunk /> : null;
}

export function MarqueeMotion() {
  return useAfterFirstIdle() ? <MarqueeMotionChunk /> : null;
}
