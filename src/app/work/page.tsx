import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { workPage } from "@/content/site";

export const metadata: Metadata = {
  title: workPage.meta.title,
  description: workPage.meta.description,
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return <PageHeader title={workPage.headline} />;
}
