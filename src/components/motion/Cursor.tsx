"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { FINE_POINTER, REDUCED_MOTION } from "@/lib/motion";

const TEXT_ENTRY = "input, textarea, select, [contenteditable='true']";

/**
 * Dot and ring, lerped toward the pointer. `data-cursor="View"` on any
 * element swaps the ring for a filled label. Only on fine pointers, never
 * under reduced motion, and the native cursor returns while someone is
 * navigating by keyboard or typing in a field.
 */
export function Cursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!root || !dot || !ring || !label) return;

    const html = document.documentElement;
    const fine = window.matchMedia(FINE_POINTER);
    const reduced = window.matchMedia(REDUCED_MOTION);
    const target = { x: -100, y: -100 };
    const dotPos = { x: -100, y: -100 };
    const ringPos = { x: -100, y: -100 };
    let active = false;
    let seen = false;
    let currentLabel = "";
    let currentSurface = "";

    const setDot = { x: gsap.quickSetter(dot, "x", "px"), y: gsap.quickSetter(dot, "y", "px") };
    const setRing = { x: gsap.quickSetter(ring, "x", "px"), y: gsap.quickSetter(ring, "y", "px") };

    const tick = () => {
      // Frame-rate independent lerp.
      const ratio = gsap.ticker.deltaRatio();
      const dotT = 1 - Math.pow(1 - 0.35, ratio);
      const ringT = 1 - Math.pow(1 - 0.15, ratio);
      dotPos.x += (target.x - dotPos.x) * dotT;
      dotPos.y += (target.y - dotPos.y) * dotT;
      ringPos.x += (target.x - ringPos.x) * ringT;
      ringPos.y += (target.y - ringPos.y) * ringT;
      setDot.x(dotPos.x);
      setDot.y(dotPos.y);
      setRing.x(ringPos.x);
      setRing.y(ringPos.y);
    };

    const show = (visible: boolean) => {
      root.dataset.visible = String(visible);
      html.classList.toggle("cursor-on", visible);
    };

    const enable = () => {
      if (active) return;
      active = true;
      gsap.ticker.add(tick);
    };

    const disable = () => {
      active = false;
      gsap.ticker.remove(tick);
      show(false);
    };

    const allowed = () => fine.matches && !reduced.matches;

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !allowed()) return;
      target.x = event.clientX;
      target.y = event.clientY;
      if (!seen) {
        seen = true;
        dotPos.x = ringPos.x = target.x;
        dotPos.y = ringPos.y = target.y;
      }
      enable();

      const element = event.target instanceof Element ? event.target : null;
      const typing = Boolean(element?.closest(TEXT_ENTRY));
      show(!typing);

      const surface = element?.closest<HTMLElement>("[data-surface]")?.dataset.surface ?? "night";
      if (surface !== currentSurface) {
        currentSurface = surface;
        root.dataset.surface = surface;
      }

      const next = element?.closest<HTMLElement>("[data-cursor]")?.dataset.cursor ?? "";
      if (next !== currentLabel) {
        currentLabel = next;
        if (next) label.textContent = next;
        root.dataset.label = next ? "true" : "false";
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Tab" || event.key.startsWith("Arrow")) disable();
    };
    const onLeave = () => show(false);
    const onPreferenceChange = () => {
      if (!allowed()) disable();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerleave", onLeave);
    fine.addEventListener("change", onPreferenceChange);
    reduced.addEventListener("change", onPreferenceChange);

    return () => {
      disable();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerleave", onLeave);
      fine.removeEventListener("change", onPreferenceChange);
      reduced.removeEventListener("change", onPreferenceChange);
    };
  }, []);

  return (
    <div ref={rootRef} aria-hidden className="cursor" data-visible="false" data-label="false">
      <div ref={ringRef} className="cursor-ring-pos">
        <div className="cursor-ring" />
        <span ref={labelRef} className="cursor-label text-small" />
      </div>
      <div ref={dotRef} className="cursor-dot" />
    </div>
  );
}
