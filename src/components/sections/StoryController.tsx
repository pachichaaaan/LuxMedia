"use client";

import { useEffect } from "react";
import { home } from "@/content/site";
import { story, unreadChapter } from "@/content/story";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { scrollToTarget } from "@/lib/scroll";
import { clamp } from "@/lib/utils";

const COUNT = story.length;
/** Viewport heights of scroll per chapter while pinned. */
const SCROLL_PER_CHAPTER = 0.8;
const PARKED = 135; // yPercent: a line fully below (or above, negated) its mask
const UNREAD_INDEX = story.findIndex((chapter) => chapter.id === unreadChapter.id);
const PINNED = "(min-width: 768px) and (prefers-reduced-motion: no-preference)";
const VIEWER = "(max-width: 767.98px) and (prefers-reduced-motion: no-preference)";

type Mode = "pinned" | "viewer";

/**
 * Drives the Story. Under reduced motion it does nothing and the static list
 * stands. Otherwise it splits every chapter's text into masked lines, then
 * either pins and scrubs the section (tablet and up) or runs a tap-and-swipe
 * viewer (phones).
 */
export default function StoryController() {
  useEffect(() => {
    const section = document.getElementById("story");
    if (!section) return;

    const mm = gsap.matchMedia();
    mm.add({ pinned: PINNED, viewer: VIEWER }, (context) => {
      const { pinned, viewer } = context.conditions as { pinned: boolean; viewer: boolean };
      if (!pinned && !viewer) return;
      return setup(section, pinned ? "pinned" : "viewer");
    });
    return () => mm.revert();
  }, []);

  return null;
}

function setup(section: HTMLElement, mode: Mode) {
  const query = <T extends Element>(selector: string) => section.querySelector<T>(selector);
  const chapters = Array.from(section.querySelectorAll<HTMLElement>("[data-chapter]"));
  const visuals = chapters.map((chapter) =>
    chapter.querySelector<HTMLElement>("[data-story-visual]"),
  );
  const fills = Array.from(section.querySelectorAll<HTMLElement>("[data-segment-fill]"));
  const chrome = query<HTMLElement>(".story-chrome");
  const year = query<HTMLElement>("[data-story-year]");
  const unread = query<HTMLElement>("[data-unread]");
  const live = query<HTMLElement>("[data-story-live]");
  const prevButton = query<HTMLButtonElement>("[data-story-prev]");
  const nextButton = query<HTMLButtonElement>("[data-story-next]");
  if (!chrome || !year || !unread || !live || !prevButton || !nextButton) return;

  section.dataset.mode = mode;
  let active = -1;

  // Every chapter's title and body, split into masked lines. autoSplit re-splits
  // on resize and font load; onSplit re-parks the lines for the current state.
  const linesByChapter: Element[][][] = chapters.map(() => []);
  const splits = chapters.flatMap((chapter, index) =>
    Array.from(
      chapter.querySelectorAll<HTMLElement>("[data-chapter-title], [data-chapter-body]"),
    ).map((element, slot) =>
      SplitText.create(element, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit(self) {
          gsap.set(self.masks, { paddingBlock: "0.14em", marginBlock: "-0.14em" });
          gsap.set(self.lines, { yPercent: index === active ? 0 : PARKED });
          linesByChapter[index]![slot] = self.lines;
        },
      }),
    ),
  );
  const linesOf = (index: number) => linesByChapter[index]?.flat() ?? [];

  let announceTimer: ReturnType<typeof setTimeout> | undefined;
  let surfaceCall: gsap.core.Tween | undefined;

  const show = (index: number, immediate = false) => {
    if (index === active) return;
    const previous = active;
    active = index;
    const chapter = story[index]!;

    // Inside the frame: a hard cut, the way Stories do it.
    visuals.forEach((visual, i) => visual?.toggleAttribute("data-active", i === index));
    chrome.dataset.tone = chapter.visual.tone;
    year.textContent = chapter.year;
    unread.hidden = index !== UNREAD_INDEX;

    // Outside the frame: the background steps to this chapter's stop while the
    // text is masked out, so text only ever sits on a background it was checked against.
    const crossesInk = previous >= 0 && story[previous]!.ink !== chapter.ink;
    gsap.to(section, {
      backgroundColor: chapter.stop,
      duration: immediate ? 0 : 0.7,
      ease: "power3.inOut",
      overwrite: "auto",
    });
    surfaceCall?.kill();
    surfaceCall = gsap.delayedCall(immediate ? 0 : 0.35, () => {
      section.dataset.surface = chapter.ink === "light" ? "night" : "day";
    });

    if (previous >= 0) {
      gsap.to(linesOf(previous), {
        yPercent: -PARKED,
        duration: immediate ? 0 : 0.45,
        ease: "power3.inOut",
        stagger: 0.02,
        overwrite: true,
      });
    }
    gsap.fromTo(
      linesOf(index),
      { yPercent: PARKED },
      {
        yPercent: 0,
        duration: immediate ? 0 : 0.9,
        ease: "expo.out",
        stagger: 0.08,
        delay: immediate ? 0 : crossesInk ? 0.7 : 0.4,
        overwrite: true,
      },
    );

    if (!immediate) {
      clearTimeout(announceTimer);
      announceTimer = setTimeout(() => {
        live.textContent = home.story.announce(index + 1, COUNT, chapter.title);
      }, 300);
    }
  };

  show(0, true);
  section.dataset.ready = "";

  let go: (index: number) => void;
  const cleanups: Array<() => void> = [];

  if (mode === "pinned") {
    const setFill = fills.map((fill) => gsap.quickSetter(fill, "scaleX"));
    const apply = (progress: number) => {
      const position = progress * COUNT;
      setFill.forEach((set, i) => set(clamp(position - i, 0, 1)));
      show(Math.min(COUNT - 1, Math.floor(position)));
      if (UNREAD_INDEX >= 0) {
        const local = clamp((position - UNREAD_INDEX) * 1.5, 0, 1);
        unread.textContent = String(Math.round(unreadChapter.count * local));
      }
    };

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: () => `+=${window.innerHeight * SCROLL_PER_CHAPTER * COUNT}`,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => apply(self.progress),
      onRefresh: (self) => apply(self.progress),
    });
    apply(trigger.progress);

    go = (index) => {
      if (index < 0) return;
      const span = trigger.end - trigger.start;
      const target =
        index >= COUNT ? trigger.end + 2 : trigger.start + ((index + 0.02) / COUNT) * span;
      scrollToTarget(target, { duration: 1 });
    };
  } else {
    const counter = { value: 0 };
    const fillTo = (index: number) => {
      fills.forEach((fill, i) => {
        if (i === index) {
          gsap.fromTo(
            fill,
            { scaleX: 0 },
            { scaleX: 1, duration: 0.6, ease: "expo.out", overwrite: true },
          );
        } else {
          gsap.set(fill, { scaleX: i < index ? 1 : 0, overwrite: true });
        }
      });
    };
    fills.forEach((fill, i) => gsap.set(fill, { scaleX: i === 0 ? 1 : 0 }));

    go = (index) => {
      if (index < 0 || index >= COUNT || index === active) return;
      show(index);
      fillTo(index);
      if (index === UNREAD_INDEX) {
        gsap.fromTo(
          counter,
          { value: 0 },
          {
            value: unreadChapter.count,
            duration: 1.2,
            ease: "expo.out",
            onUpdate: () => {
              unread.textContent = String(Math.round(counter.value));
            },
          },
        );
      }
    };

    // Horizontal swipes advance; vertical movement stays page scroll.
    let start: { x: number; y: number } | null = null;
    let swiped = false;
    const stage = section.querySelector<HTMLElement>(".story-stage") ?? section;
    const onDown = (event: PointerEvent) => {
      start = { x: event.clientX, y: event.clientY };
      swiped = false;
    };
    const onUp = (event: PointerEvent) => {
      if (!start) return;
      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      start = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        swiped = true;
        go(active + (dx < 0 ? 1 : -1));
      }
    };
    const suppressSwipeClick = (event: MouseEvent) => {
      if (swiped) {
        event.stopPropagation();
        event.preventDefault();
        swiped = false;
      }
    };
    stage.addEventListener("pointerdown", onDown);
    stage.addEventListener("pointerup", onUp);
    stage.addEventListener("click", suppressSwipeClick, true);
    cleanups.push(() => {
      stage.removeEventListener("pointerdown", onDown);
      stage.removeEventListener("pointerup", onUp);
      stage.removeEventListener("click", suppressSwipeClick, true);
    });
  }

  const onPrev = () => go(active - 1);
  const onNext = () => go(active + 1);
  const onKey = (event: KeyboardEvent) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    go(active + (event.key === "ArrowRight" ? 1 : -1));
  };
  prevButton.addEventListener("click", onPrev);
  nextButton.addEventListener("click", onNext);
  section.addEventListener("keydown", onKey);

  return () => {
    prevButton.removeEventListener("click", onPrev);
    nextButton.removeEventListener("click", onNext);
    section.removeEventListener("keydown", onKey);
    cleanups.forEach((cleanup) => cleanup());
    clearTimeout(announceTimer);
    splits.forEach((split) => split.revert());
    visuals.forEach((visual) => visual?.removeAttribute("data-active"));
    delete section.dataset.mode;
    delete section.dataset.ready;
    section.dataset.surface = "night";
    section.style.backgroundColor = story[0]!.stop;
    unread.hidden = true;
  };
}
