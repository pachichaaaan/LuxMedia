import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { servicesPage } from "@/content/site";

export const metadata: Metadata = {
  title: servicesPage.meta.title,
  description: servicesPage.meta.description,
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return <PageHeader title={servicesPage.headline} intro={servicesPage.intro} />;
}
