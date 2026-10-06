import { brand } from "@/content/brand";
import { home } from "@/content/site";
import { Clock } from "@/components/ui/Clock";
import { LiveDot } from "@/components/ui/LiveDot";
import { MediaSlot } from "@/components/ui/MediaSlot";
import { HeroMotion } from "./HeroMotion";

/** Home hero: the tagline as the thesis, a live feed frame, and the HQ clock. */
export function Hero() {
  const posts = home.hero.feed;
  // The first post repeats at the end so the feed can loop without a jump.
  const track = [...posts, ...posts.slice(0, 1)];

  return (
    <section
      id="hero"
      data-surface="night"
      aria-labelledby="hero-title"
      className="relative page-grid gap-y-10 pt-[calc(var(--nav-height)+3rem)] pb-10 md:grid-rows-[1fr_auto] lg:min-h-svh lg:gap-y-8 lg:pt-[calc(var(--nav-height)+4rem)]"
    >
      <h1
        id="hero-title"
        data-hero-title
        className="col-span-full self-start text-display text-ink md:col-span-6 lg:col-span-9"
      >
        {brand.tagline}
      </h1>

      <div
        data-hero-frame
        className="col-span-2 col-start-3 self-start md:col-span-2 md:col-start-7 lg:col-span-3 lg:col-start-10"
      >
        <div
          id="hero-feed"
          role="group"
          aria-label={home.hero.feedLabel}
          data-feed
          className="relative aspect-[9/16] overflow-hidden rounded-frame"
        >
          <div data-feed-track className="absolute inset-0 flex flex-col">
            {track.map((post, index) => {
              const isClone = index === posts.length;
              return (
                <div
                  key={`${post.visual.id}-${index}`}
                  aria-hidden={isClone || undefined}
                  data-hero-media={index === 0 || undefined}
                  className={`relative h-full w-full shrink-0 media-tone-${post.visual.tone}`}
                >
                  <MediaSlot
                    {...post.visual}
                    fill
                    eager={index === 0}
                    sizes="(min-width: 1024px) 22vw, (min-width: 768px) 25vw, 45vw"
                  />
                  <p className="absolute top-4 left-4 text-small">{post.handle}</p>
                  <p className="absolute right-4 bottom-4 left-4 text-small">{post.caption}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <p className="col-span-full max-w-[30ch] self-end text-body-lg text-ink-body md:col-span-5 md:row-start-2">
        {brand.descriptor}
      </p>

      <div className="col-span-full flex flex-wrap items-center gap-x-3 gap-y-2 self-end text-small text-ink md:col-span-3 md:col-start-6 md:row-start-2 md:justify-end lg:col-span-3 lg:col-start-10 lg:justify-start">
        <LiveDot />
        <span>{home.hero.live}</span>
        <Clock className="text-ink-meta" />
        <button
          type="button"
          data-feed-toggle
          className="feed-toggle ml-auto link-quiet text-ink-meta md:ml-3"
          aria-controls="hero-feed"
        >
          {home.hero.pause}
        </button>
      </div>

      <HeroMotion />
    </section>
  );
}
