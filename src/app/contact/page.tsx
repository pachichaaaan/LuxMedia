import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { contact } from "@/content/contact";

export const metadata: Metadata = {
  title: contact.meta.title,
  description: contact.meta.description,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <PageHeader title={contact.headline} intro={contact.intro} surface="day" />;
}
