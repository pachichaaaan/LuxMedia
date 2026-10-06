"use client";

import dynamic from "next/dynamic";
import { useAfterFirstIdle } from "@/lib/idle";

/** Loads the Story choreography after first paint and idle, in its own chunk. */
const StoryController = dynamic(() => import("./StoryController"), { ssr: false });

export function StoryControllerLoader() {
  return useAfterFirstIdle() ? <StoryController /> : null;
}
