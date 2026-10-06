import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { MediaSlot } from "@/components/ui/MediaSlot";
import type { Ratio } from "@/content/types";
import { services } from "@/content/services";
import { caseStudyPage } from "@/content/site";
import { getTestimonial } from "@/content/testimonials";
import { getCaseStudy, getNextCaseStudy, work } from "@/content/work";
import { cn } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return work.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  const title = `${study.client}: ${study.headline.replace(/\.$/, "")}`;
  return {
    title,
    description: study.summary,
    alternates: { canonical: `/work/${study.slug}` },
    openGraph: { title, description: study.summary, type: "article" },
  };
}

/** Gallery widths by ratio, so the feed-native shapes keep their rhythm. */
const GALLERY: Record<Ratio, string> = {
  "9:16": "w-[70%] md:w-[calc(25%-1.5rem)]",
  "4:5": "w-full md:w-[calc(33.333%-1.5rem)]",
  "1:1": "w-full md:w-[calc(33.333%-1.5rem)]",
  "16:9": "w-full md:w-[calc(58%-1.5rem)]",
};

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const next = getNextCaseStudy(study.slug);
  const quote = getTestimonial(study.testimonial);
  const serviceNames = study.services
    .map((serviceSlug) => services.find((service) => service.slug === serviceSlug)?.name)
    .filter(Boolean)
    .join(", ");

  return (
    <>
      <header
        data-surface="night"
        className="page-grid gap-y-12 pt-[calc(var(--nav-height)+5rem)] pb-20 lg:pt-[calc(var(--nav-height)+8rem)] lg:pb-28"
      >
        <div className="col-span-full flex flex-col gap-8 md:col-span-5 lg:col-span-8">
          <p className="text-body-lg text-ink-meta">{study.client}</p>
          <h1 data-page-title className="text-h1 text-ink">
            {study.headline}
          </h1>
          <dl className="grid gap-6 text-small sm:grid-cols-3">
            <div>
              <dt className="text-ink-meta">{caseStudyPage.servicesLabel}</dt>
              <dd className="mt-1 text-ink">{serviceNames}</dd>
            </div>
            <div>
              <dt className="text-ink-meta">{caseStudyPage.yearLabel}</dt>
              <dd className="mt-1 text-ink">{study.year}</dd>
            </div>
            <div>
              <dt className="text-ink-meta">{caseStudyPage.platformsLabel}</dt>
              <dd className="mt-1 text-ink">{study.platforms.join(", ")}</dd>
            </div>
          </dl>
        </div>
        <div
          className={cn(
            "col-span-3 md:col-start-6 lg:col-start-10 lg:self-end",
            study.ratio === "9:16" ? "md:col-span-2 lg:col-span-3" : "md:col-span-3 lg:col-span-3",
          )}
        >
          <MediaSlot
            {...study.cover}
            eager
            sizes="(min-width: 1024px) 24vw, (min-width: 768px) 36vw, 75vw"
          />
        </div>
      </header>

      <section data-surface="day" className="section-y">
        {[
          { heading: caseStudyPage.challengeHeading, paragraphs: study.challenge },
          { heading: caseStudyPage.approachHeading, paragraphs: study.approach },
        ].map((block, index) => (
          <div
            key={block.heading}
            className={cn("page-grid gap-y-6", index > 0 && "mt-20 lg:mt-28")}
          >
            <h2 className="col-span-full text-h3 text-ink md:col-span-2 lg:col-span-3">
              {block.heading}
            </h2>
            <div className="col-span-full max-w-measure space-y-5 text-body-lg text-ink-body md:col-span-6 md:col-start-3 lg:col-span-6 lg:col-start-5">
              {block.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section data-surface="night" aria-labelledby="the-work" className="section-y">
        <h2 id="the-work" className="page-x text-h2 text-ink">
          {caseStudyPage.workHeading}
        </h2>
        <ul className="mt-14 flex flex-wrap items-end gap-6 page-x md:gap-x-6 md:gap-y-12">
          {study.gallery.map((visual) => (
            <li key={visual.id} className={GALLERY[visual.ratio]}>
              <MediaSlot {...visual} sizes="(min-width: 768px) 40vw, 90vw" />
            </li>
          ))}
        </ul>
      </section>

      <section
        data-surface="day"
        aria-labelledby="results"
        className="page-grid gap-y-12 section-y"
      >
        <h2 id="results" className="col-span-full text-h2 text-ink">
          {caseStudyPage.resultsHeading}
        </h2>
        <ul className="col-span-full grid gap-12 md:grid-cols-3 md:gap-(--gutter)">
          {study.results.map((metric) => (
            <li key={metric.label} className="border-t border-rule pt-6">
              <p className="text-h1 text-ink tabular-nums">{metric.value}</p>
              <p className="mt-4 max-w-[24ch] text-body-lg text-ink-body">{metric.label}</p>
            </li>
          ))}
        </ul>
      </section>

      {quote && (
        <section data-surface="haze" className="page-grid section-y">
          <figure className="col-span-full lg:col-span-10">
            <blockquote className="text-h2 text-ink">
              <p>“{quote.quote}”</p>
            </blockquote>
            <figcaption className="mt-8">
              <span className="block text-ink">{quote.name}</span>
              <span className="block text-small text-ink-meta">{quote.role}</span>
            </figcaption>
          </figure>
        </section>
      )}

      <section data-surface="night" aria-label={caseStudyPage.nextLabel}>
        <TransitionLink
          href={`/work/${next.slug}`}
          data-cursor="View"
          className="next-case page-grid gap-y-6 py-24 lg:py-36"
        >
          <span className="col-span-full flex flex-col gap-4 md:col-span-5 lg:col-span-8">
            <span className="text-small text-ink-meta">{caseStudyPage.nextLabel}</span>
            <span className="text-body-lg text-ink-meta">{next.client}</span>
            <span className="text-h1 text-ink">{next.headline}</span>
          </span>
          <span
            aria-hidden
            className="next-case-preview col-span-2 md:col-span-2 md:col-start-7 lg:col-span-3 lg:col-start-10"
          >
            <MediaSlot {...next.cover} sizes="(min-width: 1024px) 22vw, 40vw" />
          </span>
        </TransitionLink>
      </section>
    </>
  );
}
