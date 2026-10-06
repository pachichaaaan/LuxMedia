"use client";

import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { useSearchParams } from "next/navigation";
import { useLayoutEffect, useRef, type RefObject } from "react";
import { Chip } from "@/components/ui/Chip";
import { services } from "@/content/services";
import { workPage } from "@/content/site";
import { work } from "@/content/work";
import { prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { CaseLink } from "./CaseLink";

gsap.registerPlugin(Flip);

/** Deliberate placement in mixed ratios, by position in the visible list. */
const PLACEMENT = [
  "md:col-start-1 lg:col-start-1",
  "md:col-start-5 md:mt-28 lg:col-start-7 lg:mt-40",
  "md:col-start-1 lg:col-start-3",
  "md:col-start-5 md:mt-28 lg:col-start-9 lg:mt-40",
];

/**
 * Case study grid with service filters. The filter lives in `?service=`,
 * updated with the native History API so it never reloads the page, and the
 * grid rearranges with a Flip (transforms and opacity only).
 */
export function WorkIndex() {
  const params = useSearchParams();
  const requested = params.get("service") ?? "";
  const active = services.some((service) => service.slug === requested) ? requested : "";
  const gridRef = useRef<HTMLUListElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);

  const select = (slug: string) => {
    if (slug === active) return;
    if (gridRef.current && !prefersReducedMotion()) {
      flipState.current = Flip.getState(gridRef.current.querySelectorAll("[data-flip-id]"));
    }
    const url = slug ? `${window.location.pathname}?service=${slug}` : window.location.pathname;
    // Null state, as the Next docs show: Next syncs useSearchParams from it.
    window.history.replaceState(null, "", url);
  };

  useLayoutEffect(() => {
    const state = flipState.current;
    if (!state) return;
    flipState.current = null;
    const flip = Flip.from(state, {
      duration: 0.6,
      ease: "power3.inOut",
      absolute: true,
      onEnter: (elements) =>
        gsap.fromTo(elements, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power3.inOut" }),
      onLeave: (elements) => gsap.to(elements, { opacity: 0, duration: 0.4, ease: "power3.inOut" }),
    });
    return () => {
      flip.kill();
    };
  }, [active]);

  return <WorkGrid active={active} onSelect={select} gridRef={gridRef} />;
}

type WorkGridProps = {
  active: string;
  onSelect?: (slug: string) => void;
  gridRef?: RefObject<HTMLUListElement | null>;
};

/** The grid itself. Also the static render, before the URL is read. */
export function WorkGrid({ active, onSelect, gridRef }: WorkGridProps) {
  const visible = work.filter((study) => !active || study.services.includes(active));
  const select = (slug: string) => onSelect?.(slug);

  return (
    <section data-surface="night" className="pb-32">
      <div className="page-grid gap-y-5">
        <div
          role="group"
          aria-label={workPage.filterLabel}
          className="col-span-full flex flex-wrap gap-2.5"
        >
          <Chip pressed={!active} onClick={() => select("")}>
            {workPage.allLabel}
          </Chip>
          {services.map((service) => (
            <Chip
              key={service.slug}
              pressed={active === service.slug}
              onClick={() => select(service.slug)}
            >
              {service.name}
            </Chip>
          ))}
        </div>
        <p aria-live="polite" className="col-span-full text-small text-ink-meta">
          {workPage.countLabel(visible.length)}
        </p>
      </div>

      <ul ref={gridRef} className="mt-16 page-grid gap-y-16 lg:mt-24 lg:gap-y-24">
        {work.map((study) => {
          const index = visible.indexOf(study);
          return (
            <li
              key={study.slug}
              data-flip-id={study.slug}
              hidden={index < 0}
              className={cn(
                "col-span-full md:col-span-4",
                index >= 0 && PLACEMENT[index % PLACEMENT.length],
              )}
            >
              <CaseLink
                study={study}
                sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 90vw"
              />
              <p className="mt-3 text-small text-ink-meta">
                {study.services
                  .map((slug) => services.find((service) => service.slug === slug)?.name)
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </li>
          );
        })}
      </ul>

      {visible.length === 0 && (
        <div className="mt-16 page-x">
          <p className="text-body-lg text-ink-body">{workPage.empty}</p>
          <button type="button" className="mt-3 link-inline text-ink" onClick={() => select("")}>
            {workPage.emptyReset}
          </button>
        </div>
      )}
    </section>
  );
}
