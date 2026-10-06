import { TransitionLink } from "@/components/motion/TransitionLink";
import { MediaSlot } from "@/components/ui/MediaSlot";
import { home } from "@/content/site";
import { work } from "@/content/work";
import { WorkRailLoader } from "./WorkRailLoader";

/**
 * Selected work as a feed you browse sideways. Desktop: pinned and scrubbed
 * by vertical scroll, draggable, with a WebGL hover. Phones: native swipe
 * with scroll-snap. Reduced motion: a static grid.
 */
export function WorkRail() {
  return (
    <section id="work" data-surface="night" aria-labelledby="work-heading" className="work-rail">
      <div className="work-stage">
        <div className="page-grid pt-24 pb-10 lg:pt-[calc(var(--nav-height)+2.5rem)]">
          <h2 id="work-heading" className="col-span-full text-h2 text-ink lg:col-span-8">
            {home.work.heading}
          </h2>
        </div>

        <div data-work-viewport data-cursor="Drag" className="work-viewport">
          <ul data-work-track className="work-track">
            {work.map((study) => (
              <li key={study.slug} className="work-item" data-ratio={study.ratio}>
                <TransitionLink
                  href={`/work/${study.slug}`}
                  data-cursor="View"
                  draggable={false}
                  className="work-link block"
                >
                  <div className="work-media-row">
                    <div
                      aria-hidden
                      data-work-media
                      data-ratio={study.ratio}
                      className="work-media"
                    >
                      <MediaSlot {...study.cover} sizes="(min-width: 1024px) 34svh, 74vw" />
                    </div>
                  </div>
                  <p className="mt-5 text-small text-ink-meta">{study.client}</p>
                  <p className="mt-1 text-h3 text-ink">{study.headline}</p>
                </TransitionLink>
              </li>
            ))}
            <li className="work-item work-item-end">
              <div className="work-media-row">
                <TransitionLink href="/work" className="text-h1 link-quiet text-ink">
                  {home.work.allLink}
                </TransitionLink>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <WorkRailLoader />
    </section>
  );
}
