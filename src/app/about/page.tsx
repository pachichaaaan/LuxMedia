import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { about } from "@/content/site";
import { aboutHeadline } from "@/lib/copy";

export const metadata: Metadata = {
  title: about.meta.title,
  description: about.meta.description,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return <PageHeader title={aboutHeadline()} intro={about.intro} size="display" />;
}
