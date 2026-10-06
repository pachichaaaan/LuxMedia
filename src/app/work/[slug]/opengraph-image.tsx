import { brand } from "@/content/brand";
import { getCaseStudy, work } from "@/content/work";
import { OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = `A case study from ${brand.name}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return work.map(({ slug }) => ({ slug }));
}

export default async function CaseStudyImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  return renderOgImage({
    kicker: study?.client ?? brand.name,
    headline: study?.headline ?? brand.tagline,
    footer: brand.name,
  });
}
