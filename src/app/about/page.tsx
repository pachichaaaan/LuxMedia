import type { Metadata } from "next";
import { LocalTime } from "@/components/ui/LocalTime";
import { MediaSlot } from "@/components/ui/MediaSlot";
import { PageHeader } from "@/components/ui/PageHeader";
import { brand } from "@/content/brand";
import { about } from "@/content/site";
import { story } from "@/content/story";
import { team } from "@/content/team";
import { aboutHeadline } from "@/lib/copy";

export const metadata: Metadata = {
  title: about.meta.title,
  description: about.meta.description,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHeader title={aboutHeadline()} intro={about.intro} size="display" />

      {/* The long version of the Story, quietly: years down the left. */}
      <section data-surface="day" aria-labelledby="about-story" className="section-y">
        <h2 id="about-story" className="page-x text-h2 text-ink">
          {about.storyHeading}
        </h2>
        <ol className="mt-16 space-y-20 lg:mt-24 lg:space-y-28">
          {story.map((chapter) => (
            <li key={chapter.id} className="page-grid gap-y-5">
              <p className="col-span-full text-h3 text-dusk tabular-nums md:col-span-2">
                {chapter.year}
              </p>
              <div className="col-span-full md:col-span-5 md:col-start-3 lg:col-span-6 lg:col-start-4">
                <h3 className="text-h3 text-ink">{chapter.title}</h3>
                <div className="mt-5 max-w-measure space-y-4 text-ink-body">
                  {chapter.long.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
              <div className="hidden lg:col-span-2 lg:col-start-11 lg:block">
                <MediaSlot {...chapter.visual} sizes="12vw" />
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section
        data-surface="haze"
        aria-labelledby="about-values"
        className="page-grid gap-y-12 section-y"
      >
        <h2 id="about-values" className="col-span-full text-h3 text-ink lg:col-span-4">
          {about.valuesHeading}
        </h2>
        <ul className="col-span-full lg:col-span-8 lg:col-start-5">
          {about.values.map((value) => (
            <li key={value} className="border-t border-rule py-8 text-h2 text-ink last:border-b">
              {value}
            </li>
          ))}
        </ul>
      </section>

      <section data-surface="day" aria-labelledby="about-team" className="section-y">
        <h2 id="about-team" className="page-x text-h2 text-ink">
          {about.teamHeading}
        </h2>
        <ul className="mt-14 page-grid gap-y-12">
          {team.map((member) => (
            <li key={member.id} className="team-card col-span-2 md:col-span-2 lg:col-span-3">
              <MediaSlot {...member.portrait} sizes="(min-width: 1024px) 22vw, 45vw" />
              <p className="mt-4 text-ink">{member.name}</p>
              <p className="team-meta relative text-small text-ink-meta">
                <span className="team-role">{member.role}</span>
                <LocalTime timeZone={member.timezone} city={member.city} className="team-time" />
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section
        data-surface="night"
        aria-labelledby="about-careers"
        className="page-grid gap-y-8 section-y"
      >
        <h2 id="about-careers" className="col-span-full text-h1 text-ink lg:col-span-9">
          {about.careers.heading}
        </h2>
        <p className="col-span-full max-w-measure text-body-lg text-ink-body md:col-span-6">
          {about.careers.body}
        </p>
        <p className="col-span-full">
          <a
            href={`mailto:${brand.email}?subject=${encodeURIComponent(about.careers.subject)}`}
            className="text-body-lg link-inline text-ink"
          >
            {about.careers.link}
          </a>
        </p>
      </section>
    </>
  );
}
