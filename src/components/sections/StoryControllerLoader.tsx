"use client";

import dynamic from "next/dynamic";

/** Loads the Story choreography after hydration, in its own chunk. */
const StoryController = dynamic(() => import("./StoryController"), { ssr: false });

export function StoryControllerLoader() {
  return <StoryController />;
}
