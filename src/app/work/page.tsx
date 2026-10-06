import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { WorkGrid, WorkIndex } from "@/components/work/WorkIndex";
import { workPage } from "@/content/site";

export const metadata: Metadata = {
  title: workPage.meta.title,
  description: workPage.meta.description,
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <>
      <PageHeader title={workPage.headline} className="pb-10 lg:pb-14" />
      {/* The filter reads the URL on the client; the static render shows all work. */}
      <Suspense fallback={<WorkGrid active="" />}>
        <WorkIndex />
      </Suspense>
    </>
  );
}
