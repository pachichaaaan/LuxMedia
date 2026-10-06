import { home } from "@/content/site";
import { testimonials, threadAuthor, type Testimonial } from "@/content/testimonials";
import { initials } from "@/lib/utils";

function Avatar({ name, tone }: { name: string; tone: "haze" | "lilac" | "midnight" }) {
  return (
    <span
      aria-hidden
      className={`grid size-11 shrink-0 place-items-center text-small media-tone-${tone}`}
    >
      {initials(name)}
    </span>
  );
}

function Comment({ testimonial }: { testimonial: Testimonial }) {
  return (
    <li className="flex gap-4 md:gap-5">
      <Avatar name={testimonial.name} tone="haze" />
      <figure className="min-w-0 flex-1">
        <figcaption>
          <p className="flex flex-wrap items-baseline gap-x-3">
            <span className="text-ink">{testimonial.name}</span>
            <span className="text-small text-ink-meta">{testimonial.posted}</span>
          </p>
          <p className="text-small text-ink-meta">{testimonial.role}</p>
        </figcaption>
        <blockquote className="mt-3 max-w-measure text-body-lg text-ink-body">
          <p>{testimonial.quote}</p>
        </blockquote>
        <p className="mt-3 text-small text-ink-meta">{home.comments.likes(testimonial.likes)}</p>

        {testimonial.reply && (
          <ul aria-label={home.comments.replyLabel} className="mt-6 border-l border-rule pl-5">
            <li className="flex gap-4">
              <Avatar name={threadAuthor.name} tone="midnight" />
              <div className="min-w-0">
                <p className="flex flex-wrap items-baseline gap-x-3">
                  <span className="text-ink">{threadAuthor.name}</span>
                  <span className="text-small text-ink-meta">{testimonial.reply.posted}</span>
                </p>
                <p className="mt-1 text-body-lg text-ink-body">{testimonial.reply.text}</p>
                <p className="mt-2 text-small text-ink-meta">
                  {home.comments.likes(testimonial.reply.likes)}
                </p>
              </div>
            </li>
          </ul>
        )}
      </figure>
    </li>
  );
}

/** Testimonials as a comment thread: an original layout, no platform's UI. Static. */
export function Comments() {
  const thread = testimonials.filter((testimonial) => testimonial.inThread);

  return (
    <section
      data-surface="day"
      aria-labelledby="comments-heading"
      className="page-grid gap-y-12 section-y"
    >
      <h2
        id="comments-heading"
        className="col-span-full self-start text-h2 text-ink md:col-span-3 lg:sticky lg:top-24 lg:col-span-4"
      >
        {home.comments.heading}
      </h2>
      <ul className="col-span-full space-y-12 md:col-span-5 md:col-start-4 lg:col-span-7 lg:col-start-6">
        {thread.map((testimonial) => (
          <Comment key={testimonial.id} testimonial={testimonial} />
        ))}
      </ul>
    </section>
  );
}
