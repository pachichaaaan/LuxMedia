"use client";

import { useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { FINE_POINTER, REDUCED_MOTION } from "@/lib/motion";

/**
 * One 9:16 preview for the whole services list. It follows the pointer
 * (lerped) and hard-cuts its content between rows. On keyboard focus it sits
 * beside the focused row instead.
 */
export function ServicesHover() {
  useEffect(() => {
    const section = document.getElementById("what-we-do");
    const list = section?.querySelector<HTMLElement>("[data-services-list]");
    const preview = section?.querySelector<HTMLElement>("[data-services-preview]");
    if (!section || !list || !preview) return;

    const items = Array.from(preview.querySelectorAll<HTMLElement>("[data-preview]"));
    const reduced = window.matchMedia(REDUCED_MOTION).matches;
    const fine = window.matchMedia(FINE_POINTER).matches;
    const xTo = gsap.quickTo(preview, "x", { duration: reduced ? 0 : 0.5, ease: "expo.out" });
    const yTo = gsap.quickTo(preview, "y", { duration: reduced ? 0 : 0.5, ease: "expo.out" });
    let current = "";

    const showFor = (slug: string) => {
      if (slug === current) return;
      current = slug;
      items.forEach((item) => item.toggleAttribute("data-active", item.dataset.preview === slug));
      preview.dataset.visible = slug ? "true" : "false";
    };

    // Follows the pointer vertically; horizontally it only drifts within the
    // right third of the list, so it never sits on the type it's previewing.
    const place = (x: number, y: number, immediate = false) => {
      const bounds = section.getBoundingClientRect();
      const anchor = bounds.width * 0.74;
      const drift = (x - bounds.left - anchor) * 0.12;
      const left = Math.min(anchor + drift, bounds.width - preview.offsetWidth - 32);
      const top = y - bounds.top - preview.offsetHeight / 2;
      if (immediate) {
        gsap.set(preview, { x: left, y: top });
      } else {
        xTo(left);
        yTo(top);
      }
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !fine) return;
      const row = (event.target as Element).closest<HTMLElement>("[data-service-row]");
      if (!row) return;
      if (!current) place(event.clientX, event.clientY, true);
      showFor(row.dataset.serviceRow ?? "");
      place(event.clientX, event.clientY);
    };
    const onLeave = () => showFor("");

    const onFocus = (event: FocusEvent) => {
      const row = (event.target as Element).closest<HTMLElement>("[data-service-row]");
      if (!row || !row.matches(":focus-visible")) return;
      const rect = row.getBoundingClientRect();
      place(rect.right, rect.top + rect.height / 2, true);
      showFor(row.dataset.serviceRow ?? "");
    };
    const onBlur = (event: FocusEvent) => {
      if (!list.contains(event.relatedTarget as Node | null)) showFor("");
    };

    list.addEventListener("pointermove", onMove);
    list.addEventListener("pointerleave", onLeave);
    list.addEventListener("focusin", onFocus);
    list.addEventListener("focusout", onBlur);
    return () => {
      list.removeEventListener("pointermove", onMove);
      list.removeEventListener("pointerleave", onLeave);
      list.removeEventListener("focusin", onFocus);
      list.removeEventListener("focusout", onBlur);
    };
  }, []);

  return null;
}
