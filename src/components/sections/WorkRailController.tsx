"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { scrollToTarget } from "@/lib/scroll";
import { clamp } from "@/lib/utils";

const PINNED = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

/**
 * Desktop only: pins the rail and maps vertical scroll to horizontal travel.
 * Dragging the rail scrubs the same scroll, and keyboard focus scrolls the
 * page to wherever the focused case study is in view.
 */
export default function WorkRailController() {
  useEffect(() => {
    const section = document.getElementById("work");
    const viewport = section?.querySelector<HTMLElement>("[data-work-viewport]");
    const track = section?.querySelector<HTMLElement>("[data-work-track]");
    if (!section || !viewport || !track) return;

    const mm = gsap.matchMedia();
    mm.add(PINNED, () => {
      section.dataset.mode = "pinned";
      const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
      const trigger = tween.scrollTrigger as ScrollTrigger;

      // Drag to scrub. Moving the page keeps the rail and the scrollbar in sync.
      let start: { x: number; scroll: number } | null = null;
      let dragged = false;
      const onDown = (event: PointerEvent) => {
        if (event.pointerType !== "mouse" || event.button !== 0) return;
        start = { x: event.clientX, scroll: window.scrollY };
        dragged = false;
      };
      const onMove = (event: PointerEvent) => {
        if (!start) return;
        const dx = event.clientX - start.x;
        if (!dragged && Math.abs(dx) < 6) return;
        dragged = true;
        section.dataset.dragging = "";
        const y = clamp(start.scroll - dx * 1.2, trigger.start, trigger.end);
        scrollToTarget(y, { immediate: true });
      };
      const onUp = () => {
        start = null;
        delete section.dataset.dragging;
      };
      const onClick = (event: MouseEvent) => {
        if (dragged) {
          event.preventDefault();
          event.stopPropagation();
          dragged = false;
        }
      };
      const onDragStart = (event: DragEvent) => event.preventDefault();

      // Keyboard: bring the focused item into view by scrolling the page.
      const onFocus = (event: FocusEvent) => {
        const item = (event.target as Element).closest<HTMLElement>(".work-item");
        if (!item) return;
        const padding = parseFloat(getComputedStyle(track).paddingLeft) || 0;
        const progress = clamp((item.offsetLeft - padding) / Math.max(1, distance()), 0, 1);
        scrollToTarget(trigger.start + progress * (trigger.end - trigger.start), {
          immediate: true,
        });
      };

      viewport.addEventListener("pointerdown", onDown);
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      viewport.addEventListener("click", onClick, true);
      viewport.addEventListener("dragstart", onDragStart);
      viewport.addEventListener("focusin", onFocus);

      return () => {
        viewport.removeEventListener("pointerdown", onDown);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        viewport.removeEventListener("click", onClick, true);
        viewport.removeEventListener("dragstart", onDragStart);
        viewport.removeEventListener("focusin", onFocus);
        delete section.dataset.mode;
      };
    });

    return () => mm.revert();
  }, []);

  return null;
}
