import type { Metadata } from "next";
import { Process } from "@/components/sections/Process";
import { Disclosure } from "@/components/ui/Disclosure";
import { PageHeader } from "@/components/ui/PageHeader";
import { CaseLink } from "@/components/work/CaseLink";
import { faq } from "@/content/faq";
import { services } from "@/content/services";
import { servicesPage } from "@/content/site";
import { getCaseStudy } from "@/content/work";

export const metadata: Metadata = {
  title: servicesPage.meta.title,
  description: servicesPage.meta.description,
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader title={servicesPage.headline} intro={servicesPage.intro}>
        <nav aria-label={servicesPage.jumpLabel} className="col-span-full mt-6">
          <ul className="flex flex-wrap gap-x-7 gap-y-3">
            {services.map((service) => (
              <li key={service.slug}>
                <a href={`#${service.slug}`} className="link-inline text-ink">
                  {service.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHeader>

      <div data-surface="day">
        {services.map((service) => {
          const related = getCaseStudy(service.relatedCase);
          return (
            <section
              key={service.slug}
              id={service.slug}
              aria-labelledby={`${service.slug}-title`}
              className="page-grid gap-y-10 pb-20 lg:pb-28"
            >
              <div aria-hidden className="col-span-full border-t border-rule pb-6 lg:pb-12" />
              <h2
                id={`${service.slug}-title`}
                className="col-span-full text-h1 text-ink lg:col-span-8"
              >
                {service.name}
              </h2>
              <p className="col-span-full max-w-measure text-body-lg text-ink-body md:col-span-6 lg:col-span-6">
                {service.description}
              </p>

              {related && (
                <CaseLink
                  study={related}
                  eyebrow={servicesPage.relatedLabel}
                  sizes="(min-width: 1024px) 22vw, (min-width: 768px) 25vw, 60vw"
                  className="col-span-3 md:col-span-2 md:col-start-7 lg:col-span-3 lg:col-start-10 lg:row-span-3 lg:row-start-2"
                />
              )}

              <div className="col-span-full md:col-span-4 lg:col-span-4">
                <h3 className="text-small text-ink-meta">{servicesPage.includedLabel}</h3>
                <ul className="mt-4">
                  {service.included.map((item) => (
                    <li
                      key={item}
                      className="border-t border-rule py-3 text-ink-body last:border-b"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-span-full md:col-span-4 lg:col-span-4">
                <h3 className="text-small text-ink-meta">{servicesPage.outcomesLabel}</h3>
                <ul className="mt-4">
                  {service.outcomes.map((item) => (
                    <li
                      key={item}
                      className="border-t border-rule py-3 text-ink-body last:border-b"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          );
        })}
      </div>

      <Process heading={servicesPage.processHeading} id="services-process" />

      <section
        data-surface="day"
        aria-labelledby="faq-heading"
        className="page-grid gap-y-10 section-y"
      >
        <h2 id="faq-heading" className="col-span-full text-h2 text-ink lg:col-span-4">
          {servicesPage.faqHeading}
        </h2>
        <div className="col-span-full lg:col-span-7 lg:col-start-6">
          {faq.map((item) => (
            <Disclosure
              key={item.id}
              summary={item.question}
              className="border-t border-rule last:border-b"
              buttonClassName="text-h3 text-ink py-6"
              panelClassName="pb-8"
            >
              <p className="max-w-measure text-body-lg text-ink-body">{item.answer}</p>
            </Disclosure>
          ))}
        </div>
      </section>
    </>
  );
}
