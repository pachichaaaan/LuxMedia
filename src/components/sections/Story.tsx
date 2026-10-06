import { brand } from "@/content/brand";
import { home } from "@/content/site";
import { story } from "@/content/story";
import { MediaSlot } from "@/components/ui/MediaSlot";
import { StoryControllerLoader } from "./StoryControllerLoader";

/**
 * The signature: the company story told as Stories. One DOM, three modes.
 * The server renders a static list (no JS, reduced motion, search engines);
 * the controller turns the same markup into a pinned, scrubbed stage on
 * tablet and desktop, or a tap-and-swipe viewer on phones.
 */
export function Story() {
  const first = story[0];

  return (
    <section
      id="story"
      data-surface="night"
      aria-labelledby="story-heading"
      className="story relative"
      style={{ backgroundColor: first?.stop }}
    >
      <h2 id="story-heading" className="sr-only">
        {home.story.heading}
      </h2>
      <p className="sr-only" aria-live="polite" data-story-live />

      <div className="story-stage">
        <div aria-hidden className="story-backplate" />

        {story.map((chapter, index) => (
          <div
            key={chapter.id}
            data-chapter={index}
            data-surface={chapter.ink === "light" ? "night" : "day"}
            className="story-chapter page-grid gap-y-6 section-y"
            style={{ backgroundColor: chapter.stop }}
          >
            <div
              data-story-visual
              className="story-visual col-span-2 row-span-3 md:col-span-2 lg:col-span-2"
            >
              <MediaSlot
                {...chapter.visual}
                sizes="(min-width: 1280px) 30vw, (min-width: 768px) 44vw, 100vw"
              />
            </div>
            <p className="story-year col-span-full text-small text-ink md:col-span-5 md:col-start-4 lg:col-span-8 lg:col-start-4">
              {chapter.year}
            </p>
            <h3
              data-chapter-title
              className="story-title col-span-full text-h1 text-ink md:col-span-5 md:col-start-4 lg:col-span-8 lg:col-start-4"
            >
              {chapter.title}
            </h3>
            <p
              data-chapter-body
              className="story-body col-span-full max-w-measure text-body-lg text-ink-body md:col-span-5 md:col-start-4 lg:col-span-6 lg:col-start-4"
            >
              {chapter.body}
            </p>
          </div>
        ))}

        <div
          className="story-chrome"
          data-tone={first?.visual.tone}
          tabIndex={-1}
          aria-label={home.story.viewerLabel}
          role="group"
        >
          <div aria-hidden className="story-segments">
            {story.map((chapter) => (
              <span key={chapter.id} className="story-segment">
                <span data-segment-fill className="story-segment-fill" />
              </span>
            ))}
          </div>
          <div aria-hidden className="story-meta text-small">
            <span className="flex items-center gap-2">
              {brand.handle}
              <span data-unread hidden className="story-unread tabular-nums">
                0
              </span>
            </span>
            <span data-story-year>{first?.year}</span>
          </div>
          <button
            type="button"
            className="story-prev"
            data-story-prev
            data-cursor="Back"
            aria-label={home.story.previous}
          />
          <button
            type="button"
            className="story-next"
            data-story-next
            data-cursor="Next"
            aria-label={home.story.next}
          />
        </div>
      </div>

      <StoryControllerLoader />
    </section>
  );
}
