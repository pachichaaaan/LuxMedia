import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { privacy } from "@/content/legal";

export const metadata: Metadata = {
  title: privacy.meta.title,
  description: privacy.meta.description,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeader title={privacy.headline} intro={privacy.intro} surface="day">
        <p className="col-span-full text-small text-ink-meta">{privacy.updated}</p>
      </PageHeader>
      <div data-surface="day" className="page-grid pb-32">
        <div className="col-span-full max-w-measure space-y-14 md:col-span-6 lg:col-span-7">
          {privacy.sections.map((section) => (
            <section key={section.heading} className="space-y-4">
              <h2 className="text-h3 text-ink">{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-ink-body">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
