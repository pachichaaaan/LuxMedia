import { TransitionLink } from "@/components/motion/TransitionLink";
import { MediaSlot } from "@/components/ui/MediaSlot";
import type { CaseStudy } from "@/content/work";
import { cn } from "@/lib/utils";

type CaseLinkProps = {
  study: CaseStudy;
  /** Optional line above the media, e.g. "Related case study". */
  eyebrow?: string;
  sizes: string;
  className?: string;
};

/** A case study as a link: cover, client, and the result it's known for. */
export function CaseLink({ study, eyebrow, sizes, className }: CaseLinkProps) {
  const narrow = study.ratio === "9:16";
  return (
    <TransitionLink
      href={`/work/${study.slug}`}
      data-cursor="View"
      className={cn("case-link group block", className)}
    >
      {eyebrow && <span className="mb-3 block text-small text-ink-meta">{eyebrow}</span>}
      <span aria-hidden className={cn("block overflow-hidden", narrow && "max-w-[16rem]")}>
        <MediaSlot {...study.cover} sizes={sizes} className="case-link-media" />
      </span>
      <span className="mt-4 block text-small text-ink-meta">{study.client}</span>
      <span className="mt-1 block text-h3 text-ink">{study.headline}</span>
    </TransitionLink>
  );
}
