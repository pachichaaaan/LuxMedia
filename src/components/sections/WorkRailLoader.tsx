"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import {
  DESKTOP,
  isLowPower,
  useFinePointer,
  useMediaQuery,
  usePrefersReducedMotion,
} from "@/lib/motion";
import { useAfterFirstIdle } from "@/lib/idle";

const WorkRailController = dynamic(() => import("./WorkRailController"), { ssr: false });
const WorkHoverGL = dynamic(() => import("./WorkHoverGL"), { ssr: false });

/**
 * The rail choreography loads after hydration. The WebGL hover loads only on
 * desktop fine pointers, without reduced motion, on capable devices, and only
 * once the rail is near the viewport. Everything else gets a CSS scale.
 */
export function WorkRailLoader() {
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const desktop = useMediaQuery(DESKTOP);
  const [near, setNear] = useState(false);
  const idle = useAfterFirstIdle();
  const capable = fine && desktop && !reduced && !isLowPower();

  useEffect(() => {
    if (!capable) return;
    const section = document.getElementById("work");
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100% 0px" },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [capable]);

  return (
    <>
      {idle && <WorkRailController />}
      {idle && capable && near && <WorkHoverGL />}
    </>
  );
}
