import type { Metadata } from "next";
import { ContactPanel } from "@/components/contact/ContactPanel";
import { brand } from "@/content/brand";
import { contact } from "@/content/contact";

export const metadata: Metadata = {
  title: contact.meta.title,
  description: contact.meta.description,
  alternates: { canonical: "/contact" },
};

/** The desk: day surface, headline left, form right. */
export default function ContactPage() {
  return (
    <section
      data-surface="day"
      aria-labelledby="contact-title"
      className="page-grid gap-y-14 pt-[calc(var(--nav-height)+5rem)] pb-32 lg:pt-[calc(var(--nav-height)+8rem)]"
    >
      <div className="col-span-full md:col-span-8 lg:col-span-5">
        <div className="lg:sticky lg:top-28">
          <h1 id="contact-title" data-page-title className="text-h1 text-ink">
            {contact.headline}
          </h1>
          <p className="mt-8 max-w-[32ch] text-body-lg text-ink-body">{contact.intro}</p>
          <p className="mt-8 text-small text-ink-meta">{contact.emailLead}</p>
          <a href={`mailto:${brand.email}`} className="mt-1 inline-block link-inline text-ink">
            {brand.email}
          </a>
        </div>
      </div>
      <div className="col-span-full md:col-span-8 lg:col-span-6 lg:col-start-7">
        <ContactPanel />
      </div>
    </section>
  );
}
