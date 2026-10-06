import { TransitionLink } from "@/components/motion/TransitionLink";
import { Disclosure } from "@/components/ui/Disclosure";
import { MediaSlot } from "@/components/ui/MediaSlot";
import { services } from "@/content/services";
import { home } from "@/content/site";
import { ServicesHover } from "./motion-loaders";

/**
 * Not cards: a list at h2 size, separated by rules, because it is a list.
 * Desktop rows open on hover or focus while a 9:16 preview follows the
 * pointer. Below 1024px it becomes an accordion with the preview inline.
 */
export function Services() {
  return (
    <section
      id="what-we-do"
      data-surface="day"
      aria-labelledby="services-heading"
      className="relative section-y"
    >
      <div className="page-grid gap-y-6">
        <h2 id="services-heading" className="col-span-full text-h3 text-ink md:col-span-5">
          {home.services.heading}
        </h2>
        <p className="col-span-full self-end md:col-span-3 md:col-start-6 md:text-right lg:col-start-10">
          <TransitionLink href="/services" className="link-inline">
            {home.services.allLink}
          </TransitionLink>
        </p>
      </div>

      {/* Desktop: hover list. */}
      <ul data-services-list className="mt-12 hidden page-x lg:block">
        {services.map((service) => (
          <li key={service.slug} className="border-t border-rule last:border-b">
            <TransitionLink
              href={`/services#${service.slug}`}
              data-service-row={service.slug}
              className="service-row group grid py-6 outline-offset-4"
            >
              <span className="service-name text-h2 text-ink">{service.name}</span>
              <span className="service-line pt-2 text-body-lg text-ink-body">
                {service.oneLine}
              </span>
            </TransitionLink>
          </li>
        ))}
      </ul>

      <div
        aria-hidden
        data-services-preview
        className="service-preview pointer-events-none absolute top-0 left-0 z-10 hidden w-[12.5rem] lg:block"
      >
        <div className="relative aspect-[9/16] overflow-hidden rounded-frame">
          {services.map((service) => (
            <div key={service.slug} data-preview={service.slug} className="service-preview-item">
              <MediaSlot {...service.preview} fill sizes="200px" />
            </div>
          ))}
        </div>
      </div>

      {/* Below 1024px: accordion with the preview inline. */}
      <div className="mt-10 page-x lg:hidden">
        {services.map((service) => (
          <Disclosure
            key={service.slug}
            summary={service.name}
            className="border-t border-rule last:border-b"
            buttonClassName="text-h3 text-ink py-5"
            panelClassName="pb-8"
          >
            <p className="max-w-measure text-body-lg text-ink-body">{service.oneLine}</p>
            <div className="mt-6 grid grid-cols-[minmax(0,10rem)_1fr] items-end gap-5">
              <MediaSlot {...service.preview} sizes="160px" />
              <TransitionLink href={`/services#${service.slug}`} className="link-inline text-ink">
                {service.linkLabel}
              </TransitionLink>
            </div>
          </Disclosure>
        ))}
      </div>

      <ServicesHover />
    </section>
  );
}
