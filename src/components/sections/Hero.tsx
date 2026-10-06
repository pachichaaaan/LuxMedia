import { brand } from "@/content/brand";
import { home } from "@/content/site";
import { Clock } from "@/components/ui/Clock";
import { LiveDot } from "@/components/ui/LiveDot";
import { MediaSlot } from "@/components/ui/MediaSlot";

/** Home hero: the tagline as the thesis, a live feed frame, and the HQ clock. */
export function Hero() {
  const [first] = home.hero.feed;

  return (
    <section
      data-surface="night"
      aria-labelledby="hero-title"
      className="relative page-grid gap-y-12 pt-[calc(var(--nav-height)+3rem)] pb-10 lg:min-h-svh lg:grid-rows-[1fr_auto] lg:gap-y-8 lg:pt-[calc(var(--nav-height)+4rem)]"
    >
      <h1
        id="hero-title"
        data-hero-title
        className="col-span-full self-start text-display text-ink md:col-span-6 lg:col-span-9"
      >
        {brand.tagline}
      </h1>

      <div className="col-span-2 col-start-3 md:col-span-2 md:col-start-7 lg:col-span-3 lg:col-start-10 lg:row-span-2 lg:self-start">
        <div
          role="group"
          aria-label={home.hero.feedLabel}
          className="relative aspect-[9/16] overflow-hidden rounded-frame"
        >
          {first && (
            <div className={`absolute inset-0 media-tone-${first.visual.tone}`}>
              <MediaSlot {...first.visual} fill sizes="(min-width: 1024px) 22vw, 45vw" />
              <p className="absolute top-4 left-4 text-small">{first.handle}</p>
              <p className="absolute right-4 bottom-4 left-4 text-small">{first.caption}</p>
            </div>
          )}
        </div>
      </div>

      <p className="col-span-full max-w-[30ch] self-end text-body-lg text-ink-body md:col-span-5 lg:col-span-5 lg:row-start-2">
        {brand.descriptor}
      </p>

      <p className="col-span-full flex items-center gap-3 self-end text-small text-ink md:col-span-3 md:col-start-6 md:justify-end lg:col-span-3 lg:col-start-6 lg:row-start-2">
        <LiveDot />
        <span>{home.hero.live}</span>
        <Clock className="text-ink-meta" />
      </p>
    </section>
  );
}
