import { clients, type Wordmark } from "@/content/clients";
import { home } from "@/content/site";
import { cn } from "@/lib/utils";
import { MarqueeMotion } from "./MarqueeMotion";

const STYLE: Record<Wordmark["style"], string> = {
  plain: "",
  lower: "",
  tight: "tracking-[-0.06em]",
};

function Track({ hidden }: { hidden?: boolean }) {
  return (
    <ul
      aria-hidden={hidden || undefined}
      data-marquee-track
      className={cn("marquee-track flex shrink-0 items-baseline", hidden && "marquee-clone")}
    >
      {clients.map((client) => (
        <li key={client.name} className={cn("shrink-0 pr-[0.9em] text-h2", STYLE[client.style])}>
          {client.name}
        </li>
      ))}
    </ul>
  );
}

/**
 * Fictional client wordmarks, set in the one face. The strip drifts left,
 * speeds up with scroll velocity, follows scroll direction, and pauses on
 * hover or with its own button. Reduced motion: a static wrapped row.
 */
export function Marquee() {
  return (
    <section
      id="clients"
      data-surface="day"
      aria-labelledby="clients-heading"
      className="relative overflow-clip pb-24 text-dusk"
    >
      <h2 id="clients-heading" className="sr-only">
        {home.clients.heading}
      </h2>
      <div data-marquee className="marquee flex w-max">
        <Track />
        <Track hidden />
      </div>
      <div className="mt-6 flex justify-end page-x">
        <button
          type="button"
          data-marquee-toggle
          aria-label={home.clients.pauseLabel}
          className="marquee-toggle text-small link-quiet text-ink-meta"
        >
          {home.clients.pause}
        </button>
      </div>
      <MarqueeMotion />
    </section>
  );
}
